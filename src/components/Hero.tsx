import { useLanguage } from "../i18n/LanguageContext";
import { StarIcon, GoogleGIcon, ArrowIcon } from "./Icons";

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} className="star" />
      ))}
    </span>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-badge">
            <Stars />
            <span>{h.badge}</span>
          </div>
          <h1 className="hero-title">
            {h.title1}{" "}
            <span className="hero-highlight">{h.titleHighlight}</span>{" "}
            {h.title2}
          </h1>
          <p className="hero-sub">{h.subtitle}</p>
          <div className="hero-cta">
            <a href="#pricing" className="btn btn-primary btn-lg">
              {h.ctaPrimary}
              <ArrowIcon className="btn-arrow" />
            </a>
            <a href="#how" className="btn btn-ghost btn-lg">
              {h.ctaSecondary}
            </a>
          </div>
          <p className="hero-trust">{h.trust}</p>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{h.stat1Value}</strong>
              <span>{h.stat1Label}</span>
            </div>
            <div className="hero-stat">
              <strong>{h.stat2Value}</strong>
              <span>{h.stat2Label}</span>
            </div>
            <div className="hero-stat">
              <strong>{h.stat3Value}</strong>
              <span>{h.stat3Label}</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="dash-card">
            <div className="dash-head">
              <div className="dash-biz">
                <div className="dash-avatar">
                  {h.cardBusiness
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="dash-biz-name">{h.cardBusiness}</div>
                  <div className="dash-biz-rating">
                    <Stars />
                    <span>4.9</span>
                  </div>
                </div>
              </div>
              <GoogleGIcon className="dash-google" />
            </div>

            <div className="dash-row">
              <div className="dash-tile">
                <span className="dash-tile-label">{h.cardReviewsLabel}</span>
                <span className="dash-tile-value dash-up">+27</span>
                <div className="dash-bars">
                  {[40, 55, 48, 70, 62, 85, 100].map((v, i) => (
                    <span key={i} style={{ height: `${v}%` }} />
                  ))}
                </div>
              </div>
              <div className="dash-tile">
                <span className="dash-tile-label">{h.cardRankLabel}</span>
                <span className="dash-tile-value dash-rank">
                  {h.cardRankValue}
                </span>
                <div className="dash-rank-track">
                  <span className="dash-rank-fill" />
                </div>
              </div>
            </div>
          </div>

          <div className="dash-toast">
            <span className="dash-toast-icon">
              <StarIcon className="star" />
            </span>
            <span className="dash-toast-text">{h.cardNotification}</span>
          </div>

          <div className="dash-badge-float">
            <GoogleGIcon className="dash-badge-google" />
            <div>
              <Stars />
              <span className="dash-badge-count">1,248 {"★"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
