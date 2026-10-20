import { NextRequest, NextResponse } from "next/server";
import { PolicyService } from "@/lib/enforcement/policy-service";
import { getCurrentSession } from "@/lib/auth";
import { z } from "zod";

const previewSchema = z.object({
  assetId: z.string().min(1),
  assetDomain: z.string().min(1),
  name: z.string().min(2),
  targetRoute: z.string().min(1).regex(/^\//, "Route must start with /"),
  rateLimitPerSecond: z.number().int().min(1).max(500000),
  burstLimit: z.number().int().min(1).max(100000),
  adapterType: z.enum(["LOCAL_PROXY", "CLOUDFLARE_WAF", "AWS_SHIELD", "SIMULATION"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const validated = previewSchema.parse(body);

    const preview = await PolicyService.preview(
      {
        id: "preview_tmp",
        organizationId: session.organizationId,
        assetId: validated.assetId,
        assetDomain: validated.assetDomain,
        name: validated.name,
        description: `Preview policy for ${validated.targetRoute}`,
        targetRoute: validated.targetRoute,
        rateLimitPerSecond: validated.rateLimitPerSecond,
        burstLimit: validated.burstLimit,
        timeWindowSeconds: 60,
        mode: "DRY_RUN",
        adapterType: validated.adapterType,
        status: "SIMULATED",
        createdAt: new Date().toISOString(),
      },
      session
    );

    return NextResponse.json({
      success: true,
      preview,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
