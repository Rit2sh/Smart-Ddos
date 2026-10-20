# Incident Management & Triage Workflow

## 1. Incident Lifecycle States

Smart DDoS Shield enforces an auditable state machine for security incidents:

```
[ OPEN ] ──> [ INVESTIGATING ] ──> [ MITIGATING ] ──> [ MONITORING ] ──> [ RESOLVED ]
   │                 │                    │                  │
   └───> [ FALSE_POSITIVE ]               └───> [ REOPENED ] <───┘
```

- **`OPEN`**: Incident created automatically by Detection Engine or reported by SecOps analyst.
- **`INVESTIGATING`**: Analyst assigned; examining forensic PCAP samples and offending origin subnets.
- **`MITIGATING`**: Defensive policy or BGP blackhole previewed and applied via enforcement adapter.
- **`MONITORING`**: Enforcement verified; origin latency and error rates monitored for stabilization.
- **`RESOLVED`**: Origin load normalized within safe operational SLA; resolution reason logged.
- **`FALSE_POSITIVE`**: Incident flagged as benign traffic burst (e.g. planned marketing campaign).
- **`REOPENED`**: Closed attack resurges or subsequent burst detected within 1 hour of resolution.

---

## 2. Forensic Evidence & Audit Trail

Every state transition and mitigation action logs:
- Operator email and origin IP address.
- Timestamp.
- Evidence references (eBPF packet snippets, observed vs baseline RPS).
- Adapter verification results.
- Resolution notes.
