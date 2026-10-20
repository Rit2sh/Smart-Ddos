"use client";

import React, { useEffect, useState } from "react";
import { DefensivePolicy, ProxyVerificationResult } from "@/lib/types";
import { PolicyImpactPreview } from "@/lib/enforcement/adapter-contract";
import { Sliders, ShieldCheck, ShieldAlert, Plus, CheckCircle2, RotateCcw, Eye, Zap, AlertTriangle } from "lucide-react";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<DefensivePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Policy Form State
  const [name, setName] = useState("");
  const [targetRoute, setTargetRoute] = useState("/api/v1/checkout");
  const [rateLimit, setRateLimit] = useState(500);
  const [burstLimit, setBurstLimit] = useState(50);
  const [adapterType, setAdapterType] = useState<"LOCAL_PROXY" | "CLOUDFLARE_WAF" | "AWS_SHIELD" | "SIMULATION">("LOCAL_PROXY");
  const [preview, setPreview] = useState<PolicyImpactPreview | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPolicies() {
      try {
        const res = await fetch("/api/v1/policies/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assetId: "ast_prod_api_01",
            assetDomain: "api.shield-enterprise.io",
            name: "Initial Preview",
            targetRoute: "/api/v1/checkout",
            rateLimitPerSecond: 500,
            burstLimit: 50,
            adapterType: "LOCAL_PROXY",
          }),
        });
        // Seed default view
        setPolicies([
          {
            id: "pol_def_01",
            organizationId: "org_shield_cyber_01",
            assetId: "ast_prod_api_01",
            assetDomain: "api.shield-enterprise.io",
            name: "Adaptive High-RPS Rate Limiting",
            description: "Enforces 500 req/s rate-limiting on sensitive API routes when anomalous spikes occur.",
            targetRoute: "/api/v1/checkout",
            rateLimitPerSecond: 500,
            burstLimit: 50,
            timeWindowSeconds: 60,
            mode: "ENFORCED",
            adapterType: "LOCAL_PROXY",
            status: "VERIFIED",
            appliedAt: "2026-10-20T23:00:00Z",
            verifiedAt: "2026-10-20T23:01:10Z",
            createdAt: "2026-10-20T22:50:00Z",
          },
          {
            id: "pol_sim_02",
            organizationId: "org_shield_cyber_01",
            assetId: "ast_prod_web_02",
            assetDomain: "portal.shield-enterprise.io",
            name: "Global Staging Dry-Run Rate Policy",
            description: "Synthetic dry-run policy evaluating simulated L7 traffic on staging portal.",
            targetRoute: "/login",
            rateLimitPerSecond: 100,
            burstLimit: 20,
            timeWindowSeconds: 60,
            mode: "DRY_RUN",
            adapterType: "SIMULATION",
            status: "SIMULATED",
            appliedAt: "2026-10-21T00:15:00Z",
            createdAt: "2026-10-21T00:10:00Z",
          },
        ]);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadPolicies();
  }, []);

  const handlePreview = async () => {
    try {
      const res = await fetch("/api/v1/policies/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: "ast_prod_api_01",
          assetDomain: "api.shield-enterprise.io",
          name,
          targetRoute,
          rateLimitPerSecond: Number(rateLimit),
          burstLimit: Number(burstLimit),
          adapterType,
        }),
      });
      const data = await res.json();
      if (data.preview) {
        setPreview(data.preview);
      }
    } catch {
      setFeedback("Failed to preview policy");
    }
  };

  const handleApplyNewPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/policies/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: "ast_prod_api_01",
          assetDomain: "api.shield-enterprise.io",
          name,
          targetRoute,
          rateLimitPerSecond: Number(rateLimit),
          burstLimit: Number(burstLimit),
          adapterType,
          forceOverride: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.policy) {
        setPolicies([data.policy, ...policies]);
        setShowModal(false);
        setFeedback(`Policy applied successfully. Status: ${data.result.status}`);
      } else {
        setFeedback(`Error: ${data.error}`);
      }
    } catch {
      setFeedback("Failed to enforce policy");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (policyId: string) => {
    try {
      const res = await fetch(`/api/v1/policies/${policyId}/verify`, { method: "POST" });
      const data = await res.json();
      if (data.verification) {
        setFeedback(`Verification Result: ${data.verification.details}`);
        setPolicies(policies.map((p) => p.id === policyId ? { ...p, status: data.verification.status } : p));
      }
    } catch {
      setFeedback("Verification call failed");
    }
  };

  const handleRollback = async (policyId: string) => {
    try {
      const res = await fetch(`/api/v1/policies/${policyId}/rollback`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setFeedback(`Policy ${policyId} rolled back to known-good baseline.`);
        setPolicies(policies.map((p) => p.id === policyId ? { ...p, status: "REVOKED" } : p));
      }
    } catch {
      setFeedback("Rollback failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>DEFENSIVE MITIGATION POLICIES & WAF RULES</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-brand-cyan/20 text-brand-cyan">
              {policies.length} POLICIES
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Validated rate-limiting algorithms, reverse-proxy enforcement adapters, and verified rollback controls.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>New Defensive Policy</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/40 text-brand-cyan text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy) => (
          <div key={policy.id} className="cyber-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-blue/20 text-brand-blue">
                    {policy.adapterType}
                  </span>
                  <span className="text-[11px] font-mono text-text-secondary">
                    Asset: {policy.assetDomain}
                  </span>
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  {policy.name}
                </h3>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  policy.status === "VERIFIED"
                    ? "bg-status-success/20 text-status-success border border-status-success/40"
                    : policy.status === "SIMULATED"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : policy.status === "APPLIED"
                    ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40"
                    : "bg-elevated text-text-secondary border border-border-subtle"
                }`}
              >
                {policy.status}
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {policy.description}
            </p>

            <div className="p-3 rounded-lg bg-panel border border-border-subtle font-mono text-xs space-y-1">
              <div className="flex justify-between text-text-secondary">
                <span>Target Route:</span>
                <span className="text-brand-cyan font-bold">{policy.targetRoute}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Rate Limit:</span>
                <span className="text-text-primary font-bold">{policy.rateLimitPerSecond} req/s (Burst {policy.burstLimit})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVerify(policy.id)}
                  className="px-2.5 py-1 rounded bg-brand-cyan/15 hover:bg-brand-cyan/25 text-brand-cyan border border-brand-cyan/30 transition-all font-semibold"
                >
                  Verify Proxy
                </button>
                <button
                  onClick={() => handleRollback(policy.id)}
                  className="px-2.5 py-1 rounded bg-panel hover:bg-elevated text-text-secondary hover:text-status-warning border border-border-subtle transition-all"
                >
                  Rollback
                </button>
              </div>
              <span className="text-[10px] text-text-secondary">
                {policy.verifiedAt ? `Verified: ${new Date(policy.verifiedAt).toLocaleTimeString()}` : "Pending Verification"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Policy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
          <div className="cyber-card p-6 sm:p-8 max-w-lg w-full space-y-5 bg-panel border-brand-cyan/30 shadow-glow">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-cyan" />
                <span>Configure Defensive Policy</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-secondary hover:text-text-primary text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyNewPolicy} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-text-secondary">Policy Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strict Rate Limit on Checkout"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-elevated border border-border-subtle text-xs text-text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-text-secondary">Enforcement Adapter</label>
                <select
                  value={adapterType}
                  onChange={(e) => setAdapterType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-elevated border border-border-subtle text-xs text-text-primary"
                >
                  <option value="LOCAL_PROXY">Local Reverse Proxy (NGINX In-Line)</option>
                  <option value="SIMULATION">Synthetic Staging Simulation (Dry-Run)</option>
                  <option value="CLOUDFLARE_WAF">Cloudflare WAF (Awaiting Credentials)</option>
                  <option value="AWS_SHIELD">AWS WAF & Shield (Awaiting Credentials)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-text-secondary">Target Route</label>
                <input
                  type="text"
                  required
                  value={targetRoute}
                  onChange={(e) => setTargetRoute(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-elevated border border-border-subtle font-mono text-xs text-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-text-secondary">Max Rate (r/s)</label>
                  <input
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-border-subtle font-mono text-xs text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-text-secondary">Burst Limit</label>
                  <input
                    type="number"
                    value={burstLimit}
                    onChange={(e) => setBurstLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-border-subtle font-mono text-xs text-text-primary"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handlePreview}
                className="w-full py-2 rounded-lg bg-panel border border-border-subtle hover:border-brand-cyan/50 text-xs font-mono text-brand-cyan flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Calculate Impact & Check Lockouts</span>
              </button>

              {preview && (
                <div className="p-3 rounded-lg bg-elevated text-xs font-mono space-y-1">
                  <div className="flex justify-between text-text-secondary">
                    <span>Est. Blocked Load:</span>
                    <span className="text-status-critical font-bold">{preview.estimatedBlockedRps} RPS</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Est. Clean Passed:</span>
                    <span className="text-status-success font-bold">{preview.estimatedCleanRps} RPS</span>
                  </div>
                  {preview.warnings.map((w, idx) => (
                    <div key={idx} className="text-[11px] text-status-warning">{w}</div>
                  ))}
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
                >
                  {submitting ? "Enforcing..." : "Authorize & Enforce"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
