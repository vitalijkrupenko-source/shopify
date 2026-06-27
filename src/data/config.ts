export const BRAND = {
  name: "Little Chapters",
  tagline: "Turn your camera roll into a keepsake.",
  email: "hello@littlechapters.co",
};

export type FormatId = "small" | "large";

export interface FormatDef {
  id: FormatId;
  name: string;
  tag: string;
  dimensions: string;
  description: string;
  /** photos per page used by the auto-layout engine */
  maxPerPage: number;
  basePrice: number;
  /** pages included in the base price */
  includedPages: number;
  extraPagePrice: number;
  features: string[];
}

export const FORMATS: Record<FormatId, FormatDef> = {
  small: {
    id: "small",
    name: "Pocket Book",
    tag: "One photo per page",
    dimensions: '5.5" × 7" · Portrait',
    description:
      "A cozy little book sized for vertical iPhone photos — one full photo on every page. Perfect for a single trip, a first year, or a season together.",
    maxPerPage: 1,
    basePrice: 39,
    includedPages: 20,
    extraPagePrice: 1.5,
    features: [
      "One vertical photo, beautifully full, per page",
      "Lay-flat softcover binding",
      "20 pages included, add more anytime",
      "Optional caption under each photo",
    ],
  },
  large: {
    id: "large",
    name: "Keepsake Book",
    tag: "Smart multi-photo layouts",
    dimensions: '8.5" × 11" · Portrait',
    description:
      "A big, premium album. We automatically arrange your photos into balanced layouts — mixing portraits and landscapes so every spread looks designed, not crammed.",
    maxPerPage: 4,
    basePrice: 59,
    includedPages: 20,
    extraPagePrice: 2.0,
    features: [
      "Auto-arranged layouts of 1–4 photos per page",
      "Premium hardcover with lay-flat pages",
      "20 pages included, add more anytime",
      "Captions and chapter title page",
    ],
  },
};

export const FORMAT_LIST = [FORMATS.small, FORMATS.large];
