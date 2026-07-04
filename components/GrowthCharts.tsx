"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SnapshotDTO } from "@/lib/types";

const fmtDay = (ts: number) =>
  new Date(ts).toLocaleDateString("sl-SI", { day: "numeric", month: "short" });
const fmtFull = (ts: number) =>
  new Date(ts).toLocaleDateString("sl-SI", { day: "numeric", month: "short", year: "numeric" });

export default function GrowthCharts({
  snapshots,
  pilotStartDate,
  clientSince,
}: {
  snapshots: SnapshotDTO[];
  pilotStartDate: string | null;
  clientSince: string | null;
}) {
  if (snapshots.length === 0) {
    return (
      <section className="card p-4 text-sm text-slate-400">
        No snapshots yet — add a Google Place ID and hit “Fetch now”, or wait for the daily cron.
      </section>
    );
  }

  const data = snapshots.map((s) => ({
    ts: new Date(`${s.date}T00:00:00Z`).getTime(),
    reviewCount: s.reviewCount,
    rating: s.rating,
  }));

  const pilotTs = pilotStartDate ? new Date(`${pilotStartDate}T00:00:00Z`).getTime() : null;
  const clientTs = clientSince ? new Date(`${clientSince}T00:00:00Z`).getTime() : null;

  const markers = (
    <>
      {pilotTs !== null && (
        <ReferenceLine
          x={pilotTs}
          stroke="#f97316"
          strokeDasharray="4 4"
          label={{ value: "Pilot", position: "insideTopLeft", fill: "#f97316", fontSize: 11 }}
        />
      )}
      {clientTs !== null && (
        <ReferenceLine
          x={clientTs}
          stroke="#10b981"
          strokeDasharray="4 4"
          label={{ value: "Client", position: "insideTopLeft", fill: "#10b981", fontSize: 11 }}
        />
      )}
    </>
  );

  const axisProps = {
    dataKey: "ts",
    type: "number" as const,
    scale: "time" as const,
    domain: ["dataMin", "dataMax"] as [string, string],
    tickFormatter: fmtDay,
    tick: { fontSize: 11 },
    stroke: "#94a3b8",
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <section className="card p-4 lg:col-span-2">
        <h2 className="mb-2 text-sm font-semibold">Review growth</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis {...axisProps} />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} domain={["auto", "auto"]} />
              <Tooltip
                labelFormatter={(ts) => fmtFull(Number(ts))}
                formatter={(value) => [String(value), "reviews"]}
              />
              {markers}
              <Line
                type="monotone"
                dataKey="reviewCount"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={data.length < 25}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-sm font-semibold">Rating</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis {...axisProps} />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                domain={[(min: number) => Math.max(0, Math.floor((min - 0.2) * 10) / 10), 5]}
                tickFormatter={(v) => Number(v).toFixed(1)}
              />
              <Tooltip
                labelFormatter={(ts) => fmtFull(Number(ts))}
                formatter={(value) => [Number(value).toFixed(1), "rating"]}
              />
              {markers}
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
