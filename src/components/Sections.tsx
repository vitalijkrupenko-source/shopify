import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import {
  FeatureIcon,
  StarIcon,
  CheckIcon,
  ChevronIcon,
  GoogleGIcon,
  ArrowIcon,
} from "./Icons";

function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="kicker">{children}</span>;
}

export function LogoBar() {
  const { t } = useLanguage();
  const names = [
    "Mizarstvo Novak",
    "Salon Bella",
    "Avtoservis Kovač",
    "Ordinacija Nasmeh",
    "Pekarna Kruhek",
    "Vrtnarija Zelenko",
  ];
  return (
    <section className="logobar">
      <div className="container">
        <p className="logobar-title">{t.logos.title}</p>
        <div className="logobar-row">
          {names.map((n) => (
            <span key={n} className="logobar-item">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Problem() {
  const { t } = useLanguage();
  const p = t.problem;
  return (
    <section className="section problem" id="why">
      <div className="container">
        <div className="section-head">
          <Kicker>{p.kicker}</Kicker>
          <h2>{p.title}</h2>
          <p className="section-sub">{p.subtitle}</p>
        </div>
        <div className="problem-grid">
          {p.items.map((item, i) => (
            <div key={i} className="problem-card">
              <div className="problem-stat">{item.stat}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useLanguage();
  const h = t.how;
  return (
    <section className="section how" id="how">
      <div className="container">
        <div className="section-head">
          <Kicker>{h.kicker}</Kicker>
          <h2>{h.title}</h2>
          <p className="section-sub">{h.subtitle}</p>
        </div>
        <div className="how-grid">
          {h.steps.map((s, i) => (
            <div key={i} className="how-card">
              <div className="how-number">{s.number}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {i < h.steps.length - 1 && (
                <ArrowIcon className="how-connector" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const { t } = useLanguage();
  const f = t.features;
  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="section-head">
          <Kicker>{f.kicker}</Kicker>
          <h2>{f.title}</h2>
          <p className="section-sub">{f.subtitle}</p>
        </div>
        <div className="features-grid">
          {f.items.map((item, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">
                <FeatureIcon name={item.icon} className="feature-icon-svg" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Results() {
  const { t } = useLanguage();
  const r = t.results;
  return (
    <section className="section results" id="results">
      <div className="container">
        <div className="section-head">
          <Kicker>{r.kicker}</Kicker>
          <h2>{r.title}</h2>
          <p className="section-sub">{r.subtitle}</p>
        </div>
        <div className="results-stats">
          {r.stats.map((s, i) => (
            <div key={i} className="results-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <figure className="results-quote">
          <div className="results-quote-stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="star" />
            ))}
          </div>
          <blockquote>“{r.quote}”</blockquote>
          <figcaption>
            <strong>{r.quoteAuthor}</strong>
            <span>{r.quoteRole}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t } = useLanguage();
  const tt = t.testimonials;
  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <div className="section-head">
          <Kicker>{tt.kicker}</Kicker>
          <h2>{tt.title}</h2>
          <p className="section-sub">{tt.subtitle}</p>
        </div>
        <div className="testimonials-grid">
          {tt.items.map((item, i) => (
            <figure key={i} className="testimonial-card">
              <div className="testimonial-top">
                <div className="testimonial-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <StarIcon key={j} className="star" />
                  ))}
                </div>
                <GoogleGIcon className="testimonial-google" />
              </div>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <div className="testimonial-avatar">{item.author[0]}</div>
                <div>
                  <strong>{item.author}</strong>
                  <span>{item.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const { t } = useLanguage();
  const p = t.pricing;
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="section-head">
          <Kicker>{p.kicker}</Kicker>
          <h2>{p.title}</h2>
          <p className="section-sub">{p.subtitle}</p>
        </div>
        <div className="pricing-grid">
          {p.plans.map((plan, i) => {
            const featured = i === 1;
            return (
              <div
                key={i}
                className={"price-card" + (featured ? " is-featured" : "")}
              >
                {featured && <span className="price-tag">{p.popular}</span>}
                <h3 className="price-name">{plan.name}</h3>
                <p className="price-desc">{plan.description}</p>
                <div className="price-amount">
                  <strong>{plan.price}</strong>
                  <span>{p.perMonth}</span>
                </div>
                <a
                  href="#"
                  className={
                    "btn btn-block " +
                    (featured ? "btn-primary" : "btn-outline")
                  }
                >
                  {p.cta}
                </a>
                <ul className="price-features">
                  {plan.features.map((feat, j) => (
                    <li key={j}>
                      <CheckIcon className="price-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="pricing-guarantee">{p.guarantee}</p>
      </div>
    </section>
  );
}

export function FAQ() {
  const { t } = useLanguage();
  const f = t.faq;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section faq" id="faq">
      <div className="container container-narrow">
        <div className="section-head">
          <Kicker>{f.kicker}</Kicker>
          <h2>{f.title}</h2>
          <p className="section-sub">{f.subtitle}</p>
        </div>
        <div className="faq-list">
          {f.items.map((item, i) => (
            <div
              key={i}
              className={"faq-item" + (open === i ? " is-open" : "")}
            >
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <ChevronIcon className="faq-chevron" />
              </button>
              <div className="faq-a">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { t } = useLanguage();
  const c = t.finalCta;
  return (
    <section className="section final-cta">
      <div className="container">
        <div className="final-cta-inner">
          <div className="final-cta-glow" aria-hidden="true" />
          <h2>{c.title}</h2>
          <p>{c.subtitle}</p>
          <div className="final-cta-actions">
            <a href="#pricing" className="btn btn-white btn-lg">
              {c.ctaPrimary}
              <ArrowIcon className="btn-arrow" />
            </a>
            <a href="#how" className="btn btn-ghost-light btn-lg">
              {c.ctaSecondary}
            </a>
          </div>
          <p className="final-cta-note">{c.note}</p>
        </div>
      </div>
    </section>
  );
}
