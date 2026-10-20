import { z } from "zod";
import {
  TelemetryBatchPayload,
  TelemetryEventItem,
  TelemetryPoint,
  CollectorStatus,
} from "../types";
import { DetectionEngine } from "../detection/detection-engine";

export const TelemetryEventSchema = z.object({
  timestamp: z.string().datetime(),
  assetId: z.string().min(1, "assetId is required"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]),
  route: z.string().min(1).max(255).regex(/^\//, "Route must start with /"),
  status: z.number().int().min(100).max(599),
  latencyMs: z.number().min(0).max(60000),
  count: z.number().int().min(1).max(1000000),
  clientIdentifier: z.string().max(128).optional(),
});

export const TelemetryBatchSchema = z.object({
  batchId: z.string().min(8, "batchId must be at least 8 characters"),
  collectorId: z.string().min(3, "collectorId is required"),
  timestamp: z.string().datetime(),
  events: z.array(TelemetryEventSchema).min(1).max(1000),
});

export interface AggregatedAssetTraffic {
  assetId: string;
  totalRequests: number;
  totalBlocked: number;
  totalClean: number;
  avgLatencyMs: number;
  errorRate: number;
  statusDistribution: {
    "2xx": number;
    "3xx": number;
    "4xx": number;
    "5xx": number;
  };
  endpointVolumes: Record<string, number>;
  lastReportedAt: string;
  history: TelemetryPoint[];
}

export interface CollectorRecordInternal {
  id: string;
  name: string;
  organizationId: string;
  apiKey: string;
  region: string;
  ipAddress?: string;
  version: string;
  status: CollectorStatus;
  lastHeartbeat: string;
  isRevoked: boolean;
}

// In-memory persistent stores for telemetry, collectors, and idempotency cache
const processedBatches = new Map<string, number>(); // batchId -> timestamp
const collectorCredentials = new Map<string, CollectorRecordInternal>([
  [
    "sds_col_key_use1_prod",
    {
      id: "col_us_east_1",
      name: "US-East Edge Shield-01",
      organizationId: "org_shield_cyber_01",
      apiKey: "sds_col_key_use1_prod",
      region: "us-east-1",
      ipAddress: "198.51.100.12",
      version: "2.4.1",
      status: "HEALTHY",
      lastHeartbeat: new Date().toISOString(),
      isRevoked: false,
    },
  ],
  [
    "sds_col_key_local_daemon",
    {
      id: "col_local_test_daemon",
      name: "Local eBPF Proxy Daemon",
      organizationId: "org_shield_cyber_01",
      apiKey: "sds_col_key_local_daemon",
      region: "local-node",
      ipAddress: "127.0.0.1",
      version: "2.4.1",
      status: "HEALTHY",
      lastHeartbeat: new Date().toISOString(),
      isRevoked: false,
    },
  ],
]);

const assetTrafficStore = new Map<string, AggregatedAssetTraffic>();

export const IngestionService = {
  // Validate collector credentials
  authenticateCollector(rawKey: string): CollectorRecordInternal | null {
    if (!rawKey) return null;
    const cleanKey = rawKey.replace(/^Bearer\s+/i, "").trim();
    const collector = collectorCredentials.get(cleanKey);
    if (!collector || collector.isRevoked) {
      return null;
    }
    return collector;
  },

  // Enroll new collector
  enrollCollector(data: {
    name: string;
    organizationId: string;
    region: string;
    ipAddress?: string;
    version?: string;
  }): { collector: CollectorRecordInternal; apiKey: string } {
    const rawId = "col_" + Math.random().toString(36).substring(2, 9);
    const apiKey = "sds_col_key_" + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

    const newCollector: CollectorRecordInternal = {
      id: rawId,
      name: data.name,
      organizationId: data.organizationId,
      apiKey,
      region: data.region,
      ipAddress: data.ipAddress || "127.0.0.1",
      version: data.version || "2.4.1",
      status: "HEALTHY",
      lastHeartbeat: new Date().toISOString(),
      isRevoked: false,
    };

    collectorCredentials.set(apiKey, newCollector);
    return { collector: newCollector, apiKey };
  },

  // Revoke collector
  revokeCollector(idOrKey: string): boolean {
    for (const [key, c] of collectorCredentials.entries()) {
      if (c.id === idOrKey || c.apiKey === idOrKey) {
        c.isRevoked = true;
        c.status = "OFFLINE";
        return true;
      }
    }
    return false;
  },

  listCollectors(): CollectorRecordInternal[] {
    return Array.from(collectorCredentials.values());
  },

  // Main Ingestion Workflow
  async ingestBatch(
    collector: CollectorRecordInternal,
    rawPayload: unknown
  ): Promise<{
    success: boolean;
    batchId: string;
    processedEvents: number;
    anomaliesDetected: number;
    duplicate: boolean;
  }> {
    // 1. Schema Validation
    const validated = TelemetryBatchSchema.parse(rawPayload);

    // 2. Idempotency & Duplicate Detection
    if (processedBatches.has(validated.batchId)) {
      return {
        success: true,
        batchId: validated.batchId,
        processedEvents: 0,
        anomaliesDetected: 0,
        duplicate: true,
      };
    }

    // 3. Timestamp Skew Check (Max 10 minutes skew)
    const batchTime = new Date(validated.timestamp).getTime();
    const now = Date.now();
    const maxSkewMs = 10 * 60 * 1000;
    if (Math.abs(now - batchTime) > maxSkewMs) {
      throw new Error(`Batch timestamp is outside acceptable clock skew window (max 10 minutes)`);
    }

    // 4. Update collector heartbeat
    collector.lastHeartbeat = new Date().toISOString();
    collector.status = "HEALTHY";

    // 5. Aggregate metrics by asset
    let totalAnomalies = 0;
    for (const event of validated.events) {
      this.aggregateEvent(event);
      // Run detection evaluation on event
      const anomalies = DetectionEngine.evaluateEvent(event);
      totalAnomalies += anomalies.length;
    }

    // Cache batchId
    processedBatches.set(validated.batchId, now);

    return {
      success: true,
      batchId: validated.batchId,
      processedEvents: validated.events.length,
      anomaliesDetected: totalAnomalies,
      duplicate: false,
    };
  },

  aggregateEvent(event: TelemetryEventItem) {
    let agg = assetTrafficStore.get(event.assetId);
    if (!agg) {
      agg = {
        assetId: event.assetId,
        totalRequests: 0,
        totalBlocked: 0,
        totalClean: 0,
        avgLatencyMs: event.latencyMs,
        errorRate: 0,
        statusDistribution: { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 },
        endpointVolumes: {},
        lastReportedAt: event.timestamp,
        history: [],
      };
      assetTrafficStore.set(event.assetId, agg);
    }

    const isBlocked = event.status === 429 || event.status === 403;
    const isError = event.status >= 400;

    agg.totalRequests += event.count;
    if (isBlocked) {
      agg.totalBlocked += event.count;
    } else {
      agg.totalClean += event.count;
    }

    // Status distribution
    if (event.status >= 200 && event.status < 300) agg.statusDistribution["2xx"] += event.count;
    else if (event.status >= 300 && event.status < 400) agg.statusDistribution["3xx"] += event.count;
    else if (event.status >= 400 && event.status < 500) agg.statusDistribution["4xx"] += event.count;
    else if (event.status >= 500) agg.statusDistribution["5xx"] += event.count;

    // Endpoint volumes
    agg.endpointVolumes[event.route] = (agg.endpointVolumes[event.route] || 0) + event.count;

    // Running latency calculation
    agg.avgLatencyMs = Math.round((agg.avgLatencyMs * 0.8) + (event.latencyMs * 0.2));
    agg.errorRate = parseFloat((( (agg.statusDistribution["4xx"] + agg.statusDistribution["5xx"]) / agg.totalRequests ) * 100).toFixed(1));
    agg.lastReportedAt = event.timestamp;

    // Time series entry
    const timeLabel = new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const lastPoint = agg.history[agg.history.length - 1];
    if (lastPoint && lastPoint.timestamp === timeLabel) {
      lastPoint.totalRps += event.count;
      if (isBlocked) lastPoint.blockedRps += event.count;
      else lastPoint.cleanRps += event.count;
    } else {
      agg.history.push({
        timestamp: timeLabel,
        totalRps: event.count,
        cleanRps: isBlocked ? 0 : event.count,
        blockedRps: isBlocked ? event.count : 0,
        synRps: 0,
        udpRps: 0,
        httpRps: event.count,
      });
      if (agg.history.length > 30) {
        agg.history.shift();
      }
    }
  },

  getAssetTraffic(assetId: string): AggregatedAssetTraffic | null {
    return assetTrafficStore.get(assetId) || null;
  },

  getAllRealTraffic(): Map<string, AggregatedAssetTraffic> {
    return assetTrafficStore;
  },
};
