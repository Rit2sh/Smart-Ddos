"use client";

import React from "react";
import Link from "next/link";
import { Shield, Activity, Bell, Building2, User, ChevronDown } from "lucide-react";
import { DemoBadge } from "../ui/DemoBadge";

interface NavbarProps {
  currentOrg?: string;
  userRole?: string;
}

export function Navbar({ currentOrg = "Shield Cyber Corp", userRole = "OWNER" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Telemetry Indicator */}
        <div className="flex items-center gap-6">
          <Link href="/app" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-panel border border-brand-cyan/30 text-brand-cyan group-hover:border-brand-cyan group-hover:shadow-glow transition-all">
              <Shield className="w-5 h-5 text-brand-cyan" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-success"></span>
              </span>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-text-primary flex items-center gap-1.5">
                SMART DDOS <span className="text-xs px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-mono font-semibold">SHIELD</span>
              </span>
              <p className="text-[11px] text-text-secondary tracking-wide flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success inline-block"></span>
                DEFENSE ENGINE: ACTIVE
              </p>
            </div>
          </Link>

          {/* Org Selector Switcher */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-panel border border-border-subtle text-xs text-text-secondary hover:text-text-primary hover:border-brand-blue/40 transition-colors cursor-pointer">
            <Building2 className="w-3.5 h-3.5 text-brand-blue" />
            <span className="font-medium text-text-primary">{currentOrg}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-brand-blue/20 text-brand-blue font-mono">{userRole}</span>
            <ChevronDown className="w-3 h-3 text-text-secondary" />
          </div>
        </div>

        {/* Center / Simulation Label */}
        <div className="hidden lg:block">
          <DemoBadge />
        </div>

        {/* Right Actions: Telemetry Latency, Alerts, User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-panel/70 border border-border-subtle text-xs font-mono text-text-secondary">
            <Activity className="w-3.5 h-3.5 text-status-success" />
            <span>LATENCY:</span>
            <span className="text-status-success font-semibold">1.4ms</span>
          </div>

          <Link
            href="/app/alerts"
            className="relative p-2 rounded-lg bg-panel border border-border-subtle text-text-secondary hover:text-brand-cyan hover:border-brand-cyan/40 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-critical opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-critical"></span>
            </span>
          </Link>

          <Link
            href="/app/settings"
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-lg bg-panel border border-border-subtle hover:border-brand-cyan/40 transition-all text-xs text-text-primary"
          >
            <div className="w-6 h-6 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan font-bold text-xs">
              MV
            </div>
            <span className="hidden md:inline font-medium text-xs">Marcus V.</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
