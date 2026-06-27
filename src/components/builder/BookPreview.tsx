import { useState } from "react";
import { useBook, useBuilder } from "../../store/BuilderContext";
import { getDesign } from "../../data/designs";
import BookPageView from "./BookPageView";

/** Full-book preview: a flippable page stage with a thumbnail strip. */
export default function BookPreview() {
  const { book } = useBook();
  const { designId, title, subtitle } = useBuilder();
  const design = getDesign(designId);
  const [i, setI] = useState(0);

  const pages = book.pages;
  const cur = Math.min(i, pages.length - 1);
  const page = pages[cur];

  const label =
    page.type === "cover"
      ? "Front cover"
      : page.type === "back"
      ? "Back cover"
      : page.type === "title"
      ? "Title page"
      : `Page ${cur}`;

  return (
    <div className="book-stage">
      <BookPageView
        page={page}
        index={cur}
        total={pages.length}
        design={design}
        title={title}
        subtitle={subtitle}
      />

      <div className="book-nav">
        <button onClick={() => setI(Math.max(0, cur - 1))} disabled={cur === 0} aria-label="Previous page">
          ‹
        </button>
        <span className="pos">{label}</span>
        <button
          onClick={() => setI(Math.min(pages.length - 1, cur + 1))}
          disabled={cur === pages.length - 1}
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      <div className="page-strip">
        {pages.map((p, idx) => (
          <button
            key={p.id}
            className={idx === cur ? "active" : ""}
            onClick={() => setI(idx)}
            title={p.type === "photo" ? `Page ${idx}` : p.type}
          >
            {p.type === "photo" && p.photos[0] ? (
              <img src={p.photos[0].url} alt="" />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    p.type === "title"
                      ? "#fff"
                      : getDesign(designId).background,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
