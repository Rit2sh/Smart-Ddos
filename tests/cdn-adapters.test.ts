import { describe, it, expect } from "vitest";
import { CloudflareWafAdapter } from "../src/lib/enforcement/cloudflare-waf-adapter";
import { AwsShieldAdapter } from "../src/lib/enforcement/aws-shield-adapter";
import { DefensivePolicy } from "../src/lib/types";

describe("CDN and Cloud WAF Integration Adapters", () => {
  const mockPolicy: DefensivePolicy = {
    id: "pol_cf_test",
    organizationId: "org_01",
    assetId: "ast_01",
    assetDomain: "api.shield-enterprise.io",
    name: "Rate Limit /checkout",
    description: "Defensive rate-limiting",
    targetRoute: "/api/v1/checkout",
    rateLimitPerSecond: 300,
    burstLimit: 30,
    timeWindowSeconds: 60,
    mode: "ENFORCED",
    adapterType: "CLOUDFLARE_WAF",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  describe("Cloudflare WAF Adapter", () => {
    it("should report AWAITING_CREDENTIALS when API token or Zone ID is absent", async () => {
      const adapter = new CloudflareWafAdapter({ apiToken: undefined, zoneId: undefined });
      expect(adapter.hasValidCredentials()).toBe(false);

      const conn = await adapter.validateConnection();
      expect(conn.valid).toBe(false);
      expect(conn.status).toBe("AWAITING_CREDENTIALS");

      // Applying policy without credentials must NOT report success; must report UNKNOWN
      const result = await adapter.applyPolicy(mockPolicy);
      expect(result.success).toBe(false);
      expect(result.status).toBe("UNKNOWN");
      expect(result.message).toContain("credentials missing");
    });

    it("should compute preview with warnings when credentials are not yet live", async () => {
      const adapter = new CloudflareWafAdapter({ apiToken: undefined, zoneId: undefined });
      const preview = await adapter.previewPolicy(mockPolicy);

      expect(preview.policyId).toBe(mockPolicy.id);
      expect(preview.estimatedTotalRps).toBeGreaterThan(0);
      expect(preview.warnings.length).toBeGreaterThan(0);
      expect(preview.warnings[0]).toContain("awaiting live Cloudflare credentials");
    });

    it("should report UNKNOWN verification status when credentials are not configured", async () => {
      const adapter = new CloudflareWafAdapter({ apiToken: undefined, zoneId: undefined });
      const ver = await adapter.verifyEnforcement(mockPolicy);

      expect(ver.status).toBe("UNKNOWN");
      expect(ver.details).toContain("credentials not configured");
    });

    it("should perform clean rollback", async () => {
      const adapter = new CloudflareWafAdapter({ apiToken: undefined, zoneId: undefined });
      const rb = await adapter.rollbackPolicy(mockPolicy.id);

      expect(rb.success).toBe(true);
      expect(rb.status).toBe("REVOKED");
    });
  });

  describe("AWS Shield & WAF Adapter", () => {
    it("should report AWAITING_CREDENTIALS when IAM keys or WebACL ID are missing", async () => {
      const adapter = new AwsShieldAdapter({ accessKeyId: undefined, secretAccessKey: undefined });
      expect(adapter.hasValidCredentials()).toBe(false);

      const conn = await adapter.validateConnection();
      expect(conn.valid).toBe(false);
      expect(conn.status).toBe("AWAITING_CREDENTIALS");

      const result = await adapter.applyPolicy({
        ...mockPolicy,
        adapterType: "AWS_SHIELD",
      });
      expect(result.success).toBe(false);
      expect(result.status).toBe("UNKNOWN");
      expect(result.message).toContain("credentials not configured");
    });

    it("should compute preview for AWS WAF rate-based statement", async () => {
      const adapter = new AwsShieldAdapter({ accessKeyId: undefined, secretAccessKey: undefined });
      const preview = await adapter.previewPolicy({
        ...mockPolicy,
        adapterType: "AWS_SHIELD",
      });

      expect(preview.safeToApply).toBe(true);
      expect(preview.estimatedTotalRps).toBe(1800);
    });

    it("should rollback policy gracefully", async () => {
      const adapter = new AwsShieldAdapter({ accessKeyId: undefined, secretAccessKey: undefined });
      const rb = await adapter.rollbackPolicy(mockPolicy.id);

      expect(rb.success).toBe(true);
      expect(rb.status).toBe("REVOKED");
    });
  });
});
