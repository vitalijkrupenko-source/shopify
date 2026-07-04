// Email channel. Uses SMTP when SMTP_URL is set, otherwise runs in
// dry-run mode (logs what WOULD be sent) so the whole system is testable
// without credentials.
//
//   SMTP_URL=smtps://user:pass@smtp.example.com:465
//   MAIL_FROM="Reviews <reviews@yourdomain.com>"
import nodemailer from 'nodemailer';

let transport = null;

function getTransport() {
  if (!process.env.SMTP_URL) return null;
  if (!transport) transport = nodemailer.createTransport(process.env.SMTP_URL);
  return transport;
}

export async function sendEmail({ to, subject, body }) {
  const t = getTransport();
  if (!t) {
    console.log(`[email:dry-run] to=${to} subject="${subject}"`);
    return { dryRun: true };
  }
  const info = await t.sendMail({
    from: process.env.MAIL_FROM || 'reviews@localhost',
    to,
    subject,
    text: body,
  });
  return { messageId: info.messageId };
}
