"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Globe, Server, FileCode, CheckCircle2 } from "lucide-react";

export default function NewAssetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    assetType: "DOMAIN",
    originTarget: "",
    verificationMethod: "DNS_TXT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register asset");
      }

      router.push(`/app/assets/${data.asset.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/app/assets"
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-brand-cyan transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Protected Assets</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
          Register Endpoint for DDoS Shielding
        </h1>
        <p className="text-xs text-text-secondary">
          Configure origin IP or upstream CNAME. Domain ownership verification is mandatory before mitigation rules can be activated.
        </p>
      </div>

      <div className="cyber-card p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-status-critical/15 border border-status-critical/30 text-status-critical text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
              Friendly Asset Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Primary Production Checkout Gateway"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                Domain / FQDN
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                <input
                  type="text"
                  required
                  placeholder="api.yourcompany.com"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm font-mono transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                Asset Architecture Type
              </label>
              <select
                value={formData.assetType}
                onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm transition-colors"
              >
                <option value="DOMAIN">Root Apex Domain</option>
                <option value="SUBDOMAIN">Subdomain</option>
                <option value="API_GATEWAY">API Gateway / REST Endpoint</option>
                <option value="LOAD_BALANCER">Upstream Load Balancer</option>
                <option value="IP_PREFIX">BGP IP Prefix (/24)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
              Origin Target Address (IP or Hostname)
            </label>
            <div className="relative">
              <Server className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
              <input
                type="text"
                required
                placeholder="198.51.100.42:443 or origin.yourcompany.internal"
                value={formData.originTarget}
                onChange={(e) => setFormData({ ...formData, originTarget: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm font-mono transition-colors"
              />
            </div>
            <p className="text-[11px] text-text-secondary">
              Traffic passing through edge collectors will be cleanly proxied to this target.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-border-subtle/60">
            <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
              Verification Challenge Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.verificationMethod === "DNS_TXT"
                    ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-glow"
                    : "bg-panel border-border-subtle text-text-secondary hover:border-border-subtle/80"
                }`}
              >
                <input
                  type="radio"
                  name="verificationMethod"
                  value="DNS_TXT"
                  checked={formData.verificationMethod === "DNS_TXT"}
                  onChange={() => setFormData({ ...formData, verificationMethod: "DNS_TXT" })}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-xs text-text-primary flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5" />
                    DNS TXT Record (Recommended)
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Add a TXT record to your authoritative DNS nameserver.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.verificationMethod === "HTTP_CHALLENGE"
                    ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-glow"
                    : "bg-panel border-border-subtle text-text-secondary hover:border-border-subtle/80"
                }`}
              >
                <input
                  type="radio"
                  name="verificationMethod"
                  value="HTTP_CHALLENGE"
                  checked={formData.verificationMethod === "HTTP_CHALLENGE"}
                  onChange={() => setFormData({ ...formData, verificationMethod: "HTTP_CHALLENGE" })}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-xs text-text-primary flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    HTTP Challenge File
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Host a token at `/.well-known/smart-ddos-challenge.txt`.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              href="/app/assets"
              className="px-4 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? "Registering & Generating Token..." : "Generate Verification Challenge"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
