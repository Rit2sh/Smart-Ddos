import React from "react";
import { Cpu, RefreshCw, CheckCircle2, Clock } from "lucide-react";

export const revalidate = 0;

const JOBS = [
  {
    id: "job_dns_sweep_01",
    type: "DNS_CHALLENGE_SWEEP",
    status: "COMPLETED",
    schedule: "Every 5 minutes",
    lastRun: "1 minute ago",
    duration: "420ms",
    processed: "14 Pending Assets",
  },
  {
    id: "job_telemetry_agg_02",
    type: "TELEMETRY_ROLLUP_AGGREGATOR",
    status: "RUNNING",
    schedule: "Every 1 minute",
    lastRun: "Just now",
    duration: "180ms",
    processed: "12,400 Raw Batches",
  },
  {
    id: "job_threat_sync_03",
    type: "THREAT_INTELLIGENCE_FEED_SYNC",
    status: "COMPLETED",
    schedule: "Hourly",
    lastRun: "45 minutes ago",
    duration: "1.2s",
    processed: "420 IP Signatures Synced",
  },
  {
    id: "job_incident_postmortem_04",
    type: "INCIDENT_FORENSIC_ARCHIVER",
    status: "COMPLETED",
    schedule: "Triggered on resolution",
    lastRun: "3 hours ago",
    duration: "850ms",
    processed: "1 Incident Evidence Bundle",
  },
];

export default function AdminJobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>BACKGROUND JOBS & ASYNCHRONOUS WORKERS</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-status-success/15 text-status-success">
              WORKER POOL HEALTHY
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Cron schedulers, domain reverification sweeps, and telemetry rollup aggregators.
          </p>
        </div>
      </div>

      <div className="cyber-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-text-secondary text-[11px]">
                <th className="pb-3 font-medium">JOB IDENTIFIER</th>
                <th className="pb-3 font-medium">TASK TYPE</th>
                <th className="pb-3 font-medium">CADENCE / TRIGGER</th>
                <th className="pb-3 font-medium">LAST EXECUTION</th>
                <th className="pb-3 font-medium">EXECUTION TIME</th>
                <th className="pb-3 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {JOBS.map((job) => (
                <tr key={job.id} className="hover:bg-elevated/40">
                  <td className="py-3 font-bold text-text-primary">{job.id}</td>
                  <td className="py-3 text-brand-cyan">{job.type}</td>
                  <td className="py-3 text-text-secondary">{job.schedule}</td>
                  <td className="py-3 text-text-secondary">{job.lastRun}</td>
                  <td className="py-3 text-text-primary">{job.duration}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.status === "RUNNING"
                          ? "bg-brand-cyan/20 text-brand-cyan animate-pulse"
                          : "bg-status-success/15 text-status-success"
                      }`}
                    >
                      {job.status}
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
