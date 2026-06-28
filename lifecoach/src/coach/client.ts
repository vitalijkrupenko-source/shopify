import Anthropic from "@anthropic-ai/sdk";

/**
 * The coaching brain (PRD §9). Anthropic Claude via API.
 *
 * The key is read from EXPO_PUBLIC_ANTHROPIC_API_KEY at build time. For a
 * single-user personal app this is acceptable (the PRD optimizes for
 * experience); for anything shared, front the API with a small proxy and set
 * `baseURL` to it instead of shipping the key.
 */
export const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? "";

export const COACH_MODEL = "claude-opus-4-8";

export const hasApiKey = (): boolean => ANTHROPIC_API_KEY.trim().length > 0;

let cached: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!cached) {
    cached = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
      // React Native is not a browser, but the SDK's environment guard treats
      // non-Node runtimes conservatively; this opt-in lets it run on-device.
      dangerouslyAllowBrowser: true,
    });
  }
  return cached;
}
