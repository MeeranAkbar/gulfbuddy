import { getAuthenticatedUserContext } from '../auth/session';
import { createSupabaseServerClient } from '../supabase/server';

export interface CandidateWorkspaceOverview {
  profileStrengthScore: number;
  profileVisibility: string | null;
  searchableByEmployers: boolean;
  cvCount: number;
  applicationCount: number;
  activeApplicationCount: number;
  savedJobCount: number;
  activeAlertCount: number;
}

export interface EmployerWorkspaceOverview {
  companyCount: number;
  verifiedEmployerCount: number;
  activeJobCount: number;
  draftJobCount: number;
  applicantCount: number;
  shortlistCount: number;
  activeSeatCount: number;
}

export interface ProviderWorkspaceOverview {
  providerCount: number;
  verifiedProviderCount: number;
  activeOfferingCount: number;
  requestMatchCount: number;
  quoteCount: number;
  activeOrderCount: number;
  completedOrderCount: number;
  billedCommissionAmount: number;
}

export interface CustomerWorkspaceOverview {
  requestCount: number;
  quoteCount: number;
  activeOrderCount: number;
  completedOrderCount: number;
  disputeCount: number;
}

export async function getCandidateWorkspaceOverview(): Promise<CandidateWorkspaceOverview | null> {
  const context = await getAuthenticatedUserContext();

  if (!context) return null;

  const supabase = await createSupabaseServerClient();
  const userId = context.userId;

  const [{ data: profile }, { count: cvCount }, { data: applications }, { count: savedJobCount }, { data: alerts }] = await Promise.all([
    supabase
      .schema('jobs')
      .from('candidate_profiles')
      .select('profile_strength_score,profile_visibility,searchable_by_employers')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase.schema('jobs').from('candidate_cv_files').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.schema('jobs').from('job_applications').select('application_status').eq('candidate_user_id', userId),
    supabase.schema('jobs').from('job_saved_items').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.schema('jobs').from('job_alerts').select('id,is_active').eq('user_id', userId)
  ]);

  const activeApplicationStatuses = new Set(['submitted', 'in_review', 'shortlisted', 'contacted', 'interviewing', 'offered']);

  return {
    profileStrengthScore: profile?.profile_strength_score || 0,
    profileVisibility: profile?.profile_visibility || null,
    searchableByEmployers: profile?.searchable_by_employers || false,
    cvCount: cvCount || 0,
    applicationCount: applications?.length || 0,
    activeApplicationCount: (applications || []).filter((item) => activeApplicationStatuses.has(item.application_status)).length,
    savedJobCount: savedJobCount || 0,
    activeAlertCount: (alerts || []).filter((item) => item.is_active).length
  };
}

export async function getEmployerWorkspaceOverview(): Promise<EmployerWorkspaceOverview | null> {
  const context = await getAuthenticatedUserContext();

  if (!context) return null;

  const supabase = await createSupabaseServerClient();
  const companyIds = context.companyIds;

  if (!companyIds.length) {
    return {
      companyCount: 0,
      verifiedEmployerCount: 0,
      activeJobCount: 0,
      draftJobCount: 0,
      applicantCount: 0,
      shortlistCount: 0,
      activeSeatCount: 0
    };
  }

  const [{ data: employerProfiles }, { data: jobListings }, { data: members }] = await Promise.all([
    supabase.schema('jobs').from('employer_profiles').select('company_id,verification_status').in('company_id', companyIds),
    supabase
      .schema('listing')
      .from('listing_core')
      .select('id,publication_state')
      .eq('section', 'jobs')
      .in('owner_company_id', companyIds),
    supabase.schema('company').from('company_members').select('id,status').in('company_id', companyIds)
  ]);

  const listingIds = (jobListings || []).map((item) => item.id);
  const { data: applications } = listingIds.length
    ? await supabase.schema('jobs').from('job_applications').select('application_status').in('listing_id', listingIds)
    : { data: [] as { application_status: string }[] };

  const activeJobStates = new Set(['approved', 'published']);
  const draftJobStates = new Set(['draft', 'submitted', 'auto_checked', 'flagged', 'pending_review']);
  const shortlistStates = new Set(['shortlisted', 'contacted', 'interviewing', 'offered']);

  return {
    companyCount: employerProfiles?.length || 0,
    verifiedEmployerCount: (employerProfiles || []).filter((item) => item.verification_status === 'verified').length,
    activeJobCount: (jobListings || []).filter((item) => activeJobStates.has(item.publication_state)).length,
    draftJobCount: (jobListings || []).filter((item) => draftJobStates.has(item.publication_state)).length,
    applicantCount: applications?.length || 0,
    shortlistCount: (applications || []).filter((item) => shortlistStates.has(item.application_status)).length,
    activeSeatCount: (members || []).filter((item) => item.status === 'active').length
  };
}

export async function getProviderWorkspaceOverview(): Promise<ProviderWorkspaceOverview | null> {
  const context = await getAuthenticatedUserContext();

  if (!context) return null;

  const supabase = await createSupabaseServerClient();
  const companyIds = context.companyIds;

  if (!companyIds.length) {
    return {
      providerCount: 0,
      verifiedProviderCount: 0,
      activeOfferingCount: 0,
      requestMatchCount: 0,
      quoteCount: 0,
      activeOrderCount: 0,
      completedOrderCount: 0,
      billedCommissionAmount: 0
    };
  }

  const [{ data: providers }, { data: offerings }, { data: requestMatches }, { data: quotes }, { data: orders }, { data: commissions }] =
    await Promise.all([
      supabase.schema('services').from('service_provider_profiles').select('company_id,verification_status').in('company_id', companyIds),
      supabase.schema('services').from('service_offerings').select('id,is_active').in('company_id', companyIds),
      supabase.schema('services').from('service_request_provider_matches').select('id').in('company_id', companyIds),
      supabase.schema('services').from('service_quotes').select('id').in('company_id', companyIds),
      supabase.schema('services').from('service_orders').select('id,order_status').in('company_id', companyIds),
      supabase.schema('services').from('service_commission_ledger').select('commission_amount,billing_status').in('company_id', companyIds)
    ]);

  const activeOrderStates = new Set(['created', 'confirmed', 'scheduled', 'in_progress']);

  return {
    providerCount: providers?.length || 0,
    verifiedProviderCount: (providers || []).filter((item) => item.verification_status === 'verified').length,
    activeOfferingCount: (offerings || []).filter((item) => item.is_active).length,
    requestMatchCount: requestMatches?.length || 0,
    quoteCount: quotes?.length || 0,
    activeOrderCount: (orders || []).filter((item) => activeOrderStates.has(item.order_status)).length,
    completedOrderCount: (orders || []).filter((item) => item.order_status === 'completed').length,
    billedCommissionAmount: (commissions || [])
      .filter((item) => ['invoiced', 'paid'].includes(item.billing_status))
      .reduce((total, item) => total + Number(item.commission_amount || 0), 0)
  };
}

export async function getCustomerWorkspaceOverview(): Promise<CustomerWorkspaceOverview | null> {
  const context = await getAuthenticatedUserContext();

  if (!context) return null;

  const supabase = await createSupabaseServerClient();
  const userId = context.userId;

  const [{ data: requests }, { data: orders }, { data: disputes }] = await Promise.all([
    supabase.schema('services').from('service_requests').select('id').eq('customer_user_id', userId),
    supabase.schema('services').from('service_orders').select('id,order_status').eq('customer_user_id', userId),
    supabase
      .schema('services')
      .from('service_disputes')
      .select('id')
      .eq('raised_by_type', 'customer')
      .eq('raised_by_id', userId)
  ]);

  const requestIds = (requests || []).map((item) => item.id);
  const { data: quotes } = requestIds.length
    ? await supabase.schema('services').from('service_quotes').select('id').in('request_id', requestIds)
    : { data: [] as { id: string }[] };

  const activeOrderStates = new Set(['created', 'confirmed', 'scheduled', 'in_progress']);

  return {
    requestCount: requests?.length || 0,
    quoteCount: quotes?.length || 0,
    activeOrderCount: (orders || []).filter((item) => activeOrderStates.has(item.order_status)).length,
    completedOrderCount: (orders || []).filter((item) => item.order_status === 'completed').length,
    disputeCount: disputes?.length || 0
  };
}
