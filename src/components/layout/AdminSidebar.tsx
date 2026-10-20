"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Building2,
  Server,
  Cpu,
  FileCheck2,
  ArrowLeft,
} from "lucide-react";

const ADMIN_LINKS = [
  { name: "Platform Overview", href: "/admin", icon: ShieldAlert },
  { name: "Tenant Organizations", href: "/admin/organizations", icon: Building2 },
  { name: "Collector Nodes", href: "/admin/collectors", icon: Server },
  { name: "Background Jobs", href: "/admin/jobs", icon: Cpu },
  { name: "Global Audit Log", href: "/admin/audit", icon: FileCheck2 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border-subtle bg-panel/80 backdrop-blur-md min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="px-2.5 pb-2 border-b border-border-subtle flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
              SUPERADMIN CONSOLE
            </span>
            <span className="px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan text-[10px] font-mono">
              ROOT
            </span>
          </div>

          <nav className="space-y-1 pt-3">
            {ADMIN_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 shadow-glow"
                      : "text-text-secondary hover:text-text-primary hover:bg-elevated/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-cyan" : "text-text-secondary"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-border-subtle">
        <Link
          href="/app"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-brand-cyan hover:bg-elevated transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Customer Tenant</span>
        </Link>
      </div>
    </aside>
  );
}
