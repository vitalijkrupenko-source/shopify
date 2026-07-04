// Tiny JSON-file datastore with atomic writes.
// Right-sized for a local-business tool (hundreds of businesses,
// tens of thousands of customers). Swap for SQLite/Postgres if you outgrow it.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const EMPTY = { businesses: [], customers: [], events: [] };

let db = null;
let writeTimer = null;

export function load() {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  try {
    db = { ...EMPTY, ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) };
  } catch {
    db = structuredClone(EMPTY);
  }
  return db;
}

export function save() {
  // Debounce bursts of writes; flush at most every 250ms.
  if (writeTimer) return;
  writeTimer = setTimeout(() => {
    writeTimer = null;
    flush();
  }, 250);
  writeTimer.unref?.();
}

export function flush() {
  if (!db) return;
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

export function id(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
}

export function token() {
  return crypto.randomBytes(16).toString('hex');
}

export function logEvent(type, businessId, customerId, meta = {}) {
  const d = load();
  d.events.push({ at: new Date().toISOString(), type, businessId, customerId, meta });
  // Keep the event log bounded.
  if (d.events.length > 50_000) d.events.splice(0, d.events.length - 50_000);
  save();
}
