import { prisma } from "@/lib/prisma";
import { computeGrowth } from "@/lib/growth";
import ClientsTable, { type ClientRow } from "@/components/ClientsTable";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const businesses = await prisma.business.findMany({
    where: { stage: { in: ["PILOT", "CLIENT"] } },
    include: { snapshots: { orderBy: { date: "asc" } } },
    orderBy: { name: "asc" },
  });

  const cutoff = new Date(Date.now() - 90 * 86_400_000);

  const rows: ClientRow[] = businesses.map((b) => {
    const growth = computeGrowth(b, b.snapshots);
    const start = b.pilotStartDate ?? b.clientSince;
    return {
      id: b.id,
      name: b.name,
      city: b.city,
      stage: b.stage as ClientRow["stage"],
      startDate: start ? start.toISOString().slice(0, 10) : null,
      startCount: growth?.startCount ?? null,
      latestCount: growth?.latestCount ?? null,
      delta: growth?.delta ?? null,
      startRating: growth?.startRating ?? null,
      latestRating: growth?.latestRating ?? null,
      monthlyFee: b.monthlyFee === null ? null : Number(b.monthlyFee),
      spark: b.snapshots.filter((s) => s.date >= cutoff).map((s) => s.reviewCount),
    };
  });

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Client results</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pilots and clients — review growth since the start of the service.
        </p>
      </div>
      <ClientsTable rows={rows} />
    </div>
  );
}
