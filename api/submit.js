// Vercel Serverless function: receive submissions and forward to SendGrid
// Set these environment variables in Vercel: SENDGRID_API_KEY, TO_EMAIL, FROM_EMAIL

const fetch = global.fetch || require('node-fetch');

// Basic in-memory rate limiting (best-effort; ephemeral across cold starts)
const recent = new Map();
const WINDOW_MS = 15 * 1000; // 15s
const MAX_PER_WINDOW = 5;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

  try {
    const now = Date.now();
    const arr = recent.get(ip) || [];
    const filtered = arr.filter(t => now - t < WINDOW_MS);
    filtered.push(now);
    recent.set(ip, filtered);
    if (filtered.length > MAX_PER_WINDOW) {
      return res.status(429).json({ error: 'Too many requests' });
    }
  } catch (e) {}

  let body;
  try {
    body = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { suggestion, email, hp } = body || {};
  if (!suggestion || typeof suggestion !== 'string' || suggestion.trim().length < 3) {
    return res.status(400).json({ error: 'Suggestion required' });
  }

  // honeypot trap
  if (hp && hp.trim().length > 0) {
    // silently accept but discard spam
    return res.status(200).json({ ok: true });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const TO_EMAIL = process.env.TO_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@vercel.app';

  if (!SENDGRID_API_KEY || !TO_EMAIL) {
    return res.status(500).json({ error: 'Server not configured. Set SENDGRID_API_KEY and TO_EMAIL.' });
  }

  const subject = `New SGA suggestion`;
  const content = `Suggestion:\n${suggestion}\n\nEmail: ${email}\nIP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'}`;

  const payload = {
    personalizations: [{ to: [{ email: TO_EMAIL }] }],
    from: { email: FROM_EMAIL },
    subject,
    content: [{ type: 'text/plain', value: content }]
  };

  try {
    const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SENDGRID_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('SendGrid error', r.status, text);
      return res.status(502).json({ error: 'Failed to send' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('submit error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
