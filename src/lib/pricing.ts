import type { FormatDef } from "../data/config";

export interface PriceBreakdown {
  base: number;
  includedPages: number;
  extraPages: number;
  extraCost: number;
  total: number;
  pages: number;
}

export function computePrice(
  format: FormatDef,
  photoPageCount: number
): PriceBreakdown {
  const extraPages = Math.max(0, photoPageCount - format.includedPages);
  const extraCost = extraPages * format.extraPagePrice;
  return {
    base: format.basePrice,
    includedPages: format.includedPages,
    extraPages,
    extraCost,
    total: format.basePrice + extraCost,
    pages: photoPageCount,
  };
}

export const money = (n: number) =>
  `$${n.toFixed(2).replace(/\.00$/, "")}`;
