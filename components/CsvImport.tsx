"use client";

import Link from "next/link";
import { useState } from "react";

const COLUMNS = [
  "name",
  "city",
  "rating",
  "review_count",
  "competitor",
  "competitor_reviews",
  "phone",
  "email",
  "notes",
] as const;

type Row = Partial<Record<(typeof COLUMNS)[number], string>>;

// Minimal RFC-4180-ish CSV parser: quoted fields, escaped quotes, CRLF.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

function toRows(csv: string[][]): { rows: Row[]; unknownHeaders: string[] } {
  if (csv.length === 0) return { rows: [], unknownHeaders: [] };
  const headers = csv[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const unknownHeaders = headers.filter((h) => !(COLUMNS as readonly string[]).includes(h));
  const rows = csv.slice(1).map((cells) => {
    const row: Row = {};
    headers.forEach((h, i) => {
      if ((COLUMNS as readonly string[]).includes(h)) {
        row[h as (typeof COLUMNS)[number]] = (cells[i] ?? "").trim();
      }
    });
    return row;
  });
  return { rows, unknownHeaders };
}

export default function CsvImport() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [unknownHeaders, setUnknownHeaders] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: string[] } | null>(null);
  const [error, setError] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = toRows(parseCsv(String(reader.result ?? "")));
      setRows(parsed.rows);
      setUnknownHeaders(parsed.unknownHeaders);
    };
    reader.readAsText(file);
  }

  async function commit() {
    if (!rows?.length) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Import failed");
      return;
    }
    setResult(data);
    setRows(null);
  }

  return (
    <div className="space-y-4">
      <label className="card block cursor-pointer border-2 border-dashed p-6 text-center text-sm text-slate-500 hover:border-indigo-400 dark:text-slate-400">
        <input type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
        Tap to choose a CSV file
      </label>

      {unknownHeaders.length > 0 && (
        <p className="text-sm text-amber-600">
          Ignored unknown columns: {unknownHeaders.join(", ")}
        </p>
      )}

      {rows && rows.length === 0 && <p className="text-sm text-slate-500">No data rows found.</p>}

      {rows && rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-3 dark:border-slate-800">
            <p className="text-sm font-medium">Preview — {rows.length} businesses</p>
            <button onClick={commit} disabled={busy} className="btn-primary">
              {busy ? "Importing…" : `Import ${rows.length}`}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  {COLUMNS.map((c) => (
                    <th key={c} className="whitespace-nowrap px-3 py-2 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((row, i) => (
                  <tr key={i} className={!row.name || !row.city ? "bg-rose-50 dark:bg-rose-950/30" : ""}>
                    {COLUMNS.map((c) => (
                      <td key={c} className="max-w-48 truncate px-3 py-1.5">
                        {row[c] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 p-2 text-[11px] text-slate-400 dark:border-slate-800">
            Rows highlighted red are missing name or city and will be skipped.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {result && (
        <div className="card p-4 text-sm">
          <p className="font-medium text-emerald-600">✓ Imported {result.created} businesses.</p>
          {result.skipped.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-slate-500">
              {result.skipped.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
          <Link href="/pipeline" className="btn-secondary mt-3">
            Go to pipeline →
          </Link>
        </div>
      )}
    </div>
  );
}
