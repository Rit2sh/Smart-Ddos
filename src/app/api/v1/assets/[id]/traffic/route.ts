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

    if (traffic) {
      return NextResponse.json({
        assetId: id,
        domain: asset.domain,
        dataSource: "LIVE_TELEMETRY",
        totalRequests: traffic.totalRequests,
        totalClean: traffic.totalClean,
        totalBlocked: traffic.totalBlocked,
        avgLatencyMs: traffic.avgLatencyMs,
        errorRate: traffic.errorRate,
        statusDistribution: traffic.statusDistribution,
        endpointVolumes: traffic.endpointVolumes,
        lastReportedAt: traffic.lastReportedAt,
        history: traffic.history,
      });
    }

    // Fallback: If no real batches ingested yet, return structured empty/fixture summary clearly labeled
    const defaultHistory = await DataService.getTrafficHistory(15);
    return NextResponse.json({
      assetId: id,
      domain: asset.domain,
      dataSource: "SIMULATION",
      totalRequests: 42300,
      totalClean: 41000,
      totalBlocked: 1300,
      avgLatencyMs: 38,
      errorRate: 0.8,
      statusDistribution: { "2xx": 40500, "3xx": 500, "4xx": 1200, "5xx": 100 },
      endpointVolumes: {
        "/api/v1/checkout": 18200,
        "/api/v1/products": 14100,
        "/login": 9000,
        "/health": 1000,
      },
      lastReportedAt: new Date().toISOString(),
      history: defaultHistory,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
