import { NextRequest, NextResponse } from "next/server";
import { IngestionService } from "@/lib/telemetry/ingestion-service";
import { DataService } from "@/lib/data-service";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Collector Credential
    const authHeader = req.headers.get("authorization") || req.headers.get("x-collector-key");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized: Missing collector credentials (Authorization or X-Collector-Key header required)" },
        { status: 401 }
      );
    }

    const collector = IngestionService.authenticateCollector(authHeader);
    if (!collector) {
      return NextResponse.json(
        { error: "Forbidden: Invalid or revoked collector credential" },
        { status: 403 }
      );
    }

    // 2. Parse Body & Size Limit
    const body = await req.json();

    // 3. Asset Authorization Check: verify all referenced assets belong to collector's org & are verified
    if (body.events && Array.isArray(body.events)) {
      for (const event of body.events) {
        if (event.assetId) {
          const asset = await DataService.getAssetById(event.assetId);
          if (!asset) {
            return NextResponse.json(
              { error: `Unauthorized asset: Asset ${event.assetId} is not registered in this perimeter.` },
              { status: 403 }
            );
          }
          if (asset.status === "UNVERIFIED" && asset.verification?.status !== "VERIFIED") {
            return NextResponse.json(
              { error: `Unauthorized asset: Asset ${event.assetId} (${asset.domain}) is unverified. Telemetry rejected.` },
              { status: 403 }
            );
          }
        }
      }
    }

    // 4. Ingest Batch
    const result = await IngestionService.ingestBatch(collector, body);

    return NextResponse.json({
      success: true,
      batchId: result.batchId,
      collectorId: collector.id,
      processedEvents: result.processedEvents,
      anomaliesDetected: result.anomaliesDetected,
      duplicate: result.duplicate,
      ingestedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Payload validation failed", details: error.issues },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
