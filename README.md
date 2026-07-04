# Little Chapters 📖

**Turn your camera roll into a keepsake.**

Little Chapters is an online store that lets families turn the photos sitting on
their phones into a beautiful, printed memory book. Parents have thousands of
photos of their kids and almost never print them — this removes all the friction:
upload your favorites, pick a design, preview the whole book, and order it.

This repo contains the full customer-facing web app: a high-converting landing
page **and** the photo-book builder (upload → design → preview → checkout).

---

## ✨ What's inside

### High-converting landing page
- Hero with clear value proposition and primary CTA
- Social proof (stats bar, star ratings, testimonials)
- Problem framing ("your memories are stuck behind a screen")
- 3-step "How it works"
- Showcase of all 5 cover designs
- Two-format comparison + transparent pricing
- FAQ and a final call-to-action

### The book builder (`/create`)
A 5-step guided flow:

1. **Size** — choose a format (see below)
2. **Design** — pick one of 5 cover designs and personalize the title/date
3. **Photos** — drag-and-drop upload, reorder, remove, add captions
4. **Preview** — flip through the *entire* book exactly as it will print, with a
   live order summary
5. **Order** — shipping details and order placement (demo checkout)

### Built for the way people actually take photos
iPhone photos are vertical, so the layout engine is orientation-aware:

- **Pocket Book** (5.5"×7") — **one photo per page**, so vertical shots fill the
  whole page beautifully. From **$39** (20 pages included).
- **Keepsake Book** (8.5"×11") — **smart multi-photo layouts**. The engine looks
  ahead at each photo's orientation and pairs portraits side-by-side, stacks
  landscapes, and builds 3- and 4-photo grids so every page looks designed, not
  crammed. From **$59** (20 pages included).

Pricing is a flat base price (includes 20 pages) plus a small per-extra-page fee,
computed live as photos are added.

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
  data/
    config.ts        Brand, the two formats, and pricing config
    designs.ts       The 5 cover designs (CSS-rendered, no image assets)
  lib/
    types.ts         Photo / BookPage types
    image.ts         File → Photo (measures size, classifies orientation; EXIF-safe)
    layout.ts        Auto-layout engine (photos → laid-out pages)
    pricing.ts       Flat base + per-extra-page pricing
  store/
    BuilderContext.tsx  App state + derived book/price hooks
  components/
    shared/          Logo, reusable Cover renderer
    landing/         Nav, Hero, all landing sections, Footer
    builder/         The 5 step screens + book preview renderer
  pages/
    LandingPage.tsx
    BuilderPage.tsx  Stepper, navigation, confirmation
```

---

## 🔌 Going live (next steps)

The checkout is a working demo — **no payment is taken**. To accept real orders:

- **Payments & fulfillment:** wire the "Place order" action to **Shopify**
  (e.g. create a draft order via the Admin API, or use Shopify Checkout) or to
  **Stripe Checkout**. Pricing is already computed in `src/lib/pricing.ts`.
- **Photo storage:** photos currently live in the browser only (object URLs).
  Upload them to durable storage (e.g. Shopify Files, S3, or Cloudinary) on
  order so the print partner can fetch the originals.
- **Print fulfillment:** connect a print-on-demand book partner (Peecho, Prodigi,
  Blurb API, etc.) and send the ordered page layout + image URLs.

---

## 📁 Also in this repo

- **[`reviewloop/`](reviewloop/)** — ReviewLoop, a standalone automated Google
  review generation system for local businesses (customer enrollment via
  webhook/CSV, timed email/SMS ask sequences, click tracking, QR posters, and a
  funnel dashboard). See its [README](reviewloop/README.md).

---

Made with love, for families.
