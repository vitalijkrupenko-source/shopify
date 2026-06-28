import type Anthropic from "@anthropic-ai/sdk";

/**
 * The coach's action layer (PRD §9). These are surfaced to Claude as
 * function-calling tools; the handlers run client-side against the local
 * store. Calendar writes are "propose then approve" — the coach proposes a
 * task/reminder and the user confirms in the UI, so nothing is written
 * silently to a real calendar in this build.
 */
export const COACH_TOOLS: Anthropic.Tool[] = [
  {
    name: "record_identity_statement",
    description:
      "Record a statement about who the user is becoming, e.g. 'someone who is calm and present with my family'. Use when an identity crystallizes in conversation.",
    input_schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "The identity statement, first person or 'someone who…' form." },
      },
      required: ["text"],
    },
  },
  {
    name: "record_aim",
    description:
      "Record a concrete long-term aim the user cares about (career, money, health, relationships, lifestyle, location, learning).",
    input_schema: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          enum: [
            "identity",
            "career",
            "money",
            "health",
            "relationships",
            "lifestyle",
            "location",
            "learning",
            "mind",
          ],
        },
        text: { type: "string", description: "The aim in the user's words." },
        target: { type: "string", description: "Optional concrete target, e.g. '$150k', 'Lisbon', 'half marathon'." },
      },
      required: ["domain", "text"],
    },
  },
  {
    name: "create_habit",
    description:
      "Create a recurring habit tied to who the user is becoming. Only create after the user has agreed to it.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        cadence: { type: "string", enum: ["daily", "weekdays", "weekly"] },
        timeHint: { type: "string", description: "Optional time of day, e.g. '07:00' or 'evening'." },
        why: { type: "string", description: "Optional: which identity/aim this serves, in plain words." },
      },
      required: ["title", "cadence"],
    },
  },
  {
    name: "create_reminder",
    description:
      "Create a one-off task/reminder. Persistent: it re-surfaces until completed or deferred. Only create after the user agrees.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        due: { type: "string", description: "Optional ISO date YYYY-MM-DD." },
        why: { type: "string", description: "Optional why, in plain words." },
      },
      required: ["title"],
    },
  },
  {
    name: "set_today_intention",
    description: "Set or update the user's intention/focus for today after agreeing it together.",
    input_schema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"],
    },
  },
  {
    name: "surface_pattern",
    description:
      "Record a pattern you've noticed about the user (a recurring theme, trigger, or trajectory) so it persists and can be revisited.",
    input_schema: {
      type: "object",
      properties: { description: { type: "string" } },
      required: ["description"],
    },
  },
];

export interface ToolResult {
  /** Human-readable confirmation returned to the model. */
  ok: string;
  /** Short label for the UI activity feed. */
  label: string;
}

export type ToolName =
  | "record_identity_statement"
  | "record_aim"
  | "create_habit"
  | "create_reminder"
  | "set_today_intention"
  | "surface_pattern";
