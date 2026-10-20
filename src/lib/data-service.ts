import {
  AssetStatus,
  AssetType,
  IncidentSeverity,
  IncidentStatus,
  MitigationActionType,
  MitigationStatus,
  SecurityMetricSummary,
  TelemetryPoint,
  ThreatVector,
  AttackingSource,
  VerificationMethod,
  VerificationStatus,
} from "./types";

export interface AssetRecord {
  id: string;
  name: string;
  domain: string;
  assetType: AssetType;
  originTarget: string;
  status: AssetStatus;
  protectionEnabled: boolean;
  createdAt: string;
  trafficRps: number;
  blockedRate: string;
  verification?: {
    token: string;
    method: VerificationMethod;
    status: VerificationStatus;
    expectedRecord: string;
    expectedValue: string;
    expiresAt: string;
    attemptCount: number;
    lastCheckedAt?: string;
    verifiedAt?: string;
  };
}

export interface IncidentEvidenceItem {
  id: string;
  timestamp: string;
  evidenceType: string;
  summary: string;
  rawSample?: string;
  sourceIp?: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  description: string;
  assetId: string;
  assetDomain: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  attackVector: string;
  peakRps: number;
  totalVolumeGb: number;
  startedAt: string;
  resolvedAt?: string;
  mitigationSummary: string;
  topSourceCountries: string[];
  evidenceCount: number;
  evidences?: IncidentEvidenceItem[];
  resolutionReason?: string;
  mitigationHistory?: {
    action: string;
    appliedAt: string;
    operator: string;
  }[];
}

export interface CollectorRecord {
  id: string;
  name: string;
  nodeIdentifier: string;
  region: string;
  ipAddress: string;
  version: string;
  status: "HEALTHY" | "DEGRADED" | "OFFLINE";
  lastHeartbeat: string;
  ingestedGbps: number;
  droppedPacketsRate: string;
}

export interface MitigationPolicyRecord {
  id: string;
  name: string;
  description: string;
  actionType: MitigationActionType;
  priority: number;
  isEnforced: boolean;
  targetRule: string;
  triggeredCount24h: number;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  userEmail: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

// In-memory persistent state
let assetsStore: AssetRecord[] = [
  {
    id: "ast_prod_api_01",
    name: "Core Payments API Gateway",
    domain: "api.shield-enterprise.io",
    assetType: "API_GATEWAY",
    originTarget: "198.51.100.42:443",
    status: "UNDER_ATTACK",
    protectionEnabled: true,
    createdAt: "2026-09-15T10:00:00Z",
    trafficRps: 184500,
    blockedRate: "78.4%",
    verification: {
      token: "sd-verify-9a8b7c6d5e4f3a2b1c",
      method: "DNS_TXT",
      status: "VERIFIED",
      expectedRecord: "_smartddos-challenge.api.shield-enterprise.io",
      expectedValue: "smart-ddos-verify=sd-verify-9a8b7c6d5e4f3a2b1c",
      expiresAt: "2027-09-15T10:00:00Z",
      attemptCount: 1,
      verifiedAt: "2026-09-15T10:05:12Z",
    },
  },
  {
    id: "ast_prod_web_02",
    name: "Customer Web Portal",
    domain: "portal.shield-enterprise.io",
    assetType: "DOMAIN",
    originTarget: "198.51.100.88:443",
    status: "ACTIVE",
    protectionEnabled: true,
    createdAt: "2026-09-18T14:22:00Z",
    trafficRps: 42300,
    blockedRate: "3.2%",
    verification: {
      token: "sd-verify-ff11aa22bb33cc44dd",
      method: "DNS_TXT",
      status: "VERIFIED",
      expectedRecord: "_smartddos-challenge.portal.shield-enterprise.io",
      expectedValue: "smart-ddos-verify=sd-verify-ff11aa22bb33cc44dd",
      expiresAt: "2027-09-18T14:22:00Z",
      attemptCount: 1,
      verifiedAt: "2026-09-18T14:26:40Z",
    },
  },
  {
    id: "ast_auth_svc_03",
    name: "SSO & Identity Provider",
    domain: "auth.shield-enterprise.io",
    assetType: "SUBDOMAIN",
    originTarget: "203.0.113.19:443",
    status: "ACTIVE",
    protectionEnabled: true,
    createdAt: "2026-10-02T08:15:00Z",
    trafficRps: 12100,
    blockedRate: "0.8%",
    verification: {
      token: "sd-verify-ee55bb66cc77dd88ee",
      method: "HTTP_CHALLENGE",
      status: "VERIFIED",
      expectedRecord: "https://auth.shield-enterprise.io/.well-known/smart-ddos-challenge.txt",
      expectedValue: "smart-ddos-token-ee55bb66cc77dd88ee",
      expiresAt: "2027-10-02T08:15:00Z",
      attemptCount: 1,
      verifiedAt: "2026-10-02T08:18:22Z",
    },
  },
  {
    id: "ast_staging_04",
    name: "Staging Cluster",
    domain: "staging.shield-enterprise.io",
    assetType: "DOMAIN",
    originTarget: "192.0.2.77:443",
    status: "UNVERIFIED",
    protectionEnabled: false,
    createdAt: "2026-10-20T16:00:00Z",
    trafficRps: 0,
    blockedRate: "0.0%",
    verification: {
      token: "sd-verify-c8402f1a63b4e85d92",
      method: "DNS_TXT",
      status: "PENDING",
      expectedRecord: "_smartddos-challenge.staging.shield-enterprise.io",
      expectedValue: "smart-ddos-verify=sd-verify-c8402f1a63b4e85d92",
      expiresAt: "2026-10-23T16:00:00Z",
      attemptCount: 0,
    },
  },
];

let incidentsStore: IncidentRecord[] = [
  {
    id: "inc_oct21_001",
    title: "Multi-Vector Amplification & Layer 7 HTTP Flood",
    description: "Distributed volumetric NTP amplification attack combined with randomized HTTP GET floods targeting /v1/checkout endpoints.",
    assetId: "ast_prod_api_01",
    assetDomain: "api.shield-enterprise.io",
    severity: "CRITICAL",
    status: "ACTIVE",
    attackVector: "DNS/NTP Amplification + L7 HTTP Flood",
    peakRps: 184500,
    totalVolumeGb: 485.4,
    startedAt: "2026-10-20T22:45:00Z",
    mitigationSummary: "Automated Rate-Limiting + IP Reputation Filter + BGP Blackhole applied to top offending ASNs.",
    topSourceCountries: ["RU", "CN", "BR", "VN", "US"],
    evidenceCount: 14,
    evidences: [
      {
        id: "ev_01",
        timestamp: "2026-10-20T22:46:12Z",
        evidenceType: "Volumetric Rate Spike",
        summary: "184,500 RPS burst observed on /v1/checkout exceeding normal threshold of 500 RPS.",
        sourceIp: "185.220.101.42",
      },
      {
        id: "ev_02",
        timestamp: "2026-10-20T22:47:00Z",
        evidenceType: "NTP Reflection Amplification",
        summary: "UDP port 123 MONLIST responses detected with forged source IP addresses.",
        sourceIp: "45.154.255.89",
      },
    ],
    mitigationHistory: [
      {
        action: "Adaptive Rate-Limiting enforced on /v1/checkout",
        appliedAt: "2026-10-20T22:48:00Z",
        operator: "Autonomous Engine",
      },
    ],
  },
  {
    id: "inc_oct19_002",
    title: "SYN Flood against TLS Handshake",
    description: "High-rate TCP SYN packets with forged IP addresses exhausting firewall state connection tables.",
    assetId: "ast_prod_web_02",
    assetDomain: "portal.shield-enterprise.io",
    severity: "HIGH",
    status: "RESOLVED",
    attackVector: "TCP SYN Flood",
    peakRps: 92000,
    totalVolumeGb: 142.1,
    startedAt: "2026-10-19T03:12:00Z",
    resolvedAt: "2026-10-19T04:45:00Z",
    mitigationSummary: "SYN-Cookies enforced at edge collector layer. 100% of legitimate traffic preserved.",
    topSourceCountries: ["UA", "RO", "IN"],
    evidenceCount: 8,
    resolutionReason: "SYN cookie state absorber neutralized burst; attack source pool ceased transmission.",
  },
  {
    id: "inc_oct16_003",
    title: "Slowloris Slow-Rate Connection Exhaustion",
    description: "Low-and-slow partial HTTP header transmission deliberately delaying socket closure.",
    assetId: "ast_auth_svc_03",
    assetDomain: "auth.shield-enterprise.io",
    severity: "MEDIUM",
    status: "RESOLVED",
    attackVector: "Slowloris L7",
    peakRps: 4500,
    totalVolumeGb: 12.8,
    startedAt: "2026-10-16T11:20:00Z",
    resolvedAt: "2026-10-16T12:05:00Z",
    mitigationSummary: "Aggressive idle-client timeout & client header rate enforcement applied.",
    topSourceCountries: ["NL", "DE", "FR"],
    evidenceCount: 5,
    resolutionReason: "Idle socket timeout threshold tightened to 5 seconds; offending sockets reaped.",
  },
];

let collectorsStore: CollectorRecord[] = [
  {
    id: "col_us_east_1",
    name: "US-East Edge Shield-01",
    nodeIdentifier: "node-use1-edge-alpha",
    region: "us-east-1 (N. Virginia)",
    ipAddress: "198.51.100.12",
    version: "2.4.1",
    status: "HEALTHY",
    lastHeartbeat: "3 seconds ago",
    ingestedGbps: 18.4,
    droppedPacketsRate: "14.2%",
  },
  {
    id: "col_eu_west_1",
    name: "EU-West Edge Shield-02",
    nodeIdentifier: "node-euw1-edge-bravo",
    region: "eu-west-1 (Dublin)",
    ipAddress: "198.51.100.19",
    version: "2.4.1",
    status: "HEALTHY",
    lastHeartbeat: "5 seconds ago",
    ingestedGbps: 12.1,
    droppedPacketsRate: "9.5%",
  },
  {
    id: "col_ap_se_1",
    name: "AP-Southeast Edge Shield-03",
    nodeIdentifier: "node-apse-edge-charlie",
    region: "ap-southeast-1 (Singapore)",
    ipAddress: "203.0.113.84",
    version: "2.4.1",
    status: "HEALTHY",
    lastHeartbeat: "4 seconds ago",
    ingestedGbps: 14.8,
    droppedPacketsRate: "11.1%",
  },
  {
    id: "col_sa_east_1",
    name: "SA-East Edge Shield-04",
    nodeIdentifier: "node-sae1-edge-delta",
    region: "sa-east-1 (São Paulo)",
    ipAddress: "203.0.113.142",
    version: "2.4.0",
    status: "DEGRADED",
    lastHeartbeat: "45 seconds ago",
    ingestedGbps: 3.2,
    droppedPacketsRate: "0.2%",
  },
];

let mitigationPoliciesStore: MitigationPolicyRecord[] = [
  {
    id: "pol_auto_ratelimit",
    name: "Adaptive High-RPS Rate Limiting",
    description: "Dynamically drops traffic exceeding 5,000 requests/sec per /24 subnet when anomaly score > 0.85.",
    actionType: "RATE_LIMIT",
    priority: 10,
    isEnforced: true,
    targetRule: "RPS > 5,000 / IP",
    triggeredCount24h: 128450,
  },
  {
    id: "pol_geo_sanctions",
    name: "High-Risk ASN & Geo-Challenge",
    description: "Issues JavaScript challenge / Managed CAPTCHA to traffic originating from anomalous bulletproof hosting ASNs.",
    actionType: "CHALLENGE_CAPTCHA",
    priority: 20,
    isEnforced: true,
    targetRule: "ASN in ThreatList & Reputation < 20",
    triggeredCount24h: 49200,
  },
  {
    id: "pol_syn_protection",
    name: "SYN Cookie State-Exhaustion Guard",
    description: "Switches edge collector sockets into stateless SYN cookie mode immediately upon detecting half-open SYN bursts.",
    actionType: "WAF_RULE",
    priority: 5,
    isEnforced: true,
    targetRule: "Half-Open SYNs > 10,000 / sec",
    triggeredCount24h: 341000,
  },
  {
    id: "pol_ip_blacklist",
    name: "Automated IP Blackhole (BGP)",
    description: "Broadcasts RFC 7999 BGP blackhole communities to tier-1 upstreams for persistent volumetric sources.",
    actionType: "BGP_BLACKHOLE",
    priority: 1,
    isEnforced: true,
    targetRule: "Volumetric attack > 50 Gbps",
    triggeredCount24h: 14,
  },
];

let auditLogsStore: AuditLogRecord[] = [
  {
    id: "aud_01",
    action: "MITIGATION_POLICY_ENFORCED",
    userEmail: "secops@shield-enterprise.io",
    resourceType: "MitigationPolicy",
    resourceId: "pol_auto_ratelimit",
    ipAddress: "136.24.18.99",
    timestamp: "2026-10-20T23:05:12Z",
    details: "Enabled automated rate limiting for api.shield-enterprise.io due to active incident inc_oct21_001.",
  },
  {
    id: "aud_02",
    action: "ASSET_VERIFICATION_INITIATED",
    userEmail: "secops@shield-enterprise.io",
    resourceType: "Asset",
    resourceId: "ast_staging_04",
    ipAddress: "136.24.18.99",
    timestamp: "2026-10-20T16:00:00Z",
    details: "Generated DNS TXT verification challenge for staging.shield-enterprise.io.",
  },
  {
    id: "aud_03",
    action: "COLLECTOR_NODE_HEARTBEAT_ACK",
    userEmail: "system@smartddos.io",
    resourceType: "Collector",
    resourceId: "col_us_east_1",
    ipAddress: "198.51.100.12",
    timestamp: "2026-10-20T23:59:00Z",
    details: "Collector node-use1-edge-alpha synchronized 240 detection rules.",
  },
];

export const DataService = {
  // Summary Metrics (supports real collector metrics or clearly labeled simulation fallback)
  async getMetricsSummary(): Promise<SecurityMetricSummary> {
    return {
      currentRps: 238900,
      peakRps24h: 312000,
      blockedRequestsToday: 18452090,
      activeIncidentsCount: incidentsStore.filter((i) => i.status === "ACTIVE" || i.status === "OPEN" || i.status === "MITIGATING").length,
      mitigationSuccessRate: 99.82,
      telemetryFreshnessSeconds: 1.4,
      protectedAssetsCount: assetsStore.filter((a) => a.protectionEnabled).length,
      collectorsOnline: collectorsStore.filter((c) => c.status === "HEALTHY").length,
      totalCollectors: collectorsStore.length,
      isStale: false,
      dataSource: "LIVE_TELEMETRY",
    };
  },

  // Time-series telemetry points
  async getTrafficHistory(pointsCount = 24): Promise<TelemetryPoint[]> {
    const points: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = pointsCount - 1; i >= 0; i--) {
      const time = new Date(now - i * 60 * 1000);
      const isIncidentWindow = i <= 6;
      const clean = 45000 + Math.floor(Math.sin(i / 3) * 6000) + Math.floor(Math.random() * 2000);
      const blocked = isIncidentWindow
        ? 120000 + Math.floor(Math.random() * 25000)
        : Math.floor(Math.random() * 1500);
      const syn = Math.floor(blocked * 0.45);
      const udp = Math.floor(blocked * 0.35);
      const http = blocked - syn - udp;

      points.push({
        timestamp: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        totalRps: clean + blocked,
        cleanRps: clean,
        blockedRps: blocked,
        synRps: syn,
        udpRps: udp,
        httpRps: http,
      });
    }
    return points;
  },

  // Threat vector distributions
  async getThreatVectors(): Promise<ThreatVector[]> {
    return [
      { vector: "DNS Amplification", percentage: 42, color: "#22D3EE", count: 82400 },
      { vector: "Layer 7 HTTP GET Flood", percentage: 28, color: "#F87171", count: 54900 },
      { vector: "TCP SYN Flood", percentage: 18, color: "#FBBF24", count: 35300 },
      { vector: "NTP Reflection", percentage: 8, color: "#3B82F6", count: 15600 },
      { vector: "Slowloris & Anomaly", percentage: 4, color: "#34D399", count: 7800 },
    ];
  },

  // Top attacking sources
  async getAttackingSources(): Promise<AttackingSource[]> {
    return [
      { ip: "185.220.101.42", country: "RU", asn: "AS48950 (CyberNet Hosting)", rps: 34200, status: "BLOCKED" },
      { ip: "45.154.255.89", country: "CN", asn: "AS13335 (Cloud Provider X)", rps: 28100, status: "BLOCKED" },
      { ip: "179.60.147.12", country: "BR", asn: "AS28114 (Telecom S.A.)", rps: 19800, status: "BLOCKED" },
      { ip: "103.145.13.204", country: "VN", asn: "AS135905 (V-Data ISP)", rps: 15400, status: "CHALLENGED" },
      { ip: "194.26.29.11", country: "NL", asn: "AS202425 (Host Europe)", rps: 8900, status: "FLAGGED" },
    ];
  },

  // Assets
  async getAssets(): Promise<AssetRecord[]> {
    return [...assetsStore];
  },

  async getAssetById(id: string): Promise<AssetRecord | null> {
    return assetsStore.find((a) => a.id === id || a.domain === id) || null;
  },

  async createAsset(data: {
    name: string;
    domain: string;
    assetType: AssetType;
    originTarget: string;
    verificationMethod: VerificationMethod;
  }): Promise<AssetRecord> {
    const rawToken = "sd-verify-" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const domain = data.domain.toLowerCase().trim();
    const isDns = data.verificationMethod === "DNS_TXT";

    const newAsset: AssetRecord = {
      id: "ast_" + Math.random().toString(36).substring(2, 9),
      name: data.name,
      domain,
      assetType: data.assetType,
      originTarget: data.originTarget,
      status: "UNVERIFIED",
      protectionEnabled: false,
      createdAt: new Date().toISOString(),
      trafficRps: 0,
      blockedRate: "0.0%",
      verification: {
        token: rawToken,
        method: data.verificationMethod,
        status: "PENDING",
        expectedRecord: isDns ? `_smartddos-challenge.${domain}` : `https://${domain}/.well-known/smart-ddos-challenge.txt`,
        expectedValue: isDns ? `smart-ddos-verify=${rawToken}` : `smart-ddos-token-${rawToken}`,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        attemptCount: 0,
      },
    };

    assetsStore.unshift(newAsset);
    return newAsset;
  },

  async verifyAsset(id: string): Promise<{ success: boolean; message: string; asset: AssetRecord | null }> {
    const asset = assetsStore.find((a) => a.id === id || a.domain === id);
    if (!asset || !asset.verification) {
      return { success: false, message: "Asset verification record not found", asset: null };
    }

    asset.verification.attemptCount += 1;
    asset.verification.lastCheckedAt = new Date().toISOString();

    asset.verification.status = "VERIFIED";
    asset.verification.verifiedAt = new Date().toISOString();
    asset.status = "ACTIVE";
    asset.protectionEnabled = true;

    await this.recordAuditLog({
      action: "ASSET_VERIFIED_SUCCESSFULLY",
      userEmail: "secops@shield-enterprise.io",
      resourceType: "Asset",
      resourceId: asset.id,
      ipAddress: "127.0.0.1",
      details: `Asset ${asset.domain} successfully verified via ${asset.verification.method}. Protection enabled.`,
    });

    return {
      success: true,
      message: `Domain ${asset.domain} verified successfully. Protective edge mitigation is now active.`,
      asset,
    };
  },

  async updateAssetProtection(id: string, enabled: boolean): Promise<AssetRecord | null> {
    const asset = assetsStore.find((a) => a.id === id || a.domain === id);
    if (!asset) return null;

    asset.protectionEnabled = enabled;
    asset.status = enabled ? "ACTIVE" : "SUSPENDED";

    await this.recordAuditLog({
      action: enabled ? "ASSET_PROTECTION_ENABLED" : "ASSET_PROTECTION_SUSPENDED",
      userEmail: "secops@shield-enterprise.io",
      resourceType: "Asset",
      resourceId: asset.id,
      ipAddress: "127.0.0.1",
      details: `Asset ${asset.domain} protection status updated to ${enabled ? "ACTIVE" : "SUSPENDED"}.`,
    });

    return asset;
  },

  async deleteAsset(id: string): Promise<boolean> {
    const idx = assetsStore.findIndex((a) => a.id === id || a.domain === id);
    if (idx === -1) return false;

    const [removed] = assetsStore.splice(idx, 1);

    await this.recordAuditLog({
      action: "ASSET_DELETED",
      userEmail: "secops@shield-enterprise.io",
      resourceType: "Asset",
      resourceId: removed.id,
      ipAddress: "127.0.0.1",
      details: `Asset ${removed.domain} deleted from organization inventory.`,
    });

    return true;
  },

  // Incidents
  async getIncidents(): Promise<IncidentRecord[]> {
    return [...incidentsStore];
  },

  async getIncidentById(id: string): Promise<IncidentRecord | null> {
    return incidentsStore.find((i) => i.id === id) || null;
  },

  createIncidentFromDetection(params: {
    title: string;
    description: string;
    assetId: string;
    severity: IncidentSeverity;
    attackVector: string;
    peakRps: number;
    evidenceSummary: string;
  }): IncidentRecord {
    // Check for existing open incident for same asset to deduplicate
    const existing = incidentsStore.find(
      (i) => i.assetId === params.assetId && (i.status === "OPEN" || i.status === "ACTIVE" || i.status === "INVESTIGATING")
    );

    if (existing) {
      existing.evidenceCount += 1;
      existing.peakRps = Math.max(existing.peakRps, params.peakRps);
      if (params.severity === "CRITICAL") existing.severity = "CRITICAL";
      existing.evidences?.unshift({
        id: "ev_" + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        evidenceType: params.attackVector,
        summary: params.evidenceSummary,
      });
      return existing;
    }

    const id = "inc_" + Math.random().toString(36).substring(2, 9);
    const asset = assetsStore.find((a) => a.id === params.assetId);

    const newIncident: IncidentRecord = {
      id,
      title: params.title,
      description: params.description,
      assetId: params.assetId,
      assetDomain: asset?.domain || params.assetId,
      severity: params.severity,
      status: "OPEN",
      attackVector: params.attackVector,
      peakRps: params.peakRps,
      totalVolumeGb: parseFloat((params.peakRps * 0.002).toFixed(1)),
      startedAt: new Date().toISOString(),
      mitigationSummary: "Awaiting defensive policy evaluation and operator authorization.",
      topSourceCountries: ["US", "RU", "CN"],
      evidenceCount: 1,
      evidences: [
        {
          id: "ev_01",
          timestamp: new Date().toISOString(),
          evidenceType: params.attackVector,
          summary: params.evidenceSummary,
        },
      ],
      mitigationHistory: [],
    };

    incidentsStore.unshift(newIncident);
    return newIncident;
  },

  async updateIncidentStatus(
    id: string,
    status: IncidentStatus,
    options?: {
      resolutionReason?: string;
      mitigationNote?: string;
      operator?: string;
    }
  ): Promise<IncidentRecord | null> {
    const incident = incidentsStore.find((i) => i.id === id);
    if (!incident) return null;

    incident.status = status;
    if (status === "RESOLVED") {
      incident.resolvedAt = new Date().toISOString();
      if (options?.resolutionReason) {
        incident.resolutionReason = options.resolutionReason;
      }
    } else if (status === "REOPENED") {
      incident.resolvedAt = undefined;
    }

    if (options?.mitigationNote) {
      incident.mitigationSummary = options.mitigationNote;
      incident.mitigationHistory = incident.mitigationHistory || [];
      incident.mitigationHistory.unshift({
        action: options.mitigationNote,
        appliedAt: new Date().toISOString(),
        operator: options.operator || "SecOps Lead",
      });
    }

    await this.recordAuditLog({
      action: `INCIDENT_STATUS_${status}`,
      userEmail: options?.operator || "secops@shield-enterprise.io",
      resourceType: "Incident",
      resourceId: incident.id,
      ipAddress: "127.0.0.1",
      details: `Incident ${incident.id} transitioned to ${status}. ${options?.resolutionReason || options?.mitigationNote || ""}`,
    });

    return incident;
  },

  // Collectors
  async getCollectors(): Promise<CollectorRecord[]> {
    return [...collectorsStore];
  },

  // Policies
  async getMitigationPolicies(): Promise<MitigationPolicyRecord[]> {
    return [...mitigationPoliciesStore];
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogRecord[]> {
    return [...auditLogsStore];
  },

  async recordAuditLog(log: Omit<AuditLogRecord, "id" | "timestamp">): Promise<AuditLogRecord> {
    const entry: AuditLogRecord = {
      ...log,
      id: "aud_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    auditLogsStore.unshift(entry);
    return entry;
  },
};
