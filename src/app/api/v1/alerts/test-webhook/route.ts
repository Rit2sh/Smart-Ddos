import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { WebhookDispatcher, WebhookPayload } from "@/lib/alerts/webhook-dispatcher";
import { DataService } from "@/lib/data-service";
import { z } from "zod";

const testWebhookSchema = z.object({
  destinationUrl: z.string().url("Must be a valid HTTP(S) URL"),
  secret: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { destinationUrl, secret } = testWebhookSchema.parse(body);

    const testPayload: WebhookPayload = {
      eventId: "evt_test_" + Math.random().toString(36).substring(2, 9),
      eventType: "HEALTH_ALERT",
      timestamp: new Date().toISOString(),
      organizationId: session.organizationId,
      severity: "LOW",
      title: "Test Webhook Dispatch from Smart DDoS Shield",
      summary: "This is a synthetic test dispatch verifying webhook endpoint reachability, SSRF protection filters, and HMAC-SHA256 signature verification.",
      assetDomain: "shield-enterprise.io",
      metricSnapshot: {
        peakRps: 150,
        volumeGb: 0.1,
        attackVector: "SYNTHETIC_TEST_PROBE",
      },
    };

    const delivery = await WebhookDispatcher.dispatch(
      destinationUrl,
      testPayload,
      secret || "test-shield-signing-secret"
    );

    // Record audit log
    await DataService.recordAuditLog({
      action: "WEBHOOK_TEST_DISPATCHED",
      userEmail: session.email,
      resourceType: "Integration",
      resourceId: destinationUrl,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      details: `Dispatched test webhook to ${destinationUrl}. Success: ${delivery.success}. Latency: ${delivery.latencyMs}ms. ${delivery.error ? `Error: ${delivery.error}` : ""}`,
    });

    return NextResponse.json({ success: delivery.success, delivery });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to dispatch test webhook" },
      { status: 400 }
    );
  }
}
