// Growth math shared by cards, the dashboard, and the clients page.
// All "since start" numbers compare the snapshot nearest the service start
// date (pilotStartDate, else clientSince) against the latest snapshot.

export interface SnapshotPoint {
  date: Date;
  rating: number;
  reviewCount: number;
}

export interface GrowthSummary {
  startDate: Date;
  startCount: number;
  startRating: number;
  latestCount: number;
  latestRating: number;
  delta: number;
}

export function serviceStartDate(business: {
  pilotStartDate: Date | null;
  clientSince: Date | null;
}): Date | null {
  return business.pilotStartDate ?? business.clientSince ?? null;
}

export function nearestSnapshot(
  snapshots: SnapshotPoint[],
  target: Date
): SnapshotPoint | null {
  let best: SnapshotPoint | null = null;
  let bestDist = Infinity;
  for (const s of snapshots) {
    const dist = Math.abs(s.date.getTime() - target.getTime());
    if (dist < bestDist) {
      bestDist = dist;
      best = s;
    }
  }
  return best;
}

export function computeGrowth(
  business: { pilotStartDate: Date | null; clientSince: Date | null },
  snapshots: SnapshotPoint[] // any order
): GrowthSummary | null {
  const start = serviceStartDate(business);
  if (!start || snapshots.length === 0) return null;
  const sorted = [...snapshots].sort((a, b) => a.date.getTime() - b.date.getTime());
  const startSnap = nearestSnapshot(sorted, start);
  const latest = sorted[sorted.length - 1];
  if (!startSnap) return null;
  return {
    startDate: start,
    startCount: startSnap.reviewCount,
    startRating: startSnap.rating,
    latestCount: latest.reviewCount,
    latestRating: latest.rating,
    delta: latest.reviewCount - startSnap.reviewCount,
  };
}

export function daysBetween(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86_400_000));
}

/** Today as a UTC-midnight Date, matching Snapshot.date's @db.Date column. */
export function todayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
