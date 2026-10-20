import { describe, it, expect } from "vitest";
import { hasPermission } from "../src/lib/rbac";

describe("Role-Based Access Control (RBAC)", () => {
  it("should grant OWNER full administrative and destructive capabilities", () => {
    expect(hasPermission("OWNER", "canManageAssets")).toBe(true);
    expect(hasPermission("OWNER", "canTriggerMitigation")).toBe(true);
    expect(hasPermission("OWNER", "canManageTeam")).toBe(true);
    expect(hasPermission("OWNER", "canManageBilling")).toBe(true);
    expect(hasPermission("OWNER", "canGenerateApiKeys")).toBe(true);
  });

  it("should grant SECURITY_ADMIN mitigation and asset rights, but restrict billing and team invites", () => {
    expect(hasPermission("SECURITY_ADMIN", "canManageAssets")).toBe(true);
    expect(hasPermission("SECURITY_ADMIN", "canTriggerMitigation")).toBe(true);
    expect(hasPermission("SECURITY_ADMIN", "canManageBilling")).toBe(false);
    expect(hasPermission("SECURITY_ADMIN", "canManageTeam")).toBe(false);
  });

  it("should restrict VIEWER to read-only capabilities without mitigation permissions", () => {
    expect(hasPermission("VIEWER", "canManageAssets")).toBe(false);
    expect(hasPermission("VIEWER", "canTriggerMitigation")).toBe(false);
    expect(hasPermission("VIEWER", "canModifyPolicies")).toBe(false);
    expect(hasPermission("VIEWER", "canGenerateApiKeys")).toBe(false);
  });
});
