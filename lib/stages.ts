import type { Stage } from "@prisma/client";

export const STAGE_ORDER: Stage[] = [
  "PROSPECT",
  "CONTACTED",
  "REPLIED",
  "CALL_BOOKED",
  "PILOT",
  "CLIENT",
  "LOST",
];

export const STAGE_LABELS: Record<Stage, string> = {
  PROSPECT: "Prospect",
  CONTACTED: "Contacted",
  REPLIED: "Replied",
  CALL_BOOKED: "Call booked",
  PILOT: "Pilot",
  CLIENT: "Client",
  LOST: "Lost",
};

export const STAGE_COLORS: Record<Stage, string> = {
  PROSPECT: "bg-slate-400",
  CONTACTED: "bg-sky-500",
  REPLIED: "bg-violet-500",
  CALL_BOOKED: "bg-amber-500",
  PILOT: "bg-orange-500",
  CLIENT: "bg-emerald-500",
  LOST: "bg-rose-400",
};
