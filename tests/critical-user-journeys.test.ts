import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import { createSessionToken, verifySessionToken } from "../src/lib/auth";
import { hasPermission } from "../src/lib/rbac";
import { DataService } from "../src/lib/data-service";
import { IngestionService } from "../src/lib/telemetry/ingestion-service";
import { DetectionEngine } from "../src/lib/detection/detection-engine";
import { PolicyService } from "../src/lib/enforcement/policy-service";
import { AIIncidentAnalyst } from "../src/lib/ai/incident-analyst";
import { WebhookDispatcher } from "../src/lib/alerts/webhook-dispatcher";
import { UserSession, DefensivePolicy, TelemetryEventItem } from "../src/lib/types";

describe("Critical End-to-End User Journeys (Journeys A - F)", () => {
  const ownerSession: UserSession = {
    userId: "usr_journey_owner",
    email: "security-lead@shield-corp.io",
    name: "Alex Vance",
    organizationId: "org_shield_alpha",
    organizationName: "Shield Alpha Corp",
    organizationSlug: "shield-alpha",
    role: "OWNER",
  };

  const viewerSession: UserSession = {
    userId: "usr_journey_viewer",
    email: "auditor@shield-corp.io",
    name: "Jordan Lee",
    organizationId: "org_shield_alpha",
    organizationName: "Shield Alpha Corp",
    organizationSlug: "shield-alpha",
    role: "VIEWER",
  };

  const tenantBSession: UserSession = {
    userId: "usr_tenant_b",
    email: "operator@tenant-beta.com",
    name: "Pat Smith",
    organizationId: "org_tenant_beta",
    organizationName: "Tenant Beta Ltd",
    organizationSlug: "tenant-beta",
    role: "OWNER",
  };

  // --------------------------------------------------------------------------
  // Journey A: Register → Log In → Create Org → Add & Verify Asset
  // --------------------------------------------------------------------------
  describe("Journey A: Onboarding, Authentication & Domain Ownership Verification", () => {
    it("should successfully register password, create JWT session, register asset, and verify DNS challenge", async () => {
      // 1. Password hashing
      const password = "SuperSecretPassword123!";
      const hashedPassword = await bcrypt.hash(password, 10);
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      expect(isPasswordValid).toBe(true);

      // 2. JWT session issuance and verification
      const token = await createSessionToken(ownerSession);
      const decoded = await verifySessionToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.email).toBe(ownerSession.email);
      expect(decoded?.role).toBe("OWNER");

      // 3. Register domain asset with DNS TXT verification challenge
      const asset = await DataService.createAsset({
        name: "Customer Web Application",
        domain: "app.journey-test.com",
        assetType: "DOMAIN",
        originTarget: "198.51.100.25:443",
        verificationMethod: "DNS_TXT",
      });

      expect(asset.id).toBeDefined();
      expect(asset.domain).toBe("app.journey-test.com");
      expect(asset.status).toBe("UNVERIFIED");
      expect(asset.protectionEnabled).toBe(false);
      expect(asset.verification?.status).toBe("PENDING");
      expect(asset.verification?.expectedRecord).toContain("_smartddos-challenge");

      // 4. Prove domain ownership via verification check
      const verificationResult = await DataService.verifyAsset(asset.id);
      expect(verificationResult.success).toBe(true);
      expect(verificationResult.asset?.status).toBe("ACTIVE");
      expect(verificationResult.asset?.protectionEnabled).toBe(true);
      expect(verificationResult.asset?.verification?.status).toBe("VERIFIED");
    });
  });

  // --------------------------------------------------------------------------
  // Journey B: Connect Local Collector → Send Telemetry → Persist Metrics → Dashboard
  // --------------------------------------------------------------------------
  describe("Journey B: Collector Enrollment, Ingestion Pipeline & Metrics Persistence", () => {
    it("should enroll collector, validate batch, reject duplicate batches, and aggregate metrics", async () => {
      // 1. Enroll collector daemon
      const { collector, apiKey } = IngestionService.enrollCollector({
        name: "US-West Edge Collector 01",
        organizationId: ownerSession.organizationId,
        region: "us-west-2",
        ipAddress: "198.51.100.77",
      });
      expect(collector.id).toBeDefined();
      expect(apiKey).toBeDefined();

      // Authenticate collector
      const authenticated = IngestionService.authenticateCollector(apiKey);
      expect(authenticated).not.toBeNull();

      // 2. Submit valid telemetry batch
      const now = new Date().toISOString();
      const batchPayload = {
        batchId: "batch_journey_b_001",
        collectorId: collector.id,
        timestamp: now,
        events: [
          {
            timestamp: now,
            assetId: "ast_prod_api_01",
            method: "GET" as const,
            route: "/api/v1/checkout",
            status: 200,
            latencyMs: 35,
            count: 250,
            clientIdentifier: "c1c2c3c4c5c6c1c2c3c4c5c6c1c2c3c4",
          },
          {
            timestamp: now,
            assetId: "ast_prod_api_01",
            method: "POST" as const,
            route: "/api/v1/checkout",
            status: 200,
            latencyMs: 42,
            count: 150,
            clientIdentifier: "d1d2d3d4d5d6d1d2d3d4d5d6d1d2d3d4",
          },
        ],
      };

      const ingestResult = await IngestionService.ingestBatch(authenticated!, batchPayload);
      expect(ingestResult.success).toBe(true);
      expect(ingestResult.processedEvents).toBe(2);

      // 3. Duplicate batch rejection idempotency
      const duplicateResult = await IngestionService.ingestBatch(authenticated!, batchPayload);
      expect(duplicateResult.success).toBe(true);
      expect(duplicateResult.duplicate).toBe(true);
      expect(duplicateResult.processedEvents).toBe(0);

      // 4. Query aggregated metrics
      const aggregate = IngestionService.getAssetTraffic("ast_prod_api_01");
      expect(aggregate).not.toBeNull();
      expect(aggregate!.totalRequests).toBeGreaterThanOrEqual(400);
      expect(aggregate!.totalClean).toBeGreaterThanOrEqual(400);
      expect(aggregate!.avgLatencyMs).toBeGreaterThan(0);
    });
  });

  // --------------------------------------------------------------------------
  // Journey C: Submit Anomalous Fixture → Detect Traffic → Create Incident → Inspect Evidence
  // --------------------------------------------------------------------------
  describe("Journey C: Anomaly Detection, Rule Evaluation & Incident Promotion", () => {
    it("should detect sudden rate spikes and promote event to confirmed incident with forensic evidence", () => {
      const anomalyEvent: TelemetryEventItem = {
        timestamp: new Date().toISOString(),
        assetId: "ast_prod_api_01",
        method: "POST",
        route: "/api/v1/checkout",
        status: 200,
        latencyMs: 85,
        count: 1500, // Excessive burst
        clientIdentifier: "anon_client_test_burst",
      };

      const anomalies = DetectionEngine.evaluateEvent(anomalyEvent);
      expect(anomalies.length).toBeGreaterThan(0);

      const rateAnomaly = anomalies.find(
        (a) => a.ruleCategory === "RATE_SPIKE" || a.ruleCategory === "ENDPOINT_CONCENTRATION"
      );
      expect(rateAnomaly).toBeDefined();
      expect(rateAnomaly?.severity).toBe("CRITICAL");
      expect(rateAnomaly?.isConfirmedIncident).toBe(true);

      // Promote to incident
      const incident = DataService.createIncidentFromDetection({
        title: "Volumetric Rate Spike on api.shield-enterprise.io",
        description: "Automated trigger: 15,000 RPS ingress surge",
        assetId: "ast_prod_api_01",
        severity: "CRITICAL",
        attackVector: "Layer 7 HTTP Flood",
        peakRps: 15000,
        evidenceSummary: "15,000 RPS observed exceeding 100 RPS baseline by 150x",
      });

      expect(incident.id).toBeDefined();
      expect(["OPEN", "ACTIVE"]).toContain(incident.status);
      expect(incident.evidences?.length).toBeGreaterThanOrEqual(1);
      expect(incident.evidences?.[0].summary).toContain("15,000 RPS");
    });
  });

  // --------------------------------------------------------------------------
  // Journey D: Preview Defensive Policy → Approve Policy → Apply → Verify → Roll Back
  // --------------------------------------------------------------------------
  describe("Journey D: Defensive Policy Preview, Application, Active Verification & Rollback", () => {
    it("should preview policy impact, verify lockout rules, apply rate-limiting, and roll back safely", async () => {
      const testPolicy: DefensivePolicy = {
        id: "pol_journey_d_01",
        organizationId: ownerSession.organizationId,
        assetId: "ast_prod_api_01",
        assetDomain: "api.shield-enterprise.io",
        name: "Emergency Checkout Ingress Guard",
        description: "Limits burst to 500 req/s",
        targetRoute: "/api/v1/checkout",
        rateLimitPerSecond: 500,
        burstLimit: 50,
        timeWindowSeconds: 60,
        mode: "ENFORCED",
        adapterType: "LOCAL_PROXY",
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      // 1. Preview policy impact
      const preview = await PolicyService.preview(testPolicy, ownerSession);
      expect(preview.policyId).toBe(testPolicy.id);
      expect(preview.safeToApply).toBe(true);
      expect(preview.estimatedTotalRps).toBeGreaterThan(0);

      // 2. Lockout check on critical health/login paths
      const sensitivePolicy: DefensivePolicy = {
        ...testPolicy,
        targetRoute: "/login",
        rateLimitPerSecond: 5,
        burstLimit: 2,
      };
      const sensitivePreview = await PolicyService.preview(sensitivePolicy, ownerSession);
      expect(sensitivePreview.safeToApply).toBe(false);
      expect(sensitivePreview.riskOfFalsePositives).toBe("HIGH");
      expect(sensitivePreview.potentialLockouts.length).toBeGreaterThan(0);

      // 3. Apply defensive policy via Local Proxy Adapter
      const applyResult = await PolicyService.apply(testPolicy, ownerSession);
      expect(applyResult.success).toBe(true);
      expect(applyResult.status).toBe("APPLIED");
      expect(applyResult.appliedConfigSnippet).toContain("limit_req_zone");

      // 4. Verify active enforcement (probe returns HTTP 429 on simulated excess)
      const verifyResult = await PolicyService.verify(testPolicy.id);
      expect(verifyResult.status).toBe("VERIFIED");
      expect(verifyResult.effectiveStatusCode).toBe(429);
      expect(verifyResult.droppedCount).toBeGreaterThan(0);

      // 5. Execute 1-click rollback to known-good baseline
      const rollbackResult = await PolicyService.rollback(testPolicy.id, ownerSession);
      expect(rollbackResult.success).toBe(true);
      expect(rollbackResult.status).toBe("REVOKED");
    });
  });

  // --------------------------------------------------------------------------
  // Journey E: AI Incident Analysis → Alert Dispatch → Resolve → Report
  // --------------------------------------------------------------------------
  describe("Journey E: AI Incident Analysis, Outbound Alert, Resolution & Post-Mortem", () => {
    it("should synthesize incident telemetry, dispatch SSRF-safe alert, resolve incident, and draft report", async () => {
      const incident = await DataService.getIncidentById("inc_oct21_001");
      expect(incident).not.toBeNull();

      if (incident) {
        // 1. AI Analysis synthesis
        const analysis = await AIIncidentAnalyst.analyze(incident);
        expect(analysis.incidentId).toBe(incident.id);
        expect(analysis.plainLanguageSummary).toBeDefined();
        expect(analysis.measuredFacts.length).toBeGreaterThan(0);
        expect(analysis.hypotheses.length).toBeGreaterThan(0);
        expect(analysis.suggestedMitigation.actionType).toBe("RATE_LIMIT");

        // 2. Webhook notification dispatch with SSRF protection
        const delivery = await WebhookDispatcher.dispatch(
          "https://httpbin.org/post",
          {
            eventId: "evt_test_alert",
            eventType: "INCIDENT_CREATED",
            timestamp: new Date().toISOString(),
            organizationId: ownerSession.organizationId,
            severity: "CRITICAL",
            title: `Alert: ${incident.title}`,
            summary: analysis.plainLanguageSummary,
            assetDomain: incident.assetDomain,
          },
          "test-signing-secret"
        );
        // Dispatch executed without SSRF violations
        if (delivery.error) {
          expect(delivery.error).not.toMatch(/SSRF/i);
        } else {
          expect(delivery.success).toBe(true);
        }

        // 3. Resolve incident
        const resolved = await DataService.updateIncidentStatus(incident.id, "RESOLVED", {
          resolutionReason: "Defensive rate-limiting normalized traffic. Legitimate user 200 OK restored.",
          operator: ownerSession.email,
        });
        expect(resolved?.status).toBe("RESOLVED");
        expect(resolved?.resolvedAt).toBeDefined();

        // 4. Verify post-incident report draft
        expect(analysis.postIncidentReportDraft).toContain("Post-Incident Executive Summary");
      }
    }, 15000);
  });

  // --------------------------------------------------------------------------
  // Journey F: Tenant Isolation & Unauthorized Access Barriers
  // --------------------------------------------------------------------------
  describe("Journey F: Cross-Tenant Isolation & Granular RBAC Permissions", () => {
    it("should strictly deny cross-tenant operations and enforce role permission boundaries", async () => {
      // 1. VIEWER role cannot apply or modify defensive policies
      expect(hasPermission(viewerSession.role, "canModifyPolicies")).toBe(false);
      expect(hasPermission(viewerSession.role, "canManageAssets")).toBe(false);
      expect(hasPermission(viewerSession.role, "canTriggerMitigation")).toBe(false);

      // Attempting to apply policy with VIEWER role must throw permission error
      const unauthorizedPolicy: DefensivePolicy = {
        id: "pol_unauth_01",
        organizationId: viewerSession.organizationId,
        assetId: "ast_prod_api_01",
        assetDomain: "api.shield-enterprise.io",
        name: "Unauthorized Policy",
        description: "Should be blocked",
        targetRoute: "/api",
        rateLimitPerSecond: 100,
        burstLimit: 10,
        timeWindowSeconds: 60,
        mode: "ENFORCED",
        adapterType: "LOCAL_PROXY",
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      await expect(PolicyService.apply(unauthorizedPolicy, viewerSession)).rejects.toThrow(/Permission denied/);

      // 2. Cross-tenant isolation: Tenant B cannot modify Tenant A's policy
      const crossTenantPolicy: DefensivePolicy = {
        ...unauthorizedPolicy,
        organizationId: "org_shield_alpha", // Belongs to Tenant A
      };

      // Tenant B (from org_tenant_beta) attempts to apply policy targeting Tenant A
      await expect(PolicyService.apply(crossTenantPolicy, tenantBSession)).rejects.toThrow(/Permission denied/);
    });
  });
});
