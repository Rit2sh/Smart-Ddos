import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const incident = await DataService.getIncidentById(id);
    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }
    return NextResponse.json({ incident });
  }

  const incidents = await DataService.getIncidents();
  return NextResponse.json({ incidents });
}
