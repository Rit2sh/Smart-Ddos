import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { z } from "zod";

const updateIncidentSchema = z.object({
  status: z.enum([
    "OPEN",
    "ACTIVE",
    "INVESTIGATING",
    "MITIGATING",
    "MONITORING",
    "RESOLVED",
    "FALSE_POSITIVE",
    "REOPENED",
  ]),
  resolutionReason: z.string().optional(),
  mitigationNote: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!hasPermission(session.role, "canTriggerMitigation")) {
      return NextResponse.json({ error: "Forbidden: Operator cannot triage incidents" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const validated = updateIncidentSchema.parse(body);

    const updated = await DataService.updateIncidentStatus(id, validated.status, {
      resolutionReason: validated.resolutionReason,
      mitigationNote: validated.mitigationNote,
      operator: session.email,
    });

    if (!updated) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Incident ${id} updated to ${validated.status}`,
      incident: updated,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
