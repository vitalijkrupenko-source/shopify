/**
 * Core entities from the PRD §10, trimmed to what the v1 slice needs.
 * The Identity & Goals model is the structured backbone the coach reasons over.
 */

export type LifeDomain =
  | "identity"
  | "career"
  | "money"
  | "health"
  | "relationships"
  | "lifestyle"
  | "location"
  | "learning"
  | "mind";

export interface IdentityStatement {
  id: string;
  text: string; // "someone who is calm and present with my family"
  createdAt: number;
}

export interface Aim {
  id: string;
  domain: LifeDomain;
  text: string;
  target?: string; // free text, e.g. "$150k", "Lisbon", "run a half marathon"
  targetDate?: string; // ISO date (optional)
  identityId?: string; // links upward to a why
}

export type TrackingSource = "manual" | "health" | "coach";

export interface Habit {
  id: string;
  title: string;
  whyIdentityId?: string; // links to an identity statement (the why)
  cadence: "daily" | "weekdays" | "weekly";
  timeHint?: string; // "07:00", "evening"
  trackingSource: TrackingSource;
  streak: number;
  // ISO date strings (YYYY-MM-DD) on which the habit was completed.
  completedDates: string[];
  createdAt: number;
  active: boolean;
}

export type TaskState = "open" | "done" | "snoozed";

export interface Task {
  id: string;
  title: string;
  whyIdentityId?: string;
  due?: string; // ISO date
  state: TaskState;
  // Persistent reminders re-surface until done or deferred.
  snoozedUntil?: string;
  createdAt: number;
}

export interface Pattern {
  id: string;
  description: string; // "you skip workouts the day after late work nights"
  surfacedAt: number;
}

export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  via: "voice" | "text";
  createdAt: number;
  pending?: boolean; // assistant message still streaming
}

export interface Settings {
  tone: "calm" | "warm" | "direct" | "adaptive";
  guidance: "socratic" | "direct" | "mixed";
  slipResponse: "gentle" | "firm" | "curious" | "adaptive";
  challenge: "low" | "medium" | "high";
  morningCheckIn: boolean;
  eveningCheckIn: boolean;
  weeklyReview: boolean;
  voiceReplies: boolean; // speak coach replies aloud (TTS)
  demoMode: boolean; // use the offline scripted coach (no API key / network)
  activeDomains: LifeDomain[];
}

export interface IdentityGoalsModel {
  identityStatements: IdentityStatement[];
  aims: Aim[];
  habits: Habit[];
  tasks: Task[];
  patterns: Pattern[];
}

export interface AppData extends IdentityGoalsModel {
  name?: string;
  onboarded: boolean;
  settings: Settings;
  conversation: ChatMessage[];
  todayIntention?: { date: string; text: string };
}

export const DOMAIN_LABELS: Record<LifeDomain, string> = {
  identity: "Identity & purpose",
  career: "Career",
  money: "Money",
  health: "Health",
  relationships: "Relationships",
  lifestyle: "Lifestyle",
  location: "Location",
  learning: "Learning",
  mind: "Mind & emotions",
};
