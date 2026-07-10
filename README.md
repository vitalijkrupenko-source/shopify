# ReviewRise ⭐

**Več Google ocen. Višje uvrstitve. Več strank.**

ReviewRise is a marketing site for a local-business growth service: it helps
local businesses collect more Google reviews and rank higher in local search.
More reviews mean a higher spot on Google — which means more calls, more jobs
and more revenue.

The site is fully **bilingual (Slovenian ⇄ English)** with a one-click language
switch in the navigation. Slovenian is the default; the visitor's choice is
remembered in `localStorage`.

---

## ✨ What's inside

A single-page, high-converting marketing site:

- **Hero** — value proposition, dual CTAs, trust line, headline stats, and an
  animated Google-reviews dashboard mockup
- **Trust bar** — local businesses that use the service
- **Why it matters** — the case for reviews, backed by stats
- **How it works** — 3 simple steps (connect → invite → grow)
- **Features** — 6 capabilities (automated invitations, bad-experience filter,
  QR codes, rank tracking, AI review replies, review widgets)
- **Results** — headline outcome stats + a customer quote
- **Testimonials** — three local-business reviews
- **Pricing** — three tiers (Starter / Growth / Multi), Growth highlighted
- **FAQ** — accordion of common questions
- **Final CTA** and **footer**

### Language switching
All copy lives in `src/i18n/translations.ts`, keyed by language (`sl` / `en`).
A `LanguageProvider` (`src/i18n/LanguageContext.tsx`) exposes the active
language, a setter, and the resolved translation object via a `useLanguage()`
hook. Switching also updates `<html lang>`, the document title, and the meta
description.

---

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build
```

---

## 🧱 Project structure

```
src/
  i18n/
    translations.ts     All Slovenian + English copy (single source of truth)
    LanguageContext.tsx  Provider, useLanguage() hook, persistence
  components/
    Icons.tsx           Inline SVG icons (stars, Google G, feature glyphs)
    Nav.tsx             Sticky nav, logo, language switch, mobile menu
    Hero.tsx            Hero + animated dashboard mockup
    Sections.tsx        Trust bar, why, how, features, results, testimonials,
                        pricing, FAQ, final CTA
    Footer.tsx          Footer
  App.tsx               Wraps everything in the LanguageProvider
  main.tsx              Entry point
  index.css             Blue design system + all component styles
```

The theme is a trustworthy **blue** palette defined as CSS custom properties at
the top of `src/index.css`.

---

## 🔌 Going live (next steps)

The CTAs are placeholders. To turn this into a working product:

- **Sign-up / auth:** wire the "Start free" and "Log in" actions to your auth
  and onboarding flow.
- **Google integration:** connect the Google Business Profile API to import
  existing reviews and read live ratings/rank.
- **Invitations:** connect an SMS provider (e.g. Twilio) and an email provider
  to send review invitations automatically after a completed job.

---

Made for local businesses that deserve to be found first.
