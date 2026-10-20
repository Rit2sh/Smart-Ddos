"use client";

import React, { useState } from "react";
import { FileText, Download, ShieldCheck, CheckCircle2, Database, ShieldAlert, Sparkles } from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  period: string;
  peakAttack: string;
  totalAttacksBlocked: string;
  mitigationSuccess: string;
  size: string;
  executiveSummary: string;
}

const REPORTS: ReportItem[] = [
  {
    id: "rep_2026_10",
    title: "October 2026 Monthly Threat & Mitigation Digest",
    period: "Oct 1, 2026 - Oct 21, 2026",
    peakAttack: "184,500 RPS",
    totalAttacksBlocked: "14 Attacks",
    mitigationSuccess: "99.98%",
    size: "2.4 MB PDF",
    executiveSummary: `Smart DDoS Shield Monthly Executive Defense Digest - October 2026
Tenant: Shield Cyber Corp
Protected Assets: api.shield-enterprise.io, portal.shield-enterprise.io, auth.shield-enterprise.io
Attacks Mitigated: 14 multi-vector Layer 4 & Layer 7 floods
Peak Attack Rate: 184,500 RPS
Total Malicious Traffic Dropped: 640.3 GB
Clean Origin Traffic Delivered: 99.98% SLA preserved
Autonomous Mitigations: Adaptive rate-limiting, stateless SYN cookies, Anycast BGP community blackholing.`,
  },
  {
    id: "rep_2026_q3",
    title: "Q3 2026 Executive Cybersecurity & SLA Compliance Audit",
    period: "Jul 1, 2026 - Sep 30, 2026",
    peakAttack: "420,000 RPS",
    totalAttacksBlocked: "89 Attacks",
    mitigationSuccess: "99.99%",
    size: "6.1 MB PDF",
    executiveSummary: `Smart DDoS Shield Q3 2026 Cybersecurity & SLA Compliance Audit
Tenant: Shield Cyber Corp
Evaluation Standard: ISO/IEC 27001 & SOC 2 Type II Compliance Readiness
Total Incidents Triaged: 89
Origin Downtime: 0.00 minutes
Zero-downtime hot reload verification rate: 100%
Audit Trail Tamper-Proof Log Hash Integrity: VERIFIED.`,
  },
  {
    id: "rep_postmortem_api",
    title: "Forensic Post-Mortem: Core Payments API Gateway L7 Attack",
    period: "Oct 20, 2026",
    peakAttack: "184,500 RPS",
    totalAttacksBlocked: "1 Major Incident",
    mitigationSuccess: "100.0%",
    size: "1.1 MB PDF",
    executiveSummary: `Post-Mortem: Core Payments API Gateway (/api/v1/checkout)
Incident ID: inc_oct21_001
Attack Vector: DNS/NTP Amplification + HTTP GET Flood
Mitigation Enforced: 500 req/s adaptive rate-limiting via Local Proxy Adapter
Time to Mitigate: 3 minutes from anomaly onset
Impact: Legitimate customer checkouts preserved with 99.8% 200 OK rate.`,
  },
];

export default function ReportsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleDownloadReport = (report: ReportItem) => {
    setDownloadingId(report.id);
    const blob = new Blob([report.executiveSummary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.id}_executive_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback(`Report downloaded: ${report.title}`);
    setDownloadingId(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>DEFENSIVE AUDIT & EXECUTIVE THREAT REPORTS</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-brand-cyan/20 text-brand-cyan">
              COMPLIANCE READY
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Exportable attack forensics, SLA compliance proofs, and complete organization data bundles.
          </p>
        </div>

        {/* GDPR Export Button */}
        <a
          href="/api/v1/org/export"
          target="_blank"
          download
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-panel border border-brand-cyan/40 hover:border-brand-cyan text-brand-cyan transition-all font-mono shadow-glow"
        >
          <Database className="w-4 h-4" />
          <span>Export GDPR / CCPA Bundle</span>
        </a>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-status-success/15 border border-status-success/40 text-xs font-mono text-status-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS.map((report) => (
          <div key={report.id} className="cyber-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-lg bg-panel border border-brand-cyan/30 text-brand-cyan">
                <FileText className="w-5 h-5" />
              </div>

              <h3 className="text-sm font-bold text-text-primary mt-2">
                {report.title}
              </h3>
              <p className="text-xs font-mono text-text-secondary">
                Period: {report.period}
              </p>

              <div className="pt-2 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-text-secondary">
                  <span>Peak Attack:</span>
                  <span className="text-status-critical font-bold">{report.peakAttack}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Blocked Incidents:</span>
                  <span className="text-text-primary font-bold">{report.totalAttacksBlocked}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Defense SLA:</span>
                  <span className="text-status-success font-bold">{report.mitigationSuccess}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle/50 flex items-center justify-between">
              <span className="text-[11px] font-mono text-text-secondary">{report.size}</span>
              <button
                onClick={() => handleDownloadReport(report)}
                disabled={downloadingId === report.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-panel border border-border-subtle hover:border-brand-cyan hover:text-brand-cyan transition-colors font-mono disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingId === report.id ? "Exporting..." : "Export Digest"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
