import { NextRequest, NextResponse } from "next/server";
import { IngestionService } from "@/lib/telemetry/ingestion-service";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!hasPermission(session.role, "canManageIntegrations") && session.role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const { id } = params;
    const revoked = IngestionService.revokeCollector(id);
    if (!revoked) {
      return NextResponse.json({ error: "Collector not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Collector ${id} credential revoked. All incoming telemetry from this node will be rejected.`,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
