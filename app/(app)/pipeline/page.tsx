import { prisma } from "@/lib/prisma";
import { computeGrowth, daysBetween } from "@/lib/growth";
import type { CardDTO } from "@/lib/types";
import KanbanBoard from "@/components/KanbanBoard";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const businesses = await prisma.business.findMany({
    include: {
      snapshots: { orderBy: { date: "asc" }, select: { date: true, rating: true, reviewCount: true } },
      activities: {
        where: { type: "STAGE_CHANGE" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const now = new Date();
  const cards: CardDTO[] = businesses.map((b) => {
    const latest = b.snapshots[b.snapshots.length - 1] ?? null;
    const stageSince = b.activities[0]?.createdAt ?? b.createdAt;
    const growth =
      b.stage === "PILOT" || b.stage === "CLIENT" ? computeGrowth(b, b.snapshots) : null;
    return {
      id: b.id,
      name: b.name,
      city: b.city,
      stage: b.stage,
      rating: latest?.rating ?? null,
      reviewCount: latest?.reviewCount ?? null,
      daysInStage: daysBetween(stageSince, now),
      delta: growth?.delta ?? null,
    };
  });

  return <KanbanBoard initial={cards} />;
}
