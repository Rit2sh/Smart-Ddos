import React from "react";
import { DataService } from "@/lib/data-service";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { Activity, Radio, Cpu, Network, Zap } from "lucide-react";

export const revalidate = 0;

export default async function TrafficAnalyticsPage() {
  const trafficData = await DataService.getTrafficHistory(24);
  const metrics = await DataService.getMetricsSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>TRAFFIC TELEMETRY & INGESTION STREAM</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-success/15 text-status-success">
              LIVE 1.4s
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Global edge collector ingestion breakdown across L3/L4 transport layers and L7 HTTP protocols.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-secondary">RESOLUTION:</span>
          <span className="px-2 py-1 rounded bg-panel border border-border-subtle text-xs font-mono text-brand-cyan">
            1-SECOND WINDOWS
          </span>
        </div>
      </div>

      {/* Traffic KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-4 space-y-1">
          <div className="text-xs font-mono text-text-secondary uppercase">Ingested Volume (24h)</div>
          <div className="text-2xl font-bold font-mono text-brand-cyan">18.42 TB</div>
          <div className="text-[11px] text-text-secondary">Across 4 edge collector zones</div>
        </div>
        <div className="cyber-card p-4 space-y-1">
          <div className="text-xs font-mono text-text-secondary uppercase">Packets Inspected</div>
          <div className="text-2xl font-bold font-mono text-text-primary">1.28 Billion</div>
          <div className="text-[11px] text-status-success">0.02ms eBPF filter latency</div>
        </div>
        <div className="cyber-card p-4 space-y-1">
          <div className="text-xs font-mono text-text-secondary uppercase">Mitigated Attack Traffic</div>
          <div className="text-2xl font-bold font-mono text-status-critical">485.4 GB</div>
          <div className="text-[11px] text-status-critical">Volumetric drops at edge</div>
        </div>
        <div className="cyber-card p-4 space-y-1">
          <div className="text-xs font-mono text-text-secondary uppercase">Global Clean Traffic SLA</div>
          <div className="text-2xl font-bold font-mono text-status-success">99.99%</div>
          <div className="text-[11px] text-text-secondary">Zero legitimate packet drops</div>
        </div>
      </div>

      {/* High-res Time-series Graph */}
      <TrafficChart data={trafficData} />

      {/* Multi-Layer Ingestion Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-brand-cyan" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-primary font-bold">
              Layer 4 TCP / SYN
            </h4>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary">94,200 RPS</div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Stateless SYN cookies absorbing burst handshakes without exhausting memory connection tables.
          </p>
          <div className="text-[11px] font-mono text-status-success">
            Status: Fully Absorbed (0 drops on legit)
          </div>
        </div>

        <div className="cyber-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-status-warning" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-primary font-bold">
              Layer 4 UDP Amplification
            </h4>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary">112,000 RPS</div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Reflected DNS/NTP packets dropped at edge BPF kernel ring buffers prior to application stack.
          </p>
          <div className="text-[11px] font-mono text-status-critical">
            Status: 100% Rate-Filtered at Edge
          </div>
        </div>

        <div className="cyber-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-blue" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-primary font-bold">
              Layer 7 HTTP / API Requests
            </h4>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary">32,700 RPS</div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Cryptographic JS challenges and token rate limits protecting expensive database query routes.
          </p>
          <div className="text-[11px] font-mono text-brand-cyan">
            Status: 341 Challenges Solved / min
          </div>
        </div>
      </div>
    </div>
  );
}
