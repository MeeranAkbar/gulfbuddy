import { createSupabaseServerClient } from '../supabase/server';

export interface AdminComplianceCaseSummary {
  id: string;
  section: string;
  listing_id: string | null;
  listing_title: string | null;
  listing_slug: string | null;
  publication_state: string | null;
  company_id: string | null;
  company_name: string | null;
  user_id: string | null;
  case_type: string;
  compliance_state: string;
  priority: number;
  created_at: string;
  queue_priority: string | null;
  queue_status: string | null;
  reason_codes: string[];
  risk_profile: {
    total_score: number;
    risk_state: string;
    last_checked_at: string;
  } | null;
  property_snapshot: {
    market_mode: string | null;
    purpose: string | null;
    property_type: string | null;
    building_name: string | null;
    community_name: string | null;
    rent_frequency: string | null;
    advertiser_type: string | null;
    permit_system: string | null;
    permit_number: string | null;
    permit_expiry_date: string | null;
    permit_qr_present: boolean;
    company_verification_status: string | null;
    company_trust_tier: string | null;
    image_count: number;
  } | null;
  duplicate_signals: {
    same_permit_count: number;
    same_title_price_count: number;
    reused_image_listing_count: number;
  } | null;
  triggered_rules: {
    rule_code: string;
    severity: string;
    score_delta: number;
    action_type: string;
    message: string;
    metadata_json: Record<string, unknown>;
  }[];
  evidence_documents: {
    id: string;
    document_type: string;
    document_label: string;
    access_url: string | null;
    review_state: string;
    notes: string | null;
  }[];
}

export interface AdminModerationCaseSummary {
  id: string;
  section: string;
  listing_id: string | null;
  listing_title: string | null;
  listing_slug: string | null;
  publication_state: string | null;
  company_id: string | null;
  company_name: string | null;
  user_id: string | null;
  moderation_state: string;
  reason_code: string | null;
  queue: string;
  created_at: string;
  risk_profile: {
    total_score: number;
    risk_state: string;
    last_checked_at: string;
  } | null;
  triggered_rules: {
    rule_code: string;
    severity: string;
    score_delta: number;
    action_type: string;
    message: string;
  }[];
}

function extractDuplicateSignals(
  triggeredRules: {
    rule_code: string;
    metadata_json: Record<string, unknown>;
  }[]
) {
  const duplicateRule = triggeredRules.find((rule) => rule.rule_code === 'property_duplicate_listing');

  if (!duplicateRule) {
    return null;
  }

  const samePermitCount = Number(duplicateRule.metadata_json.samePermitCount || 0);
  const sameTitlePriceCount = Number(duplicateRule.metadata_json.sameTitlePriceCount || 0);
  const reusedImageListingCount = Number(duplicateRule.metadata_json.reusedImageListingCount || 0);

  return {
    same_permit_count: Number.isFinite(samePermitCount) ? samePermitCount : 0,
    same_title_price_count: Number.isFinite(sameTitlePriceCount) ? sameTitlePriceCount : 0,
    reused_image_listing_count: Number.isFinite(reusedImageListingCount) ? reusedImageListingCount : 0
  };
}

export async function getAdminComplianceSnapshot() {
  const supabase = await createSupabaseServerClient();

  const [{ data: complianceCases }, { data: moderationCases }] = await Promise.all([
    supabase
      .schema('compliance')
      .from('compliance_cases')
      .select('id,section,listing_id,company_id,user_id,case_type,compliance_state,priority,created_at')
      .in('compliance_state', ['required_pending', 'under_review'])
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .schema('compliance')
      .from('moderation_cases')
      .select('id,section,listing_id,company_id,user_id,moderation_state,reason_code,queue,created_at')
      .in('moderation_state', ['pending_review', 'changes_requested'])
      .order('created_at', { ascending: false })
      .limit(12)
  ]);

  const listingIds = Array.from(
    new Set(
      [...(complianceCases || []), ...(moderationCases || [])]
        .map((item) => item.listing_id)
        .filter(Boolean)
    )
  ) as string[];

  const companyIds = Array.from(
    new Set(
      [...(complianceCases || []), ...(moderationCases || [])]
        .map((item) => item.company_id)
        .filter(Boolean)
    )
  ) as string[];

  const [{ data: listings }, { data: companies }, { data: propertyDetails }, { data: propertyCompliance }, { data: media }, { data: riskProfiles }, { data: riskQueue }, { data: riskResults }] = await Promise.all([
    listingIds.length
      ? supabase
          .schema('listing')
          .from('listing_core')
          .select('id,title,slug,publication_state,price_amount,emirate,area')
          .in('id', listingIds)
      : Promise.resolve({
          data: [] as {
            id: string;
            title: string;
            slug: string;
            publication_state: string;
            price_amount: number | null;
            emirate: string;
            area: string | null;
          }[]
        }),
    companyIds.length
      ? supabase
          .schema('company')
          .from('companies')
          .select('id,display_name,verification_status,trust_tier')
          .in('id', companyIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string; verification_status: string; trust_tier: string }[] }),
    listingIds.length
      ? supabase
          .schema('property')
          .from('property_listing_details')
          .select('listing_id,market_mode,purpose,property_type,building_name,community_name,rent_frequency')
          .in('listing_id', listingIds)
      : Promise.resolve({
          data: [] as {
            listing_id: string;
            market_mode: string | null;
            purpose: string | null;
            property_type: string | null;
            building_name: string | null;
            community_name: string | null;
            rent_frequency: string | null;
          }[]
        }),
    listingIds.length
      ? supabase
          .schema('property')
          .from('property_compliance')
          .select('listing_id,advertiser_type,permit_system,permit_number,permit_expiry_date,permit_qr_payload')
          .in('listing_id', listingIds)
      : Promise.resolve({
          data: [] as {
            listing_id: string;
            advertiser_type: string | null;
            permit_system: string | null;
            permit_number: string | null;
            permit_expiry_date: string | null;
            permit_qr_payload: string | null;
          }[]
        }),
    listingIds.length
      ? supabase
          .schema('listing')
          .from('listing_media')
          .select('listing_id')
          .in('listing_id', listingIds)
          .eq('status', 'active')
      : Promise.resolve({ data: [] as { listing_id: string }[] }),
    listingIds.length
      ? supabase
          .schema('risk')
          .from('risk_profiles')
          .select('subject_id,total_score,risk_state,last_checked_at')
          .eq('subject_type', 'listing')
          .in('subject_id', listingIds)
      : Promise.resolve({
          data: [] as { subject_id: string; total_score: number; risk_state: string; last_checked_at: string }[]
        }),
    listingIds.length
      ? supabase
          .schema('risk')
          .from('moderation_queue')
          .select('listing_id,priority,status,reason_codes_json,updated_at')
          .in('listing_id', listingIds)
          .in('status', ['open', 'in_review'])
      : Promise.resolve({
          data: [] as {
            listing_id: string;
            priority: string;
            status: string;
            reason_codes_json: string[];
            updated_at: string;
          }[]
        }),
    listingIds.length
      ? supabase
          .schema('risk')
          .from('risk_detection_results')
          .select('listing_id,rule_code,severity,score_delta,action_type,message,metadata_json,created_at')
          .in('listing_id', listingIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({
          data: [] as {
            listing_id: string;
            rule_code: string;
            severity: string;
            score_delta: number;
            action_type: string;
            message: string;
            metadata_json: Record<string, unknown>;
            created_at: string;
          }[]
        })
  ]);

  const { data: evidenceDocuments } = listingIds.length
    ? await supabase
        .schema('property')
        .from('property_compliance_documents')
        .select('id,listing_id,document_type,document_label,access_url,review_state,notes,created_at')
        .in('listing_id', listingIds)
        .order('created_at', { ascending: false })
    : { data: [] as { id: string; listing_id: string; document_type: string; document_label: string; access_url: string | null; review_state: string; notes: string | null }[] };

  const listingById = new Map((listings || []).map((item) => [item.id, item]));
  const companyById = new Map((companies || []).map((item) => [item.id, item]));
  const propertyDetailsByListingId = new Map((propertyDetails || []).map((item) => [item.listing_id, item]));
  const propertyComplianceByListingId = new Map((propertyCompliance || []).map((item) => [item.listing_id, item]));
  const riskProfileByListingId = new Map(
    (riskProfiles || []).map((item) => [
      item.subject_id,
      {
        total_score: item.total_score,
        risk_state: item.risk_state,
        last_checked_at: item.last_checked_at
      }
    ])
  );
  const imageCountByListingId = new Map<string, number>();
  (media || []).forEach((item) => {
    imageCountByListingId.set(item.listing_id, (imageCountByListingId.get(item.listing_id) || 0) + 1);
  });
  const evidenceByListingId = new Map<string, AdminComplianceCaseSummary['evidence_documents']>();
  const riskQueueByListingId = new Map<
    string,
    {
      priority: string;
      status: string;
      reason_codes_json: string[];
    }
  >();
  const riskResultsByListingId = new Map<string, AdminComplianceCaseSummary['triggered_rules']>();

  (evidenceDocuments || []).forEach((document) => {
    const current = evidenceByListingId.get(document.listing_id) || [];
    current.push({
      id: document.id,
      document_type: document.document_type,
      document_label: document.document_label,
      access_url: document.access_url,
      review_state: document.review_state,
      notes: document.notes
    });
    evidenceByListingId.set(document.listing_id, current);
  });

  (riskQueue || []).forEach((item) => {
    const existing = riskQueueByListingId.get(item.listing_id);

    if (!existing) {
      riskQueueByListingId.set(item.listing_id, {
        priority: item.priority,
        status: item.status,
        reason_codes_json: item.reason_codes_json || []
      });
    }
  });

  (riskResults || []).forEach((item) => {
    const current = riskResultsByListingId.get(item.listing_id) || [];
    current.push({
      rule_code: item.rule_code,
      severity: item.severity,
      score_delta: item.score_delta,
      action_type: item.action_type,
      message: item.message,
      metadata_json: item.metadata_json || {}
    });
    riskResultsByListingId.set(item.listing_id, current);
  });

  const complianceCaseSummaries: AdminComplianceCaseSummary[] = (complianceCases || []).map((item) => {
      const listing = item.listing_id ? listingById.get(item.listing_id) : null;
      const company = item.company_id ? companyById.get(item.company_id) : null;
      const propertyDetail = item.listing_id ? propertyDetailsByListingId.get(item.listing_id) : null;
      const compliance = item.listing_id ? propertyComplianceByListingId.get(item.listing_id) : null;
      const riskProfile = item.listing_id ? riskProfileByListingId.get(item.listing_id) || null : null;
      const queue = item.listing_id ? riskQueueByListingId.get(item.listing_id) || null : null;
      const triggeredRules = item.listing_id ? riskResultsByListingId.get(item.listing_id) || [] : [];

      return {
        ...item,
        listing_title: listing?.title || null,
        listing_slug: listing?.slug || null,
        publication_state: listing?.publication_state || null,
        company_name: company?.display_name || null,
        queue_priority: queue?.priority || null,
        queue_status: queue?.status || null,
        reason_codes: queue?.reason_codes_json || triggeredRules.map((rule) => rule.rule_code),
        risk_profile: riskProfile,
        property_snapshot: item.listing_id
          ? {
              market_mode: propertyDetail?.market_mode || null,
              purpose: propertyDetail?.purpose || null,
              property_type: propertyDetail?.property_type || null,
              building_name: propertyDetail?.building_name || null,
              community_name: propertyDetail?.community_name || null,
              rent_frequency: propertyDetail?.rent_frequency || null,
              advertiser_type: compliance?.advertiser_type || null,
              permit_system: compliance?.permit_system || null,
              permit_number: compliance?.permit_number || null,
              permit_expiry_date: compliance?.permit_expiry_date || null,
              permit_qr_present: Boolean(compliance?.permit_qr_payload),
              company_verification_status: company?.verification_status || null,
              company_trust_tier: company?.trust_tier || null,
              image_count: imageCountByListingId.get(item.listing_id) || 0
            }
          : null,
        duplicate_signals: extractDuplicateSignals(triggeredRules),
        triggered_rules: triggeredRules,
        evidence_documents: item.listing_id ? evidenceByListingId.get(item.listing_id) || [] : []
      };
    });

  const moderationCaseSummaries: AdminModerationCaseSummary[] = (moderationCases || []).map((item) => ({
      ...item,
      listing_title: item.listing_id ? listingById.get(item.listing_id)?.title || null : null,
      listing_slug: item.listing_id ? listingById.get(item.listing_id)?.slug || null : null,
      publication_state: item.listing_id ? listingById.get(item.listing_id)?.publication_state || null : null,
      company_name: item.company_id ? companyById.get(item.company_id)?.display_name || null : null,
      risk_profile: item.listing_id ? riskProfileByListingId.get(item.listing_id) || null : null,
      triggered_rules:
        item.listing_id
          ? (riskResultsByListingId.get(item.listing_id) || []).map((rule) => ({
              rule_code: rule.rule_code,
              severity: rule.severity,
              score_delta: rule.score_delta,
              action_type: rule.action_type,
              message: rule.message
            }))
          : []
    }));

  return {
    complianceCases: complianceCaseSummaries,
    moderationCases: moderationCaseSummaries
  };
}
