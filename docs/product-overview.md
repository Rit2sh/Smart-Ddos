# Smart DDoS Shield — Product Overview

## 1. Product Vision & Mission
Smart DDoS Shield is an accessible, defensive cybersecurity SaaS platform designed for:
- Individual developers & freelancers managing web applications.
- Startups and small/medium businesses (SMBs) needing protection without enterprise complexity.
- E-commerce stores requiring zero checkout downtime.
- Public API providers defending backend databases from rate spikes and scraping.
- Digital agencies managing multiple client web properties under role-based access control.

### Core Product Promise
> **"Understand your risk. Connect your website. Monitor threats. Protect your business."**

---

## 2. Platform Architecture & Data Flow

```
+----------------------------------------------------------------------------------+
|                              PUBLIC VISITORS & BOTS                             |
+----------------------------------------------------------------------------------+
                                        |
                                        v
+----------------------------------------------------------------------------------+
|                    INSPECTION & ENFORCEMENT ADAPTER LAYER                         |
|                                                                                  |
|   [ In-Line NGINX / Envoy ]     [ Cloudflare / AWS WAF ]     [ Out-of-Path Daemon]|
|     - Sub-ms local 429 drops      - Global Anycast sync        - Passive log tails|
+----------------------------------------------------------------------------------+
                                        |
                          (Sanitized Telemetry Batches)
                                        v
+----------------------------------------------------------------------------------+
|                      SMART DDOS SHIELD CORE DEFENSE ENGINE                       |
|                                                                                  |
|   1. 10s Ingestion Buffer & Rollup Aggregation                                    |
|   2. Rolling 24h Baseline Computation (Mean & StdDev)                             |
|   3. Statistical Z-Score Anomaly Detector (Z > 3.0 Spike Threshold)              |
|   4. Automated Incident Generation & Evidence Capture                            |
|   5. SSRF-Safe Outbound Alert Dispatcher (Email, Slack, Webhook)                 |
|   6. Dual-Mode AI Incident Analyst (Rule-based synthesis & LLM)                   |
+----------------------------------------------------------------------------------+
                                        |
                                        v
+----------------------------------------------------------------------------------+
|                           PROTECTED ORIGIN APPLICATION                           |
|                    (Receives Clean, Filtered Traffic Only)                       |
+----------------------------------------------------------------------------------+
```

---

## 3. Public Educational Experience
All educational information is accessible to the public without requiring sign-in:
1. **Homepage (`/`)**: Hero with interactive 3D shield, visual problem statement, network diagrams, sample dashboard demonstration, transparent pricing, and FAQ preview.
2. **Learn DDoS (`/learn/ddos`)**: Beginner-friendly guide explaining DDoS concepts, viral surges vs bot floods, and L4 volumetric vs L7 application exhaustion.
3. **Why Protection (`/why-protection`)**: Practical business impact analysis for e-commerce, SaaS, startups, and APIs.
4. **Features (`/features`)**: In-depth breakdown of 12 implemented capabilities, who benefits, configuration requirements, and honest limitations.
5. **How It Works (`/how-it-works`)**: 10-step interactive walkthrough detailing account setup, domain verification, telemetry connection, policy enforcement, and reporting.
6. **Integration Guides (`/guides`)**: Searchable documentation hub with 14 tutorials covering NGINX, Cloudflare, AWS, DNS TXT challenge, rate limiting, and troubleshooting.
7. **Pricing (`/pricing`)**: 4 transparent tiers (Developer Free, Starter $49, Business $199, Enterprise Custom) with explicit capability boundaries.
8. **FAQ (`/faq`)**: 14 plain-English answers to critical questions.

---

## 4. Honest Architectural Boundaries
Smart DDoS Shield adheres strictly to truthful cybersecurity principles:
- **No False Guarantees**: No cybersecurity tool can guarantee 100% prevention of massive network-layer floods (e.g. 100 Gbps UDP reflection) on a single un-piped server.
- **Clear Enforcement Distinctions**: Out-of-path monitoring detects threats but cannot drop packets; active dropping requires the In-Line NGINX reverse proxy or Cloud WAF integration.
- **Cryptographic Domain Authorization**: Prevents unauthorized third parties from registering arbitrary domains.
- **No Fabricated Data**: Telemetry metrics represent actual collector streams; sample demonstrations are clearly labeled.
