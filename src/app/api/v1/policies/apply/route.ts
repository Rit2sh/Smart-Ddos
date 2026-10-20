import { NextRequest, NextResponse } from "next/server";
import { PolicyService } from "@/lib/enforcement/policy-service";
import { getCurrentSession } from "@/lib/auth";
import { z } from "zod";

const applySchema = z.object({
  assetId: z.string().min(1),
  assetDomain: z.string().min(1),
  name: z.string().min(2),
  targetRoute: z.string().min(1).regex(/^\//, "Route must start with /"),
  rateLimitPerSecond: z.number().int().min(1).max(500000),
  burstLimit: z.number().int().min(1).max(100000),
  adapterType: z.enum(["LOCAL_PROXY", "CLOUDFLARE_WAF", "AWS_SHIELD", "SIMULATION"]),
  forceOverride: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const validated = applySchema.parse(body);

    const policy = PolicyService.createPolicy({
      organizationId: session.organizationId,
      assetId: validated.assetId,
      assetDomain: validated.assetDomain,
      name: validated.name,
      description: `Defensive rate limit policy applied to ${validated.targetRoute}`,
      targetRoute: validated.targetRoute,
      rateLimitPerSecond: validated.rateLimitPerSecond,
      burstLimit: validated.burstLimit,
      timeWindowSeconds: 60,
      mode: "ENFORCED",
      adapterType: validated.adapterType,
    });

    const result = await PolicyService.apply(policy, session, validated.forceOverride);

    return NextResponse.json({
      success: true,
      message: result.message,
      policy,
      result,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
