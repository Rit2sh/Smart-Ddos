import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { DataService } from "@/lib/data-service";
import crypto from "crypto";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Require OWNER or SECURITY_ADMIN role for data export
    if (!hasPermission(session.role, "canModifyPolicies")) {
      return NextResponse.json(
        { error: "Forbidden: Exporting organization security telemetry requires Security Admin or Owner privileges." },
        { status: 403 }
      );
    }

    const assets = await DataService.getAssets();
    const incidents = await DataService.getIncidents();
    const collectors = await DataService.getCollectors();
    const policies = await DataService.getMitigationPolicies();
    const auditLogs = await DataService.getAuditLogs();

    // Data minimization and privacy-preserving redaction:
    // 1. Scrub verification tokens from assets
    const sanitizedAssets = assets.map((a) => ({
      id: a.id,
      name: a.name,
      domain: a.domain,
      assetType: a.assetType,
      status: a.status,
      protectionEnabled: a.protectionEnabled,
      createdAt: a.createdAt,
      verificationMethod: a.verification?.method,
      verificationStatus: a.verification?.status,
    }));

    // 2. Pseudonymize source IPs in incidents (mask host bytes, e.g. 198.51.100.xxx)
    const sanitizedIncidents = incidents.map((inc) => ({
      ...inc,
      evidences: inc.evidences?.map((ev) => ({
        ...ev,
        sourceIp: ev.sourceIp
          ? ev.sourceIp.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.$2.$3.xxx")
          : undefined,
      })),
    }));

    // 3. Redact any secrets or token signatures from audit logs
    const sanitizedAuditLogs = auditLogs.map((log) => ({
      ...log,
      details: log.details.replace(/(key|token|secret|password)=([^\s&]+)/gi, "$1=[REDACTED]"),
    }));

    const exportBundle = {
      exportMetadata: {
        exportId: "exp_" + crypto.randomBytes(6).toString("hex"),
        organizationId: session.organizationId,
        organizationName: session.organizationName,
        requestedBy: session.email,
        generatedAt: new Date().toISOString(),
        privacyFramework: "GDPR Art. 20 / CCPA Data Portability Compliance",
        retentionPolicy: "30-day raw telemetry TTL / 365-day aggregated incident archive",
      },
      organization: {
        id: session.organizationId,
        name: session.organizationName,
        slug: session.organizationSlug,
      },
      assets: sanitizedAssets,
      defensivePolicies: policies,
      incidentRecords: sanitizedIncidents,
      collectorNodes: collectors.map((c) => ({
        id: c.id,
        name: c.name,
        region: c.region,
        status: c.status,
        version: c.version,
      })),
      auditTrail: sanitizedAuditLogs,
    };

    // Audit logging of export event
    await DataService.recordAuditLog({
      action: "ORGANIZATION_DATA_EXPORTED",
      userEmail: session.email,
      resourceType: "Organization",
      resourceId: session.organizationId,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      details: `Full organization telemetry and audit export bundle generated for ${session.email}`,
    });

    return new NextResponse(JSON.stringify(exportBundle, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="smart-shield-export-${session.organizationSlug}-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate organization export" },
      { status: 500 }
    );
  }
}
