"use client";

import Link from "next/link";
import { useState } from "react";

export interface ClientRow {
  id: string;
  name: string;
  city: string;
  stage: "PILOT" | "CLIENT";
  startDate: string | null;
  startCount: number | null;
  latestCount: number | null;
  delta: number | null;
  startRating: number | null;
  latestRating: number | null;
  monthlyFee: number | null;
  spark: number[]; // reviewCount, last 90 days
}

type SortKey = "name" | "delta" | "latestCount" | "startDate";

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return <span className="text-xs text-slate-300">—</span>;
  const w = 96;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map(
      (v, i) =>
        `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 3 - ((v - min) / span) * (h - 6)).toFixed(1)}`
    )
    .join(" ");
  return (
    <svg width={w} height={h} className="text-indigo-500" aria-hidden>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const eur = new Intl.NumberFormat("sl-SI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default function ClientsTable({ rows }: { rows: ClientRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("delta");
  const [desc, setDesc] = useState(true);

  function toggle(key: SortKey) {
    if (key === sortKey) setDesc(!desc);
    else {
      setSortKey(key);
      setDesc(true);
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const dir = desc ? -1 : 1;
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
    return ((av as number) - (bv as number)) * dir;
  });

  if (rows.length === 0) {
    return (
      <p className="card p-6 text-sm text-slate-400">
        No pilots or clients yet. Move a business to the Pilot stage to start tracking results.
      </p>
    );
  }

  const arrow = (key: SortKey) => (sortKey === key ? (desc ? " ↓" : " ↑") : "");

  return (
    <div className="card overflow-x-auto">
      <table className="w-full whitespace-nowrap text-left text-sm">
        <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">
              <button onClick={() => toggle("name")} className="font-medium hover:text-slate-800 dark:hover:text-slate-200">
                Business{arrow("name")}
              </button>
            </th>
            <th className="px-4 py-3">
              <button onClick={() => toggle("startDate")} className="font-medium hover:text-slate-800 dark:hover:text-slate-200">
                Start{arrow("startDate")}
              </button>
            </th>
            <th className="px-4 py-3">
              <button onClick={() => toggle("latestCount")} className="font-medium hover:text-slate-800 dark:hover:text-slate-200">
                Reviews{arrow("latestCount")}
              </button>
            </th>
            <th className="px-4 py-3">
              <button onClick={() => toggle("delta")} className="font-medium hover:text-slate-800 dark:hover:text-slate-200">
                Growth{arrow("delta")}
              </button>
            </th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Last 90 days</th>
            <th className="px-4 py-3 text-right font-medium">Fee</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sorted.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3">
                <Link href={`/business/${r.id}`} className="font-medium hover:text-indigo-600">
                  {r.name}
                </Link>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {r.city} · {r.stage === "PILOT" ? "Pilot" : "Client"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {r.startDate
                  ? new Date(`${r.startDate}T00:00:00Z`).toLocaleDateString("sl-SI", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td className="px-4 py-3">
                {r.startCount !== null && r.latestCount !== null ? (
                  <>
                    <span className="text-slate-400">{r.startCount}</span>
                    <span className="mx-1 text-slate-300">→</span>
                    <span className="font-semibold">{r.latestCount}</span>
                  </>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                {r.delta !== null ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      r.delta > 0
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {r.delta > 0 ? `+${r.delta}` : r.delta}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {r.startRating !== null && r.latestRating !== null ? (
                  <>
                    {r.startRating.toFixed(1)}
                    <span className="mx-1 text-slate-300">→</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      ★ {r.latestRating.toFixed(1)}
                    </span>
                  </>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                <Sparkline values={r.spark} />
              </td>
              <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">
                {r.monthlyFee !== null ? eur.format(r.monthlyFee) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
