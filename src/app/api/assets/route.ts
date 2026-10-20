import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { z } from "zod";

const createAssetSchema = z.object({
  name: z.string().min(2, "Asset name must be at least 2 characters"),
  domain: z.string().min(3, "Invalid domain format"),
  assetType: z.enum(["DOMAIN", "SUBDOMAIN", "IP_PREFIX", "API_GATEWAY", "LOAD_BALANCER"]),
  originTarget: z.string().min(3, "Origin target is required"),
  verificationMethod: z.enum(["DNS_TXT", "HTTP_CHALLENGE"]),
});

const patchAssetSchema = z.object({
  id: z.string().min(1),
  protectionEnabled: z.boolean(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const asset = await DataService.getAssetById(id);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    return NextResponse.json({ asset });
  }

  const assets = await DataService.getAssets();
  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "canManageAssets")) {
      return NextResponse.json(
        { error: "Forbidden: Registering protected assets requires Security Admin or Owner permissions." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = createAssetSchema.parse(body);

    const newAsset = await DataService.createAsset(validated);

    return NextResponse.json({
      success: true,
      message: "Asset registered. Ownership verification challenge generated.",
      asset: newAsset,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "canManageAssets")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, protectionEnabled } = patchAssetSchema.parse(body);

    const updated = await DataService.updateAssetProtection(id, protectionEnabled);
    if (!updated) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, asset: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update asset" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "canManageAssets")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
    }

    const deleted = await DataService.deleteAsset(id);
    if (!deleted) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Asset removed safely." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete asset" }, { status: 500 });
  }
}
