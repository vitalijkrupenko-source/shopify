// Default message templates and rendering.
// Placeholders: {{name}} {{business}} {{link}} {{unsubscribe}}
// Templates intentionally ask EVERY customer for an honest review —
// filtering by sentiment first ("review gating") violates Google policy
// and the FTC's rule on consumer reviews.

export const DEFAULT_SEQUENCE = [
  { channel: 'email', delayHours: 3 },
  { channel: 'email', delayHours: 72 },
  { channel: 'sms', delayHours: 168 },
];

export const DEFAULT_TEMPLATES = {
  email_0: {
    subject: 'How was your visit to {{business}}?',
    body: `Hi {{name}},

Thanks for choosing {{business}} — we hope you had a great experience.

Would you take 60 seconds to share an honest review on Google? It genuinely helps neighbors find us, and it helps us improve:

{{link}}

Thank you so much!
— The team at {{business}}

Don't want these emails? Unsubscribe: {{unsubscribe}}`,
  },
  email_1: {
    subject: 'A quick favor, {{name}}?',
    body: `Hi {{name}},

Just a gentle nudge — if you have a minute, an honest Google review of your recent visit to {{business}} would mean a lot to our small team:

{{link}}

Whatever you thought — good or bad — we'd love to hear it.

Thanks!
— {{business}}

Unsubscribe: {{unsubscribe}}`,
  },
  sms_0: {
    body: `{{business}}: thanks for your visit! If you have a minute, we'd love an honest Google review: {{link}} Reply STOP to opt out.`,
  },
};

export function render(str, vars) {
  return String(str).replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

// Pick the template for a given step: business overrides win, then defaults.
// Email steps fall back through email_N -> email_1 -> email_0; sms -> sms_0.
export function templateFor(business, stepIndex, channel) {
  const custom = business.templates || {};
  const keys =
    channel === 'sms'
      ? [`sms_${stepIndex}`, 'sms_0']
      : [`email_${stepIndex}`, 'email_1', 'email_0'];
  for (const k of keys) {
    if (custom[k]) return custom[k];
    if (DEFAULT_TEMPLATES[k]) return DEFAULT_TEMPLATES[k];
  }
  return DEFAULT_TEMPLATES.email_0;
}
