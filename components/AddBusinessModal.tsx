"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PlaceIdSearch from "@/components/PlaceIdSearch";

export default function AddBusinessModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    googlePlaceId: "",
    competitorName: "",
    competitorReviewCount: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create business");
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="card max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-b-none p-4 sm:rounded-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Add business</h2>
          <button type="button" onClick={onClose} className="btn-secondary px-2 py-1">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Name *</label>
            <input required value={form.name} onChange={set("name")} className="input" />
          </div>
          <div>
            <label className="label">City *</label>
            <input required value={form.city} onChange={set("city")} className="input" />
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
            <input
              value={form.googlePlaceId}
              onChange={set("googlePlaceId")}
              placeholder="ChIJ…"
              className="input mb-2"
            />
            <PlaceIdSearch
              defaultQuery={[form.name, form.city].filter(Boolean).join(" ")}
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
            <textarea rows={3} value={form.notes} onChange={set("notes")} className="input" />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={busy || !form.name || !form.city} className="btn-primary">
            {busy ? "Saving…" : "Add business"}
          </button>
        </div>
      </form>
    </div>
  );
}
