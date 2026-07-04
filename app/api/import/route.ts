import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { todayUtc } from "@/lib/growth";

export const dynamic = "force-dynamic";

interface ImportRow {
  name?: string;
  city?: string;
  rating?: string | number;
  review_count?: string | number;
  competitor?: string;
  competitor_reviews?: string | number;
  phone?: string;
  email?: string;
  notes?: string;
}

const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : null;

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { rows?: ImportRow[] } | null;
  if (!body?.rows || !Array.isArray(body.rows)) {
    return NextResponse.json({ error: "Expected { rows: [...] }" }, { status: 400 });
  }

  let created = 0;
  const skipped: string[] = [];
  const date = todayUtc();

  for (const [i, row] of body.rows.entries()) {
    const name = str(row.name);
    const city = str(row.city);
    if (!name || !city) {
      skipped.push(`Row ${i + 1}: missing name or city`);
      continue;
    }
    const rating = num(row.rating);
    const reviewCount = num(row.review_count);
    const competitorReviews = num(row.competitor_reviews);

    try {
      await prisma.business.create({
        data: {
          name,
          city,
          stage: "PROSPECT",
          phone: str(row.phone),
          email: str(row.email),
          notes: str(row.notes) ?? "",
          competitorName: str(row.competitor),
          competitorReviewCount:
            competitorReviews !== null ? Math.round(competitorReviews) : null,
          snapshots:
            rating !== null && reviewCount !== null
              ? { create: [{ date, rating, reviewCount: Math.round(reviewCount) }] }
              : undefined,
        },
      });
      created++;
    } catch (e) {
      skipped.push(`Row ${i + 1} (${name}): ${e instanceof Error ? e.message.split("\n").pop() : "failed"}`);
    }
  }

  return NextResponse.json({ created, skipped });
}
