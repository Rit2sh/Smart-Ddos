"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  UserPlus,
  Globe,
  CheckCircle2,
  Cpu,
  Server,
  Activity,
  Sliders,
  AlertTriangle,
  Zap,
  FileText,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Create Your Workspace Account",
      icon: <UserPlus className="w-5 h-5 text-brand-cyan" />,
      tagline: "Single Sign-On with Google, GitHub, or Email",
      whatHappens:
        "You sign up in seconds. Smart DDoS Shield provisions a secure, multi-tenant workspace for your personal account or team. No credit card is required to start monitoring on the Free Developer tier.",
      securityCheck: "Session token signed with HS256 JWT, stored in secure HTTP-only cookie.",
      userAction: "Click 'Sign Up' and select Individual or Business workspace.",
    },
    {
      step: 2,
      title: "Add Your Website or API",
      icon: <Globe className="w-5 h-5 text-brand-blue" />,
      tagline: "Register Your Domain or API Target",
      whatHappens:
        "Enter your website's hostname (e.g. `example.com` or `api.example.com`). The platform creates an asset record in UNVERIFIED status. To protect against malicious third-party attacks, protection cannot be activated until ownership is strictly verified.",
      securityCheck: "Strict hostname validation preventing arbitrary third-party registration.",
      userAction: "Type your domain and choose asset type (Website, API, Web App).",
    },
    {
      step: 3,
      title: "Verify Domain Ownership",
      icon: <CheckCircle2 className="w-5 h-5 text-status-success" />,
      tagline: "DNS TXT Record or HTTP Challenge Verification",
      whatHappens:
        "You prove that you own or control the server. You can either add a quick DNS TXT record (e.g. `smart-ddos-verify=token`) or place a small file at `/.well-known/smart-ddos-challenge.txt`. Once verified, the asset status updates to ACTIVE.",
      securityCheck: "Real DNS and HTTP resolution checks against RFC standards.",
      userAction: "Copy the verification token and click 'Check Verification'.",
    },
    {
      step: 4,
      title: "Choose Your Integration Method",
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      tagline: "Reverse Proxy, Cloud WAF, or Out-of-Path Daemon",
      whatHappens:
        "Select the connection model that fits your infrastructure. You can choose: (1) In-line NGINX reverse proxy for local micro-second rate-limiting, (2) Cloudflare or AWS WAF sync for edge protection, or (3) Monitor-only daemon for zero traffic changes.",
      securityCheck: "Honest display of which methods can drop packets vs which only monitor.",
      userAction: "Select the option that matches your technical setup.",
    },
    {
      step: 5,
      title: "Connect Telemetry Ingestion",
      icon: <Server className="w-5 h-5 text-brand-cyan" />,
      tagline: "Deploy Lightweight Collector or NGINX Module",
      whatHappens:
        "The wizard generates validated, copyable configuration snippets. You place the snippet in your NGINX config or start the lightweight telemetry daemon with your asset ID and API key. Secrets are never exposed in public bundles.",
      securityCheck: "Revocable API tokens and validated rate-limiting snippets.",
      userAction: "Paste the snippet on your server and restart the service.",
    },
    {
      step: 6,
      title: "Verify Connection & Heartbeat",
      icon: <Activity className="w-5 h-5 text-status-success" />,
      tagline: "Real-Time Telemetry Handshake Confirmation",
      whatHappens:
        "The platform listens for the first heartbeat packet. The dashboard displays the collector's status, latency, and incoming request metrics. Green confirmation only appears when real telemetry has been received.",
      securityCheck: "Backend rejects simulated success if no telemetry is arriving.",
      userAction: "Review the connection health indicator in the wizard.",
    },
    {
      step: 7,
      title: "Review Baseline & Set Policies",
      icon: <Sliders className="w-5 h-5 text-status-warning" />,
      tagline: "Tune Statistical Thresholds & Rate Limits",
      whatHappens:
        "The engine establishes your normal traffic baseline (average RPS and standard deviation). You review defensive rules such as: 'Rate limit IPs exceeding 300 requests/minute' or 'Block aggressive scanning bots'.",
      securityCheck: "Preview mode lets you calculate potential impact before enforcing rules.",
      userAction: "Adjust rate thresholds and click 'Save Policy'.",
    },
    {
      step: 8,
      title: "Monitor Detections & Incidents",
      icon: <AlertTriangle className="w-5 h-5 text-status-critical" />,
      tagline: "Automatic Surge Detection & Alert Dispatch",
      whatHappens:
        "When an unexpected surge occurs (Z-Score > 3.0), the anomaly engine creates an incident record. Alerts are dispatched to your Email, Slack, or Webhook, complete with attack volume, affected URIs, and top source countries.",
      securityCheck: "SSRF-safe webhook dispatcher prevents internal network scanning.",
      userAction: "Open the incident to view the AI-assisted summary and evidence.",
    },
    {
      step: 9,
      title: "Apply Mitigation & Verify Outcome",
      icon: <Zap className="w-5 h-5 text-brand-cyan" />,
      tagline: "Active Enforcement with 1-Click Rollback",
      whatHappens:
        "You approve the defensive action (or let automated rules trigger). The proxy or edge WAF immediately begins returning HTTP 429 to abusive traffic. The console verifies that origin server CPU drops back to safe levels.",
      securityCheck: "Full audit logging and instant 1-click rollback available anytime.",
      userAction: "Confirm the mitigation action and verify normal origin latency.",
    },
    {
      step: 10,
      title: "Review Post-Mortems & Reports",
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      tagline: "Continuous Security Posture Improvement",
      whatHappens:
        "After the attack subsides, Smart DDoS Shield generates an incident post-mortem report detailing the peak attack volume, total packets mitigated, and applied rules. You use this to refine your policies and share reports with stakeholders.",
      securityCheck: "Exportable compliance summaries for audits and management.",
      userAction: "Download the PDF/CSV incident post-mortem report.",
    },
  ];

  const current = steps.find((s) => s.step === activeStep) || steps[0];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
            STEP-BY-STEP WALKTHROUGH
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            How Smart DDoS Shield Works
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            From account creation to active rate limiting, follow the complete 10-step defensive security journey.
          </p>
        </div>

        {/* Interactive Progress Bar */}
        <div className="cyber-card p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-secondary">Interactive Step Navigator</span>
            <span className="text-brand-cyan font-bold">Step {activeStep} of 10</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {steps.map((stg) => {
              const isCurrent = activeStep === stg.step;
              const isPast = activeStep > stg.step;
              return (
                <button
                  key={stg.step}
                  type="button"
                  onClick={() => setActiveStep(stg.step)}
                  className={`py-2 px-1 rounded-lg text-center font-mono text-xs transition-all border ${
                    isCurrent
                      ? "bg-brand-cyan text-background font-bold border-brand-cyan shadow-glow"
                      : isPast
                      ? "bg-panel border-status-success/40 text-status-success font-semibold"
                      : "bg-panel/50 border-border-subtle text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {stg.step < 10 ? `0${stg.step}` : stg.step}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Spotlight Card */}
        <div className="cyber-card p-8 sm:p-10 space-y-8 border-brand-cyan/30 shadow-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-panel border border-brand-cyan/40 text-brand-cyan flex items-center justify-center shadow-glow">
                {current.icon}
              </div>
              <div>
                <span className="text-xs font-mono text-brand-cyan font-semibold">
                  STEP {current.step} OF 10
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-0.5">
                  {current.title}
                </h2>
                <div className="text-xs text-text-secondary font-mono mt-0.5">{current.tagline}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-panel border border-border-subtle disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                type="button"
                disabled={activeStep === 10}
                onClick={() => setActiveStep((prev) => Math.min(prev + 1, 10))}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-brand-cyan text-background font-bold disabled:opacity-40 shadow-glow"
              >
                Next Step →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono text-brand-cyan">
                What Happens at this Step:
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">{current.whatHappens}</p>

              <div className="pt-2">
                <span className="font-semibold text-text-primary">Operator Action:</span>{" "}
                <span className="text-brand-cyan font-mono">{current.userAction}</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-panel border border-border-subtle space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono text-status-success">
                Security & Data Integrity
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">{current.securityCheck}</p>
              <div className="pt-2 text-[11px] font-mono text-text-secondary">
                Verified against RFC specifications and enterprise tenant isolation rules.
              </div>
            </div>
          </div>
        </div>

        {/* 10-Step Sequential Cards Grid */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-text-primary">Complete 10-Step Journey Overview</h3>
            <p className="text-xs text-text-secondary">Click any step to read its details</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s) => (
              <div
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`cyber-card p-4 space-y-2 cursor-pointer transition-all ${
                  activeStep === s.step ? "border-brand-cyan bg-panel" : "hover:border-border-subtle"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-brand-cyan font-bold">0{s.step}</span>
                  <div className="p-1 rounded bg-panel border border-border-subtle">{s.icon}</div>
                </div>
                <h4 className="text-xs font-bold text-text-primary leading-tight line-clamp-1">
                  {s.title}
                </h4>
                <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                  {s.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Step CTA */}
        <div className="p-8 rounded-2xl bg-panel border border-brand-cyan/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-glow">
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              Ready to verify your first domain?
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Start with free telemetry monitoring or explore our detailed integration guides.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl font-bold text-xs bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
            >
              Start Free Setup
            </Link>
            <Link
              href="/guides"
              className="px-5 py-3 rounded-xl font-semibold text-xs bg-panel border border-border-subtle hover:border-brand-cyan/40 text-text-primary transition-all"
            >
              Browse Guides
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
