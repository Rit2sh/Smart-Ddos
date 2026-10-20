"use client";

import React, { useState } from "react";
import { Users, Shield, Server, ArrowRight, ShieldAlert, Cpu, Check, AlertCircle } from "lucide-react";

export type ArchitectureMode = "REVERSE_PROXY" | "CDN_WAF" | "OUT_OF_PATH";

export function NetworkFlowDiagram() {
  const [mode, setMode] = useState<ArchitectureMode>("REVERSE_PROXY");

  const modeDescriptions: Record<
    ArchitectureMode,
    {
      title: string;
      canBlock: boolean;
      summary: string;
      enforcementPoint: string;
      pros: string;
      limitations: string;
    }
  > = {
    REVERSE_PROXY: {
      title: "In-Line Reverse Proxy (NGINX / Envoy)",
      canBlock: true,
      summary:
        "All incoming traffic traverses an in-line proxy. The proxy runs defensive rate-limiting and dropping rules directly, protecting your backend origin from reaching connection limits.",
      enforcementPoint: "Direct in-path proxy dropping HTTP floods with HTTP 429.",
      pros: "Sub-millisecond local enforcement, zero external API latency, works in private VPCs.",
      limitations: "Volumetric floods larger than server network uplink capacity still require upstream ISP/CDN scrubbing.",
    },
    CDN_WAF: {
      title: "Upstream CDN / Edge WAF (Cloudflare / AWS)",
      canBlock: true,
      summary:
        "Smart DDoS Shield pushes rate-limiting and IP restriction rules to Cloudflare WAF or AWS Shield APIs. Requests are intercepted at hundreds of Anycast edge locations.",
      enforcementPoint: "Global Anycast edge servers before packets enter your infrastructure.",
      pros: "Absorbs multi-gigabit volumetric spikes, stops floods closest to attacker origins.",
      limitations: "API sync propagation takes 2-5 seconds depending on provider API latency.",
    },
    OUT_OF_PATH: {
      title: "Out-of-Path Telemetry Collector (Monitor-Only)",
      canBlock: false,
      summary:
        "A daemon reads access logs or flow telemetry asynchronously. The engine detects anomalies and generates alerts, but cannot actively drop packets without a proxy or WAF.",
      enforcementPoint: "No inline interception (Monitoring & alerts only).",
      pros: "Zero risk of false-positive request drops, zero configuration changes to DNS or reverse proxy.",
      limitations: "Does NOT stop or throttle attacks. Requires manual operator intervention or downstream WAF.",
    },
  };

  const current = modeDescriptions[mode];

  return (
    <div className="cyber-card p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-lg font-bold text-text-primary">
              Defensive Traffic Architecture & Inspection Flow
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Understand where telemetry is sampled, where policies are enforced, and where your servers sit.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("REVERSE_PROXY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              mode === "REVERSE_PROXY"
                ? "bg-brand-cyan text-background font-bold shadow-glow"
                : "bg-panel text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            In-Line Reverse Proxy
          </button>
          <button
            type="button"
            onClick={() => setMode("CDN_WAF")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              mode === "CDN_WAF"
                ? "bg-brand-cyan text-background font-bold shadow-glow"
                : "bg-panel text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            Upstream CDN / WAF
          </button>
          <button
            type="button"
            onClick={() => setMode("OUT_OF_PATH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              mode === "OUT_OF_PATH"
                ? "bg-brand-cyan text-background font-bold shadow-glow"
                : "bg-panel text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            Monitor-Only Collector
          </button>
        </div>
      </div>

      {/* Visual Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative py-4">
        {/* Step 1: Inbound Traffic */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-panel border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-text-primary">Inbound Traffic</div>
          <div className="text-[11px] text-text-secondary space-y-1">
            <span className="inline-block px-1.5 py-0.5 rounded bg-status-success/15 text-status-success font-mono">
              Legitimate Users
            </span>
            <br />
            <span className="inline-block px-1.5 py-0.5 rounded bg-status-critical/15 text-status-critical font-mono">
              Suspicious Floods
            </span>
          </div>
        </div>

        {/* Step 2: Edge Interception / Collector */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-panel border border-brand-blue/30 flex items-center justify-center text-brand-blue">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-text-primary">
            {mode === "REVERSE_PROXY" && "NGINX Proxy Layer"}
            {mode === "CDN_WAF" && "Cloudflare / AWS Edge"}
            {mode === "OUT_OF_PATH" && "Passive Log Daemon"}
          </div>
          <div className="text-[11px] font-mono text-text-secondary">
            {mode === "OUT_OF_PATH" ? "Async Log Shipping" : "Synchronous Inspection"}
          </div>
        </div>

        {/* Step 3: Smart DDoS Shield Engine */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-brand-cyan/40 flex flex-col items-center text-center space-y-2 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-panel border border-brand-cyan flex items-center justify-center text-brand-cyan shadow-glow">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-text-primary">Smart Defense Engine</div>
          <div className="text-[11px] text-text-secondary font-mono">
            Z-Score Anomaly Engine + Rate Limit Controller
          </div>
        </div>

        {/* Step 4: Origin Server */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-panel border border-status-success/40 flex items-center justify-center text-status-success">
            <Server className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-text-primary">Protected Origin Server</div>
          <div className="text-[11px] font-mono text-status-success">
            {mode === "OUT_OF_PATH" ? "Unprotected from Flood" : "Clean Filtered Traffic Only"}
          </div>
        </div>
      </div>

      {/* Mode Capabilities Explanations Card */}
      <div className="p-4 rounded-xl bg-panel border border-border-subtle space-y-3 text-xs leading-relaxed">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-text-primary flex items-center gap-2">
            <span>{current.title}</span>
            {current.canBlock ? (
              <span className="px-2 py-0.5 rounded bg-status-success/20 text-status-success font-mono text-[10px] flex items-center gap-1">
                <Check className="w-3 h-3" /> Active Enforcement Capable
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-status-warning/20 text-status-warning font-mono text-[10px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Monitoring Only (No Blocking)
              </span>
            )}
          </h4>
        </div>

        <p className="text-text-secondary">{current.summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border-subtle/60 text-[11px] font-mono">
          <div>
            <span className="text-text-primary font-semibold">Strengths:</span>{" "}
            <span className="text-status-success">{current.pros}</span>
          </div>
          <div>
            <span className="text-text-primary font-semibold">Architectural Boundary:</span>{" "}
            <span className="text-status-warning">{current.limitations}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
