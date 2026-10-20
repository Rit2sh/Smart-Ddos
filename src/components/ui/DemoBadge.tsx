"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 ${className}`}
      title="Notice: Synthetic telemetry stream active for staging demonstration"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <ShieldAlert className="w-3.5 h-3.5" />
      <span>SIMULATION TELEMETRY (DEMO)</span>
    </div>
  );
}
