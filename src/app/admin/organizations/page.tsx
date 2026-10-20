import React from "react";
import { Building2, Plus, ShieldCheck, Globe } from "lucide-react";

export const revalidate = 0;

const ORGANIZATIONS = [
  {
    id: "org_shield_cyber_01",
    name: "Shield Cyber Corp",
    slug: "shield-cyber",
    tier: "ENTERPRISE",
    assetsCount: 4,
    membersCount: 4,
    trafficRps: "238.9k",
    status: "HEALTHY",
  },
  {
    id: "org_fintech_edge_02",
    name: "Apex Financial Systems",
    slug: "apex-fintech",
    tier: "ENTERPRISE",
    assetsCount: 12,
    membersCount: 8,
    trafficRps: "84.2k",
    status: "HEALTHY",
  },
  {
    id: "org_global_media_03",
    name: "Hyperion Media Network",
    slug: "hyperion-media",
    tier: "PRO",
    assetsCount: 6,
    membersCount: 3,
    trafficRps: "19.5k",
    status: "HEALTHY",
  },
];

export default function AdminOrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>TENANT ORGANIZATIONS</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-brand-cyan/20 text-brand-cyan">
              {ORGANIZATIONS.length} TENANTS
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Multi-tenant partition directory, isolated database quotas, and billing subscription tiers.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow">
          <Plus className="w-4 h-4" />
          <span>Provision Tenant</span>
        </button>
      </div>

      <div className="cyber-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-text-secondary text-[11px]">
                <th className="pb-3 font-medium">TENANT NAME</th>
                <th className="pb-3 font-medium">SLUG IDENTIFIER</th>
                <th className="pb-3 font-medium">PLAN TIER</th>
                <th className="pb-3 font-medium">ASSETS</th>
                <th className="pb-3 font-medium">OPERATORS</th>
                <th className="pb-3 font-medium">PEAK TRAFFIC</th>
                <th className="pb-3 font-medium text-right">MANAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {ORGANIZATIONS.map((org) => (
                <tr key={org.id} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-3 font-sans font-bold text-text-primary text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-blue" />
                    <span>{org.name}</span>
                  </td>
                  <td className="py-3 text-brand-cyan">{org.slug}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-blue/20 text-brand-blue font-bold">
                      {org.tier}
                    </span>
                  </td>
                  <td className="py-3 text-text-primary font-bold">{org.assetsCount} Assets</td>
                  <td className="py-3 text-text-secondary">{org.membersCount} Operators</td>
                  <td className="py-3 text-text-primary font-bold">{org.trafficRps} RPS</td>
                  <td className="py-3 text-right">
                    <button className="text-brand-cyan hover:underline text-xs">
                      Inspect Tenant →
                    </button>
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
