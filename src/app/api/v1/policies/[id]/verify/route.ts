import { NextRequest, NextResponse } from "next/server";
import { PolicyService } from "@/lib/enforcement/policy-service";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const result = await PolicyService.verify(id);

    return NextResponse.json({
      success: result.status === "VERIFIED" || result.status === "SIMULATED",
      verification: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
