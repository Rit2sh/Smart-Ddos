import React from "react";
import { ThreatVector } from "@/lib/types";
import { Flame, ShieldAlert } from "lucide-react";

interface ThreatBreakdownProps {
  vectors: ThreatVector[];
}

export function ThreatBreakdown({ vectors }: ThreatBreakdownProps) {
  return (
    <div className="cyber-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-status-warning" />
          <h3 className="text-sm font-bold tracking-tight text-text-primary">
            ACTIVE ATTACK VECTORS
          </h3>
        </div>
        <span className="text-[11px] font-mono text-text-secondary">
          Past 24 Hours
        </span>
      </div>

      <div className="space-y-3">
        {vectors.map((item) => (
          <div key={item.vector} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-text-primary flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.vector}
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-text-secondary">{item.count.toLocaleString()} pkts/s</span>
                <span className="font-bold text-text-primary">{item.percentage}%</span>
              </div>
            </div>

            <div className="w-full bg-elevated rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-border-subtle/50 flex items-center gap-2 text-xs text-status-critical">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span className="text-[11px]">Automated mitigations active for all identified vector signatures.</span>
      </div>
    </div>
  );
}
