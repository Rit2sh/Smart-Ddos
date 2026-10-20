import {
  DefensivePolicy,
  ProxyVerificationResult,
} from "../types";
import {
  EnforcementAdapter,
  PolicyImpactPreview,
  EnforcementResult,
  RollbackResult,
} from "./adapter-contract";

export class SimulationEnforcementAdapter implements EnforcementAdapter {
  readonly name = "Synthetic Staging Simulation Adapter";
  readonly adapterType = "SIMULATION" as const;

  async previewPolicy(policy: DefensivePolicy): Promise<PolicyImpactPreview> {
    return {
      policyId: policy.id,
      name: policy.name,
      targetRoute: policy.targetRoute,
      estimatedTotalRps: 5000,
      estimatedBlockedRps: 3800,
      estimatedCleanRps: 1200,
      riskOfFalsePositives: "LOW",
      potentialLockouts: [],
      safeToApply: true,
      warnings: ["Notice: Dry-run simulation only. Live proxies will not be altered."],
    };
  }

  async applyPolicy(policy: DefensivePolicy): Promise<EnforcementResult> {
    return {
      success: true,
      policyId: policy.id,
      adapterName: this.name,
      status: "SIMULATED",
      appliedConfigSnippet: "# SIMULATED POLICY: dry-run mode active. No actual traffic blocked.",
      rollbackConfigId: `sim_backup_${policy.id}`,
      message: "Policy applied in simulation dry-run mode. Real network traffic was not altered.",
      timestamp: new Date().toISOString(),
    };
  }

  async verifyEnforcement(policy: DefensivePolicy): Promise<ProxyVerificationResult> {
    return {
      adapter: this.name,
      targetUrl: `http://simulated-target.internal${policy.targetRoute}`,
      policyId: policy.id,
      status: "SIMULATED",
      testedRate: 1000,
      droppedCount: 800,
      passedCount: 200,
      effectiveStatusCode: 429,
      details: "Simulated verification: Virtual mock collector synthesized 1,000 requests with 800 simulated drops. No real packets were intercepted.",
      verifiedAt: new Date().toISOString(),
    };
  }

  async rollbackPolicy(policyId: string): Promise<RollbackResult> {
    return {
      success: true,
      policyId,
      adapterName: this.name,
      status: "REVOKED",
      message: `Simulated policy ${policyId} dry-run cleared.`,
      restoredAt: new Date().toISOString(),
    };
  }
}
