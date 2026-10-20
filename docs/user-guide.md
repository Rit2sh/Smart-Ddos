# Smart DDoS Shield — User Guide

## Getting Started
Welcome to Smart DDoS Shield. This guide will walk you through registering your account, verifying an authorized domain, selecting an integration method, and managing defensive rate-limiting policies.

---

## 1. Authentication & Workspace Setup
1. **Accessing the Portal**: Navigate to `/login` or `/signup`.
2. **Sign-In Options**:
   - **Continue with Google**: Authenticates via Google OIDC.
   - **Continue with GitHub**: Authenticates via GitHub OAuth.
   - **Email & Password**: Enter credentials; passwords are encrypted with bcrypt.
3. **Workspace Provisioning**:
   - Choose **Individual** (for solo developers or personal websites).
   - Choose **Business** (for startups, companies, or agencies managing multiple team seats).
4. **Redirection**: First-time users are automatically guided into the **9-Screen Onboarding Wizard** (`/onboarding`).

---

## 2. The 9-Screen Onboarding Flow
- **Screen 1 (Welcome)**: Honest setup complexity estimate (~5–10 minutes depending on DNS propagation).
- **Screen 2 (Asset Type)**: Select Website, API, Web Application, or Multiple Domains.
- **Screen 3 (Domain Input)**: Enter the fully qualified domain name (e.g. `example.com` or `api.example.com`).
- **Screen 4 (Ownership Verification)**:
  - Add the DNS TXT record `_smartddos-challenge.<domain>` or upload `/.well-known/smart-ddos-challenge.txt`.
  - Click **Verify Ownership** to trigger the backend verification check.
- **Screen 5 (Connection Model)**: Choose In-Line Reverse Proxy, Cloud WAF Adapter, or Monitor-Only Collector.
- **Screen 6 (Telemetry Setup)**: Copy the validated NGINX configuration snippet or Docker command.
- **Screen 7 (Connection Handshake)**: Confirm real telemetry heartbeat arriving at the cluster.
- **Screen 8 (Defensive Policy)**: Set acceptable client rate limit thresholds (e.g. 200 requests/minute).
- **Screen 9 (Finish)**: View verified status and launch into the Security Console (`/app`).

---

## 3. Security Console Navigation
- **`/app` (Overview)**: Real-time RPS radar, active threats banner, mitigation effectiveness gauge, and collector health.
- **`/app/assets`**: List of all registered domains, verification status, origin targets, and 1-click protection toggles.
- **`/app/traffic`**: Time-series charts displaying clean RPS, blocked attack packets, and HTTP status codes.
- **`/app/threats`**: Detailed breakdown of detected threat vectors (HTTP GET Flood, SYN bursts, DNS reflection).
- **`/app/incidents`**: Historical incident logs with peak volume, duration, affected endpoints, and AI Analyst root-cause checklists.
- **`/app/policies`**: Rate-limiting rules, IP blocklists, simulation mode toggles, and 1-click safe rollback.
- **`/app/integrations`**: Manage Cloudflare WAF, AWS Shield, and local NGINX proxy connections.
- **`/app/alerts`**: Notification settings for Email, Slack, PagerDuty, and SSRF-safe outbound webhooks.
- **`/app/reports`**: Downloadable PDF and CSV incident post-mortem compliance reports.
- **`/guides`**: Searchable documentation hub with 14 tutorials and troubleshooting articles.
