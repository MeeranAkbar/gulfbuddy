import { createSupabaseServerClient } from '../supabase/server';

export interface AdminJobsRoleSummary {
  id: string;
  title: string;
  slug: string;
  emirate: string;
  publication_state: string;
  risk_state: string;
  updated_at: string;
  company_name: string | null;
  employer_verification_status: string | null;
  employment_type: string | null;
  work_mode: string | null;
  urgent_hiring: boolean;
  applications_count: number;
}

export interface AdminJobsMetric {
  label: string;
  total: number;
}

export interface AdminJobsOpsSnapshot {
  recentRoles: AdminJobsRoleSummary[];
  employerVerificationMetrics: AdminJobsMetric[];
  applicationStatusMetrics: AdminJobsMetric[];
  totalJobs: number;
  liveJobs: number;
  reviewJobs: number;
  urgentJobs: number;
  verifiedEmployers: number;
  totalApplications: number;
}

export async function getAdminJobsOpsSnapshot(): Promise<AdminJobsOpsSnapshot> {
  const supabase = await createSupabaseServerClient();

  const [
    { data: allJobListings },
    { data: recentJobListings },
    { data: allJobDetails },
    { data: employerProfiles },
    { data: applications }
  ] = await Promise.all([
    supabase.schema('listing').from('listing_core').select('id,owner_company_id,publication_state,risk_state').eq('section', 'jobs'),
    supabase
      .schema('listing')
      .from('listing_core')
      .select('id,title,slug,emirate,publication_state,risk_state,updated_at,owner_company_id')
      .eq('section', 'jobs')
      .order('updated_at', { ascending: false })
      .limit(18),
    supabase.schema('jobs').from('job_listing_details').select('listing_id,employment_type,work_mode,urgent_hiring'),
    supabase.schema('jobs').from('employer_profiles').select('company_id,verification_status,hiring_status'),
    supabase.schema('jobs').from('job_applications').select('listing_id,application_status')
  ]);

  const companyIds = Array.from(new Set((recentJobListings || []).map((listing) => listing.owner_company_id).filter(Boolean))) as string[];
  const { data: companies } = companyIds.length
    ? await supabase.schema('company').from('companies').select('id,display_name').in('id', companyIds)
    : { data: [] as { id: string; display_name: string }[] };

  const companyById = new Map((companies || []).map((company) => [company.id, company.display_name]));
  const employerProfileByCompanyId = new Map((employerProfiles || []).map((profile) => [profile.company_id, profile]));
  const jobDetailByListingId = new Map((allJobDetails || []).map((detail) => [detail.listing_id, detail]));
  const applicationCountByListingId = new Map<string, number>();
  const employerVerificationMap = new Map<string, number>();
  const applicationStatusMap = new Map<string, number>();

  (applications || []).forEach((application) => {
    applicationCountByListingId.set(application.listing_id, (applicationCountByListingId.get(application.listing_id) || 0) + 1);
    applicationStatusMap.set(application.application_status, (applicationStatusMap.get(application.application_status) || 0) + 1);
  });

  (employerProfiles || []).forEach((profile) => {
    employerVerificationMap.set(profile.verification_status, (employerVerificationMap.get(profile.verification_status) || 0) + 1);
  });

  const recentRoles: AdminJobsRoleSummary[] = (recentJobListings || []).map((listing) => {
    const detail = jobDetailByListingId.get(listing.id);
    const employerProfile = listing.owner_company_id ? employerProfileByCompanyId.get(listing.owner_company_id) : null;

    return {
      id: listing.id,
      title: listing.title,
      slug: listing.slug,
      emirate: listing.emirate,
      publication_state: listing.publication_state,
      risk_state: listing.risk_state,
      updated_at: listing.updated_at,
      company_name: listing.owner_company_id ? companyById.get(listing.owner_company_id) || null : null,
      employer_verification_status: employerProfile?.verification_status || null,
      employment_type: detail?.employment_type || null,
      work_mode: detail?.work_mode || null,
      urgent_hiring: detail?.urgent_hiring || false,
      applications_count: applicationCountByListingId.get(listing.id) || 0
    };
  });

  const reviewStates = new Set(['submitted', 'auto_checked', 'flagged', 'pending_review']);

  return {
    recentRoles,
    employerVerificationMetrics: Array.from(employerVerificationMap.entries()).map(([label, total]) => ({ label, total })),
    applicationStatusMetrics: Array.from(applicationStatusMap.entries()).map(([label, total]) => ({ label, total })),
    totalJobs: (allJobListings || []).length,
    liveJobs: (allJobListings || []).filter((listing) => listing.publication_state === 'published' || listing.publication_state === 'approved').length,
    reviewJobs: (allJobListings || []).filter((listing) => reviewStates.has(listing.publication_state)).length,
    urgentJobs: (allJobDetails || []).filter((detail) => detail.urgent_hiring).length,
    verifiedEmployers: (employerProfiles || []).filter((profile) => profile.verification_status === 'verified').length,
    totalApplications: (applications || []).length
  };
}
