"use client";

import React, { useState } from "react";
import {
  Plug,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  ShieldAlert,
  Lock,
  ExternalLink,
  Info,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  type: string;
  status: "CONNECTED" | "AWAITING_CREDENTIALS" | "STANDBY";
  description: string;
  lastSync: string;
  hasCredentials: boolean;
  capabilities: string[];
}

const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "cf",
    name: "Cloudflare WAF & Edge Rate Limiting",
    type: "DNS & Edge WAF",
    status: "AWAITING_CREDENTIALS",
    description: "Synchronizes origin IPs and propagates automated BGP blackhole communities to Cloudflare Anycast edge.",
    lastSync: "Awaiting API Token",
    hasCredentials: false,
    capabilities: ["Rate Limiting Rulesets", "Zone IP Filtering", "BGP Blackhole Community"],
  },
  {
    id: "aws",
    name: "AWS WAF & Shield Advanced",
    type: "Cloud Infrastructure",
    status: "AWAITING_CREDENTIALS",
    description: "Automates health check failover and updates rate-based rules on AWS CloudFront and ALB WebACLs.",
    lastSync: "Awaiting IAM Credentials",
    hasCredentials: false,
    capabilities: ["WebACL RateStatement", "CloudWatch Metrics", "Route53 Failover"],
  },
  {
    id: "slack",
    name: "Slack SecOps Dispatcher",
    type: "Incident Notification",
    status: "CONNECTED",
    description: "Pushes real-time alerts and interactive mitigation approval buttons to #secops-alerts channel via SSRF-safe outbound webhook.",
    lastSync: "Ready for dispatch",
    hasCredentials: true,
    capabilities: ["SSRF-Protected Webhooks", "HMAC-SHA256 Signing", "Bounded Retries"],
  },
  {
    id: "pagerduty",
    name: "PagerDuty Incident Escalation",
    type: "On-Call Automation",
    status: "CONNECTED",
    description: "Triggers high-urgency incidents for Layer 7 attacks exceeding 100k RPS or collector node degradation.",
    lastSync: "Ready for dispatch",
    hasCredentials: true,
    capabilities: ["Critical Severity Escalation", "PagerDuty Events API v2"],
  },
  {
    id: "local_proxy",
    name: "Local NGINX / Envoy Reverse Proxy",
    type: "Autonomous Edge Proxy",
    status: "CONNECTED",
    description: "Native in-line reverse proxy adapter with rate-limiting zones, burst buffers, and active verification.",
    lastSync: "Active in-line",
    hasCredentials: true,
    capabilities: ["limit_req_zone", "Zero-downtime Reload", "Active Canary Verification"],
  },
  {
    id: "custom_collector",
    name: "Edge Daemon Collector Probes",
    type: "Telemetry Ingestion",
    status: "CONNECTED",
    description: "Accepts JSON/Protobuf telemetry batches from proprietary daemon collectors deployed on bare-metal and k8s.",
    lastSync: "Live ingestion",
    hasCredentials: true,
    capabilities: ["Token Auth", "Batch Deduplication", "eBPF Packet Telemetry"],
  },
];

export default function IntegrationsPage() {
  const [integrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [testUrl, setTestUrl] = useState("https://httpbin.org/post");
  const [testSecret, setTestSecret] = useState("prod-webhook-secret-demo");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  const handleTestWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/v1/alerts/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationUrl: testUrl, secret: testSecret }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ error: "Failed to communicate with test webhook API" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>EDGE & INFRASTRUCTURE INTEGRATIONS</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-success/15 text-status-success">
              4 OPERATIONAL
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-warning/15 text-status-warning">
              2 AWAITING CREDS
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Bridge your cloud providers, WAF engines, and outbound incident notification webhooks with strict SSRF validation.
          </p>
        </div>
      </div>

      {/* Webhook SSRF Safety Tester Card */}
      <div className="cyber-card p-5 border border-brand-cyan/30 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-bold text-text-primary">Outbound Alert Webhook Tester (SSRF-Protected)</h3>
          </div>
          <span className="text-[11px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
            RFC 1918 & Cloud Metadata Filter Active
          </span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Test any outbound destination. The Smart DDoS Shield dispatcher resolves DNS, strictly forbids private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8), blocks cloud metadata (169.254.169.254), re-evaluates all HTTP redirects, and signs payloads with HMAC-SHA256.
        </p>

        <form onSubmit={handleTestWebhook} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-text-secondary uppercase">Destination Webhook URL</label>
              <input
                type="url"
                required
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary uppercase">Signing Secret (Optional)</label>
              <input
                type="text"
                value={testSecret}
                onChange={(e) => setTestSecret(e.target.value)}
                placeholder="secret-key-123"
                className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-text-muted">
              Try testing an internal IP like <code className="text-status-critical">http://169.254.169.254/latest/meta-data</code> to see SSRF defense in action!
            </span>
            <button
              type="submit"
              disabled={testing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-cyan text-background text-xs font-bold font-mono hover:bg-brand-cyan/90 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testing ? "Testing Dispatch..." : "Dispatch Test Webhook"}</span>
            </button>
          </div>
        </form>

        {testResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs font-mono space-y-2 ${
              testResult.success
                ? "bg-status-success/10 border-status-success/40 text-status-success"
                : "bg-status-critical/10 border-status-critical/40 text-status-critical"
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{testResult.success ? "DELIVERY CONFIRMED" : "DISPATCH REJECTED / FAILED"}</span>
            </div>
            {testResult.delivery && (
              <div className="space-y-1 text-text-primary text-[11px]">
                <div>Target: {testResult.delivery.destinationUrl}</div>
                <div>Latency: {testResult.delivery.latencyMs}ms | Attempts: {testResult.delivery.attempts}</div>
                {testResult.delivery.httpStatus && <div>HTTP Status: {testResult.delivery.httpStatus}</div>}
                {testResult.delivery.error && (
                  <div className="text-status-critical font-bold">Reason: {testResult.delivery.error}</div>
                )}
              </div>
            )}
            {testResult.error && (
              <div className="text-[11px] text-status-critical">{testResult.error}</div>
            )}
          </div>
        )}
      </div>

      {/* Integration Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div key={item.id} className="cyber-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-border-subtle text-text-secondary">
                  {item.type}
                </span>
                <span
                  className={`text-[11px] font-mono font-semibold flex items-center gap-1 ${
                    item.status === "CONNECTED"
                      ? "text-status-success"
                      : "text-status-warning"
                  }`}
                >
                  {item.status === "CONNECTED" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  {item.status === "AWAITING_CREDENTIALS" ? "AWAITING CREDS" : item.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-text-primary">{item.name}</h3>

              <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>

              <div className="space-y-1 pt-2">
                <div className="text-[10px] font-mono text-text-muted uppercase">Provider Capabilities:</div>
                <div className="flex flex-wrap gap-1">
                  {item.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-panel border border-border-subtle text-text-secondary"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle/50 flex items-center justify-between text-xs font-mono">
              <span className="text-[11px] text-text-secondary/80">Status: {item.lastSync}</span>
              <span className="text-[11px] text-brand-cyan">
                {item.hasCredentials ? "Active Adapter" : "Setup Required"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
