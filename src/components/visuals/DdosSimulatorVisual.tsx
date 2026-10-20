"use client";

import React, { useState } from "react";
import { Activity, AlertTriangle, ShieldCheck, Zap, RotateCcw, ArrowRight } from "lucide-react";

export function DdosSimulatorVisual() {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    {
      title: "1. Normal Baseline Traffic",
      rps: "75 RPS",
      errorRate: "0.01%",
      status: "Healthy",
      statusColor: "text-status-success",
      barHeight: "20%",
      barColor: "bg-status-success",
      description:
        "Legitimate users browse your website, shop, and query your APIs. Telemetry collectors record baseline metrics (average RPS, standard deviation, and URI distributions).",
      action: "Monitoring in standby. No mitigation rules needed.",
    },
    {
      title: "2. Abnormal Traffic Surge",
      rps: "14,800 RPS",
      errorRate: "18.4%",
      status: "Elevated Surge",
      statusColor: "text-status-warning",
      barHeight: "95%",
      barColor: "bg-status-critical",
      description:
        "An unexpected flood hits `/api/checkout` from thousands of distinct IP addresses. Origin server CPU utilization spikes toward 90%, and connection pools begin queuing.",
      action: "Anomaly detection algorithm calculates Z-score > 3.8 and flags an active spike.",
    },
    {
      title: "3. Statistical Anomaly Confirmed",
      rps: "14,800 RPS",
      errorRate: "28.6%",
      status: "Incident Triggered",
      statusColor: "text-status-critical",
      barHeight: "90%",
      barColor: "bg-status-critical animate-pulse",
      description:
        "The engine analyzes request telemetry against the rolling 24-hour historical baseline. It identifies abusive URI clustering and rapid per-IP connection rates.",
      action: "Auto-incident created with high severity. Evidence samples captured for audit.",
    },
    {
      title: "4. Defensive Rate Limiting Applied",
      rps: "250 RPS (Origin)",
      errorRate: "0.05% (Origin)",
      status: "Throttling Attack",
      statusColor: "text-brand-cyan",
      barHeight: "35%",
      barColor: "bg-brand-cyan",
      description:
        "Defensive rate-limiting is activated at the reverse proxy or CDN edge. Abusive flood requests receive HTTP 429 or CAPTCHA challenges before reaching your application.",
      action: "Excessive packets dropped at edge. Origin server CPU returns to normal.",
    },
    {
      title: "5. Recovery & Policy Evaluation",
      rps: "85 RPS",
      errorRate: "0.02%",
      status: "Resolved & Safe",
      statusColor: "text-status-success",
      barHeight: "22%",
      barColor: "bg-status-success",
      description:
        "Attack traffic subsides. Rate-limit enforcement is verified, incident post-mortem report is compiled, and defensive rules transition to graceful monitoring.",
      action: "Operators review AI-assisted investigation summary and audit log history.",
    },
  ];

  const current = stages[stageIndex];

  return (
    <div className="cyber-card p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-lg font-bold text-text-primary">
              Step-by-Step Attack & Mitigation Demonstration
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            See how Smart DDoS Shield detects request surges and protects your origin application.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-secondary">Stage {stageIndex + 1} of 5</span>
          <button
            type="button"
            onClick={() => setStageIndex((prev) => (prev + 1) % stages.length)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrubber Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {stages.map((stg, i) => (
          <button
            key={stg.title}
            type="button"
            onClick={() => setStageIndex(i)}
            className={`p-2.5 rounded-lg text-left transition-all border ${
              stageIndex === i
                ? "bg-elevated border-brand-cyan text-text-primary shadow-sm"
                : "bg-panel/60 border-border-subtle text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="text-[10px] font-mono text-text-secondary">0{i + 1}</div>
            <div className="text-xs font-semibold truncate mt-0.5">{stg.title.split(". ")[1]}</div>
          </button>
        ))}
      </div>

      {/* Simulated Telemetry Graph Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Metric Gauges */}
        <div className="p-4 rounded-xl bg-panel border border-border-subtle space-y-4">
          <div>
            <div className="text-[11px] font-mono text-text-secondary uppercase">
              Current Inspected Rate
            </div>
            <div className="text-2xl font-bold font-mono text-text-primary mt-1">
              {current.rps}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-text-secondary uppercase">Origin HTTP Errors</div>
            <div className="text-xl font-bold font-mono text-status-critical mt-1">
              {current.errorRate}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-text-secondary uppercase">Engine Status</div>
            <div className={`text-sm font-bold font-mono mt-1 ${current.statusColor}`}>
              {current.status}
            </div>
          </div>
        </div>

        {/* Dynamic Simulated Traffic Graph */}
        <div className="md:col-span-2 p-5 rounded-xl bg-elevated/70 border border-border-subtle flex flex-col justify-between h-56 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary">
            <span>Simulated Telemetry Waveform</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-panel border border-border-subtle">
              Illustrative Demonstration
            </span>
          </div>

          {/* Simple Animated CSS Bars */}
          <div className="flex items-end justify-between h-32 gap-1.5 pt-4">
            {[40, 50, 45, 60, stageIndex >= 1 ? 95 : 55, stageIndex >= 1 ? 100 : 50, stageIndex >= 2 ? 90 : 45, stageIndex >= 3 ? 35 : 85, stageIndex >= 4 ? 25 : 75, stageIndex >= 4 ? 20 : 60].map(
              (h, idx) => (
                <div
                  key={idx}
                  className="w-full rounded-t transition-all duration-500 bg-brand-cyan/20 relative"
                  style={{ height: `${h}%` }}
                >
                  <div
                    className={`absolute inset-x-0 bottom-0 rounded-t transition-all duration-500 ${
                      h > 70 ? "bg-status-critical" : h > 30 ? "bg-brand-cyan" : "bg-status-success"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              )
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-text-secondary/70 pt-2 border-t border-border-subtle/40">
            <span>T-60s (Baseline)</span>
            <span>T-30s (Spike)</span>
            <span>T-0s (Current Action)</span>
          </div>
        </div>
      </div>

      {/* Explanatory Narrative */}
      <div className="p-4 rounded-xl bg-panel border border-border-subtle space-y-2 text-xs leading-relaxed">
        <h4 className="font-bold text-text-primary text-sm">{current.title}</h4>
        <p className="text-text-secondary">{current.description}</p>
        <div className="pt-2 text-[11px] font-mono text-brand-cyan flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Platform Action: {current.action}</span>
        </div>
      </div>
    </div>
  );
}
