"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AssetRecord } from "@/lib/data-service";
import {
  ArrowLeft,
  Globe,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Clock,
  Server,
  Lock,
} from "lucide-react";

export default function AssetDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [asset, setAsset] = useState<AssetRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState(false);
  const [copiedValue, setCopiedValue] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchAsset() {
      try {
        const res = await fetch(`/api/assets?id=${id}`);
        const data = await res.json();
        if (data.asset) {
          setAsset(data.asset);
        }
      } catch {
        // Fallback or error handling
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchAsset();
  }, [id]);

  const handleVerify = async () => {
    setVerifying(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/assets/${id}/verify`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: data.message });
        setAsset(data.asset);
      } else {
        setFeedback({ type: "error", message: data.error || "Verification failed" });
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to communicate with verification engine" });
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = (text: string, type: "record" | "value") => {
    navigator.clipboard.writeText(text);
    if (type === "record") {
      setCopiedRecord(true);
      setTimeout(() => setCopiedRecord(false), 2000);
    } else {
      setCopiedValue(true);
      setTimeout(() => setCopiedValue(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="cyber-card p-12 text-center text-text-secondary text-sm font-mono">
        Loading asset verification telemetry...
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="space-y-4">
        <Link href="/app/assets" className="text-xs text-brand-cyan hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assets
        </Link>
        <div className="cyber-card p-8 text-center text-status-critical text-sm">
          Asset not found or unauthorized access.
        </div>
      </div>
    );
  }

  const isVerified = asset.verification?.status === "VERIFIED";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/app/assets"
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-brand-cyan transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Protected Assets</span>
      </Link>

      {/* Asset Identity Banner */}
      <div className="cyber-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-panel border border-brand-cyan/30 text-brand-cyan shadow-glow">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                {asset.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-elevated border border-border-subtle text-text-secondary">
                {asset.assetType}
              </span>
            </div>
            <p className="text-xs font-mono text-brand-cyan mt-0.5">
              {asset.domain}
            </p>
          </div>
        </div>

        <div>
          {isVerified ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-status-success/15 text-status-success border border-status-success/30">
              <ShieldCheck className="w-4 h-4" />
              <span>DEFENSE ACTIVE</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-status-warning/15 text-status-warning border border-status-warning/30">
              <Clock className="w-4 h-4" />
              <span>VERIFICATION PENDING</span>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-status-success/15 border border-status-success/40 text-status-success"
              : "bg-status-critical/15 border border-status-critical/40 text-status-critical"
          }`}
        >
          {feedback.type === "success" ? <ShieldCheck className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Verification Challenge Card */}
      <div className="cyber-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/70 pb-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span>DOMAIN OWNERSHIP VERIFICATION CHALLENGE</span>
              <span className="px-1.5 py-0.5 rounded bg-brand-blue/20 text-brand-blue text-[10px] font-mono">
                {asset.verification?.method || "DNS_TXT"}
              </span>
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Prove authoritative control before live DDoS mitigation traffic routing is allowed.
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} />
            <span>{verifying ? "Checking Challenge..." : "Test & Verify Record Now"}</span>
          </button>
        </div>

        {/* DNS / Challenge Records Box */}
        {asset.verification && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
                <span>EXPECTED RECORD / HOSTNAME</span>
                <button
                  onClick={() => copyToClipboard(asset.verification?.expectedRecord || "", "record")}
                  className="hover:text-brand-cyan transition-colors flex items-center gap-1 text-[11px]"
                >
                  {copiedRecord ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecord ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-panel border border-border-subtle text-xs font-mono text-text-primary break-all">
                {asset.verification.expectedRecord}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
                <span>TOKEN / VALUE TO CONFIGURE</span>
                <button
                  onClick={() => copyToClipboard(asset.verification?.expectedValue || "", "value")}
                  className="hover:text-brand-cyan transition-colors flex items-center gap-1 text-[11px]"
                >
                  {copiedValue ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedValue ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-panel border border-border-subtle text-xs font-mono text-brand-cyan break-all">
                {asset.verification.expectedValue}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-text-secondary/80 pt-2 border-t border-border-subtle/50 gap-2">
              <div>
                Challenge Token: <span className="text-text-primary">{asset.verification.token}</span>
              </div>
              <div>
                Expires: <span className="text-text-primary">{new Date(asset.verification.expiresAt).toLocaleDateString()}</span>
              </div>
              <div>
                Verification Checks Run: <span className="text-text-primary">{asset.verification.attemptCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Target Routing & Protection Settings */}
      <div className="cyber-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-text-primary">
          EDGE PROXY & UPSTREAM TARGET SPECIFICATION
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-elevated/70 border border-border-subtle space-y-1">
            <span className="text-text-secondary">PROTECTED ORIGIN TARGET</span>
            <div className="text-text-primary font-bold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-brand-cyan" />
              {asset.originTarget}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-elevated/70 border border-border-subtle space-y-1">
            <span className="text-text-secondary">ENFORCEMENT POLICY LOCK</span>
            <div className={`font-bold flex items-center gap-1.5 ${isVerified ? "text-status-success" : "text-text-secondary"}`}>
              <Lock className="w-3.5 h-3.5" />
              {isVerified ? "Policy Ready to Enforce" : "Locked (Awaiting Ownership Verification)"}
            </div>
          </div>
        </div>

        {!isVerified && (
          <div className="p-3 rounded-lg bg-panel border border-status-warning/20 text-status-warning text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              Security Rule: Edge mitigation proxies and BGP route injection cannot be toggled until domain verification is verified cryptographically.
            </span>
          </div>
        )}
      </div>

      {/* Danger Zone: Operational Controls & Asset Removal */}
      <div className="cyber-card p-6 space-y-4 border-status-critical/30">
        <h3 className="text-sm font-bold text-status-critical flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>ASSET LIFECYCLE & PROTECTION OVERRIDE</span>
        </h3>
        <p className="text-xs text-text-secondary">
          Temporarily suspend protective Anycast routing or permanently decommission this asset from the organization shield inventory.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle">
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/assets", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: asset.id, protectionEnabled: !asset.protectionEnabled }),
                });
                const data = await res.json();
                if (res.ok && data.asset) {
                  setAsset(data.asset);
                  setFeedback({
                    type: "success",
                    message: `Protection status toggled to: ${data.asset.protectionEnabled ? "ENABLED" : "SUSPENDED"}`,
                  });
                }
              } catch {
                setFeedback({ type: "error", message: "Failed to toggle protection state" });
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-panel border border-border-subtle hover:border-brand-cyan text-xs font-mono text-text-primary transition-colors"
          >
            {asset.protectionEnabled ? "Suspend Protective Routing" : "Re-Enable Protective Routing"}
          </button>

          <button
            onClick={async () => {
              if (!confirm(`Are you sure you want to permanently delete ${asset.domain}? Protective BGP routes will be withdrawn immediately.`)) return;
              try {
                const res = await fetch(`/api/assets?id=${asset.id}`, { method: "DELETE" });
                if (res.ok) {
                  window.location.href = "/app/assets";
                } else {
                  const data = await res.json();
                  setFeedback({ type: "error", message: data.error || "Failed to delete asset" });
                }
              } catch {
                setFeedback({ type: "error", message: "Error communicating with asset service" });
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-status-critical/15 border border-status-critical/40 text-status-critical hover:bg-status-critical/25 text-xs font-mono font-bold transition-colors"
          >
            Decommission & Remove Asset
          </button>
        </div>
      </div>
    </div>
  );
}
