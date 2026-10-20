import crypto from "crypto";

export interface OAuthProviderConfig {
  provider: "google" | "github";
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
}

export interface OAuthUserProfile {
  provider: "google" | "github";
  providerUserId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export function getOAuthConfig(provider: "google" | "github"): OAuthProviderConfig | null {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/oauth/callback`;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;

    return {
      provider: "google",
      clientId,
      clientSecret,
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
      scopes: ["openid", "email", "profile"],
    };
  }

  if (provider === "github") {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;

    return {
      provider: "github",
      clientId,
      clientSecret,
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      userInfoUrl: "https://api.github.com/user",
      scopes: ["read:user", "user:email"],
    };
  }

  return null;
}

export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function buildAuthorizationUrl(
  config: OAuthProviderConfig,
  state: string,
  redirectUri: string
): string {
  const url = new URL(config.authorizationUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scopes.join(" "));
  url.searchParams.set("state", state);

  if (config.provider === "google") {
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "select_account");
  }

  return url.toString();
}

export async function exchangeCodeForProfile(
  provider: "google" | "github",
  code: string,
  redirectUri: string
): Promise<OAuthUserProfile> {
  const config = getOAuthConfig(provider);
  if (!config) {
    throw new Error(
      `OAuth provider '${provider}' is not configured in this environment. Please configure ${provider.toUpperCase()}_CLIENT_ID and ${provider.toUpperCase()}_CLIENT_SECRET in .env.`
    );
  }

  if (provider === "google") {
    // Exchange authorization code for token
    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      throw new Error(`Google token exchange failed: ${err}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from OpenID Connect endpoint
    const profileRes = await fetch(config.userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      throw new Error("Failed to retrieve Google user profile");
    }

    const profileData = await profileRes.json();

    return {
      provider: "google",
      providerUserId: profileData.sub,
      email: profileData.email,
      name: profileData.name || profileData.email.split("@")[0],
      avatarUrl: profileData.picture,
    };
  }

  if (provider === "github") {
    // Exchange code for GitHub access token
    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      throw new Error("GitHub token exchange failed");
    }

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile
    const profileRes = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Smart-DDoS-Shield-OAuth",
      },
    });

    if (!profileRes.ok) {
      throw new Error("Failed to retrieve GitHub user profile");
    }

    const profileData = await profileRes.json();
    let email = profileData.email;

    // If primary email is private, fetch from emails endpoint
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Smart-DDoS-Shield-OAuth",
        },
      });

      if (emailsRes.ok) {
        const emailsData: { email: string; primary: boolean; verified: boolean }[] =
          await emailsRes.json();
        const primary = emailsData.find((e) => e.primary && e.verified) || emailsData[0];
        if (primary) email = primary.email;
      }
    }

    if (!email) {
      throw new Error("Could not retrieve a verified email address from GitHub account.");
    }

    return {
      provider: "github",
      providerUserId: String(profileData.id),
      email,
      name: profileData.name || profileData.login,
      avatarUrl: profileData.avatar_url,
    };
  }

  throw new Error(`Unsupported OAuth provider: ${provider}`);
}
