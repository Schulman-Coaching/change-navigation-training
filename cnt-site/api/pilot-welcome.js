/**
 * Post-payment Zoom link for the founding pilot.
 *
 * Proposed path (nothing sends until Elie sets env vars — no secrets in this file):
 * 1. Create the $149 Stripe Payment Link. Paste it into STRIPE_LINKS.pilotFounding.
 * 2. Set that link's after-payment redirect to
 *    https://changenavigationtraining.com/pilot/confirmed/
 * 3. In Stripe, add a webhook endpoint: https://changenavigationtraining.com/api/pilot-welcome
 *    Event: checkout.session.completed
 * 4. Set these Vercel env vars (do not commit the values):
 *      STRIPE_WEBHOOK_SECRET   signing secret from the webhook endpoint
 *      PILOT_PAYMENT_LINK_ID   the plink_... id, so membership checkouts are ignored
 *      PILOT_ZOOM_URL          the Zoom link buyers should receive
 *      RESEND_API_KEY          already set
 *      NOTIFY_EMAIL            already set
 *
 * On a matching payment the function emails the buyer PILOT_ZOOM_URL via Resend
 * and notifies NOTIFY_EMAIL that the seat email went out. The Zoom URL is never
 * written into the repo or into logs.
 */

export const config = { runtime: 'edge' };

const FROM = 'Change Navigation Training <welcome@changenavigationtraining.com>';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return json({ error: 'Pilot welcome email is not configured. Set STRIPE_WEBHOOK_SECRET.' }, 503);
  }

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  const valid = await verifyStripeSignature(payload, signature, secret);
  if (!valid) {
    return json({ error: 'Invalid signature' }, 400);
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return json({ error: 'Invalid payload' }, 400);
  }

  if (event.type !== 'checkout.session.completed') {
    return json({ received: true, ignored: event.type });
  }

  const session = event.data?.object || {};
  const expectedLink = process.env.PILOT_PAYMENT_LINK_ID;
  const paymentLink = String(session.payment_link || '');

  if (!expectedLink) {
    await notify('A checkout completed, and PILOT_PAYMENT_LINK_ID is unset, so no Zoom email was sent.');
    return json({ received: true, skipped: 'PILOT_PAYMENT_LINK_ID unset' });
  }

  if (!paymentLink.includes(expectedLink)) {
    return json({ received: true, ignored: 'not the pilot payment link' });
  }

  const buyer = session.customer_details?.email || session.customer_email;
  const zoomUrl = process.env.PILOT_ZOOM_URL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!buyer || !zoomUrl || !resendKey) {
    await notify(
      `Pilot payment received${buyer ? ` from ${buyer}` : ''}. Zoom email was not sent. Check PILOT_ZOOM_URL, RESEND_API_KEY, and the checkout email.`
    );
    return json({ error: 'Pilot welcome email is missing buyer, Zoom URL, or Resend key.' }, 500);
  }

  const sent = await sendEmail(resendKey, {
    to: buyer,
    subject: 'Your Zoom link — Women’s AI Confidence pilot',
    html: buyerHtml(zoomUrl),
  });

  if (!sent) {
    return json({ error: 'Resend did not accept the Zoom email.' }, 500);
  }

  await notify(`Pilot seat confirmed. Zoom link emailed to ${buyer}.`);
  return json({ received: true, emailed: true });
}

function buyerHtml(zoomUrl) {
  const link = escapeHtml(zoomUrl);
  return `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#e0e0e0;background:#0a0a0a;padding:40px 20px;">
  <h1 style="color:#c8963e;font-family:Arial,sans-serif;font-size:28px;">You are in.</h1>
  <p style="font-size:16px;line-height:1.6;">The founding pilot meets on Zoom, Tuesdays November 10, 17, 24, and December 1, 2026. 20:30 Israel time (13:30 ET). 75 minutes.</p>
  <p style="font-size:16px;line-height:1.6;">This is the link for all four sessions:</p>
  <p style="margin:24px 0;"><a href="${link}" style="color:#c8963e;">${link}</a></p>
  <p style="font-size:16px;line-height:1.6;">Keep it. The same link is used each Tuesday.</p>
  <hr style="border-color:#222;margin:32px 0;">
  <p style="font-size:11px;color:#444;">Change Navigation Training</p>
</div>`;
}

async function notify(text) {
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!resendKey || !notifyEmail) {
    console.log(`[Pilot welcome] ${text}`);
    return;
  }
  await sendEmail(resendKey, {
    to: notifyEmail,
    subject: 'Pilot payment',
    html: `<p>${escapeHtml(text)}</p>`,
  });
}

async function sendEmail(resendKey, { to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  }).catch(() => null);
  if (!res || !res.ok) {
    console.error('[Pilot welcome] Resend request failed');
    return false;
  }
  return true;
}

async function verifyStripeSignature(payload, header, secret) {
  if (!header) return false;
  const parts = header.split(',').map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith('v1=')).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${payload}`));
  const hex = [...new Uint8Array(mac)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return signatures.some((signature) => timingSafeEqual(signature, hex));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
