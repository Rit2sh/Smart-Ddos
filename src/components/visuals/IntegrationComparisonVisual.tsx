"use client";

import React from "react";
import { Server, Cloud, Shield, Check, X, AlertCircle } from "lucide-react";

export function IntegrationComparisonVisual() {
  const options = [
    {
      title: "In-Line Reverse Proxy",
      icon: <Server className="w-5 h-5 text-brand-cyan" />,
      technology: "NGINX, Envoy, Caddy",
      enforcement: "Active In-Path Blocking",
      canDropPackets: true,
      requiresDnsChange: false,
      idealFor: "VPS instances, private VPCs, single-server applications, container clusters.",
      howItWorks:
        "The proxy inspects HTTP headers and rate limits directly on your server instance before forwarding valid traffic to your application port.",
      mitigationAction: "HTTP 429 Too Many Requests, IP CIDR blacklisting, connection limits.",
      limitation: "Host CPU and network interface bandwidth limit total volumetric flood absorption.",
    },
    {
      title: "Upstream CDN & Cloud WAF",
      icon: <Cloud className="w-5 h-5 text-brand-blue" />,
      technology: "Cloudflare WAF, AWS Shield / WAF",
      enforcement: "Edge Global Anycast Dropping",
      canDropPackets: true,
      requiresDnsChange: true,
      idealFor: "High-traffic web apps, public APIs, e-commerce stores exposed to large floods.",
      howItWorks:
        "Smart DDoS Shield pushes rate-limiting rules and blocklists to Cloudflare or AWS APIs. Attacks are absorbed across hundreds of global edge data centers.",
      mitigationAction: "Global Anycast edge drop, JavaScript challenge, managed IP firewall.",
      limitation: "Requires delegating DNS nameservers or configuring a cloud API token with appropriate scopes.",
    },
    {
      title: "Out-of-Path Telemetry Collector",
      icon: <Shield className="w-5 h-5 text-status-warning" />,
      technology: "Lightweight daemon, Vector, FluentBit",
      enforcement: "Monitoring & Alerts Only (No Blocking)",
      canDropPackets: false,
      requiresDnsChange: false,
      idealFor: "Initial audits, risk evaluation, staging environments, non-intrusive threat discovery.",
      howItWorks:
        "A daemon tails web server access logs and streams sanitized counts asynchronously to Smart DDoS Shield. Statistical anomaly algorithms identify attacks without modifying traffic.",
      mitigationAction: "Real-time alerts, incident timeline generation, AI incident analysis.",
      limitation: "Cannot drop malicious requests automatically without an in-line proxy or WAF.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
          Compare Integration Methods Honestly
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Choose the integration model that matches your infrastructure capabilities and risk tolerance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt) => (
          <div
            key={opt.title}
            className="cyber-card p-6 flex flex-col justify-between space-y-4 hover:border-brand-cyan/40"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-panel border border-border-subtle">{opt.icon}</div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    opt.canDropPackets
                      ? "bg-status-success/15 text-status-success border-status-success/30"
                      : "bg-status-warning/15 text-status-warning border-status-warning/30"
                  }`}
                >
                  {opt.enforcement}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-text-primary">{opt.title}</h4>
                <div className="text-[11px] font-mono text-brand-cyan mt-0.5">{opt.technology}</div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">{opt.howItWorks}</p>

              <div className="space-y-2 pt-3 border-t border-border-subtle text-xs">
                <div>
                  <span className="font-semibold text-text-primary">Ideal For:</span>{" "}
                  <span className="text-text-secondary">{opt.idealFor}</span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary">Mitigation Mechanism:</span>{" "}
                  <span className="text-brand-cyan font-mono text-[11px]">{opt.mitigationAction}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle/60 text-[11px] font-mono text-status-warning flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Boundary: {opt.limitation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
