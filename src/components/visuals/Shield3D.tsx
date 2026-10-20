"use client";

import React, { useState } from "react";
import { Shield, Server, CheckCircle2, AlertTriangle, Zap, RefreshCw } from "lucide-react";

export type ShieldVisualState = "MONITORING" | "ANOMALY_DETECTED" | "MITIGATING" | "RECOVERY";

interface Shield3DProps {
  initialState?: ShieldVisualState;
  showControls?: boolean;
  className?: string;
}

export function Shield3D({
  initialState = "MONITORING",
  showControls = true,
  className = "",
}: Shield3DProps) {
  const [activeState, setActiveState] = useState<ShieldVisualState>(initialState);

  const stateDetails: Record<
    ShieldVisualState,
    {
      title: string;
      color: string;
      borderColor: string;
      glowColor: string;
      statusText: string;
      explanation: string;
      icon: React.ReactNode;
      badgeClass: string;
    }
  > = {
    MONITORING: {
      title: "Active Baseline Monitoring",
      color: "#22D3EE",
      borderColor: "border-brand-cyan/40",
      glowColor: "rgba(34, 211, 238, 0.35)",
      statusText: "Normal Traffic (85 RPS)",
      explanation:
        "Telemetry collectors continuously inspect HTTP request rates and packet metadata. All legitimate visitors reach the origin server with zero added latency.",
      icon: <ActivityIcon color="#22D3EE" />,
      badgeClass: "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/40",
    },
    ANOMALY_DETECTED: {
      title: "Suspicious Traffic Surge Detected",
      color: "#FBBF24",
      borderColor: "border-status-warning/50",
      glowColor: "rgba(251, 191, 36, 0.4)",
      statusText: "Traffic Spike (+420% RPS)",
      explanation:
        "Incoming request volume exceeds the statistical baseline (Z-Score > 3.5). The engine captures evidence samples and alerts operators without disrupting user sessions.",
      icon: <AlertTriangle className="w-5 h-5 text-status-warning" />,
      badgeClass: "bg-status-warning/20 text-status-warning border-status-warning/40",
    },
    MITIGATING: {
      title: "Defensive Rate Limiting Enforced",
      color: "#F87171",
      borderColor: "border-status-critical/60",
      glowColor: "rgba(248, 113, 113, 0.45)",
      statusText: "Mitigation Active (429 Throttling)",
      explanation:
        "Defensive policies restrict abusive IPs and excessive URI floods at the reverse proxy. Legitimate requests continue passing while attack traffic is dropped.",
      icon: <Zap className="w-5 h-5 text-status-critical" />,
      badgeClass: "bg-status-critical/20 text-status-critical border-status-critical/40",
    },
    RECOVERY: {
      title: "Threat Mitigated & Normalcy Restored",
      color: "#34D399",
      borderColor: "border-status-success/50",
      glowColor: "rgba(52, 211, 153, 0.35)",
      statusText: "Protected Origin Online (100% SLA)",
      explanation:
        "Traffic has returned to acceptable thresholds. Rate-limiting policies remain standby or gracefully decay to preserve origin server resources.",
      icon: <CheckCircle2 className="w-5 h-5 text-status-success" />,
      badgeClass: "bg-status-success/20 text-status-success border-status-success/40",
    },
  };

  const current = stateDetails[activeState];

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-panel/80 border border-border-subtle backdrop-blur-md ${className}`}
      aria-label="Interactive 3D DDoS Protection Shield Demonstration"
    >
      {/* Simulation Notice Disclaimer */}
      <div className="absolute top-3 right-3 text-[10px] font-mono text-text-secondary/70 bg-background/60 px-2 py-0.5 rounded border border-border-subtle">
        Interactive 3D Demo
      </div>

      {/* 3D Visual Stage */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 perspective-1000 flex items-center justify-center my-4">
        {/* Outer Orbit Rings */}
        <div
          className="absolute inset-0 rounded-full border border-dashed transition-all duration-700 pointer-events-none"
          style={{
            borderColor: current.color + "44",
            transform: "rotateX(65deg) scale(1.15)",
          }}
        />
        <div
          className="absolute inset-4 rounded-full border transition-all duration-700 pointer-events-none"
          style={{
            borderColor: current.color + "22",
            transform: "rotateX(65deg) scale(0.9)",
          }}
        />

        {/* Floating 3D Shield Element */}
        <div
          className="relative w-44 h-44 flex items-center justify-center transform-style-3d animate-float-3d transition-transform duration-500"
          style={{
            filter: `drop-shadow(0 0 30px ${current.glowColor})`,
          }}
        >
          {/* Hexagonal Shield Background Plate */}
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-panel via-elevated to-background border-2 transition-all duration-500 flex items-center justify-center"
            style={{
              borderColor: current.color,
              boxShadow: `inset 0 0 20px ${current.color}22`,
            }}
          >
            {/* Inner Cyber Circuit Grid Pattern */}
            <div className="absolute inset-2 rounded-2xl cyber-grid opacity-40 pointer-events-none" />

            {/* Central Server Core */}
            <div className="relative flex flex-col items-center justify-center gap-1.5 z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-lg"
                style={{
                  backgroundColor: "#080D18",
                  borderColor: current.color,
                }}
              >
                <Shield
                  className="w-9 h-9 transition-colors duration-500"
                  style={{ color: current.color }}
                />
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] font-semibold text-text-primary">
                <span
                  className="w-2 h-2 rounded-full transition-colors duration-500"
                  style={{
                    backgroundColor: current.color,
                    boxShadow: `0 0 8px ${current.color}`,
                  }}
                />
                <span className="truncate max-w-[120px]">{activeState}</span>
              </div>
            </div>
          </div>

          {/* Surrounding Node Badges in 3D Space */}
          <div
            className="absolute -top-3 -right-3 px-2 py-1 rounded-md bg-background/90 border text-[10px] font-mono flex items-center gap-1 shadow-md transition-colors duration-500"
            style={{ borderColor: current.color + "66" }}
          >
            <Server className="w-3 h-3 text-text-secondary" />
            <span>Origin: Safe</span>
          </div>

          <div
            className="absolute -bottom-3 -left-3 px-2 py-1 rounded-md bg-background/90 border text-[10px] font-mono flex items-center gap-1 shadow-md transition-colors duration-500"
            style={{ borderColor: current.color + "66" }}
          >
            <RefreshCw className="w-3 h-3 text-text-secondary" />
            <span>Proxy: Enforcing</span>
          </div>
        </div>
      </div>

      {/* State Explanation Banner */}
      <div className="w-full max-w-md bg-elevated/80 border border-border-subtle rounded-xl p-4 space-y-2 text-left transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {current.icon}
            <h4 className="text-sm font-bold text-text-primary">{current.title}</h4>
          </div>
          <span
            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${current.badgeClass}`}
          >
            {current.statusText}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">{current.explanation}</p>
      </div>

      {/* State Interactive Switcher Controls */}
      {showControls && (
        <div className="w-full max-w-md mt-4 pt-3 border-t border-border-subtle/70">
          <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-wider mb-2 text-center">
            Simulate Protection Lifecycle States
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["MONITORING", "ANOMALY_DETECTED", "MITIGATING", "RECOVERY"] as ShieldVisualState[]).map(
              (state) => {
                const isActive = activeState === state;
                return (
                  <button
                    key={state}
                    type="button"
                    onClick={() => setActiveState(state)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium transition-all text-center border ${
                      isActive
                        ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-bold shadow-sm"
                        : "bg-panel/70 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-subtle/80"
                    }`}
                  >
                    {state === "MONITORING" && "1. Baseline"}
                    {state === "ANOMALY_DETECTED" && "2. Spike"}
                    {state === "MITIGATING" && "3. Mitigate"}
                    {state === "RECOVERY" && "4. Clean"}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityIcon({ color }: { color: string }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
