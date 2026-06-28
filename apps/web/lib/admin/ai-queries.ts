import { createSupabaseServerClient } from '../supabase/server';

export interface AdminAiDetectionItem {
  id: string;
  section: string;
  rule_code: string;
  severity: string;
  action_type: string;
  message: string;
  created_at: string;
  listing_title: string | null;
  publication_state: string | null;
  company_name: string | null;
}

export interface AdminAiSectionMetric {
  section: string;
  activeRules: number;
  detections: number;
  blockedProfiles: number;
  queueOpen: number;
}

export interface AdminAiOpsSnapshot {
  activeRuleCount: number;
  detectionCount: number;
  blockedListingCount: number;
  queueOpenCount: number;
  recentDetections: AdminAiDetectionItem[];
  sectionMetrics: AdminAiSectionMetric[];
}

export async function getAdminAiOpsSnapshot(): Promise<AdminAiOpsSnapshot> {
  const supabase = await createSupabaseServerClient();

  const [{ data: rules }, { data: detections }, { data: riskProfiles }, { data: moderationQueue }] = await Promise.all([
    supabase.schema('risk').from('risk_detection_rules').select('section,is_active'),
    supabase
      .schema('risk')
      .from('risk_detection_results')
      .select('id,listing_id,section,rule_code,severity,action_type,message,created_at')
      .order('created_at', { ascending: false })
      .limit(24),
    supabase.schema('risk').from('risk_profiles').select('section,risk_state').eq('subject_type', 'listing'),
    supabase.schema('risk').from('moderation_queue').select('section,status').in('status', ['open', 'in_review'])
  ]);

  const listingIds = Array.from(new Set((detections || []).map((item) => item.listing_id).filter(Boolean))) as string[];

  const { data: listings } = listingIds.length
    ? await supabase
        .schema('listing')
        .from('listing_core')
        .select('id,title,publication_state,owner_company_id')
        .in('id', listingIds)
    : { data: [] as { id: string; title: string; publication_state: string; owner_company_id: string | null }[] };

  const companyIds = Array.from(new Set((listings || []).map((item) => item.owner_company_id).filter(Boolean))) as string[];
  const { data: companies } = companyIds.length
    ? await supabase.schema('company').from('companies').select('id,display_name').in('id', companyIds)
    : { data: [] as { id: string; display_name: string }[] };

  const listingById = new Map((listings || []).map((listing) => [listing.id, listing]));
  const companyById = new Map((companies || []).map((company) => [company.id, company.display_name]));

  const metricsBySection = new Map<string, AdminAiSectionMetric>();

  (rules || []).forEach((rule) => {
    const current = metricsBySection.get(rule.section) || {
      section: rule.section,
      activeRules: 0,
      detections: 0,
      blockedProfiles: 0,
      queueOpen: 0
    };

    if (rule.is_active) {
      current.activeRules += 1;
    }

    metricsBySection.set(rule.section, current);
  });

  (detections || []).forEach((result) => {
    const current = metricsBySection.get(result.section) || {
      section: result.section,
      activeRules: 0,
      detections: 0,
      blockedProfiles: 0,
      queueOpen: 0
    };

    current.detections += 1;
    metricsBySection.set(result.section, current);
  });

  (riskProfiles || []).forEach((profile) => {
    const current = metricsBySection.get(profile.section) || {
      section: profile.section,
      activeRules: 0,
      detections: 0,
      blockedProfiles: 0,
      queueOpen: 0
    };

    if (profile.risk_state === 'blocked') {
      current.blockedProfiles += 1;
    }

    metricsBySection.set(profile.section, current);
  });

  (moderationQueue || []).forEach((queueItem) => {
    const current = metricsBySection.get(queueItem.section) || {
      section: queueItem.section,
      activeRules: 0,
      detections: 0,
      blockedProfiles: 0,
      queueOpen: 0
    };

    current.queueOpen += 1;
    metricsBySection.set(queueItem.section, current);
  });

  const recentDetections: AdminAiDetectionItem[] = (detections || []).map((result) => {
    const listing = listingById.get(result.listing_id);
    const companyName = listing?.owner_company_id ? companyById.get(listing.owner_company_id) || null : null;

    return {
      id: result.id,
      section: result.section,
      rule_code: result.rule_code,
      severity: result.severity,
      action_type: result.action_type,
      message: result.message,
      created_at: result.created_at,
      listing_title: listing?.title || null,
      publication_state: listing?.publication_state || null,
      company_name: companyName
    };
  });

  return {
    activeRuleCount: (rules || []).filter((rule) => rule.is_active).length,
    detectionCount: (detections || []).length,
    blockedListingCount: (riskProfiles || []).filter((profile) => profile.risk_state === 'blocked').length,
    queueOpenCount: (moderationQueue || []).length,
    recentDetections,
    sectionMetrics: Array.from(metricsBySection.values())
  };
}
