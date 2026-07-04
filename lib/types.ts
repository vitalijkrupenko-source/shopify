// Plain-JSON DTOs passed from server components to client components
// (Prisma Date/Decimal values don't serialize across the boundary).

export type StageValue =
  | "PROSPECT"
  | "CONTACTED"
  | "REPLIED"
  | "CALL_BOOKED"
  | "PILOT"
  | "CLIENT"
  | "LOST";

export type ActivityTypeValue =
  | "EMAIL_SENT"
  | "REPLY_RECEIVED"
  | "CALL"
  | "NOTE"
  | "STAGE_CHANGE";

export interface CardDTO {
  id: string;
  name: string;
  city: string;
  stage: StageValue;
  rating: number | null;
  reviewCount: number | null;
  daysInStage: number;
  delta: number | null; // "+N reviews since start", PILOT/CLIENT only
}

export interface BusinessDTO {
  id: string;
  name: string;
  city: string;
  googlePlaceId: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  stage: StageValue;
  pilotStartDate: string | null; // YYYY-MM-DD
  clientSince: string | null; // YYYY-MM-DD
  monthlyFee: number | null;
  notes: string;
  competitorName: string | null;
  competitorReviewCount: number | null;
}

export interface ActivityDTO {
  id: string;
  type: ActivityTypeValue;
  content: string;
  createdAt: string; // ISO
}

export interface SnapshotDTO {
  date: string; // YYYY-MM-DD
  rating: number;
  reviewCount: number;
}

export function toDateInput(d: Date | null): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}
