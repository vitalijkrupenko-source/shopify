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
          <h1 className="hero-title">{h.h1}</h1>
          <p className="hero-sub">{h.subtitle}</p>
          <div className="hero-cta">
            <a href="#rezervacija" className="btn btn-primary btn-lg">
              {h.ctaPrimary}
              <ArrowIcon className="btn-arrow" />
            </a>
            <a href="#rezultati" className="btn btn-ghost btn-lg">
              {h.ctaSecondary} ↓
            </a>
          </div>
          <p className="hero-trust">{h.ctaNote}</p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="dash-card">
            <div className="dash-head">
              <div className="dash-biz">
                <div className="dash-avatar">
                  {h.visualBiz
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="dash-biz-name">{h.visualBiz}</div>
                  <div className="dash-biz-rating">
                    <Stars />
                    <span>4,9</span>
                  </div>
                </div>
              </div>
              <GoogleGIcon className="dash-google" />
            </div>

            <div className="counter">
              <div className="counter-side counter-before">
                <span className="counter-num">{h.visualBefore}</span>
                <span className="counter-label">{h.visualBeforeLabel}</span>
              </div>
              <ArrowIcon className="counter-arrow" />
              <div className="counter-side counter-after">
                <span className="counter-num">{h.visualAfter}</span>
                <span className="counter-label">{h.visualAfterLabel}</span>
              </div>
            </div>
            <div className="counter-caption">
              <Stars />
              <span>Google ocene</span>
            </div>
          </div>

          <div className="sms-bubble">
            <span className="sms-icon">
              <SmsIcon />
            </span>
            <span className="sms-text">{h.visualSms}</span>
          </div>

          <div className="dash-toast">
            <span className="dash-toast-icon">
              <StarIcon className="star" />
            </span>
            <span className="dash-toast-text">+1 ★★★★★</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SmsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
