import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  const result = await fetchGitHubStats();
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 503 });
  }
  return NextResponse.json({ ok: true, data: result.data });
}
