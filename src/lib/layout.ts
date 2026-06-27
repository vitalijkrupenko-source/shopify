import type { BookPage, Photo } from "./types";
import type { FormatDef } from "../data/config";

let pc = 0;
const pageId = () => `pg_${(pc++).toString(36)}`;

interface Chunk {
  count: number;
  template: string;
}

/**
 * Orientation-aware packing for the large format. Looks ahead at the next few
 * photos and chooses a layout that flatters them — vertical iPhone shots get
 * paired side-by-side, landscapes stack, and runs of portraits form grids.
 */
function pickChunk(photos: Photo[], i: number): Chunk {
  const a = photos[i];
  const b = photos[i + 1];
  const c = photos[i + 2];
  const d = photos[i + 3];

  if (a.orientation === "landscape") {
    if (b && b.orientation === "landscape") return { count: 2, template: "tpl-2v" };
    return { count: 1, template: "tpl-1" };
  }

  const p2 = b && b.orientation !== "landscape";
  const p3 = c && c.orientation !== "landscape";
  const p4 = d && d.orientation !== "landscape";

  if (p2 && p3 && p4) return { count: 4, template: "tpl-4" };
  if (p2 && p3) return { count: 3, template: "tpl-3" };
  if (p2) return { count: 2, template: "tpl-2h" };
  return { count: 1, template: "tpl-1" };
}

export interface Book {
  pages: BookPage[];
  photoPageCount: number;
}

/**
 * Builds the full ordered list of pages for the preview & order: a designed
 * cover, an optional title page, the laid-out photo pages, and a back cover.
 */
export function buildBook(
  photos: Photo[],
  format: FormatDef,
  captions: Record<string, string>,
  title: string,
  subtitle: string
): Book {
  const photoPages: BookPage[] = [];

  if (format.maxPerPage === 1) {
    // Small format — one photo per page.
    for (const photo of photos) {
      photoPages.push({
        id: pageId(),
        type: "photo",
        template: "tpl-1",
        photos: [photo],
        caption: captions[photo.id] || undefined,
      });
    }
  } else {
    // Large format — smart multi-photo layouts.
    let i = 0;
    while (i < photos.length) {
      const { count, template } = pickChunk(photos, i);
      const slice = photos.slice(i, i + count);
      photoPages.push({
        id: pageId(),
        type: "photo",
        template,
        photos: slice,
        caption: slice.length === 1 ? captions[slice[0].id] || undefined : undefined,
      });
      i += count;
    }
  }

  const pages: BookPage[] = [];
  pages.push({ id: pageId(), type: "cover", photos: [] });
  if (title.trim()) {
    pages.push({ id: pageId(), type: "title", photos: [], caption: subtitle });
  }
  pages.push(...photoPages);
  pages.push({ id: pageId(), type: "back", photos: [] });

  return { pages, photoPageCount: photoPages.length };
}
