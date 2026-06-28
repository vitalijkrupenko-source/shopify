import { useCallback, useState } from "react";
import * as Speech from "expo-speech";
import { useStore, newId, todayISO } from "../state/store";
import type { Habit, Task, LifeDomain } from "../state/types";
import { buildSystemPrompt, buildOnboardingSystemPrompt } from "./persona";
import { runCoachTurn } from "./runCoach";
import { runDemoTurn } from "./demoCoach";
import { hasApiKey } from "./client";

interface SendOptions {
  via?: "voice" | "text";
  onboarding?: boolean;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Ties the conversation surface to the coaching brain: appends the user's
 * message, runs a turn through Claude with tool-use wired to the store, then
 * appends (and optionally speaks) the reply.
 */
export function useCoach() {
  const { data, dispatch } = useStore();
  const [thinking, setThinking] = useState(false);
  const [lastActions, setLastActions] = useState<string[]>([]);

  // Executes a coach tool against the local store and returns a confirmation.
  const runTool = useCallback(
    (name: string, input: Record<string, unknown>) => {
      switch (name) {
        case "record_identity_statement": {
          const text = String(input.text ?? "").trim();
          dispatch({
            type: "ADD_IDENTITY",
            statement: { id: newId(), text, createdAt: Date.now() },
          });
          return { ok: `Saved identity: "${text}".`, label: `Identity captured: ${text}` };
        }
        case "record_aim": {
          const text = String(input.text ?? "").trim();
          dispatch({
            type: "ADD_AIM",
            aim: {
              id: newId(),
              domain: (input.domain as LifeDomain) ?? "identity",
              text,
              target: input.target ? String(input.target) : undefined,
            },
          });
          return { ok: `Saved aim: "${text}".`, label: `Aim captured: ${text}` };
        }
        case "create_habit": {
          const habit: Habit = {
            id: newId(),
            title: String(input.title ?? "").trim(),
            cadence: (input.cadence as Habit["cadence"]) ?? "daily",
            timeHint: input.timeHint ? String(input.timeHint) : undefined,
            trackingSource: "manual",
            streak: 0,
            completedDates: [],
            createdAt: Date.now(),
            active: true,
          };
          dispatch({ type: "ADD_HABIT", habit });
          return { ok: `Created the habit "${habit.title}".`, label: `New habit: ${habit.title}` };
        }
        case "create_reminder": {
          const task: Task = {
            id: newId(),
            title: String(input.title ?? "").trim(),
            due: input.due ? String(input.due) : undefined,
            state: "open",
            createdAt: Date.now(),
          };
          dispatch({ type: "ADD_TASK", task });
          return { ok: `Added the reminder "${task.title}".`, label: `New reminder: ${task.title}` };
        }
        case "set_today_intention": {
          const text = String(input.text ?? "").trim();
          dispatch({ type: "PATCH", patch: { todayIntention: { date: todayISO(), text } } });
          return { ok: `Set today's intention.`, label: `Today's intention set` };
        }
        case "surface_pattern": {
          const description = String(input.description ?? "").trim();
          dispatch({
            type: "ADD_PATTERN",
            pattern: { id: newId(), description, surfacedAt: Date.now() },
          });
          return { ok: `Noted that pattern.`, label: `Pattern noticed` };
        }
        default:
          return { ok: "Unknown action.", label: "" };
      }
    },
    [dispatch]
  );

  const send = useCallback(
    async (textRaw: string, opts: SendOptions = {}) => {
      const text = textRaw.trim();
      if (!text || thinking) return;
      const via = opts.via ?? "text";

      // Append the user's message immediately.
      dispatch({
        type: "ADD_MESSAGE",
        message: { id: newId(), role: "user", text, via, createdAt: Date.now() },
      });

      // Stop any in-progress speech when a new turn starts.
      Speech.stop();

      setThinking(true);
      // Build history snapshot including the message we just added.
      const history = [
        ...data.conversation,
        { id: "tmp", role: "user" as const, text, via, createdAt: Date.now() },
      ];

      // Demo mode (no key, or toggled on) uses the offline scripted coach so
      // the full experience works with no network — driving the same tools.
      const useDemo = data.settings.demoMode || !hasApiKey();

      const speak = (reply: string) => {
        if (data.settings.voiceReplies && reply) {
          Speech.speak(reply, { rate: 0.96, pitch: 1.0 });
        }
      };
      const addReply = (reply: string) =>
        dispatch({
          type: "ADD_MESSAGE",
          message: { id: newId(), role: "assistant", text: reply, via: "text", createdAt: Date.now() },
        });

      if (useDemo) {
        try {
          // A beat of "thinking" so the typing indicator reads as natural.
          await delay(700 + Math.min(text.length * 12, 900));
          const { text: reply, actions } = runDemoTurn({
            data,
            history,
            onboarding: opts.onboarding,
            runTool,
          });
          setLastActions(actions);
          addReply(reply);
          speak(reply);
        } finally {
          setThinking(false);
        }
        return;
      }

      const system = opts.onboarding
        ? buildOnboardingSystemPrompt(data)
        : buildSystemPrompt(data);

      try {
        const { text: reply, actions } = await runCoachTurn({
          system,
          history,
          runTool,
        });
        setLastActions(actions);
        addReply(reply);
        speak(reply);
      } catch (e) {
        dispatch({
          type: "ADD_MESSAGE",
          message: {
            id: newId(),
            role: "assistant",
            text: `Something went wrong reaching my brain just now (${(e as Error).message}). Let's try again in a moment.`,
            via: "text",
            createdAt: Date.now(),
          },
        });
      } finally {
        setThinking(false);
      }
    },
    [data, dispatch, runTool, thinking]
  );

  return { send, thinking, lastActions };
}
