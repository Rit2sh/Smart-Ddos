"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Search,
  BookOpen,
  Terminal,
  Globe,
  Server,
  Cloud,
  Activity,
  Sliders,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface GuideItem {
  id: string;
  category: "GETTING_STARTED" | "VERIFICATION" | "INTEGRATIONS" | "MONITORING" | "POLICIES" | "TROUBLESHOOTING";
  title: string;
  summary: string;
  prerequisites: string[];
  steps: string[];
  verification: string;
  commonErrors: string;
  rollback: string;
}

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeGuideId, setActiveGuideId] = useState<string>("getting-started");

  const guides: GuideItem[] = [
    {
      id: "getting-started",
      category: "GETTING_STARTED",
      title: "1. Quickstart: Getting Started with Smart DDoS Shield",
      summary: "Understand the core workflow, create your organization workspace, and invite your team.",
      prerequisites: [
        "A website or API endpoint you have authorization to monitor.",
        "Access to your domain's DNS manager or web server filesystem.",
      ],
      steps: [
        "Sign up or sign in using Google, GitHub, or email credentials.",
        "Select your workspace type: Individual Developer or Business Organization.",
        "Enter your workspace name and proceed to the Guided Setup Wizard.",
        "Keep your Workspace Slug and API Key prefix handy for collector deployment.",
      ],
      verification: "Your workspace console displays ACTIVE status with 0 verified assets initially.",
      commonErrors: "Entering an invalid email or failing OAuth callback due to clock skew.",
      rollback: "You can delete or leave the workspace at any time in Console > Settings.",
    },
    {
      id: "registering-domain",
      category: "VERIFICATION",
      title: "2. Registering an Asset Domain or API Hostname",
      summary: "Add your fully qualified domain name (FQDN) to your workspace for defense monitoring.",
      prerequisites: [
        "An active domain name (e.g., example.com, app.example.com, or api.example.com).",
        "Authority to manage traffic and DNS for this hostname.",
      ],
      steps: [
        "In the Console or Onboarding Wizard, navigate to Assets > Add New Asset.",
        "Enter the exact hostname (do not include http:// or trailing slashes).",
        "Select the asset type: Apex Domain, Subdomain, or API Gateway.",
        "Click 'Create Asset' to generate your unique verification token.",
      ],
      verification: "Asset appears in the assets list with status 'UNVERIFIED' and an assigned challenge token.",
      commonErrors: "Typing a URL scheme (e.g. https://) or an IP address instead of a valid hostname.",
      rollback: "Click 'Delete Asset' to immediately remove the unverified asset record.",
    },
    {
      id: "dns-verification",
      category: "VERIFICATION",
      title: "3. Verifying Ownership via DNS TXT Record",
      summary: "Prove domain control by publishing a cryptographic verification token in your DNS zone.",
      prerequisites: [
        "Access to your domain registrar or DNS provider (Cloudflare, Route53, Namecheap, GoDaddy).",
        "Asset verification token from Step 2.",
      ],
      steps: [
        "Log in to your DNS provider's control panel.",
        "Add a new TXT record with Name: `@` (or your subdomain prefix) or `_smart-ddos-challenge`.",
        "Set the Record Value to the exact token string: `smart-ddos-verify=token_abc123...`",
        "Set TTL to 60 seconds (or automatic) and save the record.",
        "Return to Smart DDoS Shield and click 'Verify DNS Record'.",
      ],
      verification: "Status badge changes from PENDING to VERIFIED (green) within 60 seconds.",
      commonErrors: "DNS propagation delay. If verification fails immediately, wait 2 minutes for cache expiry.",
      rollback: "Delete the TXT record from your DNS zone after verification.",
    },
    {
      id: "http-verification",
      category: "VERIFICATION",
      title: "4. Verifying Ownership via HTTP Challenge Token",
      summary: "Prove server control without modifying DNS by serving a static verification file.",
      prerequisites: [
        "SSH, FTP, or web server access to the web root directory of your website.",
        "A web server answering HTTP requests on port 80 or 443.",
      ],
      steps: [
        "Create the directory path: `<web-root>/.well-known/`",
        "Create a file named: `smart-ddos-challenge.txt`",
        "Paste your asset token inside the file as raw plaintext.",
        "Ensure the file is publicly reachable at `http://yourdomain.com/.well-known/smart-ddos-challenge.txt`.",
        "In Smart DDoS Shield, select 'Verify HTTP Challenge'.",
      ],
      verification: "The platform's verification agent fetches the URL and confirms the token match.",
      commonErrors: "Web server returning 404 or redirecting challenge requests to an authentication login page.",
      rollback: "Delete the file `/.well-known/smart-ddos-challenge.txt` from your server.",
    },
    {
      id: "nginx-proxy",
      category: "INTEGRATIONS",
      title: "5. Connecting an In-Line NGINX Reverse Proxy",
      summary: "Configure NGINX to inspect traffic, enforce rate limits, and stream telemetry to Shield.",
      prerequisites: [
        "An NGINX web server (version 1.18+) running on Linux or Docker.",
        "Root or sudo privileges on the server.",
      ],
      steps: [
        "Open `/etc/nginx/conf.d/smart-ddos.conf` in your editor.",
        "Add the rate-limiting zone: `limit_req_zone $binary_remote_addr zone=shield_limit:10m rate=100r/s;`",
        "In your `location /` block, include: `limit_req zone=shield_limit burst=200 nodelay;` and `limit_req_status 429;`.",
        "Test your NGINX syntax: `sudo nginx -t`.",
        "Reload NGINX without dropping connections: `sudo systemctl reload nginx`.",
      ],
      verification: "Sending requests beyond 100 RPS returns HTTP 429 Too Many Requests.",
      commonErrors: "Syntax error in nginx.conf or forgetting to include the zone name in the location block.",
      rollback: "Comment out the `limit_req` directive and run `sudo systemctl reload nginx`.",
    },
    {
      id: "telemetry-collector",
      category: "INTEGRATIONS",
      title: "6. Configuring an Out-of-Path Telemetry Collector",
      summary: "Run a lightweight daemon that ships request statistics asynchronously without in-line proxying.",
      prerequisites: [
        "A Linux VM, Docker container, or Kubernetes cluster.",
        "Workspace Collector Credential API Token from Console > Integrations.",
      ],
      steps: [
        "Download the collector binary or Docker image: `docker pull smartddos/collector:latest`.",
        "Create an environment file with `SHIELD_ASSET_ID=your_id` and `SHIELD_API_KEY=your_key`.",
        "Point the collector to your access log file or syslog socket.",
        "Start the container with `docker run -d --env-file .env smartddos/collector:latest`.",
      ],
      verification: "Console > Collectors shows node status HEALTHY with heartbeat timestamp under 15 seconds.",
      commonErrors: "Firewall blocking outbound HTTPS traffic on port 443 to the telemetry ingestion API.",
      rollback: "Stop the Docker container: `docker stop <container_id>`.",
    },
    {
      id: "cdn-cloudflare",
      category: "INTEGRATIONS",
      title: "7. Connecting Cloudflare WAF Adapter",
      summary: "Synchronize IP blocklists and rate-limiting rules directly to Cloudflare's Anycast edge.",
      prerequisites: [
        "A Cloudflare account with your domain active on Cloudflare DNS.",
        "Cloudflare API Token with `Zone.Firewall` and `Zone.WAF` edit permissions.",
      ],
      steps: [
        "In Cloudflare Dashboard, generate an API Token scoped to your domain.",
        "In Smart DDoS Shield, navigate to Console > Integrations > Cloudflare.",
        "Enter your Cloudflare Zone ID and paste the API Token securely.",
        "Click 'Test & Save Integration'.",
      ],
      verification: "Status displays 'CONNECTED' and displays your active Cloudflare zone name.",
      commonErrors: "Using an Account-level token instead of a Zone-scoped token with WAF edit permissions.",
      rollback: "Disable the Cloudflare toggle in Console > Integrations or revoke the token in Cloudflare.",
    },
    {
      id: "cdn-aws",
      category: "INTEGRATIONS",
      title: "8. Connecting AWS Shield & AWS WAF Adapter",
      summary: "Integrate with AWS WAF Regional / CloudFront WebACLs for automated rule enforcement.",
      prerequisites: [
        "An AWS Account with an existing WAF WebACL (v2).",
        "IAM Role or API Credentials with `wafv2:UpdateWebACL` permissions.",
      ],
      steps: [
        "In AWS IAM, create a restricted policy allowing updates only to your specific WebACL ARN.",
        "In Smart DDoS Shield, navigate to Console > Integrations > AWS WAF.",
        "Provide your WebACL ARN, Scope (REGIONAL or CLOUDFRONT), and Region.",
        "Save and run the pre-flight connection check.",
      ],
      verification: "Pre-flight test returns HTTP 200 and displays current WebACL rule count.",
      commonErrors: "Mismatched AWS Region or missing `wafv2:GetWebACL` IAM permissions.",
      rollback: "Switch integration status to 'DISABLED' in Console > Integrations.",
    },
    {
      id: "reading-dashboard",
      category: "MONITORING",
      title: "9. Reading the Traffic Dashboard & Threat Score",
      summary: "Understand real-time RPS graphs, baseline curves, error rates, and anomaly thresholds.",
      prerequisites: ["An active verified asset with telemetry arriving from a proxy or collector."],
      steps: [
        "Navigate to Console > Traffic in your workspace.",
        "Review the primary RPS chart: the blue line represents current traffic, gray is baseline.",
        "Check HTTP status codes: a sudden spike in 502/504 errors indicates origin overload.",
        "Inspect the Threat Score gauge (0 to 100). Scores above 60 indicate potential attack activity.",
      ],
      verification: "Graph updates continuously with 10s to 60s rollup points.",
      commonErrors: "Looking for traffic before the collector has sent its first batch of telemetry.",
      rollback: "Change the time range dropdown from 'Last 1 Hour' to 'Last 24 Hours' for historical context.",
    },
    {
      id: "understanding-incident",
      category: "MONITORING",
      title: "10. Understanding an Incident & Investigating Threat Evidence",
      summary: "Investigate automated attack records, affected URIs, and source geography.",
      prerequisites: ["An anomaly detection triggered on one of your assets."],
      steps: [
        "Navigate to Console > Incidents and click on the active incident record.",
        "Review the Incident Summary: peak RPS, total volume, and detected attack vector.",
        "Check Top Source Countries to determine if the attack is distributed or geo-concentrated.",
        "Click 'AI Analyst Breakdown' to view plain-language root cause explanations and suggested actions.",
      ],
      verification: "Incident details view renders complete evidence timeline and affected paths.",
      commonErrors: "Confusing a marketing spike for a DDoS. Verify whether error rates rose on the origin.",
      rollback: "If the surge was legitimate marketing traffic, click 'Mark False Positive'.",
    },
    {
      id: "creating-policy",
      category: "POLICIES",
      title: "11. Creating a Defensive Rate-Limiting Policy",
      summary: "Define protective rules to restrict abusive IPs, request velocity, or specific URI patterns.",
      prerequisites: ["Organization Role: OWNER or SECURITY_ADMIN."],
      steps: [
        "Navigate to Console > Policies > Add New Policy.",
        "Enter a descriptive name (e.g., 'Protect Checkout API from Floods').",
        "Select Action Type: RATE_LIMIT (e.g. 50 req/min) or BLOCK_IP.",
        "Specify Target Rule: endpoint pattern (e.g. `/api/v1/checkout*`).",
        "Click 'Preview Impact' to estimate how many recent requests would have been throttled.",
        "Click 'Enforce Policy' to push the rule to connected reverse proxies or WAF adapters.",
      ],
      verification: "Policy appears in the list with isEnforced = TRUE and triggers counter starts incrementing.",
      commonErrors: "Setting the rate limit too low (e.g. 5 req/min), throttling legitimate mobile users.",
      rollback: "Toggle 'Enforce' off or click 'Roll Back Policy' to immediately deactivate the rule.",
    },
    {
      id: "testing-policy",
      category: "POLICIES",
      title: "12. Testing a Policy Safely in Simulation Mode",
      summary: "Validate defensive rules in SIMULATED mode before touching live production customer traffic.",
      prerequisites: ["A new policy draft created in Console > Policies."],
      steps: [
        "When creating or editing a policy, check the 'Simulate Only (Dry Run)' toggle.",
        "The engine logs which requests WOULD have been blocked without actually dropping them.",
        "Inspect the Policy Audit Log to verify that legitimate customer sessions are not matching the rule.",
        "Once verified safe, toggle the policy to 'Active Enforcement'.",
      ],
      verification: "Simulation log shows matched requests with status 'SIMULATED'.",
      commonErrors: "Skipping dry run and enforcing strict limits on shared corporate NAT IP addresses.",
      rollback: "Delete the draft policy with zero impact on production.",
    },
    {
      id: "rolling-back-policy",
      category: "POLICIES",
      title: "13. Rolling Back a Policy Safely",
      summary: "Instantly revoke an applied mitigation rule if it impacts legitimate traffic.",
      prerequisites: ["An active or partially enforced policy."],
      steps: [
        "Navigate to Console > Policies.",
        "Find the active policy and click the 'Rollback' button (or toggle 'Enforce' to Off).",
        "Confirm the rollback prompt in the security modal.",
        "The platform dispatches revocation commands to connected NGINX proxies and cloud WAFs.",
      ],
      verification: "Audit log records `POLICY_REVOKED` and proxy returns to unthrottled baseline.",
      commonErrors: "Network timeout between console and edge proxy. Check collector heartbeat.",
      rollback: "Policies can be re-enabled later once thresholds are adjusted.",
    },
    {
      id: "troubleshooting-telemetry",
      category: "TROUBLESHOOTING",
      title: "14. Troubleshooting Missing Telemetry & Offline Collectors",
      summary: "Diagnose why your traffic dashboard shows flatlines or collectors report OFFLINE status.",
      prerequisites: ["An enrolled collector or reverse proxy integration."],
      steps: [
        "Check collector process status on your server: `docker ps` or `systemctl status smartddos-collector`.",
        "Verify outbound network connectivity: `curl -I https://smartddos.io/api/telemetry/ingest`.",
        "Verify API key validity: Ensure your token has not expired or been revoked in Console > Settings.",
        "Inspect local collector logs: `docker logs smartddos-collector --tail 50`.",
        "Confirm that your web server is currently receiving traffic and writing to the watched access log.",
      ],
      verification: "Collector status transitions from OFFLINE to HEALTHY upon next 15-second heartbeat.",
      commonErrors: "Access log permissions. Ensure the daemon user has read permission on `/var/log/nginx/access.log`.",
      rollback: "Restart the collector daemon: `sudo systemctl restart smartddos-collector`.",
    },
  ];

  const categories = [
    { id: "ALL", label: "All Guides" },
    { id: "GETTING_STARTED", label: "Getting Started" },
    { id: "VERIFICATION", label: "Domain Verification" },
    { id: "INTEGRATIONS", label: "Integrations & Proxies" },
    { id: "MONITORING", label: "Monitoring & Incidents" },
    { id: "POLICIES", label: "Defensive Policies" },
    { id: "TROUBLESHOOTING", label: "Troubleshooting" },
  ];

  const filteredGuides = guides.filter((g) => {
    const matchesCategory = selectedCategory === "ALL" || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeGuide = guides.find((g) => g.id === activeGuideId) || guides[0];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 space-y-12 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header & Search Bar */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold">
            DOCUMENTATION & TUTORIAL HUB
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            Step-by-Step Integration Guides
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Beginner-friendly, tested tutorials with prerequisites, copyable commands, verification checks, and rollback safety.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-4 h-4 absolute left-3.5 top-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search guides (e.g. NGINX, DNS verification, Rate limiting, Cloudflare)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-xs sm:text-sm placeholder:text-text-secondary/60 shadow-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === cat.id
                  ? "bg-brand-cyan text-background font-bold shadow-glow"
                  : "bg-panel border border-border-subtle text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 2-Column Documentation Reader Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Guides Navigation List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-text-secondary pb-2 border-b border-border-subtle">
              <span>Matching Guides ({filteredGuides.length})</span>
              <span>Click to view details</span>
            </div>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filteredGuides.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setActiveGuideId(g.id)}
                  className={`cyber-card p-4 space-y-1.5 cursor-pointer transition-all ${
                    activeGuideId === g.id
                      ? "border-brand-cyan bg-panel shadow-sm"
                      : "hover:border-border-subtle/80 opacity-90"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-brand-cyan font-semibold">{g.category}</span>
                    {activeGuideId === g.id && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-cyan text-background font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-text-primary leading-snug">{g.title}</h3>
                  <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                    {g.summary}
                  </p>
                </div>
              ))}

              {filteredGuides.length === 0 && (
                <div className="p-8 text-center text-xs text-text-secondary bg-panel rounded-xl border border-border-subtle">
                  No guides matched your search query. Try searching for &ldquo;DNS&rdquo;, &ldquo;NGINX&rdquo;, or &ldquo;Policy&rdquo;.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Full Guide Reading Card */}
          <div className="lg:col-span-7 cyber-card p-6 sm:p-8 space-y-6 border-brand-cyan/30 sticky top-20 shadow-glow">
            <div className="border-b border-border-subtle pb-4 space-y-2">
              <span className="text-[11px] font-mono text-brand-cyan font-bold uppercase tracking-wider">
                {activeGuide.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                {activeGuide.title}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">{activeGuide.summary}</p>
            </div>

            {/* Prerequisites */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-brand-blue flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Prerequisites</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                {activeGuide.prerequisites.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-cyan font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Step-by-Step Execution</span>
              </h4>
              <div className="space-y-2.5">
                {activeGuide.steps.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-panel border border-border-subtle flex items-start gap-3 text-xs leading-relaxed">
                    <span className="font-mono text-brand-cyan font-bold shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-text-primary">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Check */}
            <div className="p-4 rounded-xl bg-elevated/70 border border-status-success/40 space-y-1.5 text-xs leading-relaxed">
              <h4 className="font-bold text-status-success font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>How to Verify Success</span>
              </h4>
              <p className="text-text-secondary">{activeGuide.verification}</p>
            </div>

            {/* Common Errors & Rollback */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-subtle text-[11px] font-mono">
              <div className="p-3 rounded-lg bg-panel border border-status-warning/30 space-y-1 text-status-warning">
                <span className="font-bold uppercase tracking-wider">Common Error:</span>
                <p className="text-text-secondary leading-relaxed">{activeGuide.commonErrors}</p>
              </div>

              <div className="p-3 rounded-lg bg-panel border border-brand-cyan/30 space-y-1 text-brand-cyan">
                <span className="font-bold uppercase tracking-wider">Rollback Guidance:</span>
                <p className="text-text-secondary leading-relaxed">{activeGuide.rollback}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
