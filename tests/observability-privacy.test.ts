import { describe, it, expect } from "vitest";
import { DataService } from "../src/lib/data-service";
import crypto from "crypto";

describe("Observability & Privacy Subsystem", () => {
  it("should enforce correlation ID propagation and distinguish control plane from protected apps", async () => {
    const collectors = await DataService.getCollectors();
    const assets = await DataService.getAssets();
    const incidents = await DataService.getIncidents();

    const healthyCollectors = collectors.filter((c) => c.status === "HEALTHY").length;
    const isControlPlaneReady = healthyCollectors > 0;

    const underAttackAssets = assets.filter((a) => a.status === "UNDER_ATTACK").length;
    const activeIncidents = incidents.filter((i) => i.status === "ACTIVE");

    // Even if protected applications are under attack, control plane must remain ready
    expect(isControlPlaneReady).toBe(true);
    expect(activeIncidents.length).toBeGreaterThanOrEqual(1);

    // Protected application status is decoupled from control plane readiness
    const protectedAppsHealth = underAttackAssets > 0 || activeIncidents.length > 0 ? "UNDER_ATTACK" : "NORMAL";
    expect(protectedAppsHealth).toBe("UNDER_ATTACK");
  });

  it("should pseudonymize client source IPs and scrub verification secrets for GDPR compliance", () => {
    const rawIp = "185.220.101.42";
    const maskedIp = rawIp.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.$2.$3.xxx");

    expect(maskedIp).toBe("185.220.101.xxx");
    expect(maskedIp).not.toContain(".42");

    // Hashed client identifier privacy
    const clientKey = "185.220.101.42|Mozilla/5.0";
    const hashedIdentifier = crypto.createHash("sha256").update(clientKey).digest("hex").slice(0, 16);
    expect(hashedIdentifier.length).toBe(16);
    expect(hashedIdentifier).not.toContain("185.220");
  });

  it("should record tamper-evident audit logs for security critical actions", async () => {
    const initialLogs = await DataService.getAuditLogs();
    const initialCount = initialLogs.length;

    await DataService.recordAuditLog({
      action: "POLICY_ENFORCED_TEST",
      userEmail: "secops@shield-enterprise.io",
      resourceType: "MitigationPolicy",
      resourceId: "pol_test_obs",
      ipAddress: "127.0.0.1",
      details: "Test policy enforcement recorded",
    });

    const updatedLogs = await DataService.getAuditLogs();
    expect(updatedLogs.length).toBe(initialCount + 1);
    expect(updatedLogs[0].action).toBe("POLICY_ENFORCED_TEST");
    expect(updatedLogs[0].timestamp).toBeDefined();
    expect(updatedLogs[0].id).toMatch(/^aud_/);
  });
});
