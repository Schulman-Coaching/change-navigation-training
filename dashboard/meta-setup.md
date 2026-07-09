# Meta Ads Setup — Change Navigation Training

*Generated 2026-05-26. Follow in order.*

---

## Step 1: Create Business Portfolio
**URL**: [business.facebook.com](https://business.facebook.com/) → Create Account

| Field | Value |
|---|---|
| Business name | Change Navigation Training |
| Your name | Elie Schulman |
| Business email | (same one tied to Calendly/Stripe) |

---

## Step 2: Create Facebook Page
Business Settings → Pages → Add a Page

| Field | Value |
|---|---|
| Page name | Change Navigation Training |
| Category | Education / Coaching & Mentoring |
| Description | AI and change-navigation training built for Orthodox Jewish women. Unhurried. Practical. In your context. |

---

## Step 3: Connect Instagram
Business Settings → Instagram Accounts → Connect. Log in with the CNT Instagram handle (create one if needed).

---

## Step 4: Create Ad Account
Business Settings → Ad Accounts → Add → Create New

| Field | Value |
|---|---|
| Name | CNT Ads |
| Currency | USD |
| Time zone | America/New_York |

Add payment method (card). Test budget is $210 for week 1.

---

## Step 5: Install Meta Pixel
Business Settings → Data Sources → Pixels → Add. Name it "CNT Pixel."

Add the Pixel base code to `BaseLayout.astro` in all 4 `cnt-*` sites (inside `<head>`):

```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

On the assessment page, add a conversion event after form submission:
```js
fbq('track', 'Lead');
```

---

## Step 6: Verify Domains
Business Settings → Brand Safety → Domains → Add

- cnt-site.vercel.app
- cnt-start.vercel.app
- cnt-build.vercel.app
- cnt-renew.vercel.app

Use the HTML file method — place the verification file in each site's `public/` directory.

---

## Step 7: Create Test Campaigns
In Ads Manager, create 3 campaigns.

**Objective**: Traffic  
**Destination**: `https://cnt-site.vercel.app/assessment/`  
**Placement**: Instagram Feed + Stories (uncheck Facebook Feed for week 1)  
**Schedule**: 7 days

| Campaign | Audience | Variant | Daily Budget |
|---|---|---|---|
| CNT – Test – Reframe | Broad Women 25-55 US | A (dark/gold text) | $10/day |
| CNT – Test – Time | Busy Moms interests | B (woman at desk) | $10/day |
| CNT – Test – Belonging | Career Changers interests | C (group learning) | $10/day |

**Total test**: $210

### Creative specs
- Feed: 1080×1080
- Stories: 1080×1920

### Copy & creative briefs
See `dashboard/ig-ad-creative.md` for full copy and designer briefs for all 3 variants.

### Interest-based audiences
| Audience | Interests |
|---|---|
| Career Changers | Career development, Job hunting, Professional certification, LinkedIn, Online learning |
| Busy Moms | Parenting, Time management, Working mother, Meal planning |
| Lifelong Learners | Online learning, Coursera, Skillshare, Self-improvement |
| Jewish Community | Orthodox Judaism, Jewish holidays, Kosher food, Jewish education |

---

## Step 8: Set Up Conversion Tracking
Once Pixel is live on the assessment page, fire a Lead event on form submission (see Step 5).

---

## After Week 1
- Kill variants with CTR <1% or CPL >$5
- Scale winners at 20% per week
- Set up retargeting (task B4): assessment completers → Calendly booking ad

---

## Key Metrics
| Metric | Healthy | Needs Work |
|---|---|---|
| CTR | >1.5% | <0.8% |
| CPL | <$2 | >$5 |
| Assessment completion | >40% | <25% |

---

## Related Tasks
- **B3**: Set up Meta Ads Manager campaigns — currently `blocked` (was: Facebook account locked; now reactivated)
- **B4**: Build retargeting audiences — blocked on B3
- **C7**: Analyze IG ad performance and pivot — week 11

## References
- `IG_ADS.md` — full ad strategy
- `dashboard/ig-ad-creative.md` — ad copy + designer briefs
- `MARKETING_PLAN.md` — 90-day plan
