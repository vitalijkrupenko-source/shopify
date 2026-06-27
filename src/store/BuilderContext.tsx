import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Photo } from "../lib/types";
import type { FormatId } from "../data/config";
import { FORMATS } from "../data/config";
import { DEFAULT_DESIGN } from "../data/designs";
import { buildBook } from "../lib/layout";
import { computePrice } from "../lib/pricing";

interface BuilderState {
  formatId: FormatId;
  designId: string;
  title: string;
  subtitle: string;
  photos: Photo[];
  captions: Record<string, string>;

  setFormatId: (id: FormatId) => void;
  setDesignId: (id: string) => void;
  setTitle: (t: string) => void;
  setSubtitle: (t: string) => void;
  addPhotos: (p: Photo[]) => void;
  removePhoto: (id: string) => void;
  movePhoto: (id: string, dir: -1 | 1) => void;
  setCaption: (id: string, text: string) => void;
  reset: () => void;
}

const Ctx = createContext<BuilderState | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [formatId, setFormatId] = useState<FormatId>("small");
  const [designId, setDesignId] = useState<string>(DEFAULT_DESIGN.id);
  const [title, setTitle] = useState("Our Little Chapter");
  const [subtitle, setSubtitle] = useState("2026");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [captions, setCaptions] = useState<Record<string, string>>({});

  const value = useMemo<BuilderState>(
    () => ({
      formatId,
      designId,
      title,
      subtitle,
      photos,
      captions,
      setFormatId,
      setDesignId,
      setTitle,
      setSubtitle,
      addPhotos: (p) => setPhotos((cur) => [...cur, ...p]),
      removePhoto: (id) =>
        setPhotos((cur) => cur.filter((ph) => ph.id !== id)),
      movePhoto: (id, dir) =>
        setPhotos((cur) => {
          const idx = cur.findIndex((p) => p.id === id);
          const next = idx + dir;
          if (idx < 0 || next < 0 || next >= cur.length) return cur;
          const copy = [...cur];
          [copy[idx], copy[next]] = [copy[next], copy[idx]];
          return copy;
        }),
      setCaption: (id, text) =>
        setCaptions((cur) => ({ ...cur, [id]: text })),
      reset: () => {
        setPhotos([]);
        setCaptions({});
        setTitle("Our Little Chapter");
        setSubtitle("2026");
      },
    }),
    [formatId, designId, title, subtitle, photos, captions]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBuilder() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBuilder must be used inside BuilderProvider");
  return ctx;
}

/** Derived book + price, recomputed from current builder state. */
export function useBook() {
  const { photos, formatId, captions, title, subtitle } = useBuilder();
  const format = FORMATS[formatId];
  return useMemo(() => {
    const book = buildBook(photos, format, captions, title, subtitle);
    const price = computePrice(format, book.photoPageCount);
    return { book, price, format };
  }, [photos, format, captions, title, subtitle]);
}
