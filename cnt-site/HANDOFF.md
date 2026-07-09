# Handoff: Change Navigation Training Website

**Date**: 2026-05-26
**Status**: Full static site built, verified (19 pages, clean build). Calendly + Stripe wired up. Momence removed.

---

## Project Location

```
/Users/elieschulman/Projects/change-navigation-training/cnt-site/
```

To start a new DeepSeek TUI session, set the workspace to that path. All source, components, content, and build output are inside `cnt-site/`.

---

## Quick Start

```bash
cd /Users/elieschulman/Projects/change-navigation-training/cnt-site
npm run dev      # Dev server
npm run build    # Static build → dist/ (19 pages)
npm run preview  # Preview built output
```

---

## What Was Built

### Stack
- **Astro 5.x** — static site generator
- Zero client JS beyond mobile nav toggle
- Dark theme (black/charcoal), **gold accent** (#c8963e), Bebas Neue (headings) + Inter (body)

### Color System
| Variable | Value | Usage |
|---|---|---|
| `--color-gold` | `#c8963e` | Primary accent — buttons, borders, highlights |
| `--color-black` | `#0a0a0a` | Page background |
| `--color-dark` | `#111111` | Section alt background |
| `--color-gray` | `#333333` | Borders |
| `--color-gray-light` | `#777777` | Body text |

Gold instead of KME's red — warmer, professional, fitting for the audience.

### Pages (12 templates → 16 output files)

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, mission, philosophy, programs, testimonials, blog preview, pricing |
| `/group-workshops/` | Workshop menu table + Calendly schedule embed |
| `/memberships/` | 3 tiers: Explorer $89/mo, Navigator $69/mo, Journey $79/mo |
| `/womens-ai-confidence/` | Flagship 8-week program (parallel to KME Women's Self-Defense) |
| `/community/` | Peer learning circles — 6 circle types |
| `/private-coaching/` | 1-on-1: $125/session, $840 intensive, $350 AI onboarding |
| `/organizational-training/` | For schools, nonprofits, businesses |
| `/about/` | Mission, approach, values |
| `/contact/` | Contact form + email |
| `/faq/` | 10 FAQ items |
| `/blog/` | Blog listing — pulls from content collection |
| `/blog/[slug]/` | Individual post — uses `render()` from `astro:content` |

### Components (7)

| Component | Notes |
|---|---|
| `Header.astro` | 10 nav links, gold accent, mobile hamburger |
| `Footer.astro` | 4-column grid |
| `CTABanner.astro` | Dual CTA: $35 workshop / $89 monthly |
| `Testimonial.astro` | Gold left border blockquote |
| `PricingCard.astro` | Name, price, features, badge |
| `BlogCard.astro` | Categories, title, excerpt, date |
| `CalendlyWidget.astro` | Inline + popup scheduling via Calendly |
| `StripeButton.astro` | Direct Stripe payment link buttons |

### Blog Posts (8)

All in KME/CNT voice — direct, observational, short paragraphs, no hard sell:

1. "AI Is Not the Disruption. Your Response to It Is." — `ai-is-not-the-disruption`
2. "What Learning to Use AI Actually Teaches You" — `what-learning-ai-teaches-you`
3. "You Are Not Behind. You Are at the Beginning." — `you-are-not-behind`
4. "The Skill of Not Knowing" — `the-skill-of-not-knowing`
5. "Why Learning Alone Is Harder Than It Needs to Be" — `why-learning-alone-is-harder`

---

## Voice Profile

See `VOICE_PROFILE.md`. Core rules:

- Direct, unhurried, precise. Observer, not preacher.
- Short sentences. Fragment clusters. Short paragraphs. One point each.
- Core move: State assumption → Invert it → Show what follows.
- Vocabulary: agency, clarity, curiosity, discomfort, practice, learning.
- No AI hype, no fear-mongering, no motivational language, no exclamation marks.

---

## Scheduling & Payments

**Calendly** — free tier, 1 event type. Wired up on 4 pages per site (schedule, contact, group-workshops, private-coaching). Config in `src/config.ts` → `CALENDLY_LINKS`.

**Stripe** — payment links for memberships, workshops, coaching. Config in `src/config.ts` → `STRIPE_LINKS`. Used via `StripeButton.astro`.

---

## What's Not Yet Done — By Priority

### High
1. Replace placeholder testimonials with real names and quotes
2. Add images — logo, photos
3. Contact form backend (HTML-only currently)

### Medium
4. Performance: image optimization, critical CSS
5. WhatsApp community link instead of placeholder social
6. Analytics

### Done (since last handoff)
- Blog category pages (`src/pages/blog/category/[category].astro`)
- RSS feed (`@astrojs/rss`) — `src/pages/rss.xml.js`
- Sitemap (`@astrojs/sitemap`) — in `astro.config.mjs`
- 404 page — `src/pages/404.astro`
- Privacy Policy — `src/pages/privacy.astro`
- Lead magnet — `dashboard/lead-magnet.html`
- Assessment page — `src/pages/assessment.astro`
- 8 blog posts total (up from 5)
- MomenceWidget removed — replaced by Calendly + Stripe

---

## Key Decisions to Preserve

1. **Gold accent, not red** — warm and professional for frum women
2. **No hard sell** — site demonstrates value through thinking
3. **AI as tool, not topic** — change navigation is the core skill
4. **Women-only framing throughout** — spaces built for frum women
5. **Consistent voice** — blog and pages share the same style; follow VOICE_PROFILE.md

---

## Adding Content

**New blog post:**
1. Create `src/content/blog/your-slug.md` with frontmatter (title, slug, date, excerpt, categories, word_count)
2. Write in CNT voice
3. Rebuild — appears on `/blog/` automatically

**New page:**
1. Create `src/pages/new-page.astro` — copy structure from any existing page
2. Add to `Header.astro` navItems and `Footer.astro` links
3. Rebuild

---

## Build Verification

Last build: **2026-05-26** — 19 pages, zero errors.

```bash
cd /Users/elieschulman/Projects/change-navigation-training/cnt-site
npm run build
```

---

## File Tree

```
cnt-site/
├── astro.config.mjs
├── package.json
├── VOICE_PROFILE.md
├── HANDOFF.md
├── public/
├── src/
│   ├── content.config.ts
│   ├── content/blog/          (8 markdown posts)
│   ├── layouts/BaseLayout.astro
│   ├── components/            (8 .astro files)
│   └── pages/                 (12 .astro files + blog/)
├── node_modules/
└── dist/                      (19 HTML files)
```
