import { NextResponse } from "next/server";

/** Simple liveness check — example Route Handler used by monitoring. */
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
