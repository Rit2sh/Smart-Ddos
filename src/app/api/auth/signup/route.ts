import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";
import { z } from "zod";

const signupSchema = z.object({
  organizationName: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = signupSchema.parse(body);

    const slug = validated.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const sessionPayload = {
      userId: "usr_" + Math.random().toString(36).substring(2, 9),
      email: validated.email,
      name: validated.name,
      organizationId: "org_" + Math.random().toString(36).substring(2, 9),
      organizationName: validated.organizationName,
      organizationSlug: slug,
      role: "OWNER" as const,
      isPlatformAdmin: false,
    };

    const token = await createSessionToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message: "Organization provisioned successfully",
      user: sessionPayload,
    });

    response.cookies.set({
      name: "smart_ddos_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to provision tenant" }, { status: 500 });
  }
}
