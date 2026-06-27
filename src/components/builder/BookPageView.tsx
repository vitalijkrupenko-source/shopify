import type { BookPage } from "../../lib/types";
import type { CoverDesign } from "../../data/designs";

interface Props {
  page: BookPage;
  index: number;
  total: number;
  design: CoverDesign;
  title: string;
  subtitle: string;
}

/** Renders a single page of the book exactly as it will print. */
export default function BookPageView({
  page,
  index,
  total,
  design,
  title,
  subtitle,
}: Props) {
  if (page.type === "cover") {
    return (
      <div
        className="book-page"
        style={{ background: design.background, color: design.textColor }}
      >
        <div className="book-cover-inner">
          <div style={{ fontSize: "2rem", marginBottom: 10 }}>{design.motif}</div>
          <div className="ttl">{title || "Our Little Chapter"}</div>
          {subtitle && <div className="sub">{subtitle}</div>}
        </div>
      </div>
    );
  }

  if (page.type === "title") {
    return (
      <div className="book-page" style={{ background: "#fff" }}>
        <div className="book-cover-inner" style={{ color: "var(--ink)" }}>
          <div className="ttl" style={{ fontSize: "1.5rem" }}>{title}</div>
          {subtitle && (
            <div className="sub" style={{ color: "var(--ink-soft)" }}>
              {subtitle}
            </div>
          )}
          <div
            style={{
              width: 48,
              height: 3,
              background: "var(--coral)",
              borderRadius: 2,
              marginTop: 16,
            }}
          />
        </div>
      </div>
    );
  }

  if (page.type === "back") {
    return (
      <div
        className="book-page"
        style={{ background: design.background, color: design.textColor }}
      >
        <div className="book-cover-inner">
          <div style={{ opacity: 0.8, fontSize: "0.85rem", letterSpacing: ".05em" }}>
            Made with
          </div>
          <div className="ttl" style={{ fontSize: "1.2rem" }}>Little Chapters</div>
        </div>
      </div>
    );
  }

  // photo page
  return (
    <div className="book-page" style={{ background: "#fff" }}>
      <div className="page-inner">
        <div className={`page-photos ${page.template}`}>
          {page.photos.map((p) => (
            <img key={p.id} src={p.url} alt={p.name} />
          ))}
        </div>
        {page.caption && <div className="page-caption">{page.caption}</div>}
      </div>
      <div className="page-folio">{index} / {total - 1}</div>
    </div>
  );
}
