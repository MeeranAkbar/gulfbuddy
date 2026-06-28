import { createSupabaseServerClient } from '../supabase/server';

export interface AdminListingOpsItem {
  id: string;
  section: string;
  title: string;
  slug: string;
  publication_state: string;
  risk_state: string;
  updated_at: string;
  emirate: string;
  area: string | null;
  price_amount: number | null;
  company_name: string | null;
  media_count: number;
  active_promotion_count: number;
  open_moderation_queue_count: number;
  open_compliance_case_count: number;
  risk_profile: {
    total_score: number;
    risk_state: string;
    last_checked_at: string;
  } | null;
}

export interface AdminListingSectionMetric {
  section: string;
  total: number;
  live: number;
  review: number;
  draft: number;
  flagged: number;
}

export interface AdminListingOpsSnapshot {
  recentListings: AdminListingOpsItem[];
  sectionMetrics: AdminListingSectionMetric[];
  totalListings: number;
  liveListings: number;
  reviewListings: number;
  highRiskListings: number;
}

export async function getAdminListingOpsSnapshot(): Promise<AdminListingOpsSnapshot> {
  const supabase = await createSupabaseServerClient();

  const [{ data: allListings }, { data: recentListings }] = await Promise.all([
    supabase.schema('listing').from('listing_core').select('id,section,publication_state,risk_state'),
    supabase
      .schema('listing')
      .from('listing_core')
      .select('id,section,title,slug,publication_state,risk_state,updated_at,emirate,area,price_amount,owner_company_id')
      .order('updated_at', { ascending: false })
      .limit(24)
  ]);

  const sectionMap = new Map<string, AdminListingSectionMetric>();

  (allListings || []).forEach((listing) => {
    const current = sectionMap.get(listing.section) || {
      section: listing.section,
      total: 0,
      live: 0,
      review: 0,
      draft: 0,
      flagged: 0
    };

    current.total += 1;

    if (listing.publication_state === 'published' || listing.publication_state === 'approved') {
      current.live += 1;
    }

    if (['submitted', 'auto_checked', 'flagged', 'pending_review'].includes(listing.publication_state)) {
      current.review += 1;
    }

    if (listing.publication_state === 'draft' || listing.publication_state === 'rejected') {
      current.draft += 1;
    }

    if (listing.publication_state === 'flagged') {
      current.flagged += 1;
    }

    sectionMap.set(listing.section, current);
  });

  const listingIds = (recentListings || []).map((listing) => listing.id);
  const companyIds = Array.from(new Set((recentListings || []).map((listing) => listing.owner_company_id).filter(Boolean))) as string[];

  const [
    { data: companies },
    { data: media },
    { data: promotions },
    { data: moderationQueue },
    { data: complianceCases },
    { data: riskProfiles }
  ] = await Promise.all([
    companyIds.length
      ? supabase.schema('company').from('companies').select('id,display_name').in('id', companyIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string }[] }),
    listingIds.length
      ? supabase.schema('listing').from('listing_media').select('listing_id').in('listing_id', listingIds).eq('status', 'active')
      : Promise.resolve({ data: [] as { listing_id: string }[] }),
    listingIds.length
      ? supabase
          .schema('monetization')
          .from('listing_promotions')
          .select('listing_id,status')
          .in('listing_id', listingIds)
          .in('status', ['active', 'scheduled'])
      : Promise.resolve({ data: [] as { listing_id: string; status: string }[] }),
    listingIds.length
      ? supabase
          .schema('risk')
          .from('moderation_queue')
          .select('listing_id,status')
          .in('listing_id', listingIds)
          .in('status', ['open', 'in_review'])
      : Promise.resolve({ data: [] as { listing_id: string; status: string }[] }),
    listingIds.length
      ? supabase
          .schema('compliance')
          .from('compliance_cases')
          .select('listing_id,compliance_state')
          .in('listing_id', listingIds)
          .in('compliance_state', ['required_pending', 'under_review'])
      : Promise.resolve({ data: [] as { listing_id: string; compliance_state: string }[] }),
    listingIds.length
      ? supabase
          .schema('risk')
          .from('risk_profiles')
          .select('subject_id,total_score,risk_state,last_checked_at')
          .eq('subject_type', 'listing')
          .in('subject_id', listingIds)
      : Promise.resolve({ data: [] as { subject_id: string; total_score: number; risk_state: string; last_checked_at: string }[] })
  ]);

  const companyById = new Map((companies || []).map((company) => [company.id, company.display_name]));
  const mediaCountByListingId = new Map<string, number>();
  const promotionCountByListingId = new Map<string, number>();
  const moderationCountByListingId = new Map<string, number>();
  const complianceCountByListingId = new Map<string, number>();
  const riskProfileByListingId = new Map(
    (riskProfiles || []).map((profile) => [
      profile.subject_id,
      {
        total_score: profile.total_score,
        risk_state: profile.risk_state,
        last_checked_at: profile.last_checked_at
      }
    ])
  );

  (media || []).forEach((item) => {
    mediaCountByListingId.set(item.listing_id, (mediaCountByListingId.get(item.listing_id) || 0) + 1);
  });
  (promotions || []).forEach((item) => {
    promotionCountByListingId.set(item.listing_id, (promotionCountByListingId.get(item.listing_id) || 0) + 1);
  });
  (moderationQueue || []).forEach((item) => {
    moderationCountByListingId.set(item.listing_id, (moderationCountByListingId.get(item.listing_id) || 0) + 1);
  });
  (complianceCases || []).forEach((item) => {
    if (!item.listing_id) return;
    complianceCountByListingId.set(item.listing_id, (complianceCountByListingId.get(item.listing_id) || 0) + 1);
  });

  const totalListings = (allListings || []).length;
  const liveListings = (allListings || []).filter((listing) => listing.publication_state === 'published' || listing.publication_state === 'approved').length;
  const reviewListings = (allListings || []).filter((listing) =>
    ['submitted', 'auto_checked', 'flagged', 'pending_review'].includes(listing.publication_state)
  ).length;
  const highRiskListings = (allListings || []).filter((listing) => ['high', 'blocked'].includes(listing.risk_state)).length;
  const recentListingSummaries: AdminListingOpsItem[] = (recentListings || []).map((listing) => ({
    id: listing.id,
    section: listing.section,
    title: listing.title,
    slug: listing.slug,
    publication_state: listing.publication_state,
    risk_state: listing.risk_state,
    updated_at: listing.updated_at,
    emirate: listing.emirate,
    area: listing.area,
    price_amount: listing.price_amount,
    company_name: listing.owner_company_id ? companyById.get(listing.owner_company_id) || null : null,
    media_count: mediaCountByListingId.get(listing.id) || 0,
    active_promotion_count: promotionCountByListingId.get(listing.id) || 0,
    open_moderation_queue_count: moderationCountByListingId.get(listing.id) || 0,
    open_compliance_case_count: complianceCountByListingId.get(listing.id) || 0,
    risk_profile: riskProfileByListingId.get(listing.id) || null
  }));

  return {
    recentListings: recentListingSummaries,
    sectionMetrics: Array.from(sectionMap.values()),
    totalListings,
    liveListings,
    reviewListings,
    highRiskListings
  };
}
