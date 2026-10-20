import { UserRole } from "./types";

export interface PermissionMatrix {
  canManageAssets: boolean;
  canVerifyAssets: boolean;
  canTriggerMitigation: boolean;
  canModifyPolicies: boolean;
  canManageIntegrations: boolean;
  canManageTeam: boolean;
  canManageBilling: boolean;
  canViewAuditLogs: boolean;
  canGenerateApiKeys: boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, PermissionMatrix> = {
  OWNER: {
    canManageAssets: true,
    canVerifyAssets: true,
    canTriggerMitigation: true,
    canModifyPolicies: true,
    canManageIntegrations: true,
    canManageTeam: true,
    canManageBilling: true,
    canViewAuditLogs: true,
    canGenerateApiKeys: true,
  },
  SECURITY_ADMIN: {
    canManageAssets: true,
    canVerifyAssets: true,
    canTriggerMitigation: true,
    canModifyPolicies: true,
    canManageIntegrations: true,
    canManageTeam: false,
    canManageBilling: false,
    canViewAuditLogs: true,
    canGenerateApiKeys: true,
  },
  ANALYST: {
    canManageAssets: false,
    canVerifyAssets: false,
    canTriggerMitigation: true,
    canModifyPolicies: false,
    canManageIntegrations: false,
    canManageTeam: false,
    canManageBilling: false,
    canViewAuditLogs: true,
    canGenerateApiKeys: false,
  },
  VIEWER: {
    canManageAssets: false,
    canVerifyAssets: false,
    canTriggerMitigation: false,
    canModifyPolicies: false,
    canManageIntegrations: false,
    canManageTeam: false,
    canManageBilling: false,
    canViewAuditLogs: false,
    canGenerateApiKeys: false,
  },
};

export function hasPermission(role: UserRole, permission: keyof PermissionMatrix): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}

export function canAccessAdmin(userEmail?: string): boolean {
  // In demo or test mode, default security admin or configured admin emails have platform admin access
  if (!userEmail) return false;
  return userEmail.endsWith("@smartddos.io") || userEmail === "admin@smartddos.io" || userEmail === "demo@smartddos.io";
}
