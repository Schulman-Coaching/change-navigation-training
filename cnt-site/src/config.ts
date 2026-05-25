// CNT: Lead — For women 35-50 leading in career, community, and family
// Accent: Gold (#c8963e)

export const SITE = {
  name: 'CNT: Lead',
  domain: 'https://lead.changenavigationtraining.com',
  audience: 'Orthodox Jewish women 35-50',
  tagline: 'Navigate Change With Confidence',
  description: 'Change-navigation training for Orthodox Jewish women leading through personal, professional, and technological change.',
  accent: '#c8963e',
  accentDark: '#a67c2e',
  accentLight: '#d4a853',
};

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Schedule', href: '/schedule/' },
  { label: 'Workshops', href: '/group-workshops/' },
  { label: "Women's AI Confidence", href: '/womens-ai-confidence/' },
  { label: 'Community', href: '/community/' },
  { label: 'Private Coaching', href: '/private-coaching/' },
  { label: 'Organizations', href: '/organizational-training/' },
  { label: 'Membership', href: '/memberships/' },
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
];

// Stripe Payment Links
export const STRIPE_LINKS = {
  // Memberships
  membershipMonthly: 'https://buy.stripe.com/9B63cv4MN4dgaYu4xh4ow05',
  membershipAnnual: 'https://buy.stripe.com/9B66oH6UV6lo4A6d3N4ow06',
  membershipSixMonth: 'https://buy.stripe.com/3cIcN54MN8twaYu8Nx4ow07',

  // Women's AI Confidence
  womensAIProgram: 'https://buy.stripe.com/5kQ5kDbbbdNQc2y1l54ow08',

  // Private Coaching
  coachingSingle: 'https://buy.stripe.com/00wbJ11ABeRUc2y7Jt4ow09',
  coachingIntensive: 'https://buy.stripe.com/5kQcN57YZeRUfeK1l54ow0a',
  coachingAIOnboarding: 'https://buy.stripe.com/6oU14ndjjfVYgiO4xh4ow0b',

  // First workshop session
  firstWorkshop: 'https://buy.stripe.com/7sY7sLbbb6lo7Mi4xh4ow0c',
};

// Calendly Links — replace with your real Calendly scheduling links
// Sign up at calendly.com, create event types, copy links

export const CALENDLY_LINKS = {
  consultation: 'https://calendly.com/elie-schulman/new-meeting-1',
  workshopBooking: 'https://calendly.com/elie-schulman/new-meeting-1',
  coachingSession: 'https://calendly.com/elie-schulman/new-meeting-1',
};

// Calendly username — used for popup widgets
export const CALENDLY_USERNAME = 'elie-schulman';
