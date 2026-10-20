# Modular Anomaly Detection Engine

## 1. Detection Principles

The Detection Engine evaluates telemetry events against rolling baselines, threshold rules, and statistical distributions. It strictly distinguishes suspicious activity (`ANOMALY_SUSPECTED`) from confirmed security incidents (`INCIDENT_CONFIRMED`).

---

## 2. Detection Rule Ruleset

| Rule Category | Trigger Condition | Severity | Suggested Mitigation |
| :--- | :--- | :--- | :--- |
| **`RATE_SPIKE`** | Observed request count exceeds threshold (e.g. 500 req/window) or > 3x moving baseline. | High / Critical | Rate-limiting (`RATE_LIMIT`) |
| **`ERROR_RATE_SPIKE`** | HTTP 4xx/5xx failure proportion exceeds 40%. | High | Managed challenge (`CHALLENGE_CAPTCHA`) |
| **`ENDPOINT_CONCENTRATION`** | Excessive traffic focused on sensitive routes (`/checkout`, `/login`). | Critical | Route-specific rate limit |
| **`CLIENT_FREQUENCY_ANOMALY`** | Single hashed client identifier transmits > 250 req/window. | High | Client IP block (`BLOCK_IP`) |
| **`LATENCY_ANOMALY`** | Response latency exceeds 2,500ms correlated with traffic surge. | Medium | Upstream throttling |

---

## 3. False-Positive Controls & Deduplication

- **Minimum Observation Threshold**: At least 30 requests must be recorded before an asset is evaluated for rate or error spikes.
- **Cooldown Window**: Once an anomaly triggers on an asset/rule pair, repeat alerts are silenced for a 2-to-5 minute cooldown window.
- **Incident Promotion**: Confirmed critical anomalies automatically provision or update an `Incident` record in `OPEN` or `INVESTIGATING` state with evidence attached.
