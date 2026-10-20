import { DefensivePolicy, MitigationStatus, ProxyVerificationResult } from "../types";

export interface PolicyImpactPreview {
  policyId: string;
  name: string;
  targetRoute: string;
  estimatedTotalRps: number;
  estimatedBlockedRps: number;
  estimatedCleanRps: number;
  riskOfFalsePositives: "LOW" | "MEDIUM" | "HIGH";
  potentialLockouts: string[];
  safeToApply: boolean;
  warnings: string[];
}

export interface EnforcementResult {
  success: boolean;
  policyId: string;
  adapterName: string;
  status: MitigationStatus;
  appliedConfigSnippet?: string;
  rollbackConfigId?: string;
  message: string;
  timestamp: string;
}

export interface RollbackResult {
  success: boolean;
  policyId: string;
  adapterName: string;
  status: MitigationStatus;
  message: string;
  restoredAt: string;
}

export interface EnforcementAdapter {
  readonly name: string;
  readonly adapterType: "LOCAL_PROXY" | "CLOUDFLARE_WAF" | "AWS_SHIELD" | "SIMULATION";

  previewPolicy(policy: DefensivePolicy): Promise<PolicyImpactPreview>;
  applyPolicy(policy: DefensivePolicy): Promise<EnforcementResult>;
  verifyEnforcement(policy: DefensivePolicy): Promise<ProxyVerificationResult>;
  rollbackPolicy(policyId: string): Promise<RollbackResult>;
}
