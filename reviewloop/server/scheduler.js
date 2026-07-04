// The automation heart: a 60-second tick that sends every due review
// request, respecting quiet hours and each business's daily send cap.
// Also polls Google once a day for live rating/review counts.
import { load, save, logEvent } from './store.js';
import { templateFor, render } from './templates.js';
import { sendEmail } from './channels/email.js';
import { sendSms } from './channels/sms.js';
import { reviewUrl, fetchRating, placesEnabled } from './google.js';

const TICK_MS = 60_000;

export function startScheduler(baseUrl) {
  const timer = setInterval(() => tick(baseUrl).catch((e) => console.error('[scheduler]', e)), TICK_MS);
  timer.unref?.();
  // First tick shortly after boot so restarts don't delay due sends.
  setTimeout(() => tick(baseUrl).catch((e) => console.error('[scheduler]', e)), 2_000).unref?.();
}

function withinQuietHours(biz, now = new Date()) {
  // Sends allowed between sendStartHour and sendEndHour, local server time.
  const start = biz.sendStartHour ?? 9;
  const end = biz.sendEndHour ?? 20;
  const h = now.getHours();
  return h >= start && h < end;
}

function sentTodayCount(db, bizId, now = new Date()) {
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  return db.events.filter(
    (e) => e.businessId === bizId && e.type === 'sent' && new Date(e.at) >= dayStart
  ).length;
}

export async function tick(baseUrl) {
  const db = load();
  const now = new Date();

  for (const biz of db.businesses) {
    if (biz.paused) continue;
    if (!withinQuietHours(biz, now)) continue;

    const cap = biz.dailyCap ?? 200;
    let sentToday = sentTodayCount(db, biz.id, now);

    const due = db.customers.filter(
      (c) =>
        c.businessId === biz.id &&
        c.status === 'active' &&
        c.nextSendAt &&
        new Date(c.nextSendAt) <= now
    );

    for (const customer of due) {
      if (sentToday >= cap) break;
      try {
        const advanced = await sendStep(biz, customer, baseUrl);
        if (advanced) sentToday++;
      } catch (e) {
        console.error(`[send] ${customer.id}:`, e.message);
        // Back off an hour on failure rather than hot-looping.
        customer.nextSendAt = new Date(now.getTime() + 3600_000).toISOString();
      }
    }
  }
  save();

  await maybePollRatings(db, now);
}

// Sends the customer's current sequence step. Returns true if a message
// went out. Advances the pointer or completes the sequence.
export async function sendStep(biz, customer, baseUrl) {
  const sequence = biz.sequence ?? [];
  const stepIndex = customer.step ?? 0;
  const step = sequence[stepIndex];
  if (!step) {
    customer.status = 'completed';
    customer.nextSendAt = null;
    return false;
  }

  const channel = step.channel === 'sms' && customer.phone ? 'sms' : 'email';
  if (channel === 'email' && !customer.email) {
    // Can't reach this customer on this step; skip forward.
    advance(biz, customer, stepIndex);
    return false;
  }

  const link = `${baseUrl}/r/${customer.token}`;
  const unsubscribe = `${baseUrl}/u/${customer.token}`;
  const vars = {
    name: customer.name || 'there',
    business: biz.name,
    link,
    unsubscribe,
  };
  const tpl = templateFor(biz, stepIndex, channel);

  if (channel === 'sms') {
    await sendSms({ to: customer.phone, body: render(tpl.body, vars) });
  } else {
    await sendEmail({
      to: customer.email,
      subject: render(tpl.subject || 'How was your visit?', vars),
      body: render(tpl.body, vars),
    });
  }

  logEvent('sent', biz.id, customer.id, { step: stepIndex, channel });
  advance(biz, customer, stepIndex);
  return true;
}

function advance(biz, customer, stepIndex) {
  const sequence = biz.sequence ?? [];
  const next = sequence[stepIndex + 1];
  customer.step = stepIndex + 1;
  if (next) {
    customer.nextSendAt = new Date(Date.now() + next.delayHours * 3600_000).toISOString();
  } else {
    customer.status = 'completed';
    customer.nextSendAt = null;
  }
}

// --- daily Google rating polling -----------------------------------------

let lastPollDay = null;

async function maybePollRatings(db, now) {
  if (!placesEnabled()) return;
  const day = now.toISOString().slice(0, 10);
  if (day === lastPollDay) return;
  lastPollDay = day;

  for (const biz of db.businesses) {
    if (!biz.placeId) continue;
    try {
      const r = await fetchRating(biz.placeId);
      if (!r) continue;
      biz.ratingHistory = biz.ratingHistory || [];
      biz.ratingHistory.push({ date: day, rating: r.rating, total: r.total });
      if (biz.ratingHistory.length > 400) biz.ratingHistory.shift();
      logEvent('rating_poll', biz.id, null, r);
    } catch (e) {
      console.error(`[rating poll] ${biz.name}:`, e.message);
    }
  }
  save();
}

export { reviewUrl };
