export interface ClassifiedsMetric {
  label: string;
  value: string;
}

export interface ClassifiedsSearchField {
  label: string;
  value: string;
}

export interface ClassifiedsCategory {
  slug: string;
  title: string;
  focus: string;
  detail: string;
}

export interface ClassifiedsHighlight {
  title: string;
  badge: string;
  detail: string;
  imageUrl?: string;
}

export interface ClassifiedsMarketHighlight {
  title: string;
  detail: string;
  imageUrl?: string;
}

export interface ClassifiedsEmirateSpotlight {
  slug: string;
  label: string;
  headline: string;
  summary: string;
  marketHighlights: ClassifiedsMarketHighlight[];
  imageUrl?: string;
}

export interface ClassifiedsListingSpotlight {
  slug: string;
  title: string;
  categorySlug: string;
  categoryLabel: string;
  emirateSlug: string;
  emirateLabel: string;
  area: string;
  price: string;
  condition: string;
  sellerType: string;
  summary: string;
  badges: string[];
  quickFacts: string[];
  imageUrl?: string;
}

export const classifiedsMetrics: ClassifiedsMetric[] = [
  { label: 'Product lane', value: 'Fast premium resale and everyday discovery' },
  { label: 'Trust posture', value: 'Moderated, duplicate-aware, seller-visible' },
  { label: 'Growth fit', value: 'Local category + emirate SEO routes' }
];

export const classifiedsSearchFields: ClassifiedsSearchField[] = [
  { label: 'Keyword', value: 'iPhone, sofa, stroller, gaming chair' },
  { label: 'Emirate', value: 'Dubai, Abu Dhabi, Sharjah, Ajman' },
  { label: 'Category', value: 'Electronics, furniture, kids, fashion' },
  { label: 'Condition', value: 'New, lightly used, refurbished' },
  { label: 'Seller Type', value: 'Individual, reseller, verified seller' }
];

export const classifiedsQuickFilters = ['Verified seller', 'Same-day meet-up', 'Premium listing', 'Negotiable', 'Like new', 'Trusted pickup zones'];

export const classifiedsTrustSignals = [
  'Classifieds should stay fast and simple without looking cheap or chaotic.',
  'Seller identity, duplicate protection, and cleaner moderation should be visible in the product language.',
  'Featured listings should feel native to the browsing flow rather than bolted on as noisy promos.',
  'Location and category pages should help organic growth without becoming thin filter spam.'
];

export const classifiedsCategories: ClassifiedsCategory[] = [
  {
    slug: 'electronics',
    title: 'Electronics',
    focus: 'High-intent fast scanning',
    detail: 'Phones, laptops, consoles, and audio gear need comparison-friendly cards with stronger condition and seller clarity.'
  },
  {
    slug: 'furniture',
    title: 'Furniture',
    focus: 'Visual quality and pickup clarity',
    detail: 'Furniture listings should highlight condition, dimensions, and local pickup posture without overwhelming the page.'
  },
  {
    slug: 'baby-kids',
    title: 'Baby & Kids',
    focus: 'Trust-sensitive resale',
    detail: 'Parents need calmer discovery, safer seller cues, and clear condition language more than flashy promo treatment.'
  },
  {
    slug: 'fashion-accessories',
    title: 'Fashion & Accessories',
    focus: 'Brand and authenticity cues',
    detail: 'Fashion resale should balance speed and trust with cleaner authenticity, condition, and seller signals.'
  }
];

export const classifiedsHighlights: ClassifiedsHighlight[] = [
  {
    badge: 'Trust Layer',
    title: 'Cleaner seller identity makes casual resale feel safer immediately.',
    detail: 'Even a lightweight classifieds experience becomes more credible when seller posture, moderation, and duplicate controls are visible.'
  },
  {
    badge: 'SEO Value',
    title: 'Emirate and category lanes can grow traffic without becoming noisy filter clutter.',
    detail: 'Strong local classifieds routes help organic discovery while keeping the experience simple and fast for users.'
  },
  {
    badge: 'Commercial Fit',
    title: 'Premium and featured placements should support visibility without making the section feel ad-heavy.',
    detail: 'A restrained premium lane creates monetization room while keeping the browsing experience elegant.'
  }
];

export const classifiedsEmirates: ClassifiedsEmirateSpotlight[] = [
  {
    slug: 'dubai',
    label: 'Dubai',
    headline: 'Dubai classifieds should feel fast, premium, and ready for high-volume local resale activity.',
    summary: 'Dubai is the strongest resale market for faster moving electronics, lifestyle furniture, and brand-led second-hand inventory.',
    marketHighlights: [
      { title: 'Marina and JLT demand', detail: 'Lifestyle resale, electronics, and apartment-friendly furniture should be easy to scan and compare.' },
      { title: 'Business Bay turnover', detail: 'Compact premium goods and fast meetup-friendly listings are strong fits here.' },
      { title: 'Family zones', detail: 'Baby and kids products benefit from calmer trust cues and location clarity.' }
    ]
  },
  {
    slug: 'abu-dhabi',
    label: 'Abu Dhabi',
    headline: 'Abu Dhabi classifieds should lean into clarity, trust, and stronger quality signals over sheer density.',
    summary: 'Abu Dhabi works best when listings feel more curated, seller identity is obvious, and pickup/area context is easy to understand.',
    marketHighlights: [
      { title: 'Family household turnover', detail: 'Furniture, baby goods, and home electronics are strong lanes for calmer local browsing.' },
      { title: 'Verified seller value', detail: 'Users here respond well to stronger seller cues and clearer condition language.' },
      { title: 'Practical area fit', detail: 'Neighborhood-first browsing matters more than noisy endless feeds.' }
    ]
  },
  {
    slug: 'sharjah',
    label: 'Sharjah',
    headline: 'Sharjah classifieds should feel practical, affordable, and much cleaner than open spam-heavy resale boards.',
    summary: 'Sharjah can stand out quickly with clearer filters, stronger duplicate protection, and structured category pages.',
    marketHighlights: [
      { title: 'Value-driven demand', detail: 'Electronics, furniture, and family-category resale should be easy to compare at a glance.' },
      { title: 'Lower-noise browsing', detail: 'Cleaner cards and fewer gimmicks help serious buyers move faster.' },
      { title: 'Local pickup clarity', detail: 'Pickup zones and area trust should be visible early in the flow.' }
    ]
  },
  {
    slug: 'ajman',
    label: 'Ajman',
    headline: 'Ajman classifieds should stay lightweight and local while still looking premium and moderated.',
    summary: 'Ajman is a strong fit for practical local resale where quick discovery and visible seller trust matter more than flashy merchandising.',
    marketHighlights: [
      { title: 'Neighborhood resale', detail: 'Everyday listings should feel quick to scan and easy to trust.' },
      { title: 'Fast contact intent', detail: 'Users often want clear seller posture and direct next steps without friction.' },
      { title: 'Simple premium UI', detail: 'The experience should stay elegant without becoming too dense.' }
    ]
  }
];

export const classifiedsListings: ClassifiedsListingSpotlight[] = [
  {
    slug: 'iphone-15-pro-max-natural-titanium',
    title: 'iPhone 15 Pro Max 256GB in natural titanium',
    categorySlug: 'electronics',
    categoryLabel: 'Electronics',
    emirateSlug: 'dubai',
    emirateLabel: 'Dubai',
    area: 'Dubai Marina',
    price: 'AED 4,250',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf6e250400?auto=format&fit=crop&w=1200&q=80',
    condition: 'Lightly used',
    sellerType: 'Verified individual seller',
    summary: 'A fast-moving electronics listing should show condition, warranty posture, and seller confidence without turning into a cluttered specs wall.',
    badges: ['Featured', 'Verified seller', 'Meet-up ready'],
    quickFacts: ['Battery 97%', 'Box included', 'Same-day meet-up', 'No repairs']
  },
  {
    slug: 'l-shaped-linen-sofa-with-storage-ottoman',
    title: 'L-shaped linen sofa with storage ottoman',
    categorySlug: 'furniture',
    categoryLabel: 'Furniture',
    emirateSlug: 'abu-dhabi',
    emirateLabel: 'Abu Dhabi',
    area: 'Khalifa City',
    price: 'AED 1,850',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80',
    condition: 'Good condition',
    sellerType: 'Home seller',
    summary: 'Furniture cards should communicate pickup clarity, size posture, and wear level quickly enough for local purchase decisions.',
    badges: ['Local pickup', 'Fast response'],
    quickFacts: ['3.1m wide', 'Smoke-free home', 'Pickup this weekend', 'Neutral fabric']
  },
  {
    slug: 'stokke-xplory-complete-stroller-bundle',
    title: 'Stokke Xplory complete stroller bundle',
    categorySlug: 'baby-kids',
    categoryLabel: 'Baby & Kids',
    emirateSlug: 'sharjah',
    emirateLabel: 'Sharjah',
    area: 'Aljada',
    price: 'AED 2,200',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    condition: 'Excellent condition',
    sellerType: 'Parent seller',
    summary: 'Baby-category resale should feel safer and calmer, with strong condition cues and cleaner seller language from the first card.',
    badges: ['Premium listing', 'Trusted category'],
    quickFacts: ['Carrycot included', 'Rain cover', 'Indoor stored', 'Single owner']
  },
  {
    slug: 'herman-miller-style-ergonomic-desk-chair',
    title: 'Ergonomic desk chair in premium mesh finish',
    categorySlug: 'furniture',
    categoryLabel: 'Furniture',
    emirateSlug: 'dubai',
    emirateLabel: 'Dubai',
    area: 'JLT',
    price: 'AED 980',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf6e250400?auto=format&fit=crop&w=1200&q=80',
    condition: 'Refurbished',
    sellerType: 'Reseller',
    summary: 'Home-office resale needs cleaner condition language and strong local availability cues rather than noisy hard-sell styling.',
    badges: ['Refurbished', 'Business seller'],
    quickFacts: ['Lumbar support', 'Pickup or courier', 'Desk-ready', 'Warranty 30 days']
  },
  {
    slug: 'designer-crossbody-bag-midnight-black',
    title: 'Designer crossbody bag in midnight black',
    categorySlug: 'fashion-accessories',
    categoryLabel: 'Fashion & Accessories',
    emirateSlug: 'ajman',
    emirateLabel: 'Ajman',
    area: 'Al Rashidiya',
    price: 'AED 640',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80',
    condition: 'Like new',
    sellerType: 'Verified individual seller',
    summary: 'Fashion resale works better when authenticity posture, visual confidence, and seller clarity are carried with restraint.',
    badges: ['Verified seller', 'Like new'],
    quickFacts: ['Dust bag included', 'Minimal wear', 'Meet-up preferred', 'Authenticity receipt']
  },
  {
    slug: 'playstation-5-digital-edition-with-extra-controller',
    title: 'PlayStation 5 digital edition with extra controller',
    categorySlug: 'electronics',
    categoryLabel: 'Electronics',
    emirateSlug: 'dubai',
    emirateLabel: 'Dubai',
    area: 'Business Bay',
    price: 'AED 1,650',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    condition: 'Excellent condition',
    sellerType: 'Individual seller',
    summary: 'Gaming inventory should stay highly scannable with fast comparison cues and simple trust language for busy local buyers.',
    badges: ['Fast mover', 'Pickup tonight'],
    quickFacts: ['2 controllers', 'HDMI included', 'No defects', 'Cash or transfer']
  }
];

export function getClassifiedsEmirateSpotlight(slug: string) {
  return classifiedsEmirates.find((item) => item.slug === slug) || buildFallbackEmirate(slug);
}

export function getClassifiedsCategory(slug: string) {
  return classifiedsCategories.find((item) => item.slug === slug) || null;
}

export function getClassifiedsListings(filters?: { emirateSlug?: string; categorySlug?: string }) {
  return classifiedsListings.filter((listing) => {
    if (filters?.emirateSlug && listing.emirateSlug !== filters.emirateSlug) return false;
    if (filters?.categorySlug && listing.categorySlug !== filters.categorySlug) return false;
    return true;
  });
}

export function getClassifiedsListing(slug: string) {
  return classifiedsListings.find((listing) => listing.slug === slug) || null;
}

function buildFallbackEmirate(slug: string): ClassifiedsEmirateSpotlight {
  const label = humanizeSlug(slug);

  return {
    slug,
    label,
    headline: `${label} classifieds should become a cleaner local resale lane with calmer trust cues and better seller visibility.`,
    summary: 'This emirate page will later connect to live category routes, seller trust signals, and stronger local resale discovery.',
    marketHighlights: [
      { title: `${label} electronics demand`, detail: 'Fast-moving listings should feel comparison-friendly and easy to trust.' },
      { title: `${label} furniture turnover`, detail: 'Pickup clarity and condition language will matter more than noisy cards.' },
      { title: `${label} neighborhood resale`, detail: 'Local search should stay simple, premium, and well moderated.' }
    ]
  };
}

export function humanizeSlug(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
