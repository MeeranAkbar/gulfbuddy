import { createSupabaseServerClient } from '../supabase/server';

export interface WorkspacePackageCatalogSummary {
  id: string;
  code: string;
  name: string;
  section: string | null;
  product_type: string;
  billing_model: string;
  price_amount: number;
  currency: string;
  duration_days: number | null;
  active: boolean;
}

export interface WorkspacePackageOrderSummary {
  id: string;
  buyer_company_id: string | null;
  buyer_user_id: string | null;
  package_id: string;
  amount_paid: number;
  currency: string;
  payment_status: string;
  created_at: string;
  package_name: string;
  package_code: string;
}

export interface WorkspacePackageEntitlementSummary {
  id: string;
  company_id: string | null;
  user_id: string | null;
  section: string | null;
  entitlement_type: string;
  quantity: number;
  start_at: string;
  end_at: string | null;
  status: string;
  package_name: string;
  package_code: string;
}

export interface WorkspaceCampaignSummary {
  id: string;
  owner_company_id: string | null;
  owner_user_id: string | null;
  package_order_id: string | null;
  campaign_type: string;
  target_url: string | null;
  start_at: string;
  end_at: string;
  status: string;
  approval_state: string;
  created_at: string;
  package_name: string | null;
  creatives_count: number;
  slot_assignment_count: number;
}

export interface WorkspaceAdSlotSummary {
  id: string;
  section: string | null;
  page_type: string;
  slot_code: string;
  slot_name: string;
  dimensions: string | null;
  max_campaigns: number;
  active: boolean;
  active_assignment_count: number;
}

export interface AdminPackageCatalogSummary extends WorkspacePackageCatalogSummary {
  order_count: number;
  active_entitlement_count: number;
}

export interface AdminCampaignSummary extends WorkspaceCampaignSummary {
  owner_company_name: string | null;
}

export async function getWorkspaceMonetizationSnapshot({
  companyIds,
  userId
}: {
  companyIds: string[];
  userId: string;
}) {
  const supabase = await createSupabaseServerClient();

  const [packageCatalogResponse, adSlotsResponse, ordersResponse, entitlementsResponse, campaignsResponse] = await Promise.all([
    supabase
      .schema('monetization')
      .from('package_catalog')
      .select('id,code,name,section,product_type,billing_model,price_amount,currency,duration_days,active')
      .eq('active', true)
      .order('section', { ascending: true })
      .order('price_amount', { ascending: true }),
    supabase
      .schema('monetization')
      .from('ad_slots')
      .select('id,section,page_type,slot_code,slot_name,dimensions,max_campaigns,active')
      .eq('active', true)
      .order('slot_code', { ascending: true }),
    supabase
      .schema('monetization')
      .from('package_orders')
      .select('id,buyer_company_id,buyer_user_id,package_id,amount_paid,currency,payment_status,created_at')
      .or(
        companyIds.length
          ? `buyer_user_id.eq.${userId},buyer_company_id.in.(${companyIds.join(',')})`
          : `buyer_user_id.eq.${userId}`
      )
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .schema('monetization')
      .from('package_entitlements')
      .select('id,company_id,user_id,section,entitlement_type,quantity,start_at,end_at,status,order_id')
      .or(
        companyIds.length
          ? `user_id.eq.${userId},company_id.in.(${companyIds.join(',')})`
          : `user_id.eq.${userId}`
      )
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .schema('monetization')
      .from('campaigns')
      .select('id,owner_company_id,owner_user_id,package_order_id,campaign_type,target_url,start_at,end_at,status,approval_state,created_at')
      .or(
        companyIds.length
          ? `owner_user_id.eq.${userId},owner_company_id.in.(${companyIds.join(',')})`
          : `owner_user_id.eq.${userId}`
      )
      .order('created_at', { ascending: false })
      .limit(20)
  ]);

  const packageCatalog = (packageCatalogResponse.data || []) as WorkspacePackageCatalogSummary[];
  const packageById = new Map(packageCatalog.map((item) => [item.id, item]));

  const orders = (ordersResponse.data || []) as Array<Omit<WorkspacePackageOrderSummary, 'package_name' | 'package_code'>>;
  const entitlementsBase = (entitlementsResponse.data || []) as Array<
    Omit<WorkspacePackageEntitlementSummary, 'package_name' | 'package_code'> & { order_id: string }
  >;
  const campaignsBase = (campaignsResponse.data || []) as Array<Omit<WorkspaceCampaignSummary, 'package_name' | 'creatives_count' | 'slot_assignment_count'>>;

  const orderById = new Map(orders.map((order) => [order.id, order]));
  const campaignIds = campaignsBase.map((campaign) => campaign.id);

  const [creativesResponse, slotAssignmentsResponse] = await Promise.all([
    campaignIds.length
      ? supabase.schema('monetization').from('campaign_creatives').select('id,campaign_id').in('campaign_id', campaignIds)
      : Promise.resolve({ data: [] as { id: string; campaign_id: string }[] }),
    campaignIds.length
      ? supabase
          .schema('monetization')
          .from('campaign_slot_assignments')
          .select('id,campaign_id,slot_id,status')
          .in('campaign_id', campaignIds)
      : Promise.resolve({ data: [] as { id: string; campaign_id: string; slot_id: string; status: string }[] })
  ]);

  const creativeCountByCampaignId = new Map<string, number>();
  (creativesResponse.data || []).forEach((creative) => {
    creativeCountByCampaignId.set(creative.campaign_id, (creativeCountByCampaignId.get(creative.campaign_id) || 0) + 1);
  });

  const slotAssignmentCountByCampaignId = new Map<string, number>();
  const activeAssignmentCountBySlotId = new Map<string, number>();

  (slotAssignmentsResponse.data || []).forEach((assignment) => {
    slotAssignmentCountByCampaignId.set(assignment.campaign_id, (slotAssignmentCountByCampaignId.get(assignment.campaign_id) || 0) + 1);
    if (assignment.status === 'active' || assignment.status === 'scheduled') {
      activeAssignmentCountBySlotId.set(assignment.slot_id, (activeAssignmentCountBySlotId.get(assignment.slot_id) || 0) + 1);
    }
  });

  return {
    packageCatalog,
    orders: orders.map((order) => ({
      ...order,
      package_name: packageById.get(order.package_id)?.name || 'Unknown package',
      package_code: packageById.get(order.package_id)?.code || 'unknown'
    })) as WorkspacePackageOrderSummary[],
    entitlements: entitlementsBase.map((entitlement) => ({
      ...entitlement,
      package_name: packageById.get(orderById.get(entitlement.order_id)?.package_id || '')?.name || 'Unknown package',
      package_code: packageById.get(orderById.get(entitlement.order_id)?.package_id || '')?.code || 'unknown'
    })) as WorkspacePackageEntitlementSummary[],
    campaigns: campaignsBase.map((campaign) => ({
      ...campaign,
      package_name: campaign.package_order_id ? packageById.get(orderById.get(campaign.package_order_id)?.package_id || '')?.name || null : null,
      creatives_count: creativeCountByCampaignId.get(campaign.id) || 0,
      slot_assignment_count: slotAssignmentCountByCampaignId.get(campaign.id) || 0
    })) as WorkspaceCampaignSummary[],
    adSlots: ((adSlotsResponse.data || []) as Omit<WorkspaceAdSlotSummary, 'active_assignment_count'>[]).map((slot) => ({
      ...slot,
      active_assignment_count: activeAssignmentCountBySlotId.get(slot.id) || 0
    })) as WorkspaceAdSlotSummary[]
  };
}

export async function getAdminMonetizationSnapshot() {
  const supabase = await createSupabaseServerClient();

  const [packageCatalogResponse, ordersResponse, entitlementsResponse, campaignsResponse, companiesResponse, adSlotsResponse, slotAssignmentsResponse] =
    await Promise.all([
      supabase
        .schema('monetization')
        .from('package_catalog')
        .select('id,code,name,section,product_type,billing_model,price_amount,currency,duration_days,active')
        .order('section', { ascending: true })
        .order('price_amount', { ascending: true }),
      supabase.schema('monetization').from('package_orders').select('id,package_id'),
      supabase.schema('monetization').from('package_entitlements').select('id,order_id,status'),
      supabase
        .schema('monetization')
        .from('campaigns')
        .select('id,owner_company_id,owner_user_id,package_order_id,campaign_type,target_url,start_at,end_at,status,approval_state,created_at')
        .order('created_at', { ascending: false })
        .limit(30),
      supabase.schema('company').from('companies').select('id,display_name'),
      supabase.schema('monetization').from('ad_slots').select('id,section,page_type,slot_code,slot_name,dimensions,max_campaigns,active'),
      supabase.schema('monetization').from('campaign_slot_assignments').select('id,campaign_id,slot_id,status')
    ]);

  const packageCatalog = (packageCatalogResponse.data || []) as WorkspacePackageCatalogSummary[];
  const orders = ordersResponse.data || [];
  const entitlements = entitlementsResponse.data || [];
  const orderCountByPackageId = new Map<string, number>();
  const activeEntitlementsByPackageId = new Map<string, number>();

  orders.forEach((order) => {
    orderCountByPackageId.set(order.package_id, (orderCountByPackageId.get(order.package_id) || 0) + 1);
  });

  const orderToPackageId = new Map(orders.map((order) => [order.id, order.package_id]));

  entitlements.forEach((entitlement) => {
    if (entitlement.status !== 'active' && entitlement.status !== 'scheduled') return;
    const packageId = orderToPackageId.get(entitlement.order_id);
    if (!packageId) return;
    activeEntitlementsByPackageId.set(packageId, (activeEntitlementsByPackageId.get(packageId) || 0) + 1);
  });

  const packageById = new Map(packageCatalog.map((item) => [item.id, item]));
  const companyById = new Map((companiesResponse.data || []).map((company) => [company.id, company.display_name]));

  const campaignIds = (campaignsResponse.data || []).map((campaign) => campaign.id);
  const creativesResponse = campaignIds.length
    ? await supabase.schema('monetization').from('campaign_creatives').select('id,campaign_id').in('campaign_id', campaignIds)
    : { data: [] as { id: string; campaign_id: string }[] };

  const creativeCountByCampaignId = new Map<string, number>();
  (creativesResponse.data || []).forEach((creative) => {
    creativeCountByCampaignId.set(creative.campaign_id, (creativeCountByCampaignId.get(creative.campaign_id) || 0) + 1);
  });

  const slotAssignmentCountByCampaignId = new Map<string, number>();
  const activeAssignmentCountBySlotId = new Map<string, number>();

  (slotAssignmentsResponse.data || []).forEach((assignment) => {
    slotAssignmentCountByCampaignId.set(assignment.campaign_id, (slotAssignmentCountByCampaignId.get(assignment.campaign_id) || 0) + 1);
    if (assignment.status === 'active' || assignment.status === 'scheduled') {
      activeAssignmentCountBySlotId.set(assignment.slot_id, (activeAssignmentCountBySlotId.get(assignment.slot_id) || 0) + 1);
    }
  });

  return {
    packageCatalog: packageCatalog.map((item) => ({
      ...item,
      order_count: orderCountByPackageId.get(item.id) || 0,
      active_entitlement_count: activeEntitlementsByPackageId.get(item.id) || 0
    })) as AdminPackageCatalogSummary[],
    campaigns: ((campaignsResponse.data || []) as Array<
      Omit<WorkspaceCampaignSummary, 'package_name' | 'creatives_count' | 'slot_assignment_count'> & { owner_company_id: string | null; package_order_id: string | null }
    >).map((campaign) => ({
      ...campaign,
      owner_company_name: campaign.owner_company_id ? companyById.get(campaign.owner_company_id) || null : null,
      package_name: campaign.package_order_id ? packageById.get(orderToPackageId.get(campaign.package_order_id) || '')?.name || null : null,
      creatives_count: creativeCountByCampaignId.get(campaign.id) || 0,
      slot_assignment_count: slotAssignmentCountByCampaignId.get(campaign.id) || 0
    })) as AdminCampaignSummary[],
    adSlots: ((adSlotsResponse.data || []) as Omit<WorkspaceAdSlotSummary, 'active_assignment_count'>[]).map((slot) => ({
      ...slot,
      active_assignment_count: activeAssignmentCountBySlotId.get(slot.id) || 0
    })) as WorkspaceAdSlotSummary[]
  };
}
