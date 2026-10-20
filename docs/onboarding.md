# Smart DDoS Shield — Onboarding Specification

## 1. Objectives & UX Philosophy
The First-Time Onboarding Wizard (`/onboarding`) guides new users through setting up protection without overwhelming them with unnecessary jargon.
- **Progressive Disclosure**: Each screen asks for exactly one logical decision.
- **Truth in Security**: Verification states are strictly checked against the backend; no premature green checkmarks.
- **Non-Destructive**: Users are informed at every step that configurations do not automatically switch DNS or take down origin servers.

---

## 2. The 9 Screens in Detail

### Screen 1: Welcome & Complexity Transparency
- Headline: *"Let's set up protection for your website. You can complete this step by step."*
- Establishes honest setup expectations: 5–10 minutes depending on DNS TTL.
- Explains the non-destructive nature of the process.

### Screen 2: Asset Type Selection
- Users categorize their target:
  - **Public Website or Blog**: Standard static or marketing sites.
  - **REST / GraphQL API**: High-frequency JSON endpoints.
  - **Interactive Web App**: Authenticated SaaS platforms.
  - **Multiple Domains**: Agency customer portfolios.

### Screen 3: Domain Hostname Entry
- Input validation: Requires valid FQDN (e.g. `example.com` or `api.example.com`).
- Disallows protocol prefixes (`https://`) and path slashes (`/`).
- Educational tooltip explains why verification is mandatory (prevents unauthorized registration of third-party domains).

### Screen 4: Cryptographic Ownership Verification
- Method 1: **DNS TXT Record** (`_smartddos-challenge.<domain>`).
- Method 2: **HTTP Challenge File** (`/.well-known/smart-ddos-challenge.txt`).
- Features a real verification button calling `POST /api/assets/[id]/verify`.
- Only advances to Step 5 once the backend confirms the challenge token match.

### Screen 5: Integration Architecture Selection
- Presents 3 supported integration models:
  1. **In-Line Reverse Proxy (NGINX)**: Microsecond local HTTP 429 rate-limiting.
  2. **Upstream CDN/WAF (Cloudflare/AWS)**: Absorbs volumetric attacks across Anycast edges.
  3. **Monitor-Only Collector**: Non-blocking asynchronous telemetry.
- Highlights what each method can and cannot do.

### Screen 6: Telemetry Configuration Snippet
- Generates copyable, safe NGINX configurations and Docker commands.
- Secrets are never hardcoded in public client bundles; instructions show how to configure environment variables.

### Screen 7: Live Telemetry Handshake
- Polls the backend for incoming collector heartbeats and telemetry batches.
- Displays node status (HEALTHY / OFFLINE), latency, and sample rate.
- Provides contextual troubleshooting if the node is listening for packets.

### Screen 8: Defensive Policy Approval
- Explains monitoring mode vs active enforcement.
- Slider allows operators to customize client rate limits (e.g., 50 to 1,000 requests/minute).
- Highlights 1-click rollback safety.

### Screen 9: Verification Summary & Console Launch
- Summarizes verified asset details and policy thresholds.
- Direct CTA button navigates to the Security Console (`/app`).
- Allows users to review previous steps if needed.
