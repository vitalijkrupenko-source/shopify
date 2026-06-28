import type Anthropic from "@anthropic-ai/sdk";
import { getClient, COACH_MODEL } from "./client";
import { COACH_TOOLS } from "./tools";
import type { ChatMessage } from "../state/types";

export interface CoachTurnInput {
  system: string;
  history: ChatMessage[]; // prior conversation (excludes the in-flight reply)
  // Executes a tool against app state and returns a short confirmation string.
  // The label is pushed to the UI activity feed.
  runTool: (name: string, input: Record<string, unknown>) => {
    ok: string;
    label: string;
  };
}

export interface CoachTurnResult {
  text: string;
  actions: string[]; // labels of tools the coach invoked this turn
}

function toMessageParams(history: ChatMessage[]): Anthropic.MessageParam[] {
  return history
    .filter((m) => !m.pending && m.text.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.text }));
}

/**
 * Runs one coaching turn through Claude with the manual tool-use loop
 * (PRD §9 conversation loop). Non-streaming keeps it robust on React
 * Native's fetch, which doesn't expose response-body streaming.
 */
export async function runCoachTurn(
  input: CoachTurnInput
): Promise<CoachTurnResult> {
  const client = getClient();
  const messages = toMessageParams(input.history);
  const actions: string[] = [];

  let guard = 0;
  while (guard++ < 6) {
    const response = await client.messages.create({
      model: COACH_MODEL,
      max_tokens: 1024,
      system: input.system,
      tools: COACH_TOOLS,
      messages,
    });

    if (response.stop_reason === "tool_use") {
      // Append the assistant turn (must include the tool_use blocks) …
      messages.push({ role: "assistant", content: response.content });
      // … then run every requested tool and return all results in one user turn.
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          let ok = "Done.";
          try {
            const result = input.runTool(
              block.name,
              block.input as Record<string, unknown>
            );
            ok = result.ok;
            actions.push(result.label);
          } catch (e) {
            ok = `Could not complete that: ${(e as Error).message}`;
          }
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: ok,
          });
        }
      }
      messages.push({ role: "user", content: toolResults });
      continue;
    }

    // Terminal turn — collect the spoken reply.
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return { text, actions };
  }

  return {
    text: "I lost my train of thought there — can you say that again?",
    actions,
  };
}
