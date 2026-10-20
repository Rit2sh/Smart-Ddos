import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, createSessionToken, verifySessionToken } from "../src/lib/auth";
import { UserSession } from "../src/lib/types";

describe("Authentication & Session Management", () => {
  it("should securely hash and verify passwords", async () => {
    const raw = "SuperSecretPassword2026!";
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(await comparePassword(raw, hash)).toBe(true);
    expect(await comparePassword("WrongPassword", hash)).toBe(false);
  });

  it("should issue and verify cryptographic JWT session tokens", async () => {
    const payload: UserSession = {
      userId: "usr_test_123",
      email: "tester@smartddos.io",
      name: "Security Tester",
      organizationId: "org_test_01",
      organizationName: "Test Cyber Org",
      organizationSlug: "test-cyber",
      role: "SECURITY_ADMIN",
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe("SECURITY_ADMIN");
    expect(decoded?.organizationId).toBe("org_test_01");
  });
});
