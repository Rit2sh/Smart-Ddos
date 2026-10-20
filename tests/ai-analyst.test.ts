import { describe, it, expect } from "vitest";
import { AIIncidentAnalyst } from "../src/lib/ai/incident-analyst";
import { IncidentRecord } from "../src/lib/data-service";

describe("AI SecOps Incident Analyst", () => {
  const sampleIncident: IncidentRecord = {
    id: "inc_test_999",
    title: "Layer 7 HTTP Flood on /api/v1/checkout",
    description: "Anomalous ingress spike targeting sensitive payment route",
    assetId: "ast_prod_api_01",
    assetDomain: "api.shield-enterprise.io",
    severity: "CRITICAL",
    status: "ACTIVE",
    attackVector: "L7 HTTP Flood",
    peakRps: 185000,
    totalVolumeGb: 480.5,
    startedAt: "2026-10-21T00:00:00Z",
    mitigationSummary: "Automated edge filters and rate-limiting mitigated ingress.",
    topSourceCountries: ["RU", "CN", "BR"],
    evidenceCount: 12,
    evidences: [
      {
        id: "ev_999",
        timestamp: "2026-10-21T00:01:00Z",
        evidenceType: "Volumetric Rate Spike",
        summary: "Ingress exceeded normal baseline of 150 RPS by >1200x",
      },
    ],
  };

  it("should provide deterministic fallback analysis when no external AI keys are configured", async () => {
    // Delete any AI keys for test
    const origKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.AI_PROVIDER_API_KEY;

    const analysis = await AIIncidentAnalyst.analyze(sampleIncident);

    expect(analysis.incidentId).toBe("inc_test_999");
    expect(analysis.provider).toBe("DETERMINISTIC_SECOPS_ENGINE");
    expect(analysis.isAIAvailable).toBe(false);
    expect(analysis.plainLanguageSummary).toContain("api.shield-enterprise.io");
    expect(analysis.plainLanguageSummary).toContain("185,000 RPS");

    // Restore key if existed
    if (origKey) process.env.GEMINI_API_KEY = origKey;
  });

  it("should strictly distinguish measured facts from hypotheses", async () => {
    const analysis = AIIncidentAnalyst.generateDeterministicAnalysis(sampleIncident);

    expect(analysis.measuredFacts.length).toBeGreaterThanOrEqual(4);
    expect(analysis.hypotheses.length).toBeGreaterThanOrEqual(2);

    // Measured facts must cite actual numbers
    const factText = analysis.measuredFacts.join(" ");
    expect(factText).toContain("185,000");
    expect(factText).toContain("480.5 GB");
    expect(factText).toContain("api.shield-enterprise.io");

    // Hypotheses must explicitly use probabilistic language
    const hypoText = analysis.hypotheses.join(" ");
    expect(hypoText).toMatch(/probability|likely|indicates/i);
  });

  it("should provide a safe, bounded defensive mitigation suggestion without direct execution", () => {
    const analysis = AIIncidentAnalyst.generateDeterministicAnalysis(sampleIncident);

    expect(analysis.suggestedMitigation).toBeDefined();
    expect(analysis.suggestedMitigation.actionType).toBe("RATE_LIMIT");
    expect(analysis.suggestedMitigation.recommendedRateLimit).toBe(500);
    expect(analysis.suggestedMitigation.recommendedRoute).toBe("/api/v1/checkout");
    expect(analysis.suggestedMitigation.rationale).toBeDefined();
    expect(analysis.suggestedMitigation.impactEstimate).toBeDefined();
  });

  it("should draft an incident post-mortem with executive overview and timeline", () => {
    const analysis = AIIncidentAnalyst.generateDeterministicAnalysis(sampleIncident);

    expect(analysis.postIncidentReportDraft).toContain("Post-Incident Executive Summary");
    expect(analysis.postIncidentReportDraft).toContain("Timeline");
    expect(analysis.postIncidentReportDraft).toContain("Preventative Actions");
  });
});
