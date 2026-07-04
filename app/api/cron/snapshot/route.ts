import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchPlaceDetails } from "@/lib/places";
import { todayUtc } from "@/lib/growth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Daily snapshot for every business with a Google Place ID.
// Vercel Cron calls this with "Authorization: Bearer <CRON_SECRET>".
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const businesses = await prisma.business.findMany({
    where: { googlePlaceId: { not: null } },
    select: { id: true, name: true, googlePlaceId: true },
  });

  const date = todayUtc();
  let ok = 0;
  const failed: string[] = [];

  for (const b of businesses) {
    try {
      const details = await fetchPlaceDetails(b.googlePlaceId!);
      if (details.userRatingCount === null) {
        failed.push(`${b.name}: no review data returned`);
        continue;
      }
      await prisma.snapshot.upsert({
        where: { businessId_date: { businessId: b.id, date } },
        create: {
          businessId: b.id,
          date,
          rating: details.rating ?? 0,
          reviewCount: details.userRatingCount,
        },
        update: {
          rating: details.rating ?? 0,
          reviewCount: details.userRatingCount,
        },
      });
      ok++;
    } catch (e) {
      failed.push(`${b.name}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }

  return NextResponse.json({
    date: date.toISOString().slice(0, 10),
    tracked: businesses.length,
    snapshotted: ok,
    failed,
  });
}
