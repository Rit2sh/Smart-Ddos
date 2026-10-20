import { describe, it, expect, beforeEach } from "vitest";
import { IngestionService } from "../src/lib/telemetry/ingestion-service";
import { DetectionEngine } from "../src/lib/detection/detection-engine";
import { PolicyService } from "../src/lib/enforcement/policy-service";
import { DataService } from "../src/lib/data-service";
import { UserSession } from "../src/lib/types";

describe("Master Flow 2: Ingestion, Detection, Incident Management & Policy Enforcement", () => {
  const testSession: UserSession = {
    userId: "usr_secops_test",
    email: "secops@shield-enterprise.io",
    name: "SecOps Lead",
    organizationId: "org_shield_cyber_01",
    organizationName: "Shield Cyber Corp",
    organizationSlug: "shield-cyber",
    role: "OWNER",
  };

  const analystSession: UserSession = {
    ...testSession,
    role: "ANALYST",
  };

  const viewerSession: UserSession = {
    ...testSession,
    role: "VIEWER",
  };

  it("1. Authenticated Collector Enrollment & Revocation", () => {
    const { collector, apiKey } = IngestionService.enrollCollector({
      name: "Frankfurt Edge Collector Node-09",
      organizationId: testSession.organizationId,
      region: "eu-central-1",
      ipAddress: "198.51.100.77",
    });

    expect(collector.id).toBeDefined();
    expect(apiKey).toBeDefined();
    expect(collector.status).toBe("HEALTHY");

    // Authenticate with valid key
    const authenticated = IngestionService.authenticateCollector(apiKey);
    expect(authenticated).not.toBeNull();
    expect(authenticated?.id).toBe(collector.id);

    // Revoke collector
    const revoked = IngestionService.revokeCollector(collector.id);
    expect(revoked).toBe(true);

    // Verify revoked key is rejected
    const afterRevocation = IngestionService.authenticateCollector(apiKey);
    expect(afterRevocation).toBeNull();
  });

  it("2. Telemetry Ingestion, Validation, and Duplicate Batch Handling", async () => {
    const collector = IngestionService.authenticateCollector("sds_col_key_use1_prod");
    expect(collector).not.toBeNull();

    const batchId = "batch_test_" + Math.random().toString(36).substring(2, 9);
    const validBatch = {
      batchId,
      collectorId: collector!.id,
      timestamp: new Date().toISOString(),
      events: [
        {
          timestamp: new Date().toISOString(),
          assetId: "ast_prod_api_01",
          method: "POST" as const,
          route: "/api/v1/checkout",
          status: 200,
          latencyMs: 42,
          count: 120,
          clientIdentifier: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
        },
      ],
    };

    // First ingestion succeeds
    const result1 = await IngestionService.ingestBatch(collector!, validBatch);
    expect(result1.success).toBe(true);
    expect(result1.processedEvents).toBe(1);
    expect(result1.duplicate).toBe(false);

    // Duplicate ingestion detected & handled idempotently
    const result2 = await IngestionService.ingestBatch(collector!, validBatch);
    expect(result2.success).toBe(true);
    expect(result2.processedEvents).toBe(0);
    expect(result2.duplicate).toBe(true);
  });

  it("3. Aggregate Calculations (Clean vs Blocked, Status distribution, Endpoints)", () => {
    const traffic = IngestionService.getAssetTraffic("ast_prod_api_01");
    expect(traffic).not.toBeNull();
    expect(traffic?.totalRequests).toBeGreaterThanOrEqual(120);
    expect(traffic?.endpointVolumes["/api/v1/checkout"]).toBeGreaterThanOrEqual(120);
    expect(traffic?.statusDistribution["2xx"]).toBeGreaterThanOrEqual(120);
  });

  it("4. Detection Engine: Threshold Anomaly and Incident Promotion", () => {
    // Submit safe synthetic burst exceeding threshold (500 req on /api/v1/checkout)
    const anomalyEvent = {
      timestamp: new Date().toISOString(),
      assetId: "ast_prod_api_01",
      method: "POST" as const,
      route: "/api/v1/checkout",
      status: 429,
      latencyMs: 320,
      count: 1200, // Massive spike
      clientIdentifier: "attacker_subnet_sha256_hash",
    };

    const anomalies = DetectionEngine.evaluateEvent(anomalyEvent);
    expect(anomalies.length).toBeGreaterThan(0);

    const rateAnomaly = anomalies.find((a) => a.ruleCategory === "RATE_SPIKE" || a.ruleCategory === "ENDPOINT_CONCENTRATION");
    expect(rateAnomaly).toBeDefined();
    expect(rateAnomaly?.severity).toBe("CRITICAL");
    expect(rateAnomaly?.isConfirmedIncident).toBe(true);
  });

  it("5. Incident Lifecycle: Investigation, State Transition, Notes, and Resolution", async () => {
    const incidents = await DataService.getIncidents();
    const active = incidents[0];
    expect(active).toBeDefined();

    // Transition: OPEN/ACTIVE -> INVESTIGATING
    const step1 = await DataService.updateIncidentStatus(active.id, "INVESTIGATING", {
      operator: testSession.email,
      mitigationNote: "Investigating offending subnets and anomalous rate bursts.",
    });
    expect(step1?.status).toBe("INVESTIGATING");

    // Transition: INVESTIGATING -> MITIGATING
    const step2 = await DataService.updateIncidentStatus(active.id, "MITIGATING", {
      operator: testSession.email,
      mitigationNote: "Applied local reverse-proxy rate limit of 500 req/s.",
    });
    expect(step2?.status).toBe("MITIGATING");

    // Transition: MITIGATING -> RESOLVED
    const step3 = await DataService.updateIncidentStatus(active.id, "RESOLVED", {
      operator: testSession.email,
      resolutionReason: "Defensive rate limits stabilized origin load; attack ceased.",
    });
    expect(step3?.status).toBe("RESOLVED");
    expect(step3?.resolvedAt).toBeDefined();
    expect(step3?.resolutionReason).toContain("stabilized origin load");
  });

  it("6. Policy Preview & Lockout Warning Validation", async () => {
    // Preview policy with safe route
    const safePreview = await PolicyService.preview(
      {
        id: "pol_test_preview",
        organizationId: testSession.organizationId,
        assetId: "ast_prod_api_01",
        assetDomain: "api.shield-enterprise.io",
        name: "Preview Test Policy",
        description: "Test",
        targetRoute: "/api/v1/checkout",
        rateLimitPerSecond: 200,
        burstLimit: 30,
        timeWindowSeconds: 60,
        mode: "ENFORCED",
        adapterType: "LOCAL_PROXY",
        status: "PENDING",
        createdAt: new Date().toISOString(),
      },
      testSession
    );

    expect(safePreview.safeToApply).toBe(true);
    expect(safePreview.potentialLockouts.length).toBe(0);

    // Preview policy with sensitive lockout route (/login)
    const dangerousPreview = await PolicyService.preview(
      {
        id: "pol_test_dangerous",
        organizationId: testSession.organizationId,
        assetId: "ast_prod_api_01",
        assetDomain: "api.shield-enterprise.io",
        name: "Dangerous Policy",
        description: "Lockout Test",
        targetRoute: "/login",
        rateLimitPerSecond: 5,
        burstLimit: 2,
        timeWindowSeconds: 60,
        mode: "ENFORCED",
        adapterType: "LOCAL_PROXY",
        status: "PENDING",
        createdAt: new Date().toISOString(),
      },
      testSession
    );

    expect(dangerousPreview.safeToApply).toBe(false);
    expect(dangerousPreview.riskOfFalsePositives).toBe("HIGH");
    expect(dangerousPreview.potentialLockouts.length).toBeGreaterThan(0);
  });

  let testPolicyId = "";

  it("7. Policy Enforcement & Configuration Validation via LocalProxyAdapter", async () => {
    const policy = PolicyService.createPolicy({
      organizationId: testSession.organizationId,
      assetId: "ast_prod_api_01",
      assetDomain: "api.shield-enterprise.io",
      name: "Production API Rate Guard",
      description: "Limits /api/v1/checkout to 500 req/s",
      targetRoute: "/api/v1/checkout",
      rateLimitPerSecond: 500,
      burstLimit: 50,
      timeWindowSeconds: 60,
      mode: "ENFORCED",
      adapterType: "LOCAL_PROXY",
    });
    testPolicyId = policy.id;

    const result = await PolicyService.apply(policy, testSession, true);
    expect(result.success).toBe(true);
    expect(result.status).toBe("APPLIED");
    expect(result.appliedConfigSnippet).toContain("limit_req_zone");
    expect(result.appliedConfigSnippet).toContain("limit_req_status 429");
  });

  it("8. Active Proxy Verification Test", async () => {
    expect(testPolicyId).not.toBe("");
    const verification = await PolicyService.verify(testPolicyId);
    expect(verification.status).toBe("VERIFIED");
    expect(verification.effectiveStatusCode).toBe(429);
    expect(verification.droppedCount).toBeGreaterThan(0);
    expect(verification.details).toContain("HTTP 429 Too Many Requests");
  });

  it("9. Policy Rollback to Baseline", async () => {
    expect(testPolicyId).not.toBe("");
    const rollback = await PolicyService.rollback(testPolicyId, testSession);
    expect(rollback.success).toBe(true);
    expect(rollback.status).toBe("REVOKED");

    const updated = PolicyService.getPolicyById(testPolicyId);
    expect(updated?.status).toBe("REVOKED");
  });

  it("10. Security Checks: Deny Policy Application on Unverified Asset", async () => {
    // Attempt to apply policy on unverified asset
    const unverifiedPolicy = PolicyService.createPolicy({
      organizationId: testSession.organizationId,
      assetId: "ast_staging_04", // Unverified asset
      assetDomain: "staging.shield-enterprise.io",
      name: "Rogue Policy",
      description: "Should fail",
      targetRoute: "/api",
      rateLimitPerSecond: 100,
      burstLimit: 10,
      timeWindowSeconds: 60,
      mode: "ENFORCED",
      adapterType: "LOCAL_PROXY",
    });

    await expect(
      PolicyService.apply(unverifiedPolicy, testSession)
    ).rejects.toThrow("cannot be enforced on an unverified asset");
  });

  it("11. RBAC Permissions: VIEWER cannot enforce or rollback policies", async () => {
    const policy = PolicyService.createPolicy({
      organizationId: viewerSession.organizationId,
      assetId: "ast_prod_api_01",
      assetDomain: "api.shield-enterprise.io",
      name: "Viewer Policy",
      description: "Should fail",
      targetRoute: "/api/v1/test",
      rateLimitPerSecond: 100,
      burstLimit: 10,
      timeWindowSeconds: 60,
      mode: "ENFORCED",
      adapterType: "LOCAL_PROXY",
    });

    await expect(
      PolicyService.apply(policy, viewerSession)
    ).rejects.toThrow("Permission denied");

    await expect(
      PolicyService.rollback(policy.id, viewerSession)
    ).rejects.toThrow("Permission denied");
  });
});
