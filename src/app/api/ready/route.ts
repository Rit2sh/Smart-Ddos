import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") || crypto.randomUUID();
  const startTime = Date.now();

  // 1. Database Check
  let dbStatus = "HEALTHY";
  let dbLatencyMs = 0;
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch {
    // If Postgres is not running locally in dev, check fallback in-memory data store
    dbStatus = "DEGRADED_STORE_FALLBACK";
    dbLatencyMs = 1;
  }

  // 2. Collector Heartbeat Monitoring
  const collectors = await DataService.getCollectors();
  const healthyCollectors = collectors.filter((c) => c.status === "HEALTHY").length;
  const totalCollectors = collectors.length;
  const collectorStatus = healthyCollectors > 0 ? "HEALTHY" : "DEGRADED";

  // 3. Protected Application Health vs Control Plane Health
  const assets = await DataService.getAssets();
  const incidents = await DataService.getIncidents();
  const activeIncidents = incidents.filter(
    (i) => i.status === "ACTIVE" || i.status === "OPEN" || i.status === "MITIGATING"
  );

  const underAttackAssets = assets.filter((a) => a.status === "UNDER_ATTACK").length;
  const protectedAppsStatus =
    underAttackAssets > 0
      ? "UNDER_ATTACK"
      : activeIncidents.length > 0
      ? "ANOMALOUS_TRAFFIC"
      : "NORMAL";

  // 4. Overall Readiness
  const isReady = healthyCollectors > 0 && dbStatus !== "DOWN";

  const payload = {
    ready: isReady,
    correlationId,
    timestamp: new Date().toISOString(),
    totalLatencyMs: Date.now() - startTime,
    subsystems: {
      controlPlane: {
        status: isReady ? "HEALTHY" : "DEGRADED",
        readyForIngestion: true,
        readyForEnforcement: true,
      },
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      collectors: {
        status: collectorStatus,
        healthyCount: healthyCollectors,
        totalCount: totalCollectors,
        lastHeartbeatWindowSeconds: 60,
      },
      protectedApplications: {
        health: protectedAppsStatus,
        totalProtectedAssets: assets.length,
        assetsUnderAttack: underAttackAssets,
        activeIncidentsCount: activeIncidents.length,
        note: "Protected application attack status is strictly decoupled from control plane readiness.",
      },
    },
  };

  return NextResponse.json(payload, {
    status: isReady ? 200 : 503,
    headers: {
      "X-Correlation-ID": correlationId,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
