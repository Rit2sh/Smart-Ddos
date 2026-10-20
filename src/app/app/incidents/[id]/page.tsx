"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IncidentRecord } from "@/lib/data-service";
import { PolicyImpactPreview } from "@/lib/enforcement/adapter-contract";
import { ProxyVerificationResult, IncidentStatus } from "@/lib/types";
import { AIAnalysisResult } from "@/lib/ai/incident-analyst";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Globe2,
  Cpu,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RotateCcw,
  Sliders,
  Eye,
  Check,
  Sparkles,
  Bot,
  CheckSquare,
  HelpCircle,
  FileText,
  Copy,
  Info,
} from "lucide-react";

export default function IncidentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [incident, setIncident] = useState<IncidentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // AI SecOps Analyst State
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});

  // Policy Enforcement State
  const [adapterType, setAdapterType] = useState<"LOCAL_PROXY" | "CLOUDFLARE_WAF" | "AWS_SHIELD" | "SIMULATION">("LOCAL_PROXY");
  const [targetRoute, setTargetRoute] = useState("/v1/checkout");
  const [rateLimit, setRateLimit] = useState(500);
  const [burstLimit, setBurstLimit] = useState(50);
  const [preview, setPreview] = useState<PolicyImpactPreview | null>(null);
  const [enforcing, setEnforcing] = useState(false);
  const [appliedPolicyId, setAppliedPolicyId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<ProxyVerificationResult | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    async function loadIncident() {
      try {
        const res = await fetch(`/api/incidents?id=${id}`);
        const data = await res.json();
        if (data.incident) {
          setIncident(data.incident);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    if (id) loadIncident();
  }, [id]);

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/v1/incidents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          resolutionReason: newStatus === "RESOLVED" ? "Defensive rate-limiting enforced; traffic normalized." : undefined,
          mitigationNote: `Operator transitioned incident status to ${newStatus}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.incident) {
        setIncident(data.incident);
        setActionFeedback(`Incident status updated to: ${newStatus}`);
      }
    } catch {
      setActionFeedback("Failed to update incident status");
    } finally {
      setStatusUpdating(false);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleAnalyzeAI = async () => {
    if (!id) return;
    setAnalyzingAI(true);
    setActionFeedback("Requesting SecOps AI investigation synthesis...");
    try {
      const res = await fetch("/api/v1/ai/analyze-incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentId: id }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
        setActionFeedback(`Investigation complete: Analyzed via ${data.analysis.provider}`);
      } else {
        setActionFeedback("Failed to synthesize AI investigation");
      }
    } catch {
      setActionFeedback("Error communicating with SecOps AI service");
    } finally {
      setAnalyzingAI(false);
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  const handleApplySuggestedMitigation = () => {
    if (!aiAnalysis?.suggestedMitigation) return;
    const mit = aiAnalysis.suggestedMitigation;
    setTargetRoute(mit.recommendedRoute);
    if (mit.recommendedRateLimit) {
      setRateLimit(mit.recommendedRateLimit);
      setBurstLimit(Math.round(mit.recommendedRateLimit * 0.1));
    }
    setActionFeedback(`Loaded AI suggested mitigation parameters for ${mit.recommendedRoute}`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleCopyReport = () => {
    if (!aiAnalysis?.postIncidentReportDraft) return;
    navigator.clipboard.writeText(aiAnalysis.postIncidentReportDraft);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  const handlePreview = async () => {
    if (!incident) return;
    try {
      const res = await fetch("/api/v1/policies/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: incident.assetId,
          assetDomain: incident.assetDomain,
          name: `Rate Limit for ${incident.title}`,
          targetRoute,
          rateLimitPerSecond: Number(rateLimit),
          burstLimit: Number(burstLimit),
          adapterType,
        }),
      });
      const data = await res.json();
      if (data.preview) {
        setPreview(data.preview);
        setActionFeedback("Policy preview generated. Inspect calculated impact below.");
      }
    } catch {
      setActionFeedback("Failed to preview policy impact.");
    }
  };

  const handleApply = async () => {
    if (!incident) return;
    setEnforcing(true);
    try {
      const res = await fetch("/api/v1/policies/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: incident.assetId,
          assetDomain: incident.assetDomain,
          name: `Emergency Mitigation: ${incident.title}`,
          targetRoute,
          rateLimitPerSecond: Number(rateLimit),
          burstLimit: Number(burstLimit),
          adapterType,
          forceOverride: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.policy) {
        setAppliedPolicyId(data.policy.id);
        setActionFeedback(`Defensive policy enforced via ${adapterType}. Status: ${data.result.status}`);
        handleStatusChange("MITIGATING");
      } else {
        setActionFeedback(`Error: ${data.error}`);
      }
    } catch {
      setActionFeedback("Failed to apply defensive policy.");
    } finally {
      setEnforcing(false);
    }
  };

  const handleVerify = async () => {
    if (!appliedPolicyId) return;
    try {
      const res = await fetch(`/api/v1/policies/${appliedPolicyId}/verify`, { method: "POST" });
      const data = await res.json();
      if (data.verification) {
        setVerificationResult(data.verification);
        setActionFeedback(`Verification ${data.verification.status}: ${data.verification.details}`);
        handleStatusChange("MONITORING");
      }
    } catch {
      setActionFeedback("Verification check failed.");
    }
  };

  const handleRollback = async () => {
    if (!appliedPolicyId) return;
    try {
      const res = await fetch(`/api/v1/policies/${appliedPolicyId}/rollback`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setActionFeedback(`Policy successfully rolled back to baseline configuration.`);
        setAppliedPolicyId(null);
        setVerificationResult(null);
        setPreview(null);
      }
    } catch {
      setActionFeedback("Rollback failed.");
    }
  };

  if (loading) {
    return (
      <div className="cyber-card p-12 text-center text-text-secondary font-mono text-sm">
        Loading forensic packet timeline...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="space-y-4">
        <Link href="/app/incidents" className="text-xs text-brand-cyan hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents
        </Link>
        <div className="cyber-card p-8 text-center text-status-critical text-sm">
          Incident record not found.
        </div>
      </div>
    );
  }

  const isActive = incident.status === "ACTIVE" || incident.status === "OPEN" || incident.status === "MITIGATING";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href="/app/incidents"
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-brand-cyan transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Incidents</span>
      </Link>

      {/* Incident Header */}
      <div className="cyber-card p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                incident.severity === "CRITICAL"
                  ? "bg-status-critical text-background"
                  : "bg-status-warning text-background"
              }`}
            >
              {incident.severity}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isActive
                  ? "bg-status-critical/15 text-status-critical border border-status-critical/30 animate-pulse"
                  : "bg-status-success/15 text-status-success border border-status-success/30"
              }`}
            >
              {incident.status}
            </span>
            <span className="text-xs font-mono text-text-muted">{incident.id}</span>
          </div>
          <h1 className="text-lg font-bold text-text-primary tracking-wide">{incident.title}</h1>
          <p className="text-xs text-text-secondary">{incident.description}</p>
        </div>

        {/* Operational Status Workflow Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {incident.status !== "INVESTIGATING" && incident.status !== "RESOLVED" && (
              <button
                onClick={() => handleStatusChange("INVESTIGATING")}
                disabled={statusUpdating}
                className="px-2.5 py-1 text-xs font-mono rounded bg-panel border border-border-subtle hover:border-brand-cyan text-text-secondary hover:text-text-primary"
              >
                Mark Investigating
              </button>
            )}
            {incident.status !== "MONITORING" && incident.status !== "RESOLVED" && (
              <button
                onClick={() => handleStatusChange("MONITORING")}
                disabled={statusUpdating}
                className="px-2.5 py-1 text-xs font-mono rounded bg-panel border border-border-subtle hover:border-brand-cyan text-text-secondary hover:text-text-primary"
              >
                Mark Monitoring
              </button>
            )}
            {incident.status !== "RESOLVED" && (
              <button
                onClick={() => handleStatusChange("RESOLVED")}
                disabled={statusUpdating}
                className="px-2.5 py-1 text-xs font-mono rounded bg-status-success/20 border border-status-success/40 text-status-success hover:bg-status-success/30 font-bold"
              >
                Resolve Incident
              </button>
            )}
            {incident.status === "RESOLVED" && (
              <button
                onClick={() => handleStatusChange("REOPENED")}
                disabled={statusUpdating}
                className="px-2.5 py-1 text-xs font-mono rounded bg-status-warning/20 border border-status-warning/40 text-status-warning hover:bg-status-warning/30 font-bold"
              >
                Reopen Incident
              </button>
            )}
          </div>
          <div className="text-[11px] font-mono text-text-muted text-right">
            Started: {new Date(incident.startedAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div className="p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-mono text-brand-cyan flex items-center justify-between">
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI SecOps Incident Analyst Section */}
      {/* ========================================================================= */}
      <div className="cyber-card p-5 border border-brand-cyan/30 bg-gradient-to-br from-panel via-surface to-panel relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/15 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text-primary tracking-wide">AI SecOps Incident Analyst</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                  {aiAnalysis ? aiAnalysis.provider : "STANDBY"}
                </span>
                {!aiAnalysis?.isAIAvailable && aiAnalysis && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-text-muted bg-panel border border-border-subtle">
                    Deterministic Engine Fallback
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-secondary">
                Synthesizes forensic telemetry, distinguishes measured facts from hypotheses, and recommends bounded defensive mitigations.
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyzeAI}
            disabled={analyzingAI}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-cyan text-background text-xs font-bold transition-all shadow-glow hover:bg-brand-cyan/90 shrink-0 font-mono disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{analyzingAI ? "Synthesizing Telemetry..." : aiAnalysis ? "Re-Analyze Incident" : "Run AI Investigation"}</span>
          </button>
        </div>

        {aiAnalysis ? (
          <div className="space-y-4 pt-2 border-t border-border-subtle">
            {/* Plain-Language Summary */}
            <div className="p-3.5 rounded-lg bg-elevated/70 border border-border-subtle space-y-1.5">
              <div className="text-[11px] font-mono font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Executive Plain-Language Summary</span>
              </div>
              <p className="text-xs text-text-primary leading-relaxed">
                {aiAnalysis.plainLanguageSummary}
              </p>
              <div className="text-[11px] text-text-secondary pt-1 border-t border-border-subtle/50">
                <span className="font-semibold text-text-primary">Traffic Delta vs Baseline: </span>
                {aiAnalysis.trafficDeltaExplanation}
              </div>
            </div>

            {/* Measured Facts vs Hypotheses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-panel border border-status-success/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-status-success">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MEASURED FACTS (Forensic Evidence)</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-text-secondary">
                  {aiAnalysis.measuredFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-status-success font-mono font-bold shrink-0">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-panel border border-status-warning/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-status-warning">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>HYPOTHESES & ATTRIBUTION (Unverified)</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-text-secondary">
                  {aiAnalysis.hypotheses.map((hypo, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-status-warning font-mono font-bold shrink-0">?</span>
                      <span>{hypo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggested Defensive Action & Detection Rule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-panel border border-brand-cyan/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-cyan flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>SUGGESTED MITIGATION</span>
                  </span>
                  <button
                    onClick={handleApplySuggestedMitigation}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 border border-brand-cyan/40"
                  >
                    Load into Policy Form
                  </button>
                </div>
                <div className="text-[11px] space-y-1 text-text-secondary">
                  <div>
                    <span className="text-text-primary font-semibold">Action:</span> {aiAnalysis.suggestedMitigation.actionType} on {aiAnalysis.suggestedMitigation.recommendedRoute}
                  </div>
                  {aiAnalysis.suggestedMitigation.recommendedRateLimit && (
                    <div>
                      <span className="text-text-primary font-semibold">Recommended Threshold:</span> {aiAnalysis.suggestedMitigation.recommendedRateLimit} req/sec
                    </div>
                  )}
                  <div>
                    <span className="text-text-primary font-semibold">Rationale:</span> {aiAnalysis.suggestedMitigation.rationale}
                  </div>
                  <div className="text-status-success">
                    <span className="font-semibold">Expected Impact:</span> {aiAnalysis.suggestedMitigation.impactEstimate}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-panel border border-border-subtle space-y-2">
                <span className="text-xs font-mono font-bold text-text-primary flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-status-warning" />
                  <span>DETECTION RULE EXPLANATION</span>
                </span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {aiAnalysis.detectionRuleExplanation}
                </p>
                <div className="text-[10px] font-mono text-text-muted">
                  Deterministic validation: Policy preview & human authorization required prior to activation.
                </div>
              </div>
            </div>

            {/* Investigation Checklist */}
            <div className="p-3.5 rounded-lg bg-panel border border-border-subtle space-y-2">
              <div className="text-xs font-mono font-bold text-text-primary flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-brand-cyan" />
                <span>INVESTIGATION CHECKLIST</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiAnalysis.investigationChecklist.map((task, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded bg-surface border border-border-subtle cursor-pointer hover:border-brand-cyan/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!completedTasks[idx]}
                      onChange={() => setCompletedTasks((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className="mt-0.5 rounded border-border-subtle text-brand-cyan focus:ring-0 bg-panel"
                    />
                    <span className={`text-[11px] ${completedTasks[idx] ? "line-through text-text-muted" : "text-text-secondary"}`}>
                      {task}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Post-Incident Report Draft */}
            <div className="p-3.5 rounded-lg bg-panel border border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-text-primary flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>POST-INCIDENT REPORT DRAFT</span>
                </span>
                <button
                  onClick={handleCopyReport}
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-panel border border-border-subtle hover:border-brand-cyan text-text-secondary hover:text-text-primary"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedReport ? "Copied!" : "Copy Markdown"}</span>
                </button>
              </div>
              <pre className="p-3 rounded bg-background border border-border-subtle text-[10px] font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {aiAnalysis.postIncidentReportDraft}
              </pre>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-text-muted font-mono text-xs">
            Click &quot;Run AI Investigation&quot; to synthesize evidence, compare traffic to baseline, and formulate mitigation suggestions.
          </div>
        )}
      </div>

      {/* Main Grid: Telemetry & Enforcement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Forensic Telemetry & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="cyber-card p-3.5 space-y-1">
              <div className="text-[11px] font-mono text-text-muted uppercase">Peak Attack Rate</div>
              <div className="text-lg font-bold font-mono text-status-critical">
                {incident.peakRps.toLocaleString()} <span className="text-xs">RPS</span>
              </div>
            </div>

            <div className="cyber-card p-3.5 space-y-1">
              <div className="text-[11px] font-mono text-text-muted uppercase">Total Volume</div>
              <div className="text-lg font-bold font-mono text-text-primary">
                {incident.totalVolumeGb} <span className="text-xs">GB</span>
              </div>
            </div>

            <div className="cyber-card p-3.5 space-y-1">
              <div className="text-[11px] font-mono text-text-muted uppercase">Attack Vector</div>
              <div className="text-xs font-bold font-mono text-brand-cyan truncate">
                {incident.attackVector}
              </div>
            </div>

            <div className="cyber-card p-3.5 space-y-1">
              <div className="text-[11px] font-mono text-text-muted uppercase">Target Asset</div>
              <div className="text-xs font-mono text-text-primary truncate">{incident.assetDomain}</div>
            </div>
          </div>

          {/* Evidence Timeline */}
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-sm font-semibold text-text-primary">Forensic Evidence Timeline</h3>
              </div>
              <span className="text-xs font-mono text-text-muted">{incident.evidenceCount} anomalies logged</span>
            </div>

            <div className="space-y-3">
              {incident.evidences && incident.evidences.length > 0 ? (
                incident.evidences.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-lg bg-panel border border-border-subtle space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-brand-cyan font-bold">{ev.evidenceType}</span>
                      <span className="text-text-muted">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-text-secondary">{ev.summary}</p>
                    {ev.sourceIp && (
                      <div className="text-[11px] font-mono text-text-muted">Offending IP: {ev.sourceIp}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-lg bg-panel border border-border-subtle text-xs text-text-secondary">
                  No discrete evidence items logged for this incident yet.
                </div>
              )}
            </div>
          </div>

          {/* Source Geolocation & Mitigation Log */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="cyber-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                <Globe2 className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Top Origin Geographies</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {incident.topSourceCountries.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded text-xs font-mono bg-panel border border-border-subtle text-text-primary"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="cyber-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Mitigation Summary</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed pt-1">
                {incident.mitigationSummary || "No autonomous mitigation applied yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Defensive Policy Engine & Reverse-Proxy Enforcement */}
        <div className="space-y-6">
          <div className="cyber-card p-5 space-y-4 border-brand-cyan/20">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">Defensive Policy Enforcement</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-text-secondary uppercase">Enforcement Adapter</label>
                <select
                  value={adapterType}
                  onChange={(e) => setAdapterType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                >
                  <option value="LOCAL_PROXY">Local NGINX / Envoy Reverse Proxy (Configured)</option>
                  <option value="SIMULATION">In-Memory Sandbox Simulation (Live Verified)</option>
                  <option value="CLOUDFLARE_WAF">Cloudflare WAF (Awaiting Credentials)</option>
                  <option value="AWS_SHIELD">AWS WAF & Shield (Awaiting Credentials)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-text-secondary uppercase">Target Sensitive Route</label>
                <input
                  type="text"
                  value={targetRoute}
                  onChange={(e) => setTargetRoute(e.target.value)}
                  placeholder="/v1/checkout"
                  className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-text-secondary uppercase">Rate Limit (req/s)</label>
                  <input
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-text-secondary uppercase">Burst Limit</label>
                  <input
                    type="number"
                    value={burstLimit}
                    onChange={(e) => setBurstLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                  />
                </div>
              </div>

              <button
                onClick={handlePreview}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-panel border border-border-subtle hover:border-brand-cyan/50 text-xs font-semibold text-text-primary transition-all font-mono"
              >
                <Eye className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Preview Policy Impact</span>
              </button>

              {/* Preview Card */}
              {preview && (
                <div className="p-3.5 rounded-lg bg-elevated/90 border border-brand-cyan/30 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between font-bold text-text-primary">
                    <span>IMPACT PREVIEW</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${preview.riskOfFalsePositives === "HIGH" ? "bg-status-critical/20 text-status-critical" : "bg-status-success/20 text-status-success"}`}>
                      RISK: {preview.riskOfFalsePositives}
                    </span>
                  </div>
                  <div className="space-y-1 text-text-secondary text-[11px]">
                    <div>Est. Total Load: {preview.estimatedTotalRps} RPS</div>
                    <div className="text-status-critical">Est. Drops: {preview.estimatedBlockedRps} RPS</div>
                    <div className="text-status-success">Est. Clean Passed: {preview.estimatedCleanRps} RPS</div>
                  </div>
                  {preview.warnings.length > 0 && (
                    <div className="text-[10px] text-status-warning">
                      {preview.warnings.join(" ")}
                    </div>
                  )}

                  {!appliedPolicyId && (
                    <button
                      onClick={handleApply}
                      disabled={enforcing}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-status-critical text-white text-xs font-bold transition-all shadow-glow hover:bg-status-critical/90"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{enforcing ? "Enforcing..." : "Authorize & Enforce Policy"}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Verified & Rollback Controls */}
              {appliedPolicyId && (
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <button
                    onClick={handleVerify}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-cyan text-background text-xs font-bold transition-all shadow-glow hover:bg-brand-cyan/90"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify Active Enforcement</span>
                  </button>

                  <button
                    onClick={handleRollback}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-panel border border-border-subtle hover:border-status-warning text-status-warning text-xs font-semibold transition-all font-mono"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rollback Policy to Baseline</span>
                  </button>
                </div>
              )}

              {/* Verification Outcome Card */}
              {verificationResult && (
                <div className="p-3 rounded-lg bg-status-success/15 border border-status-success/40 text-xs font-mono space-y-1 text-status-success">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFICATION {verificationResult.status}</span>
                  </div>
                  <div className="text-[11px] text-text-primary leading-relaxed">
                    {verificationResult.details}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
