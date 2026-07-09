// Change Navigation Training — Unified Site
// All audience segments on one site, served from a single codebase

export const SITE = {
  name: 'Change Navigation Training',
  domain: 'https://changenavigationtraining.com',
  audience: 'Orthodox Jewish women',
  tagline: 'Navigate Change With Confidence',
  description: 'AI training and change-navigation workshops for Orthodox Jewish women. Build confidence, master AI tools, and navigate change — at every stage of life.',
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
    description: 'For women beginning their journey with AI and change. Build career confidence, learn AI tools, and develop the skills to navigate your future.',
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
    description: 'For women balancing careers, families, and community. Practical AI training to get hours back, reduce overwhelm, and build systems that work.',
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
    description: 'For women leading in career, community, and family. Master AI tools and change-navigation skills to lead with confidence.',
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
    description: 'For women in new chapters. Amplify your wisdom, navigate transitions, and mentor the next generation — with AI as your tool.',
  },
];

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

  // Women's AI Confidence
  womensAIProgram: 'https://buy.stripe.com/5kQ5kDbbbdNQc2y1l54ow08',

  // Private Coaching
  coachingSingle: 'https://buy.stripe.com/00wbJ11ABeRUc2y7Jt4ow09',
  coachingIntensive: 'https://buy.stripe.com/5kQcN57YZeRUfeK1l54ow0a',
  coachingAIOnboarding: 'https://buy.stripe.com/6oU14ndjjfVYgiO4xh4ow0b',

  // First workshop session
  firstWorkshop: 'https://buy.stripe.com/7sY7sLbbb6lo7Mi4xh4ow0c',

  // Digital Products
  toolkitChangeReadiness: 'https://buy.stripe.com/cNicN5ennaBE1nUbZJ4ow0y',
};

// Calendly Links
export const CALENDLY_LINKS = {
  consultation: 'https://calendly.com/elie-schulman/free-20-minute-consultation',
  workshopBooking: 'https://calendly.com/elie-schulman/workshop-discovery-call',
  coachingSession: 'https://calendly.com/elie-schulman/coaching-discovery-call',
};

export const CALENDLY_USERNAME = 'elie-schulman';
