import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { UserSession } from "./types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "smart-ddos-shield-super-secure-default-jwt-secret-key-32chars"
);
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "smart_ddos_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

export const DEFAULT_DEMO_USER: UserSession = {
  userId: "usr_demo_secops_99",
  email: "secops@shield-enterprise.io",
  name: "Marcus Vance (SecOps Lead)",
  organizationId: "org_shield_cyber_01",
  organizationName: "Shield Cyber Corp",
  organizationSlug: "shield-cyber",
  role: "OWNER",
  isPlatformAdmin: true,
};

export async function getCurrentSession(): Promise<UserSession> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) return session;
    }
  } catch {
    // Falls back gracefully
  }
  return DEFAULT_DEMO_USER;
}
