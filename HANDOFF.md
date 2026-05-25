# Handoff: Krav Maga Experts Website Clone

**Date**: 2026-05-25
**Session scope**: Clone kravmagaexperts.com into a static Astro site with full blog content

## Project Location

```
/Users/elieschulman/Projects/krav-maga-experts/kme-site/
```

## Quick Start

```bash
cd /Users/elieschulman/Projects/krav-maga-experts/kme-site
npm run dev      # Dev server (localhost:4322 or next available)
npm run build    # Static build → dist/
npm run preview  # Preview built output
```

## What Was Built

### Stack
- **Astro 6.3.7** — static site generator
- Output: ~312 static HTML pages, zero JS shipped
- Design: Dark theme (black/charcoal), red accents (#cc0000), Bebas Neue (headings) + Inter (body)

### Pages (12 total)
| Path | File |
|---|---|
| Homepage | `src/pages/index.astro` |
| Class Schedule | `src/pages/class-schedule.astro` |
| Memberships | `src/pages/memberships.astro` |
| Women's Self-Defense | `src/pages/womens-self-defense.astro` |
| Kids Krav Maga | `src/pages/kids-krav-maga.astro` |
| Teens Krav | `src/pages/teens-krav.astro` |
| Private Training | `src/pages/private-training.astro` |
| Corporate Events | `src/pages/corporate-events.astro` |
| About | `src/pages/about.astro` |
| Contact | `src/pages/contact.astro` |
| FAQ | `src/pages/faq.astro` |
| Blog listing | `src/pages/blog/index.astro` |
| Blog individual post | `src/pages/blog/[slug].astro` |

### Blog Posts
- **300 posts** at `src/content/blog/*.md`
- Full HTML body content from WordPress REST API
- Frontmatter: title, slug, date, modified, excerpt, categories, tags, word_count

### Components
- `Header.astro` — sticky nav with 12 links, mobile toggle
- `Footer.astro` — 5-column grid with locations (UWS + Brooklyn), programs, company, connect
- `CTABanner.astro` — "Train Like It Matters" with dual CTA ($20 first class / $199 monthly)
- `Testimonial.astro` — blockquote with red left border
- `PricingCard.astro` — card with name, price, features, CTA, badge
- `BlogCard.astro` — card with categories, title, excerpt, date

### Layout
- `BaseLayout.astro` — global styles (CSS vars), Google Fonts, schema.org SportsActivityLocation with dual addresses, Open Graph, Twitter Cards

### Content Config
- `src/content.config.ts` — Astro 6 content collection with `glob` loader, Zod schema

## Key Design Decisions

1. **Hero copy changed from original**: "Real-world Krav Maga Self-Defense in NYC — Confidence that leaves with you" instead of "best self defense system in the world" (per audit)
2. **Pricing comparison table** on Memberships page — all three tiers visible at once
3. **Women's page** includes "What You'll Learn" grid + private training callout for trauma-conscious students
4. **Kids page** has side-by-side location cards with schedule, pricing, and FAQ
5. **Schema.org `SportsActivityLocation`** on every page with both addresses

## Input Files Used
- `krav_maga_experts_blog_posts.xlsx` — 300 posts metadata
- `website-audit_kravmagaexperts_com_2026-05-25.md` — SEO/performance/brand audit
- Live kravmagaexperts.com pages — content reference
- WordPress REST API (6 pages × 50 posts) — full blog post HTML bodies

## What's Not Yet Done
- Images (logo, instructor photos, studio images) — all pages are text-only
- Contact form submission (HTML exists, no backend)
- Payment/booking integration (CTAs link to /contact/)
- Blog category pages (`src/pages/blog/category/[category].astro`)
- RSS feed, sitemap integration
- 404 page, Privacy Policy, Terms, Media, Podcast, Curriculum, Workshop stubs
- Brooklyn/UWS neighborhood landing pages
- Multi-location LocalBusiness schema (currently single SportsActivityLocation)
- Lead magnets (subway safety guide) mentioned in audit
- Performance: no image optimization, no critical CSS extraction

## Build Stats
- **312 pages** in ~1-2 seconds
- Blog post files: ~20-30KB each (full HTML)
- Output: `dist/` — deployable to Netlify/Vercel/Cloudflare Pages/S3
