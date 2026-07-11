import { useLanguage } from "../i18n/LanguageContext";
import { ArrowIcon } from "./Icons";

function NfcIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8.7a9 9 0 0 1 0 6.6M9.5 6.5a13 13 0 0 1 0 11M13 4.8a17 17 0 0 1 0 14.4M16.8 3.5a20 20 0 0 1 0 17" />
    </svg>
  );
}

export function Shop() {
  const { t } = useLanguage();
  const s = t.shop;
  // Stripe Payment Link per product goes here once products/prices are set.
  const links = ["#rezervacija", "#rezervacija"];
  return (
    <section className="section shop" id="trgovina">
      <div className="container">
        <div className="section-head">
          <h2>{s.h2}</h2>
          <p className="section-sub">{s.subtitle}</p>
        </div>
        <div className="shop-grid">
          {s.products.map((p, i) => (
            <div key={i} className="shop-card">
              <div className="shop-thumb" aria-hidden="true">
                <NfcIcon />
              </div>
              <div className="shop-info">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="shop-foot">
                  <span className="shop-price">{s.priceTbd}</span>
                  <a href={links[i]} className="btn btn-primary btn-sm">
                    {s.buy}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="shop-delivery">{s.delivery}</p>
        <a href="#cenik" className="shop-cross">
          <span>{s.cross}</span>
          <strong>
            {s.crossLink}
            <ArrowIcon className="shop-cross-arrow" />
          </strong>
        </a>
      </div>
    </section>
  );
}
