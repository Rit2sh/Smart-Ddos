# Edge, CDN & Cloud WAF Integration Reference

## 1. Adapter Architecture Overview
Smart DDoS Shield operates on a pluggable enforcement adapter model. Each adapter conforms to the `EnforcementAdapter` contract (`src/lib/enforcement/adapter-contract.ts`):
```typescript
export interface EnforcementAdapter {
  readonly name: string;
  readonly adapterType: "LOCAL_PROXY" | "CLOUDFLARE_WAF" | "AWS_SHIELD" | "SIMULATION";

  previewPolicy(policy: DefensivePolicy): Promise<PolicyImpactPreview>;
  applyPolicy(policy: DefensivePolicy): Promise<EnforcementResult>;
  verifyEnforcement(policy: DefensivePolicy): Promise<ProxyVerificationResult>;
  rollbackPolicy(policyId: string): Promise<RollbackResult>;
}
```

---

## 2. Supported Adapters & Capability Boundaries

### A. Local NGINX / Envoy Reverse Proxy (Configured & Live)
- **Status**: Live Operational
- **Capabilities**:
  - In-line rate limiting zones (`limit_req_zone`)
  - Configurable burst buffers and `nodelay` directives
  - Synthetic probe canary verification (verifies HTTP 429 status on burst)
  - Zero-downtime hot reload via `nginx -s reload`
  - Atomic config swap with automated rollback to known-good baseline

### B. Cloudflare WAF & Edge Rate Limiting (Awaiting Credentials)
- **Status**: Contract Verified / Awaiting API Token
- **Capability Boundaries**:
  - Cloudflare Rulesets API (`phases/http_ratelimit/entrypoint`)
  - Zone IP Firewall rules and BGP Blackhole Anycast propagation
- **Required Credentials**:
  - `CLOUDFLARE_API_TOKEN` with permissions: `Zone.Zone:Read`, `Zone.WAF:Edit`, `Zone.Rulesets:Edit`
  - `CLOUDFLARE_ZONE_ID`
- **Behavior Without Credentials**:
  - The adapter evaluates all policies safely, runs simulated previews, and explicitly reports `AWAITING_CREDENTIALS` / status `UNKNOWN` instead of claiming successful enforcement.
- **Setup Instructions**:
  1. In Cloudflare Dashboard, navigate to **My Profile > API Tokens > Create Custom Token**.
  2. Grant permissions: `Zone - Firewall Services - Edit` and `Zone - Zone - Read`.
  3. Export `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID` to your environment.
  4. Verify connection in the platform via `/app/integrations`.

### C. AWS WAF & Shield Advanced (Awaiting Credentials)
- **Status**: Contract Verified / Awaiting IAM Credentials
- **Capability Boundaries**:
  - AWS WAFv2 `RateBasedStatement` attached to regional ALB or CloudFront WebACL
  - 5-minute aggregation sliding window (evaluated against request limit threshold)
  - CloudWatch metric publishing
- **Required Credentials**:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION` (e.g. `us-east-1`)
  - `AWS_WAF_WEB_ACL_ID`
- **Least-Privilege IAM Policy**:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "wafv2:GetWebACL",
          "wafv2:UpdateWebACL",
          "wafv2:GetSampledRequests"
        ],
        "Resource": "arn:aws:wafv2:*:*:regional/webacl/*/*"
      }
    ]
  }
  ```

---

## 3. Outbound Notification Webhooks (SSRF-Protected)

### Security Requirements & Filter Rules
Outbound webhook alerts (Slack, PagerDuty, Discord, Custom SecOps endpoints) pass through the deterministic SSRF validation pipeline (`src/lib/alerts/webhook-dispatcher.ts`):
1. **Host Verification**: Rejects `localhost`, `127.0.0.1`, and cloud metadata endpoints (`169.254.169.254`, `metadata.google.internal`).
2. **DNS Pre-Flight**: Resolves all DNS records before dispatch and drops requests resolving to RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
3. **Redirect Hop Inspection**: Sets manual redirect mode (`redirect: "manual"`) and re-evaluates the destination IP of all HTTP 301/302 hops (maximum 3 hops).
4. **HMAC-SHA256 Signatures**: Every payload includes:
   `X-Shield-Signature: t=1761000000,v1=9a8b7c6d5e...`
   Recipients can verify authenticity using their tenant webhook secret.

---

## 4. Credential Rotation & Revocation
- **Collector Daemon Tokens**: Revoke instantly via `DELETE /api/v1/collectors/:id`. Ingress batches from revoked collectors are dropped immediately.
- **Provider API Keys**: Cloudflare tokens and AWS credentials rotate seamlessly without platform restart by updating environment secrets in your secret manager (AWS Secrets Manager, Doppler, or HashiCorp Vault) and calling `/api/ready`.
