import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Activity,
  AlertTriangle,
  Sliders,
  Filter,
  Server,
  Cloud,
  Bell,
  Sparkles,
  FileText,
  Layers,
  ShieldCheck,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      id: "traffic-monitoring",
      title: "1. Real-Time Telemetry & Traffic Ingestion",
      icon: <Activity className="w-5 h-5 text-brand-cyan" />,
      whatItDoes:
        "Ingests sub-minute request counts, response code distributions (2xx, 4xx, 5xx), and bandwidth rates from connected collectors and proxies.",
      whyItMatters:
        "Gives you immediate visibility into request volume without logging into individual server terminals or parsing gigabytes of raw logs.",
      whoBenefits: "DevOps engineers, webmasters, site reliability engineers (SREs).",
      configRequired:
        "Connect an out-of-path collector daemon or configure NGINX log formatting.",
      limitations:
        "Telemetry ingestion does not store raw request payloads or PII. Sampling rates vary by tier (10s to 60s rollups).",
      isLive: true,
    },
    {
      id: "anomaly-detection",
      title: "2. Statistical Anomaly Detection Engine",
      icon: <AlertTriangle className="w-5 h-5 text-status-warning" />,
      whatItDoes:
        "Computes historical mean and standard deviation for request rates across 24h rolling windows. Triggers detection alerts when Z-Score exceeds threshold (default Z > 3.0).",
      whyItMatters:
        "Detects sudden surges automatically, eliminating the need to set fragile hardcoded request caps that break during normal business growth.",
      whoBenefits: "Startups, e-commerce stores with varying daily traffic curves.",
      configRequired: "Requires at least 20 minutes of continuous baseline telemetry.",
      limitations:
        "Very gradual slow-and-low traffic creep over days may adapt baseline unless tuned with percentile rules.",
      isLive: true,
    },
    {
      id: "incident-investigation",
      title: "3. Incident Investigation & Threat Evidence",
      icon: <FileText className="w-5 h-5 text-brand-blue" />,
      whatItDoes:
        "Aggregates attack events into structured incident records with timeline graphs, affected URIs, top source countries, and peak request rates.",
      whyItMatters:
        "Allows operators to understand the attack fingerprint, assess whether it is legitimate traffic or a botnet, and choose the correct mitigation.",
      whoBenefits: "Security analysts, operations leads, compliance auditors.",
      configRequired: "Automatic whenever anomaly detection triggers an incident.",
      limitations:
        "Geo-location lookup depends on client IP availability in upstream X-Forwarded-For headers.",
      isLive: true,
    },
    {
      id: "rate-limiting",
      title: "4. Defensive Rate Limiting (In-Line HTTP 429)",
      icon: <Sliders className="w-5 h-5 text-status-critical" />,
      whatItDoes:
        "Enforces sliding-window rate limits per IP or subnet, responding with HTTP 429 Too Many Requests to clients that exceed acceptable velocity.",
      whyItMatters:
        "Prevents database and CPU exhaustion on heavy endpoints such as search, authentication, and payment checkout.",
      whoBenefits: "API developers, e-commerce stores, login portals.",
      configRequired: "Configure rate threshold (e.g. 100 req/min) and deploy to reverse proxy.",
      limitations:
        "Must be enforced by an in-line proxy (NGINX/Envoy) or cloud WAF. Passive collectors cannot drop packets.",
      isLive: true,
    },
    {
      id: "request-filtering",
      title: "5. Targeted Request & IP Filtering",
      icon: <Filter className="w-5 h-5 text-purple-400" />,
      whatItDoes:
        "Maintains an active CIDR blocklist and URI regex filtering rules to immediately drop malicious bots and known offensive IP ranges.",
      whyItMatters:
        "Stops persistent attack infrastructure from consuming bandwidth and server sockets.",
      whoBenefits: "Systems under targeted volumetric or scraping attacks.",
      configRequired: "Add IP address or CIDR range in Console Policies or approve incident action.",
      limitations:
        "IP blocking has limited efficacy against massive botnets where each device only sends one request every few minutes.",
      isLive: true,
    },
    {
      id: "reverse-proxy",
      title: "6. In-Line Reverse Proxy Integration (NGINX)",
      icon: <Server className="w-5 h-5 text-status-success" />,
      whatItDoes:
        "Generates validated, drop-in NGINX configuration snippets and rate-limiting zones (`limit_req_zone`) for your Linux server or container.",
      whyItMatters:
        "Zero dependency on external cloud providers. Sub-millisecond local enforcement directly on your VPS or Kubernetes cluster.",
      whoBenefits: "Developers hosting on DigitalOcean, Hetzner, AWS EC2, or dedicated hardware.",
      configRequired:
        "Copy generated `nginx.conf` snippet into `/etc/nginx/conf.d/` and run `nginx -s reload`.",
      limitations:
        "Proxy server network port and CPU determine maximum flood capacity.",
      isLive: true,
    },
    {
      id: "cdn-waf",
      title: "7. Cloudflare & AWS WAF Adapters",
      icon: <Cloud className="w-5 h-5 text-brand-blue" />,
      whatItDoes:
        "Synchronizes defensive IP rules and rate policies with Cloudflare WAF or AWS Shield APIs via secure outbound webhooks and API calls.",
      whyItMatters:
        "Leverages global Anycast edge networks to absorb multi-gigabit floods thousands of miles away from your origin server.",
      whoBenefits: "Enterprises, high-traffic SaaS, and multi-region APIs.",
      configRequired:
        "Store API token with WAF edit permissions in your private integration settings.",
      limitations:
        "Requires active Cloudflare or AWS accounts. Edge rule propagation latency is typically 2-5 seconds.",
      isLive: true,
    },
    {
      id: "alerts-notifications",
      title: "8. Multi-Channel Alerts & Notifications",
      icon: <Bell className="w-5 h-5 text-status-warning" />,
      whatItDoes:
        "Dispatches instant notifications via Email, Slack, PagerDuty, or SSRF-validated outbound Webhooks when an anomaly or incident is detected.",
      whyItMatters:
        "Ensures on-call engineers know about attacks immediately, before customers notice downtime.",
      whoBenefits: "On-call engineers, SecOps teams, agency account managers.",
      configRequired: "Configure notification preference and webhook URL in workspace settings.",
      limitations:
        "Webhooks are validated against SSRF protection rules (private IP ranges RFC 1918 and loopbacks are rejected).",
      isLive: true,
    },
    {
      id: "ai-analyst",
      title: "9. AI-Assisted Incident Analyst",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      whatItDoes:
        "Analyzes raw incident telemetry and generates plain-language threat summaries, root cause hypotheses, and actionable step-by-step mitigation checklists.",
      whyItMatters:
        "Helps junior engineers and non-technical founders understand complex attack telemetry without hiring a dedicated security specialist.",
      whoBenefits: "Founders, solo developers, junior sysadmins.",
      configRequired:
        "Available out-of-the-box (uses rule-based synthesis or optional Gemini/OpenAI API key).",
      limitations:
        "AI suggestions are advisory. High-impact blocking policies require operator confirmation.",
      isLive: true,
    },
    {
      id: "security-reports",
      title: "10. Security Post-Mortems & Compliance Reports",
      icon: <FileText className="w-5 h-5 text-brand-cyan" />,
      whatItDoes:
        "Generates downloadable post-incident reports and monthly security summaries detailing total inspected RPS, peak mitigated volumes, and enforcement audits.",
      whyItMatters:
        "Provides clear documentation for management, enterprise clients, cyber-insurance providers, and compliance audits.",
      whoBenefits: "CTOs, compliance officers, client-servicing agencies.",
      configRequired: "Generated on demand from the console Reports section.",
      limitations:
        "Reports reflect aggregated metrics stored during your active plan retention window.",
      isLive: true,
    },
    {
      id: "multi-asset",
      title: "11. Multi-Asset & Organization Management",
      icon: <Layers className="w-5 h-5 text-status-success" />,
      whatItDoes:
        "Allows organizations to manage multiple websites, API domains, and staging environments under unified role-based access control (RBAC).",
      whyItMatters:
        "Enables digital agencies and multi-brand businesses to monitor all customer properties from a single pane of glass.",
      whoBenefits: "Agencies, SaaS portfolios, enterprise infrastructure teams.",
      configRequired: "Create an Organization workspace and invite team members.",
      limitations: "Number of concurrent assets depends on chosen workspace tier.",
      isLive: true,
    },
    {
      id: "audit-logs",
      title: "12. Immutable Audit Trail & Safe Rollback",
      icon: <ShieldCheck className="w-5 h-5 text-brand-cyan" />,
      whatItDoes:
        "Logs every policy change, threshold update, mitigation action, and user authentication event. Provides a 1-click safe rollback for any applied policy.",
      whyItMatters:
        "Prevents rogue configuration changes and ensures you can instantly revert a defensive rule if it accidentally impacts legitimate traffic.",
      whoBenefits: "All teams managing production traffic.",
      configRequired: "Enabled automatically across all console operations.",
      limitations:
        "Audit log retention duration varies from 7 days (Starter) to 90+ days (Enterprise).",
      isLive: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
            COMPREHENSIVE SPECIFICATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            Smart DDoS Shield Feature Breakdown
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Every feature explained clearly: what it does, why it matters, who benefits, what configuration is needed, and its technical boundaries.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          {features.map((feat) => (
            <div
              key={feat.id}
              id={feat.id}
              className="cyber-card p-6 sm:p-8 space-y-4 hover:border-brand-cyan/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-panel border border-border-subtle">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{feat.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-status-success/15 text-status-success border border-status-success/30 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Implemented & Live
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-text-primary uppercase tracking-wider text-[11px] font-mono text-brand-cyan">
                      What It Does:
                    </h4>
                    <p className="text-text-secondary mt-0.5">{feat.whatItDoes}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-primary uppercase tracking-wider text-[11px] font-mono text-status-success">
                      Why It Matters:
                    </h4>
                    <p className="text-text-secondary mt-0.5">{feat.whyItMatters}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-text-primary uppercase tracking-wider text-[11px] font-mono text-brand-blue">
                      Who Benefits & Setup Required:
                    </h4>
                    <p className="text-text-secondary mt-0.5">
                      <strong className="text-text-primary">Beneficiaries:</strong> {feat.whoBenefits}
                    </p>
                    <p className="text-text-secondary mt-0.5">
                      <strong className="text-text-primary">Setup:</strong> {feat.configRequired}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-panel border border-status-warning/20 text-status-warning text-[11px] font-mono flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Honest Limitation:</span> {feat.limitations}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="p-8 rounded-2xl bg-panel border border-brand-cyan/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Ready to see the step-by-step connection guide?
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Read our 10-step walkthrough to see exactly how domains are added, verified, and protected.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="px-6 py-3 rounded-xl font-bold text-xs bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow shrink-0 flex items-center gap-1.5"
          >
            <span>See How It Works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
