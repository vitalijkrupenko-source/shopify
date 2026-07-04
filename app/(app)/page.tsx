import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computeGrowth, daysBetween } from "@/lib/growth";

export const dynamic = "force-dynamic";

function startOfWeekUtc(): Date {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay(); // 0 = Sunday
  d.setUTCDate(d.getUTCDate() - ((day + 6) % 7)); // back to Monday
  return d;
}

export default async function DashboardPage() {
  const now = new Date();
  const staleCutoff = new Date(now.getTime() - 5 * 86_400_000);

  const [
    prospects,
    emailsThisWeek,
    callsBooked,
    pilots,
    clients,
    mrr,
    growthBusinesses,
    contacted,
  ] = await Promise.all([
    prisma.business.count({ where: { stage: "PROSPECT" } }),
    prisma.activity.count({
      where: { type: "EMAIL_SENT", createdAt: { gte: startOfWeekUtc() } },
    }),
    prisma.business.count({ where: { stage: "CALL_BOOKED" } }),
    prisma.business.count({ where: { stage: "PILOT" } }),
    prisma.business.count({ where: { stage: "CLIENT" } }),
    prisma.business.aggregate({
      where: { stage: "CLIENT" },
      _sum: { monthlyFee: true },
    }),
    prisma.business.findMany({
      where: { stage: { in: ["PILOT", "CLIENT"] } },
      include: { snapshots: { orderBy: { date: "asc" } } },
    }),
    prisma.business.findMany({
      where: { stage: "CONTACTED" },
      include: { activities: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "asc" },
    }),
  ]);

  const reviewsGenerated = growthBusinesses.reduce((sum, b) => {
    const g = computeGrowth(b, b.snapshots);
    return sum + (g ? Math.max(0, g.delta) : 0);
  }, 0);

  const stale = contacted.filter((b) => {
    const last = b.activities[0]?.createdAt ?? b.createdAt;
    return last < staleCutoff;
  });

  const mrrValue = Number(mrr._sum.monthlyFee ?? 0);
  const eur = new Intl.NumberFormat("sl-SI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const kpis = [
    { label: "Prospects", value: String(prospects), href: "/pipeline" },
    { label: "Emails this week", value: String(emailsThisWeek), href: "/pipeline" },
    { label: "Calls booked", value: String(callsBooked), href: "/pipeline" },
    { label: "Active pilots", value: String(pilots), href: "/clients" },
    { label: "Active clients", value: String(clients), href: "/clients" },
    { label: "Reviews generated", value: `+${reviewsGenerated}`, href: "/clients", accent: true },
    { label: "MRR", value: eur.format(mrrValue), href: "/clients", accent: true },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href} className="card p-4 transition-shadow hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {kpi.label}
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${
                kpi.accent ? "text-emerald-600 dark:text-emerald-400" : ""
              }`}
            >
              {kpi.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Stale prospects</h2>
          <span className="text-xs text-slate-400">contacted, no activity for 5+ days</span>
        </div>
        {stale.length === 0 ? (
          <p className="text-sm text-slate-400">
            Nothing to chase — every contacted prospect has recent activity. 🎉
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {stale.map((b) => {
              const last = b.activities[0]?.createdAt ?? b.createdAt;
              return (
                <li key={b.id}>
                  <Link
                    href={`/business/${b.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 hover:text-indigo-600"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{b.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{b.city}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      {daysBetween(last, now)}d silent
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
