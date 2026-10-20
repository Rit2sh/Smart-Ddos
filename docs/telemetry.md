# Telemetry Ingestion & Real-Time Aggregation

## 1. Collector Ingestion Protocol

Smart DDoS Shield ingests versioned telemetry batches from authenticated edge collector nodes.

### Authentication & Credential Management
- Collector daemons authenticate via HTTP Bearer token or `X-Collector-Key` header.
- Credentials are cryptographically generated and can be revoked dynamically by organization administrators (`POST /api/v1/collectors/[id]/revoke`).
- Revoked credentials immediately terminate ingestion access without impacting user sessions.

### Ingestion Schema (`POST /api/v1/telemetry/batches`)
```json
{
  "batchId": "batch_98f420e1a",
  "collectorId": "col_us_east_1",
  "timestamp": "2026-10-21T01:30:00.000Z",
  "events": [
    {
      "timestamp": "2026-10-21T01:30:00.000Z",
      "assetId": "ast_prod_api_01",
      "method": "POST",
      "route": "/api/v1/checkout",
      "status": 200,
      "latencyMs": 45,
      "count": 120,
      "clientIdentifier": "sha256_hashed_subnet_id"
    }
  ]
}
```

---

## 2. Validation & Duplicate Detection

1. **Payload Size & Skew Limits**:
   - Batches are capped at 1,000 events per request.
   - Timestamps must fall within a 10-minute clock skew window.
2. **Idempotency**:
   - `batchId` is cached in-memory with a sliding window. Duplicate batches are acknowledged without re-processing metrics or triggering duplicate alerts.
3. **Asset Authorization**:
   - All referenced `assetId` values must belong to the collector's organization and have verified ownership. Telemetry targeting unverified domains is rejected.
4. **Stale Telemetry Indicator**:
   - If collectors stop transmitting heartbeats for > 60 seconds, the dashboard transitions into a `STALE DATA` state.
