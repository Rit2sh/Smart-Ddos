import React from "react";
import { DataService } from "@/lib/data-service";
import { Server, Plus, ShieldCheck, Terminal, Cpu } from "lucide-react";

export const revalidate = 0;

export default async function AdminCollectorsPage() {
  const collectors = await DataService.getCollectors();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>EDGE TELEMETRY COLLECTOR NODES</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-success/15 text-status-success">
              {collectors.length} DEPLOYED
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Distributed Linux bare-metal and containerized eBPF daemons streaming live traffic metrics.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow">
          <Plus className="w-4 h-4" />
          <span>Deploy Collector Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collectors.map((c) => (
          <div key={c.id} className="cyber-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-border-subtle text-text-secondary">
                  {c.region}
                </span>
                <h3 className="text-base font-bold text-text-primary mt-1">
                  {c.name}
                </h3>
                <div className="text-xs font-mono text-brand-cyan">{c.nodeIdentifier}</div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  c.status === "HEALTHY"
                    ? "bg-status-success/15 text-status-success border border-status-success/30"
                    : "bg-status-warning/15 text-status-warning border border-status-warning/30"
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
              <div className="p-2.5 rounded-lg bg-panel border border-border-subtle space-y-0.5">
                <span className="text-text-secondary text-[10px]">INGESTION LOAD</span>
                <div className="text-text-primary font-bold">{c.ingestedGbps} Gbps</div>
              </div>
              <div className="p-2.5 rounded-lg bg-panel border border-border-subtle space-y-0.5">
                <span className="text-text-secondary text-[10px]">DROPPED RATE</span>
                <div className="text-status-critical font-bold">{c.droppedPacketsRate}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-panel border border-border-subtle space-y-0.5">
                <span className="text-text-secondary text-[10px]">IP ADDRESS</span>
                <div className="text-text-primary">{c.ipAddress}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-panel border border-border-subtle space-y-0.5">
                <span className="text-text-secondary text-[10px]">HEARTBEAT</span>
                <div className="text-status-success">{c.lastHeartbeat}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-text-secondary">
              <span>Agent Build: v{c.version}</span>
              <button className="text-brand-cyan hover:underline">Restart Daemon</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
