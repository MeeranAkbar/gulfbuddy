import { createSupabaseServerClient } from '../supabase/server';

export interface WorkspaceCompanySummary {
  id: string;
  display_name: string;
  company_type: string;
  verification_status: string;
  trust_tier: string;
  public_profile_enabled: boolean;
}

export interface WorkspaceBranchSummary {
  id: string;
  company_id: string;
  name: string;
  emirate: string | null;
  area: string | null;
  is_active: boolean;
}

export interface WorkspaceCompanyMemberSummary {
  id: string;
  company_id: string;
  user_id: string;
  branch_id: string | null;
  is_primary: boolean;
  status: string;
  role: string;
}

export interface WorkspaceCompanyMemberDetails extends WorkspaceCompanyMemberSummary {
  email: string | null;
  display_name: string | null;
  branch_name: string | null;
}

export interface WorkspaceCompanyInviteSummary {
  id: string;
  company_id: string;
  email: string;
  role: string;
  branch_id: string | null;
  status: string;
  expires_at: string;
  created_at: string;
}

export interface WorkspaceCompanyOperationalSummary {
  company_id: string;
  property_listing_count: number;
  property_draft_count: number;
  property_in_review_count: number;
  property_published_count: number;
  compliance_case_count: number;
  moderation_case_count: number;
  evidence_document_count: number;
  trust_total_score: number;
  trust_risk_state: string | null;
  trust_last_checked_at: string | null;
}

export interface AdminCompanyOpsSummary extends WorkspaceCompanySummary {
  branch_count: number;
  active_member_count: number;
  pending_invite_count: number;
  property_listing_count: number;
  property_draft_count: number;
  property_in_review_count: number;
  property_published_count: number;
  compliance_case_count: number;
  moderation_case_count: number;
  evidence_document_count: number;
  trust_total_score: number;
  trust_risk_state: string | null;
  trust_last_checked_at: string | null;
}

export async function getWorkspaceCompanies(companyIds: string[]) {
  if (!companyIds.length) {
    return [] satisfies WorkspaceCompanySummary[];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('company')
    .from('companies')
    .select('id,display_name,company_type,verification_status,trust_tier,public_profile_enabled')
    .in('id', companyIds)
    .order('display_name', { ascending: true });

  return (data || []) as WorkspaceCompanySummary[];
}

export async function getWorkspaceBranches(companyIds: string[]) {
  if (!companyIds.length) {
    return [] satisfies WorkspaceBranchSummary[];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('company')
    .from('company_branches')
    .select('id,company_id,name,emirate,area,is_active')
    .in('company_id', companyIds)
    .eq('is_active', true)
    .order('name', { ascending: true });

  return (data || []) as WorkspaceBranchSummary[];
}

export async function getWorkspaceCompanyMembers(companyIds: string[]) {
  if (!companyIds.length) {
    return [] satisfies WorkspaceCompanyMemberSummary[];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('company')
    .from('company_members')
    .select('id,company_id,user_id,branch_id,is_primary,status,role')
    .in('company_id', companyIds);

  return (data || []) as WorkspaceCompanyMemberSummary[];
}

export async function getWorkspaceCompanyMembersDetailed(companyIds: string[]) {
  const members = await getWorkspaceCompanyMembers(companyIds);

  if (!members.length) {
    return [] satisfies WorkspaceCompanyMemberDetails[];
  }

  const supabase = await createSupabaseServerClient();
  const userIds = Array.from(new Set(members.map((member) => member.user_id)));
  const branchIds = Array.from(new Set(members.map((member) => member.branch_id).filter(Boolean))) as string[];

  const [{ data: users }, { data: profiles }, { data: branches }] = await Promise.all([
    supabase.schema('core').from('users').select('id,email').in('id', userIds),
    supabase.schema('core').from('profiles').select('user_id,display_name').in('user_id', userIds),
    branchIds.length
      ? supabase.schema('company').from('company_branches').select('id,name').in('id', branchIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] })
  ]);

  const emailByUserId = new Map((users || []).map((user) => [user.id, user.email]));
  const displayNameByUserId = new Map((profiles || []).map((profile) => [profile.user_id, profile.display_name]));
  const branchNameById = new Map((branches || []).map((branch) => [branch.id, branch.name]));

  return members.map((member) => ({
    ...member,
    email: emailByUserId.get(member.user_id) || null,
    display_name: displayNameByUserId.get(member.user_id) || null,
    branch_name: member.branch_id ? branchNameById.get(member.branch_id) || null : null
  })) satisfies WorkspaceCompanyMemberDetails[];
}

export async function getWorkspaceCompanyInvites(companyIds: string[]) {
  if (!companyIds.length) {
    return [] satisfies WorkspaceCompanyInviteSummary[];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('company')
    .from('company_member_invites')
    .select('id,company_id,email,role,branch_id,status,expires_at,created_at')
    .in('company_id', companyIds)
    .eq('status', 'pending')
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  return (data || []) as WorkspaceCompanyInviteSummary[];
}

export async function getWorkspaceCompanyOperationalSummaries(companyIds: string[]) {
  if (!companyIds.length) {
    return [] satisfies WorkspaceCompanyOperationalSummary[];
  }

  const supabase = await createSupabaseServerClient();
  const { data: propertyListings } = await supabase
    .schema('listing')
    .from('listing_core')
    .select('id,owner_company_id,publication_state')
    .eq('section', 'property')
    .in('owner_company_id', companyIds);

  const listingIds = Array.from(new Set((propertyListings || []).map((listing) => listing.id)));

  const [{ data: complianceCases }, { data: moderationCases }, { data: evidenceDocuments }] = await Promise.all([
    supabase
      .schema('compliance')
      .from('compliance_cases')
      .select('company_id,listing_id,compliance_state')
      .in('company_id', companyIds)
      .eq('section', 'property')
      .in('compliance_state', ['required_pending', 'under_review']),
    supabase
      .schema('compliance')
      .from('moderation_cases')
      .select('company_id,listing_id,moderation_state')
      .in('company_id', companyIds)
      .eq('section', 'property')
      .in('moderation_state', ['pending_review', 'changes_requested']),
    listingIds.length
      ? supabase
          .schema('property')
          .from('property_compliance_documents')
          .select('listing_id')
          .in('listing_id', listingIds)
      : Promise.resolve({ data: [] as { listing_id: string }[] })
  ]);

  const { data: companyRiskProfiles } = await supabase
    .schema('risk')
    .from('risk_profiles')
    .select('subject_id,total_score,risk_state,last_checked_at')
    .eq('subject_type', 'company')
    .eq('section', 'property')
    .in('subject_id', companyIds);

  const listingToCompanyId = new Map((propertyListings || []).map((listing) => [listing.id, listing.owner_company_id]));

  const summaryByCompanyId = new Map<string, WorkspaceCompanyOperationalSummary>();

  companyIds.forEach((companyId) => {
    summaryByCompanyId.set(companyId, {
      company_id: companyId,
      property_listing_count: 0,
      property_draft_count: 0,
      property_in_review_count: 0,
      property_published_count: 0,
      compliance_case_count: 0,
      moderation_case_count: 0,
      evidence_document_count: 0,
      trust_total_score: 0,
      trust_risk_state: null,
      trust_last_checked_at: null
    });
  });

  (propertyListings || []).forEach((listing) => {
    const summary = summaryByCompanyId.get(listing.owner_company_id);

    if (!summary) return;

    summary.property_listing_count += 1;

    if (listing.publication_state === 'draft' || listing.publication_state === 'rejected') {
      summary.property_draft_count += 1;
    }

    if (listing.publication_state === 'submitted' || listing.publication_state === 'pending_review') {
      summary.property_in_review_count += 1;
    }

    if (listing.publication_state === 'approved' || listing.publication_state === 'published') {
      summary.property_published_count += 1;
    }
  });

  (complianceCases || []).forEach((item) => {
    const summary = item.company_id ? summaryByCompanyId.get(item.company_id) : null;
    if (!summary) return;
    summary.compliance_case_count += 1;
  });

  (moderationCases || []).forEach((item) => {
    const summary = item.company_id ? summaryByCompanyId.get(item.company_id) : null;
    if (!summary) return;
    summary.moderation_case_count += 1;
  });

  (evidenceDocuments || []).forEach((document) => {
    const companyId = listingToCompanyId.get(document.listing_id);
    if (!companyId) return;
    const summary = summaryByCompanyId.get(companyId);
    if (!summary) return;
    summary.evidence_document_count += 1;
  });

  (companyRiskProfiles || []).forEach((profile) => {
    const summary = summaryByCompanyId.get(profile.subject_id);
    if (!summary) return;
    summary.trust_total_score = profile.total_score;
    summary.trust_risk_state = profile.risk_state;
    summary.trust_last_checked_at = profile.last_checked_at;
  });

  return Array.from(summaryByCompanyId.values()) satisfies WorkspaceCompanyOperationalSummary[];
}

export async function getAdminCompanyOpsSnapshot() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('company')
    .from('companies')
    .select('id,display_name,company_type,verification_status,trust_tier,public_profile_enabled')
    .order('updated_at', { ascending: false })
    .limit(40);

  const companies = (data || []) as WorkspaceCompanySummary[];
  const companyIds = companies.map((company) => company.id);

  if (!companyIds.length) {
    return [] satisfies AdminCompanyOpsSummary[];
  }

  const [branches, members, invites, operationalSummaries] = await Promise.all([
    getWorkspaceBranches(companyIds),
    getWorkspaceCompanyMembers(companyIds),
    getWorkspaceCompanyInvites(companyIds),
    getWorkspaceCompanyOperationalSummaries(companyIds)
  ]);

  return companies.map((company) => {
    const operationalSummary = operationalSummaries.find((summary) => summary.company_id === company.id);

    return {
      ...company,
      branch_count: branches.filter((branch) => branch.company_id === company.id).length,
      active_member_count: members.filter((member) => member.company_id === company.id && member.status === 'active').length,
      pending_invite_count: invites.filter((invite) => invite.company_id === company.id).length,
      property_listing_count: operationalSummary?.property_listing_count || 0,
      property_draft_count: operationalSummary?.property_draft_count || 0,
      property_in_review_count: operationalSummary?.property_in_review_count || 0,
      property_published_count: operationalSummary?.property_published_count || 0,
      compliance_case_count: operationalSummary?.compliance_case_count || 0,
      moderation_case_count: operationalSummary?.moderation_case_count || 0,
      evidence_document_count: operationalSummary?.evidence_document_count || 0,
      trust_total_score: operationalSummary?.trust_total_score || 0,
      trust_risk_state: operationalSummary?.trust_risk_state || null,
      trust_last_checked_at: operationalSummary?.trust_last_checked_at || null
    };
  }) satisfies AdminCompanyOpsSummary[];
}
