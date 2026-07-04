import { NextRequest, NextResponse } from "next/server";
import type { ActivityType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TYPES: ActivityType[] = ["EMAIL_SENT", "REPLY_RECEIVED", "CALL", "NOTE", "STAGE_CHANGE"];

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    businessId?: string;
    type?: ActivityType;
    content?: string;
  } | null;

  if (!body?.businessId || !body.type || !TYPES.includes(body.type)) {
    return NextResponse.json({ error: "businessId and a valid type are required" }, { status: 400 });
  }
  const business = await prisma.business.findUnique({ where: { id: body.businessId } });
  if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

  const activity = await prisma.activity.create({
    data: {
      businessId: body.businessId,
      type: body.type,
      content: (body.content ?? "").trim(),
    },
  });
  return NextResponse.json(activity, { status: 201 });
}
