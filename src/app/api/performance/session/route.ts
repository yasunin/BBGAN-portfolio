import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/performance-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return NextResponse.json(
    { authenticated: isAdminAuthorized(request) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
