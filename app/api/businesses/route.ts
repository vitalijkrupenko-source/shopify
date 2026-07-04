import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : null;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const name = str(body.name);
  const city = str(body.city);
  if (!name || !city) {
    return NextResponse.json({ error: "Name and city are required" }, { status: 400 });
  }

  const competitorReviewCount =
    body.competitorReviewCount === null || body.competitorReviewCount === undefined || body.competitorReviewCount === ""
      ? null
      : Number(body.competitorReviewCount);

  try {
    const business = await prisma.business.create({
      data: {
        name,
        city,
        googlePlaceId: str(body.googlePlaceId),
        phone: str(body.phone),
        email: str(body.email),
        website: str(body.website),
        notes: typeof body.notes === "string" ? body.notes : "",
        competitorName: str(body.competitorName),
        competitorReviewCount: Number.isFinite(competitorReviewCount!)
          ? Math.round(competitorReviewCount!)
          : null,
      },
    });
    return NextResponse.json(business, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Create failed";
    const status = msg.includes("Unique constraint") ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "A business with this Google Place ID already exists" : msg },
      { status }
    );
  }
}
