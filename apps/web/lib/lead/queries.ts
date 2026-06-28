import { createSupabaseServerClient } from '../supabase/server';

export interface AdminLeadEventSummary {
  id: string;
  section: string;
  event_type: string;
  source_page: string | null;
  source_context: string | null;
  created_at: string;
  company_name: string | null;
  listing_title: string | null;
  listing_slug: string | null;
  publication_state: string | null;
  campaign_type: string | null;
}

export interface AdminLeadSectionMetric {
  section: string;
  total: number;
}

export interface AdminLeadEventTypeMetric {
  event_type: string;
  total: number;
}

export interface AdminLeadOpsSnapshot {
  recentEvents: AdminLeadEventSummary[];
  sectionMetrics: AdminLeadSectionMetric[];
  eventTypeMetrics: AdminLeadEventTypeMetric[];
  totalEvents: number;
  companyBackedEvents: number;
  campaignLinkedEvents: number;
  inquiryEvents: number;
}

export async function getAdminLeadOpsSnapshot(): Promise<AdminLeadOpsSnapshot> {
  const supabase = await createSupabaseServerClient();

  const [{ data: allEvents }, { data: recentEvents }] = await Promise.all([
    supabase.schema('lead').from('lead_events').select('id,section,event_type,company_id,campaign_id'),
    supabase
      .schema('lead')
      .from('lead_events')
      .select('id,section,listing_id,company_id,event_type,source_page,source_context,campaign_id,created_at')
      .order('created_at', { ascending: false })
      .limit(30)
  ]);

  const listingIds = Array.from(new Set((recentEvents || []).map((event) => event.listing_id).filter(Boolean))) as string[];
  const companyIds = Array.from(new Set((recentEvents || []).map((event) => event.company_id).filter(Boolean))) as string[];
  const campaignIds = Array.from(new Set((recentEvents || []).map((event) => event.campaign_id).filter(Boolean))) as string[];

  const [{ data: listings }, { data: companies }, { data: campaigns }] = await Promise.all([
    listingIds.length
      ? supabase.schema('listing').from('listing_core').select('id,title,slug,publication_state').in('id', listingIds)
      : Promise.resolve({ data: [] as { id: string; title: string; slug: string; publication_state: string }[] }),
    companyIds.length
      ? supabase.schema('company').from('companies').select('id,display_name').in('id', companyIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string }[] }),
    campaignIds.length
      ? supabase.schema('monetization').from('campaigns').select('id,campaign_type').in('id', campaignIds)
      : Promise.resolve({ data: [] as { id: string; campaign_type: string }[] })
  ]);

  const listingById = new Map((listings || []).map((listing) => [listing.id, listing]));
  const companyById = new Map((companies || []).map((company) => [company.id, company.display_name]));
  const campaignById = new Map((campaigns || []).map((campaign) => [campaign.id, campaign.campaign_type]));

  const sectionMap = new Map<string, number>();
  const eventTypeMap = new Map<string, number>();

  (allEvents || []).forEach((event) => {
    sectionMap.set(event.section, (sectionMap.get(event.section) || 0) + 1);
    eventTypeMap.set(event.event_type, (eventTypeMap.get(event.event_type) || 0) + 1);
  });

  const recentEventSummaries: AdminLeadEventSummary[] = (recentEvents || []).map((event) => ({
    id: event.id,
    section: event.section,
    event_type: event.event_type,
    source_page: event.source_page,
    source_context: event.source_context,
    created_at: event.created_at,
    company_name: event.company_id ? companyById.get(event.company_id) || null : null,
    listing_title: event.listing_id ? listingById.get(event.listing_id)?.title || null : null,
    listing_slug: event.listing_id ? listingById.get(event.listing_id)?.slug || null : null,
    publication_state: event.listing_id ? listingById.get(event.listing_id)?.publication_state || null : null,
    campaign_type: event.campaign_id ? campaignById.get(event.campaign_id) || null : null
  }));

  const sectionMetrics = Array.from(sectionMap.entries()).map(([section, total]) => ({ section, total }));
  const eventTypeMetrics = Array.from(eventTypeMap.entries()).map(([event_type, total]) => ({ event_type, total }));

  return {
    recentEvents: recentEventSummaries,
    sectionMetrics,
    eventTypeMetrics,
    totalEvents: (allEvents || []).length,
    companyBackedEvents: (allEvents || []).filter((event) => Boolean(event.company_id)).length,
    campaignLinkedEvents: (allEvents || []).filter((event) => Boolean(event.campaign_id)).length,
    inquiryEvents: (allEvents || []).filter((event) => event.event_type === 'inquiry_submit').length
  };
}
