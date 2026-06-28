import { getAuthenticatedUserContext } from '../auth/session';
import { serverEnv } from '../env';
import { createSupabaseAdminClient } from '../supabase/admin';
import { createSupabaseServerClient } from '../supabase/server';

interface PublicJobRow {
  id: string;
  slug: string;
  title: string;
  emirate: string;
  area: string | null;
  job_title: string;
  employment_type: string;
  work_mode: string;
  salary_min: number | string | null;
  salary_max: number | string | null;
  salary_currency: string | null;
  salary_period: string | null;
  experience_level: string | null;
  urgent_hiring: boolean;
  valid_through: string | null;
  company_name: string | null;
  company_slug: string | null;
  employer_verification_status: string | null;
}

interface CandidateApplicationRow {
  id: string;
  listing_id: string;
  candidate_cv_file_id: string | null;
  application_status: string;
  source: string | null;
  cover_note: string | null;
  applied_at: string;
  last_updated_at: string;
}

interface CandidateSavedJobRow {
  id: string;
  listing_id: string;
  created_at: string;
}

interface CandidateCvRow {
  id: string;
  public_filename: string;
  file_type: string;
}

interface CandidateAlertRow {
  id: string;
  keywords: string | null;
  emirates_json: unknown;
  categories_json: unknown;
  salary_min: number | string | null;
  work_modes_json: unknown;
  frequency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmployerListingRow {
  id: string;
  slug: string;
  title: string;
  owner_company_id: string | null;
  emirate: string;
  area: string | null;
  publication_state: string;
  risk_state: string;
  updated_at: string;
  published_at: string | null;
}

interface EmployerJobDetailRow {
  listing_id: string;
  job_title: string;
  employment_type: string;
  work_mode: string;
  salary_min: number | string | null;
  salary_max: number | string | null;
  salary_currency: string | null;
  salary_period: string | null;
  experience_level: string | null;
  urgent_hiring: boolean;
  valid_through: string | null;
}

interface EmployerApplicationRow {
  id: string;
  listing_id: string;
  candidate_user_id: string;
  candidate_cv_file_id: string | null;
  application_status: string;
  cover_note: string | null;
  applied_at: string;
  last_updated_at: string;
}

interface CandidateProfileRow {
  user_id: string;
  headline: string | null;
  current_location: string | null;
  nationality: string | null;
  visa_status: string | null;
  total_experience_years: number | string | null;
  expected_salary_min: number | string | null;
  expected_salary_max: number | string | null;
  salary_currency: string | null;
  profile_strength_score: number;
  searchable_by_employers: boolean;
}

interface UserProfileRow {
  user_id: string;
  display_name: string;
  city: string | null;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  is_identity_verified: boolean;
}

interface ServiceRequestMatchRow {
  id: string;
  request_id: string;
  company_id: string;
  match_source: string;
  match_status: string;
  created_at: string;
}

interface ServiceRequestRow {
  id: string;
  public_ref: string;
  customer_name?: string | null;
  emirate: string;
  area: string | null;
  category: string;
  subcategory: string | null;
  request_title: string;
  preferred_date: string | null;
  preferred_time: string | null;
  budget_min: number | string | null;
  budget_max: number | string | null;
  request_status: string;
  created_at: string;
}

interface ServiceQuoteRow {
  id: string;
  request_id: string;
  company_id: string;
  quote_amount: number | string | null;
  currency: string | null;
  quote_status: string;
  valid_until: string | null;
  created_at: string;
}

interface ServiceOrderRow {
  id: string;
  request_id: string | null;
  company_id: string;
  public_ref: string;
  order_status: string;
  subtotal_amount?: number | string | null;
  total_amount?: number | string | null;
  currency?: string | null;
  scheduled_at: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
}

interface ServiceProviderPublicRow {
  company_id: string;
  slug: string;
  display_name: string;
  verification_status: string;
}

export interface CandidateAppliedJobItem {
  id: string;
  listingId: string;
  applicationStatus: string;
  source: string | null;
  coverNote: string | null;
  appliedAt: string;
  lastUpdatedAt: string;
  cvFileName: string | null;
  archived: boolean;
  jobTitle: string;
  companyName: string;
  companySlug: string | null;
  jobSlug: string | null;
  emirate: string | null;
  area: string | null;
  employmentType: string | null;
  workMode: string | null;
  salaryMin: number | string | null;
  salaryMax: number | string | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
  experienceLevel: string | null;
  urgentHiring: boolean;
  validThrough: string | null;
  employerVerificationStatus: string | null;
}

export interface CandidateSavedJobItem {
  id: string;
  savedAt: string;
  jobTitle: string;
  companyName: string;
  companySlug: string | null;
  jobSlug: string;
  emirate: string;
  area: string | null;
  employmentType: string;
  workMode: string;
  salaryMin: number | string | null;
  salaryMax: number | string | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
  experienceLevel: string | null;
  urgentHiring: boolean;
  validThrough: string | null;
  employerVerificationStatus: string | null;
}

export interface CandidateJobAlertItem {
  id: string;
  keywords: string | null;
  emirates: string[];
  categories: string[];
  salaryMin: number | string | null;
  workModes: string[];
  frequency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerJobItem {
  id: string;
  slug: string;
  title: string;
  jobTitle: string;
  emirate: string;
  area: string | null;
  publicationState: string;
  riskState: string;
  updatedAt: string;
  publishedAt: string | null;
  employmentType: string;
  workMode: string;
  salaryMin: number | string | null;
  salaryMax: number | string | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
  experienceLevel: string | null;
  urgentHiring: boolean;
  validThrough: string | null;
  applicantCount: number;
  activeApplicantCount: number;
  shortlistCount: number;
  rejectedCount: number;
}

export interface EmployerApplicantItem {
  applicationId: string;
  applicationStatus: string;
  appliedAt: string;
  lastUpdatedAt: string;
  coverNote: string | null;
  cvFileName: string | null;
  jobSlug: string;
  jobTitle: string;
  roleTitle: string;
  candidateId: string;
  candidateName: string;
  candidateHeadline: string | null;
  currentLocation: string | null;
  nationality: string | null;
  visaStatus: string | null;
  totalExperienceYears: number | string | null;
  expectedSalaryMin: number | string | null;
  expectedSalaryMax: number | string | null;
  salaryCurrency: string | null;
  profileStrengthScore: number;
  searchableByEmployers: boolean;
  isIdentityVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
}

export interface ProviderRequestItem {
  matchId: string;
  requestId: string;
  publicRef: string;
  requestTitle: string;
  requestStatus: string;
  category: string;
  subcategory: string | null;
  emirate: string;
  area: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  budgetMin: number | string | null;
  budgetMax: number | string | null;
  matchStatus: string;
  matchSource: string;
  createdAt: string;
  quoteStatus: string | null;
  quoteAmount: number | string | null;
  quoteCurrency: string | null;
  validUntil: string | null;
  orderStatus: string | null;
  orderRef: string | null;
  scheduledAt: string | null;
}

export interface CustomerRequestItem {
  requestId: string;
  publicRef: string;
  requestTitle: string;
  requestStatus: string;
  category: string;
  subcategory: string | null;
  emirate: string;
  area: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  budgetMin: number | string | null;
  budgetMax: number | string | null;
  createdAt: string;
  matchCount: number;
  quoteCount: number;
  latestQuoteStatus: string | null;
  latestQuoteAmount: number | string | null;
  latestQuoteCurrency: string | null;
  latestProviderName: string | null;
  latestProviderSlug: string | null;
  orderStatus: string | null;
  orderRef: string | null;
}

export interface CustomerQuoteItem {
  quoteId: string;
  requestId: string;
  requestPublicRef: string;
  requestTitle: string;
  providerName: string | null;
  providerSlug: string | null;
  quoteStatus: string;
  quoteAmount: number | string | null;
  currency: string | null;
  validUntil: string | null;
  createdAt: string;
}

export interface CustomerOrderItem {
  orderId: string;
  orderRef: string;
  requestId: string | null;
  requestTitle: string;
  providerName: string | null;
  providerSlug: string | null;
  orderStatus: string;
  subtotalAmount: number | string | null;
  totalAmount: number | string | null;
  currency: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface ProviderOrderItem {
  orderId: string;
  orderRef: string;
  requestId: string | null;
  requestPublicRef: string | null;
  requestTitle: string;
  customerName: string | null;
  category: string | null;
  emirate: string | null;
  area: string | null;
  orderStatus: string;
  subtotalAmount: number | string | null;
  totalAmount: number | string | null;
  currency: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function toMapById<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

function toMapByKey<T>(items: T[], getKey: (item: T) => string) {
  return new Map(items.map((item) => [getKey(item), item]));
}

function unique(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

export async function getCandidateAppliedJobs(): Promise<CandidateAppliedJobItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('jobs')
    .from('job_applications')
    .select('id,listing_id,candidate_cv_file_id,application_status,source,cover_note,applied_at,last_updated_at')
    .eq('candidate_user_id', context.userId)
    .order('applied_at', { ascending: false });

  const applications = (data || []) as CandidateApplicationRow[];
  const listingIds = unique(applications.map((item) => item.listing_id));
  const cvIds = unique(applications.map((item) => item.candidate_cv_file_id));

  const [{ data: jobsData }, { data: cvFilesData }] = await Promise.all([
    listingIds.length ? supabase.from('jobs_search_public_v1').select('*').in('id', listingIds) : Promise.resolve({ data: [] }),
    cvIds.length
      ? supabase.schema('jobs').from('candidate_cv_files').select('id,public_filename,file_type').in('id', cvIds)
      : Promise.resolve({ data: [] })
  ]);

  const jobs = toMapById((jobsData || []) as PublicJobRow[]);
  const cvFiles = toMapById((cvFilesData || []) as CandidateCvRow[]);

  return applications.map((application) => {
    const job = jobs.get(application.listing_id);
    const cv = application.candidate_cv_file_id ? cvFiles.get(application.candidate_cv_file_id) : null;

    return {
      id: application.id,
      listingId: application.listing_id,
      applicationStatus: application.application_status,
      source: application.source,
      coverNote: application.cover_note,
      appliedAt: application.applied_at,
      lastUpdatedAt: application.last_updated_at,
      cvFileName: cv?.public_filename || null,
      archived: !job,
      jobTitle: job?.job_title || 'Archived job record',
      companyName: job?.company_name || 'Employer record unavailable',
      companySlug: job?.company_slug || null,
      jobSlug: job?.slug || null,
      emirate: job?.emirate || null,
      area: job?.area || null,
      employmentType: job?.employment_type || null,
      workMode: job?.work_mode || null,
      salaryMin: job?.salary_min ?? null,
      salaryMax: job?.salary_max ?? null,
      salaryCurrency: job?.salary_currency || null,
      salaryPeriod: job?.salary_period || null,
      experienceLevel: job?.experience_level || null,
      urgentHiring: Boolean(job?.urgent_hiring),
      validThrough: job?.valid_through || null,
      employerVerificationStatus: job?.employer_verification_status || null
    };
  });
}

export async function getCandidateSavedJobs(): Promise<CandidateSavedJobItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('jobs')
    .from('job_saved_items')
    .select('id,listing_id,created_at')
    .eq('user_id', context.userId)
    .order('created_at', { ascending: false });

  const savedItems = (data || []) as CandidateSavedJobRow[];
  const listingIds = unique(savedItems.map((item) => item.listing_id));
  const { data: jobsData } = listingIds.length
    ? await supabase.from('jobs_search_public_v1').select('*').in('id', listingIds)
    : { data: [] };

  const jobs = toMapById((jobsData || []) as PublicJobRow[]);

  return savedItems
    .map((item) => {
      const job = jobs.get(item.listing_id);
      if (!job) return null;

      return {
        id: item.id,
        savedAt: item.created_at,
        jobTitle: job.job_title,
        companyName: job.company_name || 'Employer record unavailable',
        companySlug: job.company_slug || null,
        jobSlug: job.slug,
        emirate: job.emirate,
        area: job.area,
        employmentType: job.employment_type,
        workMode: job.work_mode,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        salaryCurrency: job.salary_currency,
        salaryPeriod: job.salary_period,
        experienceLevel: job.experience_level,
        urgentHiring: Boolean(job.urgent_hiring),
        validThrough: job.valid_through,
        employerVerificationStatus: job.employer_verification_status
      } satisfies CandidateSavedJobItem;
    })
    .filter((item): item is CandidateSavedJobItem => Boolean(item));
}

export async function getCandidateJobAlerts(): Promise<CandidateJobAlertItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('jobs')
    .from('job_alerts')
    .select('id,keywords,emirates_json,categories_json,salary_min,work_modes_json,frequency,is_active,created_at,updated_at')
    .eq('user_id', context.userId)
    .order('updated_at', { ascending: false });

  const alerts = (data || []) as CandidateAlertRow[];

  return alerts.map((alert) => ({
    id: alert.id,
    keywords: alert.keywords,
    emirates: asStringArray(alert.emirates_json),
    categories: asStringArray(alert.categories_json),
    salaryMin: alert.salary_min,
    workModes: asStringArray(alert.work_modes_json),
    frequency: alert.frequency,
    isActive: alert.is_active,
    createdAt: alert.created_at,
    updatedAt: alert.updated_at
  }));
}

export async function getEmployerJobs(): Promise<EmployerJobItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context?.companyIds.length) return [];

  const supabase = await createSupabaseServerClient();
  const [{ data: listingsData }, { data: jobDetailsData }] = await Promise.all([
    supabase
      .schema('listing')
      .from('listing_core')
      .select('id,slug,title,owner_company_id,emirate,area,publication_state,risk_state,updated_at,published_at')
      .eq('section', 'jobs')
      .in('owner_company_id', context.companyIds)
      .order('updated_at', { ascending: false }),
    supabase
      .schema('jobs')
      .from('job_listing_details')
      .select('listing_id,job_title,employment_type,work_mode,salary_min,salary_max,salary_currency,salary_period,experience_level,urgent_hiring,valid_through')
  ]);

  const listings = (listingsData || []) as EmployerListingRow[];
  const listingIds = listings.map((item) => item.id);
  const filteredDetails = (jobDetailsData || []).filter((item) => listingIds.includes(item.listing_id)) as EmployerJobDetailRow[];
  const detailsByListing = toMapByKey(filteredDetails, (item) => item.listing_id);

  const { data: applicationsData } = listingIds.length
    ? await supabase.schema('jobs').from('job_applications').select('listing_id,application_status').in('listing_id', listingIds)
    : { data: [] };

  const applicationRows = (applicationsData || []) as Array<Pick<EmployerApplicationRow, 'listing_id' | 'application_status'>>;
  const activeStatuses = new Set(['submitted', 'in_review', 'contacted', 'interviewing', 'offered']);
  const shortlistStatuses = new Set(['shortlisted', 'contacted', 'interviewing', 'offered']);

  return listings.map((listing) => {
    const detail = detailsByListing.get(listing.id);
    const jobApplications = applicationRows.filter((item) => item.listing_id === listing.id);

    return {
      id: listing.id,
      slug: listing.slug,
      title: listing.title,
      jobTitle: detail?.job_title || listing.title,
      emirate: listing.emirate,
      area: listing.area,
      publicationState: listing.publication_state,
      riskState: listing.risk_state,
      updatedAt: listing.updated_at,
      publishedAt: listing.published_at,
      employmentType: detail?.employment_type || 'not_set',
      workMode: detail?.work_mode || 'not_set',
      salaryMin: detail?.salary_min ?? null,
      salaryMax: detail?.salary_max ?? null,
      salaryCurrency: detail?.salary_currency || null,
      salaryPeriod: detail?.salary_period || null,
      experienceLevel: detail?.experience_level || null,
      urgentHiring: Boolean(detail?.urgent_hiring),
      validThrough: detail?.valid_through || null,
      applicantCount: jobApplications.length,
      activeApplicantCount: jobApplications.filter((item) => activeStatuses.has(item.application_status)).length,
      shortlistCount: jobApplications.filter((item) => shortlistStatuses.has(item.application_status)).length,
      rejectedCount: jobApplications.filter((item) => item.application_status === 'rejected').length
    };
  });
}

export async function getEmployerApplicants(): Promise<EmployerApplicantItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context?.companyIds.length) return [];

  const supabase = await createSupabaseServerClient();
  const { data: listingsData } = await supabase
    .schema('listing')
    .from('listing_core')
    .select('id,slug,title,owner_company_id')
    .eq('section', 'jobs')
    .in('owner_company_id', context.companyIds);

  const listings = (listingsData || []) as Array<Pick<EmployerListingRow, 'id' | 'slug' | 'title' | 'owner_company_id'>>;
  const listingIds = listings.map((item) => item.id);

  if (!listingIds.length) return [];

  const { data: detailsData } = await supabase.schema('jobs').from('job_listing_details').select('listing_id,job_title').in('listing_id', listingIds);
  const { data: applicationsData } = await supabase
    .schema('jobs')
    .from('job_applications')
    .select('id,listing_id,candidate_user_id,candidate_cv_file_id,application_status,cover_note,applied_at,last_updated_at')
    .in('listing_id', listingIds)
    .order('applied_at', { ascending: false });

  const applications = (applicationsData || []) as EmployerApplicationRow[];
  const listingById = toMapByKey(listings, (item) => item.id);
  const detailByListing = toMapByKey((detailsData || []) as Array<Pick<EmployerJobDetailRow, 'listing_id' | 'job_title'>>, (item) => item.listing_id);

  if (!applications.length || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return applications.map((application) => {
      const listing = listingById.get(application.listing_id);
      const detail = detailByListing.get(application.listing_id);

      return {
        applicationId: application.id,
        applicationStatus: application.application_status,
        appliedAt: application.applied_at,
        lastUpdatedAt: application.last_updated_at,
        coverNote: application.cover_note,
        cvFileName: null,
        jobSlug: listing?.slug || '',
        jobTitle: detail?.job_title || listing?.title || 'Job record unavailable',
        roleTitle: listing?.title || detail?.job_title || 'Role record unavailable',
        candidateId: application.candidate_user_id,
        candidateName: `Candidate ${application.candidate_user_id.slice(0, 8).toUpperCase()}`,
        candidateHeadline: null,
        currentLocation: null,
        nationality: null,
        visaStatus: null,
        totalExperienceYears: null,
        expectedSalaryMin: null,
        expectedSalaryMax: null,
        salaryCurrency: null,
        profileStrengthScore: 0,
        searchableByEmployers: false,
        isIdentityVerified: false,
        isPhoneVerified: false,
        isEmailVerified: false
      };
    });
  }

  const admin = createSupabaseAdminClient();
  const candidateIds = unique(applications.map((item) => item.candidate_user_id));
  const cvIds = unique(applications.map((item) => item.candidate_cv_file_id));

  const [{ data: candidateProfilesData }, { data: userProfilesData }, { data: candidateCvsData }] = await Promise.all([
    candidateIds.length
      ? admin
          .schema('jobs')
          .from('candidate_profiles')
          .select(
            'user_id,headline,current_location,nationality,visa_status,total_experience_years,expected_salary_min,expected_salary_max,salary_currency,profile_strength_score,searchable_by_employers'
          )
          .in('user_id', candidateIds)
      : Promise.resolve({ data: [] }),
    candidateIds.length
      ? admin
          .schema('core')
          .from('profiles')
          .select('user_id,display_name,city,is_phone_verified,is_email_verified,is_identity_verified')
          .in('user_id', candidateIds)
      : Promise.resolve({ data: [] }),
    cvIds.length ? admin.schema('jobs').from('candidate_cv_files').select('id,public_filename').in('id', cvIds) : Promise.resolve({ data: [] })
  ]);

  const candidateProfiles = toMapByKey((candidateProfilesData || []) as CandidateProfileRow[], (item) => item.user_id);
  const userProfiles = toMapByKey((userProfilesData || []) as UserProfileRow[], (item) => item.user_id);
  const cvFiles = toMapById((candidateCvsData || []) as Array<Pick<CandidateCvRow, 'id' | 'public_filename'>>);

  return applications.map((application) => {
    const listing = listingById.get(application.listing_id);
    const detail = detailByListing.get(application.listing_id);
    const candidate = candidateProfiles.get(application.candidate_user_id);
    const profile = userProfiles.get(application.candidate_user_id);
    const cv = application.candidate_cv_file_id ? cvFiles.get(application.candidate_cv_file_id) : null;

    return {
      applicationId: application.id,
      applicationStatus: application.application_status,
      appliedAt: application.applied_at,
      lastUpdatedAt: application.last_updated_at,
      coverNote: application.cover_note,
      cvFileName: cv?.public_filename || null,
      jobSlug: listing?.slug || '',
      jobTitle: detail?.job_title || listing?.title || 'Job record unavailable',
      roleTitle: listing?.title || detail?.job_title || 'Role record unavailable',
      candidateId: application.candidate_user_id,
      candidateName: profile?.display_name || `Candidate ${application.candidate_user_id.slice(0, 8).toUpperCase()}`,
      candidateHeadline: candidate?.headline || null,
      currentLocation: candidate?.current_location || profile?.city || null,
      nationality: candidate?.nationality || null,
      visaStatus: candidate?.visa_status || null,
      totalExperienceYears: candidate?.total_experience_years ?? null,
      expectedSalaryMin: candidate?.expected_salary_min ?? null,
      expectedSalaryMax: candidate?.expected_salary_max ?? null,
      salaryCurrency: candidate?.salary_currency || null,
      profileStrengthScore: candidate?.profile_strength_score || 0,
      searchableByEmployers: candidate?.searchable_by_employers || false,
      isIdentityVerified: profile?.is_identity_verified || false,
      isPhoneVerified: profile?.is_phone_verified || false,
      isEmailVerified: profile?.is_email_verified || false
    };
  });
}

export async function getProviderRequests(): Promise<ProviderRequestItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context?.companyIds.length) return [];

  const supabase = await createSupabaseServerClient();
  const { data: matchesData } = await supabase
    .schema('services')
    .from('service_request_provider_matches')
    .select('id,request_id,company_id,match_source,match_status,created_at')
    .in('company_id', context.companyIds)
    .order('created_at', { ascending: false });

  const matches = (matchesData || []) as ServiceRequestMatchRow[];
  const requestIds = unique(matches.map((item) => item.request_id));

  const [{ data: requestsData }, { data: quotesData }, { data: ordersData }] = await Promise.all([
    requestIds.length
      ? supabase
          .schema('services')
          .from('service_requests')
          .select('id,public_ref,emirate,area,category,subcategory,request_title,preferred_date,preferred_time,budget_min,budget_max,request_status,created_at')
          .in('id', requestIds)
      : Promise.resolve({ data: [] }),
    requestIds.length
      ? supabase
          .schema('services')
          .from('service_quotes')
          .select('id,request_id,company_id,quote_amount,currency,quote_status,valid_until,created_at')
          .in('request_id', requestIds)
          .in('company_id', context.companyIds)
      : Promise.resolve({ data: [] }),
    requestIds.length
      ? supabase
          .schema('services')
          .from('service_orders')
          .select('id,request_id,company_id,public_ref,order_status,scheduled_at,created_at')
          .in('request_id', requestIds)
          .in('company_id', context.companyIds)
      : Promise.resolve({ data: [] })
  ]);

  const requests = toMapById((requestsData || []) as ServiceRequestRow[]);
  const quotes = (quotesData || []) as ServiceQuoteRow[];
  const orders = (ordersData || []) as ServiceOrderRow[];

  return matches.map((match) => {
    const request = requests.get(match.request_id);
    const quote = quotes.find((item) => item.request_id === match.request_id && item.company_id === match.company_id) || null;
    const order = orders.find((item) => item.request_id === match.request_id && item.company_id === match.company_id) || null;

    return {
      matchId: match.id,
      requestId: match.request_id,
      publicRef: request?.public_ref || 'Pending request record',
      requestTitle: request?.request_title || 'Request record unavailable',
      requestStatus: request?.request_status || 'pending',
      category: request?.category || 'not_set',
      subcategory: request?.subcategory || null,
      emirate: request?.emirate || 'Not set',
      area: request?.area || null,
      preferredDate: request?.preferred_date || null,
      preferredTime: request?.preferred_time || null,
      budgetMin: request?.budget_min ?? null,
      budgetMax: request?.budget_max ?? null,
      matchStatus: match.match_status,
      matchSource: match.match_source,
      createdAt: match.created_at,
      quoteStatus: quote?.quote_status || null,
      quoteAmount: quote?.quote_amount ?? null,
      quoteCurrency: quote?.currency || null,
      validUntil: quote?.valid_until || null,
      orderStatus: order?.order_status || null,
      orderRef: order?.public_ref || null,
      scheduledAt: order?.scheduled_at || null
    };
  });
}

export async function getProviderOrders(): Promise<ProviderOrderItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context?.companyIds.length) return [];

  const supabase = await createSupabaseServerClient();
  const { data: ordersData } = await supabase
    .schema('services')
    .from('service_orders')
    .select('id,request_id,company_id,public_ref,order_status,subtotal_amount,total_amount,currency,scheduled_at,completed_at,cancelled_at,created_at')
    .in('company_id', context.companyIds)
    .order('created_at', { ascending: false });

  const orders = (ordersData || []) as ServiceOrderRow[];
  const requestIds = unique(orders.map((item) => item.request_id));
  const { data: requestsData } = requestIds.length
    ? await supabase
        .schema('services')
        .from('service_requests')
        .select('id,public_ref,customer_name,emirate,area,category,request_title')
        .in('id', requestIds)
    : { data: [] };

  const requests = toMapById((requestsData || []) as ServiceRequestRow[]);

  return orders.map((order) => {
    const request = order.request_id ? requests.get(order.request_id) : null;

    return {
      orderId: order.id,
      orderRef: order.public_ref,
      requestId: order.request_id,
      requestPublicRef: request?.public_ref || null,
      requestTitle: request?.request_title || 'Service request record unavailable',
      customerName: request?.customer_name || null,
      category: request?.category || null,
      emirate: request?.emirate || null,
      area: request?.area || null,
      orderStatus: order.order_status,
      subtotalAmount: order.subtotal_amount ?? null,
      totalAmount: order.total_amount ?? null,
      currency: order.currency || null,
      scheduledAt: order.scheduled_at,
      completedAt: order.completed_at || null,
      cancelledAt: order.cancelled_at || null,
      createdAt: order.created_at
    };
  });
}

export async function getCustomerRequests(): Promise<CustomerRequestItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context) return [];

  const supabase = await createSupabaseServerClient();
  const { data: requestsData } = await supabase
    .schema('services')
    .from('service_requests')
    .select('id,public_ref,emirate,area,category,subcategory,request_title,preferred_date,preferred_time,budget_min,budget_max,request_status,created_at')
    .eq('customer_user_id', context.userId)
    .order('created_at', { ascending: false });

  const requests = (requestsData || []) as ServiceRequestRow[];
  const requestIds = requests.map((item) => item.id);

  const [{ data: matchesData }, { data: quotesData }, { data: ordersData }] = await Promise.all([
    requestIds.length
      ? supabase.schema('services').from('service_request_provider_matches').select('id,request_id,company_id,match_status').in('request_id', requestIds)
      : Promise.resolve({ data: [] }),
    requestIds.length
      ? supabase
          .schema('services')
          .from('service_quotes')
          .select('id,request_id,company_id,quote_amount,currency,quote_status,valid_until,created_at')
          .in('request_id', requestIds)
      : Promise.resolve({ data: [] }),
    requestIds.length
      ? supabase
          .schema('services')
          .from('service_orders')
          .select('id,request_id,company_id,public_ref,order_status,scheduled_at,created_at')
          .in('request_id', requestIds)
      : Promise.resolve({ data: [] })
  ]);

  const matches = (matchesData || []) as Array<Pick<ServiceRequestMatchRow, 'id' | 'request_id' | 'company_id' | 'match_status'>>;
  const quotes = (quotesData || []) as ServiceQuoteRow[];
  const orders = (ordersData || []) as ServiceOrderRow[];
  const providerCompanyIds = unique([...matches.map((item) => item.company_id), ...quotes.map((item) => item.company_id), ...orders.map((item) => item.company_id)]);

  const { data: providersData } = providerCompanyIds.length
    ? await supabase.from('service_provider_public_v1').select('company_id,slug,display_name,verification_status').in('company_id', providerCompanyIds)
    : { data: [] };

  const providers = toMapByKey((providersData || []) as ServiceProviderPublicRow[], (item) => item.company_id);

  return requests.map((request) => {
    const requestMatches = matches.filter((item) => item.request_id === request.id);
    const requestQuotes = quotes
      .filter((item) => item.request_id === request.id)
      .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
    const latestQuote = requestQuotes[0] || null;
    const order = orders.find((item) => item.request_id === request.id) || null;
    const latestProvider = latestQuote ? providers.get(latestQuote.company_id) : order ? providers.get(order.company_id) : null;

    return {
      requestId: request.id,
      publicRef: request.public_ref,
      requestTitle: request.request_title,
      requestStatus: request.request_status,
      category: request.category,
      subcategory: request.subcategory,
      emirate: request.emirate,
      area: request.area,
      preferredDate: request.preferred_date,
      preferredTime: request.preferred_time,
      budgetMin: request.budget_min,
      budgetMax: request.budget_max,
      createdAt: request.created_at,
      matchCount: requestMatches.length,
      quoteCount: requestQuotes.length,
      latestQuoteStatus: latestQuote?.quote_status || null,
      latestQuoteAmount: latestQuote?.quote_amount ?? null,
      latestQuoteCurrency: latestQuote?.currency || null,
      latestProviderName: latestProvider?.display_name || null,
      latestProviderSlug: latestProvider?.slug || null,
      orderStatus: order?.order_status || null,
      orderRef: order?.public_ref || null
    };
  });
}

export async function getCustomerQuotes(): Promise<CustomerQuoteItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context) return [];

  const supabase = await createSupabaseServerClient();
  const { data: requestsData } = await supabase.schema('services').from('service_requests').select('id,public_ref,request_title').eq('customer_user_id', context.userId);
  const requests = (requestsData || []) as Array<Pick<ServiceRequestRow, 'id' | 'public_ref' | 'request_title'>>;
  const requestIds = requests.map((item) => item.id);

  if (!requestIds.length) return [];

  const { data: quotesData } = await supabase
    .schema('services')
    .from('service_quotes')
    .select('id,request_id,company_id,quote_amount,currency,quote_status,valid_until,created_at')
    .in('request_id', requestIds)
    .order('created_at', { ascending: false });

  const quotes = (quotesData || []) as ServiceQuoteRow[];
  const providerCompanyIds = unique(quotes.map((item) => item.company_id));
  const { data: providersData } = providerCompanyIds.length
    ? await supabase.from('service_provider_public_v1').select('company_id,slug,display_name').in('company_id', providerCompanyIds)
    : { data: [] };

  const providerByCompany = toMapByKey((providersData || []) as Array<Pick<ServiceProviderPublicRow, 'company_id' | 'slug' | 'display_name'>>, (item) => item.company_id);
  const requestById = toMapByKey(requests, (item) => item.id);

  return quotes.map((quote) => {
    const request = requestById.get(quote.request_id);
    const provider = providerByCompany.get(quote.company_id);

    return {
      quoteId: quote.id,
      requestId: quote.request_id,
      requestPublicRef: request?.public_ref || 'Request record unavailable',
      requestTitle: request?.request_title || 'Service request record unavailable',
      providerName: provider?.display_name || null,
      providerSlug: provider?.slug || null,
      quoteStatus: quote.quote_status,
      quoteAmount: quote.quote_amount ?? null,
      currency: quote.currency || null,
      validUntil: quote.valid_until,
      createdAt: quote.created_at
    };
  });
}

export async function getCustomerOrders(): Promise<CustomerOrderItem[]> {
  const context = await getAuthenticatedUserContext();

  if (!context) return [];

  const supabase = await createSupabaseServerClient();
  const { data: ordersData } = await supabase
    .schema('services')
    .from('service_orders')
    .select('id,request_id,company_id,public_ref,order_status,subtotal_amount,total_amount,currency,scheduled_at,completed_at,cancelled_at,created_at')
    .eq('customer_user_id', context.userId)
    .order('created_at', { ascending: false });

  const orders = (ordersData || []) as ServiceOrderRow[];
  const requestIds = unique(orders.map((item) => item.request_id));
  const providerCompanyIds = unique(orders.map((item) => item.company_id));

  const [{ data: requestsData }, { data: providersData }] = await Promise.all([
    requestIds.length ? supabase.schema('services').from('service_requests').select('id,request_title').in('id', requestIds) : Promise.resolve({ data: [] }),
    providerCompanyIds.length
      ? supabase.from('service_provider_public_v1').select('company_id,slug,display_name').in('company_id', providerCompanyIds)
      : Promise.resolve({ data: [] })
  ]);

  const requestById = toMapByKey((requestsData || []) as Array<Pick<ServiceRequestRow, 'id' | 'request_title'>>, (item) => item.id);
  const providerByCompany = toMapByKey((providersData || []) as Array<Pick<ServiceProviderPublicRow, 'company_id' | 'slug' | 'display_name'>>, (item) => item.company_id);

  return orders.map((order) => {
    const request = order.request_id ? requestById.get(order.request_id) : null;
    const provider = providerByCompany.get(order.company_id);

    return {
      orderId: order.id,
      orderRef: order.public_ref,
      requestId: order.request_id,
      requestTitle: request?.request_title || 'Service request record unavailable',
      providerName: provider?.display_name || null,
      providerSlug: provider?.slug || null,
      orderStatus: order.order_status,
      subtotalAmount: order.subtotal_amount ?? null,
      totalAmount: order.total_amount ?? null,
      currency: order.currency || null,
      scheduledAt: order.scheduled_at,
      completedAt: order.completed_at || null,
      cancelledAt: order.cancelled_at || null,
      createdAt: order.created_at
    };
  });
}
