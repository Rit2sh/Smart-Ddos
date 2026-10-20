# UI Reference Map & Route Specifications

This document catalogs all user-facing routes, components, and access permissions in Smart DDoS Shield.

---

## 1. Public Educational & Marketing Routes (No Login Required)

| Route | View Component | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Main homepage with 3D shield visualizer, network flow, problem overview, demo dashboard, pricing, and FAQ preview. | Public |
| `/learn/ddos` | `src/app/learn/ddos/page.tsx` | Educational guide explaining DDoS concepts, viral surges vs bot floods, and L4 vs L7 attacks. | Public |
| `/why-protection` | `src/app/why-protection/page.tsx` | Real-world business impact breakdown for e-commerce, SaaS, startups, APIs, and booking services. | Public |
| `/features` | `src/app/features/page.tsx` | Comprehensive breakdown of 12 platform capabilities with requirements and honest limitations. | Public |
| `/how-it-works` | `src/app/how-it-works/page.tsx` | 10-step interactive visual walkthrough from registration to domain verification and policy tuning. | Public |
| `/guides` | `src/app/guides/page.tsx` | Searchable documentation hub with 14 beginner-friendly tutorials, verification checks, and rollback safety. | Public |
| `/pricing` | `src/app/pricing/page.tsx` | 4 transparent tiers (Developer Free, Starter $49, Business $199, Enterprise Custom) with comparison matrix. | Public |
| `/faq` | `src/app/faq/page.tsx` | 14 plain-English answers to critical technical and non-technical customer questions. | Public |
| `/security` | `src/app/security/page.tsx` | Security architecture, compliance standards, and tenant isolation policies. | Public |
| `/docs` | `src/app/docs/page.tsx` | Developer & SecOps API documentation, daemon setup guide, and curl examples. | Public |
| `/login` | `src/app/login/page.tsx` | Sign-in portal supporting Google OAuth, GitHub OAuth, and email/password authentication. | Public |
| `/signup` | `src/app/signup/page.tsx` | Workspace creation supporting Individual and Business workspace types and OAuth sign-up. | Public |
| `/forgot-password` | `src/app/forgot-password/page.tsx` | Out-of-band password recovery token challenge dispatch. | Public |

---

## 2. Onboarding & Setup Experience

| Route | View Component | Description | Access |
| :--- | :--- | :--- | :--- |
| `/onboarding` | `src/app/onboarding/page.tsx` | 9-screen guided setup wizard for new users (Asset type, domain, DNS/HTTP verification, telemetry setup, policies). | Authenticated |

---

## 3. Customer SecOps Application Routes (`/app/...`)

| Route | View Component | Primary Controls & Data Presented | Minimum Role |
| :--- | :--- | :--- | :--- |
| `/app` | `src/app/app/page.tsx` | Ingestion RPS, mitigation success %, active threat banner, SVG traffic chart, top ASNs. | Viewer |
| `/app/assets` | `src/app/app/assets/page.tsx` | Grid of protected domains, verification status, origin targets, and traffic load. | Viewer |
| `/app/assets/new` | `src/app/app/assets/new/page.tsx` | Endpoint registration form with DNS TXT / HTTP challenge method selection. | SecAdmin |
| `/app/assets/[id]` | `src/app/app/assets/[id]/page.tsx` | Verification token copier, live "Test & Verify Record Now" trigger, origin configuration. | SecAdmin |
| `/app/traffic` | `src/app/app/traffic/page.tsx` | High-res time-series telemetry with L3/L4 TCP SYN, UDP reflection, and L7 HTTP breakdown. | Viewer |
| `/app/threats` | `src/app/app/threats/page.tsx` | Threat vectors breakdown (DNS, NTP, Mirai heuristics), active botnet signatures. | Viewer |
| `/app/incidents` | `src/app/app/incidents/page.tsx` | Complete history of active and mitigated attacks with duration, peak RPS, and volume. | Analyst |
| `/app/incidents/[id]` | `src/app/app/incidents/[id]/page.tsx` | Forensic PCAP snippet, offending origin geos, and interactive edge mitigation buttons. | Analyst |
| `/app/policies` | `src/app/app/policies/page.tsx` | Mitigation rules list (Adaptive rate limit, Geo-challenge, SYN cookies, BGP blackhole). | SecAdmin |
| `/app/integrations` | `src/app/app/integrations/page.tsx` | Connected cloud providers (Cloudflare, AWS Route 53) and notification channels (Slack, PD). | SecAdmin |
| `/app/alerts` | `src/app/app/alerts/page.tsx` | Real-time incident alert dispatches with acknowledge status toggle. | Analyst |
| `/app/reports` | `src/app/app/reports/page.tsx` | Executive post-mortem reports, SLA compliance proofs, and PDF export tools. | Viewer |
| `/app/audit-logs` | `src/app/app/audit-logs/page.tsx` | Tamper-evident ledger of administrative and mitigation events with IP addresses. | Owner |
| `/app/team` | `src/app/app/team/page.tsx` | Team member directory, operator invitation, and RBAC role assignments. | Owner |
| `/app/settings` | `src/app/app/settings/page.tsx` | Tenant profile, developer API key creation, and edge collector ingestion tokens. | Owner |

---

## 4. Platform Superadmin Routes (`/admin/...`)

| Route | View Component | Primary Controls & Data Presented | Access |
| :--- | :--- | :--- | :--- |
| `/admin` | `src/app/admin/page.tsx` | Global mesh health, active tenant summary, total network ingress, collector status. | Superadmin |
| `/admin/organizations` | `src/app/admin/organizations/page.tsx` | Tenant provisioning, plan tier overrides, asset allocation limits. | Superadmin |
| `/admin/collectors` | `src/app/admin/collectors/page.tsx` | Edge collector nodes directory, region status, IP addresses, daemon versions. | Superadmin |
| `/admin/jobs` | `src/app/admin/jobs/page.tsx` | Asynchronous worker pool status: DNS sweeps, rollup aggregators, threat feed sync. | Superadmin |
| `/admin/audit` | `src/app/admin/audit/page.tsx` | Cross-tenant system audit ledger tracking platform-level administrative operations. | Superadmin |

---

## 5. Authentication API Routes (`/api/auth/...`)

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login` | POST | Authenticates operator using email and password, issues JWT session cookie. |
| `/api/auth/signup` | POST | Provisions new organization tenant and operator account. |
| `/api/auth/logout` | POST | Revokes session token and clears cookie. |
| `/api/auth/oauth/[provider]` | GET | Initiates Google or GitHub OAuth flow with CSRF state generation. |
| `/api/auth/oauth/callback` | GET | Validates CSRF state, exchanges authorization code for user profile, issues session. |
