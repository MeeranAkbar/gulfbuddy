import { getAuthenticatedUserContext } from '../auth/session';
import {
  getWorkspaceBranches,
  getWorkspaceCompanies,
  getWorkspaceCompanyInvites,
  getWorkspaceCompanyMembersDetailed,
  type WorkspaceBranchSummary,
  type WorkspaceCompanyInviteSummary,
  type WorkspaceCompanyMemberDetails,
  type WorkspaceCompanySummary
} from '../company/queries';
import { createSupabaseServerClient } from '../supabase/server';

interface CandidateProfileRow {
  headline: string | null;
  current_location: string | null;
  nationality: string | null;
  visa_status: string | null;
  total_experience_years: number | string | null;
  expected_salary_min: number | string | null;
  expected_salary_max: number | string | null;
  salary_currency: string | null;
  preferred_emirates_json: unknown;
  preferred_work_modes_json: unknown;
  summary: string | null;
  searchable_by_employers: boolean;
  profile_visibility: string;
  profile_strength_score: number;
}

interface CoreProfileRow {
  display_name: string;
  city: string | null;
  bio: string | null;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  is_identity_verified: boolean;
}

interface CandidateCvFileRow {
  id: string;
  public_filename: string;
  file_type: string;
  file_size: number;
  parsing_status: string;
  created_at: string;
  updated_at: string;
}

interface EmployerProfileRow {
  company_id: string;
  hiring_email: string | null;
  hiring_phone: string | null;
  public_careers_url: string | null;
  verification_status: string;
  hiring_status: string;
  response_time_score: number | null;
  profile_strength_score: number;
}

interface ListingAggregateRow {
  owner_company_id: string | null;
  publication_state: string;
}

interface ServiceProviderProfileRow {
  company_id: string;
  slug: string;
  provider_type: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  years_in_business: number | null;
  verification_status: string;
  trust_tier: string;
  response_time_score: number | null;
  profile_strength_score: number;
  is_accepting_requests: boolean;
  emergency_service: boolean;
}

interface ServiceOfferingRow {
  id: string;
  company_id: string;
  category: string;
  subcategory: string | null;
  service_title: string;
  pricing_model: string;
  base_price: number | string | null;
  currency: string | null;
  duration_estimate: string | null;
  is_featured_offering: boolean;
  is_active: boolean;
}

interface ServiceAreaRow {
  id: string;
  company_id: string;
  emirate: string;
  area: string | null;
  coverage_type: string;
}

interface ServicePortfolioRow {
  id: string;
  company_id: string;
}

interface CommissionLedgerRow {
  id: string;
  company_id: string;
  order_id: string;
  commission_type: string;
  commission_rate: number | string | null;
  commission_amount: number | string;
  currency: string;
  billing_status: string;
  payout_status: string;
  created_at: string;
}

interface ServiceOrderRow {
  id: string;
  company_id: string;
  order_status: string;
  total_amount: number | string | null;
}

interface ServiceRequestMatchRow {
  id: string;
  company_id: string;
}

interface ServiceQuoteRow {
  id: string;
  company_id: string;
  quote_status: string;
}

export interface CandidateProfileDetail {
  displayName: string;
  city: string | null;
  bio: string | null;
  headline: string | null;
  currentLocation: string | null;
  nationality: string | null;
  visaStatus: string | null;
  totalExperienceYears: number | string | null;
  expectedSalaryMin: number | string | null;
  expectedSalaryMax: number | string | null;
  salaryCurrency: string | null;
  preferredEmirates: string[];
  preferredWorkModes: string[];
  summary: string | null;
  searchableByEmployers: boolean;
  profileVisibility: string;
  profileStrengthScore: number;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
  experienceCount: number;
  educationCount: number;
  skillCount: number;
  languageCount: number;
  certificationCount: number;
}

export interface CandidateCvAsset {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  parsingStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyTeamSnapshot {
  companies: WorkspaceCompanySummary[];
  branches: WorkspaceBranchSummary[];
  members: WorkspaceCompanyMemberDetails[];
  invites: WorkspaceCompanyInviteSummary[];
}

export interface EmployerProfileSummary {
  companyId: string;
  displayName: string;
  verificationStatus: string;
  publicProfileEnabled: boolean;
  hiringEmail: string | null;
  hiringPhone: string | null;
  publicCareersUrl: string | null;
  hiringStatus: string;
  responseTimeScore: number | null;
  profileStrengthScore: number;
  branchCount: number;
  activeSeatCount: number;
  pendingInviteCount: number;
  activeJobCount: number;
  reviewJobCount: number;
}

export interface ProviderProfileSummary {
  companyId: string;
  slug: string;
  displayName: string;
  providerType: string;
  headline: string | null;
  bio: string | null;
  yearsInBusiness: number | null;
  verificationStatus: string;
  trustTier: string;
  responseTimeScore: number | null;
  profileStrengthScore: number;
  isAcceptingRequests: boolean;
  emergencyService: boolean;
  publicProfileEnabled: boolean;
  serviceAreaCount: number;
  activeOfferingCount: number;
  portfolioItemCount: number;
}

export interface ProviderServiceCatalogSummary {
  companyId: string;
  displayName: string;
  activeOfferingCount: number;
  featuredOfferingCount: number;
  activeAreaCount: number;
  offerings: ServiceOfferingRow[];
  areas: ServiceAreaRow[];
}

export interface ProviderFinanceSummary {
  companyId: string;
  displayName: string;
  totalCommissionAmount: number;
  invoicedCommissionAmount: number;
  paidCommissionAmount: number;
  totalOrderValue: number;
  completedOrderValue: number;
  ledgerEntries: CommissionLedgerRow[];
}

export interface ProviderReportSummary {
  companyId: string;
  displayName: string;
  requestMatchCount: number;
  quoteCount: number;
  quotedAcceptedCount: number;
  orderCount: number;
  completedOrderCount: number;
  activeOfferingCount: number;
  activeAreaCount: number;
  responseTimeScore: number | null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function filterCompaniesByType(companies: WorkspaceCompanySummary[], companyType: string) {
  return companies.filter((company) => company.company_type === companyType);
}

export async function getCandidateProfileDetail(): Promise<CandidateProfileDetail | null> {
  const context = await getAuthenticatedUserContext();

  if (!context) return null;

  const supabase = await createSupabaseServerClient();
  const userId = context.userId;

  const [
    { data: coreProfile },
    { data: candidateProfile },
    { count: experienceCount },
    { count: educationCount },
    { count: skillCount },
    { count: languageCount },
    { count: certificationCount }
  ] = await Promise.all([
    supabase.schema('core').from('profiles').select('display_name,city,bio,is_phone_verified,is_email_verified,is_identity_verified').eq('user_id', userId).maybeSingle(),
    supabase
      .schema('jobs')
      .from('candidate_profiles')
      .select(
        'headline,current_location,nationality,visa_status,total_experience_years,expected_salary_min,expected_salary_max,salary_currency,preferred_emirates_json,preferred_work_modes_json,summary,searchable_by_employers,profile_visibility,profile_strength_score'
      )
      .eq('user_id', userId)
      .maybeSingle(),
    supabase.schema('jobs').from('candidate_experience').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.schema('jobs').from('candidate_education').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.schema('jobs').from('candidate_skills').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.schema('jobs').from('candidate_languages').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.schema('jobs').from('candidate_certifications').select('id', { count: 'exact', head: true }).eq('user_id', userId)
  ]);

  if (!coreProfile && !candidateProfile) return null;

  const baseProfile = (coreProfile || {}) as Partial<CoreProfileRow>;
  const hiringProfile = (candidateProfile || {}) as Partial<CandidateProfileRow>;

  return {
    displayName: baseProfile.display_name || 'Candidate profile',
    city: baseProfile.city || null,
    bio: baseProfile.bio || null,
    headline: hiringProfile.headline || null,
    currentLocation: hiringProfile.current_location || null,
    nationality: hiringProfile.nationality || null,
    visaStatus: hiringProfile.visa_status || null,
    totalExperienceYears: hiringProfile.total_experience_years ?? null,
    expectedSalaryMin: hiringProfile.expected_salary_min ?? null,
    expectedSalaryMax: hiringProfile.expected_salary_max ?? null,
    salaryCurrency: hiringProfile.salary_currency || null,
    preferredEmirates: asStringArray(hiringProfile.preferred_emirates_json),
    preferredWorkModes: asStringArray(hiringProfile.preferred_work_modes_json),
    summary: hiringProfile.summary || null,
    searchableByEmployers: Boolean(hiringProfile.searchable_by_employers),
    profileVisibility: hiringProfile.profile_visibility || 'private',
    profileStrengthScore: hiringProfile.profile_strength_score || 0,
    isPhoneVerified: Boolean(baseProfile.is_phone_verified),
    isEmailVerified: Boolean(baseProfile.is_email_verified),
    isIdentityVerified: Boolean(baseProfile.is_identity_verified),
    experienceCount: experienceCount || 0,
    educationCount: educationCount || 0,
    skillCount: skillCount || 0,
    languageCount: languageCount || 0,
    certificationCount: certificationCount || 0
  };
}

export async function getCandidateCvAssets(): Promise<CandidateCvAsset[]> {
  const context = await getAuthenticatedUserContext();

  if (!context) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('jobs')
    .from('candidate_cv_files')
    .select('id,public_filename,file_type,file_size,parsing_status,created_at,updated_at')
    .eq('user_id', context.userId)
    .order('updated_at', { ascending: false });

  return ((data || []) as CandidateCvFileRow[]).map((item) => ({
    id: item.id,
    fileName: item.public_filename,
    fileType: item.file_type,
    fileSize: item.file_size,
    parsingStatus: item.parsing_status,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
}

async function getCompanyTeamSnapshot(companyType: string): Promise<CompanyTeamSnapshot> {
  const context = await getAuthenticatedUserContext();

  if (!context?.companyIds.length) {
    return { companies: [], branches: [], members: [], invites: [] };
  }

  const companies = filterCompaniesByType(await getWorkspaceCompanies(context.companyIds), companyType);
  const companyIds = companies.map((company) => company.id);

  if (!companyIds.length) {
    return { companies: [], branches: [], members: [], invites: [] };
  }

  const [branches, members, invites] = await Promise.all([
    getWorkspaceBranches(companyIds),
    getWorkspaceCompanyMembersDetailed(companyIds),
    getWorkspaceCompanyInvites(companyIds)
  ]);

  return { companies, branches, members, invites };
}

export async function getEmployerTeamSnapshot() {
  return getCompanyTeamSnapshot('employer');
}

export async function getProviderTeamSnapshot() {
  return getCompanyTeamSnapshot('service_provider');
}

export async function getEmployerProfileSummaries(): Promise<EmployerProfileSummary[]> {
  const teamSnapshot = await getEmployerTeamSnapshot();

  if (!teamSnapshot.companies.length) return [];

  const supabase = await createSupabaseServerClient();
  const companyIds = teamSnapshot.companies.map((company) => company.id);

  const [{ data: employerProfilesData }, { data: listingsData }] = await Promise.all([
    supabase
      .schema('jobs')
      .from('employer_profiles')
      .select('company_id,hiring_email,hiring_phone,public_careers_url,verification_status,hiring_status,response_time_score,profile_strength_score')
      .in('company_id', companyIds),
    supabase
      .schema('listing')
      .from('listing_core')
      .select('owner_company_id,publication_state')
      .eq('section', 'jobs')
      .in('owner_company_id', companyIds)
  ]);

  const employerProfiles = new Map(((employerProfilesData || []) as EmployerProfileRow[]).map((item) => [item.company_id, item]));
  const listings = (listingsData || []) as ListingAggregateRow[];

  return teamSnapshot.companies.map((company) => {
    const employerProfile = employerProfiles.get(company.id);
    const companyListings = listings.filter((item) => item.owner_company_id === company.id);

    return {
      companyId: company.id,
      displayName: company.display_name,
      verificationStatus: employerProfile?.verification_status || company.verification_status,
      publicProfileEnabled: company.public_profile_enabled,
      hiringEmail: employerProfile?.hiring_email || null,
      hiringPhone: employerProfile?.hiring_phone || null,
      publicCareersUrl: employerProfile?.public_careers_url || null,
      hiringStatus: employerProfile?.hiring_status || 'open',
      responseTimeScore: employerProfile?.response_time_score ?? null,
      profileStrengthScore: employerProfile?.profile_strength_score || 0,
      branchCount: teamSnapshot.branches.filter((branch) => branch.company_id === company.id).length,
      activeSeatCount: teamSnapshot.members.filter((member) => member.company_id === company.id && member.status === 'active').length,
      pendingInviteCount: teamSnapshot.invites.filter((invite) => invite.company_id === company.id).length,
      activeJobCount: companyListings.filter((item) => ['approved', 'published'].includes(item.publication_state)).length,
      reviewJobCount: companyListings.filter((item) => ['submitted', 'auto_checked', 'flagged', 'pending_review'].includes(item.publication_state)).length
    };
  });
}

export async function getProviderProfileSummaries(): Promise<ProviderProfileSummary[]> {
  const teamSnapshot = await getProviderTeamSnapshot();

  if (!teamSnapshot.companies.length) return [];

  const supabase = await createSupabaseServerClient();
  const companyIds = teamSnapshot.companies.map((company) => company.id);

  const [{ data: profilesData }, { data: offeringsData }, { data: areasData }, { data: portfolioData }] = await Promise.all([
    supabase
      .schema('services')
      .from('service_provider_profiles')
      .select(
        'company_id,slug,provider_type,display_name,headline,bio,years_in_business,verification_status,trust_tier,response_time_score,profile_strength_score,is_accepting_requests,emergency_service'
      )
      .in('company_id', companyIds),
    supabase
      .schema('services')
      .from('service_offerings')
      .select('id,company_id,is_active')
      .in('company_id', companyIds),
    supabase
      .schema('services')
      .from('service_areas')
      .select('id,company_id')
      .in('company_id', companyIds),
    supabase
      .schema('services')
      .from('service_portfolio_items')
      .select('id,company_id')
      .in('company_id', companyIds)
  ]);

  const profiles = new Map(((profilesData || []) as ServiceProviderProfileRow[]).map((item) => [item.company_id, item]));
  const offerings = offeringsData || [];
  const areas = areasData || [];
  const portfolioItems = portfolioData || [];

  return teamSnapshot.companies.map((company) => {
    const profile = profiles.get(company.id);

    return {
      companyId: company.id,
      slug: profile?.slug || company.id,
      displayName: profile?.display_name || company.display_name,
      providerType: profile?.provider_type || 'business_provider',
      headline: profile?.headline || null,
      bio: profile?.bio || null,
      yearsInBusiness: profile?.years_in_business ?? null,
      verificationStatus: profile?.verification_status || company.verification_status,
      trustTier: profile?.trust_tier || company.trust_tier,
      responseTimeScore: profile?.response_time_score ?? null,
      profileStrengthScore: profile?.profile_strength_score || 0,
      isAcceptingRequests: Boolean(profile?.is_accepting_requests),
      emergencyService: Boolean(profile?.emergency_service),
      publicProfileEnabled: company.public_profile_enabled,
      serviceAreaCount: areas.filter((item) => item.company_id === company.id).length,
      activeOfferingCount: offerings.filter((item) => item.company_id === company.id && item.is_active).length,
      portfolioItemCount: portfolioItems.filter((item) => item.company_id === company.id).length
    };
  });
}

export async function getProviderServiceCatalogSummaries(): Promise<ProviderServiceCatalogSummary[]> {
  const profiles = await getProviderProfileSummaries();

  if (!profiles.length) return [];

  const supabase = await createSupabaseServerClient();
  const companyIds = profiles.map((profile) => profile.companyId);

  const [{ data: offeringsData }, { data: areasData }] = await Promise.all([
    supabase
      .schema('services')
      .from('service_offerings')
      .select('id,company_id,category,subcategory,service_title,pricing_model,base_price,currency,duration_estimate,is_featured_offering,is_active')
      .in('company_id', companyIds)
      .order('created_at', { ascending: false }),
    supabase
      .schema('services')
      .from('service_areas')
      .select('id,company_id,emirate,area,coverage_type')
      .in('company_id', companyIds)
      .order('created_at', { ascending: true })
  ]);

  const offerings = (offeringsData || []) as ServiceOfferingRow[];
  const areas = (areasData || []) as ServiceAreaRow[];

  return profiles.map((profile) => ({
    companyId: profile.companyId,
    displayName: profile.displayName,
    activeOfferingCount: offerings.filter((item) => item.company_id === profile.companyId && item.is_active).length,
    featuredOfferingCount: offerings.filter((item) => item.company_id === profile.companyId && item.is_featured_offering).length,
    activeAreaCount: areas.filter((item) => item.company_id === profile.companyId).length,
    offerings: offerings.filter((item) => item.company_id === profile.companyId),
    areas: areas.filter((item) => item.company_id === profile.companyId)
  }));
}

export async function getProviderFinanceSummaries(): Promise<ProviderFinanceSummary[]> {
  const profiles = await getProviderProfileSummaries();

  if (!profiles.length) return [];

  const supabase = await createSupabaseServerClient();
  const companyIds = profiles.map((profile) => profile.companyId);

  const [{ data: ledgerData }, { data: ordersData }] = await Promise.all([
    supabase
      .schema('services')
      .from('service_commission_ledger')
      .select('id,company_id,order_id,commission_type,commission_rate,commission_amount,currency,billing_status,payout_status,created_at')
      .in('company_id', companyIds)
      .order('created_at', { ascending: false }),
    supabase
      .schema('services')
      .from('service_orders')
      .select('id,company_id,order_status,total_amount')
      .in('company_id', companyIds)
  ]);

  const ledgerEntries = (ledgerData || []) as CommissionLedgerRow[];
  const orders = (ordersData || []) as ServiceOrderRow[];

  return profiles.map((profile) => {
    const companyLedger = ledgerEntries.filter((item) => item.company_id === profile.companyId);
    const companyOrders = orders.filter((item) => item.company_id === profile.companyId);

    return {
      companyId: profile.companyId,
      displayName: profile.displayName,
      totalCommissionAmount: companyLedger.reduce((total, item) => total + Number(item.commission_amount || 0), 0),
      invoicedCommissionAmount: companyLedger
        .filter((item) => item.billing_status === 'invoiced')
        .reduce((total, item) => total + Number(item.commission_amount || 0), 0),
      paidCommissionAmount: companyLedger
        .filter((item) => item.billing_status === 'paid')
        .reduce((total, item) => total + Number(item.commission_amount || 0), 0),
      totalOrderValue: companyOrders.reduce((total, item) => total + Number(item.total_amount || 0), 0),
      completedOrderValue: companyOrders
        .filter((item) => item.order_status === 'completed')
        .reduce((total, item) => total + Number(item.total_amount || 0), 0),
      ledgerEntries: companyLedger.slice(0, 6)
    };
  });
}

export async function getProviderReportSummaries(): Promise<ProviderReportSummary[]> {
  const profiles = await getProviderProfileSummaries();

  if (!profiles.length) return [];

  const supabase = await createSupabaseServerClient();
  const companyIds = profiles.map((profile) => profile.companyId);

  const [{ data: offeringsData }, { data: areasData }, { data: matchesData }, { data: quotesData }, { data: ordersData }] = await Promise.all([
    supabase.schema('services').from('service_offerings').select('id,company_id,is_active').in('company_id', companyIds),
    supabase.schema('services').from('service_areas').select('id,company_id').in('company_id', companyIds),
    supabase.schema('services').from('service_request_provider_matches').select('id,company_id').in('company_id', companyIds),
    supabase.schema('services').from('service_quotes').select('id,company_id,quote_status').in('company_id', companyIds),
    supabase.schema('services').from('service_orders').select('id,company_id,order_status,total_amount').in('company_id', companyIds)
  ]);

  const offerings = (offeringsData || []) as Array<Pick<ServiceOfferingRow, 'id' | 'company_id' | 'is_active'>>;
  const areas = (areasData || []) as Array<Pick<ServiceAreaRow, 'id' | 'company_id'>>;
  const matches = (matchesData || []) as ServiceRequestMatchRow[];
  const quotes = (quotesData || []) as ServiceQuoteRow[];
  const orders = (ordersData || []) as ServiceOrderRow[];

  return profiles.map((profile) => {
    const companyQuotes = quotes.filter((item) => item.company_id === profile.companyId);
    const companyOrders = orders.filter((item) => item.company_id === profile.companyId);

    return {
      companyId: profile.companyId,
      displayName: profile.displayName,
      requestMatchCount: matches.filter((item) => item.company_id === profile.companyId).length,
      quoteCount: companyQuotes.length,
      quotedAcceptedCount: companyQuotes.filter((item) => item.quote_status === 'accepted').length,
      orderCount: companyOrders.length,
      completedOrderCount: companyOrders.filter((item) => item.order_status === 'completed').length,
      activeOfferingCount: offerings.filter((item) => item.company_id === profile.companyId && item.is_active).length,
      activeAreaCount: areas.filter((item) => item.company_id === profile.companyId).length,
      responseTimeScore: profile.responseTimeScore
    };
  });
}
