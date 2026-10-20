import React from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { ThreatBreakdown } from "@/components/dashboard/ThreatBreakdown";
import { AttackingSourcesTable } from "@/components/dashboard/AttackingSourcesTable";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Radio,
  PlusCircle,
  ShieldAlert,
  Server,
  Zap,
} from "lucide-react";

export const revalidate = 0;

export default async function AppDashboardPage() {
  const metrics = await DataService.getMetricsSummary();
  const trafficData = await DataService.getTrafficHistory(20);
  const threatVectors = await DataService.getThreatVectors();
  const attackingSources = await DataService.getAttackingSources();
  const collectors = await DataService.getCollectors();
  const incidents = await DataService.getIncidents();

  const activeIncident = incidents.find((i) => i.status === "ACTIVE");

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if active incident */}
      {activeIncident && (
        <div className="p-4 rounded-xl bg-status-critical/10 border border-status-critical/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-glow-critical">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-critical/20 text-status-critical">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-status-critical text-background uppercase">
                  ACTIVE CRITICAL THREAT
                </span>
                <span className="text-xs text-text-secondary font-mono">
                  Asset: {activeIncident.assetDomain}
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary mt-1">
                {activeIncident.title} - Peak Rate: {activeIncident.peakRps.toLocaleString()} RPS
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/app/incidents/${activeIncident.id}`}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-status-critical text-white hover:bg-status-critical/90 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Inspect & Mitigate</span>
            </Link>
          </div>
        </div>
      )}

      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>DEFENSIVE TELEMETRY & ATTACK RADAR</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-success"></span>
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1 flex items-center gap-2 font-mono">
            <span>CLUSTER STATUS: NORMALIZED</span>
            <span>•</span>
            <span className="text-brand-cyan">TELEMETRY FRESHNESS: {metrics.telemetryFreshnessSeconds}s</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/assets/new"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Protect New Asset</span>
          </Link>
          <Link
            href="/app/policies"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-panel border border-border-subtle hover:border-brand-blue/50 text-text-primary transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-brand-blue" />
            <span>Defense Rules</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Ingestion RPS"
          value={metrics.currentRps.toLocaleString()}
          subtitle="Real-time edge packet load"
          icon={Activity}
          variant="cyan"
          trend={{ value: "+28.4%", isPositive: false, label: "vs 1h avg" }}
        />
        <MetricCard
          title="Mitigation Effectiveness"
          value={`${metrics.mitigationSuccessRate}%`}
          subtitle="Packets dropped without latency penalty"
          icon={ShieldCheck}
          variant="success"
          trend={{ value: "+0.15%", isPositive: true, label: "Clean stream SLA" }}
        />
        <MetricCard
          title="Active Attack Incidents"
          value={metrics.activeIncidentsCount}
          subtitle="Volumetric & L7 anomalies undergoing triage"
          icon={AlertTriangle}
          variant="critical"
          trend={{ value: "1 Active", isPositive: false, label: "Immediate Action" }}
        />
        <MetricCard
          title="Protected Endpoints"
          value={`${metrics.protectedAssetsCount} Assets`}
          subtitle="4 Edge collectors routing traffic"
          icon={Globe}
          variant="blue"
          trend={{ value: "4/4 Nodes Healthy", isPositive: true, label: "Edge mesh" }}
        />
      </div>

      {/* Main Visual Traffic Time-Series Chart */}
      <TrafficChart data={trafficData} />

      {/* Two Column Section: Threat Vectors & Offending Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatBreakdown vectors={threatVectors} />
        <AttackingSourcesTable sources={attackingSources} />
      </div>

      {/* Collector Nodes Health Summary Bar */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-bold tracking-tight text-text-primary">
              DISTRIBUTED EDGE COLLECTOR MESH
            </h3>
          </div>
          <Link
            href="/admin/collectors"
            className="text-xs font-mono text-brand-cyan hover:underline"
          >
            View All Edge Nodes →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collectors.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-lg bg-elevated/60 border border-border-subtle text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary truncate">{c.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    c.status === "HEALTHY"
                      ? "bg-status-success/15 text-status-success"
                      : "bg-status-warning/15 text-status-warning"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="font-mono text-[11px] text-text-secondary space-y-0.5">
                <div>Region: {c.region}</div>
                <div>Ingress: {c.ingestedGbps} Gbps</div>
                <div>Heartbeat: {c.lastHeartbeat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
