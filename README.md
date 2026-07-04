# ReviewOps

Single-user dashboard for a Google-review agency: prospect pipeline, automatic
daily review tracking via the Google Places API, and before/after growth charts
you can use as proof of results.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · Postgres (Neon) · Vercel

## Features

- **Dashboard** (`/`) — KPI cards (prospects, emails this week, calls booked, pilots, clients, total reviews generated, MRR) and a "stale prospects" follow-up list (contacted, no activity for 5+ days).
- **Pipeline** (`/pipeline`) — Kanban board across Prospect → Contacted → Replied → Call booked → Pilot → Client → Lost. Drag cards between columns (or use the select on touch devices); stage changes are logged automatically, and moving into Pilot/Client sets `pilotStartDate`/`clientSince` if unset.
- **Business detail** (`/business/[id]`) — inline-editable fields, review-growth and rating charts with Pilot/Client start markers, "Fetch now" snapshot button, Google Place ID finder, activity timeline with quick-add.
- **Clients** (`/clients`) — screenshot-friendly results table for pilots/clients: reviews at start → now, delta, rating change, 90-day sparkline, fee. Sortable by column.
- **Import** (`/import`) — CSV upload with preview. Columns: `name, city, rating, review_count, competitor, competitor_reviews, phone, email, notes`. Creates PROSPECT businesses + an initial snapshot.
- **Daily tracking** — `/api/cron/snapshot` fetches `rating` + `userRatingCount` for every business with a Place ID (Vercel Cron, 06:00 UTC daily).

## Local development

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, DASHBOARD_PASSWORD, GOOGLE_PLACES_API_KEY, CRON_SECRET
npx prisma migrate dev    # create tables
npx prisma db seed        # 3 demo businesses
npm run dev               # http://localhost:3000
```

Log in with the value of `DASHBOARD_PASSWORD`.

## Deploying to Vercel

1. **Push this repo to GitHub** (already done if you're reading this there).
2. **Create the database** — in [Neon](https://neon.tech), create a project and copy the **pooled** connection string.
3. **Import the repo in Vercel** — [vercel.com/new](https://vercel.com/new) → select the repo → Framework preset "Next.js" (auto-detected; `vercel.json` only adds the cron).
4. **Set environment variables** (Project → Settings → Environment Variables, all environments):
   - `DATABASE_URL` — the Neon pooled connection string
   - `DASHBOARD_PASSWORD` — your login password
   - `GOOGLE_PLACES_API_KEY` — Google Cloud key with **Places API (New)** enabled
   - `CRON_SECRET` — `openssl rand -hex 32`; Vercel Cron automatically sends it as `Authorization: Bearer <CRON_SECRET>`
5. **Deploy**, then run the migrations against Neon from your machine:
   ```bash
   DATABASE_URL="<neon-direct-connection-string>" npx prisma migrate deploy
   ```
   (Use Neon's *direct* — non-pooled — connection string for migrations.)
6. **Confirm the cron** — Project → Settings → Cron Jobs should show `/api/cron/snapshot` at `0 6 * * *`. Trigger it once manually:
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" https://<your-app>.vercel.app/api/cron/snapshot
   ```
   It returns `{ "tracked": N, "snapshotted": N, "failed": [] }` and snapshots appear on business pages.

## Guardrails

- Charts only ever show real fetched snapshot numbers — never fabricate data (the seed data is clearly labelled "(demo)"; delete it before real use).
- Only reference clients on the results page who agreed to be referenced.
- Review requests must go to **all** customers (no review gating), per Google policy — this dashboard tracks results, it does not filter who gets asked.
