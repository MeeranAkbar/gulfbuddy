import { createSupabaseServerClient } from '../supabase/server';

export interface WorkspacePropertyDraftSummary {
  id: string;
  title: string;
  slug: string;
  publication_state: string;
  risk_state: string;
  updated_at: string;
  emirate: string;
  area: string | null;
  price_amount: number | null;
  owner_company_id: string | null;
  property: {
    market_mode: string;
    purpose: string;
    property_type: string;
    bedrooms: number | null;
  } | null;
  compliance: {
    verification_status: string;
    permit_system: string;
    permit_number: string | null;
  } | null;
  complianceDocuments: {
    id: string;
    document_type: string;
    document_label: string;
    access_url: string | null;
    review_state: string;
  }[];
  riskProfile: {
    total_score: number;
    risk_state: string;
    last_checked_at: string;
  } | null;
}

export async function getWorkspacePropertyDrafts({
  companyIds,
  userId
}: {
  companyIds: string[];
  userId: string;
}) {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .schema('listing')
    .from('listing_core')
    .select('id,title,slug,publication_state,risk_state,updated_at,emirate,area,price_amount,owner_company_id')
    .eq('section', 'property')
    .order('updated_at', { ascending: false })
    .limit(12);

  if (companyIds.length) {
    query = query.in('owner_company_id', companyIds);
  } else {
    query = query.eq('owner_user_id', userId);
  }

  const { data: listings } = await query;
  const listingIds = (listings || []).map((listing) => listing.id);

  if (!listingIds.length) {
    return [] satisfies WorkspacePropertyDraftSummary[];
  }

  const { data: propertyDetails } = await supabase
    .schema('property')
    .from('property_listing_details')
    .select('listing_id,market_mode,purpose,property_type,bedrooms')
    .in('listing_id', listingIds);

  const { data: complianceDetails } = await supabase
    .schema('property')
    .from('property_compliance')
    .select('listing_id,verification_status,permit_system,permit_number')
    .in('listing_id', listingIds);

  const { data: complianceDocuments } = await supabase
    .schema('property')
    .from('property_compliance_documents')
    .select('id,listing_id,document_type,document_label,access_url,review_state,created_at')
    .in('listing_id', listingIds)
    .order('created_at', { ascending: false });

  const { data: riskProfiles } = await supabase
    .schema('risk')
    .from('risk_profiles')
    .select('subject_id,total_score,risk_state,last_checked_at')
    .eq('subject_type', 'listing')
    .in('subject_id', listingIds);

  const propertyByListingId = new Map(
    (propertyDetails || []).map((detail) => [
      detail.listing_id,
      {
        market_mode: detail.market_mode,
        purpose: detail.purpose,
        property_type: detail.property_type,
        bedrooms: detail.bedrooms
      }
    ])
  );

  const complianceByListingId = new Map(
    (complianceDetails || []).map((detail) => [
      detail.listing_id,
      {
        verification_status: detail.verification_status,
        permit_system: detail.permit_system,
        permit_number: detail.permit_number
      }
    ])
  );

  const complianceDocumentsByListingId = new Map<string, WorkspacePropertyDraftSummary['complianceDocuments']>();
  const riskProfileByListingId = new Map(
    (riskProfiles || []).map((profile) => [
      profile.subject_id,
      {
        total_score: profile.total_score,
        risk_state: profile.risk_state,
        last_checked_at: profile.last_checked_at
      }
    ])
  );

  (complianceDocuments || []).forEach((document) => {
    const current = complianceDocumentsByListingId.get(document.listing_id) || [];
    current.push({
      id: document.id,
      document_type: document.document_type,
      document_label: document.document_label,
      access_url: document.access_url,
      review_state: document.review_state
    });
    complianceDocumentsByListingId.set(document.listing_id, current);
  });

  return (listings || []).map((listing) => ({
    ...listing,
    property: propertyByListingId.get(listing.id) || null,
    compliance: complianceByListingId.get(listing.id) || null,
    complianceDocuments: complianceDocumentsByListingId.get(listing.id) || [],
    riskProfile: riskProfileByListingId.get(listing.id) || null
  })) as WorkspacePropertyDraftSummary[];
}
