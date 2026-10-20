import dns from "dns/promises";
import net from "net";
import crypto from "crypto";

export interface WebhookDeliveryResult {
  destinationUrl: string;
  success: boolean;
  httpStatus?: number;
  latencyMs: number;
  attempts: number;
  error?: string;
  deliveredAt: string;
}

export interface WebhookPayload {
  eventId: string;
  eventType: "INCIDENT_CREATED" | "INCIDENT_ESCALATED" | "POLICY_ENFORCED" | "POLICY_ROLLEDBACK" | "HEALTH_ALERT";
  timestamp: string;
  organizationId: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  summary: string;
  assetDomain: string;
  metricSnapshot?: {
    peakRps?: number;
    volumeGb?: number;
    attackVector?: string;
  };
}

export class WebhookDispatcher {
  /**
   * Helper to parse an IPv4 string into a 32-bit integer for fast CIDR checking.
   */
  private static ipToNumber(ip: string): number {
    return ip
      .split(".")
      .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
  }

  /**
   * Evaluates if an IPv4 address falls within a given CIDR block.
   */
  private static isIpInCidr(ip: string, cidr: string): boolean {
    const [range, bitsStr] = cidr.split("/");
    const bits = parseInt(bitsStr, 10);
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    const ipNum = this.ipToNumber(ip);
    const rangeNum = this.ipToNumber(range);
    return (ipNum & mask) === (rangeNum & mask);
  }

  /**
   * Validates whether an IP address is a private, loopback, link-local,
   * carrier-grade NAT, or cloud metadata address.
   */
  public static isRestrictedIp(ip: string): boolean {
    const version = net.isIP(ip);
    if (!version) return true; // Invalid IP is restricted

    if (version === 4) {
      const restrictedCidrs = [
        "0.0.0.0/8", // Current network
        "10.0.0.0/8", // RFC 1918 Private
        "100.64.0.0/10", // Carrier-grade NAT
        "127.0.0.0/8", // Loopback
        "169.254.0.0/16", // Link-local & AWS/GCP/Azure Metadata (169.254.169.254)
        "172.16.0.0/12", // RFC 1918 Private
        "192.0.0.0/24", // IETF Protocol assignments
        "192.0.2.0/24", // TEST-NET-1
        "192.168.0.0/16", // RFC 1918 Private
        "198.18.0.0/15", // Benchmark testing
        "198.51.100.0/24", // TEST-NET-2
        "203.0.113.0/24", // TEST-NET-3
        "224.0.0.0/4", // Multicast
        "240.0.0.0/4", // Reserved
        "255.255.255.255/32", // Broadcast
      ];

      for (const cidr of restrictedCidrs) {
        if (this.isIpInCidr(ip, cidr)) return true;
      }
      return false;
    }

    if (version === 6) {
      const normalized = ip.toLowerCase();
      if (normalized === "::1" || normalized === "::") return true;
      if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // Unique Local
      if (normalized.startsWith("fe80")) return true; // Link-local
      if (normalized.startsWith("ff")) return true; // Multicast
      if (normalized.startsWith("2001:db8")) return true; // Documentation
      return false;
    }

    return true;
  }

  /**
   * Validates target URL against SSRF vulnerabilities:
   * 1. Protocol must be http or https
   * 2. Hostname cannot be a metadata service name
   * 3. Resolves DNS and verifies every resolved IP is public and non-internal
   */
  public static async validateDestinationUrl(targetUrl: string): Promise<{ safe: boolean; error?: string; resolvedIps?: string[] }> {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return { safe: false, error: "Invalid URL format." };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { safe: false, error: `Disallowed protocol: '${parsed.protocol}'. Only HTTP(S) permitted.` };
    }

    // Block cloud metadata hostnames
    const blockedHostnames = [
      "metadata.google.internal",
      "metadata",
      "instance-data",
      "localhost",
    ];
    if (blockedHostnames.includes(parsed.hostname.toLowerCase())) {
      return { safe: false, error: `Destination host '${parsed.hostname}' is a forbidden cloud metadata or internal endpoint.` };
    }

    // If host is directly an IP, check it
    if (net.isIP(parsed.hostname)) {
      if (this.isRestrictedIp(parsed.hostname)) {
        return { safe: false, error: `Direct IP destination '${parsed.hostname}' belongs to a private/reserved/metadata network.` };
      }
      return { safe: true, resolvedIps: [parsed.hostname] };
    }

    // Resolve DNS records to identify any private addresses
    try {
      const resolved = await dns.lookup(parsed.hostname, { all: true });
      if (!resolved || resolved.length === 0) {
        return { safe: false, error: `DNS resolution returned no records for host '${parsed.hostname}'.` };
      }

      const ips = resolved.map((r) => r.address);
      for (const ip of ips) {
        if (this.isRestrictedIp(ip)) {
          return {
            safe: false,
            error: `Host '${parsed.hostname}' resolves to restricted internal/metadata IP '${ip}'. SSRF access denied.`,
          };
        }
      }

      return { safe: true, resolvedIps: ips };
    } catch (dnsErr: any) {
      return { safe: false, error: `DNS resolution failed for '${parsed.hostname}': ${dnsErr.message}` };
    }
  }

  /**
   * Sanitizes payload to ensure credentials, tokens, or personal identifiers
   * are never broadcast across external webhooks.
   */
  public static sanitizePayload(payload: WebhookPayload): WebhookPayload {
    return {
      eventId: payload.eventId,
      eventType: payload.eventType,
      timestamp: payload.timestamp || new Date().toISOString(),
      organizationId: payload.organizationId,
      severity: payload.severity,
      title: payload.title.replace(/[\r\n]/g, " ").substring(0, 150),
      summary: payload.summary.replace(/[\r\n]/g, " ").substring(0, 500),
      assetDomain: payload.assetDomain,
      metricSnapshot: payload.metricSnapshot
        ? {
            peakRps: payload.metricSnapshot.peakRps,
            volumeGb: payload.metricSnapshot.volumeGb,
            attackVector: payload.metricSnapshot.attackVector,
          }
        : undefined,
    };
  }

  /**
   * Dispatches a signed webhook with SSRF protection, bounded timeouts,
   * safe redirect verification, and delivery logging.
   */
  public static async dispatch(
    destinationUrl: string,
    payload: WebhookPayload,
    signingSecret: string = "default-shield-webhook-secret",
    maxRedirects: number = 3
  ): Promise<WebhookDeliveryResult> {
    const startTime = Date.now();
    let currentUrl = destinationUrl;
    let attempts = 0;
    const sanitized = this.sanitizePayload(payload);
    const bodyString = JSON.stringify(sanitized);

    // Bounded redirect loop with SSRF checking on every hop
    for (let hop = 0; hop <= maxRedirects; hop++) {
      attempts++;
      const validation = await this.validateDestinationUrl(currentUrl);
      if (!validation.safe) {
        return {
          destinationUrl: currentUrl,
          success: false,
          latencyMs: Date.now() - startTime,
          attempts,
          error: `SSRF Violation: ${validation.error}`,
          deliveredAt: new Date().toISOString(),
        };
      }

      // Compute HMAC-SHA256 signature
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = crypto
        .createHmac("sha256", signingSecret)
        .update(`${timestamp}.${bodyString}`)
        .digest("hex");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(currentUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "SmartDDoSShield-AlertDispatcher/2.4",
            "X-Shield-Event": sanitized.eventType,
            "X-Shield-Delivery": sanitized.eventId,
            "X-Shield-Signature": `t=${timestamp},v1=${signature}`,
          },
          body: bodyString,
          redirect: "manual", // Prevent automatic uninspected redirects
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check for redirect (301, 302, 307, 308)
        if ([301, 302, 307, 308].includes(response.status)) {
          const redirectLocation = response.headers.get("location");
          if (!redirectLocation) {
            return {
              destinationUrl: currentUrl,
              success: false,
              httpStatus: response.status,
              latencyMs: Date.now() - startTime,
              attempts,
              error: "Received redirect response with missing Location header.",
              deliveredAt: new Date().toISOString(),
            };
          }

          // Resolve relative redirect against current URL
          currentUrl = new URL(redirectLocation, currentUrl).toString();
          continue; // Loop to validate next hop
        }

        const isSuccess = response.status >= 200 && response.status < 300;
        return {
          destinationUrl: currentUrl,
          success: isSuccess,
          httpStatus: response.status,
          latencyMs: Date.now() - startTime,
          attempts,
          error: isSuccess ? undefined : `Destination returned HTTP ${response.status}`,
          deliveredAt: new Date().toISOString(),
        };
      } catch (err: any) {
        clearTimeout(timeoutId);
        const isAbort = err.name === "AbortError";
        return {
          destinationUrl: currentUrl,
          success: false,
          latencyMs: Date.now() - startTime,
          attempts,
          error: isAbort ? "Request timed out after 6000ms" : `Network error: ${err.message}`,
          deliveredAt: new Date().toISOString(),
        };
      }
    }

    return {
      destinationUrl: currentUrl,
      success: false,
      latencyMs: Date.now() - startTime,
      attempts,
      error: `Exceeded maximum redirect limit of ${maxRedirects} hops.`,
      deliveredAt: new Date().toISOString(),
    };
  }
}
