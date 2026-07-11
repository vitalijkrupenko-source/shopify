import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import {
  StarIcon,
  CheckIcon,
  ChevronIcon,
  ArrowIcon,
  GoogleGIcon,
} from "./Icons";

export function TrustBar() {
  const { t } = useLanguage();
  return (
    <section className="trustbar">
      <div className="container trustbar-row">
        {t.trust.items.map((item, i) => (
          <span key={i} className="trustbar-item">
            <CheckIcon className="trustbar-check" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export function Problem() {
  const { t } = useLanguage();
  const p = t.problem;
  return (
    <section className="section problem" id="problem">
      <div className="container">
        <div className="section-head">
          <h2>{p.h2}</h2>
          <p className="section-sub">{p.subtitle}</p>
        </div>
        <div className="problem-grid">
          {p.cards.map((c, i) => (
            <div key={i} className="problem-card">
              <span className="problem-num">{i + 1}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Change() {
  const { t } = useLanguage();
  const c = t.change;
  return (
    <section className="section change">
      <div className="container">
        <div className="section-head">
          <h2>{c.h2}</h2>
        </div>
        <div className="change-grid">
          {c.points.map((pt, i) => (
            <div key={i} className="change-item">
              <CheckIcon className="change-check" />
              <div>
                <strong>{pt.title}</strong> <span>{pt.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CaseStudy() {
  const { t } = useLanguage();
  const c = t.caseStudy;
  return (
    <section className="section casestudy" id="rezultati">
      <div className="container">
        <div className="casestudy-card">
          <div className="casestudy-body">
            <span className="casestudy-eyebrow">{c.eyebrow}</span>
            <h2 className="casestudy-h2">{c.h2}</h2>
            <p className="casestudy-context">{c.context}</p>
            <span className="casestudy-pending">{c.pending}</span>
          </div>
          <div className="casestudy-visual" aria-hidden="true">
            <div className="cs-google">
              <GoogleGIcon className="cs-google-icon" />
              <span>{c.result}</span>
            </div>
            <div className="cs-numbers">
              <div className="cs-side">
                <span className="cs-num cs-before">3</span>
                <span className="cs-label">{c.beforeLabel}</span>
              </div>
              <ArrowIcon className="cs-arrow" />
              <div className="cs-side">
                <span className="cs-num cs-after">20</span>
                <span className="cs-label">{c.afterLabel}</span>
              </div>
            </div>
            <div className="cs-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="star" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useLanguage();
  const h = t.how;
  return (
    <section className="section how" id="kako-deluje">
      <div className="container">
        <div className="section-head">
          <h2>{h.h2}</h2>
        </div>
        <div className="how-grid">
          {h.steps.map((s, i) => (
            <div key={i} className="how-card">
              <div className="how-number">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FirstWeek() {
  const { t } = useLanguage();
  const f = t.firstWeek;
  return (
    <section className="section firstweek">
      <div className="container container-narrow">
        <div className="section-head">
          <h2>{f.h2}</h2>
        </div>
        <div className="timeline">
          {f.items.map((it, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-marker">
                <span className="timeline-dot" />
                {i < f.items.length - 1 && <span className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <span className="timeline-day">{it.day}</span>
                <p>{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Cards() {
  const { t } = useLanguage();
  const c = t.cards;
  return (
    <section className="section cards-cmp">
      <div className="container">
        <div className="section-head">
          <h2>{c.h2}</h2>
          <p className="section-sub">{c.subtitle}</p>
        </div>
        <div className="cmp-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th />
                <th className="cmp-col-card">{c.colCard}</th>
                <th className="cmp-col-revju">{c.colRevju}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r, i) => (
                <tr key={i}>
                  <td className="cmp-label">{r.label}</td>
                  <td className="cmp-card">{r.card}</td>
                  <td className="cmp-revju">
                    <CheckIcon className="cmp-check" />
                    {r.revju}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cmp-closing">{c.closing}</p>
      </div>
    </section>
  );
}

export function ForWho() {
  const { t } = useLanguage();
  const f = t.forWho;
  return (
    <section className="section forwho">
      <div className="container">
        <div className="section-head">
          <h2>{f.h2}</h2>
        </div>
        <div className="forwho-tags">
          {f.items.map((it) => (
            <span key={it} className="forwho-tag">
              {it}
            </span>
          ))}
        </div>
        <p className="forwho-closing">{f.closing}</p>
      </div>
    </section>
  );
}

export function Pricing() {
  const { t } = useLanguage();
  const p = t.pricing;
  return (
    <section className="section pricing" id="cenik">
      <div className="container">
        <div className="section-head">
          <h2>{p.h2}</h2>
          <p className="section-sub">{p.subtitle}</p>
        </div>
        <div className="pricing-grid pricing-grid-2">
          {p.plans.map((plan, i) => {
            const featured = !!plan.popular;
            return (
              <div
                key={i}
                className={"price-card" + (featured ? " is-featured" : "")}
              >
                {featured && <span className="price-tag">{p.popular}</span>}
                <h3 className="price-name">{plan.name}</h3>
                <div className="price-amount">
                  <strong>{plan.price}</strong>
                  <span>{p.perMonth}</span>
                </div>
                <p className="price-desc">{plan.tagline}</p>
                <a href="#rezervacija" className={"btn btn-block " + (featured ? "btn-primary" : "btn-outline")}>
                  {plan.cta}
                </a>
                <ul className="price-features">
                  {featured && (
                    <li className="price-included">{p.plansIncluded}</li>
                  )}
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
        <p className="pricing-below">{p.below}</p>
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
          <h2>{f.h2}</h2>
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
          <h2>{c.h2}</h2>
          <p>{c.subtitle}</p>
          <div className="final-cta-actions">
            <a href="#rezervacija" className="btn btn-white btn-lg">
              {c.cta}
              <ArrowIcon className="btn-arrow" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Booking() {
  const { t } = useLanguage();
  const b = t.booking;
  const [sent, setSent] = useState(false);
  return (
    <section className="section booking" id="rezervacija">
      <div className="container container-narrow">
        <div className="section-head">
          <h2>{b.title}</h2>
          <p className="section-sub">{b.subtitle}</p>
        </div>
        <form
          className="booking-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="booking-fields">
            <input required placeholder={b.name} aria-label={b.name} />
            <input required placeholder={b.business} aria-label={b.business} />
            <input
              required
              type="tel"
              placeholder={b.phone}
              aria-label={b.phone}
            />
            <input
              type="url"
              placeholder={b.profile}
              aria-label={b.profile}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block">
            {b.submit}
          </button>
          <p className="booking-note">{b.note}</p>
          {sent && (
            <p className="booking-sent" role="status">
              ✓
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
