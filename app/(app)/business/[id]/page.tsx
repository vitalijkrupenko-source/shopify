import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeGrowth } from "@/lib/growth";
import { toDateInput, type ActivityDTO, type BusinessDTO, type SnapshotDTO } from "@/lib/types";
import { STAGE_COLORS, STAGE_LABELS } from "@/lib/stages";
import BusinessEditor from "@/components/BusinessEditor";
import ActivityTimeline from "@/components/ActivityTimeline";
import GrowthCharts from "@/components/GrowthCharts";
import FetchNowButton from "@/components/FetchNowButton";

export const dynamic = "force-dynamic";

export default async function BusinessPage({ params }: { params: { id: string } }) {
  const business = await prisma.business.findUnique({
    where: { id: params.id },
    include: {
      snapshots: { orderBy: { date: "asc" } },
      activities: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!business) notFound();

  const growth = computeGrowth(business, business.snapshots);
  const latest = business.snapshots[business.snapshots.length - 1] ?? null;

  const dto: BusinessDTO = {
    id: business.id,
    name: business.name,
    city: business.city,
    googlePlaceId: business.googlePlaceId,
    phone: business.phone,
    email: business.email,
    website: business.website,
    stage: business.stage,
    pilotStartDate: toDateInput(business.pilotStartDate),
    clientSince: toDateInput(business.clientSince),
    monthlyFee: business.monthlyFee === null ? null : Number(business.monthlyFee),
    notes: business.notes,
    competitorName: business.competitorName,
    competitorReviewCount: business.competitorReviewCount,
  };

  const snapshots: SnapshotDTO[] = business.snapshots.map((s) => ({
    date: s.date.toISOString().slice(0, 10),
    rating: s.rating,
    reviewCount: s.reviewCount,
  }));

  const activities: ActivityDTO[] = business.activities.map((a) => ({
    id: a.id,
    type: a.type,
    content: a.content,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{business.city}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span className={`h-2 w-2 rounded-full ${STAGE_COLORS[business.stage]}`} />
              {STAGE_LABELS[business.stage]}
            </span>
            {latest && (
              <span className="text-amber-600 dark:text-amber-400">
                ★ {latest.rating.toFixed(1)} · {latest.reviewCount} reviews
              </span>
            )}
            {growth && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                +{growth.delta} reviews since start
              </span>
            )}
          </div>
        </div>
        <FetchNowButton businessId={business.id} hasPlaceId={!!business.googlePlaceId} />
      </div>

      {business.competitorName && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Competitor: <span className="font-medium text-slate-700 dark:text-slate-200">{business.competitorName}</span>
          {business.competitorReviewCount !== null && <> · {business.competitorReviewCount} reviews</>}
        </p>
      )}

      <GrowthCharts
        snapshots={snapshots}
        pilotStartDate={dto.pilotStartDate}
        clientSince={dto.clientSince}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BusinessEditor business={dto} />
        <ActivityTimeline businessId={business.id} activities={activities} />
      </div>
    </div>
  );
}
