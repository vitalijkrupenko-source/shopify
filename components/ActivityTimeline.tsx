"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ActivityDTO, ActivityTypeValue } from "@/lib/types";

const TYPE_META: Record<ActivityTypeValue, { label: string; icon: string; badge: string }> = {
  EMAIL_SENT: { label: "Email sent", icon: "✉️", badge: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  REPLY_RECEIVED: { label: "Reply received", icon: "📩", badge: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  CALL: { label: "Call", icon: "📞", badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  NOTE: { label: "Note", icon: "📝", badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  STAGE_CHANGE: { label: "Stage change", icon: "🔀", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
};

const QUICK_ADD_TYPES: ActivityTypeValue[] = ["NOTE", "CALL", "EMAIL_SENT", "REPLY_RECEIVED"];

export default function ActivityTimeline({
  businessId,
  activities,
}: {
  businessId: string;
  activities: ActivityDTO[];
}) {
  const router = useRouter();
  const [type, setType] = useState<ActivityTypeValue>("NOTE");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, type, content }),
    });
    setBusy(false);
    if (res.ok) {
      setContent("");
      router.refresh();
    } else {
      alert("Could not add activity");
    }
  }

  return (
    <section className="card p-4">
      <h2 className="mb-3 font-semibold">Activity</h2>

      <form onSubmit={add} className="mb-4 space-y-2">
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ActivityTypeValue)}
            className="input w-auto"
          >
            {QUICK_ADD_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_META[t].label}
              </option>
            ))}
          </select>
          <button type="submit" disabled={busy || !content.trim()} className="btn-primary ml-auto">
            Add
          </button>
        </div>
        <textarea
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What happened?"
          className="input"
        />
      </form>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-400">No activity yet.</p>
      ) : (
        <ol className="space-y-3">
          {activities.map((a) => {
            const meta = TYPE_META[a.type];
            return (
              <li key={a.id} className="flex gap-2.5 text-sm">
                <span aria-hidden className="mt-0.5">{meta.icon}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.badge}`}>
                      {meta.label}
                    </span>
                    <time className="text-xs text-slate-400">
                      {new Date(a.createdAt).toLocaleString("sl-SI", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  {a.content && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300">
                      {a.content}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
