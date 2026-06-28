/**
 * Visual language inspired by the reference onboarding mockup:
 * near-black backgrounds, soft per-context gradient "auras", rounded
 * pill controls, generous spacing, and a calm, low-arousal palette that
 * matches the coach's therapist-like tone.
 */

export const colors = {
  // Base surfaces
  bg: "#0B0B0F",
  bgElevated: "#15151C",
  surface: "rgba(255,255,255,0.06)",
  surfaceStrong: "rgba(255,255,255,0.10)",
  surfacePressed: "rgba(255,255,255,0.16)",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.18)",

  // Text
  text: "#F4F3F0",
  textMuted: "rgba(244,243,240,0.66)",
  textFaint: "rgba(244,243,240,0.40)",
  onAccent: "#0B0B0F",

  // Accents (used across gradients + highlights)
  amber: "#E8843B",
  amberSoft: "#F4A968",
  green: "#7BD66A",
  greenDeep: "#2E7D46",
  blue: "#4F8BF0",
  cyan: "#36C7C2",
  violet: "#8C7BF0",
  rose: "#E5709A",

  // Status
  success: "#7BD66A",
  warning: "#F4A968",
  danger: "#E5709A",
} as const;

/**
 * Each life context gets its own aura — the onboarding mockup uses a warm
 * orange, a green, and a cool blue across its three steps. We reuse those as
 * the signature gradients for the app's main surfaces.
 */
export const auras = {
  warm: ["#3A1D0E", "#1A1206", "#0B0B0F"],
  forest: ["#0E2A18", "#0A1A10", "#0B0B0F"],
  ocean: ["#0E1E3A", "#0A1322", "#0B0B0F"],
  dusk: ["#241338", "#130C20", "#0B0B0F"],
} as const;

export type AuraName = keyof typeof auras;

export const accentForAura: Record<AuraName, string> = {
  warm: colors.amber,
  forest: colors.green,
  ocean: colors.blue,
  dusk: colors.violet,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const font = {
  // System fonts keep the bundle light; weights carry the hierarchy.
  display: { fontSize: 30, lineHeight: 36, fontWeight: "600" as const, letterSpacing: 0.2 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "600" as const },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
  body: { fontSize: 16, lineHeight: 23, fontWeight: "400" as const },
  label: { fontSize: 14, lineHeight: 19, fontWeight: "500" as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" as const, letterSpacing: 0.4 },
} as const;
