import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Missing ?q=" }, { status: 400 });
  try {
    const results = await searchPlaces(q);
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Search failed" },
      { status: 502 }
    );
  }
}
