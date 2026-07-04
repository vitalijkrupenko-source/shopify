// End-to-end smoke test. Runs the whole funnel in-process with a temp
// data dir and dry-run channels:
//   create business -> enroll (single + CSV + webhook) -> due send fires
//   -> click tracked -> reminders stop -> unsubscribe works -> QR renders.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.NODE_ENV = 'test';
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'reviewloop-'));
process.env.WEBHOOK_SECRET = 'testsecret';

const { app } = await import('../server/index.js');
const { tick } = await import('../server/scheduler.js');
const { load } = await import('../server/store.js');

const server = app.listen(0);
const base = `http://localhost:${server.address().port}`;

async function req(method, p, body, headers = {}) {
  const res = await fetch(base + p, {
    method,
    redirect: 'manual',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
  return res;
}

// 1. create a business
let res = await req('POST', '/api/businesses', {
  name: 'Testaurant',
  placeId: 'ChIJtest123',
  sequence: [{ channel: 'email', delayHours: 0 }, { channel: 'email', delayHours: 48 }],
});
assert.equal(res.status, 201);
const biz = await res.json();
console.log('✓ business created');

// 2. enroll a single customer (delayHours 0 -> due immediately)
res = await req('POST', `/api/businesses/${biz.id}/customers`, {
  name: 'Alice', email: 'alice@example.com',
});
assert.equal(res.status, 201);
assert.equal((await res.json()).enrolled, 1);

// duplicate within 90 days is skipped
res = await req('POST', `/api/businesses/${biz.id}/customers`, { email: 'alice@example.com' });
assert.equal((await res.json()).enrolled, 0);
console.log('✓ enrollment + 90-day dedupe');

// 3. CSV import
res = await req('POST', `/api/businesses/${biz.id}/customers/csv`,
  'name,email,phone\nBob,bob@example.com,\n"Carol, C.",carol@example.com,+15550002222\n',
  { 'Content-Type': 'text/csv' });
const csvOut = await res.json();
assert.equal(csvOut.enrolled, 2);
console.log('✓ CSV import (quoted fields)');

// 4. webhook enrollment (secret enforced)
res = await req('POST', '/api/hooks/visit', { businessId: biz.id, email: 'dave@example.com' });
assert.equal(res.status, 401);
res = await req('POST', '/api/hooks/visit',
  { businessId: biz.id, name: 'Dave', email: 'dave@example.com' },
  { 'x-webhook-secret': 'testsecret' });
assert.equal(res.status, 201);
console.log('✓ webhook enrollment with secret');

// 5. scheduler tick sends due step-0 messages (dry-run email)
const db = load();
// force inside quiet-hours window regardless of when the test runs
const b = db.businesses.find((x) => x.id === biz.id);
b.sendStartHour = 0; b.sendEndHour = 24;
await tick(base);
const alice = db.customers.find((c) => c.email === 'alice@example.com');
assert.equal(alice.step, 1);
assert.equal(alice.status, 'active');
assert.ok(alice.nextSendAt, 'reminder scheduled');
assert.ok(db.events.some((e) => e.type === 'sent' && e.customerId === alice.id));
console.log('✓ scheduler sent step 0 and queued the reminder');

// 6. click tracking: redirect to Google + reminders stop
res = await req('GET', `/r/${alice.token}`);
assert.equal(res.status, 302);
assert.ok(res.headers.get('location').includes('search.google.com/local/writereview'));
assert.equal(alice.status, 'clicked');
assert.equal(alice.nextSendAt, null);
console.log('✓ click tracked, redirected to Google, reminders stopped');

// 7. unsubscribe
const bob = db.customers.find((c) => c.email === 'bob@example.com');
res = await req('GET', `/u/${bob.token}`);
assert.equal(res.status, 200);
assert.equal(bob.status, 'unsubscribed');
console.log('✓ unsubscribe');

// 8. stats + QR poster
res = await req('GET', `/api/businesses/${biz.id}`);
const detail = await res.json();
assert.equal(detail.stats.enrolled, 4);
assert.equal(detail.stats.clicked, 1);
assert.ok(detail.reviewUrl.includes('ChIJtest123'));
res = await req('GET', `/qr/${biz.id}.svg`);
assert.equal(res.status, 200);
assert.ok((await res.text()).includes('<svg'));
console.log('✓ stats + QR poster');

server.close();
console.log('\nAll smoke tests passed.');
