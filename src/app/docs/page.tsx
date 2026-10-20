import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Terminal, BookOpen, Key, Globe, Shield, ArrowRight } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
            DOCUMENTATION & INTEGRATION MANUAL
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            Developer & SecOps Guides
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Quickstarts for domain registration, automated DNS verification, REST API endpoints, and collector daemon configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="cyber-card p-6 space-y-4">
            <div className="p-3 rounded-xl bg-panel border border-brand-cyan/30 text-brand-cyan w-fit">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">Domain Verification Guide</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Step-by-step instructions for configuring DNS TXT challenge records (`_smartddos-challenge.example.com`) or HTTP token verification.
            </p>
            <Link href="/app/assets/new" className="text-xs font-mono text-brand-cyan hover:underline inline-flex items-center gap-1">
              Start Verification →
            </Link>
          </div>

          <div className="cyber-card p-6 space-y-4">
            <div className="p-3 rounded-xl bg-panel border border-brand-blue/30 text-brand-blue w-fit">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">REST API & Webhooks</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Authenticate via Bearer API keys to stream live telemetry, trigger programmatic mitigations, and export incident forensics.
            </p>
            <Link href="/app/settings" className="text-xs font-mono text-brand-blue hover:underline inline-flex items-center gap-1">
              Generate API Keys →
            </Link>
          </div>

          <div className="cyber-card p-6 space-y-4">
            <div className="p-3 rounded-xl bg-panel border border-status-success/30 text-status-success w-fit">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">Edge Collector Daemon</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Deploy our lightweight eBPF collector daemon on Linux instances using Docker Compose or native systemd packages.
            </p>
            <Link href="/admin/collectors" className="text-xs font-mono text-status-success hover:underline inline-flex items-center gap-1">
              View Node Specs →
            </Link>
          </div>
        </div>

        {/* Quick CLI snippet */}
        <div className="cyber-card p-6 space-y-3">
          <h3 className="text-sm font-mono uppercase tracking-wider text-text-primary font-bold">
            Quick Daemon Verification Test (curl)
          </h3>
          <pre className="p-4 rounded-lg bg-background border border-border-subtle text-xs font-mono text-brand-cyan overflow-x-auto">
{`# Test API telemetry endpoint
curl -X GET "http://localhost:3000/api/assets" \\
  -H "Authorization: Bearer sds_live_your_token_here" \\
  -H "Content-Type: application/json"`}
          </pre>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
