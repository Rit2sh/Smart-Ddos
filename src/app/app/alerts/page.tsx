"use client";

import React, { useState } from "react";
import { Bell, ShieldAlert, CheckCircle2, Clock, Mail, Check, Filter } from "lucide-react";

interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  channel: string;
  timestamp: string;
  acknowledged: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "alt_01",
    title: "CRITICAL: Volumetric Threshold Exceeded on api.shield-enterprise.io",
    message: "Ingestion load peaked at 184,500 RPS (>500% baseline). Adaptive rate limiting automatically applied.",
    severity: "CRITICAL",
    channel: "SLACK & PAGERDUTY",
    timestamp: "12 minutes ago",
    acknowledged: false,
  },
  {
    id: "alt_02",
    title: "WARNING: High-Risk Bulletproof Hosting Traffic Burst",
    message: "15,400 RPS observed originating from autonomous system AS135905. JS challenge verification enforced.",
    severity: "WARNING",
    channel: "EMAIL",
    timestamp: "1 hour ago",
    acknowledged: true,
  },
  {
    id: "alt_03",
    title: "RESOLVED: TCP SYN Flood on portal.shield-enterprise.io",
    message: "State connection table returned to nominal baseline. Stateless SYN cookies absorbed 142 GB of malicious handshakes.",
    severity: "INFO",
    channel: "SLACK",
    timestamp: "3 hours ago",
    acknowledged: true,
  },
  {
    id: "alt_04",
    title: "WARNING: Edge Collector Node Degraded (AP-Southeast)",
    message: "Ingress packet loss exceeded 8% on node-apse-edge-charlie. Telemetry rerouted to Anycast secondary node.",
    severity: "WARNING",
    channel: "PAGERDUTY",
    timestamp: "5 hours ago",
    acknowledged: false,
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    setFeedback(`Alert ${id} acknowledged by operator.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    setFeedback("All active security alerts acknowledged.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === "ALL" || a.severity === filterSeverity
  );

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>SECURITY ALERTS & DISPATCH LOGS</span>
            {unacknowledgedCount > 0 ? (
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-critical/15 text-status-critical border border-status-critical/30 animate-pulse">
                {unacknowledgedCount} UNACKNOWLEDGED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-success/15 text-status-success border border-status-success/30">
                ALL ACKNOWLEDGED
              </span>
            )}
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time notifications dispatched across Webhook, Slack, PagerDuty, and email channels.
          </p>
        </div>

        {unacknowledgedCount > 0 && (
          <button
            onClick={handleAcknowledgeAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-panel border border-border-subtle hover:border-brand-cyan text-text-primary transition-all font-mono"
          >
            <Check className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Acknowledge All</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-status-success/15 border border-status-success/40 text-xs font-mono text-status-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-2 text-xs font-mono">
        <span className="text-text-muted flex items-center gap-1 text-[11px] uppercase mr-2">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {(["ALL", "CRITICAL", "WARNING", "INFO"] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
              filterSeverity === sev
                ? "bg-brand-cyan text-background shadow-glow"
                : "bg-panel text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="cyber-card p-8 text-center text-text-muted font-mono text-xs">
            No alerts matching severity filter &quot;{filterSeverity}&quot;.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`cyber-card p-5 space-y-3 transition-all ${
                !alert.acknowledged
                  ? "border-status-critical/40 bg-status-critical/5 shadow-glow-critical"
                  : "opacity-85"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        alert.severity === "CRITICAL"
                          ? "bg-status-critical text-background"
                          : alert.severity === "WARNING"
                          ? "bg-status-warning text-background"
                          : "bg-status-success text-background"
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono text-text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                    <span className="text-xs font-mono text-brand-cyan">
                      Delivered via: {alert.channel}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-text-primary mt-1">
                    {alert.title}
                  </h3>
                </div>

                {!alert.acknowledged ? (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all font-mono shrink-0 shadow-glow"
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-xs font-mono text-status-success flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Acknowledged
                  </span>
                )}
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {alert.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
