# Life Coach — voice-first AI coach (Expo / React Native)

A first build of the Personal Life Coach from the PRD: a calm, proactive coach
that helps you figure out who you want to become and keeps you moving toward it.
Powered by Claude (`claude-opus-4-8`) with the Appendix A persona and tool-use.

## What's in this slice

- **Onboarding / discovery** (`app/onboarding.tsx`) — the guided, voice-led
  "who do you want to become" conversation. The coach opens broad, digs when you're
  vague, and captures identity statements, aims, and starter habits as they emerge.
- **Talk / Coach** (`app/(tabs)/index.tsx`) — the home conversation surface.
  Tap "Check in" and the coach starts a check-in; replies are spoken aloud.
- **Today** (`app/(tabs)/today.tsx`) — today's intention, habits with check-off
  and streaks, and persistent reminders with a judgment-free "Not today".
- **Becoming / Dashboard** (`app/(tabs)/dashboard.tsx`) — momentum stats, a mood
  check-in (the reference image's third screen), identity statements, streaks, and
  patterns the coach has noticed.
- **Goals & Identity** (`app/(tabs)/goals.tsx`) — view/edit the living model and
  tune the coach's dials (tone, challenge, check-ins, voice).

The Identity & Goals model is the structured backbone the coach reasons over; it
persists locally via AsyncStorage and is injected into the system prompt each turn.

## Running it

This is a real Expo app — it can't be previewed in a browser sandbox. On a Mac (or
any machine with Node) with the Expo Go app on your iPhone:

```bash
cd lifecoach
cp .env.example .env          # then paste your Anthropic API key
npm install
npm start                     # scan the QR code with Expo Go
```

### The coach's brain

Set `EXPO_PUBLIC_ANTHROPIC_API_KEY` in `.env`. Without it the app still runs and
navigates; the coach just tells you it isn't connected yet.

> **Security:** because this is a client-side app, the key ships in the bundle.
> That's acceptable for a single-user personal build (the PRD's data stance), but
> for anything shared put a thin proxy in front of the Anthropic API and point
> `getClient()` at it (`src/coach/client.ts`).

## How the coaching loop works (`src/coach/`)

- `persona.ts` — builds the system prompt from Appendix A, your tuned dials, and a
  live snapshot of your Identity & Goals model.
- `tools.ts` — the action layer Claude can call: record identity/aims, create
  habits/reminders, set today's intention, surface a pattern.
- `runCoach.ts` — the manual tool-use loop (non-streaming, so it's robust on React
  Native's fetch). Tools execute client-side against the local store.
- `useCoach.ts` — wires a turn end-to-end: append your message → run the turn →
  append (and optionally speak) the reply.

## Honest limitations of this first cut

- **Speech-to-text** isn't live in Expo Go — the iOS Speech framework needs a native
  dev build. The mic affordance is present and replies are spoken (TTS via
  `expo-speech`); you type for now. Wiring `@react-native-voice/voice` in a dev build
  is the next step.
- **Calendar (EventKit) and Health (HealthKit)** are scoped in `app.json` but not yet
  wired — reminders/habits live in the local model. "Propose → approve" is modeled by
  the coach proposing and you confirming in the UI.
- **Proactive notifications / the pattern engine** run only in-session here; the
  background scheduling (UserNotifications + scheduled jobs) is future work.

These map directly onto the PRD's phased build — the coaching relationship, the model,
and the four screens are real; the device integrations are the next layer.
