import { describe, it, expect } from "vitest";
import {
  generateOAuthState,
  buildAuthorizationUrl,
  getOAuthConfig,
} from "../src/lib/oauth";
import { PRICING_TIERS } from "../src/lib/pricing-config";

describe("OAuth 2.0 / OIDC Authentication Suite", () => {
  it("should generate cryptographically strong 64-character random hex state tokens", () => {
    const state1 = generateOAuthState();
    const state2 = generateOAuthState();

    expect(state1).toHaveLength(64);
    expect(state2).toHaveLength(64);
    expect(state1).not.toBe(state2);
    expect(/^[a-f0-9]{64}$/.test(state1)).toBe(true);
  });

  it("should correctly build Google authorization URL with required OIDC scopes", () => {
    const mockConfig = {
      provider: "google" as const,
      clientId: "test-google-client-id.apps.googleusercontent.com",
      clientSecret: "test-secret",
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
      scopes: ["openid", "email", "profile"],
    };

    const state = generateOAuthState();
    const redirectUri = "http://localhost:3000/api/auth/oauth/callback?provider=google";
    const authUrl = buildAuthorizationUrl(mockConfig, state, redirectUri);

    const parsed = new URL(authUrl);
    expect(parsed.origin).toBe("https://accounts.google.com");
    expect(parsed.pathname).toBe("/o/oauth2/v2/auth");
    expect(parsed.searchParams.get("client_id")).toBe(mockConfig.clientId);
    expect(parsed.searchParams.get("redirect_uri")).toBe(redirectUri);
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("scope")).toBe("openid email profile");
    expect(parsed.searchParams.get("state")).toBe(state);
    expect(parsed.searchParams.get("access_type")).toBe("offline");
  });

  it("should correctly build GitHub authorization URL with required scopes", () => {
    const mockConfig = {
      provider: "github" as const,
      clientId: "test-github-client-id",
      clientSecret: "test-github-secret",
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      userInfoUrl: "https://api.github.com/user",
      scopes: ["read:user", "user:email"],
    };

    const state = generateOAuthState();
    const redirectUri = "http://localhost:3000/api/auth/oauth/callback?provider=github";
    const authUrl = buildAuthorizationUrl(mockConfig, state, redirectUri);

    const parsed = new URL(authUrl);
    expect(parsed.origin).toBe("https://github.com");
    expect(parsed.pathname).toBe("/login/oauth/authorize");
    expect(parsed.searchParams.get("client_id")).toBe(mockConfig.clientId);
    expect(parsed.searchParams.get("scope")).toBe("read:user user:email");
    expect(parsed.searchParams.get("state")).toBe(state);
  });
});

describe("Pricing Configuration Integrity", () => {
  it("should define all 4 required pricing tiers with transparent boundaries", () => {
    expect(PRICING_TIERS).toHaveLength(4);
    const tierIds = PRICING_TIERS.map((t) => t.id);
    expect(tierIds).toContain("developer-free");
    expect(tierIds).toContain("starter");
    expect(tierIds).toContain("business");
    expect(tierIds).toContain("enterprise");

    for (const tier of PRICING_TIERS) {
      expect(tier.name).toBeTruthy();
      expect(tier.price).toBeTruthy();
      expect(tier.limits.assets).toBeTruthy();
      expect(tier.limits.retention).toBeTruthy();
      expect(tier.honestLimitation).toBeTruthy();
      expect(tier.features.length).toBeGreaterThan(3);
    }
  });

  it("should clearly label free tier as telemetry monitoring without in-line packet drops", () => {
    const freeTier = PRICING_TIERS.find((t) => t.id === "developer-free");
    expect(freeTier).toBeDefined();
    expect(freeTier?.honestLimitation.toLowerCase()).toContain("monitoring");
  });
});

describe("Domain Validation for Onboarding", () => {
  const isValidHostname = (hostname: string) => {
    const cleaned = hostname.toLowerCase().trim();
    const pattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return pattern.test(cleaned);
  };

  it("should validate legitimate apex domains and subdomains", () => {
    expect(isValidHostname("example.com")).toBe(true);
    expect(isValidHostname("api.example.com")).toBe(true);
    expect(isValidHostname("shop.staging.my-brand.co.uk")).toBe(true);
    expect(isValidHostname("cyber-shield.io")).toBe(true);
  });

  it("should reject invalid hostnames, URLs with protocol, or trailing slashes", () => {
    expect(isValidHostname("https://example.com")).toBe(false);
    expect(isValidHostname("http://api.example.com/")).toBe(false);
    expect(isValidHostname("example.com/checkout")).toBe(false);
    expect(isValidHostname("not a domain")).toBe(false);
    expect(isValidHostname("")).toBe(false);
  });
});
