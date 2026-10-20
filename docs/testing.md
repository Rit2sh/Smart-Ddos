# Test Strategy, Verification Matrix & CI Pipeline

## 1. Automated Vitest Suites (39 Tests Across 8 Suites)

Run the full automated test suite:
```bash
npx vitest run
```

### Complete Coverage Matrix

| Test Suite | Tests | Domain / Focus | Key Verification Points |
| :--- | :---: | :--- | :--- |
| `tests/telemetry-detection-mitigation.test.ts` | 11 | Master Pipeline Flow | Collector enrollment, revocation, batch validation, duplicate idempotency, rolling mean baseline calculation, anomaly detection, incident promotion, policy impact preview, proxy enforcement, active verification, and rollback. |
| `tests/cdn-adapters.test.ts` | 7 | Provider Adapters | Cloudflare WAF and AWS Shield adapter contracts, capability boundaries, missing credentials reporting `AWAITING_CREDENTIALS` / status `UNKNOWN`, preview calculation, and clean rollback. |
| `tests/webhook-ssrf.test.ts` | 7 | SSRF Security | Private IPv4 filtering (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`), AWS/GCP metadata (`169.254.169.254`), IPv6 private/loopback, allowed public IPs, protocol whitelist, and payload sanitization. |
| `tests/ai-analyst.test.ts` | 4 | AI SecOps Analyst | Deterministic rule-based fallback when API keys are absent, strict separation of measured facts from hypotheses, bounded mitigation suggestions, and incident post-mortem draft generation. |
| `tests/observability-privacy.test.ts` | 3 | Observability & Privacy | Decoupling of control plane readiness from protected application attack state, client IP pseudonymization (`185.220.101.xxx`), and audit logging. |
| `tests/auth.test.ts` | 2 | Authentication | Secure password hashing (`bcryptjs`), EdDSA / HS256 JWT session generation and cryptographic verification (`jose`). |
| `tests/rbac.test.ts` | 3 | Access Control | Hierarchical 4-tier RBAC (`OWNER`, `SECURITY_ADMIN`, `ANALYST`, `VIEWER`), enforcement barriers, and admin routing. |
| `tests/data-service.test.ts` | 2 | Asset Verification | Domain ownership challenge tokens (`DNS_TXT`, `HTTP_CHALLENGE`), protection locks, and asset state management. |

---

## 2. Type Checking & Production Build Validation

Run static type analysis:
```bash
npx tsc --noEmit
```

Build the production bundle:
```bash
npm run build
```
Result: 41 routes statically/dynamically generated with zero TypeScript compilation errors.

---

## 3. Continuous Integration (CI) Workflow
The repository includes a GitHub Actions pipeline in `.github/workflows/ci.yml`:
1. Checkout code & Setup Node.js 20.x
2. `npm ci`
3. `npx prisma generate`
4. `npx tsc --noEmit`
5. `npx vitest run`
6. `npm run build`

---

## 4. Test Safety & Authorization Boundaries
- **No Public DoS Testing**: Synthetic bursts and rate tests are strictly executed against local in-memory fixtures or authorized staging proxies.
- **Never Test Against Public Targets**: Testing volumetric floods against unverified or third-party domains is strictly prohibited.
