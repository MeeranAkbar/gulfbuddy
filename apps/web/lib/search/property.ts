import { z } from 'zod';
import { propertyMarketModes, type PropertyMarketMode } from '@gulfbuddy/types';
import { getPropertyModeConfig, humanizeSlug, propertyEmirateSpotlights } from '../property/public-content';

export const propertyEmirateOptions = propertyEmirateSpotlights.map((item) => ({
  value: item.slug,
  label: item.label
}));

export const propertyTypeOptions = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
  'Serviced Apartment',
  'Office',
  'Retail',
  'Full Floor',
  'Masterplan Community'
] as const;

export const propertyFurnishingOptions = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi_furnished', label: 'Semi furnished' },
  { value: 'unfurnished', label: 'Unfurnished' }
] as const;

export const propertyCompletionStatusOptions = [
  { value: 'ready', label: 'Ready' },
  { value: 'under_construction', label: 'Under construction' },
  { value: 'off_plan', label: 'Off-plan' }
] as const;

export const propertyBedroomOptions = [
  { value: '0', label: 'Studio' },
  { value: '1', label: '1+ bedrooms' },
  { value: '2', label: '2+ bedrooms' },
  { value: '3', label: '3+ bedrooms' },
  { value: '4', label: '4+ bedrooms' },
  { value: '5', label: '5+ bedrooms' }
] as const;

export const propertyBathroomOptions = [
  { value: '1', label: '1+ bathrooms' },
  { value: '2', label: '2+ bathrooms' },
  { value: '3', label: '3+ bathrooms' },
  { value: '4', label: '4+ bathrooms' },
  { value: '5', label: '5+ bathrooms' }
] as const;

export const propertySortOptions = [
  { value: 'relevance', label: 'Best match' },
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' }
] as const;

const propertyAreaOptionsByEmirate: Record<string, string[]> = {
  dubai: ['Dubai Marina', 'Business Bay', 'Downtown Dubai', 'Dubai Hills Estate', 'Palm Jumeirah'],
  'abu-dhabi': ['Yas Island', 'Al Reem Island', 'Saadiyat Island', 'Khalifa City', 'Corniche Area'],
  sharjah: ['Aljada', 'Muwaileh', 'Sharjah Waterfront', 'Al Khan'],
  'ras-al-khaimah': ['Al Marjan Island', 'Mina Al Arab', 'Al Hamra', 'Al Dhait']
};

type PropertySearchSort = (typeof propertySortOptions)[number]['value'];

export interface PropertySearchParams {
  marketMode: PropertyMarketMode;
  keyword: string;
  emirate: string;
  area: string;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  furnishing: string;
  completionStatus: string;
  verifiedOnly: boolean;
  sort: PropertySearchSort;
  rentFrequency: string;
  listedBy: string;
  hasVideo: boolean;
  has360Tour: boolean;
  amenities: string[];
}

export interface PropertySearchChip {
  key: keyof PropertySearchParams | 'results';
  label: string;
  value: string;
}

export interface PropertySearchResult {
  id: string;
  slug: string;
  title: string;
  summary: string;
  marketMode: PropertyMarketMode;
  purpose: 'sale' | 'rent';
  propertyType: string;
  emirate: string;
  emirateLabel: string;
  area: string;
  communityName: string;
  buildingName: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqft: number;
  furnishing: string | null;
  completionStatus: string | null;
  priceAmount: number;
  priceLabel: string;
  sellerName: string;
  sellerType: string;
  verifiedCompany: boolean;
  permitBacked: boolean;
  featured: boolean;
  badges: string[];
  routeHref: string;
  createdAt: string;
  rankingScore: number;
  imageUrl?: string;
  rentFrequency?: string;
  listedBy?: string;
  hasVideo?: boolean;
  has360Tour?: boolean;
  amenities?: string[];
}

interface PropertyListingSeed extends Omit<PropertySearchResult, 'emirateLabel' | 'routeHref' | 'rankingScore'> {
  searchableText: string[];
}

function buildPropertyResultRoute(item: PropertyListingSeed) {
  if (item.marketMode === 'new_project') {
    return `/property/project/${item.slug}`;
  }

  return `/property/listing/${item.slug}`;
}

const propertySearchSeeds: PropertyListingSeed[] = [
  {
    id: 'prop-lt-dxb-marina-001',
    slug: 'waterfront-apartment-dubai-marina',
    title: 'Waterfront two-bedroom apartment with marina-facing layout',
    summary: 'Verified agency stock with a clean marina position, upgraded kitchen, and investor-friendly service charge profile.',
    marketMode: 'long_term',
    purpose: 'sale',
    propertyType: 'Apartment',
    emirate: 'dubai',
    area: 'Dubai Marina',
    communityName: 'Dubai Marina',
    buildingName: 'Marina Gate',
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1340,
    furnishing: 'semi_furnished',
    completionStatus: 'ready',
    priceAmount: 2280000,
    priceLabel: 'AED 2.28M',
    sellerName: 'Harbourline Realty',
    sellerType: 'Agency',
    verifiedCompany: true,
    permitBacked: true,
    featured: true,
    badges: ['Verified Company', 'Permit-Backed', 'Premium Placement'],
    createdAt: '2026-03-22T09:00:00.000Z',
    searchableText: ['marina gate', 'dubai marina', 'waterfront', 'apartment', 'investor'],
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'prop-lt-dxb-hills-002',
    slug: 'family-villa-dubai-hills-estate',
    title: 'Family villa with landscaped garden in Dubai Hills Estate',
    summary: 'Long-term rent inventory designed for family relocation, with gated-community access, staff room, and upgraded outdoor area.',
    marketMode: 'long_term',
    purpose: 'rent',
    propertyType: 'Villa',
    emirate: 'dubai',
    area: 'Dubai Hills Estate',
    communityName: 'Dubai Hills Estate',
    buildingName: null,
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 4250,
    furnishing: 'unfurnished',
    completionStatus: 'ready',
    priceAmount: 355000,
    priceLabel: 'AED 355K / year',
    sellerName: 'Elm & Cedar Properties',
    sellerType: 'Agency',
    verifiedCompany: true,
    permitBacked: true,
    featured: false,
    badges: ['Verified Company', 'Family Community'],
    createdAt: '2026-03-20T11:30:00.000Z',
    searchableText: ['dubai hills', 'villa', 'family', 'garden', 'rent'],
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
  },
  {
    id: 'prop-lt-auh-reem-003',
    slug: 'reem-island-skyline-residence',
    title: 'Three-bedroom skyline residence on Al Reem Island',
    summary: 'A premium owner-occupier or investor apartment with marina views, tower amenities, and direct commuter access.',
    marketMode: 'long_term',
    purpose: 'sale',
    propertyType: 'Apartment',
    emirate: 'abu-dhabi',
    area: 'Al Reem Island',
    communityName: 'Al Reem Island',
    buildingName: 'Reem Nine',
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 1875,
    furnishing: 'furnished',
    completionStatus: 'ready',
    priceAmount: 2415000,
    priceLabel: 'AED 2.42M',
    sellerName: 'Capital Crest Realty',
    sellerType: 'Agency',
    verifiedCompany: true,
    permitBacked: true,
    featured: true,
    badges: ['Verified Company', 'Permit-Backed', 'Featured'],
    createdAt: '2026-03-24T08:15:00.000Z',
    searchableText: ['reem island', 'abu dhabi', 'skyline', 'sale', 'apartment']
  },
  {
    id: 'prop-lt-shj-aljada-004',
    slug: 'aljada-commuter-apartment',
    title: 'One-bedroom commuter apartment in Aljada',
    summary: 'Sharjah rental stock with clean public transport access, newer amenities, and a lower-friction move-in lane.',
    marketMode: 'long_term',
    purpose: 'rent',
    propertyType: 'Apartment',
    emirate: 'sharjah',
    area: 'Aljada',
    communityName: 'Aljada',
    buildingName: 'Nasaq Residence',
    bedrooms: 1,
    bathrooms: 2,
    sizeSqft: 760,
    furnishing: 'semi_furnished',
    completionStatus: 'ready',
    priceAmount: 62000,
    priceLabel: 'AED 62K / year',
    sellerName: 'Sharq Residential',
    sellerType: 'Agency',
    verifiedCompany: false,
    permitBacked: true,
    featured: false,
    badges: ['Permit-Backed', 'Starter Agency'],
    createdAt: '2026-03-18T13:05:00.000Z',
    searchableText: ['sharjah', 'aljada', 'apartment', 'commuter', 'rent']
  },
  {
    id: 'prop-st-dxb-downtown-005',
    slug: 'downtown-serviced-residence',
    title: 'Downtown serviced residence for business and family stays',
    summary: 'Operator-managed short-stay inventory with concierge-ready arrival, Burj views, and monthly flex booking support.',
    marketMode: 'short_term',
    purpose: 'rent',
    propertyType: 'Serviced Apartment',
    emirate: 'dubai',
    area: 'Downtown Dubai',
    communityName: 'Downtown Dubai',
    buildingName: 'Address Fountain Views',
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1180,
    furnishing: 'furnished',
    completionStatus: 'ready',
    priceAmount: 950,
    priceLabel: 'AED 950 / night',
    sellerName: 'Gulf Stay Collection',
    sellerType: 'Holiday Home Operator',
    verifiedCompany: true,
    permitBacked: true,
    featured: true,
    badges: ['Verified Operator', 'Holiday Home Approved', 'Fast Reply'],
    createdAt: '2026-03-23T10:20:00.000Z',
    searchableText: ['downtown', 'serviced apartment', 'business stay', 'short stay', 'burj']
  },
  {
    id: 'prop-st-rak-marjan-006',
    slug: 'beachfront-villa-al-marjan',
    title: 'Beachfront villa stay on Al Marjan Island',
    summary: 'Resort-led short-stay inventory built for family escapes, event stays, and premium weekend demand.',
    marketMode: 'short_term',
    purpose: 'rent',
    propertyType: 'Villa',
    emirate: 'ras-al-khaimah',
    area: 'Al Marjan Island',
    communityName: 'Al Marjan Island',
    buildingName: null,
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 3620,
    furnishing: 'furnished',
    completionStatus: 'ready',
    priceAmount: 3450,
    priceLabel: 'AED 3.45K / night',
    sellerName: 'Island Keys Hospitality',
    sellerType: 'Holiday Home Operator',
    verifiedCompany: true,
    permitBacked: true,
    featured: false,
    badges: ['Verified Operator', 'Beachfront', 'Holiday Home Approved'],
    createdAt: '2026-03-19T16:10:00.000Z',
    searchableText: ['al marjan island', 'ras al khaimah', 'villa', 'beachfront', 'holiday home']
  },
  {
    id: 'prop-op-dxb-creek-007',
    slug: 'creek-harbour-launch-payment-plan',
    title: 'Creek Harbour launch with investor-grade payment plan',
    summary: 'Off-plan tower inventory with flexible payment schedule, branded waterfront positioning, and stronger launch storytelling.',
    marketMode: 'off_plan',
    purpose: 'sale',
    propertyType: 'Apartment',
    emirate: 'dubai',
    area: 'Dubai Creek Harbour',
    communityName: 'Dubai Creek Harbour',
    buildingName: 'Altan by Emaar',
    bedrooms: 2,
    bathrooms: 3,
    sizeSqft: 1295,
    furnishing: 'semi_furnished',
    completionStatus: 'off_plan',
    priceAmount: 1840000,
    priceLabel: 'From AED 1.84M',
    sellerName: 'Emaar Launch Desk',
    sellerType: 'Developer',
    verifiedCompany: true,
    permitBacked: true,
    featured: true,
    badges: ['Verified Developer', 'Launch Spotlight', 'Payment Plan'],
    createdAt: '2026-03-25T07:50:00.000Z',
    searchableText: ['creek harbour', 'off plan', 'payment plan', 'launch', 'developer']
  },
  {
    id: 'prop-op-auh-yas-008',
    slug: 'yas-island-townhouse-launch',
    title: 'Townhouse launch on Yas Island with staged handover plan',
    summary: 'A developer-led off-plan opportunity aimed at end-users and investors who want flexible handover and cleaner project comparison.',
    marketMode: 'off_plan',
    purpose: 'sale',
    propertyType: 'Townhouse',
    emirate: 'abu-dhabi',
    area: 'Yas Island',
    communityName: 'Yas Island',
    buildingName: null,
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 2450,
    furnishing: 'unfurnished',
    completionStatus: 'under_construction',
    priceAmount: 2690000,
    priceLabel: 'From AED 2.69M',
    sellerName: 'Aldar New Communities',
    sellerType: 'Developer',
    verifiedCompany: true,
    permitBacked: true,
    featured: false,
    badges: ['Verified Developer', 'Investor Focus'],
    createdAt: '2026-03-21T12:45:00.000Z',
    searchableText: ['yas island', 'off plan', 'townhouse', 'handover', 'aldar']
  },
  {
    id: 'prop-np-dxb-valley-009',
    slug: 'the-valley-masterplan-profile',
    title: 'Masterplan community profile with villa and townhouse pipeline',
    summary: 'A project-first discovery object built for launch marketing, public SEO, and premium developer storytelling.',
    marketMode: 'new_project',
    purpose: 'sale',
    propertyType: 'Masterplan Community',
    emirate: 'dubai',
    area: 'The Valley',
    communityName: 'The Valley',
    buildingName: null,
    bedrooms: null,
    bathrooms: null,
    sizeSqft: 0,
    furnishing: null,
    completionStatus: 'under_construction',
    priceAmount: 0,
    priceLabel: 'Project profile',
    sellerName: 'Emaar Communities',
    sellerType: 'Developer',
    verifiedCompany: true,
    permitBacked: true,
    featured: true,
    badges: ['Project Profile', 'Verified Developer', 'Launch Campaign'],
    createdAt: '2026-03-17T09:40:00.000Z',
    searchableText: ['the valley', 'new project', 'masterplan', 'dubai', 'community']
  },
  {
    id: 'prop-np-auh-saadiyat-010',
    slug: 'saadiyat-cultural-district-project-page',
    title: 'Saadiyat cultural district project page with luxury unit mix',
    summary: 'Project-led discovery for prestige buyers looking at museums, branded residences, and cultural-location positioning.',
    marketMode: 'new_project',
    purpose: 'sale',
    propertyType: 'Masterplan Community',
    emirate: 'abu-dhabi',
    area: 'Saadiyat Island',
    communityName: 'Saadiyat Island',
    buildingName: null,
    bedrooms: null,
    bathrooms: null,
    sizeSqft: 0,
    furnishing: null,
    completionStatus: 'under_construction',
    priceAmount: 0,
    priceLabel: 'Project profile',
    sellerName: 'Saadiyat Launch Partners',
    sellerType: 'Developer',
    verifiedCompany: true,
    permitBacked: true,
    featured: false,
    badges: ['Project Profile', 'Prestige Launch'],
    createdAt: '2026-03-16T15:00:00.000Z',
    searchableText: ['saadiyat', 'new project', 'luxury', 'cultural district', 'abu dhabi']
  }
];

function firstValue(value: string | string[] | number | boolean | null | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/[_/]+/g, ' ').replace(/\s+/g, ' ');
}

function slugifyText(value: string) {
  return normalizeText(value).replace(/\s+/g, '-');
}

function parseNumber(value: string | number | boolean | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBoolean(value: string | number | boolean | null | undefined) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value > 0;
  }

  return value === 'true' || value === '1' || value === 'yes';
}

export function normalizePropertyMarketMode(value?: string): PropertyMarketMode {
  if (value && propertyMarketModes.includes(value as PropertyMarketMode)) {
    return value as PropertyMarketMode;
  }

  return 'long_term';
}

export function parsePropertySearchParams(
  searchParams:
    | Record<string, string | string[] | number | boolean | null | undefined>
    | URLSearchParams
    | Partial<Record<keyof PropertySearchParams, string | number | boolean | null | undefined>>
    | undefined
): PropertySearchParams {
  const read = (key: string) => {
    if (!searchParams) return undefined;

    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }

    return firstValue(searchParams[key as keyof typeof searchParams] as string | string[] | number | boolean | null | undefined);
  };

  const readText = (key: string) => {
    const value = read(key);

    if (typeof value === 'string') {
      return value.trim();
    }

    if (typeof value === 'number') {
      return String(value);
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    return '';
  };

  const readList = (key: string): string[] => {
    const value = read(key);
    if (typeof value === 'string') return value.split(',').filter(Boolean);
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    return [];
  };

  return {
    marketMode: normalizePropertyMarketMode(readText('marketMode')),
    keyword: readText('keyword'),
    emirate: slugifyText(readText('emirate')),
    area: readText('area'),
    propertyType: readText('propertyType'),
    bedrooms: parseNumber(read('bedrooms')),
    bathrooms: parseNumber(read('bathrooms')),
    minPrice: parseNumber(read('minPrice')),
    maxPrice: parseNumber(read('maxPrice')),
    furnishing: readText('furnishing'),
    completionStatus: readText('completionStatus'),
    verifiedOnly: parseBoolean(read('verifiedOnly')),
    sort: (propertySortOptions.find((item) => item.value === readText('sort'))?.value ?? 'relevance') as PropertySearchSort,
    rentFrequency: readText('rentFrequency'),
    listedBy: readText('listedBy'),
    hasVideo: parseBoolean(read('hasVideo')),
    has360Tour: parseBoolean(read('has360Tour')),
    amenities: readList('amenities')
  };
}

function buildSearchableHaystack(item: PropertyListingSeed) {
  return normalizeText(
    [
      item.title,
      item.summary,
      item.area,
      item.communityName,
      item.buildingName ?? '',
      item.sellerName,
      item.propertyType,
      ...item.searchableText
    ].join(' ')
  );
}

function computeRankingScore(item: PropertyListingSeed, params: PropertySearchParams) {
  let score = 12;
  const keyword = normalizeText(params.keyword);
  const area = normalizeText(params.area);
  const haystack = buildSearchableHaystack(item);
  const title = normalizeText(item.title);

  if (item.verifiedCompany) score += 18;
  if (item.permitBacked) score += 12;
  if (item.featured) score += 9;

  if (params.emirate && item.emirate === params.emirate) score += 22;
  if (params.propertyType && normalizeText(item.propertyType) === normalizeText(params.propertyType)) score += 12;

  if (keyword) {
    if (title.includes(keyword)) score += 70;
    if (haystack.includes(keyword)) score += 38;
  }

  if (area) {
    const normalizedArea = normalizeText(item.area);
    const normalizedCommunity = normalizeText(item.communityName);
    if (normalizedArea.includes(area) || normalizedCommunity.includes(area)) score += 32;
  }

  if (params.bedrooms !== null && item.bedrooms !== null && item.bedrooms >= params.bedrooms) score += 8;
  if (params.bathrooms !== null && item.bathrooms !== null && item.bathrooms >= params.bathrooms) score += 6;

  const createdTimestamp = new Date(item.createdAt).getTime();
  const freshnessBoost = Math.max(0, 10 - Math.floor((Date.now() - createdTimestamp) / (1000 * 60 * 60 * 24 * 2)));
  score += freshnessBoost;

  return score;
}

function matchesMinimumFilter(value: number | null, minimum: number | null) {
  if (minimum === null) return true;
  if (value === null) return false;

  if (minimum === 0) {
    return value === 0;
  }

  return value >= minimum;
}

function matchesTextFilter(value: string | null | undefined, filterValue: string) {
  if (!filterValue) return true;
  if (!value) return false;

  return normalizeText(value).includes(normalizeText(filterValue));
}



export function buildPropertySearchChips(params: PropertySearchParams, totalResults: number): PropertySearchChip[] {
  const modeLabel = getPropertyModeConfig(params.marketMode)?.label ?? 'Property';
  const chips: PropertySearchChip[] = [{ key: 'results', label: 'Mode', value: modeLabel }];

  if (params.keyword) chips.push({ key: 'keyword', label: 'Keyword', value: params.keyword });
  if (params.emirate) chips.push({ key: 'emirate', label: 'Emirate', value: propertyEmirateOptions.find((item) => item.value === params.emirate)?.label ?? humanizeSlug(params.emirate) });
  if (params.area) chips.push({ key: 'area', label: 'Area', value: params.area });
  if (params.propertyType) chips.push({ key: 'propertyType', label: 'Type', value: params.propertyType });
  if (params.bedrooms !== null) chips.push({ key: 'bedrooms', label: 'Bedrooms', value: params.bedrooms === 0 ? 'Studio' : `${params.bedrooms}+` });
  if (params.bathrooms !== null) chips.push({ key: 'bathrooms', label: 'Bathrooms', value: `${params.bathrooms}+` });
  if (params.minPrice !== null || params.maxPrice !== null) {
    chips.push({
      key: 'minPrice',
      label: 'Budget',
      value: `${params.minPrice !== null ? formatCurrencyCompact(params.minPrice) : 'Any'} - ${params.maxPrice !== null ? formatCurrencyCompact(params.maxPrice) : 'Any'}`
    });
  }
  if (params.furnishing) chips.push({ key: 'furnishing', label: 'Furnishing', value: propertyFurnishingOptions.find((item) => item.value === params.furnishing)?.label ?? humanizeSlug(params.furnishing) });
  if (params.completionStatus) chips.push({ key: 'completionStatus', label: 'Status', value: propertyCompletionStatusOptions.find((item) => item.value === params.completionStatus)?.label ?? humanizeSlug(params.completionStatus) });
  if (params.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Trust', value: 'Verified only' });
  chips.push({ key: 'results', label: 'Results', value: `${totalResults} live previews` });

  return chips;
}

export function buildPropertySearchTitle(params: PropertySearchParams) {
  const modeLabel = getPropertyModeConfig(params.marketMode)?.label ?? 'Property';
  const location = params.area || (params.emirate ? propertyEmirateOptions.find((item) => item.value === params.emirate)?.label : '');

  if (params.keyword && location) {
    return `${modeLabel} matches for "${params.keyword}" in ${location}`;
  }

  if (params.keyword) {
    return `${modeLabel} matches for "${params.keyword}"`;
  }

  if (location) {
    return `${modeLabel} property in ${location}`;
  }

  return `${modeLabel} property search`;
}

export function buildPropertySearchDescription(params: PropertySearchParams, totalResults: number) {
  const modeLabel = getPropertyModeConfig(params.marketMode)?.label ?? 'Property';
  const location = params.area || (params.emirate ? propertyEmirateOptions.find((item) => item.value === params.emirate)?.label : '');
  const locationText = location ? ` in ${location}` : '';

  return `${totalResults} ranked ${modeLabel.toLowerCase()} previews${locationText}, with structured filters for price, type, trust posture, and local fit.`;
}

export function getPropertyAreaOptions(emirate?: string) {
  if (!emirate) {
    return Array.from(new Set(Object.values(propertyAreaOptionsByEmirate).flat())).slice(0, 8);
  }

  return propertyAreaOptionsByEmirate[emirate] ?? [];
}

export function buildPropertySearchHref(params: Partial<PropertySearchParams>) {
  const search = new URLSearchParams();

  if (params.marketMode) search.set('marketMode', params.marketMode);
  if (params.keyword) search.set('keyword', params.keyword);
  if (params.emirate) search.set('emirate', params.emirate);
  if (params.area) search.set('area', params.area);
  if (params.propertyType) search.set('propertyType', params.propertyType);
  if (params.bedrooms !== null && params.bedrooms !== undefined) search.set('bedrooms', String(params.bedrooms));
  if (params.bathrooms !== null && params.bathrooms !== undefined) search.set('bathrooms', String(params.bathrooms));
  if (params.minPrice !== null && params.minPrice !== undefined) search.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== null && params.maxPrice !== undefined) search.set('maxPrice', String(params.maxPrice));
  if (params.furnishing) search.set('furnishing', params.furnishing);
  if (params.completionStatus) search.set('completionStatus', params.completionStatus);
  if (params.verifiedOnly) search.set('verifiedOnly', 'true');
  if (params.sort !== 'relevance') search.set('sort', params.sort ?? 'relevance');
  if (params.rentFrequency) search.set('rentFrequency', params.rentFrequency);
  if (params.listedBy) search.set('listedBy', params.listedBy);
  if (params.hasVideo) search.set('hasVideo', 'true');
  if (params.has360Tour) search.set('has360Tour', 'true');
  if (params.amenities && params.amenities.length > 0) search.set('amenities', params.amenities.join(','));

  return `/property/search?${search.toString()}`;
}

function formatCurrencyCompact(value: number) {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 2)}M`;
  }

  if (value >= 1000) {
    return `AED ${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 0)}K`;
  }

  return `AED ${value}`;
}

export function getPropertyListingBySlug(slug: string): PropertySearchResult | null {
  const seed = propertySearchSeeds.find((item) => item.slug === slug);
  if (!seed) return null;
  return seed as unknown as PropertySearchResult;
}
