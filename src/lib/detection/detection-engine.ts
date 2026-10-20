import {
  DetectionRecord,
  IncidentSeverity,
  MitigationActionType,
  TelemetryEventItem,
} from "../types";
import { DataService } from "../data-service";

interface RuleConfig {
  id: string;
  name: string;
  category: string;
  threshold: number;
  severity: IncidentSeverity;
  suggestedAction: MitigationActionType;
}

const DEFAULT_DETECTION_RULES: RuleConfig[] = [
  {
    id: "rule_rate_spike",
    name: "Volumetric Rate Spike Anomaly",
    category: "RATE_SPIKE",
    threshold: 500, // requests in single event window
    severity: "HIGH",
    suggestedAction: "RATE_LIMIT",
  },
  {
    id: "rule_error_burst",
    name: "High-Rate HTTP 4xx/5xx Failure Anomaly",
    category: "ERROR_RATE_SPIKE",
    threshold: 40, // 40% error rate
    severity: "HIGH",
    suggestedAction: "CHALLENGE_CAPTCHA",
  },
  {
    id: "rule_endpoint_concentration",
    name: "Targeted Endpoint Saturation Anomaly",
    category: "ENDPOINT_CONCENTRATION",
    threshold: 400, // single route count
    severity: "CRITICAL",
    suggestedAction: "RATE_LIMIT",
  },
  {
    id: "rule_client_frequency",
    name: "Excessive Single-Client Burst Frequency",
    category: "CLIENT_FREQUENCY_ANOMALY",
    threshold: 250, // requests from single clientIdentifier
    severity: "HIGH",
    suggestedAction: "BLOCK_IP",
  },
  {
    id: "rule_latency_surge",
    name: "Severe Response Latency Degradation",
    category: "LATENCY_ANOMALY",
    threshold: 2500, // ms
    severity: "MEDIUM",
    suggestedAction: "RATE_LIMIT",
  },
];

// Tracking history and cooldowns
const cooldowns = new Map<string, number>(); // `${assetId}:${ruleId}` -> timestamp
const detectionHistory: DetectionRecord[] = [];
const rollingAssetCounters = new Map<string, { count: number; errorCount: number; lastPoint: number }>();

export const DetectionEngine = {
  getRules(): RuleConfig[] {
    return DEFAULT_DETECTION_RULES;
  },

  getDetectionHistory(): DetectionRecord[] {
    return [...detectionHistory];
  },

  evaluateEvent(event: TelemetryEventItem): DetectionRecord[] {
    const now = Date.now();
    const anomalies: DetectionRecord[] = [];

    // Update rolling counters
    const counter = rollingAssetCounters.get(event.assetId) || { count: 0, errorCount: 0, lastPoint: now };
    counter.count += event.count;
    if (event.status >= 400) {
      counter.errorCount += event.count;
    }
    rollingAssetCounters.set(event.assetId, counter);

    // Minimum observation threshold: do not flag anomalies until at least 30 requests observed
    if (counter.count < 30) {
      return [];
    }

    // 1. Rate Spike Check
    const rateRule = DEFAULT_DETECTION_RULES.find((r) => r.category === "RATE_SPIKE")!;
    if (event.count >= rateRule.threshold) {
      const cooldownKey = `${event.assetId}:${rateRule.id}`;
      const lastCooldown = cooldowns.get(cooldownKey) || 0;
      if (now - lastCooldown > 2 * 60 * 1000) { // 2 minute cooldown
        cooldowns.set(cooldownKey, now);
        const record = this.createDetectionRecord({
          event,
          rule: rateRule,
          observedValue: event.count,
          baselineValue: 120,
          evidence: `Sudden traffic surge of ${event.count} requests observed on route ${event.route} exceeding threshold (${rateRule.threshold}).`,
          isConfirmedIncident: event.count >= rateRule.threshold * 2,
        });
        anomalies.push(record);
      }
    }

    // 2. High Error Rate Check
    const errorRule = DEFAULT_DETECTION_RULES.find((r) => r.category === "ERROR_RATE_SPIKE")!;
    const errorPct = (counter.errorCount / counter.count) * 100;
    if (errorPct >= errorRule.threshold && event.status >= 400) {
      const cooldownKey = `${event.assetId}:${errorRule.id}`;
      const lastCooldown = cooldowns.get(cooldownKey) || 0;
      if (now - lastCooldown > 3 * 60 * 1000) {
        cooldowns.set(cooldownKey, now);
        const record = this.createDetectionRecord({
          event,
          rule: errorRule,
          observedValue: parseFloat(errorPct.toFixed(1)),
          baselineValue: 2.1,
          evidence: `HTTP failure rate elevated to ${errorPct.toFixed(1)}% (${counter.errorCount}/${counter.count} requests errored with status >= 400).`,
          isConfirmedIncident: errorPct >= 60,
        });
        anomalies.push(record);
      }
    }

    // 3. Single Endpoint Saturation Check
    const epRule = DEFAULT_DETECTION_RULES.find((r) => r.category === "ENDPOINT_CONCENTRATION")!;
    if (event.count >= epRule.threshold && (event.route.includes("checkout") || event.route.includes("login") || event.route.includes("api"))) {
      const cooldownKey = `${event.assetId}:${epRule.id}:${event.route}`;
      const lastCooldown = cooldowns.get(cooldownKey) || 0;
      if (now - lastCooldown > 2 * 60 * 1000) {
        cooldowns.set(cooldownKey, now);
        const record = this.createDetectionRecord({
          event,
          rule: epRule,
          observedValue: event.count,
          baselineValue: 80,
          evidence: `High endpoint concentration on sensitive route ${event.route}: ${event.count} requests concentrated on single path.`,
          isConfirmedIncident: true,
        });
        anomalies.push(record);
      }
    }

    // 4. Excessive Client Burst Frequency
    const clientRule = DEFAULT_DETECTION_RULES.find((r) => r.category === "CLIENT_FREQUENCY_ANOMALY")!;
    if (event.clientIdentifier && event.count >= clientRule.threshold) {
      const cooldownKey = `${event.assetId}:${clientRule.id}:${event.clientIdentifier}`;
      const lastCooldown = cooldowns.get(cooldownKey) || 0;
      if (now - lastCooldown > 3 * 60 * 1000) {
        cooldowns.set(cooldownKey, now);
        const record = this.createDetectionRecord({
          event,
          rule: clientRule,
          observedValue: event.count,
          baselineValue: 15,
          evidence: `Client signature ${event.clientIdentifier.substring(0, 16)}... exceeded burst frequency with ${event.count} requests/window.`,
          isConfirmedIncident: true,
        });
        anomalies.push(record);
      }
    }

    // 5. Latency Degradation Check
    const latencyRule = DEFAULT_DETECTION_RULES.find((r) => r.category === "LATENCY_ANOMALY")!;
    if (event.latencyMs >= latencyRule.threshold) {
      const cooldownKey = `${event.assetId}:${latencyRule.id}`;
      const lastCooldown = cooldowns.get(cooldownKey) || 0;
      if (now - lastCooldown > 5 * 60 * 1000) {
        cooldowns.set(cooldownKey, now);
        const record = this.createDetectionRecord({
          event,
          rule: latencyRule,
          observedValue: event.latencyMs,
          baselineValue: 180,
          evidence: `Average response latency degraded to ${event.latencyMs}ms (baseline 180ms) during traffic influx.`,
          isConfirmedIncident: false,
        });
        anomalies.push(record);
      }
    }

    return anomalies;
  },

  createDetectionRecord(params: {
    event: TelemetryEventItem;
    rule: RuleConfig;
    observedValue: number;
    baselineValue: number;
    evidence: string;
    isConfirmedIncident: boolean;
  }): DetectionRecord {
    const isEscalated = params.observedValue >= params.rule.threshold * 2;
    const severity: IncidentSeverity = isEscalated ? "CRITICAL" : params.rule.severity;

    const record: DetectionRecord = {
      id: "det_" + Math.random().toString(36).substring(2, 9),
      assetId: params.event.assetId,
      assetDomain: params.event.assetId, // fallback
      timestamp: new Date().toISOString(),
      ruleId: params.rule.id,
      ruleCategory: params.rule.category,
      observedValue: params.observedValue,
      baselineValue: params.baselineValue,
      thresholdValue: params.rule.threshold,
      severity,
      evidence: params.evidence,
      suggestedResponse: params.rule.suggestedAction,
      isConfirmedIncident: params.isConfirmedIncident,
    };

    detectionHistory.unshift(record);
    if (detectionHistory.length > 100) {
      detectionHistory.pop();
    }

    // If confirmed incident, automatically register / update an incident in DataService
    if (params.isConfirmedIncident) {
      this.promoteToIncident(record, params.event);
    }

    return record;
  },

  promoteToIncident(record: DetectionRecord, event: TelemetryEventItem) {
    const title = `${record.ruleCategory.replace(/_/g, " ")} on ${event.route}`;
    DataService.createIncidentFromDetection({
      title,
      description: record.evidence,
      assetId: record.assetId,
      severity: record.severity,
      attackVector: record.ruleCategory,
      peakRps: record.observedValue * 10,
      evidenceSummary: record.evidence,
    });
  },
};
