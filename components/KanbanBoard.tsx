"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STAGE_COLORS, STAGE_LABELS, STAGE_ORDER } from "@/lib/stages";
import type { CardDTO, StageValue } from "@/lib/types";
import AddBusinessModal from "@/components/AddBusinessModal";

export default function KanbanBoard({ initial }: { initial: CardDTO[] }) {
  const router = useRouter();
  const [cards, setCards] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<StageValue | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  async function moveTo(id: string, stage: StageValue) {
    const card = cards.find((c) => c.id === id);
    if (!card || card.stage === stage) return;
    const previous = cards;
    setCards(cards.map((c) => (c.id === id ? { ...c, stage, daysInStage: 0 } : c)));
    const res = await fetch(`/api/businesses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    if (!res.ok) {
      setCards(previous);
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Could not move business");
    } else {
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Pipeline</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          + Add business
        </button>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4">
        {STAGE_ORDER.map((stage) => {
          const columnCards = cards.filter((c) => c.stage === stage);
          return (
            <section
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(stage);
              }}
              onDragLeave={() => setDragOver((s) => (s === stage ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(null);
                if (dragId) moveTo(dragId, stage);
              }}
              className={`w-[17rem] shrink-0 snap-start rounded-xl border p-2 transition-colors ${
                dragOver === stage
                  ? "border-indigo-400 bg-indigo-50/70 dark:border-indigo-600 dark:bg-indigo-950/40"
                  : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"
              }`}
            >
              <header className="mb-2 flex items-center gap-2 px-1">
                <span className={`h-2.5 w-2.5 rounded-full ${STAGE_COLORS[stage]}`} />
                <h2 className="text-sm font-semibold">{STAGE_LABELS[stage]}</h2>
                <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {columnCards.length}
                </span>
              </header>
              <div className="flex min-h-16 flex-col gap-2">
                {columnCards.map((card) => (
                  <BusinessCard
                    key={card.id}
                    card={card}
                    dragging={dragId === card.id}
                    onDragStart={() => setDragId(card.id)}
                    onDragEnd={() => setDragId(null)}
                    onMove={(stage) => moveTo(card.id, stage)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {showAdd && <AddBusinessModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function BusinessCard({
  card,
  dragging,
  onDragStart,
  onDragEnd,
  onMove,
}: {
  card: CardDTO;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (stage: StageValue) => void;
}) {
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`card cursor-grab p-3 active:cursor-grabbing ${dragging ? "opacity-40" : ""}`}
    >
      <Link href={`/business/${card.id}`} className="block">
        <h3 className="text-sm font-semibold leading-tight hover:text-indigo-600">
          {card.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{card.city}</p>
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        {card.reviewCount !== null ? (
          <span className="font-medium text-amber-600 dark:text-amber-400">
            ★ {card.rating?.toFixed(1)} · {card.reviewCount} reviews
          </span>
        ) : (
          <span className="text-slate-400">no snapshot yet</span>
        )}
        {card.delta !== null && (
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            +{card.delta} since start
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">
          {card.daysInStage}d in stage
        </span>
        <select
          value={card.stage}
          onChange={(e) => onMove(e.target.value as StageValue)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Move to stage"
          className="rounded-md border border-slate-200 bg-transparent px-1 py-0.5 text-[11px] text-slate-500 dark:border-slate-700"
        >
          {STAGE_ORDER.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}
