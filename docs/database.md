# Database Architecture & Entity Specifications: Smart DDoS Shield

Smart DDoS Shield uses PostgreSQL with Prisma ORM to provide ACID guarantees, relational integrity, and strict multi-tenant isolation.

---

## 1. Normalized Entity Data Dictionary

The database comprises 20 normalized Prisma models:

1. **`User`**: System and tenant security operators. Stores hashed passwords (`bcrypt`), status, and timestamps.
2. **`Organization`**: Isolated tenant partition with subscription tier and slug.
3. **`OrganizationMembership`**: Joins `User` and `Organization` with explicit `UserRole` (`OWNER`, `SECURITY_ADMIN`, `ANALYST`, `VIEWER`).
4. **`Asset`**: Protected apex domain, subdomain, IP prefix, or API gateway.
5. **`AssetVerification`**: Tracks DNS TXT or HTTP challenge tokens, expected values, attempts, and expirations.
6. **`Collector`**: Distributed edge telemetry node instance (eBPF agent).
7. **`CollectorCredential`**: Hashed secret keys used by edge collector nodes to push telemetry batches.
8. **`TelemetryBatch`**: Ingested raw batch containing packet counts, dropped packets, and ingress bytes.
9. **`TrafficAggregate`**: Rollup metrics (1-min / 5-min windows) for Clean vs Blocked RPS, SYN, UDP, and L7.
10. **`DetectionRule`**: Configurable threshold rules (Rate spikes, SYN bursts, UDP reflections).
11. **`DetectionEvent`**: Real-time events logged when telemetry violates a `DetectionRule`.
12. **`Incident`**: Triaged attack incidents with severity, duration, and peak attack volume.
13. **`IncidentEvidence`**: Forensic packet samples, PCAP metadata, and source IPs logged during attacks.
14. **`MitigationPolicy`**: Active defense configuration (Adaptive rate-limiting, BGP blackhole, JS challenge).
15. **`MitigationAction`**: Enforcement records showing exact mitigations triggered for assets or incidents.
16. **`Alert`**: Dispatched alerts with severity and acknowledgment status.
17. **`NotificationPreference`**: User alert channels (Slack, PagerDuty, Email, Webhook).
18. **`AuditLog`**: Tamper-evident ledger of administrative and security events.
19. **`ApiKey`**: Developer and programmatic access credentials with prefix identification.
20. **`IntegrationConfiguration`**: Configurations for third-party providers (Cloudflare, AWS Route 53, Datadog).
21. **`BackgroundJob`**: Asynchronous worker execution records for sweeps and aggregators.

---

## 2. Relationships & Cascades

- **Tenant Scoping**: All operational entities (`Asset`, `Incident`, `MitigationPolicy`, `AuditLog`, `Alert`) have a direct foreign key to `Organization(id)` with `onDelete: Cascade`.
- **Asset Integrity**: An `AssetVerification` record is strictly tied to its parent `Asset`. Deleting an asset removes associated challenges and telemetry aggregates.
- **Audit Persistence**: `AuditLog` references `User(id)` with `onDelete: SetNull` so that if an operator account is decommissioned, the historical audit ledger remains preserved for compliance investigations.

---

## 3. Database Indexes

- `@@unique([organizationId, domain])` on `Asset`: Guarantees no duplicate domain registrations within a tenant.
- `@@index([token])` on `AssetVerification`: Enables sub-millisecond lookup during verification sweep jobs.
- `@@index([assetId, timestamp])` on `TrafficAggregate`: Optimizes time-series range queries for dashboard chart rendering.
- `@@index([organizationId, createdAt])` on `AuditLog`: Enables performant audit trail filtering.
