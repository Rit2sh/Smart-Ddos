# Smart DDoS Shield

> **Accessible, Defensive DDoS Protection, Real-Time Monitoring & Educational SaaS Platform**

Smart DDoS Shield is an accessible, defensive cybersecurity platform engineered to help individual developers, startups, and growing businesses understand, connect, monitor, and protect authorized websites and APIs against distributed denial of service attacks.

---

## 🌟 Key Product Features

### 1. Educational Public Platform (No Login Required)
- **Interactive 3D Visualizations**: Lightweight CSS 3D & SVG Canvas visualizers (`Shield3D`, `NetworkFlowDiagram`, `DdosSimulatorVisual`, `IntegrationComparisonVisual`) demonstrating normal baseline, surge anomalies, and active rate limiting with full reduced-motion support.
- **Learn DDoS (`/learn/ddos`)**: Plain-language guide explaining how botnet floods exhaust server memory and thread pools, and the difference between L4 volumetric and L7 application floods.
- **Why Businesses Need Protection (`/why-protection`)**: Practical scenarios for e-commerce, SaaS, startups, APIs, and booking services.
- **Features Breakdown (`/features`)**: 12 implemented capabilities detailing what it does, why it matters, who benefits, setup requirements, and honest technical limitations.
- **10-Step Walkthrough (`/how-it-works`)**: Visual step-by-step progress guide from registration to policy tuning and post-mortems.
- **Searchable Documentation Hub (`/guides`)**: 14 beginner-friendly tutorials with copyable commands, verification checks, and rollback safety.
- **Transparent Pricing (`/pricing`)**: 4 configurable tiers (Developer Free, Starter $49, Business $199, Enterprise Custom) with zero surge penalties and explicit capability boundaries.
- **Frequently Asked Questions (`/faq`)**: 14 honest answers addressing technical and non-technical concerns.

### 2. Google & GitHub OAuth 2.0 / OIDC Authentication
- **Verified Identity**: Real OAuth integration for Google (`accounts.google.com`) and GitHub (`github.com`) alongside email/password authentication.
- **CSRF State Security**: 64-character cryptographically secure state tokens stored in `httpOnly`, `SameSite=Lax` cookies.
- **Secure Server-Side Sessions**: HS256-signed JWT session cookies (`smart_ddos_session`) with 24-hour expiration.

### 3. First-Time Guided Onboarding Wizard (`/onboarding`)
- **Screen 1**: Welcome & honest setup complexity transparency.
- **Screen 2**: Asset type selection (Website, API, Web app, Multi-domain).
- **Screen 3**: Target domain input with strict hostname validation.
- **Screen 4**: Cryptographic domain ownership verification (DNS TXT or HTTP challenge) backed by real API checks.
- **Screen 5**: Connection architecture selection (In-line NGINX proxy, Cloud WAF adapter, or monitor-only collector).
- **Screen 6**: Copyable telemetry configuration snippets without hardcoded secrets.
- **Screen 7**: Real telemetry handshake and collector heartbeat verification.
- **Screen 8**: Defensive rate-limiting policy approval slider with 1-click rollback confirmation.
- **Screen 9**: Setup completion summary with direct launch into the Security Console (`/app`).

### 4. Personal Security Console
- **Overview (`/app`)**: Live ingestion RPS, clean stream SLA, active threats, and distributed collector health.
- **Protected Assets (`/app/assets`)**: Multi-domain directory, ownership status, and instant protection toggles.
- **Traffic Stream (`/app/traffic`)**: High-resolution time-series charts showing clean vs blocked attack packets.
- **Incidents & Threat Intelligence (`/app/incidents`, `/app/threats`)**: Incident records with forensic evidence, top offending geos, and AI SecOps Analyst breakdowns.
- **Defensive Policies (`/app/policies`)**: Sliding-window rate limiting, IP CIDR blacklists, simulation mode, and 1-click rollback.
- **Cloud Integrations (`/app/integrations`)**: Pre-flight connection tests for Cloudflare WAF, AWS Shield, and local reverse proxies.

---

## 🛠 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.7+ (Strict Mode)
- **Styling**: Tailwind CSS with custom dark cyber design tokens (`#080D18`, `#101827`, `#22D3EE`, `#3B82F6`)
- **Data Persistence**: PostgreSQL & Prisma ORM 5.21.1 (20 normalized models)
- **Sessions & Cryptography**: `jose` (JWT) & `bcryptjs` (Password hashing)
- **Validation**: Zod
- **Testing**: Vitest (52 automated unit, security, OAuth, and critical journey tests)

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(Optionally provide `GOOGLE_CLIENT_ID` / `GITHUB_CLIENT_ID` for social login, or use built-in email/password credentials).*

### 3. Run Automated Tests
```bash
npx vitest run
```
*(All 52 tests across 10 test suites pass 100%).*

### 4. Compile Production Build
```bash
npx tsc --noEmit
npm run build
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
