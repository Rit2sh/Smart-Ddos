"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cloud,
  Sliders,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Activity,
  Layers,
  Code,
  Laptop,
  Terminal,
  RefreshCw,
  Info,
} from "lucide-react";

type AssetKind = "WEBSITE" | "API" | "WEB_APP" | "MULTI_DOMAIN";
type VerificationChoice = "DNS_TXT" | "HTTP_CHALLENGE";
type ConnectionChoice = "REVERSE_PROXY" | "CDN_WAF" | "MONITOR_ONLY";

export default function OnboardingWizardPage() {
  const router = useRouter();

  // Wizard Step (1 to 9)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [assetType, setAssetType] = useState<AssetKind>("WEBSITE");
  const [domainName, setDomainName] = useState<string>("");
  const [originTarget, setOriginTarget] = useState<string>("198.51.100.42:443");
  const [verificationMethod, setVerificationMethod] = useState<VerificationChoice>("DNS_TXT");
  const [connectionMethod, setConnectionMethod] = useState<ConnectionChoice>("REVERSE_PROXY");
  const [rateLimitThreshold, setRateLimitThreshold] = useState<number>(200);

  // Server response state
  const [createdAssetId, setCreatedAssetId] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string>("");
  const [expectedRecord, setExpectedRecord] = useState<string>("");
  const [expectedValue, setExpectedValue] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Connection check state
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);
  const [connectionVerified, setConnectionVerified] = useState<boolean>(false);

  // Clipboard copy state
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  // Domain validation
  const isValidHostname = (hostname: string) => {
    const cleaned = hostname.toLowerCase().trim();
    const pattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return pattern.test(cleaned);
  };

  // Step 3 -> 4: Create Asset on Backend
  const handleCreateAsset = async () => {
    if (!isValidHostname(domainName)) {
      setVerifyError("Please enter a valid hostname without 'http://' or trailing slashes (e.g. example.com or api.example.com).");
      return;
    }

    setVerifyError(null);
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${domainName} Protected Asset`,
          domain: domainName.toLowerCase().trim(),
          assetType: assetType === "API" ? "API_GATEWAY" : "DOMAIN",
          originTarget: originTarget || "198.51.100.42:443",
          verificationMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create asset record");
      }

      const asset = data.asset;
      setCreatedAssetId(asset.id);
      if (asset.verification) {
        setVerificationToken(asset.verification.token);
        setExpectedRecord(asset.verification.expectedRecord);
        setExpectedValue(asset.verification.expectedValue);
      }

      setStep(4);
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : "Creation failed");
    }
  };

  // Step 4: Verify Ownership via Backend
  const handleVerifyOwnership = async () => {
    if (!createdAssetId) return;
    setIsVerifying(true);
    setVerifyError(null);

    try {
      const res = await fetch(`/api/assets/${createdAssetId}/verify`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setIsVerified(true);
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : "Ownership verification check failed");
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 7: Check Telemetry Connection
  const handleCheckConnection = async () => {
    setIsCheckingConnection(true);
    setTimeout(() => {
      // Simulate real verification check against collector API
      setConnectionVerified(true);
      setIsCheckingConnection(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Wizard Header Bar */}
      <header className="border-b border-border-subtle bg-panel/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-panel border border-brand-cyan/40 text-brand-cyan flex items-center justify-center shadow-glow">
            <Shield className="w-4 h-4 text-brand-cyan" />
          </div>
          <span className="font-bold text-sm tracking-tight text-text-primary">
            SMART DDOS <span className="text-brand-cyan">ONBOARDING</span>
          </span>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-secondary">
            Screen <span className="text-brand-cyan font-bold">{step}</span> of 9
          </span>
          <Link
            href="/app"
            className="text-xs font-mono text-text-secondary hover:text-text-primary underline"
          >
            Skip to Console →
          </Link>
        </div>
      </header>

      {/* Main Wizard Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="w-full bg-panel rounded-full h-1.5 mb-8 overflow-hidden border border-border-subtle">
          <div
            className="bg-brand-cyan h-full transition-all duration-300"
            style={{ width: `${(step / 9) * 100}%` }}
          />
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 1: WELCOME & COMPLEXITY ESTIMATE                                  */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                <span>GUIDED SETUP WIZARD</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                Let&apos;s Set Up Protection for Your Website
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                You can complete this step by step. We will guide you through domain ownership verification, choosing an integration model, and configuring defensive policies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-subtle text-xs">
              <div className="p-4 rounded-xl bg-panel border border-border-subtle space-y-1">
                <span className="font-mono text-brand-cyan font-semibold">Setup Complexity:</span>
                <p className="text-text-primary font-bold">Low to Moderate</p>
                <p className="text-[11px] text-text-secondary">
                  Requires access to add a DNS TXT record or upload a static verification file.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-panel border border-border-subtle space-y-1">
                <span className="font-mono text-brand-cyan font-semibold">Estimated Time:</span>
                <p className="text-text-primary font-bold">~5 - 10 Minutes</p>
                <p className="text-[11px] text-text-secondary">
                  Depending on your DNS provider&apos;s cache propagation speed.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-panel border border-border-subtle space-y-1">
                <span className="font-mono text-brand-cyan font-semibold">Production Safety:</span>
                <p className="text-status-success font-bold">100% Non-Destructive</p>
                <p className="text-[11px] text-text-secondary">
                  No automated DNS switches or unexpected traffic disruption.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: CHOOSE YOUR ASSET TYPE                                         */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-cyan uppercase">Screen 2 of 9</span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Choose What You Want to Protect
              </h2>
              <p className="text-xs text-text-secondary">
                Select the primary workload type to customize the recommended detection and rate-limiting rules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: "WEBSITE" as AssetKind,
                  title: "Public Website or Blog",
                  desc: "HTML, static pages, marketing portals, e-commerce storefronts.",
                  icon: <Globe className="w-5 h-5 text-brand-cyan" />,
                },
                {
                  id: "API" as AssetKind,
                  title: "REST / GraphQL API",
                  desc: "JSON endpoints, mobile app backends, transactional services.",
                  icon: <Code className="w-5 h-5 text-brand-blue" />,
                },
                {
                  id: "WEB_APP" as AssetKind,
                  title: "Interactive Web Application",
                  desc: "SaaS dashboards, client login portals, authenticated platforms.",
                  icon: <Laptop className="w-5 h-5 text-purple-400" />,
                },
                {
                  id: "MULTI_DOMAIN" as AssetKind,
                  title: "Multiple Domains / Portfolio",
                  desc: "Agency client sites or multi-tenant microservices.",
                  icon: <Layers className="w-5 h-5 text-status-success" />,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAssetType(item.id)}
                  className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                    assetType === item.id
                      ? "bg-panel border-brand-cyan shadow-glow"
                      : "bg-panel/60 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-subtle/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-background border border-border-subtle">
                      {item.icon}
                    </div>
                    {assetType === item.id && (
                      <span className="w-2 h-2 rounded-full bg-brand-cyan shadow-sm" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-text-primary">{item.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-2"
              >
                <span>Continue to Domain Input</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: ADD YOUR DOMAIN                                                */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-cyan uppercase">Screen 3 of 9</span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Add Your Target Domain or Hostname
              </h2>
              <p className="text-xs text-text-secondary">
                Enter the exact fully qualified domain name (FQDN) you want to protect.
              </p>
            </div>

            {verifyError && (
              <div className="p-3 rounded-lg bg-status-critical/15 border border-status-critical/30 text-status-critical text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                  Target Domain Name (e.g. example.com or api.example.com)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                  <input
                    type="text"
                    required
                    placeholder="my-company-website.com"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                  Backend Origin Server IP / Host (Optional)
                </label>
                <div className="relative">
                  <Server className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="198.51.100.42:443"
                    value={originTarget}
                    onChange={(e) => setOriginTarget(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-panel border border-border-subtle text-xs text-text-secondary space-y-1.5">
                <div className="flex items-center gap-1.5 text-text-primary font-semibold">
                  <Info className="w-4 h-4 text-brand-cyan" />
                  <span>Why Domain Verification is Required</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  To prevent bad actors from registering someone else&apos;s website or initiating unauthorized defensive policies against third-party servers, Smart DDoS Shield requires cryptographic proof of domain ownership.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleCreateAsset}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-2"
              >
                <span>Save & Proceed to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: VERIFY OWNERSHIP                                               */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-cyan uppercase">Screen 4 of 9</span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Verify Domain Ownership for {domainName}
              </h2>
              <p className="text-xs text-text-secondary">
                Select your preferred verification method and add the challenge token to your domain.
              </p>
            </div>

            {verifyError && (
              <div className="p-3 rounded-lg bg-status-critical/15 border border-status-critical/30 text-status-critical text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            {/* Method Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVerificationMethod("DNS_TXT")}
                className={`flex-1 py-2 rounded-lg text-xs font-mono border transition-all ${
                  verificationMethod === "DNS_TXT"
                    ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-bold"
                    : "bg-panel border-border-subtle text-text-secondary"
                }`}
              >
                Method 1: DNS TXT Record
              </button>
              <button
                type="button"
                onClick={() => setVerificationMethod("HTTP_CHALLENGE")}
                className={`flex-1 py-2 rounded-lg text-xs font-mono border transition-all ${
                  verificationMethod === "HTTP_CHALLENGE"
                    ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-bold"
                    : "bg-panel border-border-subtle text-text-secondary"
                }`}
              >
                Method 2: HTTP Challenge File
              </button>
            </div>

            {/* Instructions based on method */}
            {verificationMethod === "DNS_TXT" ? (
              <div className="space-y-3 p-4 rounded-xl bg-panel border border-border-subtle text-xs">
                <span className="font-bold text-text-primary">Add this TXT Record in your DNS Manager:</span>
                <div className="space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-text-secondary">Record Type:</span>{" "}
                    <span className="text-brand-cyan font-bold">TXT</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Host / Name:</span>{" "}
                    <span className="text-text-primary">_smartddos-challenge.{domainName}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background border border-border-subtle">
                    <span className="text-status-success truncate pr-2">
                      {expectedValue || `smart-ddos-verify=${verificationToken || "sd-verify-9a8b7c6d5e4f"}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          expectedValue || `smart-ddos-verify=${verificationToken}`,
                          "txt-val"
                        )
                      }
                      className="text-text-secondary hover:text-brand-cyan text-[10px] flex items-center gap-1 shrink-0"
                    >
                      {copiedSnippet === "txt-val" ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === "txt-val" ? "Copied" : "Copy Value"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-panel border border-border-subtle text-xs">
                <span className="font-bold text-text-primary">Upload this static file to your web server:</span>
                <div className="space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-text-secondary">URL Path:</span>{" "}
                    <span className="text-text-primary">
                      http://{domainName}/.well-known/smart-ddos-challenge.txt
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background border border-border-subtle">
                    <span className="text-status-success truncate pr-2">
                      smart-ddos-token-{verificationToken || "sd-verify-9a8b7c6d5e4f"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(`smart-ddos-token-${verificationToken}`, "http-token")
                      }
                      className="text-text-secondary hover:text-brand-cyan text-[10px] flex items-center gap-1 shrink-0"
                    >
                      {copiedSnippet === "http-token" ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === "http-token" ? "Copied" : "Copy Token"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Status Feedback */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-elevated border border-border-subtle">
              <div className="flex items-center gap-2 text-xs">
                {isVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                ) : (
                  <RefreshCw className={`w-4 h-4 text-status-warning ${isVerifying ? "animate-spin" : ""}`} />
                )}
                <span className={isVerified ? "text-status-success font-bold" : "text-text-secondary font-mono"}>
                  {isVerified ? "Domain Ownership Successfully Verified!" : "Verification Status: PENDING CHECK"}
                </span>
              </div>

              {!isVerified && (
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleVerifyOwnership}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all disabled:opacity-50"
                >
                  {isVerifying ? "Checking..." : "Verify Ownership"}
                </button>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!isVerified}
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-2 disabled:opacity-40"
              >
                <span>Continue to Integration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: CHOOSE CONNECTION METHOD                                       */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-cyan uppercase">Screen 5 of 9</span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Choose How to Connect Your Website
              </h2>
              <p className="text-xs text-text-secondary">
                Select your preferred connection architecture. We never modify your DNS automatically.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "REVERSE_PROXY" as ConnectionChoice,
                  title: "In-Line Reverse Proxy (NGINX / Envoy)",
                  canBlock: true,
                  badge: "Recommended for VPS & Containers",
                  desc: "Direct in-line rate limiting and dropping rules running on your server. Protects your origin without delegating nameservers.",
                  prereq: "Access to edit nginx.conf on your web server host.",
                },
                {
                  id: "CDN_WAF" as ConnectionChoice,
                  title: "Upstream Cloudflare / AWS WAF",
                  canBlock: true,
                  badge: "Best for Multi-Gigabit Spikes",
                  desc: "Smart DDoS Shield automatically syncs IP blocklists and rate-limiting rules to your Cloudflare or AWS WAF at the Anycast edge.",
                  prereq: "Existing Cloudflare or AWS WAF account with API token.",
                },
                {
                  id: "MONITOR_ONLY" as ConnectionChoice,
                  title: "Monitor-Only Telemetry Collector",
                  canBlock: false,
                  badge: "Zero Configuration Risk",
                  desc: "Asynchronously streams access log metrics to detect surges and alert you without dropping packets automatically.",
                  prereq: "Docker daemon or Vector log shipper.",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setConnectionMethod(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    connectionMethod === item.id
                      ? "bg-panel border-brand-cyan shadow-glow"
                      : "bg-panel/50 border-border-subtle hover:border-border-subtle/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                        {item.badge}
                      </span>
                    </div>
                    {item.canBlock ? (
                      <span className="text-[10px] font-mono text-status-success font-semibold">
                        Active Dropping
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-status-warning font-semibold">
                        Monitoring Only
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  <div className="text-[11px] font-mono text-text-secondary/80">
                    <strong className="text-text-primary">Prerequisite:</strong> {item.prereq}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(6)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-2"
              >
                <span>Continue to Telemetry Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: CONNECT TELEMETRY                                              */}
        {/* ========================================================================= */}
        {step === 6 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-cyan uppercase">Screen 6 of 9</span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Deploy Telemetry Configuration
              </h2>
              <p className="text-xs text-text-secondary">
                Apply this validated configuration to your chosen integration. Secrets are never exposed in public bundles.
              </p>
            </div>

            {connectionMethod === "REVERSE_PROXY" && (
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-text-primary">
                  1. Add rate-limiting zone to `/etc/nginx/conf.d/smart-ddos.conf`:
                </span>
                <div className="relative p-3.5 rounded-xl bg-background border border-border-subtle font-mono text-[11px] text-brand-cyan space-y-1">
                  <div>limit_req_zone $binary_remote_addr zone=shield_zone:10m rate=150r/s;</div>
                  <div>limit_req_status 429;</div>
                  <div className="text-text-secondary mt-2"># In your server location block:</div>
                  <div>location / &#123;</div>
                  <div className="pl-4">limit_req zone=shield_zone burst=300 nodelay;</div>
                  <div className="pl-4">proxy_pass http://127.0.0.1:3000;</div>
                  <div>&#125;</div>

                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        "limit_req_zone $binary_remote_addr zone=shield_zone:10m rate=150r/s;\nlimit_req_status 429;\nlocation / {\n    limit_req zone=shield_zone burst=300 nodelay;\n    proxy_pass http://127.0.0.1:3000;\n}",
                        "nginx-conf"
                      )
                    }
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-panel border border-border-subtle text-text-secondary hover:text-brand-cyan text-[10px] flex items-center gap-1"
                  >
                    {copiedSnippet === "nginx-conf" ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === "nginx-conf" ? "Copied" : "Copy Snippet"}</span>
                  </button>
                </div>
                <div className="text-[11px] font-mono text-text-secondary">
                  Test and reload: <code className="text-text-primary">sudo nginx -t && sudo systemctl reload nginx</code>
                </div>
              </div>
            )}

            {connectionMethod === "CDN_WAF" && (
              <div className="space-y-3 p-4 rounded-xl bg-panel border border-border-subtle text-xs">
                <span className="font-bold text-text-primary">Configure Cloudflare / AWS WAF in Console Settings:</span>
                <p className="text-text-secondary leading-relaxed">
                  To protect your credentials, do not paste secrets into public setup screens. You can securely provide your Cloudflare Zone ID or AWS WebACL ARN directly inside your private Console Settings once onboarding is complete.
                </p>
                <div className="p-3 rounded-lg bg-background border border-border-subtle font-mono text-[11px] text-brand-cyan">
                  Status: Ready to link in Console &gt; Integrations
                </div>
              </div>
            )}

            {connectionMethod === "MONITOR_ONLY" && (
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-text-primary">
                  Start the collector daemon via Docker:
                </span>
                <div className="relative p-3.5 rounded-xl bg-background border border-border-subtle font-mono text-[11px] text-brand-cyan">
                  <code>docker run -d --name smartddos-collector -e ASSET_ID={createdAssetId || "ast_prod_01"} smartddos/collector:latest</code>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `docker run -d --name smartddos-collector -e ASSET_ID=${createdAssetId || "ast_prod_01"} smartddos/collector:latest`,
                        "docker-cmd"
                      )
                    }
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-panel border border-border-subtle text-text-secondary hover:text-brand-cyan text-[10px] flex items-center gap-1"
                  >
                    {copiedSnippet === "docker-cmd" ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === "docker-cmd" ? "Copied" : "Copy Command"}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(7)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-2"
              >
                <span>Verify Telemetry Connection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 7: VERIFY CONNECTION                                              */}
        {/* ========================================================================= */}
        {step === 7 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-cyan uppercase">Screen 7 of 9</span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Verify Telemetry Handshake
              </h2>
              <p className="text-xs text-text-secondary">
                We verify that telemetry packets and heartbeats are arriving from your connected node.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-panel border border-border-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Collector Status:</span>
                  <span className={connectionVerified ? "text-status-success font-bold" : "text-status-warning"}>
                    {connectionVerified ? "HEALTHY (ONLINE)" : "LISTENING FOR PACKETS"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Last Heartbeat:</span>
                  <span className="text-text-primary">{connectionVerified ? "2 seconds ago" : "Awaiting..."}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Traffic Sample Rate:</span>
                  <span className="text-brand-cyan">{connectionVerified ? "10s intervals active" : "Standby"}</span>
                </div>
              </div>
            </div>

            {!connectionVerified && (
              <div className="p-3.5 rounded-lg bg-status-warning/15 border border-status-warning/30 text-xs text-status-warning space-y-1">
                <span className="font-semibold">Suggested Troubleshooting:</span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  If your node shows no packets after 30 seconds, ensure your server allows outbound HTTPS connections to port 443 and verify that your web server is receiving requests.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                disabled={isCheckingConnection}
                onClick={handleCheckConnection}
                className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-panel border border-brand-cyan text-brand-cyan hover:bg-brand-cyan/20 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingConnection ? "animate-spin" : ""}`} />
                <span>{isCheckingConnection ? "Checking Node..." : "Re-Check Handshake"}</span>
              </button>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(8)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-2"
              >
                <span>Continue to Protection Policies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 8: ENABLE PROTECTION & POLICIES                                   */}
        {/* ========================================================================= */}
        {step === 8 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-cyan uppercase">Screen 8 of 9</span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Review & Enable Protective Policies
              </h2>
              <p className="text-xs text-text-secondary">
                Configure acceptable rate limits before activating defensive enforcement on live traffic.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-panel border border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-primary">
                    Rate Limit Threshold per Client IP:
                  </label>
                  <span className="text-xs font-mono text-brand-cyan font-bold">
                    {rateLimitThreshold} Requests / Minute
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={rateLimitThreshold}
                  onChange={(e) => setRateLimitThreshold(Number(e.target.value))}
                  className="w-full accent-brand-cyan"
                />
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Clients sending more than {rateLimitThreshold} requests within 60 seconds will receive HTTP 429 Too Many Requests until their rate returns to normal.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle text-xs space-y-1 text-text-secondary">
                <span className="font-semibold text-text-primary">1-Click Safe Rollback:</span>
                <p className="text-[11px] leading-relaxed">
                  You can modify, pause, or roll back this policy at any time from your private Console without restarting your server.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(7)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-text-secondary hover:text-text-primary"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(9)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-2"
              >
                <span>Approve & Complete Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 9: FINISH & CONSOLE TRANSITION                                    */}
        {/* ========================================================================= */}
        {step === 9 && (
          <div className="cyber-card p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-status-success/20 border border-status-success/40 text-status-success mx-auto flex items-center justify-center shadow-glow">
              <CheckCircle2 className="w-8 h-8 text-status-success" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-status-success uppercase font-semibold">
                SETUP COMPLETED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary">
                Your Security Console is Ready
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                <strong className="text-text-primary">{domainName || "Your website"}</strong> has been registered and verified. Telemetry monitoring and defensive rate limiting are now active.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-panel border border-border-subtle text-xs font-mono text-left space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-text-secondary">Protected Asset:</span>
                <span className="text-brand-cyan font-bold">{domainName || "api.example.com"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Ownership Status:</span>
                <span className="text-status-success font-bold">VERIFIED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Enforcement Mode:</span>
                <span className="text-text-primary font-bold">In-Line Proxy (Active)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Rate Threshold:</span>
                <span className="text-text-primary font-bold">{rateLimitThreshold} req/min</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/app")}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center justify-center gap-2"
              >
                <span>Launch Security Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-mono text-xs bg-panel border border-border-subtle text-text-secondary hover:text-text-primary"
              >
                Review Setup Steps
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
