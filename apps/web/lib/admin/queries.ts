import { getAdminComplianceSnapshot } from '../compliance/queries';
import { getAdminMonetizationSnapshot } from '../monetization/queries';
import { getPlatformReadinessSnapshot } from './platform-readiness';
import { getAdminRiskSnapshot } from '../risk/queries';
import { createSupabaseServerClient } from '../supabase/server';

export async function getAdminCommandCenterSnapshot() {
  const supabase = await createSupabaseServerClient();

  const [complianceSnapshot, riskSnapshot, monetizationSnapshot, platformReadiness, companiesResponse, listingsResponse] = await Promise.all([
    getAdminComplianceSnapshot(),
    getAdminRiskSnapshot(),
    getAdminMonetizationSnapshot(),
    getPlatformReadinessSnapshot(),
    supabase.schema('company').from('companies').select('id,verification_status,company_type,display_name').order('updated_at', { ascending: false }).limit(24),
    supabase.schema('listing').from('listing_core').select('id,section,publication_state')
  ]);

  const companies = companiesResponse.data || [];
  const listings = listingsResponse.data || [];

  const verifiedCompanies = companies.filter((company) => company.verification_status === 'verified').length;
  const pendingCompanies = companies.filter((company) => company.verification_status !== 'verified').length;
  const blockedRiskItems = riskSnapshot.queueItems.filter((item) => item.risk_profile?.risk_state === 'blocked').length;
  const urgentRiskItems = riskSnapshot.queueItems.filter((item) => item.priority === 'urgent').length;
  const pendingCampaigns = monetizationSnapshot.campaigns.filter(
    (campaign) => campaign.approval_state === 'pending' || campaign.approval_state === 'changes_requested'
  ).length;
  const activeCampaigns = monetizationSnapshot.campaigns.filter((campaign) => campaign.status === 'active' || campaign.status === 'scheduled').length;

  const listingCountsBySection = new Map<
    string,
    {
      total: number;
      published: number;
      review: number;
    }
  >();

  for (const listing of listings) {
    const current = listingCountsBySection.get(listing.section) || { total: 0, published: 0, review: 0 };
    current.total += 1;

    if (listing.publication_state === 'published' || listing.publication_state === 'approved') {
      current.published += 1;
    }

    if (
      listing.publication_state === 'submitted' ||
      listing.publication_state === 'flagged' ||
      listing.publication_state === 'pending_review'
    ) {
      current.review += 1;
    }

    listingCountsBySection.set(listing.section, current);
  }

  return {
    complianceSnapshot,
    riskSnapshot,
    monetizationSnapshot,
    platformReadiness,
    companyMetrics: {
      total: companies.length,
      verified: verifiedCompanies,
      pending: pendingCompanies
    },
    listingMetrics: Array.from(listingCountsBySection.entries()).map(([section, counts]) => ({
      section,
      ...counts
    })),
    queueMetrics: {
      complianceCases: complianceSnapshot.complianceCases.length,
      moderationCases: complianceSnapshot.moderationCases.length,
      riskQueue: riskSnapshot.queueItems.length,
      blockedRiskItems,
      urgentRiskItems,
      pendingCampaigns,
      activeCampaigns,
      liveSlots: monetizationSnapshot.adSlots.filter((slot) => slot.active_assignment_count > 0).length
    }
  };
}
