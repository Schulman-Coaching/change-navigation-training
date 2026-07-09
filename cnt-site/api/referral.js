/**
 * Vercel Serverless Function — Referral Lookup
 * GET /api/referral?code=ABC123
 * 
 * This is a lightweight referral status endpoint.
 * In production, connect to a database (Airtable, Google Sheets, Supabase).
 * For now, logs the lookup and returns a placeholder response.
 */

export const config = { runtime: 'edge' };

// Placeholder referral data — replace with database connection
const REFERRALS = {
  'DEMO1': { name: 'Demo User', count: 3, credit: 150, recent: 'Chana R. — joined May 20' },
};

export default async function handler(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response(JSON.stringify({ error: 'Referral code required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const referral = REFERRALS[code.toUpperCase()];

  if (referral) {
    return new Response(JSON.stringify({ success: true, ...referral }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Log unknown code for manual review
  console.log(`[Referral] Unknown code lookup: ${code}`);

  return new Response(JSON.stringify({ success: false, error: 'Referral code not found. Contact us to set up your referral account.' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
