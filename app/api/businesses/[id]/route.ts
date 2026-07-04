import { NextRequest, NextResponse } from "next/server";
import type { Prisma, Stage } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { STAGE_LABELS, STAGE_ORDER } from "@/lib/stages";

export const dynamic = "force-dynamic";

const strOrNull = (v: unknown): string | null =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : null;

function dateOrNull(v: unknown): Date | null {
  if (typeof v !== "string" || v.trim() === "") return null;
  const d = new Date(`${v.slice(0, 10)}T00:00:00.000Z`);
  return isNaN(d.getTime()) ? null : d;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const existing = await prisma.business.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Prisma.BusinessUpdateInput = {};

  for (const key of ["name", "city"] as const) {
    if (key in body) {
      const v = strOrNull(body[key]);
      if (!v) return NextResponse.json({ error: `${key} cannot be empty` }, { status: 400 });
      data[key] = v;
    }
  }
  for (const key of ["googlePlaceId", "phone", "email", "website", "competitorName"] as const) {
    if (key in body) data[key] = strOrNull(body[key]);
  }
  if ("notes" in body) data.notes = typeof body.notes === "string" ? body.notes : "";
  if ("pilotStartDate" in body) data.pilotStartDate = dateOrNull(body.pilotStartDate);
  if ("clientSince" in body) data.clientSince = dateOrNull(body.clientSince);
  if ("monthlyFee" in body) {
    const n = body.monthlyFee === null || body.monthlyFee === "" ? null : Number(body.monthlyFee);
    data.monthlyFee = n !== null && Number.isFinite(n) ? n : null;
  }
  if ("competitorReviewCount" in body) {
    const n =
      body.competitorReviewCount === null || body.competitorReviewCount === ""
        ? null
        : Number(body.competitorReviewCount);
    data.competitorReviewCount = n !== null && Number.isFinite(n) ? Math.round(n) : null;
  }

  let stageChanged = false;
  if ("stage" in body) {
    const stage = body.stage as Stage;
    if (!STAGE_ORDER.includes(stage)) {
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    }
    if (stage !== existing.stage) {
      stageChanged = true;
      data.stage = stage;
      // First move into pilot/client starts the "since start" clock automatically.
      if (stage === "PILOT" && !existing.pilotStartDate && !("pilotStartDate" in body)) {
        data.pilotStartDate = new Date();
      }
      if (stage === "CLIENT" && !existing.clientSince && !("clientSince" in body)) {
        data.clientSince = new Date();
      }
    }
  }

  try {
    const updated = await prisma.business.update({ where: { id: params.id }, data });
    if (stageChanged) {
      await prisma.activity.create({
        data: {
          businessId: params.id,
          type: "STAGE_CHANGE",
          content: `${STAGE_LABELS[existing.stage]} → ${STAGE_LABELS[updated.stage]}`,
        },
      });
    }
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Update failed";
    const status = msg.includes("Unique constraint") ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "A business with this Google Place ID already exists" : msg },
      { status }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.business.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
