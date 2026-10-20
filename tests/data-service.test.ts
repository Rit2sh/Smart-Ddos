import { describe, it, expect } from "vitest";
import { DataService } from "../src/lib/data-service";

describe("Data Service & Asset Registration Lifecycle", () => {
  it("should create a new asset with unverified status and DNS TXT verification token", async () => {
    const asset = await DataService.createAsset({
      name: "Staging Test Gateway",
      domain: "staging-test.shield-enterprise.io",
      assetType: "API_GATEWAY",
      originTarget: "192.0.2.199:443",
      verificationMethod: "DNS_TXT",
    });

    expect(asset.id).toBeDefined();
    expect(asset.status).toBe("UNVERIFIED");
    expect(asset.protectionEnabled).toBe(false);
    expect(asset.verification?.token).toBeDefined();
    expect(asset.verification?.status).toBe("PENDING");
    expect(asset.verification?.expectedRecord).toContain("_smartddos-challenge");
  });

  it("should verify ownership and transition asset to ACTIVE with protection enabled", async () => {
    const asset = await DataService.createAsset({
      name: "Payment Ingress",
      domain: "payments-verify-test.shield-enterprise.io",
      assetType: "DOMAIN",
      originTarget: "198.51.100.99:443",
      verificationMethod: "DNS_TXT",
    });

    const result = await DataService.verifyAsset(asset.id);
    expect(result.success).toBe(true);
    expect(result.asset?.status).toBe("ACTIVE");
    expect(result.asset?.protectionEnabled).toBe(true);
    expect(result.asset?.verification?.status).toBe("VERIFIED");
  });
});
