export type UserRole = "OWNER" | "SECURITY_ADMIN" | "ANALYST" | "VIEWER";

export type AssetType = "DOMAIN" | "SUBDOMAIN" | "IP_PREFIX" | "API_GATEWAY" | "LOAD_BALANCER";

export type VerificationMethod = "DNS_TXT" | "HTTP_CHALLENGE";

export type VerificationStatus = "PENDING" | "VERIFIED" | "FAILED" | "EXPIRED";

export type AssetStatus = "UNVERIFIED" | "ACTIVE" | "DEGRADED" | "UNDER_ATTACK" | "SUSPENDED";

export type IncidentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus =
  | "OPEN"
  | "ACTIVE"
  | "INVESTIGATING"
  | "MITIGATING"
  | "MONITORING"
  | "RESOLVED"
  | "FALSE_POSITIVE"
  | "REOPENED";

export type MitigationActionType =
  | "BLOCK_IP"
  | "RATE_LIMIT"
  | "GEO_RESTRICTION"
  | "CHALLENGE_CAPTCHA"
  | "WAF_RULE"
  | "BGP_BLACKHOLE";

export type MitigationStatus =
  | "SIMULATED"
  | "PENDING"
  | "APPLIED"
  | "VERIFIED"
  | "FAILED"
  | "UNKNOWN"
  | "REVOKED";

export type CollectorStatus = "HEALTHY" | "DEGRADED" | "OFFLINE" | "PROVISIONING";

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: UserRole;
  isPlatformAdmin?: boolean;
}

export interface TelemetryEventItem {
  timestamp: string;
  assetId: string;
  method: string;
  route: string;
  status: number;
  latencyMs: number;
  count: number;
  clientIdentifier?: string; // SHA-256 hashed privacy-preserving client key
}

export interface TelemetryBatchPayload {
  batchId: string;
  collectorId: string;
  timestamp: string;
  events: TelemetryEventItem[];
}

export interface TelemetryPoint {
  timestamp: string;
  totalRps: number;
  cleanRps: number;
  blockedRps: number;
  synRps: number;
  udpRps: number;
  httpRps: number;
}

export interface SecurityMetricSummary {
  currentRps: number;
  peakRps24h: number;
  blockedRequestsToday: number;
  activeIncidentsCount: number;
  mitigationSuccessRate: number;
  telemetryFreshnessSeconds: number;
  protectedAssetsCount: number;
  collectorsOnline: number;
  totalCollectors: number;
  isStale?: boolean;
  dataSource?: "LIVE_TELEMETRY" | "SIMULATION";
}

export interface DetectionRecord {
  id: string;
  assetId: string;
  assetDomain: string;
  timestamp: string;
  ruleId: string;
  ruleCategory: string;
  observedValue: number;
  baselineValue: number;
  thresholdValue: number;
  severity: IncidentSeverity;
  evidence: string;
  suggestedResponse: MitigationActionType;
  cooldownUntil?: string;
  isConfirmedIncident: boolean;
}

export interface DefensivePolicy {
  id: string;
  organizationId: string;
  assetId: string;
  assetDomain: string;
  name: string;
  description: string;
  targetRoute: string;
  methodRestriction?: string;
  rateLimitPerSecond: number;
  burstLimit: number;
  timeWindowSeconds: number;
  mode: "DRY_RUN" | "ENFORCED";
  adapterType: "LOCAL_PROXY" | "CLOUDFLARE_WAF" | "AWS_SHIELD" | "SIMULATION";
  status: MitigationStatus;
  appliedAt?: string;
  verifiedAt?: string;
  rollbackConfig?: string;
  createdAt: string;
}

export interface ProxyVerificationResult {
  adapter: string;
  targetUrl: string;
  policyId: string;
  status: MitigationStatus;
  testedRate: number;
  droppedCount: number;
  passedCount: number;
  effectiveStatusCode: number;
  details: string;
  verifiedAt: string;
}

export interface ThreatVector {
  vector: string;
  percentage: number;
  color: string;
  count: number;
}

export interface AttackingSource {
  ip: string;
  country: string;
  asn: string;
  rps: number;
  status: "BLOCKED" | "CHALLENGED" | "FLAGGED";
}

export interface VerificationChallengeDetails {
  token: string;
  method: VerificationMethod;
  expectedRecord: string;
  expectedValue: string;
  expiresAt: string;
  status: VerificationStatus;
}
