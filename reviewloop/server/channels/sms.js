// SMS channel via the Twilio REST API (plain fetch, no SDK).
// Dry-run mode when credentials are absent.
//
//   TWILIO_ACCOUNT_SID=ACxxxx
//   TWILIO_AUTH_TOKEN=xxxx
//   TWILIO_FROM=+15551234567

export async function sendSms({ to, body }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const auth = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !auth || !from) {
    console.log(`[sms:dry-run] to=${to} body="${body.slice(0, 60)}..."`);
    return { dryRun: true };
  }
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${sid}:${auth}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return { sid: json.sid };
}
