# Architecture Specification: Smart DDoS Shield

## 1. System Overview

Smart DDoS Shield is an enterprise cybersecurity SaaS platform engineered for defensive threat mitigation, multi-terabit volumetric traffic dissipation, and real-time protocol anomaly mitigation.

```
                    Internet Ingress (Volumetric Attack + Clean Traffic)
                                             │
                                             ▼
                 ┌────────────────────────────────────────────────────────┐
                 │       Distributed Edge Collector Anycast Mesh          │
                 │   - Linux eBPF / XDP High-Rate Packet Filters          │
                 │   - Stateless TCP SYN-Cookie Handshake Absorber        │
                 │   - BGP Community RFC 7999 Blackhole Injector          │
                 └───────────────────────────┬────────────────────────────┘
                                             │
                    ┌────────────────────────┴────────────────────────┐
                    │                                                 │
          Clean Validated Proxy                             Protobuf / JSON
                 Traffic                                     Telemetry Feed
                    │                                                 │
                    ▼                                                 ▼
        ┌───────────────────────┐                        ┌────────────────────────┐
        │  Protected Customer   │                        │   Smart DDoS Shield    │
        │    Origin Servers     │                        │    Central SaaS Hub    │
        │ (198.51.100.x, CNAME) │                        │ (Next.js 14, Postgres) │
        └───────────────────────┘                        └────────────────────────┘
```

---

## 2. Component Architecture

### A. Edge Collector Ingestion Mesh
- **Role**: Sits in path between public traffic and customer origin targets.
- **Layers**:
  - **L3/L4 Transport**: Drops UDP reflection (NTP, DNS, memcached) using eBPF/XDP kernel ring buffers.
  - **TCP State Machine**: Generates cryptographically signed stateless SYN cookies during SYN bursts to prevent memory exhaustion of connection tables.
  - **L7 Reverse Proxy**: Evaluates client heuristics, enforcing rate-limits and cryptographic proof-of-work JS challenges on suspicious subnets.

### B. SaaS Management Platform (Next.js 14 App Router)
- **Role**: Unified control plane for SecOps teams and enterprise tenant administrators.
- **Sub-systems**:
  - **Asset Verification Engine**: Validates domain ownership via DNS TXT or HTTP challenges prior to enabling mitigation routing.
  - **Anomaly & Alert Engine**: Evaluates sliding time-window telemetry against detection rules.
  - **Multi-Tenant RBAC**: Scopes all database queries to the authenticated tenant organization.

### C. Persistent Storage Tier
- **PostgreSQL 16**: Normalized entity storage for assets, detection rules, incidents, policies, and audit logs.
- **Redis 7 (Optional)**: Real-time telemetry sliding-window counters and pub/sub alerts.

---

## 3. High Availability & Failure Modes

1. **Edge Node Degradation**: If an edge collector experiences hardware impairment or drops below health check thresholds, Anycast BGP routes gracefully converge to adjacent regional collectors.
2. **Origin Protection Lock**: Edge enforcement policies strictly disallow traffic forwarding to unverified assets, eliminating unauthorized target relay attacks.
