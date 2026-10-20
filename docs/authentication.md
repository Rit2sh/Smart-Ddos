# Smart DDoS Shield — Authentication & OAuth 2.0 / OIDC Architecture

## 1. Supported Authentication Methods
1. **Google OAuth 2.0 / OpenID Connect**:
   - Flow: Authorization Code Flow with CSRF state protection.
   - Authorization URL: `https://accounts.google.com/o/oauth2/v2/auth`
   - Token URL: `https://oauth2.googleapis.com/token`
   - UserInfo Endpoint: `https://openidconnect.googleapis.com/v1/userinfo`
   - Requested Scopes: `openid email profile`

2. **GitHub OAuth 2.0**:
   - Flow: Authorization Code Flow with CSRF state protection.
   - Authorization URL: `https://github.com/login/oauth/authorize`
   - Token URL: `https://github.com/login/oauth/access_token`
   - User Profile Endpoint: `https://api.github.com/user`
   - User Emails Endpoint: `https://api.github.com/user/emails`
   - Requested Scopes: `read:user user:email`

3. **Email & Password**:
   - Encrypted with `bcrypt` (10 salt rounds).
   - Validation via Zod schema (`email` + `min(6)` password).

---

## 2. CSRF & State Protection
- When an OAuth flow starts at `/api/auth/oauth/[provider]`, the server generates a cryptographically secure 64-character random hex token (`crypto.randomBytes(32).toString('hex')`).
- The state is stored in a secure, HTTP-only cookie: `smart_ddos_oauth_state` with `SameSite=Lax`, `maxAge=600s` (10 minutes).
- Upon callback at `/api/auth/oauth/callback`, the incoming `state` parameter is strictly compared against the cookie. Any mismatch triggers an immediate HTTP 403 / redirect with an explicit security warning.
- The state cookie is purged immediately after code verification.

---

## 3. Session Management & Security
- Sessions are tokenized using JSON Web Tokens (JWT) signed with HS256 (`jose` library) using `JWT_SECRET`.
- Stored in an `httpOnly`, `SameSite=Lax` cookie named `smart_ddos_session`.
- Session expiration is set to 24 hours.
- Session payloads include:
  - `userId`: Persistent user identifier.
  - `email`: Verified email from provider.
  - `name`: User's full name.
  - `organizationId`: Multi-tenant workspace identifier.
  - `role`: Role-based access control (`OWNER`, `SECURITY_ADMIN`, `ANALYST`, `VIEWER`).

---

## 4. Environment Variables Configuration
To enable OAuth in production or staging, configure these variables in `.env`:

```env
# Base Application URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Google OAuth 2.0
# Obtain from Google Cloud Console > APIs & Services > Credentials
# Authorized Redirect URI: https://yourdomain.com/api/auth/oauth/callback?provider=google
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret-here"

# GitHub OAuth App
# Obtain from GitHub Settings > Developer Settings > OAuth Apps
# Authorization Callback URL: https://yourdomain.com/api/auth/oauth/callback?provider=github
GITHUB_CLIENT_ID="gh-client-id-here"
GITHUB_CLIENT_SECRET="gh-client-secret-here"
```

If these variables are omitted in local development, the application displays a helpful banner explaining how to configure them, while keeping email/password and demonstration logins fully accessible.
