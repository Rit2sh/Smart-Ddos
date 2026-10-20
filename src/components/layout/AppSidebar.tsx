"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Activity,
  Flame,
  AlertTriangle,
  Sliders,
  Plug,
  Bell,
  FileText,
  ShieldCheck,
  Users,
  Settings,
  Lock,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

interface NavLinkItem {
  name: string;
  href: string;
  icon: LucideIcon;
  count?: number;
  badge?: string;
  critical?: boolean;
  highlight?: boolean;
}

interface NavCategory {
  category: string;
  links: NavLinkItem[];
}

const NAV_ITEMS: NavCategory[] = [
  {
    category: "DETECTION & TELEMETRY",
    links: [
      { name: "Overview", href: "/app", icon: LayoutDashboard },
      { name: "Protected Assets", href: "/app/assets", icon: Globe, count: 4 },
      { name: "Traffic Stream", href: "/app/traffic", icon: Activity },
      { name: "Threat Intelligence", href: "/app/threats", icon: Flame },
      { name: "Incidents", href: "/app/incidents", icon: AlertTriangle, badge: "1 Active", critical: true },
    ],
  },
  {
    category: "DEFENSE & ENFORCEMENT",
    links: [
      { name: "Mitigation Policies", href: "/app/policies", icon: Sliders },
      { name: "Edge Integrations", href: "/app/integrations", icon: Plug },
      { name: "Alert Dispatches", href: "/app/alerts", icon: Bell },
      { name: "Attack Reports", href: "/app/reports", icon: FileText },
    ],
  },
  {
    category: "HELP & RESOURCES",
    links: [
      { name: "Integration Guides", href: "/guides", icon: FileText },
      { name: "Setup Wizard", href: "/onboarding", icon: Globe },
    ],
  },
  {
    category: "GOVERNANCE & PLATFORM",
    links: [
      { name: "Audit Trail", href: "/app/audit-logs", icon: ShieldCheck },
      { name: "Team & Roles", href: "/app/team", icon: Users },
      { name: "Settings & API Keys", href: "/app/settings", icon: Settings },
      { name: "Platform Admin", href: "/admin", icon: Lock, highlight: true },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border-subtle bg-panel/60 backdrop-blur-md min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {NAV_ITEMS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-text-secondary/60 font-semibold">
              {section.category}
            </h3>
            <nav className="space-y-1 pt-1">
              {section.links.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/app" && pathname?.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 shadow-glow"
                        : link.highlight
                        ? "text-brand-blue hover:bg-brand-blue/10 hover:text-brand-cyan"
                        : "text-text-secondary hover:text-text-primary hover:bg-elevated/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-brand-cyan" : link.highlight ? "text-brand-blue" : "text-text-secondary"}`} />
                      <span>{link.name}</span>
                    </div>

                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-status-critical/20 text-status-critical font-bold">
                        {link.badge}
                      </span>
                    )}
                    {link.count !== undefined && !link.badge && (
                      <span className="text-[10px] font-mono text-text-secondary bg-elevated px-1.5 py-0.5 rounded">
                        {link.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Engine Status Widget */}
      <div className="mt-6 p-3 rounded-lg bg-elevated/80 border border-border-subtle text-xs space-y-2">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-text-secondary">SYSTEM HEALTH</span>
          <span className="text-status-success font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse"></span>
            OPTIMAL
          </span>
        </div>
        <div className="w-full bg-panel rounded-full h-1.5 overflow-hidden">
          <div className="bg-brand-cyan h-full rounded-full w-[94%]"></div>
        </div>
        <div className="flex justify-between text-[10px] text-text-secondary/70 font-mono">
          <span>4 Collectors Active</span>
          <span>99.98% SLA</span>
        </div>
      </div>
    </aside>
  );
}
