import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Shield3D } from "@/components/visuals/Shield3D";
import { NetworkFlowDiagram } from "@/components/visuals/NetworkFlowDiagram";
import { DdosSimulatorVisual } from "@/components/visuals/DdosSimulatorVisual";
import { IntegrationComparisonVisual } from "@/components/visuals/IntegrationComparisonVisual";
import { PRICING_TIERS } from "@/lib/pricing-config";
import {
  Shield,
  ArrowRight,
  Activity,
  AlertTriangle,
  Server,
  Cloud,
  CheckCircle2,
  Lock,
  Layers,
  HelpCircle,
  BookOpen,
  Eye,
  Sliders,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 space-y-24 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border-subtle cyber-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline and CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                  <span className="h-2 w-2 rounded-full bg-brand-cyan animate-ping"></span>
                  ACCESSIBLE DEFENSIVE CYBERSECURITY
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-text-primary leading-tight">
                  Protect Your Website. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-purple-400">
                    Keep Your Business Online.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
                  Distributed Denial of Service (DDoS) attacks can knock your website offline in minutes. Smart DDoS Shield gives developers and business owners plain-language traffic monitoring, automated anomaly detection, and guided rate-limiting defense.
                </p>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow hover:scale-[1.02]"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Protect My Website</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <Link
                    href="/how-it-works"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-panel border border-border-subtle hover:border-brand-cyan/40 text-text-primary transition-all hover:bg-elevated"
                  >
                    <span>Explore How It Works</span>
                  </Link>
                </div>

                {/* Honest Value Badges */}
                <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-text-secondary font-mono">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    DNS or HTTP Ownership Verification
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    Works with NGINX, Cloudflare & AWS
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    Free Developer Tier Available
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive 3D Shield Demonstration */}
              <div className="lg:col-span-5 flex justify-center">
                <Shield3D initialState="MONITORING" showControls={true} />
              </div>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-status-warning font-bold">
              THE BUSINESS RISK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
              What Happens When an Attack Hits an Unprotected Site?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              When bad actors or infected botnets flood a website with hundreds of thousands of fake requests, ordinary web hosting servers quickly become overwhelmed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="cyber-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-status-critical/15 border border-status-critical/30 flex items-center justify-center text-status-critical">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Customers Cannot Access Your Site</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Legitimate shoppers, paying subscribers, and client mobile apps receive &ldquo;502 Bad Gateway&rdquo; or connection timeout errors because the server runs out of memory and worker threads.
              </p>
            </div>

            <div className="cyber-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-status-warning/15 border border-status-warning/30 flex items-center justify-center text-status-warning">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Interrupted Sales & Damaged Trust</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                During an unexpected outage, cart checkouts fail, urgent booking deadlines pass, and frustrated visitors leave for competitors while your engineering team struggles to identify the cause.
              </p>
            </div>

            <div className="cyber-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Operational Panic & Expensive Delays</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Without telemetry and defensive rate limits, teams waste hours sifting through gigabytes of raw access logs trying to figure out which IPs to block and whether the server crashed on its own.
              </p>
            </div>
          </div>
        </section>

        {/* Visual Protection Workflow Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
              DEFENSIVE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
              How Smart DDoS Shield Protects You
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              We separate inbound traffic inspection, statistical anomaly scoring, and rate-limiting enforcement into simple, transparent steps.
            </p>
          </div>

          <NetworkFlowDiagram />

          <div className="pt-6">
            <DdosSimulatorVisual />
          </div>
        </section>

        {/* Core Product Capabilities */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-blue font-bold">
              HONEST CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
              Everything You Need to Defend Your Endpoints
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Built for developers and businesses who need clarity, reliable protection, and zero guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="cyber-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-brand-cyan">
                <Eye className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">Real-Time Traffic Monitoring</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Stream request-per-second rates, HTTP error percentages, and latency metrics directly into your console without complicated server agents.
              </p>
            </div>

            <div className="cyber-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-status-warning">
                <Activity className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">Statistical Anomaly Detection</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Our engine automatically calculates your historical traffic baseline and alerts you when unexpected request surges (Z-Score &gt; 3.0) occur.
              </p>
            </div>

            <div className="cyber-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-status-critical">
                <Sliders className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">Defensive Rate Limiting</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Throttle aggressive crawlers, brute-force login attempts, and flood scripts before they exhaust your origin web server or database.
              </p>
            </div>

            <div className="cyber-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-status-success">
                <Server className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">In-Line NGINX Reverse Proxy</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Deploy ready-to-use NGINX configuration snippets that enforce local rate-limiting rules directly on your Ubuntu, Debian, or Docker host.
              </p>
            </div>

            <div className="cyber-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-brand-blue">
                <Cloud className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">Cloudflare & AWS WAF Adapters</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Automatically push temporary IP blocklists and rate policies to your existing Cloudflare or AWS WAF without switching your hosting provider.
              </p>
            </div>

            <div className="cyber-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <BookOpen className="w-5 h-5" />
                <h4 className="text-sm font-bold text-text-primary">AI-Assisted Incident Analyst</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Receive plain-language summaries of attack spikes, verified root cause explanations, and actionable checklists generated from real telemetry.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-brand-cyan hover:underline"
            >
              <span>Explore Detailed Feature Breakdown (12 Capabilities & Limitations)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Demonstration Sample Dashboard Preview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
              OPERATIONAL CONSOLE PREVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
              Your Personal Security Dashboard
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Here is what your security dashboard looks like once your domain is verified and telemetry is connected.
            </p>
          </div>

          {/* Sample Dashboard UI Mock */}
          <div className="cyber-card p-6 rounded-2xl border border-brand-cyan/30 shadow-glow relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-status-success"></span>
                <span className="font-bold text-text-primary">Protected Asset: api.example-store.com</span>
                <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-mono text-[10px]">
                  Verified Domain
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded bg-panel border border-border-subtle">
                Demonstration Sample Data
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 font-mono">
              <div className="p-4 rounded-xl bg-panel border border-border-subtle">
                <div className="text-xs text-text-secondary">Current Traffic</div>
                <div className="text-2xl font-bold text-brand-cyan mt-1">142 RPS</div>
                <div className="text-[10px] text-status-success mt-1">Normal Baseline</div>
              </div>
              <div className="p-4 rounded-xl bg-panel border border-border-subtle">
                <div className="text-xs text-text-secondary">Incident Status</div>
                <div className="text-2xl font-bold text-status-success mt-1">0 Active</div>
                <div className="text-[10px] text-text-secondary mt-1">Clean SLA</div>
              </div>
              <div className="p-4 rounded-xl bg-panel border border-border-subtle">
                <div className="text-xs text-text-secondary">Collector Health</div>
                <div className="text-2xl font-bold text-status-success mt-1">ONLINE</div>
                <div className="text-[10px] text-text-secondary mt-1">Heartbeat: 4s ago</div>
              </div>
              <div className="p-4 rounded-xl bg-panel border border-border-subtle">
                <div className="text-xs text-text-secondary">Defensive Policy</div>
                <div className="text-2xl font-bold text-brand-blue mt-1">ENFORCING</div>
                <div className="text-[10px] text-text-secondary mt-1">Rate Limit: 500 req/min</div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <span className="text-text-secondary">
                Ready to connect your own domain and see live metrics?
              </span>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg font-bold text-xs bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
              >
                Sign In to Your Workspace →
              </Link>
            </div>
          </div>
        </section>

        {/* Integration Comparison Matrix */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <IntegrationComparisonVisual />
        </section>

        {/* Pricing Preview Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
              TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
              Simple Plans for Developers and Growing Businesses
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Start with free telemetry monitoring and upgrade only when you need active in-line rate limiting and cloud WAF automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`cyber-card p-6 flex flex-col justify-between space-y-6 ${
                  tier.popular ? "border-brand-cyan shadow-glow bg-panel" : ""
                }`}
              >
                <div className="space-y-4">
                  {tier.popular && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40">
                      {tier.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-text-primary">{tier.name}</h3>
                  <div className="font-mono">
                    <span className="text-3xl font-extrabold text-text-primary">{tier.price}</span>
                    <span className="text-xs text-text-secondary ml-1">/ {tier.billingPeriod}</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{tier.tagline}</p>

                  <ul className="space-y-2 pt-3 border-t border-border-subtle text-xs text-text-secondary font-mono">
                    <li className="flex items-center gap-1.5 text-text-primary font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                      <span>{tier.limits.assets}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                      <span>{tier.limits.retention}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                      <span>{tier.limits.supportLevel}</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href={tier.ctaHref}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold text-center transition-all ${
                    tier.popular
                      ? "bg-brand-cyan text-background hover:bg-brand-cyan/90 shadow-glow"
                      : "bg-panel border border-border-subtle hover:border-brand-cyan/40 text-text-primary"
                  }`}
                >
                  {tier.ctaText}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-cyan hover:underline"
            >
              <span>View Full Feature Comparison & Limitations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
              COMMON QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Get direct, honest answers before setting up protection.
            </p>
          </div>

          <div className="space-y-4">
            <div className="cyber-card p-5 space-y-2">
              <h4 className="text-sm font-bold text-text-primary">
                Does Smart DDoS Shield replace my existing web hosting?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                No. Smart DDoS Shield is a defensive security and monitoring layer. Your website stays hosted on your existing provider (such as AWS, Vercel, DigitalOcean, or Hetzner). We provide the telemetry monitoring, anomaly detection, and rate-limiting rules.
              </p>
            </div>

            <div className="cyber-card p-5 space-y-2">
              <h4 className="text-sm font-bold text-text-primary">
                Can I test the platform without changing my DNS?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Yes! You can use HTTP challenge verification and deploy an out-of-path telemetry collector or local NGINX proxy without delegating nameservers or modifying DNS records.
              </p>
            </div>

            <div className="cyber-card p-5 space-y-2">
              <h4 className="text-sm font-bold text-text-primary">
                Does this tool guarantee 100% prevention of every attack?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                No defensive cybersecurity tool can guarantee 100% immunity. Large volumetric network-layer floods (e.g. 50+ Gbps UDP reflection) must be absorbed upstream by an Anycast CDN or tier-1 ISP scrubbing center. Smart DDoS Shield excels at Layer 7 application protection, HTTP flood defense, and rate-limiting enforcement.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-cyan hover:underline"
            >
              <span>Read all 14 Frequently Asked Questions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-panel via-elevated to-panel border border-brand-cyan/40 shadow-glow text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-text-primary">
              Ready to Protect Your Website?
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
              Sign in with Google or GitHub, verify your domain in 2 minutes, and set up defensive monitoring with complete control over your traffic.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-3.5 rounded-xl font-bold text-sm bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow hover:scale-[1.02]"
              >
                Start Free Protection
              </Link>
              <Link
                href="/guides"
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-panel border border-border-subtle hover:border-brand-cyan/40 text-text-primary transition-all"
              >
                Read Setup Guides
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
