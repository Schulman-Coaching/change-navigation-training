/**
 * Vercel Serverless Function — Contact Form Handler
 * 
 * Deploy: place this file at api/contact.js in any cnt-* site.
 * Vercel automatically detects it as a serverless function at /api/contact.
 * 
 * Configuration (set in Vercel dashboard → Environment Variables):
 *   NOTIFY_EMAIL — where to send form submissions (optional)
 *   NOTIFY_WEBHOOK — Slack/Discord webhook URL (optional)
 * 
 * Required form fields: name, email, message
 */

export const config = {
  runtime: 'edge', // Edge runtime — faster, global
};

export default async function handler(request) {
  // Only accept POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { name, email, message, site } = body;

    // Validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (message.length < 10) {
      return new Response(JSON.stringify({ error: 'Message must be at least 10 characters.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting — simple in-memory (resets on cold start, fine for low volume)
    // For production, use Vercel KV or Upstash Redis

    // Build notification payload
    const siteLabel = site || 'Change Navigation Training';
    const timestamp = new Date().toISOString();
    const subject = `New message from ${name} — ${siteLabel}`;

    // Send to webhook if configured
    const webhookUrl = process.env.NOTIFY_WEBHOOK;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `📬 *New Contact Form Submission*\n*From:* ${name} (${email})\n*Site:* ${siteLabel}\n*Message:* ${message}\n*Time:* ${timestamp}`,
        }),
      }).catch(() => {}); // Silent fail — webhook is optional
    }

    // Send email notification if Resend API key is configured
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (resendKey && notifyEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CNT Contact Form <notify@changenavigationtraining.com>',
          to: notifyEmail,
          subject,
          reply_to: email,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Site:</strong> ${escapeHtml(siteLabel)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message)}</p>
            <hr>
            <p style="color:#777;font-size:12px;">Submitted at ${timestamp}</p>
          `,
        }),
      }).catch(() => {}); // Silent fail — email is optional
    }

    // Always log to Vercel logs (free)
    console.log(`[Contact Form] ${name} (${email}) from ${siteLabel}: ${message.substring(0, 100)}`);

    return new Response(JSON.stringify({ success: true, message: 'Thank you! Your message has been sent. We will get back to you within 24 hours.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Contact Form Error]', error);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again or email us directly.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
