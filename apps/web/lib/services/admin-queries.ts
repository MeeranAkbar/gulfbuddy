import { createSupabaseServerClient } from '../supabase/server';

export interface AdminServicesProviderSummary {
  company_id: string;
  display_name: string | null;
  verification_status: string;
  trust_tier: string;
  is_accepting_requests: boolean;
  emergency_service: boolean;
  profile_strength_score: number;
  active_offerings_count: number;
  area_count: number;
  matched_request_count: number;
  live_order_count: number;
}

export interface AdminServicesMetric {
  label: string;
  total: number;
}

export interface AdminServicesOpsSnapshot {
  recentProviders: AdminServicesProviderSummary[];
  requestStatusMetrics: AdminServicesMetric[];
  orderStatusMetrics: AdminServicesMetric[];
  totalProviders: number;
  verifiedProviders: number;
  activeRequests: number;
  sentQuotes: number;
  liveOrders: number;
  openDisputes: number;
}

export async function getAdminServicesOpsSnapshot(): Promise<AdminServicesOpsSnapshot> {
  const supabase = await createSupabaseServerClient();

  const [
    { data: allProviders },
    { data: requests },
    { data: requestMatches },
    { data: quotes },
    { data: orders },
    { data: disputes },
    { data: offerings },
    { data: serviceAreas }
  ] = await Promise.all([
    supabase
      .schema('services')
      .from('service_provider_profiles')
      .select('company_id,verification_status,trust_tier,is_accepting_requests,emergency_service,profile_strength_score,updated_at')
      .order('updated_at', { ascending: false }),
    supabase.schema('services').from('service_requests').select('id,request_status'),
    supabase.schema('services').from('service_request_provider_matches').select('request_id,company_id,match_status'),
    supabase.schema('services').from('service_quotes').select('id,company_id,quote_status'),
    supabase.schema('services').from('service_orders').select('id,company_id,order_status'),
    supabase.schema('services').from('service_disputes').select('id,dispute_status'),
    supabase.schema('services').from('service_offerings').select('company_id,is_active'),
    supabase.schema('services').from('service_areas').select('company_id')
  ]);

  const recentProviders = (allProviders || []).slice(0, 12);
  const companyIds = Array.from(new Set(recentProviders.map((provider) => provider.company_id))) as string[];
  const { data: companies } = companyIds.length
    ? await supabase.schema('company').from('companies').select('id,display_name').in('id', companyIds)
    : { data: [] as { id: string; display_name: string }[] };

  const companyById = new Map((companies || []).map((company) => [company.id, company.display_name]));
  const requestStatusMap = new Map<string, number>();
  const orderStatusMap = new Map<string, number>();
  const offeringCountByCompanyId = new Map<string, number>();
  const areaCountByCompanyId = new Map<string, number>();
  const matchCountByCompanyId = new Map<string, number>();
  const liveOrderCountByCompanyId = new Map<string, number>();

  (requests || []).forEach((request) => {
    requestStatusMap.set(request.request_status, (requestStatusMap.get(request.request_status) || 0) + 1);
  });

  (orders || []).forEach((order) => {
    orderStatusMap.set(order.order_status, (orderStatusMap.get(order.order_status) || 0) + 1);
    if (['confirmed', 'scheduled', 'in_progress'].includes(order.order_status)) {
      liveOrderCountByCompanyId.set(order.company_id, (liveOrderCountByCompanyId.get(order.company_id) || 0) + 1);
    }
  });

  (offerings || []).forEach((offering) => {
    if (!offering.is_active) return;
    offeringCountByCompanyId.set(offering.company_id, (offeringCountByCompanyId.get(offering.company_id) || 0) + 1);
  });

  (serviceAreas || []).forEach((area) => {
    areaCountByCompanyId.set(area.company_id, (areaCountByCompanyId.get(area.company_id) || 0) + 1);
  });

  (requestMatches || []).forEach((match) => {
    if (match.match_status === 'rejected') return;
    matchCountByCompanyId.set(match.company_id, (matchCountByCompanyId.get(match.company_id) || 0) + 1);
  });

  return {
    recentProviders: recentProviders.map((provider) => ({
      company_id: provider.company_id,
      display_name: companyById.get(provider.company_id) || null,
      verification_status: provider.verification_status,
      trust_tier: provider.trust_tier,
      is_accepting_requests: provider.is_accepting_requests,
      emergency_service: provider.emergency_service,
      profile_strength_score: provider.profile_strength_score,
      active_offerings_count: offeringCountByCompanyId.get(provider.company_id) || 0,
      area_count: areaCountByCompanyId.get(provider.company_id) || 0,
      matched_request_count: matchCountByCompanyId.get(provider.company_id) || 0,
      live_order_count: liveOrderCountByCompanyId.get(provider.company_id) || 0
    })),
    requestStatusMetrics: Array.from(requestStatusMap.entries()).map(([label, total]) => ({ label, total })),
    orderStatusMetrics: Array.from(orderStatusMap.entries()).map(([label, total]) => ({ label, total })),
    totalProviders: (allProviders || []).length,
    verifiedProviders: (allProviders || []).filter((provider) => provider.verification_status === 'verified').length,
    activeRequests: (requests || []).filter((request) => !['cancelled', 'expired', 'converted_to_order'].includes(request.request_status)).length,
    sentQuotes: (quotes || []).filter((quote) => ['sent', 'viewed', 'accepted'].includes(quote.quote_status)).length,
    liveOrders: (orders || []).filter((order) => ['confirmed', 'scheduled', 'in_progress'].includes(order.order_status)).length,
    openDisputes: (disputes || []).filter((dispute) => dispute.dispute_status !== 'resolved' && dispute.dispute_status !== 'closed').length
  };
}
