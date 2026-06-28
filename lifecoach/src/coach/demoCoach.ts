import type { AppData, ChatMessage, LifeDomain } from "../state/types";

/**
 * Offline "demo" coach — a scripted rules engine that stands in for Claude so
 * the whole experience can be tried with no API key and no network. It returns
 * the same shape as runCoachTurn and drives the SAME tool handlers, so the
 * Identity & Goals model, Today and Dashboard populate exactly as they would
 * with the real coach. It's intentionally simple: keyword intent + a gentle
 * onboarding progression, in the calm, Socratic voice of the persona.
 */

export interface DemoTurnInput {
  data: AppData;
  history: ChatMessage[];
  onboarding?: boolean;
  runTool: (name: string, input: Record<string, unknown>) => { ok: string; label: string };
}

export interface DemoTurnResult {
  text: string;
  actions: string[];
}

const SENTINEL_OPEN = "i just opened";
const SENTINEL_CHECKIN = "start a brief check-in";
const MOOD_TAG = "mood check-in";

function lastUserText(history: ChatMessage[]): string {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "user") return history[i].text;
  }
  return "";
}

function userTurnCount(history: ChatMessage[]): number {
  return history.filter((m) => m.role === "user").length;
}

/** Pick a phrasing deterministically so replies vary but don't flicker. */
function rotate<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function guessDomain(t: string): LifeDomain {
  const s = t.toLowerCase();
  if (/\b(income|money|salary|save|saving|debt|earn|\$|financial)\b/.test(s)) return "money";
  if (/\b(job|career|work|business|role|promotion|founder|company)\b/.test(s)) return "career";
  if (/\b(run|gym|workout|health|weight|sleep|fit|walk|eat|strength)\b/.test(s)) return "health";
  if (/\b(partner|family|friend|relationship|wife|husband|kids|dating)\b/.test(s)) return "relationships";
  if (/\b(learn|study|read|course|skill|language)\b/.test(s)) return "learning";
  if (/\b(move|city|live|abroad|country|relocat)\b/.test(s)) return "location";
  if (/\b(calm|present|happy|anxious|stress|mind|peace)\b/.test(s)) return "mind";
  return "identity";
}

function cleanFragment(t: string): string {
  return t.replace(/^[\s,.-]+/, "").replace(/[\s.!]+$/, "").trim();
}

// ── intent: explicit reminders / intentions ─────────────────────────────────
function tryReminder(text: string, runTool: DemoTurnInput["runTool"]) {
  const m = text.match(/remind me to (.+)/i);
  if (!m) return null;
  const title = cleanFragment(m[1]);
  runTool("create_reminder", { title });
  return {
    text: `Done — I'll keep "${title}" in front of you until it's handled, calmly, no nagging. What's the why behind it for you?`,
    label: `New reminder: ${title}`,
  };
}

function tryIntention(text: string, runTool: DemoTurnInput["runTool"]) {
  const m = text.match(/(?:today i want to|my focus today is|today i'?ll|intention for today is)\s+(.+)/i);
  if (!m) return null;
  const intent = cleanFragment(m[1]);
  runTool("set_today_intention", { text: intent });
  return {
    text: `Good. Today is about: ${intent}. Keep it small enough to actually finish — what's the first move?`,
    label: "Today's intention set",
  };
}

// ── mood check-in ────────────────────────────────────────────────────────────
function moodReply(text: string, data: AppData, runTool: DemoTurnInput["runTool"]): DemoTurnResult {
  const m = text.match(/feeling (\w+)/i);
  const mood = (m?.[1] ?? "okay").toLowerCase();
  const heavy = ["anxious", "low", "tired", "angry", "stressed", "sad"].includes(mood);
  const actions: string[] = [];
  let text2: string;
  if (heavy) {
    text2 = rotate(
      [
        `Thank you for naming it — ${mood} is information, not a verdict. What happened just before you noticed it?`,
        `I hear that. Let's not rush past it. Where do you feel the ${mood} most, and what's it asking for?`,
      ],
      data.conversation.length
    );
  } else {
    text2 = rotate(
      [
        `Love that. Let's use it — when you feel ${mood}, what tends to be true about how you spent your morning?`,
        `Good. Hold onto that ${mood} feeling. What's one thing today that would protect it?`,
      ],
      data.conversation.length
    );
  }
  return { text: text2, actions };
}

// ── onboarding progression ───────────────────────────────────────────────────
const DISCOVERY_PROBES = [
  "When you picture your life going really well a few years out, what's different about how you're living day to day?",
  "Flip it for a second — what would you hate to still be true three years from now?",
  "When have you felt most like yourself? What were you doing?",
  "If nothing were off-limits, what would you want more of in your weeks?",
  "Who do you admire — and what specifically about how they live pulls at you?",
];

function onboardingTurn(input: DemoTurnInput): DemoTurnResult {
  const { history, data, runTool } = input;
  const turns = userTurnCount(history);
  const text = lastUserText(history);
  const lower = text.toLowerCase();
  const actions: string[] = [];

  // Kickoff
  if (lower.includes(SENTINEL_OPEN) || turns <= 1) {
    const hi = data.name ? `${data.name}, ` : "";
    return {
      text: `${hi}I'm really glad you're here. Before we touch a single goal, I want to understand where you're trying to go. So — when you picture your life going well a few years from now, what's different about how you're living?`,
      actions,
    };
  }

  // Capture an identity around turn 2-3 from what they said.
  if (data.identityStatements.length === 0 && cleanFragment(text).length > 12) {
    const frag = cleanFragment(text).replace(/^i('| a)?m?\s*/i, "").slice(0, 90);
    const statement = /someone who/i.test(text) ? cleanFragment(text) : `someone who ${frag}`;
    const r = runTool("record_identity_statement", { text: statement });
    actions.push(r.label);
    return {
      text: `That matters — I'm writing it down as part of who you're becoming: “${statement}.” Does that land, or would you say it differently?`,
      actions,
    };
  }

  // Capture an aim once an identity exists.
  if (data.aims.length === 0 && cleanFragment(text).length > 6) {
    const domain = guessDomain(text);
    const r = runTool("record_aim", { domain, text: cleanFragment(text) });
    actions.push(r.label);
    return {
      text: `Okay — I've noted that as an aim. Let's make it real: what's one small thing you could do most days that would move you toward it?`,
      actions,
    };
  }

  // Turn the small thing into a starter habit.
  if (data.habits.length === 0 && cleanFragment(text).length > 4) {
    const title = cleanFragment(text).replace(/^i('| wi)?ll\s*/i, "").slice(0, 60);
    const r = runTool("create_habit", { title, cadence: "daily" });
    actions.push(r.label);
    return {
      text: `I've set that up as a daily habit: “${title}.” Tie it to the why — when you do it, who are you becoming? We can keep going, or you can tap “Enter app” whenever you like.`,
      actions,
    };
  }

  // Keep exploring with the next probe.
  return { text: rotate(DISCOVERY_PROBES, turns), actions };
}

// ── main entry ───────────────────────────────────────────────────────────────
export function runDemoTurn(input: DemoTurnInput): DemoTurnResult {
  const { history, onboarding, data, runTool } = input;
  const text = lastUserText(history);
  const lower = text.toLowerCase();

  if (onboarding) return onboardingTurn(input);

  if (lower.includes(MOOD_TAG)) return moodReply(text, data, runTool);

  if (lower.includes(SENTINEL_CHECKIN)) {
    return {
      text: rotate(
        [
          "Let's take a minute together. What's the one thing that, if it happened today, would make today feel like a win?",
          "Good to pause here. How did yesterday actually go — and what's the first thing on your mind for today?",
        ],
        data.conversation.length
      ),
      actions: [],
    };
  }

  const reminder = tryReminder(text, runTool);
  if (reminder) return { text: reminder.text, actions: [reminder.label] };

  const intention = tryIntention(text, runTool);
  if (intention) return { text: intention.text, actions: [intention.label] };

  // Goal / aim language
  if (/\b(i want to|my goal|i'?d like to|i need to|i'?m trying to)\b/i.test(lower)) {
    const domain = guessDomain(text);
    const r = runTool("record_aim", { domain, text: cleanFragment(text) });
    return {
      text: `I've captured that. Before we plan it — what makes this one matter to you now, rather than later?`,
      actions: [r.label],
    };
  }

  // Identity language
  if (/\b(i want to be|i am becoming|someone who|the kind of person)\b/i.test(lower)) {
    const r = runTool("record_identity_statement", { text: cleanFragment(text) });
    return {
      text: `That's worth holding onto — I've added it to who you're becoming. What's one action this week that would prove it to yourself?`,
      actions: [r.label],
    };
  }

  // Default: calm, Socratic reflection.
  return {
    text: rotate(
      [
        "Say more about that — what's underneath it for you?",
        "I'm with you. If a wise version of you looked at this, what would they notice first?",
        "Let's slow down here. What would 'handled' actually look like?",
        "Good. And how does that connect to who you're trying to become?",
      ],
      history.length
    ),
    actions: [],
  };
}
