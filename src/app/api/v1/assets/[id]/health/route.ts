import { NextRequest, NextResponse } from "next/server";
import { IngestionService } from "@/lib/telemetry/ingestion-service";
import { DataService } from "@/lib/data-service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const asset = await DataService.getAssetById(id);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const traffic = IngestionService.getAssetTraffic(id);
    const collectors = await DataService.getCollectors();

    const isStale = traffic
      ? Date.now() - new Date(traffic.lastReportedAt).getTime() > 60 * 1000
      : false;

    return NextResponse.json({
      assetId: id,
      domain: asset.domain,
      status: asset.status,
      protectionEnabled: asset.protectionEnabled,
      isVerified: asset.verification?.status === "VERIFIED",
      isStale,
      lastReportedAt: traffic?.lastReportedAt || null,
      errorRate: traffic?.errorRate || 0,
      avgLatencyMs: traffic?.avgLatencyMs || 0,
      totalCollectorsOnline: collectors.filter((c) => c.status === "HEALTHY").length,
      healthGrade: isStale ? "DEGRADED" : asset.status === "UNDER_ATTACK" ? "UNDER_ATTACK" : "OPTIMAL",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
