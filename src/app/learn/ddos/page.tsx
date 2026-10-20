import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { DdosSimulatorVisual } from "@/components/visuals/DdosSimulatorVisual";
import { Shield3D } from "@/components/visuals/Shield3D";
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  Server,
  Zap,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
} from "lucide-react";

export default function LearnDdosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
            <Info className="w-3.5 h-3.5" />
            <span>CYBERSECURITY BASICS EXPLAINED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            Understanding DDoS Attacks in Plain English
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            You don&apos;t need to be a cybersecurity researcher to understand how DDoS attacks work, why they threaten web applications, and how to defend against them.
          </p>
        </div>

        {/* What is DDoS Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
              THE BASICS
            </span>
            <h2 className="text-2xl font-bold text-text-primary">What Does DDoS Actually Mean?</h2>
            <p>
              <strong className="text-text-primary">DDoS</strong> stands for{" "}
              <em className="text-brand-cyan">Distributed Denial of Service</em>.
            </p>
            <p>
              Imagine a small neighborhood grocery store with one checkout register. Under normal circumstances, shoppers line up, pay for their items, and leave.
            </p>
            <p>
              Now imagine hundreds of people rushing into the store at the exact same second, crowding the checkout counter, asking questions, and refusing to move. Legitimate customers can no longer step inside or buy anything, even though the store building itself hasn&apos;t collapsed.
            </p>
            <p>
              In computer terms, the store is your <strong>web server</strong>, the cash register is your <strong>database or application code</strong>, and the crowd is a <strong>botnet</strong> of compromised computers or scripts sending hundreds of thousands of automated requests.
            </p>
          </div>

          <div className="flex justify-center">
            <Shield3D initialState="ANOMALY_DETECTED" showControls={false} />
          </div>
        </section>

        {/* High Traffic vs DDoS Comparison */}
        <section className="cyber-card p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-status-warning font-bold">
              IMPORTANT DISTINCTION
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              How Does a DDoS Differ from Real Viral Traffic?
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Not every traffic spike is an attack. Distinguishing genuine visitors from automated bot floods is crucial to avoid blocking real customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 rounded-xl bg-panel border border-status-success/30 space-y-3">
              <div className="flex items-center gap-2 text-status-success font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Legitimate High Traffic (Viral Surge)</span>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-1.5">
                  <span className="text-status-success font-bold">•</span>
                  <span>Visitors come from real web browsers with diverse cookies, referrers, and IPs.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-status-success font-bold">•</span>
                  <span>Users browse across various pages (home, about, product details, checkout).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-status-success font-bold">•</span>
                  <span>Visitors download images, CSS, and JavaScript assets like normal humans.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-status-success font-bold">•</span>
                  <span>Traffic increases steadily as marketing links or social media posts circulate.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-panel border border-status-critical/30 space-y-3">
              <div className="flex items-center gap-2 text-status-critical font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Malicious DDoS Flood (Bot Attack)</span>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-1.5">
                  <span className="text-status-critical font-bold">•</span>
                  <span>Traffic spikes from zero to thousands of requests in 3 to 10 seconds.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-status-critical font-bold">•</span>
                  <span>Repeated hits hammer expensive database endpoints (e.g. search queries or password resets).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-status-critical font-bold">•</span>
                  <span>Requests often miss standard browser headers, referrer headers, or session cookies.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-status-critical font-bold">•</span>
                  <span>Origin server CPU and RAM spike to 100%, causing HTTP 502 or 504 gateway errors.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* L4 Network vs L7 Application Layer */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-blue font-bold">
              THE TWO MAIN ATTACK FAMILIES
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              Layer 4 (Network) vs. Layer 7 (Application)
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Knowing which layer is being targeted determines how the attack can be successfully mitigated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="cyber-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-brand-blue">
                <Cpu className="w-5 h-5" />
                <h3 className="text-base font-bold text-text-primary">
                  Network-Layer (L3 / L4) Volumetric Attacks
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                These attacks saturate the internet pipe leading to your server. Examples include SYN floods, UDP reflection, and ICMP ping floods. The attacker sends so much raw network data that no traffic can reach your server rack.
              </p>
              <div className="p-3 rounded-lg bg-panel border border-border-subtle text-[11px] font-mono text-text-secondary">
                <span className="text-text-primary font-semibold">How it is mitigated:</span> Absorbed upstream by global Anycast edge networks (like Cloudflare or AWS Shield) or ISP scrubbing centers before reaching your host.
              </div>
            </div>

            <div className="cyber-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-brand-cyan">
                <Layers className="w-5 h-5" />
                <h3 className="text-base font-bold text-text-primary">
                  Application-Layer (L7) HTTP Floods
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                These attacks mimic valid website visits by sending thousands of HTTP GET or POST requests per second. Even small volumetric bandwidth (e.g. 5 Mbps) can completely exhaust server CPU, database connection pools, and Node/Python/Ruby workers.
              </p>
              <div className="p-3 rounded-lg bg-panel border border-border-subtle text-[11px] font-mono text-text-secondary">
                <span className="text-text-primary font-semibold">How it is mitigated:</span> Detected by statistical anomaly algorithms (Smart DDoS Shield) and filtered using in-line reverse proxies (NGINX), rate-limiting, and CAPTCHAs.
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Visual Scrubber */}
        <section className="space-y-4">
          <DdosSimulatorVisual />
        </section>

        {/* Honest Limitations Notice */}
        <section className="p-6 rounded-2xl bg-panel border border-status-warning/40 space-y-3">
          <div className="flex items-center gap-2 text-status-warning font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Honest Product Scope: Why No Single Tool Solves Every Attack</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            If an attacker points a 100 Gbps UDP reflection flood at a single $20/month VPS with a 1 Gbps network card, the server&apos;s physical network link will saturate regardless of how smart the software on the server is.
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            That is why enterprise defense combines <strong>upstream CDN scrubbing</strong> (for large volumetric pipes) with <strong>Smart DDoS Shield rate limiting and anomaly monitoring</strong> (for targeted application, API, and credential-stuffing defense).
          </p>
        </section>

        {/* Next Step CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-elevated border border-border-subtle">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Want to see why your business needs this?</h3>
            <p className="text-xs text-text-secondary">
              Learn how downtime impacts e-commerce, SaaS, APIs, and client trust.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/why-protection"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center gap-1.5"
            >
              <span>Explore Business Impact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
