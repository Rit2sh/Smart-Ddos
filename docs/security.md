# Production Security Review & Threat Architecture

## 1. Overview & Threat Landscape
Smart DDoS Shield operates as a mission-critical defense perimeter. Consequently, the shield itself must possess an impregnable posture against malicious actors attempting to exploit the control plane, bypass telemetry ingestion, induce false mitigations, or poison defensive policies.

This document details verified security controls, vulnerability remediation, and residual operational risks for the controlled pilot.

---

## 2. Authentication & Session Management
- **Stateless EdDSA / HS256 JWTs**: Authenticated sessions are issued as cryptographic tokens signed with a minimum 256-bit secret (`JWT_SECRET`).
- **HTTP-Only, Secure, SameSite Cookies**: Tokens are never stored in browser `localStorage` or `sessionStorage` where XSS attacks could exfiltrate credentials.
- **Strict Expiration & Re-Auth**: Sessions expire after 8 hours; mitigation enforcement and policy changes require an active verified session.
- **Password Security**: Passwords are treated as untrusted and hashed with `bcryptjs` using 12 salt rounds with timing-attack safe comparisons.

---

## 3. Granular Role-Based Access Control (RBAC)
A 4-tier hierarchical access model is strictly enforced across all server-side API routes and server actions:
1. **OWNER**: Full administrative control, team invitations, role changes, billing, and organization export.
2. **SECURITY_ADMIN**: Protected asset registration, DNS challenge verification, policy creation, and mitigation enforcement.
3. **ANALYST**: Incident investigation, evidence inspection, policy preview, and emergency mitigation execution. Cannot add assets or modify tenant membership.
4. **VIEWER**: Read-only access to threat intelligence, historical dashboards, and post-incident drafts. All mitigation write APIs return `403 Forbidden`.

---

## 4. Cross-Tenant Isolation & Insecure Object References (IDOR)
- **Multi-Tenant Scoping**: All Prisma queries, in-memory lookups, and detection caches partition records strictly by `organizationId`.
- **Ownership Verification**: Before any asset verification, policy preview, or mitigation application is processed, the system verifies that `asset.organizationId === session.organizationId`. Attempting to target an asset belonging to another tenant returns `404 Not Found` or `403 Forbidden`.

---

## 5. SSRF Defense on Outbound Notifications & Webhooks
Outbound webhook notifications and integration dispatchers represent a high-risk attack surface for Server-Side Request Forgery (SSRF) and cloud metadata exfiltration.

Smart DDoS Shield implements multi-layer defense in `src/lib/alerts/webhook-dispatcher.ts`:
1. **Protocol Whitelist**: Only `http:` and `https:` schemes are permitted. Schemes like `file:`, `gopher:`, `ftp:`, and `dict:` are rejected at parser level.
2. **Hostname Blacklist**: Hostnames such as `localhost`, `metadata.google.internal`, and `instance-data` are rejected prior to lookup.
3. **Pre-Flight DNS Resolution & CIDR Filtering**:
   - Resolves all A and AAAA records for the target host.
   - Evaluates resolved IPs against private/reserved CIDRs:
     - `0.0.0.0/8` (Current network)
     - `10.0.0.0/8` (RFC 1918 Private)
     - `100.64.0.0/10` (Carrier-grade NAT)
     - `127.0.0.0/8` (Loopback)
     - `169.254.0.0/16` (Link-local & Cloud Metadata `169.254.169.254`)
     - `172.16.0.0/12` (RFC 1918 Private)
     - `192.168.0.0/16` (RFC 1918 Private)
     - IPv6 `::1`, `fc00::/7` (ULA), and `fe80::/10` (Link-Local)
4. **Redirect Hop Verification**: The dispatcher sets `redirect: 'manual'` and re-verifies the destination IP of *every* redirected hop (up to 3 hops max) to defeat DNS rebinding and open redirect bypasses.
5. **HMAC-SHA256 Payload Signatures**: Dispatches include `X-Shield-Signature: t=timestamp,v1=sha256` computed with tenant signing secrets.

---

## 6. AI Incident Analyst Security Boundaries
- **Untrusted Input Treatment**: All telemetry packets, incident descriptions, HTTP paths, and User-Agents are treated as potentially malicious or prompt-injection attempts.
- **Secret Sanitization**: Telemetry payloads are stripped of authorization tokens, cookies, and passwords before being evaluated.
- **Measured Facts vs Hypotheses**: The AI analyst explicitly labels measured facts (exact telemetry numbers) separately from speculative hypotheses (e.g., botnet attribution).
- **No Autonomous Command Execution**: Generated AI suggestions are strictly advisory. The system *never* executes commands directly from AI output. High-impact mitigations require deterministic preview validation and operator approval.
- **Deterministic Fallback**: When external AI credentials are not provided or API calls fail, the system falls back to a deterministic, rule-based SecOps engine.

---

## 7. CDN and WAF Integration Boundaries
- **Explicit Capability Boundaries**: Adapters for Cloudflare and AWS Shield enforce strict boundaries between supported features and unconfigured capabilities.
- **Credential Protection**: API tokens and IAM secrets are read strictly from protected server environment variables, never sent to the browser, and never exposed in client bundles.
- **Unconfirmed Status Handling**: If a provider API token is missing or an action cannot be verified via upstream API, the system reports `UNKNOWN` or `AWAITING_CREDENTIALS` rather than claiming success.

---

## 8. Audit Logging & Non-Repudiation
- **Tamper-Evident Security Log**: All mitigation enforcements, rollbacks, asset verifications, team role modifications, and data exports generate structured audit events stored with timestamp, actor email, source IP, action type, and outcome.
- **Secret Masking**: Audit logs automatically redact patterns matching `token=`, `secret=`, and `password=`.

---

## 9. Residual Risks & Disclaimers
1. **Third-Party CDN Integrations**: Cloudflare WAF and AWS Shield integrations are implemented as contracts with configuration validation, mock test coverage, and documentation. They await production credentials and are clearly tagged `AWAITING_CREDENTIALS` in the UI.
2. **Penetration Testing**: An independent external penetration test has not yet been conducted. Controlled pilot testing must be conducted within authorized, non-public staging environments.
