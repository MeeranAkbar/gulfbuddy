import type {
  AdminRole,
  CampaignApprovalState,
  CampaignCreativeReviewState,
  CampaignCreativeType,
  CampaignStatus,
  CampaignType,
  CompanyRole,
  CompanyMemberInviteStatus,
  CompanyType,
  ComplianceState,
  EntitlementStatus,
  JobApplicationStatus,
  JobEmploymentType,
  JobExperienceLevel,
  JobWorkMode,
  LeadEventType,
  ListingPromotionPlacementType,
  ListingPromotionStatus,
  MonetizationState,
  ModerationQueuePriority,
  ModerationQueueStatus,
  PackageBillingModel,
  PackageOrderPaymentStatus,
  PackageProductType,
  PermissionCode,
  PropertyAdvertiserType,
  PropertyMarketMode,
  PropertyPermitSystem,
  PublicationState,
  RiskRuleActionType,
  RiskRuleSeverity,
  RiskState,
  Section,
  ServiceCoverageType,
  ServiceOrderStatus,
  ServicePricingModel,
  ServiceProviderType,
  ServiceQuoteStatus,
  ServiceRequestStatus,
  SellerType
} from './enums';

export interface UserRecord {
  id: string;
  authUserId: string;
  email: string | null;
  phone: string | null;
  status: 'active' | 'suspended' | 'invited';
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRecord {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  preferredLanguage: 'en' | 'ar';
  countryCode: string | null;
  city: string | null;
  bio: string | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
}

export interface CompanyRecord {
  id: string;
  companyType: CompanyType;
  legalName: string;
  displayName: string;
  slug: string;
  website?: string | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  trustTier: 'starter' | 'verified' | 'premium' | 'enterprise';
  billingStatus: 'inactive' | 'active' | 'past_due';
  publicProfileEnabled: boolean;
}

export interface CompanyMemberRecord {
  id: string;
  companyId: string;
  userId: string;
  role: CompanyRole;
  permissions: PermissionCode[];
  branchId: string | null;
  isPrimary: boolean;
  status: 'invited' | 'active' | 'disabled';
}

export interface CompanyMemberInviteRecord {
  id: string;
  companyId: string;
  email: string;
  role: CompanyRole;
  permissions: PermissionCode[];
  branchId: string | null;
  invitedByUserId: string;
  status: CompanyMemberInviteStatus;
  expiresAt: string;
  lastSentAt: string | null;
  acceptedAt: string | null;
  acceptedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyBranchRecord {
  id: string;
  companyId: string;
  name: string;
  emirate: string | null;
  area: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  managerUserId: string | null;
  isActive: boolean;
}

export interface ListingCoreRecord {
  id: string;
  section: Section;
  ownerUserId: string;
  ownerCompanyId: string | null;
  branchId: string | null;
  sellerType: SellerType;
  slug: string;
  title: string;
  description: string;
  emirate: string;
  area: string | null;
  areaSlug: string | null;
  locationText: string | null;
  lat: number | null;
  lng: number | null;
  priceAmount: number | null;
  priceCurrency: string;
  visibilityState: 'public' | 'unlisted' | 'private';
  publicationState: PublicationState;
  riskState: RiskState;
  monetizationState: MonetizationState;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  expiresAt: string | null;
}

export interface PropertyListingDetailsRecord {
  listingId: string;
  marketMode: PropertyMarketMode;
  purpose: 'sale' | 'rent';
  propertyType: string;
  propertySubtype: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqft: number | null;
  furnishing: 'furnished' | 'unfurnished' | 'semi_furnished' | null;
  completionStatus: 'ready' | 'off_plan' | 'under_construction' | null;
  buildingName: string | null;
  communityName: string | null;
  projectName: string | null;
  towerName: string | null;
  permitDisplayText: string | null;
  rentFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  isShortTerm: boolean;
  isProjectListing: boolean;
}

export interface PropertyComplianceRecord {
  listingId: string;
  regulatorRegion: 'dubai' | 'abu_dhabi' | 'other_uae';
  advertiserType: PropertyAdvertiserType;
  permitSystem: PropertyPermitSystem;
  permitNumber: string | null;
  permitQrPayload: string | null;
  permitIssueDate: string | null;
  permitExpiryDate: string | null;
  brokerCardNumber: string | null;
  agencyLicenseRef: string | null;
  developerLicenseRef: string | null;
  ownershipProofRef: string | null;
  holidayHomeOperatorRef: string | null;
  holidayHomeUnitRef: string | null;
  verificationStatus: ComplianceState;
  verificationMethod: 'manual' | 'api' | 'hybrid';
  manualReviewRequired: boolean;
  complianceNotes: string | null;
}

export interface PropertyComplianceDocumentRecord {
  id: string;
  listingId: string;
  documentType: string;
  documentLabel: string;
  storagePath: string | null;
  accessUrl: string | null;
  fileName: string | null;
  mimeType: string | null;
  uploadedByUserId: string;
  reviewState: 'pending' | 'accepted' | 'needs_more_info' | 'rejected';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyCompanyLinkRecord {
  listingId: string;
  agencyCompanyId: string | null;
  developerCompanyId: string | null;
  brokerUserId: string | null;
  branchId: string | null;
  sourceRelationshipType: 'agency_listing' | 'broker_listing' | 'developer_listing' | 'owner_listing';
}

export interface PropertyProjectRecord {
  id: string;
  developerCompanyId: string | null;
  name: string;
  slug: string;
  emirate: string;
  area: string | null;
  projectStatus: 'planned' | 'under_construction' | 'ready';
  handoverYear: number | null;
  description: string | null;
  coverImageUrl: string | null;
}

export interface MotorListingDetailsRecord {
  listingId: string;
  listingType: 'sale' | 'rent' | 'lease';
  vehicleType: string;
  make: string;
  model: string;
  trim: string | null;
  year: number;
  mileage: number | null;
  condition: 'new' | 'used' | 'certified';
  fuelType: string | null;
  transmission: string | null;
  drivetrain: string | null;
  bodyType: string | null;
  color: string | null;
}

export interface CandidateProfileRecord {
  userId: string;
  slug: string;
  headline: string | null;
  currentLocation: string | null;
  nationality: string | null;
  visaStatus: string | null;
  totalExperienceYears: number | null;
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  salaryCurrency: string | null;
  preferredEmirates: string[];
  preferredWorkModes: JobWorkMode[];
  summary: string | null;
  searchableByEmployers: boolean;
  profileVisibility: 'private' | 'employer_only' | 'public';
  profileStrengthScore: number;
}

export interface CandidateCvFileRecord {
  id: string;
  userId: string;
  storagePath: string;
  publicFilename: string;
  fileType: string;
  fileSize: number;
  parsingStatus: 'pending' | 'parsed' | 'failed';
  parsedText: string | null;
}

export interface CandidateExperienceRecord {
  id: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  location: string | null;
  description: string | null;
  sortOrder: number;
}

export interface CandidateEducationRecord {
  id: string;
  userId: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  grade: string | null;
  description: string | null;
  sortOrder: number;
}

export interface CandidateSkillRecord {
  id: string;
  userId: string;
  skillName: string;
  proficiencyLevel: string | null;
  yearsOfExperience: number | null;
}

export interface CandidateLanguageRecord {
  id: string;
  userId: string;
  languageName: string;
  proficiencyLevel: string | null;
}

export interface CandidateCertificationRecord {
  id: string;
  userId: string;
  certificationName: string;
  issuer: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  credentialUrl: string | null;
}

export interface JobListingDetailsRecord {
  listingId: string;
  jobTitle: string;
  employmentType: JobEmploymentType;
  workMode: JobWorkMode;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
  experienceLevel: JobExperienceLevel | null;
  industry: string | null;
  department: string | null;
  educationLevel: string | null;
  visaSupport: string | null;
  applicationMode: 'internal' | 'email' | 'external_url';
  applicationEmail: string | null;
  applicationUrl: string | null;
  openingsCount: number | null;
  urgentHiring: boolean;
  validThrough: string | null;
}

export interface JobRequirementRecord {
  id: string;
  listingId: string;
  requirementType: string;
  valueText: string;
  sortOrder: number;
}

export interface JobApplicationRecord {
  id: string;
  listingId: string;
  candidateUserId: string;
  candidateCvFileId: string | null;
  applicationStatus: JobApplicationStatus;
  source: string | null;
  appliedAt: string;
  recruiterNotes: string | null;
  lastUpdatedAt: string;
}

export interface JobSavedItemRecord {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface JobAlertRecord {
  id: string;
  userId: string;
  keywords: string | null;
  emirates: string[];
  categories: string[];
  salaryMin: number | null;
  workModes: JobWorkMode[];
  frequency: 'daily' | 'weekly' | 'instant';
  isActive: boolean;
}

export interface EmployerProfileRecord {
  companyId: string;
  hiringEmail: string | null;
  hiringPhone: string | null;
  publicCareersUrl: string | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  hiringStatus: 'open' | 'paused' | 'closed';
  responseTimeScore: number | null;
  profileStrengthScore: number;
}

export interface ServiceProviderProfileRecord {
  companyId: string;
  slug: string;
  providerType: ServiceProviderType;
  displayName: string;
  headline: string | null;
  bio: string | null;
  yearsInBusiness: number | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  trustTier: 'starter' | 'registered' | 'verified' | 'premium';
  responseTimeScore: number | null;
  profileStrengthScore: number;
  isAcceptingRequests: boolean;
  emergencyService: boolean;
}

export interface ServiceOfferingRecord {
  id: string;
  companyId: string;
  category: string;
  subcategory: string | null;
  serviceTitle: string;
  description: string | null;
  pricingModel: ServicePricingModel;
  basePrice: number | null;
  currency: string | null;
  pricingNotes: string | null;
  durationEstimate: string | null;
  isFeaturedOffering: boolean;
  isActive: boolean;
}

export interface ServiceAreaRecord {
  id: string;
  companyId: string;
  emirate: string;
  area: string | null;
  areaSlug: string | null;
  coverageType: ServiceCoverageType;
  radiusKm: number | null;
}

export interface ServicePortfolioItemRecord {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: string;
  sortOrder: number;
}

export interface ServiceRequestRecord {
  id: string;
  publicRef: string;
  customerUserId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  emirate: string;
  area: string | null;
  category: string;
  subcategory: string | null;
  requestTitle: string;
  requestDescription: string;
  preferredDate: string | null;
  preferredTime: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  requestStatus: ServiceRequestStatus;
  sourcePage: string | null;
}

export interface ServiceRequestProviderMatchRecord {
  id: string;
  requestId: string;
  companyId: string;
  matchSource: string;
  matchStatus: string;
}

export interface ServiceQuoteRecord {
  id: string;
  requestId: string;
  companyId: string;
  quotedByUserId: string | null;
  pricingModel: ServicePricingModel;
  quoteAmount: number | null;
  currency: string | null;
  estimatedDuration: string | null;
  message: string | null;
  quoteStatus: ServiceQuoteStatus;
  validUntil: string | null;
}

export interface ServiceOrderRecord {
  id: string;
  publicRef: string;
  requestId: string | null;
  quoteId: string | null;
  customerUserId: string | null;
  companyId: string;
  assignedStaffUserId: string | null;
  orderType: 'quote_conversion' | 'fixed_booking' | 'manual';
  orderStatus: ServiceOrderStatus;
  subtotalAmount: number | null;
  commissionAmount: number | null;
  totalAmount: number | null;
  currency: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface ServiceOrderStatusHistoryRecord {
  id: string;
  orderId: string;
  previousStatus: ServiceOrderStatus | null;
  newStatus: ServiceOrderStatus;
  actorType: string;
  actorId: string | null;
  notes: string | null;
}

export interface ServiceReviewRecord {
  id: string;
  orderId: string;
  customerUserId: string | null;
  companyId: string;
  rating: number;
  reviewText: string | null;
  reviewStatus: 'pending' | 'published' | 'hidden' | 'rejected';
}

export interface ServiceCommissionLedgerRecord {
  id: string;
  orderId: string;
  companyId: string;
  commissionType: 'percentage' | 'flat_fee' | 'promo';
  commissionRate: number | null;
  commissionAmount: number;
  currency: string;
  billingStatus: 'pending' | 'invoiced' | 'paid' | 'waived';
  payoutStatus: 'not_applicable' | 'pending' | 'scheduled' | 'paid';
}

export interface ServiceDisputeRecord {
  id: string;
  orderId: string;
  raisedByType: 'customer' | 'provider' | 'admin';
  raisedById: string | null;
  disputeReason: string;
  disputeStatus: 'open' | 'reviewing' | 'resolved' | 'closed';
  adminNotes: string | null;
}

export interface PackageCatalogRecord {
  id: string;
  code: string;
  name: string;
  section: Section | null;
  productType: PackageProductType;
  billingModel: PackageBillingModel;
  priceAmount: number;
  currency: string;
  durationDays: number | null;
  entitlementRules: Record<string, unknown>;
  active: boolean;
}

export interface PackageOrderRecord {
  id: string;
  buyerUserId: string | null;
  buyerCompanyId: string | null;
  packageId: string;
  amountPaid: number;
  currency: string;
  paymentStatus: PackageOrderPaymentStatus;
  paymentProvider: string | null;
  orderMetadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PackageEntitlementRecord {
  id: string;
  orderId: string;
  companyId: string | null;
  userId: string | null;
  section: Section | null;
  entitlementType: string;
  quantity: number;
  startAt: string;
  endAt: string | null;
  status: EntitlementStatus;
  rules: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ListingPromotionRecord {
  id: string;
  listingId: string;
  entitlementId: string;
  placementType: ListingPromotionPlacementType;
  priorityBucket: string | null;
  startAt: string;
  endAt: string | null;
  status: ListingPromotionStatus;
  adminOverride: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdSlotRecord {
  id: string;
  section: Section | null;
  pageType: string;
  slotCode: string;
  slotName: string;
  dimensions: string | null;
  mediaRules: Record<string, unknown>;
  maxCampaigns: number;
  active: boolean;
}

export interface CampaignRecord {
  id: string;
  ownerCompanyId: string | null;
  ownerUserId: string | null;
  packageOrderId: string | null;
  campaignType: CampaignType;
  targetUrl: string | null;
  startAt: string;
  endAt: string;
  status: CampaignStatus;
  approvalState: CampaignApprovalState;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignCreativeRecord {
  id: string;
  campaignId: string;
  storagePath: string | null;
  publicUrl: string | null;
  creativeType: CampaignCreativeType;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  checksum: string | null;
  reviewState: CampaignCreativeReviewState;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSlotAssignmentRecord {
  id: string;
  campaignId: string;
  slotId: string;
  startAt: string;
  endAt: string;
  status: 'scheduled' | 'active' | 'paused' | 'expired' | 'cancelled';
  rotationWeight: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUserContext {
  userId: string;
  email: string | null;
  companyIds: string[];
  adminRoles: AdminRole[];
  permissionsByCompany: Record<string, PermissionCode[]>;
}

export interface LeadEventRecord {
  id: string;
  section: Section;
  listingId: string | null;
  companyId: string | null;
  assignedUserId: string | null;
  visitorSessionId: string | null;
  visitorUserId: string | null;
  eventType: LeadEventType;
  sourcePage: string | null;
  sourceContext: string | null;
  campaignId: string | null;
  entitlementId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface RiskDetectionRuleRecord {
  id: string;
  section: Section;
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  isActive: boolean;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RiskDetectionResultRecord {
  id: string;
  listingId: string;
  section: Section;
  ruleCode: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  message: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface RiskProfileRecord {
  id: string;
  subjectType: 'listing' | 'user' | 'company' | 'broker' | 'provider' | 'dealer';
  subjectId: string;
  section: Section;
  totalScore: number;
  riskState: RiskState;
  lastCheckedAt: string;
  updatedAt: string;
}

export interface ModerationQueueRecord {
  id: string;
  listingId: string;
  section: Section;
  queueType: string;
  priority: ModerationQueuePriority;
  reasonCodes: string[];
  assignedTo: string | null;
  status: ModerationQueueStatus;
  createdAt: string;
  updatedAt: string;
}
