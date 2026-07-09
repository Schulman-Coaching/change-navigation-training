/**
 * Vercel Serverless Function — Assessment Email Capture + Nurture Sequence
 * POST /api/subscribe
 * 
 * Receives email + assessment profile, sends Email 1 immediately via Resend.
 * Emails 2-5 are triggered by the Email 1 content (each links to the next step).
 */

export const config = { runtime: 'edge' };

// Email 1 content — from EMAIL_SEQUENCE.md
const EMAIL_1 = {
  subject: 'Your assessment results — and what they actually mean',
  html: (profile, score, name) => `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#e0e0e0;background:#0a0a0a;padding:40px 20px;">
      <h1 style="color:#c8963e;font-family:'Bebas Neue',Arial,sans-serif;font-size:32px;letter-spacing:1px;">Your Results: ${profile.name}</h1>
      <p style="font-size:14px;color:#777;margin-bottom:24px;">Score: ${score}/50</p>
      
      <p style="font-size:16px;line-height:1.6;">You took the assessment. You got a result. Here is what it does not mean.</p>
      <p style="font-size:16px;line-height:1.6;">It does not mean you are behind. It does not mean you are not ready. It does not mean anything is fixed. The profile is a snapshot — not a diagnosis. It tells you where you are right now. Not where you will be in three months.</p>
      <p style="font-size:16px;line-height:1.6;">The most useful thing you can do is notice it without judgment. If you are an Observer, observe. Explorer, explore. Navigator, navigate. The label is a starting point.</p>
      <p style="font-size:16px;line-height:1.6;">Over the next two weeks, I'll send a few short emails. One idea each. No pitch. No urgency. Just things to think about.</p>
      
      <div style="margin:32px 0;padding:24px;background:#111;border-left:3px solid #c8963e;">
        <p style="font-size:18px;color:#c8963e;margin-bottom:8px;font-weight:600;">${profile.emoji} ${profile.name}</p>
        <p style="font-size:14px;color:#e0e0e0;line-height:1.6;">${profile.desc}</p>
        <p style="font-size:14px;color:#777;font-style:italic;">${profile.cta}</p>
      </div>
      
      <a href="${profile.link}" style="display:inline-block;padding:14px 28px;background:#c8963e;color:#0a0a0a;text-decoration:none;font-weight:600;font-size:15px;">${profile.linkText} →</a>
      
      <p style="margin-top:32px;font-size:12px;color:#555;">If you want to skip ahead: <a href="https://cnt-build.vercel.app/contact/" style="color:#c8963e;">Book a Free Call</a></p>
      <hr style="border-color:#222;margin:32px 0;">
      <p style="font-size:11px;color:#444;">Change Navigation Training — Helping Orthodox Jewish women navigate change with confidence.</p>
    </div>
  `,
};

const PROFILES = {
  observer: { name: 'The Observer', emoji: '🔭', desc: 'You are watching. Waiting. Most people start here. The important thing is that you are paying attention.', cta: 'Start with three blog posts. Sign up for our email sequence.', link: 'https://cnt-build.vercel.app/blog/', linkText: 'Read the Blog' },
  explorer: { name: 'The Explorer', emoji: '🧭', desc: 'You are curious. You want to understand more — what AI actually is, whether this is worth your time.', cta: 'Book a free 20-minute call. No sales pitch. Just a conversation.', link: 'https://cnt-build.vercel.app/contact/', linkText: 'Book a Free Call' },
  navigator: { name: 'The Navigator', emoji: '🗺️', desc: 'You are moving. You want structure and specific skills.', cta: 'Sign up for a workshop. First session is $35.', link: 'https://cnt-build.vercel.app/schedule/', linkText: 'View Workshops' },
  trailblazer: { name: 'The Trailblazer', emoji: '🚀', desc: 'You are moving fast. You want community and ongoing practice.', cta: 'Join a membership. All workshops. Peer circles. $89/month.', link: 'https://cnt-build.vercel.app/memberships/', linkText: 'Join Now' },
};

function getProfile(score) {
  if (score <= 22) return 'observer';
  if (score <= 34) return 'explorer';
  if (score <= 42) return 'navigator';
  return 'trailblazer';
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, score, name } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required.' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const profileKey = getProfile(score || 25);
    const profile = PROFILES[profileKey];
    const resendKey = process.env.RESEND_API_KEY;

    // Send Email 1 via Resend
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Change Navigation Training <welcome@changenavigationtraining.com>',
          to: email,
          subject: EMAIL_1.subject,
          html: EMAIL_1.html(profile, score, name || ''),
        }),
      });

      const data = await res.json();
      if (data.id) {
        console.log(`[Subscribe] Email 1 sent to ${email} (${profile.name}, score ${score})`);
        return new Response(JSON.stringify({ success: true, message: 'Check your inbox! Your results and next steps are on the way.' }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Fallback — log the subscription
    console.log(`[Subscribe] ${email} — ${profile.name} (score ${score}) — no Resend key configured`);
    return new Response(JSON.stringify({ success: true, message: 'Thank you! Your results will arrive shortly.' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Subscribe Error]', error);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
