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
  'Verified Dealer Network',
  'Transparent Vehicle History',
  'Secure Private Messaging',
  'Market-Driven Pricing'
];

export const motorsCategoryLanes: MotorsCategoryLane[] = [
  {
    slug: 'suvs',
    title: 'SUVs',
    focus: 'Family & Premium',
    detail: 'Explore luxury and family SUVs from top verified dealers.'
  },
  {
    slug: 'sedans',
    title: 'Sedans',
    focus: 'Daily Driver',
    detail: 'Find reliable sedans with full service history and warranty.'
  },
  {
    slug: 'electric',
    title: 'Electric',
    focus: 'Future-Ready',
    detail: 'Browse the latest EVs and hybrids with certified battery health.'
  },
  {
    slug: 'commercial',
    title: 'Commercial',
    focus: 'Business Fleet',
    detail: 'Heavy-duty trucks and vans for your business needs.'
  }
];

export const motorsShowcaseItems: MotorsShowcaseItem[] = [
  {
    badge: 'Verified Dealer',
    title: 'Premium SUVs',
    subtitle: 'Toyota Land Cruiser, Nissan Patrol, Range Rover',
    price: 'From AED 185K',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    meta: 'High-demand stock',
    highlight: 'Compare condition, year, and mileage instantly.'
  },
  {
    badge: 'Certified Stock',
    title: 'Certified Pre-Owned',
    subtitle: '1-owner history, service-backed',
    price: 'From AED 52K',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80',
    meta: 'Used lane',
    highlight: 'Shop with confidence using verified vehicle history.'
  },
  {
    badge: 'Fleet & Utility',
    title: 'Commercial Vehicles',
    subtitle: 'Pickups, vans, light commercial',
    price: 'From AED 78K',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    meta: 'Business lane',
    highlight: 'Fleet-ready vehicles from official agencies.'
  }
];

export const motorsOperatorHighlights: MotorsOperatorHighlight[] = [
  {
    title: 'Official Agencies',
    badge: 'Dealer Inventory',
    detail: 'Direct inventory from authorized brand distributors.'
  },
  {
    title: 'Verified Private Sellers',
    badge: 'Owner Sales',
    detail: 'Private listings vetted for authenticity and ownership.'
  },
  {
    title: 'Certified Pre-Owned',
    badge: 'Warranty Active',
    detail: 'Vehicles inspected to strict agency standards.'
  }
];
