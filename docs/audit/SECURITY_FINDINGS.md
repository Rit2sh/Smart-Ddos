# Security Findings, Remediation & Threat Model Audit

## 1. Verified & Remediated Security Findings

### Finding 1: Cross-Tenant Defensive Policy Access (Severity: HIGH)
- **Vulnerability**: `PolicyService.apply` and `PolicyService.rollback` verified role permissions (`canTriggerMitigation`) but did not evaluate whether the target policy's `organizationId` matched the active operator's `session.organizationId`. A compromised analyst token could theoretically enforce policies against another tenant's assets.
- **Remediation**: Added strict tenant boundary verification in `src/lib/enforcement/policy-service.ts`:
  ```typescript
  if (policy.organizationId && policy.organizationId !== user.organizationId && !user.isPlatformAdmin) {
    throw new Error(`Permission denied: Cross-tenant access violation.`);
  }
  ```
- **Verification**: Regression test in `tests/critical-user-journeys.test.ts` (Journey F) verifies that cross-tenant operations are strictly rejected with an access violation error.

### Finding 2: Server-Side Request Forgery (SSRF) on Outbound Webhooks (Severity: HIGH)
- **Vulnerability**: Outbound notification dispatchers could be manipulated into querying internal infrastructure (`10.0.0.0/8`, `192.168.0.0/16`) or cloud instance metadata services (`169.254.169.254`, `metadata.google.internal`) to steal IAM roles or credentials.
- **Remediation**: Implemented the `WebhookDispatcher` (`src/lib/alerts/webhook-dispatcher.ts`) with pre-flight DNS resolution, RFC 1918 CIDR filtering, manual redirect inspection (re-evaluating every hop against the blacklist), and payload secret sanitization.
- **Verification**: 7 automated unit tests in `tests/webhook-ssrf.test.ts` verify blocking of loopback, private IPv4/IPv6, and metadata endpoints.

### Finding 3: Unauthenticated / Unverified Asset Mitigation Application (Severity: MEDIUM)
- **Vulnerability**: Attempting to apply mitigation policies to unverified domains could lead to misdirected traffic or routing hijacking.
- **Remediation**: `PolicyService.apply` queries asset status and throws `Security Policy Lock` if the domain ownership challenge is not `VERIFIED`.
- **Verification**: Regression test in `tests/telemetry-detection-mitigation.test.ts` verifies that unverified assets cannot receive defensive rate-limiting rules.

### Finding 4: Inadvertent Operator Lockout on Critical Health/Auth Paths (Severity: MEDIUM)
- **Vulnerability**: Applying aggressive rate-limiting on paths such as `/login` or `/api/health` could lock out administrators or fail load balancer health checks.
- **Remediation**: Added pre-enforcement lockout checks in `previewPolicy` that flag sensitive paths and require an explicit `forceOverride` flag to enforce.
- **Verification**: Verified in `tests/critical-user-journeys.test.ts` (Journey D).

---

## 2. Residual Operational Risks & Constraints

1. **Independent Third-Party Penetration Testing**: Smart DDoS Shield has passed comprehensive internal automated security reviews, unit tests, and architecture audits. An independent CREST/OSCP accredited external penetration test has not yet been performed. Controlled pilots should be conducted within authorized, pre-approved staging or sandbox environments.
2. **Upstream Network Saturation**: Smart DDoS Shield reverse proxies and rate-limiters protect application-layer resources (CPU, threads, database pools). If an attacker floods the physical upstream network pipe (e.g. 500 Gbps transit flood), edge reverse proxies cannot stop upstream transit line saturation. Upstream Anycast BGP blackholing (RFC 7999) or Tier-1 transit carrier scrubbing must be coordinated for volumetric defense.
3. **Optional Third-Party Provider Credentials**: Cloudflare WAF and AWS Shield integrations are implemented as contracts with mocked test coverage. Until production credentials (`CLOUDFLARE_API_TOKEN`, `AWS_ACCESS_KEY_ID`) are provisioned, their status is reported as `AWAITING_CREDENTIALS` and `UNKNOWN`.
