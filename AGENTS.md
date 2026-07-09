# Project Instructions — Change Navigation Training

## What This Is
CNT sells AI + change-navigation training to Orthodox Jewish women, segmented by life stage. Built with Astro 5.x, deployed on Vercel. **Consolidated to a single site** (cnt-site) with audience-segmented sections.

## Site Structure (Unified)
```
cnt-site/   — Single unified site, all 4 audience segments
  - Homepage with audience segment cards (Start 18-24, Build 25-35, Lead 35-50, Renew 50+)
  - 29 blog posts (tagged with audience: start/build/lead/renew)
  - 14 workshops (tagged with audience)
  - About page with founder credentials (Elie Schulman)
  - Assessment page (primary email capture)
  - 69 total pages
```

## Critical Infrastructure (DO NOT RE-SUGGEST SETUP)
- **Vercel**: CLI v54.x. cnt-site deployed at cnt-site.vercel.app. Custom domain pending DNS.
- **Calendly**: Paid account. User `elie-schulman`. 3 event types.
- **Stripe**: Payment links configured in `config.ts`.
- **cnt-start, cnt-build, cnt-renew**: Archived. Not deployed. Content merged into cnt-site.

## Build/Deploy
```bash
cd cnt-site && npm run build && npx vercel --prod --yes
```

## Key Files
- `cnt-site/src/config.ts` — SITE config + SEGMENTS array + Stripe/Calendly links
- `cnt-site/src/content.config.ts` — Content collections with audience field
- `dashboard/tasks.json` — Task tracking
- `VOICE_PROFILE.md` — Writing style reference
- `BUSINESS_MODEL.md`, `MARKETING_PLAN.md`, `EMAIL_SEQUENCE.md` — Specs
- `STATUS.md` — Current status

## Before Acting
- Check `STATUS.md` for current state
- Content is consolidated — don't split sites again
