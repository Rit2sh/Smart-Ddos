# Defensive Policy Engine & Reverse-Proxy Enforcement

## 1. Policy Lifecycle & Governance

Every defensive policy follows an auditable lifecycle:
`DRAFT / PREVIEW → AUTHORIZATION → ENFORCEMENT → VERIFICATION → MONITORING → ROLLBACK`

### Pre-Enforcement Verification & Lockout Prevention
Before any policy can be applied to an active proxy or edge collector:
1. **Asset Ownership Gate**: Policies cannot be applied to an unverified asset.
2. **RBAC Authorization**: Operator must possess `canTriggerMitigation` permissions.
3. **Lockout Check**: The engine inspects target routes (`/login`, `/health`). If an aggressive policy would block legitimate administrative access or health checks, a warning is raised and explicit override is required.
4. **Impact Preview**: The adapter calculates estimated total, blocked, and clean traffic.

---

## 2. Enforcement Adapters

### A. Local Reverse-Proxy Adapter (`LocalProxyEnforcementAdapter`)
- Generates hardened NGINX rate-limiting configuration blocks (`limit_req_zone`, `limit_req_status 429`).
- Strict regex sanitization prevents configuration injection (`/^[a-zA-Z0-9_\-\.\/]*$/`).
- Upstream whitelist prevents open-proxy relays.
- Stores baseline backup and supports 1-click rollback (`POST /api/v1/policies/[id]/rollback`).
- Executes active verification tests and confirms HTTP 429 status codes.

### B. Synthetic Staging Simulation Adapter (`SimulationEnforcementAdapter`)
- Evaluates policies in staging or dry-run environments.
- Returns status `SIMULATED` and explicitly disclaims modifying live production packets.
