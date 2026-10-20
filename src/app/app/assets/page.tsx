import React from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { Globe, Plus, ShieldCheck, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export const revalidate = 0;

export default async function AssetsPage() {
  const assets = await DataService.getAssets();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>PROTECTED ASSETS & DOMAINS</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-brand-cyan/20 text-brand-cyan">
              {assets.length} TOTAL
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Configure origin targets, DNS challenge verification, and BGP edge proxy shields.
          </p>
        </div>

        <Link
          href="/app/assets/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Asset</span>
        </Link>
      </div>

      {/* Assets Table */}
      <div className="cyber-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-text-secondary text-[11px]">
                <th className="pb-3 font-medium">ASSET NAME / FQDN</th>
                <th className="pb-3 font-medium">TYPE</th>
                <th className="pb-3 font-medium">ORIGIN TARGET</th>
                <th className="pb-3 font-medium">VERIFICATION</th>
                <th className="pb-3 font-medium">DEFENSE STATUS</th>
                <th className="pb-3 font-medium">TRAFFIC LOAD</th>
                <th className="pb-3 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-3.5">
                    <div className="font-sans font-bold text-text-primary text-sm">
                      {asset.name}
                    </div>
                    <div className="font-mono text-brand-cyan text-xs flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {asset.domain}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-elevated border border-border-subtle text-[11px] text-text-secondary">
                      {asset.assetType}
                    </span>
                  </td>
                  <td className="py-3.5 text-text-secondary">
                    {asset.originTarget}
                  </td>
                  <td className="py-3.5">
                    {asset.verification?.status === "VERIFIED" ? (
                      <span className="inline-flex items-center gap-1 text-status-success font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified ({asset.verification.method})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-status-warning font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Verification
                      </span>
                    )}
                  </td>
                  <td className="py-3.5">
                    {asset.status === "ACTIVE" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/15 text-status-success border border-status-success/30">
                        <ShieldCheck className="w-3 h-3" />
                        PROTECTED
                      </span>
                    )}
                    {asset.status === "UNDER_ATTACK" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-status-critical/15 text-status-critical border border-status-critical/30 animate-pulse">
                        <ShieldAlert className="w-3 h-3" />
                        UNDER ATTACK
                      </span>
                    )}
                    {asset.status === "UNVERIFIED" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-elevated text-text-secondary border border-border-subtle">
                        <AlertTriangle className="w-3 h-3" />
                        UNVERIFIED
                      </span>
                    )}
                  </td>
                  <td className="py-3.5">
                    <div className="text-text-primary font-bold">
                      {asset.trafficRps.toLocaleString()} RPS
                    </div>
                    <div className="text-[10px] text-text-secondary">
                      Blocked: {asset.blockedRate}
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/app/assets/${asset.id}`}
                      className="px-2.5 py-1 rounded bg-panel border border-border-subtle hover:border-brand-cyan/50 hover:text-brand-cyan text-text-primary transition-all text-xs"
                    >
                      Manage →
                    </Link>
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
