import { describe, it, expect } from "vitest";
import { WebhookDispatcher, WebhookPayload } from "../src/lib/alerts/webhook-dispatcher";

describe("Outbound Alert Webhook & SSRF Prevention", () => {
  it("should block loopback IPv4 addresses (127.0.0.1, 127.0.1.1)", () => {
    expect(WebhookDispatcher.isRestrictedIp("127.0.0.1")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("127.0.1.10")).toBe(true);
  });

  it("should block RFC 1918 private IPv4 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)", () => {
    expect(WebhookDispatcher.isRestrictedIp("10.0.0.1")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("10.254.12.99")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("172.16.0.1")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("172.31.255.255")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("192.168.1.1")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("192.168.100.200")).toBe(true);
  });

  it("should block AWS/GCP/Azure link-local metadata endpoints (169.254.169.254)", () => {
    expect(WebhookDispatcher.isRestrictedIp("169.254.169.254")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("169.254.0.1")).toBe(true);
  });

  it("should block IPv6 loopback and private link-local addresses", () => {
    expect(WebhookDispatcher.isRestrictedIp("::1")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("fe80::1")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("fc00::1")).toBe(true);
    expect(WebhookDispatcher.isRestrictedIp("fd12:3456:789a::1")).toBe(true);
  });

  it("should allow valid public IP addresses", () => {
    expect(WebhookDispatcher.isRestrictedIp("8.8.8.8")).toBe(false);
    expect(WebhookDispatcher.isRestrictedIp("1.1.1.1")).toBe(false);
    expect(WebhookDispatcher.isRestrictedIp("104.21.5.12")).toBe(false);
  });

  it("should validate destination URLs and reject metadata or private hostnames", async () => {
    const metaCheck = await WebhookDispatcher.validateDestinationUrl("http://metadata.google.internal/computeMetadata/v1/");
    expect(metaCheck.safe).toBe(false);
    expect(metaCheck.error).toContain("metadata");

    const localhostCheck = await WebhookDispatcher.validateDestinationUrl("http://localhost:8080/webhook");
    expect(localhostCheck.safe).toBe(false);

    const directPrivateIp = await WebhookDispatcher.validateDestinationUrl("http://192.168.1.50/alert");
    expect(directPrivateIp.safe).toBe(false);

    const ftpCheck = await WebhookDispatcher.validateDestinationUrl("ftp://example.com/file");
    expect(ftpCheck.safe).toBe(false);
    expect(ftpCheck.error).toContain("Disallowed protocol");
  });

  it("should sanitize webhook payloads removing secrets and truncating unbounded text", () => {
    const uncleaned: WebhookPayload = {
      eventId: "evt_123",
      eventType: "INCIDENT_CREATED",
      timestamp: new Date().toISOString(),
      organizationId: "org_01",
      severity: "CRITICAL",
      title: "Attack Detected\r\nBearer secret-token-leak",
      summary: "Flood attack on endpoint".repeat(50),
      assetDomain: "api.shield-enterprise.io",
    };

    const sanitized = WebhookDispatcher.sanitizePayload(uncleaned);
    expect(sanitized.title).not.toContain("\r");
    expect(sanitized.title).not.toContain("\n");
    expect(sanitized.summary.length).toBeLessThanOrEqual(500);
  });
});
