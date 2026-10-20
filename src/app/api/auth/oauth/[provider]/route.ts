import { NextRequest, NextResponse } from "next/server";
import {
  getOAuthConfig,
  generateOAuthState,
  buildAuthorizationUrl,
} from "@/lib/oauth";

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase();

  if (provider !== "google" && provider !== "github") {
    return NextResponse.json(
      { error: "Invalid OAuth provider. Supported providers: 'google', 'github'." },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const redirectUri = `${baseUrl}/api/auth/oauth/callback?provider=${provider}`;

  const config = getOAuthConfig(provider as "google" | "github");

  // Handle environment when credentials are not yet configured
  if (!config) {
    const errorUrl = new URL("/login", req.url);
    errorUrl.searchParams.set(
      "oauth_error",
      `${provider.toUpperCase()} credentials are not configured in your environment. Set ${provider.toUpperCase()}_CLIENT_ID and ${provider.toUpperCase()}_CLIENT_SECRET in .env or use demo credentials.`
    );
    return NextResponse.redirect(errorUrl);
  }

  const state = generateOAuthState();
  const authorizationUrl = buildAuthorizationUrl(config, state, redirectUri);

  const response = NextResponse.redirect(authorizationUrl);

  // Set CSRF state cookie (HTTP-only, 10 min expiry)
  response.cookies.set({
    name: "smart_ddos_oauth_state",
    value: `${provider}:${state}`,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  return response;
}
