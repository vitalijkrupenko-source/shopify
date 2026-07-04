import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchPlaceDetails } from "@/lib/places";
import { todayUtc } from "@/lib/growth";

export const dynamic = "force-dynamic";

// "Fetch now": take an immediate snapshot for one business.
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const business = await prisma.business.findUnique({ where: { id: params.id } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!business.googlePlaceId) {
    return NextResponse.json(
      { error: "This business has no Google Place ID yet" },
      { status: 400 }
    );
  }

  try {
    const details = await fetchPlaceDetails(business.googlePlaceId);
    if (details.userRatingCount === null) {
      return NextResponse.json(
        { error: "Google returned no review data for this place" },
        { status: 502 }
      );
    }
    const date = todayUtc();
    const snapshot = await prisma.snapshot.upsert({
      where: { businessId_date: { businessId: business.id, date } },
      create: {
        businessId: business.id,
        date,
        rating: details.rating ?? 0,
        reviewCount: details.userRatingCount,
      },
      update: {
        rating: details.rating ?? 0,
        reviewCount: details.userRatingCount,
      },
    });
    return NextResponse.json(snapshot);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Snapshot failed" },
      { status: 502 }
    );
  }
}
