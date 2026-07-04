"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { STAGE_LABELS, STAGE_ORDER } from "@/lib/stages";
import type { BusinessDTO, StageValue } from "@/lib/types";
import PlaceIdSearch from "@/components/PlaceIdSearch";

type FormState = {
  name: string;
  city: string;
  stage: StageValue;
  googlePlaceId: string;
  phone: string;
  email: string;
  website: string;
  pilotStartDate: string;
  clientSince: string;
  monthlyFee: string;
  competitorName: string;
  competitorReviewCount: string;
  notes: string;
};

function toForm(b: BusinessDTO): FormState {
  return {
    name: b.name,
    city: b.city,
    stage: b.stage,
    googlePlaceId: b.googlePlaceId ?? "",
    phone: b.phone ?? "",
    email: b.email ?? "",
    website: b.website ?? "",
    pilotStartDate: b.pilotStartDate ?? "",
    clientSince: b.clientSince ?? "",
    monthlyFee: b.monthlyFee === null ? "" : String(b.monthlyFee),
    competitorName: b.competitorName ?? "",
    competitorReviewCount:
      b.competitorReviewCount === null ? "" : String(b.competitorReviewCount),
    notes: b.notes,
  };
}

export default function BusinessEditor({ business }: { business: BusinessDTO }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(business));
  const [saved, setSaved] = useState<FormState>(() => toForm(business));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value });

  async function save() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/businesses/${business.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(form);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save failed");
    }
  }

  async function remove() {
    if (!confirm(`Delete "${business.name}" and all its snapshots and activity? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`/api/businesses/${business.id}`, { method: "DELETE" });
    router.push("/pipeline");
    router.refresh();
  }

  return (
    <section className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Details</h2>
        {dirty && (
          <button onClick={save} disabled={busy} className="btn-primary px-4 py-1.5">
            {busy ? "Saving…" : "Save changes"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input value={form.name} onChange={set("name")} className="input" />
        </div>
        <div>
          <label className="label">City</label>
          <input value={form.city} onChange={set("city")} className="input" />
        </div>
        <div>
          <label className="label">Stage</label>
          <select value={form.stage} onChange={set("stage")} className="input">
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Monthly fee (€)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.monthlyFee}
            onChange={set("monthlyFee")}
            className="input"
          />
        </div>
        <div>
          <label className="label">Pilot start date</label>
          <input type="date" value={form.pilotStartDate} onChange={set("pilotStartDate")} className="input" />
        </div>
        <div>
          <label className="label">Client since</label>
          <input type="date" value={form.clientSince} onChange={set("clientSince")} className="input" />
        </div>
        <div>
          <label className="label">Phone</label>
          <input value={form.phone} onChange={set("phone")} className="input" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" value={form.email} onChange={set("email")} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Website</label>
          <input value={form.website} onChange={set("website")} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Google Place ID</label>
          <input value={form.googlePlaceId} onChange={set("googlePlaceId")} placeholder="ChIJ…" className="input mb-2" />
          <PlaceIdSearch
            defaultQuery={`${form.name} ${form.city}`}
            onPick={(id) => setForm((f) => ({ ...f, googlePlaceId: id }))}
          />
        </div>
        <div>
          <label className="label">Competitor name</label>
          <input value={form.competitorName} onChange={set("competitorName")} className="input" />
        </div>
        <div>
          <label className="label">Competitor reviews</label>
          <input
            type="number"
            min="0"
            value={form.competitorReviewCount}
            onChange={set("competitorReviewCount")}
            className="input"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Notes</label>
          <textarea rows={4} value={form.notes} onChange={set("notes")} className="input" />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <button onClick={remove} disabled={busy} className="btn-danger">
          Delete business
        </button>
        {dirty && (
          <button onClick={save} disabled={busy} className="btn-primary">
            {busy ? "Saving…" : "Save changes"}
          </button>
        )}
      </div>
    </section>
  );
}
