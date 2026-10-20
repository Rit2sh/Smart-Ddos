"use client";

import React, { useState } from "react";
import { Settings, Key, Building2, Shield, Copy, Eye, Lock, Plus, Trash2, CheckCircle2, Download, X } from "lucide-react";

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  lastUsed: string;
  status: "ACTIVE" | "REVOKED";
}

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: "key_01",
    name: "Production Telemetry Agent Key",
    prefix: "sds_live_99f2...",
    scopes: ["telemetry:write", "rules:read"],
    lastUsed: "4 seconds ago",
    status: "ACTIVE",
  },
  {
    id: "key_02",
    name: "CI/CD Deployment & Testing Key",
    prefix: "sds_test_3a8b...",
    scopes: ["policies:read", "health:read"],
    lastUsed: "12 hours ago",
    status: "ACTIVE",
  },
];

export default function SettingsPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScope, setSelectedScope] = useState("telemetry:write");
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const mockSecret = "sds_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey: ApiKeyItem = {
      id: "key_" + Math.random().toString(36).substring(2, 7),
      name: newKeyName,
      prefix: mockSecret.substring(0, 12) + "...",
      scopes: [selectedScope],
      lastUsed: "Never",
      status: "ACTIVE",
    };

    setKeys([newKey, ...keys]);
    setGeneratedSecret(mockSecret);
    setFeedback(`API Key "${newKeyName}" generated successfully.`);
    setNewKeyName("");
  };

  const handleRevokeKey = (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? Connected collector daemons using this key will immediately be denied access.")) return;
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "REVOKED" } : k))
    );
    setFeedback("API key revoked.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const copySecret = () => {
    if (generatedSecret) {
      navigator.clipboard.writeText(generatedSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>ORGANIZATION SETTINGS & API TOKENS</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Configure tenant parameters, developer API keys, and edge collector ingestion credentials.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-status-success/15 border border-status-success/40 text-xs font-mono text-status-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Organization Info */}
      <div className="cyber-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-cyan" />
          <span>TENANT ORGANIZATION PROFILE</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-text-secondary">ORGANIZATION NAME</span>
            <input
              type="text"
              readOnly
              value="Shield Cyber Corp"
              className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle text-text-primary"
            />
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary">TENANT SLUG</span>
            <input
              type="text"
              readOnly
              value="shield-cyber"
              className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle text-brand-cyan"
            />
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary">SUBSCRIPTION TIER</span>
            <input
              type="text"
              readOnly
              value="ENTERPRISE SHIELD (UNLIMITED VOLUMETRIC DEFENSE)"
              className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle text-status-success font-bold"
            />
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary">DEDICATED EDGE COLLECTORS</span>
            <input
              type="text"
              readOnly
              value="4 GLOBAL ANYCAST NODES PROVISIONED"
              className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle text-text-primary"
            />
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Key className="w-4 h-4 text-status-warning" />
            <span>DEVELOPER API & TELEMETRY INGESTION TOKENS</span>
          </h3>
          <button
            onClick={() => {
              setGeneratedSecret(null);
              setShowModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Key</span>
          </button>
        </div>

        {/* Generate Modal */}
        {showModal && (
          <div className="p-4 rounded-lg bg-surface border border-brand-cyan/40 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-xs font-bold text-text-primary font-mono uppercase">Provision New Ingestion API Key</span>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!generatedSecret ? (
              <form onSubmit={handleGenerateKey} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-text-secondary uppercase">Key Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EU-West Gateway Daemon"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-text-secondary uppercase">Scope Permission</label>
                    <select
                      value={selectedScope}
                      onChange={(e) => setSelectedScope(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                    >
                      <option value="telemetry:write">telemetry:write (Collector Ingestion)</option>
                      <option value="rules:read">rules:read (Sync Detection Rules)</option>
                      <option value="policies:read">policies:read (Read Active Policies)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 rounded bg-panel border border-border-subtle text-xs font-mono text-text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded bg-brand-cyan text-background text-xs font-bold font-mono hover:bg-brand-cyan/90"
                  >
                    Create Key
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded bg-panel border border-brand-cyan/40 text-xs font-mono space-y-1">
                  <div className="text-[11px] text-status-warning font-bold">
                    Important: Copy this key now. It will not be shown again.
                  </div>
                  <div className="p-2 rounded bg-background border border-border-subtle text-brand-cyan select-all flex items-center justify-between">
                    <span>{generatedSecret}</span>
                    <button onClick={copySecret} className="text-text-secondary hover:text-brand-cyan ml-2">
                      {copied ? <CheckCircle2 className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 rounded bg-brand-cyan text-background text-xs font-bold font-mono"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {keys.map((k) => (
            <div
              key={k.id}
              className={`p-3.5 rounded-lg bg-panel border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
                k.status === "REVOKED" ? "opacity-60" : ""
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold text-text-primary flex items-center gap-2">
                  <span>{k.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      k.status === "ACTIVE"
                        ? "bg-status-success/20 text-status-success"
                        : "bg-status-critical/20 text-status-critical"
                    }`}
                  >
                    {k.status}
                  </span>
                </div>
                <div className="text-text-secondary">
                  Prefix: <code className="text-brand-cyan">{k.prefix}</code> • Scopes:{" "}
                  {k.scopes.map((s) => (
                    <span key={s} className="text-text-primary mr-1">
                      `{s}`
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-text-secondary text-[11px]">Last used: {k.lastUsed}</span>
                {k.status === "ACTIVE" && (
                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="px-2.5 py-1 rounded bg-elevated border border-border-subtle hover:border-status-critical hover:text-status-critical transition-colors text-xs"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Privacy & GDPR Portability */}
      <div className="cyber-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-cyan" />
          <span>DATA PORTABILITY & RETENTION POLICIES (GDPR / CCPA)</span>
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          In compliance with GDPR Article 20, export your complete organization profile, registered assets, pseudonymized incident archives, and tamper-proof audit trails.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs font-mono">
          <span className="text-text-muted">Standard: 30-day raw telemetry TTL • 365-day aggregated archive</span>
          <a
            href="/api/v1/org/export"
            target="_blank"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel border border-brand-cyan/40 hover:border-brand-cyan text-brand-cyan text-xs font-bold transition-all shadow-glow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Data Export Bundle</span>
          </a>
        </div>
      </div>
    </div>
  );
}
