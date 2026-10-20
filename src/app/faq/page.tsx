import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HelpCircle, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

export default function FaqPage() {
  const faqs = [
    {
      q: "1. What is a DDoS attack?",
      a: "DDoS stands for Distributed Denial of Service. It occurs when multiple compromised computers or automated botnets flood a web server with fake requests at the same time. The goal is to overwhelm the server's CPU, memory, and database connections so that legitimate customers receive errors or cannot access the site.",
    },
    {
      q: "2. Is Smart DDoS Shield suitable for beginners?",
      a: "Yes! The platform is designed specifically so that non-technical business owners and individual developers can understand their website's threat status without having a cybersecurity degree. We provide plain-language explanations, step-by-step wizards, and automated anomaly detection.",
    },
    {
      q: "3. Can I protect a personal website or blog?",
      a: "Absolutely. Our Developer Free tier allows you to monitor and defend a single personal website, portfolio, blog, or hobby project with full access to domain verification, telemetry graphs, and incident alerts at zero cost.",
    },
    {
      q: "4. Does Smart DDoS Shield host my website?",
      a: "No. Your website remains hosted on your existing web host, cloud provider, or VPS (such as Vercel, AWS, DigitalOcean, Hetzner, or Shopify). Smart DDoS Shield operates as a defensive monitoring, telemetry, and rate-limiting enforcement layer.",
    },
    {
      q: "5. Does Smart DDoS Shield replace my existing hosting provider?",
      a: "No. We do not provide web application hosting, databases, or file storage. We protect the servers you already have by inspecting telemetry and enforcing rate-limiting rules.",
    },
    {
      q: "6. Do I need a CDN (Content Delivery Network)?",
      a: "A CDN is not required to use Smart DDoS Shield. You can use our in-line NGINX reverse proxy or lightweight telemetry collector on a standalone VPS or server. However, if your website faces massive multi-gigabit volumetric floods (L3/L4 UDP floods), combining Smart DDoS Shield with an upstream CDN (like Cloudflare) provides the most comprehensive defense.",
    },
    {
      q: "7. Can I connect and protect an API endpoint?",
      a: "Yes. Smart DDoS Shield supports REST, GraphQL, and microservice APIs. You can apply granular rate-limiting policies specifically to sensitive paths such as `/api/checkout`, `/api/login`, or `/api/search` to protect database queries from exhaustion.",
    },
    {
      q: "8. How do I verify domain ownership?",
      a: "To prevent unauthorized users from registering third-party websites, we require domain verification. You can verify ownership in two ways: (1) Adding a simple DNS TXT record (`smart-ddos-verify=token...`), or (2) Placing a small text file at `/.well-known/smart-ddos-challenge.txt` on your server. Verification takes under 2 minutes.",
    },
    {
      q: "9. What if I already use Cloudflare or AWS WAF?",
      a: "Smart DDoS Shield integrates directly with existing Cloudflare and AWS WAF setups! You can connect your Cloudflare Zone ID or AWS WebACL ARN, and our platform will automatically push defensive rate-limiting rules and IP blocklists to your CDN edge without interrupting your current configuration.",
    },
    {
      q: "10. Can I use Smart DDoS Shield without changing my DNS nameservers?",
      a: "Yes! If you do not want to change your domain nameservers, you can verify ownership via the HTTP challenge file and run the in-line NGINX reverse proxy or out-of-path collector. No DNS delegating is required.",
    },
    {
      q: "11. Does Smart DDoS Shield block every attack guaranteed?",
      a: "No cybersecurity vendor can honestly promise 100% immunity from every attack. Massive network-layer volumetric floods (such as 100+ Gbps amplification attacks) can physically saturate the network pipe of a small host server before packets reach software. Smart DDoS Shield excels at Layer 7 application protection, HTTP floods, and API rate limiting, and integrates with CDNs for volumetric defense.",
    },
    {
      q: "12. How do I remove the integration if I want to stop using it?",
      a: "Removing Smart DDoS Shield is completely non-destructive: (1) If using NGINX, remove the `limit_req` lines from your config and reload NGINX. (2) If using a collector, stop the Docker container. (3) If using Cloudflare/AWS, delete the API token or toggle the integration off in your console.",
    },
    {
      q: "13. What happens when telemetry stops arriving?",
      a: "If your collector goes offline or your server stops sending telemetry, the console marks the collector status as DEGRADED or OFFLINE and alerts you. Previously enforced NGINX rate-limiting rules remain running locally on your server so your site remains defended even during temporary connectivity drops.",
    },
    {
      q: "14. How do I delete my account and data?",
      a: "You can delete your user account, workspace assets, and stored telemetry data at any time from Console > Settings. Deletion permanently purges all associated API tokens, verification records, and incident histories in compliance with privacy regulations.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 space-y-12 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ANSWERS TO COMMON QUESTIONS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Everything you need to know about Smart DDoS Shield, domain verification, integrations, and security boundaries.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="cyber-card p-6 space-y-2 hover:border-brand-cyan/40 transition-all"
            >
              <h3 className="text-base font-bold text-text-primary">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Guided Action Strip */}
        <div className="p-8 rounded-2xl bg-panel border border-brand-cyan/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-glow">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-primary">
              Have a question that is not covered here?
            </h3>
            <p className="text-xs text-text-secondary">
              Check out our complete integration tutorials or start setting up your domain.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/guides"
              className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-panel border border-border-subtle hover:border-brand-cyan/40 text-text-primary transition-all"
            >
              Browse Guides
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
            >
              Start Free Setup
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
