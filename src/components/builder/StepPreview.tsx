import { useBook } from "../../store/BuilderContext";
import { money } from "../../lib/pricing";
import BookPreview from "./BookPreview";

export default function StepPreview() {
  const { book, price, format } = useBook();

  return (
    <div>
      <div className="step-head">
        <h2>Here’s your book</h2>
        <p>Flip through every page exactly as it will print. Love it? Order it.</p>
      </div>

      <div className="preview-wrap">
        <BookPreview />

        <aside className="preview-side">
          <h3>Order summary</h3>
          <div className="summary-row">
            <span className="muted">Format</span>
            <span>{format.name}</span>
          </div>
          <div className="summary-row">
            <span className="muted">Size</span>
            <span>{format.dimensions.split(" · ")[0]}</span>
          </div>
          <div className="summary-row">
            <span className="muted">Photos</span>
            <span>{book.pages.filter((p) => p.type === "photo").reduce((n, p) => n + p.photos.length, 0)}</span>
          </div>
          <div className="summary-row">
            <span className="muted">Pages</span>
            <span>{price.pages}</span>
          </div>

          <hr className="hr" />

          <div className="summary-row">
            <span>Base ({price.includedPages} pages)</span>
            <span>{money(price.base)}</span>
          </div>
          {price.extraPages > 0 && (
            <div className="summary-row">
              <span>
                {price.extraPages} extra page{price.extraPages === 1 ? "" : "s"}
              </span>
              <span>{money(price.extraCost)}</span>
            </div>
          )}
          <div className="summary-row">
            <span className="muted">Shipping</span>
            <span style={{ color: "var(--sage)", fontWeight: 600 }}>FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{money(price.total)}</span>
          </div>

          <p className="muted" style={{ fontSize: ".82rem", marginTop: 14 }}>
            🔒 Free to preview. You only pay when you place your order.
          </p>
        </aside>
      </div>
    </div>
  );
}
