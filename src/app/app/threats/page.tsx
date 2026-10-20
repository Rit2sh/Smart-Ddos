import React from "react";
import { DataService } from "@/lib/data-service";
import { ThreatBreakdown } from "@/components/dashboard/ThreatBreakdown";
import { AttackingSourcesTable } from "@/components/dashboard/AttackingSourcesTable";
import { Flame, ShieldAlert, Cpu, Crosshair, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function ThreatIntelligencePage() {
  const threatVectors = await DataService.getThreatVectors();
  const attackingSources = await DataService.getAttackingSources();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>THREAT INTELLIGENCE & SIGNATURE RADAR</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-critical/15 text-status-critical">
              24-HOUR THREAT REPORT
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Global botnet heuristics, amplified reflector signatures, and behavioral anomaly cluster analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-status-success flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Signatures Updated: 2 min ago
          </span>
        </div>
      </div>

      {/* Threat Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="cyber-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-status-critical">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Primary Threat</span>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary">NTP & DNS Amplification</div>
          <p className="text-xs text-text-secondary">
            Reflected packets using spoofed UDP sources exceeding 180k RPS peak.
          </p>
        </div>

        <div className="cyber-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-status-warning">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Botnet Fingerprint</span>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary">Mirai-Variant / Reaper</div>
          <p className="text-xs text-text-secondary">
            Compromised IoT nodes cycling through rotating residential IP subnets.
          </p>
        </div>

        <div className="cyber-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-cyan">
            <Crosshair className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Defensive Action</span>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary">Automated BGP Community</div>
          <p className="text-xs text-text-secondary">
            Offending ASN subnets blackholed at upstream Tier-1 transit providers.
          </p>
        </div>
      </div>

      {/* Vector Distribution and Offending Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatBreakdown vectors={threatVectors} />
        <AttackingSourcesTable sources={attackingSources} />
      </div>
    </div>
  );
}
