import { NextRequest, NextResponse } from "next/server";
import { IngestionService } from "@/lib/telemetry/ingestion-service";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { z } from "zod";

const enrollSchema = z.object({
  name: z.string().min(2),
  region: z.string().min(2),
  ipAddress: z.string().optional(),
  version: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!hasPermission(session.role, "canManageIntegrations") && session.role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges to enroll collectors" }, { status: 403 });
    }

    const body = await req.json();
    const validated = enrollSchema.parse(body);

    const { collector, apiKey } = IngestionService.enrollCollector({
      name: validated.name,
      organizationId: session.organizationId,
      region: validated.region,
      ipAddress: validated.ipAddress,
      version: validated.version,
    });

    return NextResponse.json({
      success: true,
      message: "Edge collector enrolled successfully. Store the API key safely; it cannot be retrieved again.",
      collector: {
        id: collector.id,
        name: collector.name,
        region: collector.region,
        status: collector.status,
      },
      apiKey,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
