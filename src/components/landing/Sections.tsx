import { useState } from "react";
import { Link } from "react-router-dom";
import Cover from "../shared/Cover";
import { DESIGNS } from "../../data/designs";
import { FORMAT_LIST } from "../../data/config";
import { money } from "../../lib/pricing";

/* ---------------- Stats ---------------- */
export function Stats() {
  const items = [
    { num: "12k+", label: "Books made by families" },
    { num: "90 sec", label: "To design your book" },
    { num: "3–5 days", label: "Printed & shipped" },
    { num: "4.9★", label: "Average rating" },
  ];
  return (
    <section className="stats section-tight">
      <div className="container stats-grid">
        {items.map((it) => (
          <div className="stat" key={it.label}>
            <div className="num">{it.num}</div>
            <div className="label">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Problem / Solution ---------------- */
const swatches = [
  "#FFD6C4", "#C8E6CF", "#FFE3A3", "#D8D4F0", "#FFC9C9", "#Bfe0d6",
  "#FFE3D8", "#cfe8e0", "#ffd9b3",
];
export function Problem() {
  return (
    <section className="section">
      <div className="container problem-grid">
        <div>
          <div className="phone">
            <div className="phone-screen">
              <div className="phone-grid">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} style={{ background: swatches[i % swatches.length] }} />
                ))}
              </div>
              <div className="phone-badge">7,418 photos · 0 printed</div>
            </div>
          </div>
        </div>
        <div>
          <span className="eyebrow">The problem</span>
          <h2>Your best memories are stuck behind a screen.</h2>
          <p className="muted">
            Every parent knows the feeling: your phone is full of photos you
            love, but printing them, choosing layouts, and ordering an album is
            just… too much work. So years go by and the memories stay digital —
            until a phone breaks or gets lost.
          </p>
          <ul className="problem-list">
            <li>
              <span className="ic">😮‍💨</span>
              <div>
                <strong>Too much effort</strong>
                <span>Photo book tools are fiddly and take hours.</span>
              </div>
            </li>
            <li>
              <span className="ic">📱</span>
              <div>
                <strong>iPhone photos are vertical</strong>
                <span>And most albums make them tiny or crop them badly.</span>
              </div>
            </li>
            <li>
              <span className="ic">⏳</span>
              <div>
                <strong>“I’ll do it later”</strong>
                <span>Later never comes, and the kids keep growing up.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
export function HowItWorks() {
  const steps = [
    {
      t: "Upload your favorites",
      d: "Drag in the photos you love straight from your phone or computer. We keep vertical iPhone shots looking gorgeous, never cropped.",
    },
    {
      t: "Pick a design & preview",
      d: "Choose from five beautiful covers. We auto-arrange every page and show you the whole book — flip through it before you buy.",
    },
    {
      t: "We print & ship it",
      d: "Approve your book and we print it on premium lay-flat paper and mail it to your door in 3–5 days. That’s it.",
    },
  ];
  return (
    <section className="section" id="how" style={{ background: "var(--cream-deep)" }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>From camera roll to keepsake in minutes</h2>
          <p>No design skills, no software, no trip to the print shop.</p>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={s.t}>
              <div className="step-num">{i + 1}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
        <div className="center mt-32">
          <Link to="/create" className="btn btn-primary btn-lg">
            Try it now — free to design
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Designs ---------------- */
export function Designs() {
  return (
    <section className="section" id="designs">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">The covers</span>
          <h2>Five designs to match your story</h2>
          <p>Personalize the title and year — every cover is uniquely yours.</p>
        </div>
        <div className="designs-row">
          {DESIGNS.map((d) => (
            <div className="design-card" key={d.id}>
              <Cover design={d} title="Our Story" subtitle="2026" />
              <div className="name">{d.name}</div>
              <div className="muted" style={{ fontSize: ".88rem" }}>
                {d.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Formats ---------------- */
export function Formats() {
  return (
    <section className="section" style={{ background: "var(--cream-deep)" }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Two sizes</span>
          <h2>Made for the way you actually take photos</h2>
          <p>
            Vertical iPhone shots look stunning either way — pick a cozy pocket
            book or a big keepsake album.
          </p>
        </div>
        <div className="formats">
          {FORMAT_LIST.map((f, idx) => (
            <div className={`format-card ${idx === 1 ? "featured" : ""}`} key={f.id}>
              <div className="format-tag">{f.tag}</div>
              <h3>{f.name}</h3>
              <p className="muted" style={{ margin: 0 }}>{f.dimensions}</p>

              <div className="format-visual" style={{ marginTop: 18 }}>
                {idx === 0 ? (
                  <>
                    <div className="fv-page tpl-1" style={{ width: 70, height: 100 }}>
                      <div className="fv-photo" />
                    </div>
                    <div className="fv-page tpl-1" style={{ width: 70, height: 100 }}>
                      <div className="fv-photo" />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="fv-page"
                      style={{
                        width: 100, height: 100,
                        gridTemplateColumns: "1fr 1fr",
                      }}
                    >
                      <div className="fv-photo" />
                      <div className="fv-photo" />
                    </div>
                    <div
                      className="fv-page"
                      style={{
                        width: 100, height: 100,
                        gridTemplateColumns: "1fr 1fr",
                        gridTemplateRows: "1fr 1fr",
                      }}
                    >
                      <div className="fv-photo" />
                      <div className="fv-photo" />
                      <div className="fv-photo" />
                      <div className="fv-photo" />
                    </div>
                  </>
                )}
              </div>

              <p className="muted">{f.description}</p>
              <ul className="format-feats">
                {f.features.map((feat) => (
                  <li key={feat}>{feat}</li>
                ))}
              </ul>
              <div className="format-price">
                {money(f.basePrice)}
                <small> · includes {f.includedPages} pages</small>
              </div>
              <Link to="/create" className="btn btn-primary" style={{ marginTop: 18 }}>
                Choose {f.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing note ---------------- */
export function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <div className="pricing-note">
          <span className="eyebrow" style={{ background: "rgba(255,255,255,.1)", color: "var(--gold)" }}>
            Simple pricing
          </span>
          <h2>Start at <span className="price-big">$39</span></h2>
          <p>
            Every book includes 20 pages. Add as many extra pages as you like —
            just $1.50 a page on the Pocket Book, $2 on the Keepsake. No
            subscriptions, no surprises. Free design, pay only when you order.
          </p>
          <Link to="/create" className="btn btn-primary btn-lg">
            Build my book
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
export function Testimonials() {
  const t = [
    {
      q: "I’d been meaning to print our photos for three years. This took me one nap time. The book is gorgeous.",
      n: "Amelia R.",
      r: "Mom of two",
      c: "#FF7A5C",
    },
    {
      q: "Finally something that makes vertical phone photos look good! The preview sold me — what I saw is exactly what arrived.",
      n: "Marcus T.",
      r: "Dad & weekend photographer",
      c: "#7FB29A",
    },
    {
      q: "Sent one to each grandparent for the holidays. Both cried. Worth every penny.",
      n: "Jas K.",
      r: "Mom of a toddler",
      c: "#3a3f6b",
    },
  ];
  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Loved by families</span>
          <h2>The book parents wish they’d made years ago</h2>
        </div>
        <div className="tcards">
          {t.map((it) => (
            <div className="tcard" key={it.n}>
              <div className="stars">★★★★★</div>
              <blockquote>“{it.q}”</blockquote>
              <div className="who">
                <span className="ava" style={{ background: it.c }}>
                  {it.n[0]}
                </span>
                <div>
                  <strong>{it.n}</strong>
                  <span>{it.r}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const faqs = [
  {
    q: "How do vertical iPhone photos look in the book?",
    a: "Beautifully. The Pocket Book gives each vertical photo a full page of its own. The Keepsake Book intelligently pairs and arranges your photos so portraits and landscapes both look intentional — never cropped awkwardly.",
  },
  {
    q: "Do I have to design anything?",
    a: "No. You upload your favorite photos and we automatically lay out every page. You can reorder photos and add captions if you want, but you don’t have to touch a thing.",
  },
  {
    q: "Can I see the book before I pay?",
    a: "Yes — designing and previewing your full book is completely free. You flip through every page exactly as it will print, and only pay when you’re happy and place your order.",
  },
  {
    q: "How long does shipping take?",
    a: "We print on premium lay-flat paper and ship within 3–5 business days, with tracking. Holiday timelines are shown at checkout.",
  },
  {
    q: "Are my photos private?",
    a: "Always. Your photos are only used to print your book and are never shared or sold. You can delete them anytime.",
  },
];
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Questions</span>
          <h2>Everything you might be wondering</h2>
        </div>
        <div className="faq">
          {faqs.map((f, i) => (
            <div className={`faq-item ${open === i ? "open" : ""}`} key={f.q}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                {f.q}
                <span className="chev">+</span>
              </button>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
export function FinalCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="final-cta">
          <h2>Don’t let another year stay on your phone</h2>
          <p>
            In a few minutes you’ll have a printed memory book your family will
            treasure for decades. Free to design — see it before you buy.
          </p>
          <Link to="/create" className="btn btn-light btn-lg">
            Start your memory book
          </Link>
        </div>
      </div>
    </section>
  );
}
