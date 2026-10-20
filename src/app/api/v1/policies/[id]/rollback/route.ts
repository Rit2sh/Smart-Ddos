import { NextRequest, NextResponse } from "next/server";
import { PolicyService } from "@/lib/enforcement/policy-service";
import { getCurrentSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    const { id } = params;

    const result = await PolicyService.rollback(id, session);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      rollback: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Rollback failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
