import type { PropertyMarketMode } from '@gulfbuddy/types';

export interface PropertyMetric {
  label: string;
  value: string;
}

export interface PropertySearchField {
  label: string;
  value: string;
}

export interface PropertyShowcaseItem {
  badge: string;
  title: string;
  subtitle: string;
  price: string;
  imageUrl: string;
  image?: string;
  meta: string;
  highlight: string;
}

export interface PropertyOperatorHighlight {
  title: string;
  badge: string;
  detail: string;
  imageUrl?: string;
}

export interface PropertyAreaHighlight {
  name: string;
  focus: string;
  detail: string;
  imageUrl?: string;
}

export interface PropertyEmirateSpotlight {
  slug: string;
  label: string;
  headline: string;
  summary: string;
  communities: PropertyAreaHighlight[];
  imageUrl?: string;
}

export interface PropertyModeConfig {
  marketMode: PropertyMarketMode;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  searchActionLabel: string;
  searchFields: PropertySearchField[];
  quickFilters: string[];
  trustSignals: string[];
  metrics: PropertyMetric[];
  showcaseItems: PropertyShowcaseItem[];
  operatorHighlights: PropertyOperatorHighlight[];
}

export const propertyModeOrder: PropertyMarketMode[] = ['long_term', 'short_term', 'off_plan', 'new_project'];

export const propertyModeConfigs: Record<PropertyMarketMode, PropertyModeConfig> = {
  long_term: {
    marketMode: 'long_term',
    label: 'Sale & Rent',
    eyebrow: 'Long-Term Property',
    title: 'Sale and rent discovery built for serious local intent, not noisy search overload.',
    description:
      'Long-term property should feel like a premium command center for buying and renting in the UAE, with cleaner search lanes, trusted advertiser identity, and sharper local discovery.',
    searchActionLabel: 'Explore long-term inventory',
    searchFields: [
      { label: 'Purpose', value: 'Sale or Rent' },
      { label: 'Emirate', value: 'Dubai, Abu Dhabi, Sharjah' },
      { label: 'Community / Building', value: 'Marina, Business Bay, Reem Island' },
      { label: 'Property Type', value: 'Apartment, Villa, Townhouse, Commercial' },
      { label: 'Budget Range', value: 'From AED 900K or AED 75K / year' }
    ],
    quickFilters: ['Verified companies only', 'Permit-backed inventory', 'Ready to move', 'Family communities', 'Investor-ready'],
    trustSignals: ['Permit-aware publishing', 'Verified agency routing', 'Area-first search pages', 'Duplicate risk checks'],
    metrics: [
      { label: 'Primary lanes', value: 'Sale + Rent' },
      { label: 'Trust posture', value: 'Permit-aware' },
      { label: 'Operator mix', value: 'Agencies + owners' }
    ],
    showcaseItems: [
      {
        badge: 'Verified Agency',
        title: 'Waterfront apartments with cleaner comparison flow',
        subtitle: 'Dubai Marina, Jumeirah Beach Residence, Palm Jumeirah',
        price: 'From AED 1.28M',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Long-term focus',
        highlight: 'Built for genuine intent, not teaser-price noise.',
      },
      {
        badge: 'Family Demand',
        title: 'Villa and townhouse communities with trust-first filters',
        subtitle: 'Arabian Ranches, Tilal Al Ghaf, Yas Acres',
        price: 'From AED 210K / year',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Rent + Sale',
        highlight: 'Purpose, beds, and community depth should stay visible at first glance.',
      },
      {
        badge: 'Commercial Stock',
        title: 'Office, retail, and mixed-use discovery for business buyers',
        subtitle: 'Business Bay, DIFC, Abu Dhabi Corniche',
        price: 'From AED 85K / year',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Commercial',
        highlight: 'High-value inventory needs cleaner facts, maps, and company credibility.',
      }
    ],
    operatorHighlights: [
      {
        title: 'Agencies with branch identity',
        badge: 'Agency Workspace',
        detail: 'Showcase verified agencies, branch teams, and broker-linked inventory instead of anonymous generic listings.'
      },
      {
        title: 'Owner-assisted lane with tighter review',
        badge: 'Controlled Owner Flow',
        detail: 'Individuals can participate, but long-term property should still route risky submissions into trust and compliance review.'
      }
    ]
  },
  short_term: {
    marketMode: 'short_term',
    label: 'Short Stay',
    eyebrow: 'Holiday Homes & Daily Stay',
    title: 'Short-stay discovery for holiday homes, serviced apartments, and monthly flex living.',
    description:
      'Daily and short-term property should feel distinct from long-term rent, with operator trust signals, stay-length friendly filters, and clean local travel intent.',
    searchActionLabel: 'Explore short-stay options',
    searchFields: [
      { label: 'Stay Type', value: 'Daily, Weekly, Monthly' },
      { label: 'Emirate', value: 'Dubai, Ras Al Khaimah, Abu Dhabi' },
      { label: 'Area / Landmark', value: 'Downtown, Bluewaters, JBR, Al Marjan' },
      { label: 'Property Type', value: 'Serviced apartment, villa, beachfront stay' },
      { label: 'Guest Needs', value: 'Family stay, business stay, pet-friendly' }
    ],
    quickFilters: ['Operator approved', 'Flexible stay length', 'Business travel ready', 'Beachfront', 'Entire unit only'],
    trustSignals: ['Holiday-home separation', 'Operator-level review', 'Availability-aware filters', 'Safer guest contact flow'],
    metrics: [
      { label: 'Primary use', value: 'Daily + Monthly' },
      { label: 'Compliance lane', value: 'Holiday-home' },
      { label: 'Experience', value: 'Stay-first discovery' }
    ],
    showcaseItems: [
      {
        badge: 'Holiday Home',
        title: 'Downtown and waterfront stays for short urban trips',
        subtitle: 'Downtown Dubai, JBR, Dubai Marina',
        price: 'From AED 520 / night',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Short stay',
        highlight: 'Short-term pages should prioritise stay duration, operator trust, and local fit.',
      },
      {
        badge: 'Monthly Flex',
        title: 'Serviced apartments for relocation and business travellers',
        subtitle: 'Business Bay, Al Reem Island, Aljada',
        price: 'From AED 9,500 / month',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Flexible rent',
        highlight: 'A clean flex-living lane can capture Airbnb-style demand without mixing it into long-term rent.',
      },
      {
        badge: 'Family Escape',
        title: 'Beachfront villas and branded residences with premium support',
        subtitle: 'Palm Jumeirah, Saadiyat, Al Marjan Island',
        price: 'From AED 2,950 / night',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Curated stays',
        highlight: 'Trust badges and operator quality should do the heavy lifting here.',
      }
    ],
    operatorHighlights: [
      {
        title: 'Operator-first trust profile',
        badge: 'Managed Inventory',
        detail: 'Short-stay supply should highlight operator response quality, approval status, and guest-ready service cues.'
      },
      {
        title: 'Stay-ready filters',
        badge: 'Flexible Search',
        detail: 'Guests should quickly understand location, stay length, amenities, and whether the operator is built for real hospitality.'
      }
    ]
  },
  off_plan: {
    marketMode: 'off_plan',
    label: 'Off-Plan',
    eyebrow: 'Developer Launch Inventory',
    title: 'Off-plan should feel like a premium developer marketplace, not a generic listing dump.',
    description:
      'This lane should elevate launches, payment plans, handover timing, developer identity, and project-level trust so investors can compare serious opportunities quickly.',
    searchActionLabel: 'Explore off-plan launches',
    searchFields: [
      { label: 'Emirate', value: 'Dubai, Abu Dhabi, Ras Al Khaimah' },
      { label: 'Developer', value: 'Emaar, Aldar, Nakheel, Binghatti' },
      { label: 'Launch Price', value: 'From AED 650K' },
      { label: 'Property Type', value: 'Apartment, townhouse, villa' },
      { label: 'Handover Window', value: '2026, 2027, 2028+' }
    ],
    quickFilters: ['Payment plan', 'Investor picks', 'Launch discounts', 'Verified developers', 'Branded residences'],
    trustSignals: ['Developer-linked profiles', 'Project-level SEO pages', 'Launch campaign support', 'Project lead routing'],
    metrics: [
      { label: 'Primary angle', value: 'Launch + payment plan' },
      { label: 'Operator mix', value: 'Developer-led' },
      { label: 'Lead style', value: 'Project-first' }
    ],
    showcaseItems: [
      {
        badge: 'Launch Spotlight',
        title: 'Waterfront launch campaigns with payment-plan comparison',
        subtitle: 'Dubai Creek Harbour, Rashid Yachts & Marina, Saadiyat Lagoons',
        price: 'From AED 1.05M',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Off-plan',
        highlight: 'Off-plan pages should surface handover, payment plan, and developer trust before long-form copy.',
      },
      {
        badge: 'Investor Focus',
        title: 'Early-phase branded residences and high-yield towers',
        subtitle: 'Business Bay, JVC, Yas Island',
        price: 'From AED 780K',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Flexible terms',
        highlight: 'Premium investors want cleaner entry-price, cashflow, and launch signals.',
      },
      {
        badge: 'Project Profile',
        title: 'Project-centric discovery with unit mix and availability cues',
        subtitle: 'Townhouses, apartments, duplexes, signature penthouses',
        price: 'Starting launches',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Project SEO',
        highlight: 'Project objects should be first-class, not buried behind generic listing cards.',
      }
    ],
    operatorHighlights: [
      {
        title: 'Developer branding that earns trust',
        badge: 'Developer Profile',
        detail: 'Off-plan supply should foreground the developer, project identity, and confidence-building launch structure.'
      },
      {
        title: 'Campaign-friendly premium surfaces',
        badge: 'Launch Monetization',
        detail: 'This lane is where sponsored launches, hero campaigns, and premium project pages should feel natural instead of intrusive.'
      }
    ]
  },
  new_project: {
    marketMode: 'new_project',
    label: 'New Projects',
    eyebrow: 'Project Discovery',
    title: 'New projects deserve profile-first discovery with cleaner developer storytelling and stronger trust signals.',
    description:
      'Project pages should behave like premium public objects: indexable, shareable, rich in handover and unit information, and tightly connected to developer and agency workflows.',
    searchActionLabel: 'Explore new projects',
    searchFields: [
      { label: 'Emirate', value: 'Dubai, Abu Dhabi, Sharjah' },
      { label: 'Project Type', value: 'Masterplan, tower, townhouse community' },
      { label: 'Developer', value: 'Established UAE developers only' },
      { label: 'Delivery Window', value: 'Near handover or future pipeline' },
      { label: 'Buyer Intent', value: 'End-user, investor, launch campaign' }
    ],
    quickFilters: ['Project profile', 'Delivery timelines', 'Developer pages', 'Launch campaigns', 'Masterplan communities'],
    trustSignals: ['Project-first detail pages', 'Developer trust cues', 'Shareable public profiles', 'Launch-ready lead capture'],
    metrics: [
      { label: 'Primary object', value: 'Project page' },
      { label: 'Best fit', value: 'Developer marketing' },
      { label: 'Growth lane', value: 'SEO + campaigns' }
    ],
    showcaseItems: [
      {
        badge: 'Project Profile',
        title: 'Masterplan communities with deep public profiles',
        subtitle: 'The Valley, Sobha Hartland, Saadiyat cultural districts',
        price: 'Project-first',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Shareable pages',
        highlight: 'The page itself should become the marketing asset, not only the lead form.',
      },
      {
        badge: 'Developer Story',
        title: 'Launch storytelling with trust, area context, and unit mix',
        subtitle: 'Townhouses, villas, mid-rise, branded towers',
        price: 'Curated pipeline',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Developer-led',
        highlight: 'New projects need richer narrative and stronger page composition than ordinary stock.',
      },
      {
        badge: 'Sales Enablement',
        title: 'Project pages that support agencies, brokers, and paid campaigns',
        subtitle: 'Launch decks, handover highlights, premium inventory slots',
        price: 'Flexible campaigns',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Monetization',
        highlight: 'This is one of the strongest premium revenue surfaces in the whole property module.',
      }
    ],
    operatorHighlights: [
      {
        title: 'Developer and agency collaboration',
        badge: 'Shared Distribution',
        detail: 'Projects should support both developer ownership and controlled agency distribution without losing trust context.'
      },
      {
        title: 'SEO-grade public objects',
        badge: 'Indexable Pages',
        detail: 'Project pages can become long-term search assets when the design and data structure are treated as first-class product work.'
      }
    ]
  }
};

export const propertyLandingTrustSignals = [
  'Compliance-aware publishing for regulated lanes',
  'Public company profiles for agencies, developers, and operators',
  'Area-first discovery so the portal feels local, not generic',
  'Premium placements that fit the experience instead of cluttering it'
];

export const propertyLandingOperators: PropertyOperatorHighlight[] = [
  {
    title: 'Agencies and brokers',
    badge: 'Sales + Rent',
    detail: 'Professional agencies need elegant public identity, team visibility, and cleaner trust signals than typical classified pages.'
  },
  {
    title: 'Developers and launch partners',
    badge: 'Projects + Off-Plan',
    detail: 'Off-plan and new-project workflows should feel built for launches, campaigns, and project profile pages from day one.'
  },
  {
    title: 'Holiday-home operators',
    badge: 'Short Stay',
    detail: 'Short-term stays should be intentionally separated so the UX stays clean and policy handling remains controlled.'
  }
];

export const propertyLandingCollections: PropertyShowcaseItem[] = [
  {
    badge: 'Prime Demand',
    title: 'Waterfront living, family communities, and investor towers in one controlled module',
    subtitle: 'Dubai Marina, Yas Island, Sharjah Waterfront, Al Marjan Island',
    price: 'Multi-lane discovery',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    meta: 'Public module direction',
    highlight: 'Property should feel premium enough for high-value inventory, but still approachable for normal users.',
  },
  {
    badge: 'Trust-First',
    title: 'Verified operator identity, permit cues, and cleaner listing detail design',
    subtitle: 'Agencies, developers, owners, and approved short-stay operators',
    price: 'Higher quality supply',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    meta: 'Compliance-ready',
    highlight: 'The public experience should constantly reinforce that GulfHabibi is moderated and structured.',
  },
  {
    badge: 'Revenue-Ready',
    title: 'Launch campaigns, premium placements, and public project pages that feel natural',
    subtitle: 'No noisy ad-board experience, no wasted hero space, no cheap template feel',
    price: 'Premium monetization',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    meta: 'Platform fit',
    highlight: 'Monetization should feel integrated into the page composition instead of screaming for attention.',
  }
];

export const propertyEmirateSpotlights: PropertyEmirateSpotlight[] = [
  {
    slug: 'dubai',
    label: 'Dubai',
    headline: 'Investor demand, luxury supply, and the most mature permit-aware discovery lane.',
    summary: 'Dubai should lead with premium area discovery, verified agency and developer identity, and cleaner trust signals across sale, rent, off-plan, and projects.',
    communities: [
      { name: 'Dubai Marina', focus: 'Waterfront apartments', detail: 'Fast-moving residential demand, investor stock, and short-term crossover.' },
      { name: 'Business Bay', focus: 'Urban mixed-use', detail: 'Commercial demand, branded residences, and high-turnover buyer traffic.' },
      { name: 'Dubai Hills Estate', focus: 'Family communities', detail: 'Townhouses, villas, schools, and long-term lifestyle buyers.' }
    ]
  },
  {
    slug: 'abu-dhabi',
    label: 'Abu Dhabi',
    headline: 'Institutional-grade stock, premium family communities, and stronger company credibility cues.',
    summary: 'Abu Dhabi needs calmer, trust-first discovery with strong developer and agency visibility, not a copy of Dubai search patterns.',
    communities: [
      { name: 'Yas Island', focus: 'Leisure-led investment', detail: 'Branded living, off-plan launches, and destination-led growth.' },
      { name: 'Al Reem Island', focus: 'High-rise living', detail: 'Investor demand, skyline stock, and mixed family/professional appeal.' },
      { name: 'Saadiyat Island', focus: 'Luxury and cultural living', detail: 'High-value inventory, premium launches, and prestige-driven buyers.' }
    ]
  },
  {
    slug: 'sharjah',
    label: 'Sharjah',
    headline: 'Value-driven family demand with strong local business and commuter relevance.',
    summary: 'Sharjah should feel simpler and more approachable, while still carrying strong trust cues and cleaner area-led search.',
    communities: [
      { name: 'Aljada', focus: 'New community growth', detail: 'Modern masterplan stock, family demand, and launch-driven inventory.' },
      { name: 'Muwaileh', focus: 'Rental demand', detail: 'Commuter-led movement, education hubs, and mid-market occupancy.' },
      { name: 'Sharjah Waterfront', focus: 'Lifestyle demand', detail: 'Higher-value coastal living and project-led opportunities.' }
    ]
  },
  {
    slug: 'ras-al-khaimah',
    label: 'Ras Al Khaimah',
    headline: 'Resort-led growth, branded projects, and short-stay opportunity.',
    summary: 'RAK should combine branded launch storytelling with more intentional short-stay and holiday-home discovery.',
    communities: [
      { name: 'Al Marjan Island', focus: 'Beachfront projects', detail: 'Hospitality-backed developments, branded residences, and tourism growth.' },
      { name: 'Mina Al Arab', focus: 'Coastal communities', detail: 'Lifestyle living, villas, and mid-to-premium family stock.' },
      { name: 'Al Hamra', focus: 'Golf and marina living', detail: 'Mixed short-stay, owner-occupier, and investor demand.' }
    ]
  }
];

export function getPropertyModeConfig(marketMode: string) {
  return propertyModeConfigs[marketMode as PropertyMarketMode] ?? null;
}

export function getPropertyEmirateSpotlight(emirate: string): PropertyEmirateSpotlight {
  const found = propertyEmirateSpotlights.find((item) => item.slug === emirate);

  if (found) {
    return found;
  }

  return {
    slug: emirate,
    label: humanizeSlug(emirate),
    headline: `${humanizeSlug(emirate)} local property search with trusted operators and cleaner area discovery.`,
    summary: 'Browse a local property lane with community context, public operator identity, and search-first inventory framing.',
    communities: [
      {
        name: `${humanizeSlug(emirate)} Central`,
        focus: 'Local demand',
        detail: 'A strong local lane should quickly explain what drives demand in this part of the market.'
      },
      {
        name: `${humanizeSlug(emirate)} Waterfront`,
        focus: 'Lifestyle-led stock',
        detail: 'Waterfront and destination-led areas help users understand the premium end of the market fast.'
      },
      {
        name: `${humanizeSlug(emirate)} Business District`,
        focus: 'Mixed-use demand',
        detail: 'A cleaner layout keeps commercial and residential intent easy to separate.'
      }
    ]
  };
}

export function buildEmirateShowcaseItems(marketMode: PropertyMarketMode, emirateLabel: string): PropertyShowcaseItem[] {
  return propertyModeConfigs[marketMode].showcaseItems.map((item, index) => ({
    ...item,
    subtitle: `${emirateLabel} focus ${index + 1} · ${item.subtitle}`,
    meta: `${emirateLabel} lane`
  }));
}

export function buildLocalOperatorHighlights(marketMode: PropertyMarketMode, emirateLabel: string): PropertyOperatorHighlight[] {
  return propertyModeConfigs[marketMode].operatorHighlights.map((item) => ({
    ...item,
    detail: `${item.detail} In ${emirateLabel}, this should connect to public company identity, better reporting, and cleaner lead routing.`
  }));
}

export function buildEmirateShowcaseItemsClean(marketMode: PropertyMarketMode, emirateLabel: string): PropertyShowcaseItem[] {
  return propertyModeConfigs[marketMode].showcaseItems.map((item, index) => ({
    ...item,
    subtitle: `${emirateLabel} focus ${index + 1} - ${item.subtitle}`,
    meta: `${emirateLabel} lane`
  }));
}

export function humanizeSlug(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
