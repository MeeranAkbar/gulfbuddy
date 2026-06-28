export interface MotorsMetric {
  label: string;
  value: string;
}

export interface MotorsSearchField {
  label: string;
  value: string;
}

export interface MotorsShowcaseItem {
  badge: string;
  title: string;
  subtitle: string;
  price: string;
  meta: string;
  highlight: string;
  imageUrl?: string;
}

export interface MotorsOperatorHighlight {
  title: string;
  badge: string;
  detail: string;
  imageUrl?: string;
}

export interface MotorsCategoryLane {
  slug: string;
  title: string;
  focus: string;
  detail: string;
}

export const motorsMetrics: MotorsMetric[] = [
  { label: 'Primary operators', value: 'Dealers + sellers' },
  { label: 'Public posture', value: 'Trust-first vehicle search' },
  { label: 'Revenue fit', value: 'Dealer branding + premium placements' }
];

export const motorsSearchFields: MotorsSearchField[] = [
  { label: 'Vehicle Type', value: 'SUV, sedan, pickup, coupe, van' },
  { label: 'Make / Model', value: 'Toyota Land Cruiser, Patrol, Model 3' },
  { label: 'Year Range', value: '2019 to 2026' },
  { label: 'Budget Range', value: 'From AED 45K to AED 350K+' },
  { label: 'Seller Type', value: 'Verified dealer or private seller' }
];

export const motorsQuickFilters = [
  'Dealer verified',
  'Low mileage',
  'Certified stock',
  'Family SUVs',
  'Commercial fleet',
  'Electric and hybrid'
];

export const motorsTrustSignals = [
  'Dealer-ready public identity instead of anonymous listing clutter',
  'Shared lead logging for call, WhatsApp, reveal, and premium clicks',
  'Risk checks for duplicate vehicles, teaser pricing, and suspicious mileage',
  'Premium placements that fit the search experience instead of overpowering it'
];

export const motorsCategoryLanes: MotorsCategoryLane[] = [
  {
    slug: 'suvs',
    title: 'SUVs',
    focus: 'Family and premium demand',
    detail: 'Large-screen browsing, trust-first specs, and stronger dealer presence for high-intent buyers.'
  },
  {
    slug: 'sedans',
    title: 'Sedans',
    focus: 'Daily driver and fleet demand',
    detail: 'Sharper comparison between condition, mileage, trim, and ownership fit without noisy card overload.'
  },
  {
    slug: 'electric',
    title: 'Electric',
    focus: 'Future-facing inventory',
    detail: 'EV and hybrid discovery should feel modern, premium, and technically confident.'
  },
  {
    slug: 'commercial',
    title: 'Commercial',
    focus: 'Business operators',
    detail: 'Fleet and work-vehicle lanes need stronger specs, branch identity, and clearer seller trust.'
  }
];

export const motorsShowcaseItems: MotorsShowcaseItem[] = [
  {
    badge: 'Verified Dealer',
    title: 'Premium SUVs with stronger dealer identity and faster comparison flow',
    subtitle: 'Toyota Land Cruiser, Nissan Patrol, Range Rover, Defender',
    price: 'From AED 185K',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    meta: 'High-demand stock',
    highlight: 'The cards should help buyers compare condition, year, mileage, and dealer trust in one calm scan.'
  },
  {
    badge: 'Certified Stock',
    title: 'Used cars that feel safer because the platform actually surfaces trust',
    subtitle: '1-owner history, service-backed, lower-mileage inventory',
    price: 'From AED 52K',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80',
    meta: 'Used lane',
    highlight: 'Motors should look sharper than ordinary classifieds without becoming visually noisy.'
  },
  {
    badge: 'Fleet & Utility',
    title: 'Commercial and work-ready vehicles with cleaner business buying signals',
    subtitle: 'Pickups, vans, light commercial, delivery-ready stock',
    price: 'From AED 78K',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    meta: 'Business lane',
    highlight: 'Business buyers need strong specs, contact clarity, and seller legitimacy right away.'
  }
];

export const motorsOperatorHighlights: MotorsOperatorHighlight[] = [
  {
    title: 'Dealer storefront identity',
    badge: 'Dealer Workspace',
    detail: 'Dealers should have stronger public profile surfaces, branded inventory presence, and cleaner lead routing than basic listing posters.'
  },
  {
    title: 'Private seller lane with stronger checks',
    badge: 'Seller Trust',
    detail: 'Individuals can still list, but the public page should make it obvious when the vehicle is dealer-backed versus owner-posted.'
  },
  {
    title: 'Premium promotion without ad-board clutter',
    badge: 'Revenue Surface',
    detail: 'Featured units, dealer campaigns, and sponsored positions should feel integrated into search rather than bolted on.'
  }
];
