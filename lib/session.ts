// Cookie-based session for a single-user dashboard.
// Token = "<expiryMs>.<hmacHex>" where the HMAC is keyed by DASHBOARD_PASSWORD,
// so changing the password invalidates all sessions. Uses Web Crypto only,
// which keeps it usable from both Node route handlers and Edge middleware.

export const SESSION_COOKIE = "reviewops_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

async function hmacHex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(secret: string): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const sig = await hmacHex(`reviewops:${expiry}`, secret);
  return `${expiry}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined
): Promise<boolean> {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const expiry = Number(token.slice(0, dot));
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const expected = await hmacHex(`reviewops:${expiry}`, secret);
  const actual = token.slice(dot + 1);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  }
  return diff === 0;
}
