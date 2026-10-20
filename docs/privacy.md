# Privacy, Data Retention & Minimization Policy

## 1. Principles & Overview
Smart DDoS Shield operates under the principle of **Defensive Data Minimization**. Defending against volumetric and application-layer distributed denial of service attacks requires inspecting network packet telemetry; however, collecting and retaining customer and end-user data must be strictly bounded to operational necessity.

---

## 2. Privacy-Preserving Client Identifiers
- **No Indefinite Raw IP Storage**: End-user client IP addresses are not stored indefinitely in plain-text telemetry databases.
- **Hashed Client Identifiers**: Telemetry ingestion agents hash source client IP and User-Agent tuples using a salted SHA-256 algorithm:
  $$\text{ClientHash} = \text{HMAC-SHA256}(\text{ClientIP} \mathbin{\Vert} \text{UserAgent}, \text{NodeSalt})$$
- **Temporary Volumetric Sliding Window**: Raw IP packets captured during anomalous burst events are retained only in temporary eBPF ring buffers for forensic evidence and rate-limiting enforcement.

---

## 3. Data Retention Lifecycle

| Data Category | Retention Period | Storage Tier | Action on Expiration |
| :--- | :--- | :--- | :--- |
| **Raw Ingested Telemetry Events** | 30 Days | Hot Time-Series Storage | Automated Rolling Partition Drop |
| **Aggregated Security Metrics (RPS, clean/drop)** | 90 Days | TimescaleDB / Hypertable | Downsampled to 1-Hour Rollups |
| **Incident Forensic Evidences** | 365 Days | Encrypted Relational Archive | Pseudonymized (Host Bytes Masked) |
| **Audit Logs** | 730 Days | Append-Only Audit Store | Immutable Archive |
| **Ephemeral Verification Tokens** | 72 Hours | Redis Cache / DB | Automatic Invalidation |

---

## 4. IP Pseudonymization in Forensics and Exports
When security incident post-mortems or customer telemetry exports are generated, all external IP addresses undergo automatic subnet truncation:
- IPv4 addresses: Host octet masked (`185.220.101.42` $\rightarrow$ `185.220.101.xxx`)
- IPv6 addresses: Interface identifier zeroed (`2001:db8:85a3::8a2e:370:7334` $\rightarrow$ `2001:db8:85a3::/64`)

---

## 5. Collector Credential Revocation
- Edge daemon collectors enroll via revocable API tokens.
- An operator can instantly revoke a compromised or decommissioned collector node from the platform UI or via `DELETE /api/v1/collectors/[id]`.
- Once revoked, the collector's ingress batches are immediately rejected with `401 Unauthorized`, and its active cryptographic session is invalidated.

---

## 6. Customer Data Portability & Export
In compliance with GDPR Article 20 and CCPA data portability requirements:
- Organization Owners and Security Admins can request a complete, machine-readable JSON bundle via:
  `GET /api/v1/org/export`
- The export bundle contains:
  - Registered assets (with verification secrets scrubbed)
  - Defensive policy rulesets
  - Pseudonymized incident records
  - Collector node roster
  - Complete tenant audit log history

---

## 7. Organization and Account Deletion
- Upon written tenant request or account termination, all active collector enrollment tokens, protected domain records, and cached metrics are purged within 14 calendar days.
- Backup snapshots rotate out permanently within 30 days.
