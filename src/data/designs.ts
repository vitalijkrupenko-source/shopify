/**
 * Five cover designs. Each renders as a CSS background so the store needs no
 * image assets, and each defines the text color used on top of it.
 */
export interface CoverDesign {
  id: string;
  name: string;
  description: string;
  background: string;
  textColor: string;
  /** small decorative motif shown on the cover */
  motif: string;
}

export const DESIGNS: CoverDesign[] = [
  {
    id: "sunshine",
    name: "Sunshine",
    description: "Warm and playful",
    background: "linear-gradient(150deg, #FFC857 0%, #FF9E5C 60%, #FF7A5C 100%)",
    textColor: "#3a2a14",
    motif: "☀️",
  },
  {
    id: "blush",
    name: "Blush",
    description: "Soft & sweet",
    background: "linear-gradient(150deg, #FFE3D8 0%, #FFC9C9 55%, #F7A7B6 100%)",
    textColor: "#5b2b3a",
    motif: "🌸",
  },
  {
    id: "meadow",
    name: "Meadow",
    description: "Fresh & calm",
    background: "linear-gradient(150deg, #C8E6CF 0%, #7FB29A 70%, #4F8C76 100%)",
    textColor: "#163027",
    motif: "🌿",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Modern & bold",
    background: "linear-gradient(150deg, #3a3f6b 0%, #2b2b3a 70%, #1c1c28 100%)",
    textColor: "#fdeee0",
    motif: "✨",
  },
  {
    id: "linen",
    name: "Linen",
    description: "Classic & timeless",
    background:
      "repeating-linear-gradient(45deg, #f4ece0, #f4ece0 6px, #efe4d4 6px, #efe4d4 12px)",
    textColor: "#5b4a36",
    motif: "📖",
  },
];

export const DEFAULT_DESIGN = DESIGNS[0];

export function getDesign(id: string): CoverDesign {
  return DESIGNS.find((d) => d.id === id) ?? DEFAULT_DESIGN;
}
