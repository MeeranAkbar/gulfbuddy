import { PrismaClient } from '@prisma/client';
import { 
  PropertySearchParams, 
  PropertySearchResult, 
  propertySearchSeeds,
  buildSearchableHaystack,
  propertyEmirateOptions,
  buildPropertyResultRoute,
  computeRankingScore
} from './property';
import { humanizeSlug } from '../property/public-content';
import { prisma } from '../prisma';

function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  return text.trim().toLowerCase();
}

function matchesTextFilter(value: string | null | undefined, filterValue: string) {
  if (!filterValue) return true;
  if (!value) return false;

  return normalizeText(value).includes(normalizeText(filterValue));
}

function matchesMinimumFilter(value: number | null | undefined, minFilter: number | null) {
  if (minFilter === null) return true;
  if (value === null || value === undefined) return false;
  return value >= minFilter;
}

export async function searchPropertyListings(params: PropertySearchParams): Promise<PropertySearchResult[]> {
  // Fetch real ads from DB
  const dbAds = await prisma.ad.findMany({
    where: { category: 'property', status: 'ACTIVE' },
    include: { metadata: true, user: true }
  });

  // Map DB ads to PropertyListingSeed format
  const mappedDbAds = dbAds.map((ad) => {
    const meta = ad.metadata?.details ? JSON.parse(ad.metadata.details) : {};
    return {
      id: ad.id,
      slug: ad.id, // we don't have real slugs yet
      title: ad.title,
      summary: ad.description || '',
      marketMode: meta.marketMode || 'long_term',
      purpose: meta.purpose || 'rent',
      propertyType: meta.propertyType || 'Apartment',
      emirate: meta.emirate || 'dubai',
      area: meta.area || '',
      communityName: meta.communityName || '',
      buildingName: meta.buildingName || '',
      bedrooms: meta.bedrooms || 0,
      bathrooms: meta.bathrooms || 0,
      sizeSqft: meta.sizeSqft || 0,
      furnishing: meta.furnishingStatus || 'unfurnished',
      completionStatus: meta.completionStatus || 'ready',
      priceAmount: ad.price,
      priceLabel: `AED ${ad.price.toLocaleString()}`,
      sellerName: ad.user?.name || 'Private Landlord',
      sellerType: ad.user?.plan === 'FREE' ? 'Landlord' : 'Agency',
      verifiedCompany: ad.user?.plan !== 'FREE',
      permitBacked: ad.user?.plan !== 'FREE',
      featured: ad.user?.plan === 'ELITE',
      badges: ad.user?.plan !== 'FREE' ? ['Verified'] : [],
      createdAt: ad.createdAt.toISOString(),
      searchableText: [ad.title, ad.description, meta.area, meta.communityName].filter(Boolean) as string[],
      imageUrl: meta.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
      rentFrequency: meta.rentFrequency,
      listedBy: meta.listedBy,
      hasVideo: meta.hasVideo,
      has360Tour: meta.has360Tour,
      amenities: meta.amenities || []
    };
  });

  // Combine real ads with our mock seeds so the UI doesn't look empty
  const combinedInventory = [...mappedDbAds, ...propertySearchSeeds];

  const ranked = combinedInventory
    .filter((item) => item.marketMode === params.marketMode)
    .filter((item) => !params.emirate || item.emirate === params.emirate)
    .filter((item) => !params.keyword || buildSearchableHaystack(item).includes(normalizeText(params.keyword)))
    .filter((item) => !params.area || matchesTextFilter(item.area, params.area) || matchesTextFilter(item.communityName, params.area) || matchesTextFilter(item.buildingName, params.area))
    .filter((item) => !params.propertyType || normalizeText(item.propertyType) === normalizeText(params.propertyType))
    .filter((item) => matchesMinimumFilter(item.bedrooms, params.bedrooms))
    .filter((item) => matchesMinimumFilter(item.bathrooms, params.bathrooms))
    .filter((item) => (params.minPrice === null ? true : item.priceAmount >= params.minPrice))
    .filter((item) => (params.maxPrice === null ? true : item.priceAmount <= params.maxPrice))
    .filter((item) => !params.furnishing || item.furnishing === params.furnishing)
    .filter((item) => !params.completionStatus || item.completionStatus === params.completionStatus)
    .filter((item) => !params.verifiedOnly || item.verifiedCompany)
    .map((item) => ({
      ...item,
      emirateLabel: propertyEmirateOptions.find((option) => option.value === item.emirate)?.label ?? humanizeSlug(item.emirate),
      routeHref: buildPropertyResultRoute(item as any),
      rankingScore: computeRankingScore(item as any, params)
    }));

  const sorted = [...ranked];

  if (params.sort === 'price_asc') {
    sorted.sort((left, right) => left.priceAmount - right.priceAmount);
  } else if (params.sort === 'price_desc') {
    sorted.sort((left, right) => right.priceAmount - left.priceAmount);
  } else if (params.sort === 'newest') {
    sorted.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  } else {
    sorted.sort((left, right) => right.rankingScore - left.rankingScore);
  }

  return sorted;
}
