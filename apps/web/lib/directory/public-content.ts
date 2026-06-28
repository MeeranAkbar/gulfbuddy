export interface DirectoryMetric {
  label: string;
  value: string;
}

export interface DirectorySearchField {
  label: string;
  value: string;
}

export interface DirectoryCategory {
  slug: string;
  title: string;
  focus: string;
  detail: string;
}

export interface DirectoryShowcaseItem {
  badge: string;
  title: string;
  subtitle: string;
  meta: string;
  highlight: string;
  imageUrl?: string;
}

export interface DirectoryBusinessHighlight {
  title: string;
  badge: string;
  detail: string;
  imageUrl?: string;
}

export interface DirectoryAreaSpotlight {
  name: string;
  focus: string;
  detail: string;
  imageUrl?: string;
}

export interface DirectoryEmirateSpotlight {
  slug: string;
  label: string;
  headline: string;
  summary: string;
  topAreas: DirectoryAreaSpotlight[];
  imageUrl?: string;
}

export interface DirectoryBusinessProfile {
  slug: string;
  name: string;
  category: string;
  headline: string;
  summary: string;
  coverage: string;
  responseSignal: string;
  profileMode: string;
  badges: string[];
  metrics: DirectoryMetric[];
  trustSignals: string[];
  activeLanes: { title: string; emirateSlug: string; categorySlug: string; detail: string }[];
}

export const directoryMetrics: DirectoryMetric[] = [
  { label: 'Public posture', value: 'Profile-first business discovery' },
  { label: 'Growth engine', value: 'Category + location SEO' },
  { label: 'Commercial fit', value: 'Free basic + premium visibility' }
];

export const directorySearchFields: DirectorySearchField[] = [
  { label: 'Business or Keyword', value: 'Clinic, salon, restaurant, legal consultant' },
  { label: 'Emirate', value: 'Dubai, Abu Dhabi, Sharjah, Ajman' },
  { label: 'Category', value: 'Dining, healthcare, beauty, business services' },
  { label: 'Area', value: 'Marina, Business Bay, Khalifa City, Aljada' },
  { label: 'Profile Type', value: 'Verified business, premium brand, branch network' }
];

export const directoryQuickFilters = [
  'Verified business',
  'Open now',
  'Premium profile',
  'Multi-branch',
  'High response',
  'Popular in area'
];

export const directoryTrustSignals = [
  'Business profiles should be first-class public objects, not thin cards buried inside search.',
  'Area and category pages should feel curated enough to rank and useful enough to convert.',
  'Verification, branch clarity, and profile quality should be visible before the user ever clicks contact.',
  'Premium upgrades should enhance profile depth without making the section feel like a noisy ad directory.'
];

export const directoryCategories: DirectoryCategory[] = [
  {
    slug: 'restaurants',
    title: 'Restaurants',
    focus: 'High-volume local intent',
    detail: 'Dining profiles should feel visual, trustworthy, and highly shareable with category and area relevance built in.'
  },
  {
    slug: 'clinics',
    title: 'Clinics',
    focus: 'Trust-sensitive discovery',
    detail: 'Healthcare business pages need stronger identity, clearer location signals, and calmer premium presentation.'
  },
  {
    slug: 'beauty-salons',
    title: 'Beauty Salons',
    focus: 'Brand and neighborhood driven',
    detail: 'Salons and beauty operators benefit from polished public brand objects, local search lanes, and repeat-visit confidence.'
  },
  {
    slug: 'business-services',
    title: 'Business Services',
    focus: 'Professional trust layer',
    detail: 'Consultants, agencies, and B2B service operators need profile-first visibility that feels more credible than open classifieds.'
  }
];

export const directoryShowcaseItems: DirectoryShowcaseItem[] = [
  {
    badge: 'Local Discovery',
    title: 'Category and area pages that feel like true local business hubs',
    subtitle: 'Dubai Marina dining, Khalifa City clinics, Aljada beauty lanes',
    meta: 'SEO surface',
    highlight: 'Directory should become a premium long-tail discovery engine, not a flat business list.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: 'Business Profiles',
    title: 'Public business pages that act as brand assets, not just contact records',
    subtitle: 'Verification, branch clarity, highlights, and structured profile quality',
    meta: 'Brand object',
    highlight: 'Strong public profiles create better trust, stronger sharing, and cleaner monetization.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: 'Premium Visibility',
    title: 'Featured and premium exposure that sits naturally inside search and profile pages',
    subtitle: 'Profile boosts, category visibility, and structured commercial lanes',
    meta: 'Revenue fit',
    highlight: 'Monetization should feel native to the directory experience rather than bolted on later.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  }
];

export const directoryBusinessHighlights: DirectoryBusinessHighlight[] = [
  {
    title: 'Free basic profile as an entry lane',
    badge: 'Growth Strategy',
    detail: 'Basic business profiles should give operators a real public presence while encouraging stronger profile quality and premium upgrades later.'
  },
  {
    title: 'Profile quality as a trust signal',
    badge: 'Trust Layer',
    detail: 'Verification, branch coverage, contact clarity, and category fit should make strong profiles visibly safer and more credible.'
  },
  {
    title: 'Area and category pages as SEO assets',
    badge: 'Organic Growth',
    detail: 'The directory should support a rich long-tail route system that turns local-intent search into durable marketplace growth.'
  }
];

export const directoryEmirates: DirectoryEmirateSpotlight[] = [
  {
    slug: 'dubai',
    label: 'Dubai',
    headline: 'The strongest directory market for premium brand pages, neighborhood discovery, and category-led organic growth.',
    summary: 'Dubai directory pages should feel polished, premium, and local enough to support both discovery and repeat trust.',
    topAreas: [
      { name: 'Dubai Marina', focus: 'Lifestyle demand', detail: 'Dining, beauty, wellness, and premium local businesses can anchor this lane.' },
      { name: 'Business Bay', focus: 'Professional demand', detail: 'Consultancies, agencies, clinics, and business-facing brands need stronger identity here.' },
      { name: 'Jumeirah', focus: 'Brand-first discovery', detail: 'Premium restaurants, salons, and boutique operators benefit from high-quality profile pages.' }
    ]
  },
  {
    slug: 'abu-dhabi',
    label: 'Abu Dhabi',
    headline: 'Trust-heavy business discovery with stronger institutional credibility and calmer local search UX.',
    summary: 'Abu Dhabi should lean into credibility, clearer business identity, and location-first directory pages over noisy listing density.',
    topAreas: [
      { name: 'Khalifa City', focus: 'Family services', detail: 'Clinics, wellness businesses, and neighborhood service operators matter most here.' },
      { name: 'Al Maryah Island', focus: 'Corporate demand', detail: 'Business services, clinics, and professional brands need structured public profiles.' },
      { name: 'Yas Island', focus: 'Lifestyle and hospitality', detail: 'Leisure, dining, and visitor-facing brands benefit from stronger local discovery.' }
    ]
  },
  {
    slug: 'sharjah',
    label: 'Sharjah',
    headline: 'A value-conscious local market where strong area pages and clearer business identity can stand out quickly.',
    summary: 'Sharjah should feel approachable and local, while still carrying premium profile design and stronger category structure.',
    topAreas: [
      { name: 'Aljada', focus: 'Growth district', detail: 'Modern brands, salons, cafes, and clinics can anchor the local directory layer.' },
      { name: 'Muwaileh', focus: 'Everyday demand', detail: 'Neighborhood businesses with strong contact clarity and trust can grow here.' },
      { name: 'Al Majaz', focus: 'Established local flow', detail: 'Dining and lifestyle businesses benefit from area-led search and profile richness.' }
    ]
  },
  {
    slug: 'ajman',
    label: 'Ajman',
    headline: 'Local-first business discovery where area relevance and trust often matter more than brand scale.',
    summary: 'Ajman directory pages should focus on practical trust, profile completeness, and neighborhood visibility that feels genuinely useful.',
    topAreas: [
      { name: 'Al Nuaimiya', focus: 'Everyday consumer demand', detail: 'Beauty, clinics, restaurants, and neighborhood services can perform well here.' },
      { name: 'Al Rashidiya', focus: 'Mixed-use demand', detail: 'Local business profiles and category discovery should feel clear and accessible.' },
      { name: 'Ajman Corniche', focus: 'Lifestyle demand', detail: 'Hospitality, dining, and beauty businesses benefit from polished public pages.' }
    ]
  }
];

export const directoryBusinessProfiles: DirectoryBusinessProfile[] = [
  {
    slug: 'harbor-table-bistro',
    name: 'Harbor Table Bistro',
    category: 'Restaurants',
    headline: 'A premium local dining brand with shareable public identity and stronger neighborhood discovery value.',
    summary:
      'Harbor Table Bistro represents how dining brands should look in GulfHabibi Directory: polished, location-aware, and strong enough to act as both a search result and a public brand page.',
    coverage: 'Dubai Marina and JBR dining discovery',
    responseSignal: 'High-profile public contact posture',
    profileMode: 'Premium dining profile',
    badges: ['Verified Business', 'Premium Profile', 'Multi-location ready'],
    metrics: [
      { label: 'Primary category', value: 'Dining and hospitality' },
      { label: 'Local lane', value: 'Dubai Marina lifestyle demand' },
      { label: 'Public fit', value: 'Brand-first discovery surface' }
    ],
    trustSignals: [
      'Visible business identity should create more trust than a thin directory card',
      'Area relevance and category fit should be obvious on first scroll',
      'Profile depth should help the brand earn both organic traffic and user confidence',
      'Premium upgrades should enhance quality, not overwhelm the page'
    ],
    activeLanes: [
      { title: 'Dubai dining lane', emirateSlug: 'dubai', categorySlug: 'restaurants', detail: 'Restaurant discovery with stronger area and business identity.' },
      { title: 'Lifestyle business profile', emirateSlug: 'dubai', categorySlug: 'restaurants', detail: 'A shareable public page for repeat and referral discovery.' }
    ]
  },
  {
    slug: 'northline-family-clinic',
    name: 'Northline Family Clinic',
    category: 'Clinics',
    headline: 'A trust-sensitive healthcare business profile with stronger location cues and calmer brand presentation.',
    summary:
      'Northline Family Clinic shows how healthcare directory profiles should feel: credible, location clear, and structured enough for higher-trust search behavior.',
    coverage: 'Khalifa City and Abu Dhabi family healthcare discovery',
    responseSignal: 'Visible clinic identity and branch posture',
    profileMode: 'Healthcare profile',
    badges: ['Verified Business', 'Clinic Profile', 'Branch Ready'],
    metrics: [
      { label: 'Primary category', value: 'Healthcare and clinics' },
      { label: 'Local lane', value: 'Abu Dhabi family services' },
      { label: 'Public fit', value: 'Trust-heavy discovery page' }
    ],
    trustSignals: [
      'Healthcare pages need stronger credibility than generic local listings',
      'Business identity, branch location, and category clarity should be easy to scan',
      'Calmer premium design supports trust better than noisy directory cards',
      'Structured public pages can later support richer service and provider linking'
    ],
    activeLanes: [
      { title: 'Abu Dhabi clinics', emirateSlug: 'abu-dhabi', categorySlug: 'clinics', detail: 'Trust-first healthcare discovery with stronger local identity.' },
      { title: 'Family services lane', emirateSlug: 'abu-dhabi', categorySlug: 'clinics', detail: 'A practical public profile for repeat local healthcare discovery.' }
    ]
  },
  {
    slug: 'atelier-silk-salon',
    name: 'Atelier Silk Salon',
    category: 'Beauty Salons',
    headline: 'A brand-led beauty profile where neighborhood relevance and public polish directly affect discovery quality.',
    summary:
      'Atelier Silk Salon represents how beauty brands can use the directory as a true public profile layer, not just a name in a business list.',
    coverage: 'Sharjah and Dubai beauty-led discovery',
    responseSignal: 'Profile-driven local visibility',
    profileMode: 'Beauty profile',
    badges: ['Verified Business', 'Featured Profile', 'Lifestyle Brand'],
    metrics: [
      { label: 'Primary category', value: 'Beauty and wellness' },
      { label: 'Local lane', value: 'Sharjah and Dubai neighborhood search' },
      { label: 'Public fit', value: 'Visual brand profile surface' }
    ],
    trustSignals: [
      'Beauty profiles need stronger brand presentation to stand out',
      'Area relevance and contact clarity should reduce low-intent clicks',
      'Public profile depth creates more trust than a flat directory row',
      'A premium directory can support strong consumer-facing business discovery'
    ],
    activeLanes: [
      { title: 'Beauty in Sharjah', emirateSlug: 'sharjah', categorySlug: 'beauty-salons', detail: 'Sharjah lifestyle and beauty discovery with stronger profile presentation.' },
      { title: 'Dubai salon lane', emirateSlug: 'dubai', categorySlug: 'beauty-salons', detail: 'Premium beauty visibility in higher-intent neighborhoods.' }
    ]
  },
  {
    slug: 'catalyst-advisory-partners',
    name: 'Catalyst Advisory Partners',
    category: 'Business Services',
    headline: 'A professional services profile designed to feel more credible than open listings or thin local directories.',
    summary:
      'Catalyst Advisory Partners shows how B2B brands can use GulfHabibi Directory as a trust and discovery layer with stronger structured identity.',
    coverage: 'Dubai and Abu Dhabi professional services discovery',
    responseSignal: 'Direct business contact confidence',
    profileMode: 'B2B profile',
    badges: ['Verified Business', 'Professional Services', 'Premium Profile'],
    metrics: [
      { label: 'Primary category', value: 'Business and advisory services' },
      { label: 'Local lane', value: 'Dubai and Abu Dhabi corporate demand' },
      { label: 'Public fit', value: 'Professional trust object' }
    ],
    trustSignals: [
      'Professional services need strong public identity before users ever get in touch',
      'A structured business profile helps separate credible operators from low-trust local listings',
      'Category and location pages should route high-intent local business discovery here',
      'This page should support both search and long-term brand credibility'
    ],
    activeLanes: [
      { title: 'Dubai business services', emirateSlug: 'dubai', categorySlug: 'business-services', detail: 'Corporate and advisory discovery with stronger profile quality.' },
      { title: 'Abu Dhabi consulting lane', emirateSlug: 'abu-dhabi', categorySlug: 'business-services', detail: 'Professional trust-first discovery for B2B users.' }
    ]
  }
];

export function getDirectoryEmirateSpotlight(slug: string) {
  const found = directoryEmirates.find((item) => item.slug === slug);

  if (found) {
    return found;
  }

  const label = humanizeSlug(slug);

  return {
    slug,
    label,
    headline: `${label} should have a stronger local business discovery surface.`,
    summary: 'This emirate route should later connect to real business profiles, category hubs, and stronger local SEO structure.',
    topAreas: [
      { name: `${label} Central`, focus: 'Local demand', detail: 'A premium area lane should explain why these businesses matter here.' },
      { name: `${label} Business District`, focus: 'Professional activity', detail: 'B2B and service brands can anchor stronger local discovery.' },
      { name: `${label} Lifestyle Areas`, focus: 'Consumer-facing demand', detail: 'Dining, wellness, beauty, and local services can build the consumer side of directory search.' }
    ]
  };
}

export function getDirectoryCategory(slug: string) {
  return directoryCategories.find((item) => item.slug === slug) || null;
}

export function getDirectoryBusinessProfile(slug: string) {
  return directoryBusinessProfiles.find((item) => item.slug === slug) || buildFallbackBusinessProfile(slug);
}

function buildFallbackBusinessProfile(slug: string): DirectoryBusinessProfile {
  const label = humanizeSlug(slug);

  return {
    slug,
    name: label,
    category: 'Directory profile',
    headline: `${label} should become a polished public business profile with stronger local trust and category fit.`,
    summary:
      'This fallback business page keeps the directory profile system usable before live business data is connected to the public read layer.',
    coverage: 'UAE business visibility',
    responseSignal: 'Public profile template',
    profileMode: 'Business profile template',
    badges: ['Business Profile', 'Trust First'],
    metrics: [
      { label: 'Public role', value: 'Business identity surface' },
      { label: 'Growth fit', value: 'Category + area SEO asset' },
      { label: 'Commercial fit', value: 'Premium profile ready' }
    ],
    trustSignals: [
      'Business identity should be visible before contact or inquiry',
      'Directory profiles should feel calmer and more premium than ordinary local listings',
      'Category and area fit should be obvious on first scroll',
      'Premium enhancements should strengthen trust, not overwhelm the page'
    ],
    activeLanes: [
      { title: `${label} local lane`, emirateSlug: 'dubai', categorySlug: 'business-services', detail: 'This placeholder lane will later connect to live category and area discovery.' }
    ]
  };
}

export function humanizeSlug(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function slugifyLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
