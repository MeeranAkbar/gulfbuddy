import { createSupabaseServerClient } from '../supabase/server';

export interface AdminRiskQueueItemSummary {
  id: string;
  listing_id: string;
  section: string;
  queue_type: string;
  priority: string;
  status: string;
  reason_codes_json: string[];
  created_at: string;
  updated_at: string;
  listing_title: string | null;
  listing_slug: string | null;
  publication_state: string | null;
  company_name: string | null;
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

export async function getAdminRiskSnapshot() {
  const supabase = await createSupabaseServerClient();
  const { data: queueItems } = await supabase
    .schema('risk')
    .from('moderation_queue')
    .select('id,listing_id,section,queue_type,priority,status,reason_codes_json,created_at,updated_at')
    .in('status', ['open', 'in_review'])
    .order('updated_at', { ascending: false })
    .limit(12);

  const listingIds = (queueItems || []).map((item) => item.listing_id);

  const [{ data: listings }, { data: profiles }, { data: results }] = await Promise.all([
    listingIds.length
      ? supabase
          .schema('listing')
          .from('listing_core')
          .select('id,title,slug,publication_state,owner_company_id')
          .in('id', listingIds)
      : Promise.resolve({ data: [] as { id: string; title: string; slug: string; publication_state: string; owner_company_id: string | null }[] }),
    listingIds.length
      ? supabase
          .schema('risk')
          .from('risk_profiles')
          .select('subject_id,total_score,risk_state,last_checked_at')
          .eq('subject_type', 'listing')
          .in('subject_id', listingIds)
      : Promise.resolve({ data: [] as { subject_id: string; total_score: number; risk_state: string; last_checked_at: string }[] }),
    listingIds.length
      ? supabase
          .schema('risk')
          .from('risk_detection_results')
          .select('listing_id,rule_code,severity,score_delta,action_type,message,created_at')
          .in('listing_id', listingIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [] as { listing_id: string; rule_code: string; severity: string; score_delta: number; action_type: string; message: string; created_at: string }[] })
  ]);

  const companyIds = Array.from(new Set((listings || []).map((item) => item.owner_company_id).filter(Boolean))) as string[];
  const { data: companies } = companyIds.length
    ? await supabase.schema('company').from('companies').select('id,display_name').in('id', companyIds)
    : { data: [] as { id: string; display_name: string }[] };

  const listingById = new Map((listings || []).map((item) => [item.id, item]));
  const companyById = new Map((companies || []).map((item) => [item.id, item.display_name]));
  const profileByListingId = new Map(
    (profiles || []).map((profile) => [
      profile.subject_id,
      {
        total_score: profile.total_score,
        risk_state: profile.risk_state,
        last_checked_at: profile.last_checked_at
      }
    ])
  );
  const resultsByListingId = new Map<string, AdminRiskQueueItemSummary['triggered_rules']>();

  (results || []).forEach((result) => {
    const current = resultsByListingId.get(result.listing_id) || [];
    current.push({
      rule_code: result.rule_code,
      severity: result.severity,
      score_delta: result.score_delta,
      action_type: result.action_type,
      message: result.message
    });
    resultsByListingId.set(result.listing_id, current);
  });

  return {
    queueItems: ((queueItems || []).map((item) => {
      const listing = listingById.get(item.listing_id);

      return {
        ...item,
        company_name: listing?.owner_company_id ? companyById.get(listing.owner_company_id) || null : null,
        listing_title: listing?.title || null,
        listing_slug: listing?.slug || null,
        publication_state: listing?.publication_state || null,
        risk_profile: profileByListingId.get(item.listing_id) || null,
        triggered_rules: resultsByListingId.get(item.listing_id) || []
      };
    })) as AdminRiskQueueItemSummary[]
  };
}
