# ReviewLoop ⭐

**Automated Google review generation for local businesses — the legit kind.**

Most happy customers never leave a review because nobody asks them at the right
moment, with a link that takes zero effort. ReviewLoop fixes exactly that:

1. A customer visits / buys something.
2. They're **enrolled automatically** (webhook from your POS or Shopify, a CSV
   export, or one click in the dashboard).
3. A few hours later they get a friendly **email asking for an honest Google
   review**, with a one-tap deep link straight into the "write a review" box.
4. If they don't act, up to two **timed reminders** go out (email or SMS) — and
   stop instantly the moment they click or unsubscribe.
5. The dashboard shows the funnel: enrolled → sent → clicked → **reviews
   actually gained** (verified against Google's live review count).

Plus a **printable QR poster** for the counter, so walk-ins can scan and review
on the spot.

---

## Quick start

```bash
cd reviewloop
npm install
npm start          # dashboard at http://localhost:4000
```

That's it — with no credentials configured, email/SMS run in **dry-run mode**
(logged to the console), so you can try the whole flow safely. Run the
end-to-end test with `npm test`.

### Go live

Copy `.env.example` to `.env` values into your environment. Each integration is
independent and optional:

| Variable | Enables |
|---|---|
| `SMTP_URL`, `MAIL_FROM` | Real email sending (any SMTP provider) |
| `TWILIO_ACCOUNT_SID/_AUTH_TOKEN/_FROM` | Real SMS sending |
| `GOOGLE_MAPS_API_KEY` | Place ID lookup + daily live review-count tracking |
| `WEBHOOK_SECRET` | Auth for the POS/Shopify enrollment webhook |
| `BASE_URL` | Public URL used in links sent to customers |

## How it works

```
POS / Shopify / CSV / dashboard
        │  enroll customer
        ▼
┌─────────────────────┐   every 60s   ┌──────────────────────────┐
│ customers + step    │◄──────────────│ scheduler                │
│ pointer + nextSendAt│               │ quiet hours · daily cap  │
└─────────────────────┘               └────────────┬─────────────┘
                                                   │ send step N
                                     email (SMTP) / SMS (Twilio)
                                                   │
                        customer clicks  /r/:token │
                                                   ▼
                     click logged, reminders stop, 302 →
                     https://search.google.com/local/writereview?placeid=…
```

- **Sequences** are per-business and editable in the dashboard (channel + delay
  per step; sensible default: email after 3h, email after 3 days, SMS after 7 days).
- **Templates** support `{{name}} {{business}} {{link}} {{unsubscribe}}` and can
  be overridden per business via `PATCH /api/businesses/:id` (`templates.email_0`, etc.).
- **Storage** is a JSON file (`data/db.json`) — zero setup, easy to inspect,
  simple to migrate to a real DB later.

## API

| Endpoint | Purpose |
|---|---|
| `POST /api/businesses` | Add a business (`name` + `placeId` or `reviewLink`) |
| `PATCH /api/businesses/:id` | Edit sequence, templates, caps, pause |
| `POST /api/businesses/:id/customers` | Enroll one customer or `{customers:[…]}` |
| `POST /api/businesses/:id/customers/csv` | Bulk import (CSV body) |
| `POST /api/hooks/visit` | **Automation webhook** — fire on every completed sale |
| `GET /api/businesses/:id` | Stats + customer list |
| `GET /api/find-place?q=…` | Look up a Place ID (needs Places key) |
| `GET /r/:token` | Tracked redirect to the Google review box |
| `GET /u/:token` | One-click unsubscribe |
| `GET /qr/:id` | Printable in-store QR poster |

### Hooking up Shopify

Add a small automation (Shopify Flow, a webhook worker, or Zapier) that fires on
`orders/paid` and posts:

```bash
curl -X POST https://your-host/api/hooks/visit \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{"businessId":"biz_xxx","name":"Jane","email":"jane@example.com"}'
```

## Staying on the right side of the rules

ReviewLoop is built to comply with Google's review policies and the FTC's rule
on consumer reviews (16 CFR Part 465):

- ✅ Asks **every** customer for an **honest** review — no sentiment filtering /
  "review gating" (banned by Google and the FTC).
- ✅ No incentives, discounts, or rewards for reviews in any template.
- ✅ Never writes, generates, or posts reviews itself — real customers, real words.
- ✅ Unsubscribe link in every email, `Reply STOP` in every SMS, 90-day
  re-contact cooldown, quiet hours, and daily send caps.

Keep it that way: don't add incentives to templates, and don't cherry-pick who
gets asked based on how happy they seemed.
