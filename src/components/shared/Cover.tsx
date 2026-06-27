import type { CoverDesign } from "../../data/designs";

interface Props {
  design: CoverDesign;
  title?: string;
  subtitle?: string;
  /** optional photo peeking through a window on the cover */
  photoUrl?: string;
  className?: string;
}

/** A book cover rendered from a design — used on the landing page and builder. */
export default function Cover({
  design,
  title,
  subtitle,
  photoUrl,
  className = "",
}: Props) {
  return (
    <div
      className={`cover ${className}`}
      style={{ background: design.background, color: design.textColor }}
    >
      <div className="book-cover-inner">
        <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{design.motif}</div>
        {photoUrl && (
          <div
            style={{
              width: "62%",
              aspectRatio: "4/5",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              margin: "4px 0 12px",
              border: "4px solid rgba(255,255,255,0.85)",
            }}
          >
            <img
              src={photoUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
        {title && <div className="cover-title ttl">{title}</div>}
        {subtitle && <div className="sub">{subtitle}</div>}
      </div>
    </div>
  );
}
