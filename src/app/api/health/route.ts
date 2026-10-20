import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") || crypto.randomUUID();
  const startTime = process.uptime();
  const mem = process.memoryUsage();

  const responsePayload = {
    status: "HEALTHY",
    subsystem: "CONTROL_PLANE",
    uptimeSeconds: Math.floor(startTime),
    timestamp: new Date().toISOString(),
    correlationId,
    memory: {
      rssMb: Math.round(mem.rss / 1024 / 1024),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
    },
    note: "Control plane is operating normally. Protected application health is reported independently via /api/ready.",
  };

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: {
      "X-Correlation-ID": correlationId,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
