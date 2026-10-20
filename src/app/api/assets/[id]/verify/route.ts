import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Asset ID parameter is required" }, { status: 400 });
    }

    const result = await DataService.verifyAsset(id);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      asset: result.asset,
    });
  } catch {
    return NextResponse.json({ error: "Failed to verify domain ownership" }, { status: 500 });
  }
}
