import React from "react";
import Link from "next/link";
import { Shield, Lock, Terminal, BookOpen, ExternalLink } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border-subtle bg-panel/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Purpose */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-cyan" />
            <span className="font-bold text-sm tracking-tight text-text-primary">
              SMART DDOS SHIELD
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Accessible, defensive cybersecurity platform providing real-time telemetry monitoring, statistical anomaly detection, and guided rate-limiting protection for authorized websites and APIs.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-status-success">
            <Lock className="w-3.5 h-3.5" />
            <span>Defensive Application Security | Transparent Audit Records</span>
          </div>
        </div>

        {/* Educational Center */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-text-primary font-semibold mb-3">
            Learn & Understand
          </h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link href="/learn/ddos" className="hover:text-brand-cyan transition-colors">
                What is a DDoS Attack?
              </Link>
            </li>
            <li>
              <Link href="/why-protection" className="hover:text-brand-cyan transition-colors">
                Why Businesses Need Protection
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-brand-cyan transition-colors">
                10-Step Protection Walkthrough
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-brand-cyan transition-colors">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform & Integrations */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-text-primary font-semibold mb-3">
            Product & Setup
          </h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link href="/features" className="hover:text-brand-cyan transition-colors">
                Full Feature Breakdown
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-brand-cyan transition-colors">
                Configurable Pricing Plans
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:text-brand-cyan transition-colors">
                Integration Guides & Tutorials
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-brand-cyan transition-colors">
                Security Architecture & Privacy
              </Link>
            </li>
          </ul>
        </div>

        {/* User Portal & Resources */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-text-primary font-semibold mb-3">
            Security Console
          </h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link href="/login" className="hover:text-brand-cyan transition-colors">
                Sign In to Security Console
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-brand-cyan transition-colors">
                Create Workspace Account
              </Link>
            </li>
            <li>
              <Link href="/onboarding" className="hover:text-brand-cyan transition-colors">
                Guided Setup Wizard
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-brand-cyan transition-colors flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                <span>API & Telemetry Documentation</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-border-subtle/60 flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary gap-3">
        <p>© 2026 Smart DDoS Shield. Defensive cybersecurity platform. All rights reserved.</p>
        <div className="flex items-center gap-4 text-[11px] font-mono text-text-secondary/70">
          <Link href="/security" className="hover:text-text-primary">
            Security & Privacy
          </Link>
          <span>•</span>
          <Link href="/guides" className="hover:text-text-primary">
            Verification Rules
          </Link>
          <span>•</span>
          <span>Build v2.4.2</span>
        </div>
      </div>
    </footer>
  );
}
