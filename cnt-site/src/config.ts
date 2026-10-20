// Change Navigation Training — Unified Site
// All audience segments on one site, served from a single codebase

export const SITE = {
  name: 'Change Navigation Training',
  domain: 'https://changenavigationtraining.com',
  audience: 'Open to everyone',
  tagline: 'Navigate Change With Confidence',
  description: 'AI training and change-navigation workshops for anyone navigating change. Build confidence, master AI tools, and move forward — at every stage of life.',
  accent: '#c8963e',
  accentDark: '#a67c2e',
  accentLight: '#d4a853',
};

export const SEGMENTS = [
  {
    id: 'start',
    name: 'First Steps',
    age: '18–24',
    tagline: 'Your First Step Into a Bigger World',
    message: 'You belong in this conversation.',
    emotion: 'Uncertainty → confidence',
    accent: '#3ec8a0',
    accentDark: '#2a8a6e',
    accentLight: '#5ed4b4',
    description: 'For anyone beginning their journey with AI and change. Build career confidence, learn AI tools, and develop the skills to navigate your future.',
  },
  {
    id: 'build',
    name: 'Build',
    age: '25–35',
    tagline: 'Build the Life You Want — With Less Overwhelm',
    message: 'It is the thing that makes everything else manageable.',
    emotion: 'Overwhelm → relief',
    accent: '#c83e6b',
    accentDark: '#9e2e50',
    accentLight: '#e06090',
    description: 'For anyone balancing careers, families, and community. Practical AI training to get hours back, reduce overwhelm, and build systems that work.',
  },
  {
    id: 'lead',
    name: 'Lead',
    age: '35–50',
    tagline: 'Navigate Change With Confidence',
    message: 'Lead through change on your terms.',
    emotion: 'Pressure → clarity',
    accent: '#c8963e',
    accentDark: '#a67c2e',
    accentLight: '#d4a853',
    description: 'For anyone leading in career, community, and family. Master AI tools and change-navigation skills to lead with confidence.',
  },
  {
    id: 'renew',
    name: 'Renew',
    age: '50+',
    tagline: 'What You Know Matters More Than Ever',
    message: 'Your wisdom, amplified.',
    emotion: 'Doubt → empowerment',
    accent: '#8b9dc3',
    accentDark: '#6a7fa3',
    accentLight: '#a8b9d8',
    description: 'For anyone in a new chapter. Amplify your wisdom, navigate transitions, and mentor the next generation — with AI as your tool.',
  },
];

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Schedule', href: '/schedule/' },
  { label: 'Workshops', href: '/group-workshops/' },
  { label: 'AI Confidence', href: '/womens-ai-confidence/' },
  { label: 'Community', href: '/community/' },
  { label: 'Private Coaching', href: '/private-coaching/' },
  { label: 'Organizations', href: '/organizational-training/' },
  { label: 'Membership', href: '/memberships/' },
  { label: 'About', href: '/about/' },
  { label: 'Free Assessment', href: '/assessment/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
];

// Stripe Payment Links
export const STRIPE_LINKS = {
  // Memberships
  membershipMonthly: 'https://buy.stripe.com/9B63cv4MN4dgaYu4xh4ow05',
  membershipAnnual: 'https://buy.stripe.com/9B66oH6UV6lo4A6d3N4ow06',
  membershipSixMonth: 'https://buy.stripe.com/3cIcN54MN8twaYu8Nx4ow07',

  // AI Confidence program. URL kept so existing links still resolve.
  womensAIProgram: 'https://buy.stripe.com/5kQ5kDbbbdNQc2y1l54ow08',

  // Private Coaching
  coachingSingle: 'https://buy.stripe.com/00wbJ11ABeRUc2y7Jt4ow09',
  coachingIntensive: 'https://buy.stripe.com/5kQcN57YZeRUfeK1l54ow0a',
  coachingAIOnboarding: 'https://buy.stripe.com/6oU14ndjjfVYgiO4xh4ow0b',

  // First workshop session
  firstWorkshop: 'https://buy.stripe.com/7sY7sLbbb6lo7Mi4xh4ow0c',

  // Digital Products
  toolkitChangeReadiness: 'https://buy.stripe.com/cNicN5ennaBE1nUbZJ4ow0y',

  // Founding pilot ($149).
  // After payment, redirect to https://changenavigationtraining.com/pilot/confirmed/
  // PILOT_PAYMENT_LINK_ID=plink_1USZ1bFL3AcM6AsqH4gzEAkE
  pilotFounding: 'https://buy.stripe.com/9B628rdjjeRUgiO3td4ow0F',
};

// Payment Link id for the founding pilot. Set this as the Vercel env var
// PILOT_PAYMENT_LINK_ID so api/pilot-welcome.js ignores other checkouts.
export const PILOT_PAYMENT_LINK_ID = 'plink_1USZ1bFL3AcM6AsqH4gzEAkE';

// Founding cohort facts. Dates are the plan's estimate; confirm against a luach before promoting.
// The Zoom link is not stored here. It is sent only in the post-payment email.
export const PILOT = {
  title: 'AI Confidence: 4-Week Pilot',
  priceLabel: '$149',
  size: '8–15 people',
  sessions: '4 weekly live Zoom sessions, 75 minutes each',
  dates: 'Tuesdays, November 10, 17, 24, and December 1, 2026',
  time: '20:30 Israel time (13:30 ET)',
  closes: 'November 6, 2026',
  credit: 'The $149 is credited toward a membership ($69–$89/mo) if you join within 30 days.',
};

// Live scheduling URLs on calendly.com/andrea-schulman-coaching.
// workshopBooking is unused on the site; the old elie-schulman links 404.
export const CALENDLY_LINKS = {
  consultation: 'https://calendly.com/andrea-schulman-coaching/cnt-free-20-min-consultation',
  workshopBooking: '',
  coachingSession: 'https://calendly.com/andrea-schulman-coaching/cnt-coaching-discovery-call',
};

export const CALENDLY_USERNAME = 'andrea-schulman-coaching';
