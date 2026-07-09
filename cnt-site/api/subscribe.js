/**
 * Vercel Serverless Function — Assessment Email Capture + Nurture Sequence
 * POST /api/subscribe
 *
 * Schedules all 5 nurture emails via Resend's scheduledAt parameter.
 * Email 1: immediate. Email 2: +3d. Email 3: +6d. Email 4: +9d. Email 5: +12d.
 */

export const config = { runtime: 'edge' };

const SITE_URL = 'https://changenavigationtraining.com';

// ── Email templates ──────────────────────────────────────────────

const EMAILS = [
  {
    subject: 'Your assessment results — and what they actually mean',
    html: (p, s) => `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#e0e0e0;background:#0a0a0a;padding:40px 20px;">
  <h1 style="color:#c8963e;font-family:'Bebas Neue',Arial,sans-serif;font-size:32px;letter-spacing:1px;">Your Results: ${p.name}</h1>
  <p style="font-size:14px;color:#777;margin-bottom:24px;">Score: ${s}/50</p>
  <p style="font-size:16px;line-height:1.6;">You took the assessment. You got a result. Here is what it does not mean.</p>
  <p style="font-size:16px;line-height:1.6;">It does not mean you are behind. It does not mean you are not ready. It does not mean anything is fixed. The profile is a snapshot — not a diagnosis. It tells you where you are right now. Not where you will be in three months.</p>
  <p style="font-size:16px;line-height:1.6;">The most useful thing you can do is notice it without judgment. If you are an Observer, observe. Explorer, explore. Navigator, navigate. The label is a starting point.</p>
  <p style="font-size:16px;line-height:1.6;">Over the next two weeks, I'll send a few short emails. One idea each. No pitch. No urgency. Just things to think about.</p>
  <div style="margin:32px 0;padding:24px;background:#111;border-left:3px solid #c8963e;">
    <p style="font-size:18px;color:#c8963e;margin-bottom:8px;font-weight:600;">${p.emoji} ${p.name}</p>
    <p style="font-size:14px;color:#e0e0e0;line-height:1.6;">${p.desc}</p>
    <p style="font-size:14px;color:#777;font-style:italic;">${p.cta}</p>
  </div>
  <a href="${SITE_URL}${p.link}" style="display:inline-block;padding:14px 28px;background:#c8963e;color:#0a0a0a;text-decoration:none;font-weight:600;font-size:15px;">${p.linkText} &rarr;</a>
  <p style="margin-top:32px;font-size:12px;color:#555;">If you want to skip ahead: <a href="${SITE_URL}/contact/" style="color:#c8963e;">Book a Free Call</a></p>
  <hr style="border-color:#222;margin:32px 0;">
  <p style="font-size:11px;color:#444;">Change Navigation Training — Helping Orthodox Jewish women navigate change with confidence.</p>
</div>`,
  },
  {
    subject: 'One thing AI can do for you this week',
    html: () => `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#e0e0e0;background:#0a0a0a;padding:40px 20px;">
  <p style="font-size:16px;line-height:1.6;">Not someday. Not after you learn everything. This week.</p>
  <p style="font-size:16px;line-height:1.6;">Open ChatGPT. Type: "I need to [one task]. Give me a first draft."</p>
  <p style="font-size:16px;line-height:1.6;">That is it. One sentence. One task. One draft.</p>
  <p style="font-size:16px;line-height:1.6;">An email you've been putting off. A schedule for the week. A meal plan. It does not matter what. What matters is that you try — not to master, just to experience what it feels like to offload a task.</p>
  <p style="font-size:16px;line-height:1.6;">The first time feels strange. The second time feels useful. The fifth time, you wonder how you managed without it.</p>
  <p style="font-size:16px;line-height:1.6;">Try it once this week. That is all.</p>
  <hr style="border-color:#222;margin:32px 0;">
  <p style="font-size:11px;color:#444;">Change Navigation Training</p>
</div>`,
  },
  {
    subject: 'Why learning alone is harder than it needs to be',
    html: () => `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#e0e0e0;background:#0a0a0a;padding:40px 20px;">
  <p style="font-size:16px;line-height:1.6;">Most women who try to learn AI on their own stop. Not because they are not capable. Because they hit a wall and have no one to ask.</p>
  <p style="font-size:16px;line-height:1.6;">The question that stumps you at 10 PM is the same question three other women had that week. In a group, someone asks out loud and everyone learns. Alone, you close the laptop and tell yourself you'll try again tomorrow.</p>
  <p style="font-size:16px;line-height:1.6;">This is not a personal failing. It is structural. Learning anything new — especially something carrying cultural weight like "technology" — is harder in isolation. The discomfort compounds. The voice that says "maybe this is not for me" gets louder.</p>
  <p style="font-size:16px;line-height:1.6;">In a peer circle, that voice gets quieter. Not because someone talks you out of it. Because you hear other women say the same thing. And you realize: it is not about you. It is about how learning works.</p>
  <p style="font-size:16px;line-height:1.6;">Community is not a nice-to-have. It is the mechanism.</p>
  <a href="${SITE_URL}/community/" style="display:inline-block;padding:14px 28px;background:#c8963e;color:#0a0a0a;text-decoration:none;font-weight:600;font-size:15px;margin-top:16px;">See Peer Circles &rarr;</a>
  <hr style="border-color:#222;margin:32px 0;">
  <p style="font-size:11px;color:#444;">Change Navigation Training</p>
</div>`,
  },
  {
    subject: '"I came in afraid of AI. I left knowing I could use it."',
    html: () => `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#e0e0e0;background:#0a0a0a;padding:40px 20px;">
  <p style="font-size:16px;line-height:1.6;">Chana signed up for her first workshop convinced she would be the least technical person in the room. She had never opened ChatGPT. She was not sure what "prompt" meant.</p>
  <p style="font-size:16px;line-height:1.6;">Four weeks later, she was using AI to plan lessons, draft emails, and help her kids with research.</p>
  <p style="font-size:16px;line-height:1.6;">She told us: "The shift was not in my technical skill. It was in my sense of what was possible."</p>
  <p style="font-size:16px;line-height:1.6;">That is the part no one talks about. Learning AI does not just change what you can do. It changes what you believe you can do. That shift is bigger than any single tool.</p>
  <p style="font-size:16px;line-height:1.6;">It comes from doing. From trying something in a room with other women trying too. From seeing someone else hesitate and push through. From realizing the discomfort is temporary — and the confidence lasts.</p>
  <p style="font-size:16px;line-height:1.6;">First session: $35. Not a discount. An invitation.</p>
  <a href="${SITE_URL}/group-workshops/" style="display:inline-block;padding:14px 28px;background:#c8963e;color:#0a0a0a;text-decoration:none;font-weight:600;font-size:15px;margin-top:16px;">Try a Workshop &mdash; $35 &rarr;</a>
  <hr style="border-color:#222;margin:32px 0;">
  <p style="font-size:11px;color:#444;">Change Navigation Training</p>
</div>`,
  },
  {
    subject: 'A conversation, not a pitch',
    html: () => `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#e0e0e0;background:#0a0a0a;padding:40px 20px;">
  <p style="font-size:16px;line-height:1.6;">Twelve days. Four emails. If you have read this far, something is resonating.</p>
  <p style="font-size:16px;line-height:1.6;">Here is what I suggest — not as a pitch, but as a genuine next step:</p>
  <p style="font-size:16px;line-height:1.6;">Book a free 20-minute call. We'll talk about where you are. What you are navigating. What feels hard. What feels possible. I'll ask questions. You'll answer honestly. At the end, I'll tell you whether CNT is a fit — and if it is not, I'll tell you that too.</p>
  <p style="font-size:16px;line-height:1.6;">No pressure. No urgency. No countdown timer. Just a conversation with someone who has watched enough women navigate change to know what the early stages look like.</p>
  <p style="font-size:16px;line-height:1.6;">If you are not ready, that is fine. Keep reading the blog. The door stays open.</p>
  <p style="font-size:16px;line-height:1.6;">But if you are curious enough for 20 minutes — this is the next step.</p>
  <a href="${SITE_URL}/contact/" style="display:inline-block;padding:14px 28px;background:#c8963e;color:#0a0a0a;text-decoration:none;font-weight:600;font-size:15px;margin-top:16px;">Book Your Free Call &rarr;</a>
  <hr style="border-color:#222;margin:32px 0;">
  <p style="font-size:11px;color:#444;">Change Navigation Training</p>
</div>`,
  },
];

// ── Profiles ────────────────────────────────────────────────────

const PROFILES = {
  observer: { name: 'The Observer', emoji: '🔭', desc: 'You are watching. Waiting. Most people start here.', cta: 'Start with three blog posts. Sign up for our email sequence.', link: '/blog/', linkText: 'Read the Blog' },
  explorer: { name: 'The Explorer', emoji: '🧭', desc: 'You are curious. You want to understand more.', cta: 'Book a free 20-minute call. No sales pitch.', link: '/contact/', linkText: 'Book a Free Call' },
  navigator: { name: 'The Navigator', emoji: '🗺️', desc: 'You are moving. You want structure and specific skills.', cta: 'Sign up for a workshop. First session is $35.', link: '/schedule/', linkText: 'View Workshops' },
  trailblazer: { name: 'The Trailblazer', emoji: '🚀', desc: 'You are moving fast. You want community and ongoing practice.', cta: 'Join a membership. All workshops. Peer circles. $89/month.', link: '/memberships/', linkText: 'Join Now' },
};

function getProfile(score) {
  if (score <= 22) return 'observer';
  if (score <= 34) return 'explorer';
  if (score <= 42) return 'navigator';
  return 'trailblazer';
}

// ── Handler ─────────────────────────────────────────────────────

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, score } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required.' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const profileKey = getProfile(score || 25);
    const profile = PROFILES[profileKey];
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      console.log(`[Subscribe] ${email} — ${profile.name} (score ${score}) — no Resend key`);
      return new Response(JSON.stringify({ success: true, message: 'Thank you! Your results will arrive shortly.' }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    const now = Math.floor(Date.now() / 1000);
    const delays = [0, 3 * 86400, 6 * 86400, 9 * 86400, 12 * 86400]; // 0, 3, 6, 9, 12 days
    let sentCount = 0;
    let firstEmailId = null;

    for (let i = 0; i < EMAILS.length; i++) {
      const sendAt = now + delays[i];
      const body = {
        from: 'Change Navigation Training <welcome@changenavigationtraining.com>',
        to: email,
        subject: EMAILS[i].subject,
        html: EMAILS[i].html(profile, score || 25),
      };
      if (i > 0) body.scheduledAt = new Date(sendAt * 1000).toISOString();

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.id) {
        sentCount++;
        if (i === 0) firstEmailId = data.id;
        console.log(`[Subscribe] Email ${i + 1} ${i === 0 ? 'sent' : 'scheduled'} to ${email} (send_at: ${new Date(sendAt * 1000).toISOString()})`);
      } else {
        console.error(`[Subscribe] Email ${i + 1} failed:`, data);
      }
    }

    if (sentCount > 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Check your inbox! Your results and next steps are on the way. You\'ll receive 4 more short emails over the next 12 days.'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Could not send email. Please try again.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Subscribe Error]', error);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
