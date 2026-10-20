import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForProfile } from "@/lib/oauth";
import { createSessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const providerParam = searchParams.get("provider") || "google";
  const provider = providerParam.toLowerCase() as "google" | "github";

  const errorParam = searchParams.get("error");
  if (errorParam) {
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set("oauth_error", `Provider reported an error: ${errorParam}`);
    return NextResponse.redirect(errorUrl);
  }

  if (!code || !state) {
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set("oauth_error", "Missing OAuth authorization code or CSRF state parameter.");
    return NextResponse.redirect(errorUrl);
  }

  // Verify CSRF state against stored HTTP-only cookie
  const storedStateCookie = req.cookies.get("smart_ddos_oauth_state")?.value;
  if (!storedStateCookie) {
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set(
      "oauth_error",
      "OAuth state expired or cookie missing. Please initiate sign in again."
    );
    return NextResponse.redirect(errorUrl);
  }

  const [storedProvider, storedState] = storedStateCookie.split(":");
  if (storedState !== state || storedProvider !== provider) {
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set(
      "oauth_error",
      "Security verification failed: OAuth state mismatch (potential CSRF attempt)."
    );
    return NextResponse.redirect(errorUrl);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const redirectUri = `${baseUrl}/api/auth/oauth/callback?provider=${provider}`;

  try {
    const profile = await exchangeCodeForProfile(provider, code, redirectUri);

    const orgSlug = (profile.name || "workspace")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

    const sessionPayload = {
      userId: `usr_oauth_${profile.provider}_${profile.providerUserId}`,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      organizationId: `org_${Math.random().toString(36).substring(2, 9)}`,
      organizationName: `${profile.name}'s Workspace`,
      organizationSlug: orgSlug,
      role: "OWNER" as const,
      isPlatformAdmin: false,
    };

    const token = await createSessionToken(sessionPayload);

    // Redirect first-time OAuth users to Onboarding Wizard
    const targetUrl = new URL("/onboarding", req.url);
    targetUrl.searchParams.set("welcome", "1");

    const response = NextResponse.redirect(targetUrl);

    // Set secure session cookie
    response.cookies.set({
      name: "smart_ddos_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Clear state cookie
    response.cookies.delete("smart_ddos_oauth_state");

    return response;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "OAuth authentication failed";
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set("oauth_error", errorMessage);
    return NextResponse.redirect(errorUrl);
  }
}
