import React from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { ShieldAlert, Server, Building2, Cpu, Globe, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const metrics = await DataService.getMetricsSummary();
  const collectors = await DataService.getCollectors();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>PLATFORM SUPERADMIN CONTROL CENTER</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-brand-cyan/20 text-brand-cyan">
              GLOBAL MESH
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Global edge collector topology, multi-tenant organizations, and background batch queues.
          </p>
        </div>

        <span className="text-xs font-mono text-status-success flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ALL 4 REGIONS OPERATIONAL</span>
        </span>
      </div>

      {/* Global Mesh Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-5 space-y-1">
          <div className="text-xs font-mono text-text-secondary uppercase">Active Tenant Orgs</div>
          <div className="text-2xl font-bold font-mono text-brand-cyan">18 Orgs</div>
          <div className="text-[11px] text-text-secondary">42 protected customer assets</div>
        </div>

        <div className="cyber-card p-5 space-y-1">
          <div className="text-xs font-mono text-text-secondary uppercase">Edge Collector Nodes</div>
          <div className="text-2xl font-bold font-mono text-status-success">
            {collectors.filter((c) => c.status === "HEALTHY").length} / {collectors.length} Online
          </div>
          <div className="text-[11px] text-status-success">Anycast BGP mesh active</div>
        </div>

        <div className="cyber-card p-5 space-y-1">
          <div className="text-xs font-mono text-text-secondary uppercase">Total Ingestion Rate</div>
          <div className="text-2xl font-bold font-mono text-text-primary">
            {metrics.currentRps.toLocaleString()} RPS
          </div>
          <div className="text-[11px] text-status-warning">78.4% filtered across edge</div>
        </div>

        <div className="cyber-card p-5 space-y-1">
          <div className="text-xs font-mono text-text-secondary uppercase">Background Jobs Queue</div>
          <div className="text-2xl font-bold font-mono text-brand-blue">0 Pending</div>
          <div className="text-[11px] text-status-success">Workers running optimally</div>
        </div>
      </div>

      {/* Collector Nodes Table */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-cyan" />
            <span>GLOBAL TELEMETRY COLLECTOR MESH NODES</span>
          </h3>
          <Link href="/admin/collectors" className="text-xs font-mono text-brand-cyan hover:underline">
            Manage Nodes →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-text-secondary text-[11px]">
                <th className="pb-2 font-medium">NODE IDENTIFIER</th>
                <th className="pb-2 font-medium">REGION</th>
                <th className="pb-2 font-medium">IP ADDRESS</th>
                <th className="pb-2 font-medium">DAEMON BUILD</th>
                <th className="pb-2 font-medium">INGRESS</th>
                <th className="pb-2 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {collectors.map((c) => (
                <tr key={c.id} className="hover:bg-elevated/40">
                  <td className="py-2.5 font-bold text-text-primary">{c.nodeIdentifier}</td>
                  <td className="py-2.5 text-text-secondary">{c.region}</td>
                  <td className="py-2.5 text-brand-cyan">{c.ipAddress}</td>
                  <td className="py-2.5 text-text-secondary">{c.version}</td>
                  <td className="py-2.5 text-text-primary font-bold">{c.ingestedGbps} Gbps</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === "HEALTHY"
                          ? "bg-status-success/15 text-status-success"
                          : "bg-status-warning/15 text-status-warning"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
