import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  ShoppingBag,
  Cloud,
  Rocket,
  Code,
  Calendar,
  AlertOctagon,
  TrendingDown,
  Clock,
  ShieldCheck,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function WhyProtectionPage() {
  const businessScenarios = [
    {
      type: "E-Commerce Store",
      icon: <ShoppingBag className="w-5 h-5 text-brand-cyan" />,
      scenario:
        "An online retailer launches a seasonal marketing campaign. Competitors or ransom botnets flood the checkout API endpoint with fake order attempts.",
      consequence:
        "Genuine shoppers see loading spinners or gateway timeouts at payment checkout. Carts are abandoned, ad spend is wasted, and customers complete purchases on competing websites.",
      defenseRole:
        "Smart DDoS Shield rate limits abusive checkout requests per IP/subnet, ensuring legitimate shoppers can complete transactions smoothly.",
    },
    {
      type: "B2B SaaS Platform",
      icon: <Cloud className="w-5 h-5 text-brand-blue" />,
      scenario:
        "A SaaS tool providing payroll, billing, or inventory management experiences an HTTP flood targeting search and export endpoints.",
      consequence:
        "Tenant customer accounts fail to load. Enterprise clients open critical P1 support tickets, threatening SLA penalties, contract non-renewals, and reputational damage.",
      defenseRole:
        "Our telemetry engine flags abnormal query spikes, isolates the abusive traffic signature, and helps operators apply protective rate limits without rebooting servers.",
    },
    {
      type: "Startup Website & Launch",
      icon: <Rocket className="w-5 h-5 text-purple-400" />,
      scenario:
        "A startup launches on Product Hunt or Hacker News. An opportunistic attacker uses automated scripts to overwhelm the landing page and signup flow.",
      consequence:
        "New visitors think the product is broken or a scam. The single greatest day of organic press attention results in a blank 502 error screen.",
      defenseRole:
        "Free and starter telemetry monitoring lets founders verify their apex domain in under 3 minutes and safeguard signup routes with lightweight proxy rate limits.",
    },
    {
      type: "Public API & Mobile Backends",
      icon: <Code className="w-5 h-5 text-status-success" />,
      scenario:
        "A public REST or GraphQL API serving mobile applications suffers a credential-stuffing flood or unauthenticated scraper spike.",
      consequence:
        "Database connection pools exhaust in seconds. Mobile apps crash or display authentication errors for hundreds of thousands of active users.",
      defenseRole:
        "In-line proxy and Cloudflare/AWS adapters restrict excessive requests to API routes while preserving access for authorized mobile client tokens.",
    },
    {
      type: "Booking & Reservation Service",
      icon: <Calendar className="w-5 h-5 text-status-warning" />,
      scenario:
        "A medical clinic, ticket vendor, or travel agency platform opens reservations for high-demand time slots.",
      consequence:
        "Ticket-scalping bots or malicious scrapers crowd out human visitors, causing database locks and phone lines to ring off the hook with customer complaints.",
      defenseRole:
        "Defensive rate policies and CAPTCHA challenge requirements ensure humans get fair access to reservation time slots.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
            THE REAL-WORLD IMPACT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            Why Every Online Business Needs DDoS Defense
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Downtime is not just a technical issue — it directly affects revenue, customer retention, engineering morale, and brand credibility.
          </p>
        </div>

        {/* 4 Pillars of Business Damage */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-status-critical/15 text-status-critical flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Direct Revenue Interruption</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              When checkout flows, subscription payments, or booking forms are unreachable, customers cannot pay you. Every minute offline is immediate lost revenue.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-status-warning/15 text-status-warning flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Erosion of Customer Trust</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              First impressions matter. If an authorized user encounters a broken site or unresponsive API, they assume the platform is unstable and question security.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">High Investigation Overhead</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Without structured telemetry and anomaly alerts, engineers waste hours troubleshooting whether a crash was caused by bad code, database locks, or attack traffic.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-400/15 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Security Posture Dilution</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              DDoS attacks often accompany vulnerability scans or credential stuffing. A distracted ops team under traffic pressure can miss subtle data breaches.
            </p>
          </div>
        </section>

        {/* Realistic Industry Scenarios */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-blue font-bold">
              CASE SCENARIOS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              How Attacks Target Different Business Models
            </h2>
            <p className="text-xs text-text-secondary">
              See what an attack looks like for your specific operational architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessScenarios.map((item) => (
              <div key={item.type} className="cyber-card p-6 space-y-4 hover:border-brand-cyan/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-panel border border-border-subtle">{item.icon}</div>
                  <h3 className="text-base font-bold text-text-primary">{item.type}</h3>
                </div>

                <div className="space-y-2 text-xs leading-relaxed">
                  <div>
                    <span className="text-text-primary font-semibold">The Threat:</span>{" "}
                    <span className="text-text-secondary">{item.scenario}</span>
                  </div>
                  <div>
                    <span className="text-status-critical font-semibold">The Impact:</span>{" "}
                    <span className="text-text-secondary">{item.consequence}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-panel border border-brand-cyan/20 text-brand-cyan">
                    <span className="font-semibold text-text-primary">How Shield Helps:</span>{" "}
                    <span>{item.defenseRole}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guided Action Callout */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-panel via-elevated to-panel border border-brand-cyan/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-text-primary">
              Ready to see how Smart DDoS Shield sets up in practice?
            </h3>
            <p className="text-xs text-text-secondary max-w-xl">
              Explore our 10-step protection walkthrough from domain verification to rate-limiting policy activation.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="px-6 py-3 rounded-xl font-bold text-xs bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow shrink-0 flex items-center gap-1.5"
          >
            <span>See How It Works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
