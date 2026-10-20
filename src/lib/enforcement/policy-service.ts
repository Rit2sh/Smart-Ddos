import {
  DefensivePolicy,
  MitigationStatus,
  ProxyVerificationResult,
  UserSession,
} from "../types";
import { hasPermission } from "../rbac";
import { DataService } from "../data-service";
import { LocalProxyEnforcementAdapter } from "./local-proxy-adapter";
import { SimulationEnforcementAdapter } from "./simulation-adapter";
import { CloudflareWafAdapter } from "./cloudflare-waf-adapter";
import { AwsShieldAdapter } from "./aws-shield-adapter";
import { EnforcementAdapter, PolicyImpactPreview, EnforcementResult, RollbackResult } from "./adapter-contract";

const localAdapter = new LocalProxyEnforcementAdapter();
const simAdapter = new SimulationEnforcementAdapter();
const cfAdapter = new CloudflareWafAdapter();
const awsAdapter = new AwsShieldAdapter();

const policiesStore = new Map<string, DefensivePolicy>();

// Seed initial active policies
const defaultPolicy: DefensivePolicy = {
  id: "pol_def_01",
  organizationId: "org_shield_cyber_01",
  assetId: "ast_prod_api_01",
  assetDomain: "api.shield-enterprise.io",
  name: "Adaptive High-RPS Rate Limiting",
  description: "Enforces 500 req/s rate-limiting on sensitive API routes when anomalous spikes occur.",
  targetRoute: "/api/v1/checkout",
  rateLimitPerSecond: 500,
  burstLimit: 50,
  timeWindowSeconds: 60,
  mode: "ENFORCED",
  adapterType: "LOCAL_PROXY",
  status: "VERIFIED",
  appliedAt: "2026-10-20T23:00:00Z",
  verifiedAt: "2026-10-20T23:01:10Z",
  createdAt: "2026-10-20T22:50:00Z",
};
policiesStore.set(defaultPolicy.id, defaultPolicy);

export const PolicyService = {
  getAdapter(type: "LOCAL_PROXY" | "CLOUDFLARE_WAF" | "AWS_SHIELD" | "SIMULATION"): EnforcementAdapter {
    if (type === "LOCAL_PROXY") return localAdapter;
    if (type === "CLOUDFLARE_WAF") return cfAdapter;
    if (type === "AWS_SHIELD") return awsAdapter;
    return simAdapter;
  },

  getPolicies(): DefensivePolicy[] {
    return Array.from(policiesStore.values());
  },

  getPolicyById(id: string): DefensivePolicy | null {
    return policiesStore.get(id) || null;
  },

  async preview(
    policy: DefensivePolicy,
    user: UserSession
  ): Promise<PolicyImpactPreview> {
    if (policy.organizationId && policy.organizationId !== user.organizationId && !user.isPlatformAdmin) {
      throw new Error(`Permission denied: Cross-tenant access violation. Organization ${user.organizationId} cannot preview policies for ${policy.organizationId}.`);
    }

    const adapter = this.getAdapter(policy.adapterType);
    return adapter.previewPolicy(policy);
  },

  async apply(
    policy: DefensivePolicy,
    user: UserSession,
    forceOverride = false
  ): Promise<EnforcementResult> {
    // 1. Cross-tenant isolation check
    if (policy.organizationId && policy.organizationId !== user.organizationId && !user.isPlatformAdmin) {
      throw new Error(`Permission denied: Cross-tenant access violation. Organization ${user.organizationId} cannot modify policies for ${policy.organizationId}.`);
    }

    // 2. Check user permission
    if (!hasPermission(user.role, "canTriggerMitigation")) {
      throw new Error(`Permission denied: Operator role ${user.role} is not authorized to apply defensive mitigation.`);
    }

    // 3. Validate asset is verified
    const asset = await DataService.getAssetById(policy.assetId);
    if (!asset || asset.status === "UNVERIFIED" || asset.verification?.status !== "VERIFIED") {
      throw new Error(`Security Policy Lock: Protective mitigation cannot be enforced on an unverified asset (${policy.assetDomain}).`);
    }

    // 4. Check for lockouts
    const adapter = this.getAdapter(policy.adapterType);
    const preview = await adapter.previewPolicy(policy);
    if (preview.potentialLockouts.length > 0 && !forceOverride) {
      throw new Error(`Dangerous lockout risk detected: ${preview.potentialLockouts.join(", ")}. Explicit operator override required.`);
    }

    // 5. Apply via adapter
    const result = await adapter.applyPolicy(policy);

    // 6. Update policy store
    policy.status = result.status;
    policy.appliedAt = result.timestamp;
    policiesStore.set(policy.id, policy);

    // 7. Record audit log
    await DataService.recordAuditLog({
      action: "DEFENSIVE_POLICY_APPLIED",
      userEmail: user.email,
      resourceType: "DefensivePolicy",
      resourceId: policy.id,
      ipAddress: "127.0.0.1",
      details: `Enforced ${policy.name} on ${policy.targetRoute} via ${adapter.name}. Status: ${result.status}`,
    });

    return result;
  },

  async verify(policyId: string): Promise<ProxyVerificationResult> {
    const policy = policiesStore.get(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }

    const adapter = this.getAdapter(policy.adapterType);
    const result = await adapter.verifyEnforcement(policy);

    if (result.status === "VERIFIED") {
      policy.status = "VERIFIED";
      policy.verifiedAt = result.verifiedAt;
      policiesStore.set(policy.id, policy);
    }

    return result;
  },

  async rollback(policyId: string, user: UserSession): Promise<RollbackResult> {
    const policy = policiesStore.get(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }

    if (policy.organizationId && policy.organizationId !== user.organizationId && !user.isPlatformAdmin) {
      throw new Error(`Permission denied: Cross-tenant access violation. Organization ${user.organizationId} cannot rollback policies for ${policy.organizationId}.`);
    }

    if (!hasPermission(user.role, "canTriggerMitigation")) {
      throw new Error(`Permission denied: Operator role ${user.role} is not authorized to rollback policies.`);
    }

    const adapter = this.getAdapter(policy.adapterType);
    const result = await adapter.rollbackPolicy(policyId);

    if (result.success) {
      policy.status = "REVOKED";
      policiesStore.set(policy.id, policy);

      await DataService.recordAuditLog({
        action: "DEFENSIVE_POLICY_ROLLED_BACK",
        userEmail: user.email,
        resourceType: "DefensivePolicy",
        resourceId: policyId,
        ipAddress: "127.0.0.1",
        details: `Rolled back policy ${policy.name} on ${policy.targetRoute}. Normal routing restored.`,
      });
    }

    return result;
  },

  createPolicy(params: Omit<DefensivePolicy, "id" | "createdAt" | "status">): DefensivePolicy {
    const id = "pol_" + Math.random().toString(36).substring(2, 9);
    const newPolicy: DefensivePolicy = {
      ...params,
      id,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    policiesStore.set(id, newPolicy);
    return newPolicy;
  },
};
