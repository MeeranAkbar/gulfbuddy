import { getAuthenticatedUserContext } from '../auth/session';
import {
  getWorkspaceBranches,
  getWorkspaceCompanies,
  getWorkspaceCompanyInvites,
  getWorkspaceCompanyMembersDetailed,
  getWorkspaceCompanyOperationalSummaries,
  type WorkspaceBranchSummary,
  type WorkspaceCompanyInviteSummary,
  type WorkspaceCompanyMemberDetails,
  type WorkspaceCompanyOperationalSummary,
  type WorkspaceCompanySummary
} from '../company/queries';
import { getWorkspaceMonetizationSnapshot } from '../monetization/queries';
import { createSupabaseServerClient } from '../supabase/server';

interface WorkspaceLeadEventRow {
  id: string;
  section: string;
  listing_id: string | null;
  company_id: string | null;
  assigned_user_id: string | null;
  event_type: string;
  source_page: string | null;
  source_context: string | null;
  created_at: string;
}

interface WorkspaceProfileSettingsRow {
  display_name: string | null;
  preferred_language: string | null;
  city: string | null;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  is_identity_verified: boolean;
}

interface WorkspaceListingLookupRow {
  id: string;
  title: string;
  slug: string;
}

interface TeamCompanySnapshot {
  company: WorkspaceCompanySummary;
  branches: WorkspaceBranchSummary[];
  members: WorkspaceCompanyMemberDetails[];
  invites: WorkspaceCompanyInviteSummary[];
  operationalSummary: WorkspaceCompanyOperationalSummary | null;
}

export interface WorkspaceLeadEventSummary {
  id: string;
  section: string;
  eventType: string;
  createdAt: string;
  sourcePage: string | null;
  sourceContext: string | null;
  companyName: string | null;
  listingTitle: string | null;
  listingSlug: string | null;
  assignedToCurrentUser: boolean;
}

export interface WorkspaceLeadMetric {
  key: string;
  total: number;
}

export interface WorkspaceLeadSnapshot {
  totalEvents: number;
  companyBackedEvents: number;
  assignedEvents: number;
  recentEvents: WorkspaceLeadEventSummary[];
  sectionMetrics: WorkspaceLeadMetric[];
  eventTypeMetrics: WorkspaceLeadMetric[];
}

export interface WorkspaceSettingsSnapshot {
  email: string | null;
  displayName: string | null;
  preferredLanguage: string | null;
  city: string | null;
  companyCount: number;
  verifiedCompanyCount: number;
  publicProfileCount: number;
  adminRoleCount: number;
  phoneVerified: boolean;
  emailVerified: boolean;
  identityVerified: boolean;
  orderCount: number;
  activeEntitlementCount: number;
  liveCampaignCount: number;
  activeSlotDemand: number;
  companies: WorkspaceCompanySummary[];
}

export interface WorkspaceTeamSnapshot {
  companies: TeamCompanySnapshot[];
  branchCount: number;
  activeSeatCount: number;
  pendingInviteCount: number;
}

export interface WorkspaceVerificationSnapshot {
  email: string | null;
  displayName: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  identityVerified: boolean;
  companies: Array<
    WorkspaceCompanySummary & {
      operationalSummary: WorkspaceCompanyOperationalSummary | null;
    }
  >;
  totalComplianceDocuments: number;
  totalComplianceCases: number;
  totalModerationCases: number;
  verifiedCompanyCount: number;
}

export async function getWorkspaceLeadSnapshot(): Promise<WorkspaceLeadSnapshot> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      totalEvents: 0,
      companyBackedEvents: 0,
      assignedEvents: 0,
      recentEvents: [],
      sectionMetrics: [],
      eventTypeMetrics: []
    };
  }

  const supabase = await createSupabaseServerClient();
  const baseSelect = 'id,section,listing_id,company_id,assigned_user_id,event_type,source_page,source_context,created_at';

  const [companyEventsResponse, assignedEventsResponse] = await Promise.all([
    context.companyIds.length
      ? supabase
          .schema('lead')
          .from('lead_events')
          .select(baseSelect)
          .in('company_id', context.companyIds)
          .order('created_at', { ascending: false })
          .limit(40)
      : Promise.resolve({ data: [] as WorkspaceLeadEventRow[] }),
    supabase
      .schema('lead')
      .from('lead_events')
      .select(baseSelect)
      .eq('assigned_user_id', context.userId)
      .order('created_at', { ascending: false })
      .limit(40)
  ]);

  const mergedEvents = [...(companyEventsResponse.data || []), ...(assignedEventsResponse.data || [])] as WorkspaceLeadEventRow[];
  const dedupedMap = new Map(mergedEvents.map((event) => [event.id, event]));
  const events = Array.from(dedupedMap.values()).sort((a, b) => b.created_at.localeCompare(a.created_at));

  const listingIds = Array.from(new Set(events.map((event) => event.listing_id).filter(Boolean))) as string[];
  const companyIds = Array.from(new Set(events.map((event) => event.company_id).filter(Boolean))) as string[];

  const [{ data: listings }, { data: companies }] = await Promise.all([
    listingIds.length
      ? supabase.schema('listing').from('listing_core').select('id,title,slug').in('id', listingIds)
      : Promise.resolve({ data: [] as WorkspaceListingLookupRow[] }),
    companyIds.length
      ? supabase.schema('company').from('companies').select('id,display_name').in('id', companyIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string }[] })
  ]);

  const listingById = new Map(((listings || []) as WorkspaceListingLookupRow[]).map((listing) => [listing.id, listing]));
  const companyById = new Map((companies || []).map((company) => [company.id, company.display_name]));
  const sectionMap = new Map<string, number>();
  const eventTypeMap = new Map<string, number>();

  events.forEach((event) => {
    sectionMap.set(event.section, (sectionMap.get(event.section) || 0) + 1);
    eventTypeMap.set(event.event_type, (eventTypeMap.get(event.event_type) || 0) + 1);
  });

  return {
    totalEvents: events.length,
    companyBackedEvents: events.filter((event) => Boolean(event.company_id)).length,
    assignedEvents: events.filter((event) => event.assigned_user_id === context.userId).length,
    recentEvents: events.slice(0, 18).map((event) => ({
      id: event.id,
      section: event.section,
      eventType: event.event_type,
      createdAt: event.created_at,
      sourcePage: event.source_page,
      sourceContext: event.source_context,
      companyName: event.company_id ? companyById.get(event.company_id) || null : null,
      listingTitle: event.listing_id ? listingById.get(event.listing_id)?.title || null : null,
      listingSlug: event.listing_id ? listingById.get(event.listing_id)?.slug || null : null,
      assignedToCurrentUser: event.assigned_user_id === context.userId
    })),
    sectionMetrics: Array.from(sectionMap.entries()).map(([key, total]) => ({ key, total })),
    eventTypeMetrics: Array.from(eventTypeMap.entries()).map(([key, total]) => ({ key, total }))
  };
}

export async function getWorkspaceSettingsSnapshot(): Promise<WorkspaceSettingsSnapshot | null> {
  const context = await getAuthenticatedUserContext();

  if (!context) return null;

  const [companies, monetizationSnapshot, profileResponse] = await Promise.all([
    getWorkspaceCompanies(context.companyIds),
    getWorkspaceMonetizationSnapshot({ companyIds: context.companyIds, userId: context.userId }),
    (async () => {
      const supabase = await createSupabaseServerClient();
      return supabase
        .schema('core')
        .from('profiles')
        .select('display_name,preferred_language,city,is_phone_verified,is_email_verified,is_identity_verified')
        .eq('user_id', context.userId)
        .maybeSingle();
    })()
  ]);

  const profile = (profileResponse.data || null) as WorkspaceProfileSettingsRow | null;

  return {
    email: context.email,
    displayName: profile?.display_name || null,
    preferredLanguage: profile?.preferred_language || null,
    city: profile?.city || null,
    companyCount: companies.length,
    verifiedCompanyCount: companies.filter((company) => company.verification_status === 'verified').length,
    publicProfileCount: companies.filter((company) => company.public_profile_enabled).length,
    adminRoleCount: context.adminRoles.length,
    phoneVerified: Boolean(profile?.is_phone_verified),
    emailVerified: Boolean(profile?.is_email_verified),
    identityVerified: Boolean(profile?.is_identity_verified),
    orderCount: monetizationSnapshot.orders.length,
    activeEntitlementCount: monetizationSnapshot.entitlements.filter((item) => ['active', 'scheduled'].includes(item.status)).length,
    liveCampaignCount: monetizationSnapshot.campaigns.filter((item) => ['active', 'scheduled'].includes(item.status)).length,
    activeSlotDemand: monetizationSnapshot.adSlots.reduce((total, slot) => total + slot.active_assignment_count, 0),
    companies
  };
}

export async function getWorkspaceTeamSnapshot(): Promise<WorkspaceTeamSnapshot> {
  const context = await getAuthenticatedUserContext();

  if (!context?.companyIds.length) {
    return {
      companies: [],
      branchCount: 0,
      activeSeatCount: 0,
      pendingInviteCount: 0
    };
  }

  const [companies, branches, members, invites, operationalSummaries] = await Promise.all([
    getWorkspaceCompanies(context.companyIds),
    getWorkspaceBranches(context.companyIds),
    getWorkspaceCompanyMembersDetailed(context.companyIds),
    getWorkspaceCompanyInvites(context.companyIds),
    getWorkspaceCompanyOperationalSummaries(context.companyIds)
  ]);

  return {
    companies: companies.map((company) => ({
      company,
      branches: branches.filter((branch) => branch.company_id === company.id),
      members: members.filter((member) => member.company_id === company.id),
      invites: invites.filter((invite) => invite.company_id === company.id),
      operationalSummary: operationalSummaries.find((summary) => summary.company_id === company.id) || null
    })),
    branchCount: branches.length,
    activeSeatCount: members.filter((member) => member.status === 'active').length,
    pendingInviteCount: invites.length
  };
}

export async function getWorkspaceVerificationSnapshot(): Promise<WorkspaceVerificationSnapshot | null> {
  const context = await getAuthenticatedUserContext();

  if (!context) return null;

  const [companies, operationalSummaries, profileResponse] = await Promise.all([
    getWorkspaceCompanies(context.companyIds),
    getWorkspaceCompanyOperationalSummaries(context.companyIds),
    (async () => {
      const supabase = await createSupabaseServerClient();
      return supabase
        .schema('core')
        .from('profiles')
        .select('display_name,is_phone_verified,is_email_verified,is_identity_verified')
        .eq('user_id', context.userId)
        .maybeSingle();
    })()
  ]);

  const profile = (profileResponse.data || null) as Pick<
    WorkspaceProfileSettingsRow,
    'display_name' | 'is_phone_verified' | 'is_email_verified' | 'is_identity_verified'
  > | null;

  return {
    email: context.email,
    displayName: profile?.display_name || null,
    phoneVerified: Boolean(profile?.is_phone_verified),
    emailVerified: Boolean(profile?.is_email_verified),
    identityVerified: Boolean(profile?.is_identity_verified),
    companies: companies.map((company) => ({
      ...company,
      operationalSummary: operationalSummaries.find((summary) => summary.company_id === company.id) || null
    })),
    totalComplianceDocuments: operationalSummaries.reduce((total, item) => total + item.evidence_document_count, 0),
    totalComplianceCases: operationalSummaries.reduce((total, item) => total + item.compliance_case_count, 0),
    totalModerationCases: operationalSummaries.reduce((total, item) => total + item.moderation_case_count, 0),
    verifiedCompanyCount: companies.filter((company) => company.verification_status === 'verified').length
  };
}
