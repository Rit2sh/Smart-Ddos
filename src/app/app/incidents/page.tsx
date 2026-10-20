import React from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { AlertTriangle, ShieldAlert, CheckCircle2, Zap, ArrowRight, Clock } from "lucide-react";

export const revalidate = 0;

export default async function IncidentsPage() {
  const incidents = await DataService.getIncidents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>DDoS SECURITY INCIDENTS & ATTACK LOGS</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-critical/15 text-status-critical">
              {incidents.filter((i) => i.status === "ACTIVE").length} ACTIVE
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Volumetric threshold anomalies, automated mitigation triggers, and post-attack forensics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-secondary">AUTO-MITIGATION:</span>
          <span className="px-2 py-1 rounded bg-status-success/15 border border-status-success/30 text-xs font-mono text-status-success font-semibold">
            ENFORCED
          </span>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="space-y-4">
        {incidents.map((incident) => {
          const isActive = incident.status === "ACTIVE";
          return (
            <div
              key={incident.id}
              className={`cyber-card p-6 transition-all ${
                isActive
                  ? "border-status-critical/40 shadow-glow-critical bg-status-critical/5"
                  : "hover:border-border-subtle"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        incident.severity === "CRITICAL"
                          ? "bg-status-critical text-background"
                          : incident.severity === "HIGH"
                          ? "bg-status-warning text-background"
                          : "bg-brand-blue text-background"
                      }`}
                    >
                      {incident.severity}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-status-critical/20 text-status-critical border border-status-critical/40 animate-pulse"
                          : "bg-status-success/15 text-status-success border border-status-success/30"
                      }`}
                    >
                      {incident.status}
                    </span>

                    <span className="text-xs font-mono text-text-secondary">
                      Asset: <span className="text-brand-cyan">{incident.assetDomain}</span>
                    </span>

                    <span className="text-xs font-mono text-text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Started: {new Date(incident.startedAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary">
                    {incident.title}
                  </h3>

                  <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
                    {incident.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                    <div className="text-text-secondary">
                      Peak RPS: <span className="text-text-primary font-bold">{incident.peakRps.toLocaleString()}</span>
                    </div>
                    <div className="text-text-secondary">
                      Total Volume: <span className="text-text-primary font-bold">{incident.totalVolumeGb} GB</span>
                    </div>
                    <div className="text-text-secondary">
                      Vectors: <span className="text-brand-cyan">{incident.attackVector}</span>
                    </div>
                    <div className="text-text-secondary">
                      Sources: <span className="text-text-primary">{incident.topSourceCountries.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/app/incidents/${incident.id}`}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-glow ${
                      isActive
                        ? "bg-status-critical text-white hover:bg-status-critical/90"
                        : "bg-panel border border-border-subtle hover:border-brand-cyan/50 text-text-primary"
                    }`}
                  >
                    <span>{isActive ? "Inspect & Mitigate" : "View Forensics"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Mitigation action summary badge */}
              <div className="mt-4 pt-3 border-t border-border-subtle/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-text-secondary text-[11px] font-mono">
                  <Zap className="w-3.5 h-3.5 text-status-warning" />
                  <span>Defensive Action: {incident.mitigationSummary}</span>
                </div>
                <span className="text-[11px] font-mono text-text-secondary/70">
                  {incident.evidenceCount} forensic packets logged
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
