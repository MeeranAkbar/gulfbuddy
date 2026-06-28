export interface ServicesMetric {
  label: string;
  value: string;
}

export interface ServicesSearchField {
  label: string;
  value: string;
}

export interface ServicesCategory {
  slug: string;
  title: string;
  focus: string;
  detail: string;
  subcategories: string[];
}

export interface ServicesShowcaseItem {
  badge: string;
  title: string;
  subtitle: string;
  pricing: string;
  meta: string;
  highlight: string;
  imageUrl?: string;
}

export interface ServicesProviderHighlight {
  title: string;
  badge: string;
  detail: string;
  imageUrl?: string;
}

export interface ServicesEmirateSpotlight {
  slug: string;
  label: string;
  headline: string;
  summary: string;
  neighborhoods: { name: string; focus: string; detail: string; imageUrl?: string; }[];
}

export const servicesMetrics: ServicesMetric[] = [
  { label: 'Marketplace mode', value: 'Leads + quotes + jobs' },
  { label: 'Operator mix', value: 'Individuals + businesses' },
  { label: 'Revenue fit', value: 'Commission-first' }
];

export const servicesSearchFields: ServicesSearchField[] = [
  { label: 'Service', value: 'AC repair, cleaning, beauty, movers, IT support' },
  { label: 'Emirate', value: 'Dubai, Abu Dhabi, Sharjah, Ajman' },
  { label: 'Area', value: 'Marina, Khalifa City, Aljada, JVC' },
  { label: 'Pricing Model', value: 'Quote, fixed price, hourly, package' },
  { label: 'Urgency', value: 'Emergency, same day, scheduled' }
];

export const servicesQuickFilters = [
  'Verified providers',
  'Emergency service',
  'Business provider',
  'At-home service',
  'Remote service',
  'Fast response'
];

export const servicesTrustSignals = [
  'Provider profiles are first-class public objects, not hidden behind generic cards',
  'Quote requests, bookings, and future commission flows live in one shared marketplace model',
  'Risk checks can flag copied provider profiles, suspicious pricing, and spam behavior',
  'Premium boosts should elevate quality providers without turning the section into an ad board'
];

export const servicesCategories: ServicesCategory[] = [
  {
    slug: 'ac-repair',
    title: 'AC Repair',
    focus: 'High-frequency local demand',
    detail: 'A major UAE need that benefits from fast response signals, emergency routing, and local availability clarity.',
    subcategories: ['emergency', 'maintenance', 'duct-cleaning']
  },
  {
    slug: 'home-cleaning',
    title: 'Home Cleaning',
    focus: 'Repeat service demand',
    detail: 'Should support trust-first provider profiles, package offers, and repeat-booking pathways.',
    subcategories: ['deep-cleaning', 'move-in-out', 'maids']
  },
  {
    slug: 'beauty-services',
    title: 'Beauty Services',
    focus: 'Provider brand and portfolio driven',
    detail: 'Works best when provider pages, galleries, and booking intent feel premium and local.',
    subcategories: ['bridal', 'salon-at-home', 'nails']
  },
  {
    slug: 'it-support',
    title: 'IT Support',
    focus: 'Business and remote-ready',
    detail: 'Should support on-site and remote service models with stronger business-provider trust language.',
    subcategories: ['networking', 'managed-services', 'device-repair']
  }
];

export const servicesShowcaseItems: ServicesShowcaseItem[] = [
  {
    badge: 'Emergency Ready',
    title: 'AC and home maintenance providers that feel bookable, local, and credible',
    subtitle: 'Fast-response operators in Dubai, Abu Dhabi, and Sharjah',
    pricing: 'From AED 120 callout',
    meta: 'Lead + quote lane',
    highlight: 'Services should help customers act quickly without sacrificing provider credibility.',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: 'Repeat Business',
    title: 'Cleaning and home services built around trust, repeat demand, and provider quality',
    subtitle: 'Weekly, one-off, package, and move-in/out support',
    pricing: 'From AED 35 / hour',
    meta: 'Retention fit',
    highlight: 'Good service marketplaces grow through repeat use, not only one-time leads.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: 'Business Providers',
    title: 'IT, consulting, and business support with stronger public profile identity',
    subtitle: 'Remote-ready and branch-based service operators',
    pricing: 'Quote-based',
    meta: 'Premium profile',
    highlight: 'This is where business-grade provider pages become a major differentiator.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
  }
];

export const servicesProviderHighlights: ServicesProviderHighlight[] = [
  {
    title: 'Provider profiles as growth assets',
    badge: 'Public Identity',
    detail: 'Provider pages should carry brand, service area, pricing style, and portfolio quality so they can earn organic traffic and repeat trust.'
  },
  {
    title: 'Quote-to-order workflow',
    badge: 'Marketplace Engine',
    detail: 'This section is not a static directory. Requests, quotes, and orders should feel like one controlled marketplace flow.'
  },
  {
    title: 'Commission without early complexity',
    badge: 'Monetization',
    detail: 'Phase one can stay lead and quote driven while still preparing clean order and commission tracking underneath.'
  }
];

export const servicesEmirates: ServicesEmirateSpotlight[] = [
  {
    slug: 'dubai',
    label: 'Dubai',
    headline: 'High-volume local demand, strong premium provider branding, and dense area-led search.',
    summary: 'Dubai services pages should feel fast, modern, and premium, with stronger provider identity and neighborhood-led discovery.',
    neighborhoods: [
      { name: 'Dubai Marina', focus: 'Residential demand', detail: 'Home services, beauty, and emergency support with fast response expectations.' },
      { name: 'Business Bay', focus: 'Mixed-use demand', detail: 'Residential convenience plus business-support services in one local lane.' },
      { name: 'JVC', focus: 'Growing community', detail: 'Family-friendly home services and repeat provider relationships matter here.' }
    ]
  },
  {
    slug: 'abu-dhabi',
    label: 'Abu Dhabi',
    headline: 'Trust-heavy service discovery with strong business providers and calmer local UX.',
    summary: 'Abu Dhabi should lean into provider reliability, response quality, and cleaner brand presentation over noisy marketplace tactics.',
    neighborhoods: [
      { name: 'Khalifa City', focus: 'Family demand', detail: 'Recurring home services and trusted local providers matter most.' },
      { name: 'Al Reem Island', focus: 'Urban convenience', detail: 'Fast quote response and local reliability should lead the page.' },
      { name: 'Mussafah', focus: 'Commercial support', detail: 'Business services and technical providers need stronger structured presentation.' }
    ]
  },
  {
    slug: 'sharjah',
    label: 'Sharjah',
    headline: 'Value-conscious local service demand with strong repeat-use potential.',
    summary: 'Sharjah should feel approachable and local, while still carrying premium trust cues and clearer provider identity.',
    neighborhoods: [
      { name: 'Aljada', focus: 'New community demand', detail: 'Cleaning, maintenance, and household convenience services perform well here.' },
      { name: 'Muwaileh', focus: 'Student and family demand', detail: 'Affordable services and repeat provider trust are key.' },
      { name: 'Al Majaz', focus: 'Established local demand', detail: 'Beauty, home services, and neighborhood-led discovery should stay clear.' }
    ]
  },
  {
    slug: 'ajman',
    label: 'Ajman',
    headline: 'Local-first discovery where provider trust and area relevance matter more than flashy UI tricks.',
    summary: 'Ajman services pages should focus on practical trust, simpler request flow, and provider visibility that feels genuinely local.',
    neighborhoods: [
      { name: 'Al Nuaimiya', focus: 'Daily demand', detail: 'Home and recurring services should be easy to compare and request.' },
      { name: 'Al Rashidiya', focus: 'Mixed-use support', detail: 'Neighborhood businesses and local specialists can stand out here.' },
      { name: 'Ajman Corniche', focus: 'Lifestyle demand', detail: 'Beauty, events, and personal services benefit from stronger profile pages.' }
    ]
  }
];

export function getServicesEmirateSpotlight(emirate: string) {
  const found = servicesEmirates.find((item) => item.slug === emirate);

  if (found) {
    return found;
  }

  const label = humanizeSlug(emirate);

  return {
    slug: emirate,
    label,
    headline: `${label} should have a strong local services discovery layer.`,
    summary: 'This local services page should later connect to provider profiles, category hubs, and request flows instead of behaving like a thin filter route.',
    neighborhoods: [
      { name: `${label} Central`, focus: 'Local demand', detail: 'A premium services page should explain what kinds of providers and requests matter here.' },
      { name: `${label} Residential`, focus: 'Recurring services', detail: 'Home, maintenance, beauty, and convenience providers can anchor the local lane.' },
      { name: `${label} Business District`, focus: 'Commercial support', detail: 'Business providers and technical operators can expand the marketplace beyond household use.' }
    ]
  };
}

export function getServicesCategory(category: string) {
  return servicesCategories.find((item) => item.slug === category) || null;
}

export function humanizeSlug(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
