"use client";

import { useState } from "react";

interface Result {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  userRatingCount: number | null;
}

// Small "Find Place ID" helper: text-searches Google Places and fills the
// place ID via onPick.
export default function PlaceIdSearch({
  defaultQuery,
  onPick,
}: {
  defaultQuery?: string;
  onPick: (placeId: string) => void;
}) {
  const [query, setQuery] = useState(defaultQuery ?? "");
  const [results, setResults] = useState<Result[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    if (!query.trim()) return;
    setBusy(true);
    setError("");
    setResults(null);
    const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Search failed");
      return;
    }
    setResults(data.results ?? []);
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-2 dark:border-slate-700">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search();
            }
          }}
          placeholder="Search Google: name + city"
          className="input flex-1"
        />
        <button type="button" onClick={search} disabled={busy} className="btn-secondary">
          {busy ? "…" : "Find"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      {results && results.length === 0 && (
        <p className="mt-2 text-xs text-slate-500">No places found.</p>
      )}
      {results && results.length > 0 && (
        <ul className="mt-2 max-h-48 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  onPick(r.id);
                  setResults(null);
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                <span className="font-medium">{r.name}</span>
                {r.rating !== null && (
                  <span className="ml-1 text-amber-600 dark:text-amber-400">
                    ★ {r.rating} ({r.userRatingCount})
                  </span>
                )}
                <span className="block text-slate-500 dark:text-slate-400">{r.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
