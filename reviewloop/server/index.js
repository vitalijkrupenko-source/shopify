import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

import { load, save, flush, id, token, logEvent } from './store.js';
import { csvToCustomers } from './csv.js';
import { DEFAULT_SEQUENCE, DEFAULT_TEMPLATES } from './templates.js';
import { startScheduler, sendStep } from './scheduler.js';
import { reviewUrl, findPlace, placesEnabled } from './google.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4000);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.text({ type: ['text/csv', 'text/plain'], limit: '5mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const db = load();

// --- helpers ---------------------------------------------------------------

function findBiz(req, res) {
  const biz = db.businesses.find((b) => b.id === req.params.id);
  if (!biz) res.status(404).json({ error: 'business not found' });
  return biz;
}

function bizReviewUrl(biz) {
  return biz.reviewLink || (biz.placeId ? reviewUrl(biz.placeId) : null);
}

function bizStats(biz) {
  const customers = db.customers.filter((c) => c.businessId === biz.id);
  const sent = db.events.filter((e) => e.businessId === biz.id && e.type === 'sent').length;
  const clicked = customers.filter((c) => c.clickedAt).length;
  const hist = biz.ratingHistory || [];
  const reviewsGained =
    hist.length >= 2 ? hist[hist.length - 1].total - hist[0].total : null;
  const messaged = customers.filter((c) => c.step > 0).length;
  return {
    enrolled: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    sent,
    clicked,
    clickRate: messaged ? +(clicked / messaged).toFixed(3) : 0,
    unsubscribed: customers.filter((c) => c.status === 'unsubscribed').length,
    reviewsGained,
    currentRating: hist.length ? hist[hist.length - 1].rating : null,
    currentTotal: hist.length ? hist[hist.length - 1].total : null,
  };
}

function enroll(biz, { name, email, phone, visitedAt }) {
  email = (email || '').trim().toLowerCase() || null;
  phone = (phone || '').replace(/[^\d+]/g, '') || null;
  if (!email && !phone) return { skipped: 'no contact info' };

  // Don't re-ask the same person within 90 days.
  const cutoff = Date.now() - 90 * 24 * 3600_000;
  const dupe = db.customers.find(
    (c) =>
      c.businessId === biz.id &&
      new Date(c.createdAt).getTime() > cutoff &&
      ((email && c.email === email) || (phone && c.phone === phone))
  );
  if (dupe) return { skipped: 'duplicate within 90 days', id: dupe.id };

  const visited = visitedAt ? new Date(visitedAt) : new Date();
  const firstDelay = (biz.sequence?.[0]?.delayHours ?? 3) * 3600_000;
  const customer = {
    id: id('cus'),
    businessId: biz.id,
    name: (name || '').trim() || null,
    email,
    phone,
    visitedAt: visited.toISOString(),
    status: 'active',
    step: 0,
    token: token(),
    clickedAt: null,
    nextSendAt: new Date(Math.max(Date.now(), visited.getTime() + firstDelay)).toISOString(),
    createdAt: new Date().toISOString(),
  };
  db.customers.push(customer);
  logEvent('enrolled', biz.id, customer.id, {});
  save();
  return { id: customer.id };
}

// --- API: businesses ---------------------------------------------------------

app.get('/api/overview', (_req, res) => {
  res.json({
    placesEnabled: placesEnabled(),
    emailLive: Boolean(process.env.SMTP_URL),
    smsLive: Boolean(process.env.TWILIO_ACCOUNT_SID),
    businesses: db.businesses.map((b) => ({ ...b, stats: bizStats(b) })),
  });
});

app.post('/api/businesses', (req, res) => {
  const { name, placeId, reviewLink } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  if (!placeId && !reviewLink)
    return res.status(400).json({ error: 'placeId or reviewLink is required' });
  const biz = {
    id: id('biz'),
    name: String(name).trim(),
    placeId: placeId || null,
    reviewLink: reviewLink || null,
    sequence: req.body.sequence || structuredClone(DEFAULT_SEQUENCE),
    templates: req.body.templates || {},
    sendStartHour: req.body.sendStartHour ?? 9,
    sendEndHour: req.body.sendEndHour ?? 20,
    dailyCap: req.body.dailyCap ?? 200,
    paused: false,
    ratingHistory: [],
    createdAt: new Date().toISOString(),
  };
  db.businesses.push(biz);
  save();
  res.status(201).json(biz);
});

app.get('/api/businesses/:id', (req, res) => {
  const biz = findBiz(req, res);
  if (!biz) return;
  const customers = db.customers
    .filter((c) => c.businessId === biz.id)
    .map(({ token: _t, ...c }) => c) // don't leak tokens to the dashboard
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({
    ...biz,
    reviewUrl: bizReviewUrl(biz),
    stats: bizStats(biz),
    customers: customers.slice(0, 500),
    defaultTemplates: DEFAULT_TEMPLATES,
  });
});

app.patch('/api/businesses/:id', (req, res) => {
  const biz = findBiz(req, res);
  if (!biz) return;
  const allowed = [
    'name', 'placeId', 'reviewLink', 'sequence', 'templates',
    'sendStartHour', 'sendEndHour', 'dailyCap', 'paused',
  ];
  for (const k of allowed) if (k in req.body) biz[k] = req.body[k];
  save();
  res.json(biz);
});

app.delete('/api/businesses/:id', (req, res) => {
  const biz = findBiz(req, res);
  if (!biz) return;
  db.businesses = db.businesses.filter((b) => b.id !== biz.id);
  db.customers = db.customers.filter((c) => c.businessId !== biz.id);
  Object.assign(db, { businesses: db.businesses, customers: db.customers });
  save();
  res.json({ ok: true });
});

// Optional Place ID lookup (needs GOOGLE_MAPS_API_KEY).
app.get('/api/find-place', async (req, res) => {
  if (!placesEnabled())
    return res.status(400).json({ error: 'GOOGLE_MAPS_API_KEY not configured' });
  try {
    res.json({ result: await findPlace(String(req.query.q || '')) });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// --- API: customers / enrollment ---------------------------------------------

app.post('/api/businesses/:id/customers', (req, res) => {
  const biz = findBiz(req, res);
  if (!biz) return;
  const list = Array.isArray(req.body.customers) ? req.body.customers : [req.body];
  const results = list.map((c) => enroll(biz, c));
  res.status(201).json({ results, enrolled: results.filter((r) => !r.skipped).length });
});

app.post('/api/businesses/:id/customers/csv', (req, res) => {
  const biz = findBiz(req, res);
  if (!biz) return;
  const rows = csvToCustomers(String(req.body || ''));
  const results = rows.map((c) => enroll(biz, c));
  res.status(201).json({
    parsed: rows.length,
    enrolled: results.filter((r) => !r.skipped).length,
    skipped: results.filter((r) => r.skipped).length,
  });
});

// Webhook for POS / Shopify / booking systems: enroll a customer on each
// completed transaction. Protect with WEBHOOK_SECRET.
app.post('/api/hooks/visit', (req, res) => {
  const secret = process.env.WEBHOOK_SECRET;
  if (secret && req.get('x-webhook-secret') !== secret)
    return res.status(401).json({ error: 'bad secret' });
  const { businessId, name, email, phone, visitedAt } = req.body || {};
  const biz = db.businesses.find((b) => b.id === businessId);
  if (!biz) return res.status(404).json({ error: 'business not found' });
  res.status(201).json(enroll(biz, { name, email, phone, visitedAt }));
});

// Send the first-step message to one customer right now (for testing).
app.post('/api/businesses/:id/send-now/:customerId', async (req, res) => {
  const biz = findBiz(req, res);
  if (!biz) return;
  const customer = db.customers.find(
    (c) => c.id === req.params.customerId && c.businessId === biz.id
  );
  if (!customer) return res.status(404).json({ error: 'customer not found' });
  try {
    const sent = await sendStep(biz, customer, BASE_URL);
    save();
    res.json({ sent });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// --- public endpoints: tracking, unsubscribe, QR -------------------------------

// Tracked redirect: customer clicked the review link.
app.get('/r/:token', (req, res) => {
  const customer = db.customers.find((c) => c.token === req.params.token);
  if (!customer) return res.status(404).send('Link not found.');
  const biz = db.businesses.find((b) => b.id === customer.businessId);
  const url = biz && bizReviewUrl(biz);
  if (!url) return res.status(404).send('Business not found.');
  if (!customer.clickedAt) {
    customer.clickedAt = new Date().toISOString();
    if (customer.status === 'active') customer.status = 'clicked';
    customer.nextSendAt = null; // they engaged — stop reminders
    logEvent('clicked', biz.id, customer.id, {});
    save();
  }
  res.redirect(302, url);
});

app.get('/u/:token', (req, res) => {
  const customer = db.customers.find((c) => c.token === req.params.token);
  if (customer && customer.status !== 'unsubscribed') {
    customer.status = 'unsubscribed';
    customer.nextSendAt = null;
    logEvent('unsubscribed', customer.businessId, customer.id, {});
    save();
  }
  res
    .type('html')
    .send(`<meta name="viewport" content="width=device-width,initial-scale=1">
<div style="font-family:system-ui;max-width:32rem;margin:4rem auto;text-align:center">
<h2>You're unsubscribed.</h2><p>You won't receive any more review requests from us.</p></div>`);
});

// Printable in-store QR poster.
app.get('/qr/:id.svg', async (req, res) => {
  const biz = db.businesses.find((b) => b.id === req.params.id);
  const url = biz && bizReviewUrl(biz);
  if (!url) return res.status(404).send('Not found');
  const svg = await QRCode.toString(url, { type: 'svg', margin: 1, width: 512 });
  res.type('image/svg+xml').send(svg);
});

app.get('/qr/:id', (req, res) => {
  const biz = db.businesses.find((b) => b.id === req.params.id);
  if (!biz || !bizReviewUrl(biz)) return res.status(404).send('Not found');
  res.type('html').send(`<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${biz.name} — Review us</title>
<style>
  body{font-family:Georgia,serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .poster{text-align:center;padding:3rem;max-width:34rem}
  h1{font-size:2.2rem;margin:0 0 .5rem}
  p{font-size:1.2rem;color:#444;margin:0 0 2rem}
  img{width:min(70vw,320px)}
  .stars{color:#f5a623;font-size:2rem;letter-spacing:.2rem;margin-bottom:1rem}
  @media print {.no-print{display:none}}
</style>
<div class="poster">
  <div class="stars">★★★★★</div>
  <h1>Enjoyed your visit to ${biz.name}?</h1>
  <p>Scan to leave us an honest Google review — it takes 60 seconds and means the world to our small business.</p>
  <img src="/qr/${biz.id}.svg" alt="QR code to review ${biz.name} on Google">
  <p class="no-print" style="margin-top:2rem;font-size:.9rem"><a href="javascript:print()">Print this poster</a></p>
</div>`);
});

// --- boot ----------------------------------------------------------------------

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`ReviewLoop running at ${BASE_URL}`);
    console.log(`  email: ${process.env.SMTP_URL ? 'LIVE' : 'dry-run (set SMTP_URL)'}`);
    console.log(`  sms:   ${process.env.TWILIO_ACCOUNT_SID ? 'LIVE' : 'dry-run (set TWILIO_* vars)'}`);
    console.log(`  places api: ${placesEnabled() ? 'enabled' : 'off (set GOOGLE_MAPS_API_KEY)'}`);
    startScheduler(BASE_URL);
  });
  process.on('SIGINT', () => { flush(); process.exit(0); });
  process.on('SIGTERM', () => { flush(); process.exit(0); });
}

export { app, BASE_URL };
