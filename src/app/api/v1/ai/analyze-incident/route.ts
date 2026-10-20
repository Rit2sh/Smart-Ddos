import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { DataService } from "@/lib/data-service";
import { AIIncidentAnalyst } from "@/lib/ai/incident-analyst";
import { z } from "zod";

const analyzeSchema = z.object({
  incidentId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { incidentId } = analyzeSchema.parse(body);

    const incident = await DataService.getIncidentById(incidentId);
    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const analysis = await AIIncidentAnalyst.analyze(incident);

    // Audit log
    await DataService.recordAuditLog({
      action: "AI_INCIDENT_ANALYSIS_GENERATED",
      userEmail: session.email,
      resourceType: "Incident",
      resourceId: incident.id,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      details: `Generated AI/Deterministic SecOps analysis report using provider: ${analysis.provider}`,
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error("[API AI Analyze Incident] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze incident" },
      { status: 500 }
    );
  }
}
