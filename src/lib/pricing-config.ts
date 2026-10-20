export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  billingPeriod: string;
  badge?: string;
  popular?: boolean;
  idealFor: string;
  limits: {
    assets: string;
    retention: string;
    rpsThreshold: string;
    teamMembers: string;
    supportLevel: string;
  };
  features: string[];
  honestLimitation: string;
  ctaText: string;
  ctaHref: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "developer-free",
    name: "Developer / Free",
    tagline: "Defensive telemetry monitoring and vulnerability discovery for hobby projects and single domains.",
    price: "$0",
    billingPeriod: "forever free",
    idealFor: "Individual developers, side projects, open source sites, pre-launch testing.",
    limits: {
      assets: "1 Verified Domain",
      retention: "24 Hours History",
      rpsThreshold: "Up to 500 RPS",
      teamMembers: "1 Account",
      supportLevel: "Community & Self-Service Guides",
    },
    features: [
      "1 Domain or API Endpoint",
      "Real-time Telemetry Ingestion (10s intervals)",
      "DNS TXT & HTTP Challenge Domain Verification",
      "Z-Score Anomaly Spike Detection",
      "Out-of-Path Telemetry Collector Integration",
      "Incident Timeline & Threat Evidence Viewer",
      "Manual Rate-Limiting Policy Preview",
    ],
    honestLimitation:
      "Telemetry monitoring and anomaly detection only. Does not include active in-line packet filtering or CDN WAF sync.",
    ctaText: "Start Free Monitoring",
    ctaHref: "/signup?tier=free",
  },
  {
    id: "starter",
    name: "Starter Protection",
    tagline: "Essential automated protection and defensive rate limiting for production websites and startups.",
    price: "$49",
    billingPeriod: "per month",
    popular: true,
    badge: "MOST POPULAR FOR STARTUPS",
    idealFor: "Startups, e-commerce stores, freelancers managing client websites, business web apps.",
    limits: {
      assets: "Up to 3 Domains / APIs",
      retention: "7 Days Telemetry",
      rpsThreshold: "Up to 5,000 RPS",
      teamMembers: "3 Team Members",
      supportLevel: "Email Support (24h response)",
    },
    features: [
      "Everything in Developer, plus:",
      "In-Line NGINX Reverse Proxy Integration",
      "Automated Defensive Rate-Limiting (HTTP 429)",
      "Instant Email & Webhook Incident Alerts",
      "AI-Assisted Incident Explanations & Summaries",
      "One-Click Policy Safe Rollback",
      "Detailed Audit Trail & Post-Mortem Reports",
    ],
    honestLimitation:
      "Protects against application-layer (L7) HTTP floods. Attacks exceeding the host server network uplink bandwidth require CDN edge scrubbing.",
    ctaText: "Protect 3 Websites",
    ctaHref: "/signup?tier=starter",
  },
  {
    id: "business",
    name: "Business Defense",
    tagline: "Multi-asset defense with upstream CDN sync and edge mitigation for high-traffic SaaS and APIs.",
    price: "$199",
    billingPeriod: "per month",
    idealFor: "SaaS companies, public APIs, e-commerce businesses, digital agencies.",
    limits: {
      assets: "Up to 10 Domains / APIs",
      retention: "30 Days Telemetry",
      rpsThreshold: "Up to 25,000 RPS",
      teamMembers: "10 Team Members",
      supportLevel: "Priority Support (4h response)",
    },
    features: [
      "Everything in Starter, plus:",
      "Cloudflare WAF & AWS Shield Adapter Integrations",
      "Synchronized Edge IP Blacklisting & Challenge Rules",
      "Multi-Asset Aggregated Threat Dashboard",
      "Custom Anomaly Sensitivity Tuning (Z-Score & Percentile)",
      "Exportable CSV Security Audit & Compliance Reports",
      "API Key Access for CI/CD Automation",
    ],
    honestLimitation:
      "Requires Cloudflare or AWS API credentials with appropriate WAF management permissions to sync edge rules.",
    ctaText: "Get Business Protection",
    ctaHref: "/signup?tier=business",
  },
  {
    id: "enterprise",
    name: "Custom Enterprise",
    tagline: "Dedicated telemetry collector clusters, bespoke SLA, and tailored architectural integration.",
    price: "Custom",
    billingPeriod: "annual billing",
    idealFor: "Large enterprises, financial institutions, telecommunications, high-volume transactional platforms.",
    limits: {
      assets: "Unlimited Assets",
      retention: "90+ Days Telemetry",
      rpsThreshold: "Unlimited (Bespoke)",
      teamMembers: "Unlimited RBAC",
      supportLevel: "Dedicated Slack / Teams & 15m Incident SLA",
    },
    features: [
      "Everything in Business, plus:",
      "Dedicated High-Throughput Edge Collector Daemon",
      "Custom In-Memory Rule Engine & eBPF Kernels",
      "SSO / SAML Okta & Azure AD Integration",
      "Custom Webhook & SIEM Export (Splunk / Datadog)",
      "Dedicated Solutions Architect & Security Reviews",
      "Tailored Incident Simulation Workshops",
    ],
    honestLimitation:
      "Enterprise custom deployments require initial architectural review and mutual scope validation.",
    ctaText: "Speak with Security Architect",
    ctaHref: "/signup?tier=enterprise",
  },
];
