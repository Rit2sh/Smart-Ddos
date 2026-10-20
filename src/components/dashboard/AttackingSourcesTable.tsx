import React from "react";
import { AttackingSource } from "@/lib/types";
import { ShieldX, Globe2 } from "lucide-react";

interface AttackingSourcesTableProps {
  sources: AttackingSource[];
}

export function AttackingSourcesTable({ sources }: AttackingSourcesTableProps) {
  return (
    <div className="cyber-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-brand-cyan" />
          <h3 className="text-sm font-bold tracking-tight text-text-primary">
            TOP OFFENDING ORIGIN SOURCES
          </h3>
        </div>
        <span className="text-[11px] font-mono text-status-critical flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-status-critical animate-ping"></span>
          REAL-TIME TELEMETRY
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-border-subtle text-text-secondary text-[11px]">
              <th className="pb-2 font-medium">SOURCE IP</th>
              <th className="pb-2 font-medium">GEO</th>
              <th className="pb-2 font-medium">AUTONOMOUS SYSTEM (ASN)</th>
              <th className="pb-2 font-medium">VOLUMETRIC RATE</th>
              <th className="pb-2 font-medium text-right">ENFORCEMENT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {sources.map((item) => (
              <tr key={item.ip} className="hover:bg-elevated/40 transition-colors">
                <td className="py-2.5 font-semibold text-brand-cyan">{item.ip}</td>
                <td className="py-2.5 text-text-primary">
                  <span className="px-1.5 py-0.5 rounded bg-elevated border border-border-subtle text-[10px]">
                    {item.country}
                  </span>
                </td>
                <td className="py-2.5 text-text-secondary truncate max-w-[200px]">{item.asn}</td>
                <td className="py-2.5 text-status-critical font-bold">
                  {item.rps.toLocaleString()} RPS
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "BLOCKED"
                        ? "bg-status-critical/15 text-status-critical border border-status-critical/30"
                        : item.status === "CHALLENGED"
                        ? "bg-status-warning/15 text-status-warning border border-status-warning/30"
                        : "bg-brand-blue/15 text-brand-blue border border-brand-blue/30"
                    }`}
                  >
                    <ShieldX className="w-3 h-3" />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
