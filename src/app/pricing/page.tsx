import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PRICING_TIERS } from "@/lib/pricing-config";
import { Check, AlertCircle, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const comparisonMatrix = [
    {
      feature: "Protected Assets (Websites or APIs)",
      free: "1 Domain",
      starter: "Up to 3 Domains",
      business: "Up to 10 Domains",
      enterprise: "Unlimited",
    },
    {
      feature: "Telemetry Data Retention",
      free: "24 Hours",
      starter: "7 Days",
      business: "30 Days",
      enterprise: "90+ Days / Custom",
    },
    {
      feature: "Anomaly Detection Sensitivity",
      free: "Standard Z > 3.0",
      starter: "Customizable Z-Score",
      business: "Multi-Percentile Tuning",
      enterprise: "Bespoke Machine Learning",
    },
    {
      feature: "In-Line NGINX Reverse Proxy Rules",
      free: "Manual Snippet",
      starter: "Automated HTTP 429",
      business: "Dynamic Zone Sync",
      enterprise: "Custom eBPF Daemon",
    },
    {
      feature: "Cloudflare & AWS WAF Adapters",
      free: "Preview Only",
      starter: "Optional Add-on",
      business: "Included (Full Sync)",
      enterprise: "Included + Custom BGP",
    },
    {
      feature: "AI-Assisted Incident Analyst",
      free: "Basic Summaries",
      starter: "Full Root Cause Checks",
      business: "Unlimited AI Inquiries",
      enterprise: "Dedicated Model Fine-Tuning",
    },
    {
      feature: "Incident Alerts & Webhooks",
      free: "Console Only",
      starter: "Email & Webhooks",
      business: "Slack, PagerDuty, Webhooks",
      enterprise: "Dedicated SIEM Integration",
    },
    {
      feature: "Support & SLA",
      free: "Community Guides",
      starter: "Email (24h response)",
      business: "Priority (4h response)",
      enterprise: "Dedicated Slack & 15m SLA",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
            TRANSPARENT DEFENSE PLANS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            Predictable Pricing, Zero Surge Penalties
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            We never charge overage fees for attack traffic absorbed by our platform. Choose the tier that matches your infrastructure size.
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`cyber-card p-6 flex flex-col justify-between space-y-6 ${
                tier.popular ? "border-brand-cyan shadow-glow bg-panel" : ""
              }`}
            >
              <div className="space-y-4">
                {tier.popular && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40">
                    {tier.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-text-primary">{tier.name}</h3>
                  <div className="font-mono mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-text-primary">
                      {tier.price}
                    </span>
                    <span className="text-xs text-text-secondary ml-1">/ {tier.billingPeriod}</span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{tier.tagline}</p>

                <div className="space-y-2 pt-3 border-t border-border-subtle text-xs text-text-secondary font-mono">
                  <div className="text-text-primary font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-status-success shrink-0" />
                    <span>{tier.limits.assets}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-status-success shrink-0" />
                    <span>{tier.limits.retention}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-status-success shrink-0" />
                    <span>{tier.limits.supportLevel}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-border-subtle/60 text-[11px] text-text-secondary">
                  <span className="font-mono font-semibold text-text-primary uppercase tracking-wider text-[10px]">
                    Included Features:
                  </span>
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-brand-cyan font-bold">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-panel border border-status-warning/20 text-[10px] font-mono text-status-warning flex items-start gap-1.5">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{tier.honestLimitation}</span>
                </div>

                <Link
                  href={tier.ctaHref}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold text-center transition-all block ${
                    tier.popular
                      ? "bg-brand-cyan text-background hover:bg-brand-cyan/90 shadow-glow"
                      : "bg-panel border border-border-subtle hover:border-brand-cyan/40 text-text-primary"
                  }`}
                >
                  {tier.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Feature Comparison Table */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              Full Tier Feature Comparison
            </h2>
            <p className="text-xs text-text-secondary">
              A detailed breakdown of limits, integrations, and capabilities across all tiers.
            </p>
          </div>

          <div className="cyber-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border-subtle bg-panel/80 text-text-secondary uppercase">
                    <th className="p-4 font-bold text-text-primary">Capability</th>
                    <th className="p-4">Developer</th>
                    <th className="p-4 text-brand-cyan">Starter</th>
                    <th className="p-4">Business</th>
                    <th className="p-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/60 text-text-secondary">
                  {comparisonMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-panel/40 transition-colors">
                      <td className="p-4 font-semibold text-text-primary">{row.feature}</td>
                      <td className="p-4">{row.free}</td>
                      <td className="p-4 font-bold text-brand-cyan">{row.starter}</td>
                      <td className="p-4">{row.business}</td>
                      <td className="p-4 text-status-success">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Honest Limitations Notice Banner */}
        <section className="p-6 rounded-2xl bg-panel border border-border-subtle space-y-2 text-xs text-text-secondary leading-relaxed">
          <div className="flex items-center gap-2 text-text-primary font-bold">
            <AlertCircle className="w-4 h-4 text-brand-cyan" />
            <span>Honest Architectural Boundaries</span>
          </div>
          <p>
            Free and Developer tiers include out-of-path telemetry ingestion and statistical anomaly detection. They provide visibility and threat discovery, but cannot drop malicious packets without an in-line proxy or WAF.
          </p>
          <p>
            Active rate-limiting (HTTP 429) and IP blocking require either the <strong>In-Line NGINX Reverse Proxy</strong> integration or the <strong>Cloudflare / AWS WAF</strong> adapter, included in Starter and Business tiers.
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
