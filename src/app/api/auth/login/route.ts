import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, DEFAULT_DEMO_USER } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Demonstration authentication handler (with support for demo lead and dynamic logins)
    const sessionPayload = {
      ...DEFAULT_DEMO_USER,
      email,
      name: email.split("@")[0].toUpperCase() + " (Operator)",
    };

    const token = await createSessionToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: sessionPayload,
    });

    response.cookies.set({
      name: "smart_ddos_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
