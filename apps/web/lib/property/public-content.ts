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
    title: 'Discover premium homes and investment properties for sale and rent.',
    description:
      'A curated collection of verified listings from the UAE\'s top real estate agencies and direct owners.',
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
        badge: 'Luxury Villa',
        title: '5 Bed Custom Built Villa with Golf Course Views',
        subtitle: 'Dubai Hills Estate, Parkway Vistas',
        price: 'AED 42,000,000',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Sale',
        highlight: 'Private pool, cinema room, and fully upgraded interiors.',
      },
      {
        badge: 'Premium Apartment',
        title: '3 Bed Penthouse with Full Palm Jumeirah View',
        subtitle: 'Dubai Marina, Elite Residence',
        price: 'AED 380,000 / year',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        meta: 'Rent',
        highlight: 'High floor, maid room, and premium appliances included.',
      },
      {
        badge: 'Commercial Office',
        title: 'Fitted Office Space in Grade A Building',
        subtitle: 'Business Bay, The Opus',
        price: 'AED 185,000 / year',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        meta: 'Commercial',
        highlight: 'Close to metro, 3 parking spots, and Burj Khalifa view.',
      }
    ],
    operatorHighlights: [
      {
        title: 'Top Tier Agencies',
        badge: 'Verified Agency',
        detail: 'Connect with RERA-certified brokers offering exclusive stock.'
      },
      {
        title: 'Direct from Owner',
        badge: 'No Commission',
        detail: 'Verified private owners listing directly to save you agency fees.'
      }
    ]
  },
  short_term: {
    marketMode: 'short_term',
    label: 'Short Stay',
    eyebrow: 'Holiday Homes & Daily Stay',
    title: 'Luxury holiday homes and serviced apartments for flexible stays.',
    description:
      'Discover fully furnished, premium properties for daily, weekly, or monthly stays.',
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
        title: 'Luxury 2 Bed Waterfront Apartment',
        subtitle: 'Jumeirah Beach Residence, Sadaf 4',
        price: 'AED 850 / night',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        meta: 'Short stay',
        highlight: 'Direct beach access, high-speed WiFi, and weekly cleaning.',
      },
      {
        badge: 'Monthly Flex',
        title: 'Fully Serviced Studio in Downtown',
        subtitle: 'Downtown Dubai, The Address',
        price: 'AED 12,500 / month',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Flexible rent',
        highlight: 'All bills included, room service, and valet parking.',
      },
      {
        badge: 'Family Escape',
        title: '4 Bed Beachfront Villa with Private Pool',
        subtitle: 'Palm Jumeirah, Frond M',
        price: 'AED 4,200 / night',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        meta: 'Curated stays',
        highlight: 'Sleeps 8, private chef on request, and direct beach access.',
      }
    ],
    operatorHighlights: [
      {
        title: 'Superhosts & Premium Operators',
        badge: 'Managed Inventory',
        detail: 'Stay with DTCM-approved operators for a safe, hassle-free experience.'
      },
      {
        title: 'Flexible Stay Terms',
        badge: 'Flexible Search',
        detail: 'Extend your stay easily with flexible daily, weekly, and monthly rates.'
      }
    ]
  },
  off_plan: {
    marketMode: 'off_plan',
    label: 'Off-Plan',
    eyebrow: 'Developer Launch Inventory',
    title: 'Exclusive access to premium off-plan launches and developer inventory.',
    description:
      'Explore the latest off-plan projects with flexible payment plans and direct developer access.',
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
        title: '3 Bed Townhouse with 5-Year Payment Plan',
        subtitle: 'Dubai Creek Harbour, The Cove',
        price: 'From AED 1.85M',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Off-plan',
        highlight: '10% downpayment and handover in Q4 2026.',
      },
      {
        badge: 'Investor Focus',
        title: 'High-Yield Branded Residences by Aston Martin',
        subtitle: 'Business Bay, Peninsula',
        price: 'From AED 2.1M',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        meta: 'Flexible terms',
        highlight: 'Guaranteed 8% ROI for 3 years post handover.',
      },
      {
        badge: 'Project Profile',
        title: 'Ultra-Luxury Mansions on Private Island',
        subtitle: 'Jumeirah Bay Island',
        price: 'Starting AED 85M',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        meta: 'Project SEO',
        highlight: 'Exclusive 12 mansions only, private beach access.',
      }
    ],
    operatorHighlights: [
      {
        title: 'Verified Master Developers',
        badge: 'Developer Profile',
        detail: 'Direct access to Emaar, Aldar, and Damac sales teams.'
      },
      {
        title: 'Exclusive Launch Campaigns',
        badge: 'Launch Access',
        detail: 'Get priority access to pre-launch pricing and VIP inventory.'
      }
    ]
  },
  new_project: {
    marketMode: 'new_project',
    label: 'New Projects',
    eyebrow: 'Project Discovery',
    title: 'Discover master-planned communities and upcoming mega-projects.',
    description:
      'Browse comprehensive project profiles, complete with floor plans, amenities, and delivery timelines.',
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
        badge: 'Masterplan',
        title: 'The Oasis by Emaar',
        subtitle: 'Dubailand',
        price: 'Project-first',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        meta: 'Villas & Mansions',
        highlight: '100 million sq ft of luxury resort-style living with lakes.',
      },
      {
        badge: 'Developer Story',
        title: 'Sobha Hartland II',
        subtitle: 'Mohammed Bin Rashid City',
        price: 'Curated pipeline',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        meta: 'Apartments',
        highlight: '8 million sq ft of waterfront living with 2 international schools.',
      },
      {
        badge: 'Sales Enablement',
        title: 'Saadiyat Grove',
        subtitle: 'Saadiyat Island, Abu Dhabi',
        price: 'Flexible campaigns',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        meta: 'Mixed-Use',
        highlight: 'Museum-district living integrated with retail and hospitality.',
      }
    ],
    operatorHighlights: [
      {
        title: 'Developer Showcases',
        badge: 'Shared Distribution',
        detail: 'Explore full project portfolios from the UAEs most trusted developers.'
      },
      {
        title: 'Project Availability',
        badge: 'Indexable Pages',
        detail: 'See exactly which units are available directly from the master developer.'
      }
    ]
  }
};

export const propertyLandingTrustSignals = [
  'Verified Agency Network',
  'Direct Developer Access',
  'Transparent Property History',
  'Secure Transaction Environment'
];

export const propertyLandingOperators: PropertyOperatorHighlight[] = [
  {
    title: 'Agencies and brokers',
    badge: 'Sales + Rent',
    detail: 'Connect with top-tier, verified real estate brokers.'
  },
  {
    title: 'Developers and launch partners',
    badge: 'Projects + Off-Plan',
    detail: 'Direct access to new launches from master developers.'
  },
  {
    title: 'Holiday-home operators',
    badge: 'Short Stay',
    detail: 'Premium serviced apartments from trusted operators.'
  }
];

export const propertyLandingCollections: PropertyShowcaseItem[] = [
  {
    badge: 'Prime Demand',
    title: 'Luxury Waterfront Apartments',
    subtitle: 'Dubai Marina & JBR',
    price: 'AED 3.5M',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    meta: 'Ready to move',
    highlight: 'Full sea views, upgraded interiors, and direct beach access.',
  },
  {
    badge: 'Trust-First',
    title: 'Family Villas & Townhouses',
    subtitle: 'Dubai Hills Estate',
    price: 'AED 4.2M',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    meta: 'Parks & Schools',
    highlight: 'Close to international schools, 18-hole golf course, and mall.',
  },
  {
    badge: 'Revenue-Ready',
    title: 'Premium Off-Plan Launches',
    subtitle: 'Palm Jebel Ali',
    price: 'AED 18M',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    meta: 'Launch Phase',
    highlight: 'Exclusive VIP access to the newest beachfront mega-project.',
  }
];

export const propertyEmirateSpotlights: PropertyEmirateSpotlight[] = [
  {
    slug: 'dubai',
    label: 'Dubai',
    headline: 'The ultimate destination for luxury real estate and high-yield investments.',
    summary: 'Explore premium waterfront apartments, family villas, and exclusive branded residences across Dubai.',
    communities: [
      { name: 'Dubai Marina', focus: 'Waterfront apartments', detail: 'Fast-moving residential demand, investor stock, and short-term crossover.' },
      { name: 'Business Bay', focus: 'Urban mixed-use', detail: 'Commercial demand, branded residences, and high-turnover buyer traffic.' },
      { name: 'Dubai Hills Estate', focus: 'Family communities', detail: 'Townhouses, villas, schools, and long-term lifestyle buyers.' }
    ]
  },
  {
    slug: 'abu-dhabi',
    label: 'Abu Dhabi',
    headline: 'Premium family communities, cultural districts, and institutional-grade real estate.',
    summary: 'Discover serene island living, luxury villas, and high-end apartments in the capital.',
    communities: [
      { name: 'Yas Island', focus: 'Leisure-led investment', detail: 'Branded living, off-plan launches, and destination-led growth.' },
      { name: 'Al Reem Island', focus: 'High-rise living', detail: 'Investor demand, skyline stock, and mixed family/professional appeal.' },
      { name: 'Saadiyat Island', focus: 'Luxury and cultural living', detail: 'High-value inventory, premium launches, and prestige-driven buyers.' }
    ]
  },
  {
    slug: 'sharjah',
    label: 'Sharjah',
    headline: 'Value-driven family communities with excellent commuter links.',
    summary: 'Explore spacious, affordable family homes with premium community amenities and easy access to Dubai.',
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
    summary: 'Discover luxury beachfront properties, holiday homes, and exclusive resort communities.',
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
