import React from "react";
import { DataService } from "@/lib/data-service";
import { ShieldCheck, Lock, Globe } from "lucide-react";

export const revalidate = 0;

export default async function AdminAuditPage() {
  const auditLogs = await DataService.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>PLATFORM-WIDE SYSTEM AUDIT TRAIL</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-brand-cyan/20 text-brand-cyan">
              GLOBAL TRAIL
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Immutable cross-tenant audit ledger tracking administrative access, collector keys, and policy overrides.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-status-success">
          <Lock className="w-3.5 h-3.5" />
          <span>CHAIN INTEGRITY: VERIFIED</span>
        </div>
      </div>

      <div className="cyber-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-text-secondary text-[11px]">
                <th className="pb-3 font-medium">TIMESTAMP</th>
                <th className="pb-3 font-medium">ACTION EVENT</th>
                <th className="pb-3 font-medium">OPERATOR</th>
                <th className="pb-3 font-medium">TARGET OBJECT</th>
                <th className="pb-3 font-medium">CLIENT IP</th>
                <th className="pb-3 font-medium">METADATA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-3 text-text-secondary whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 font-bold text-brand-cyan">
                    {log.action}
                  </td>
                  <td className="py-3 text-text-primary font-sans font-medium">
                    {log.userEmail}
                  </td>
                  <td className="py-3 text-text-secondary">
                    {log.resourceType}: {log.resourceId}
                  </td>
                  <td className="py-3 text-text-secondary">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 text-text-secondary text-xs font-sans max-w-xs truncate">
                    {log.details}
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
