export const sections = ['property', 'motors', 'jobs', 'classifieds', 'services', 'directory'] as const;
export type Section = (typeof sections)[number];

export const publicationStates = ['draft', 'submitted', 'auto_checked', 'flagged', 'pending_review', 'approved', 'published', 'rejected', 'expired', 'suspended'] as const;
export type PublicationState = (typeof publicationStates)[number];

export const complianceStates = ['not_required', 'required_pending', 'under_review', 'verified', 'failed', 'expired'] as const;
export type ComplianceState = (typeof complianceStates)[number];

export const riskStates = ['normal', 'low', 'medium', 'high', 'blocked'] as const;
export type RiskState = (typeof riskStates)[number];

export const riskRuleSeverities = ['low', 'medium', 'high', 'critical'] as const;
export type RiskRuleSeverity = (typeof riskRuleSeverities)[number];

export const riskRuleActionTypes = ['warning', 'pending_review', 'block'] as const;
export type RiskRuleActionType = (typeof riskRuleActionTypes)[number];

export const moderationQueuePriorities = ['low', 'medium', 'high', 'urgent'] as const;
export type ModerationQueuePriority = (typeof moderationQueuePriorities)[number];

export const moderationQueueStatuses = ['open', 'in_review', 'resolved', 'dismissed'] as const;
export type ModerationQueueStatus = (typeof moderationQueueStatuses)[number];

export const monetizationStates = ['none', 'entitled', 'active', 'exhausted', 'expired'] as const;
export type MonetizationState = (typeof monetizationStates)[number];

export const packageProductTypes = ['listing_plan', 'listing_promotion', 'banner_campaign', 'seat_addon', 'branding'] as const;
export type PackageProductType = (typeof packageProductTypes)[number];

export const packageBillingModels = ['free', 'one_time', 'subscription', 'usage_based'] as const;
export type PackageBillingModel = (typeof packageBillingModels)[number];

export const packageOrderPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'cancelled'] as const;
export type PackageOrderPaymentStatus = (typeof packageOrderPaymentStatuses)[number];

export const entitlementStatuses = ['active', 'scheduled', 'paused', 'expired', 'cancelled', 'exhausted'] as const;
export type EntitlementStatus = (typeof entitlementStatuses)[number];

export const listingPromotionPlacementTypes = ['featured_listing', 'premium_listing', 'top_of_search', 'developer_launch', 'urgent_boost'] as const;
export type ListingPromotionPlacementType = (typeof listingPromotionPlacementTypes)[number];

export const listingPromotionStatuses = ['scheduled', 'active', 'paused', 'expired', 'cancelled'] as const;
export type ListingPromotionStatus = (typeof listingPromotionStatuses)[number];

export const campaignTypes = ['hero_banner', 'sidebar_banner', 'inline_banner', 'sponsored_stream', 'brand_takeover'] as const;
export type CampaignType = (typeof campaignTypes)[number];

export const campaignStatuses = ['draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'] as const;
export type CampaignStatus = (typeof campaignStatuses)[number];

export const campaignApprovalStates = ['pending', 'approved', 'rejected', 'changes_requested'] as const;
export type CampaignApprovalState = (typeof campaignApprovalStates)[number];

export const campaignCreativeTypes = ['image', 'gif', 'webp', 'html5'] as const;
export type CampaignCreativeType = (typeof campaignCreativeTypes)[number];

export const campaignCreativeReviewStates = ['pending', 'approved', 'rejected', 'changes_requested'] as const;
export type CampaignCreativeReviewState = (typeof campaignCreativeReviewStates)[number];

export const companyTypes = ['agency', 'dealer', 'developer', 'employer', 'service_provider', 'directory_business'] as const;
export type CompanyType = (typeof companyTypes)[number];

export const sellerTypes = ['individual', 'owner', 'agency', 'broker', 'dealer', 'developer', 'business'] as const;
export type SellerType = (typeof sellerTypes)[number];

export const propertyMarketModes = ['long_term', 'short_term', 'off_plan', 'new_project'] as const;
export type PropertyMarketMode = (typeof propertyMarketModes)[number];

export const propertyAdvertiserTypes = ['owner', 'agent', 'agency', 'developer', 'holiday_home_operator'] as const;
export type PropertyAdvertiserType = (typeof propertyAdvertiserTypes)[number];

export const propertyPermitSystems = ['trakheesi', 'dari', 'holiday_home', 'none'] as const;
export type PropertyPermitSystem = (typeof propertyPermitSystems)[number];

export const leadEventTypes = [
  'call_click',
  'whatsapp_click',
  'number_reveal',
  'inquiry_submit',
  'email_click',
  'company_profile_click',
  'premium_listing_click',
  'banner_click',
  'save_listing',
  'share_listing'
] as const;
export type LeadEventType = (typeof leadEventTypes)[number];

export const companyRoles = [
  'company_owner',
  'company_admin',
  'manager',
  'publisher',
  'analyst',
  'billing_admin',
  'viewer',
  'agency_owner',
  'agency_admin',
  'branch_manager',
  'broker',
  'listing_coordinator',
  'marketing_user',
  'dealer_owner',
  'dealer_admin',
  'inventory_manager',
  'sales_user'
] as const;
export type CompanyRole = (typeof companyRoles)[number];

export const adminRoles = ['moderator', 'compliance_officer', 'monetization_manager', 'support_agent', 'super_admin'] as const;
export type AdminRole = (typeof adminRoles)[number];

export const companyMemberInviteStatuses = ['pending', 'accepted', 'revoked', 'expired'] as const;
export type CompanyMemberInviteStatus = (typeof companyMemberInviteStatuses)[number];

export const permissionCodes = [
  'create_listing',
  'edit_own_listing',
  'edit_company_listing',
  'submit_for_review',
  'manage_company_users',
  'manage_company_profile',
  'manage_company_inventory',
  'manage_branch',
  'upload_creatives',
  'buy_package',
  'assign_leads',
  'view_company_reports',
  'export_reports',
  'manage_campaigns',
  'manage_billing',
  'view_compliance_status'
] as const;
export type PermissionCode = (typeof permissionCodes)[number];

export const jobApplicationStatuses = [
  'submitted',
  'in_review',
  'shortlisted',
  'contacted',
  'interviewing',
  'offered',
  'hired',
  'rejected',
  'withdrawn'
] as const;
export type JobApplicationStatus = (typeof jobApplicationStatuses)[number];

export const jobEmploymentTypes = ['full_time', 'part_time', 'contract', 'temporary', 'internship', 'freelance'] as const;
export type JobEmploymentType = (typeof jobEmploymentTypes)[number];

export const jobWorkModes = ['on_site', 'hybrid', 'remote'] as const;
export type JobWorkMode = (typeof jobWorkModes)[number];

export const jobExperienceLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive'] as const;
export type JobExperienceLevel = (typeof jobExperienceLevels)[number];

export const servicePricingModels = ['quote_based', 'fixed_price', 'hourly', 'package', 'emergency'] as const;
export type ServicePricingModel = (typeof servicePricingModels)[number];

export const serviceRequestStatuses = ['submitted', 'matched', 'quoted', 'customer_reviewing', 'accepted', 'expired', 'cancelled', 'converted_to_order'] as const;
export type ServiceRequestStatus = (typeof serviceRequestStatuses)[number];

export const serviceQuoteStatuses = ['sent', 'viewed', 'accepted', 'declined', 'expired', 'withdrawn'] as const;
export type ServiceQuoteStatus = (typeof serviceQuoteStatuses)[number];

export const serviceOrderStatuses = ['created', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled', 'disputed', 'refunded_later'] as const;
export type ServiceOrderStatus = (typeof serviceOrderStatuses)[number];

export const serviceProviderTypes = ['individual_provider', 'business_provider', 'branch_company', 'premium_provider'] as const;
export type ServiceProviderType = (typeof serviceProviderTypes)[number];

export const serviceCoverageTypes = ['fixed_area', 'radius', 'emirate_wide', 'remote_only'] as const;
export type ServiceCoverageType = (typeof serviceCoverageTypes)[number];
