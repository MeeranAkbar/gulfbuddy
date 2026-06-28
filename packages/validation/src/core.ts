import { z } from 'zod';
import {
  companyRoles,
  companyMemberInviteStatuses,
  companyTypes,
  jobApplicationStatuses,
  jobEmploymentTypes,
  jobExperienceLevels,
  jobWorkModes,
  leadEventTypes,
  packageBillingModels,
  packageOrderPaymentStatuses,
  packageProductTypes,
  monetizationStates,
  propertyAdvertiserTypes,
  propertyMarketModes,
  propertyPermitSystems,
  publicationStates,
  riskStates,
  sections,
  entitlementStatuses,
  listingPromotionPlacementTypes,
  listingPromotionStatuses,
  campaignTypes,
  campaignStatuses,
  campaignApprovalStates,
  campaignCreativeTypes,
  campaignCreativeReviewStates,
  serviceCoverageTypes,
  serviceOrderStatuses,
  servicePricingModels,
  serviceProviderTypes,
  serviceQuoteStatuses,
  serviceRequestStatuses,
  sellerTypes
} from '@gulfbuddy/types';

export const companySchema = z.object({
  companyType: z.enum(companyTypes),
  legalName: z.string().min(2).max(160),
  displayName: z.string().min(2).max(120),
  slug: z.string().min(3).max(160).regex(/^[a-z0-9-]+$/),
  website: z.string().url().nullable().optional(),
  licenseNumber: z.string().min(3).max(120).optional(),
  publicProfileEnabled: z.boolean().default(false)
});

export const companyMemberSchema = z.object({
  companyId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(companyRoles),
  permissions: z.array(z.string()).default([]),
  branchId: z.string().uuid().nullable().optional()
});

export const companyMemberAssignmentSchema = z.object({
  companyId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(companyRoles),
  branchId: z.string().uuid().nullable().optional()
});

export const companyMemberInviteSchema = z.object({
  companyId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(companyRoles),
  branchId: z.string().uuid().nullable().optional()
});

export const companyMemberInviteAcceptanceSchema = z.object({
  token: z.string().min(20),
  expectedStatus: z.enum(companyMemberInviteStatuses).optional()
});

export const companyBranchSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(2).max(120),
  emirate: z.string().max(80).nullable().optional(),
  area: z.string().max(120).nullable().optional(),
  address: z.string().max(240).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  email: z.string().email().nullable().optional(),
  managerUserId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().default(true)
});

export const companyOnboardingSchema = z.object({
  company: companySchema,
  primaryRole: z.enum(companyRoles),
  branch: companyBranchSchema.omit({ companyId: true }).optional(),
  publicProfileSummary: z.string().max(2000).nullable().optional()
});

export const listingCoreSchema = z.object({
  section: z.enum(sections),
  ownerUserId: z.string().uuid(),
  ownerCompanyId: z.string().uuid().nullable().optional(),
  branchId: z.string().uuid().nullable().optional(),
  sellerType: z.enum(sellerTypes),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9-]+$/),
  title: z.string().min(5).max(180),
  description: z.string().min(20).max(12000),
  emirate: z.string().min(2).max(60),
  area: z.string().max(120).nullable().optional(),
  areaSlug: z.string().max(160).nullable().optional(),
  locationText: z.string().max(240).nullable().optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  priceAmount: z.number().nonnegative().nullable().optional(),
  priceCurrency: z.string().length(3).default('AED'),
  publicationState: z.enum(publicationStates).default('draft'),
  riskState: z.enum(riskStates).default('normal'),
  monetizationState: z.enum(monetizationStates).default('none')
});

export const propertyPostingSchema = listingCoreSchema.extend({
  section: z.literal('property'),
  property: z.object({
    marketMode: z.enum(propertyMarketModes),
    purpose: z.enum(['sale', 'rent']),
    propertyType: z.string().min(2).max(80),
    propertySubtype: z.string().max(80).nullable().optional(),
    bedrooms: z.number().int().min(0).max(30).nullable().optional(),
    bathrooms: z.number().int().min(0).max(30).nullable().optional(),
    sizeSqft: z.number().positive().nullable().optional(),
    furnishing: z.enum(['furnished', 'unfurnished', 'semi_furnished']).nullable().optional(),
    completionStatus: z.enum(['ready', 'off_plan', 'under_construction']).nullable().optional(),
    rentFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable().optional(),
    buildingName: z.string().max(120).nullable().optional(),
    communityName: z.string().max(120).nullable().optional(),
    projectName: z.string().max(120).nullable().optional(),
    towerName: z.string().max(120).nullable().optional(),
    permitDisplayText: z.string().max(120).nullable().optional(),
    isShortTerm: z.boolean().default(false),
    isProjectListing: z.boolean().default(false)
  }),
  compliance: z.object({
    regulatorRegion: z.enum(['dubai', 'abu_dhabi', 'other_uae']),
    advertiserType: z.enum(propertyAdvertiserTypes),
    permitSystem: z.enum(propertyPermitSystems),
    permitNumber: z.string().max(120).nullable().optional(),
    permitQrPayload: z.string().max(500).nullable().optional(),
    manualReviewRequired: z.boolean().default(true)
  })
});

export const propertyCompanyLinkSchema = z.object({
  listingId: z.string().uuid(),
  agencyCompanyId: z.string().uuid().nullable().optional(),
  developerCompanyId: z.string().uuid().nullable().optional(),
  brokerUserId: z.string().uuid().nullable().optional(),
  branchId: z.string().uuid().nullable().optional(),
  sourceRelationshipType: z.enum(['agency_listing', 'broker_listing', 'developer_listing', 'owner_listing'])
});

export const propertyComplianceDocumentSchema = z.object({
  listingId: z.string().uuid(),
  documentType: z.string().min(2).max(80),
  documentLabel: z.string().min(2).max(160),
  accessUrl: z.string().url().nullable().optional(),
  storagePath: z.string().max(500).nullable().optional(),
  fileName: z.string().max(240).nullable().optional(),
  mimeType: z.string().max(120).nullable().optional(),
  notes: z.string().max(2000).nullable().optional()
}).refine((value) => Boolean(value.accessUrl || value.storagePath), {
  message: 'Add a document URL or storage path.',
  path: ['accessUrl']
});

export const propertyProjectSchema = z.object({
  developerCompanyId: z.string().uuid().nullable().optional(),
  name: z.string().min(2).max(160),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9-]+$/),
  emirate: z.string().min(2).max(80),
  area: z.string().max(120).nullable().optional(),
  projectStatus: z.enum(['planned', 'under_construction', 'ready']),
  handoverYear: z.number().int().min(2000).max(2100).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional()
});

export const motorPostingSchema = listingCoreSchema.extend({
  section: z.literal('motors'),
  motor: z.object({
    listingType: z.enum(['sale', 'rent', 'lease']),
    vehicleType: z.string().min(2).max(80),
    make: z.string().min(2).max(80),
    model: z.string().min(1).max(80),
    trim: z.string().max(80).nullable().optional(),
    year: z.number().int().min(1950).max(2100),
    mileage: z.number().int().min(0).nullable().optional(),
    condition: z.enum(['new', 'used', 'certified']),
    fuelType: z.string().max(40).nullable().optional(),
    transmission: z.string().max(40).nullable().optional()
  })
});

export const candidateProfileSchema = z.object({
  headline: z.string().max(120).nullable().optional(),
  currentLocation: z.string().max(120).nullable().optional(),
  nationality: z.string().max(80).nullable().optional(),
  visaStatus: z.string().max(80).nullable().optional(),
  totalExperienceYears: z.number().min(0).max(60).nullable().optional(),
  expectedSalaryMin: z.number().nonnegative().nullable().optional(),
  expectedSalaryMax: z.number().nonnegative().nullable().optional(),
  salaryCurrency: z.string().length(3).nullable().optional(),
  preferredEmirates: z.array(z.string()).default([]),
  preferredWorkModes: z.array(z.enum(jobWorkModes)).default([]),
  summary: z.string().max(4000).nullable().optional(),
  searchableByEmployers: z.boolean().default(false),
  profileVisibility: z.enum(['private', 'employer_only', 'public']).default('private'),
  profileStrengthScore: z.number().min(0).max(100).default(0)
});

export const jobPostingSchema = listingCoreSchema.extend({
  section: z.literal('jobs'),
  job: z.object({
    jobTitle: z.string().min(3).max(160),
    employmentType: z.enum(jobEmploymentTypes),
    workMode: z.enum(jobWorkModes),
    salaryMin: z.number().nonnegative().nullable().optional(),
    salaryMax: z.number().nonnegative().nullable().optional(),
    salaryCurrency: z.string().length(3).nullable().optional(),
    salaryPeriod: z.string().max(40).nullable().optional(),
    experienceLevel: z.enum(jobExperienceLevels).nullable().optional(),
    industry: z.string().max(120).nullable().optional(),
    department: z.string().max(120).nullable().optional(),
    educationLevel: z.string().max(120).nullable().optional(),
    visaSupport: z.string().max(120).nullable().optional(),
    applicationMode: z.enum(['internal', 'email', 'external_url']),
    applicationEmail: z.string().email().nullable().optional(),
    applicationUrl: z.string().url().nullable().optional(),
    openingsCount: z.number().int().min(1).max(999).nullable().optional(),
    urgentHiring: z.boolean().default(false),
    validThrough: z.string().datetime().nullable().optional()
  }),
  requirements: z
    .array(
      z.object({
        requirementType: z.string().min(2).max(80),
        valueText: z.string().min(1).max(300),
        sortOrder: z.number().int().min(0).default(0)
      })
    )
    .default([])
});

export const employerProfileSchema = z.object({
  hiringEmail: z.string().email().nullable().optional(),
  hiringPhone: z.string().max(40).nullable().optional(),
  publicCareersUrl: z.string().url().nullable().optional(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  hiringStatus: z.enum(['open', 'paused', 'closed']).default('open'),
  responseTimeScore: z.number().min(0).max(100).nullable().optional(),
  profileStrengthScore: z.number().min(0).max(100).default(0)
});

export const jobApplicationSchema = z.object({
  listingId: z.string().uuid(),
  candidateUserId: z.string().uuid(),
  candidateCvFileId: z.string().uuid().nullable().optional(),
  applicationStatus: z.enum(jobApplicationStatuses).default('submitted'),
  source: z.string().max(120).nullable().optional(),
  coverNote: z.string().max(3000).nullable().optional()
});

export const jobAlertSchema = z.object({
  keywords: z.string().max(160).nullable().optional(),
  emirates: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  salaryMin: z.number().nonnegative().nullable().optional(),
  workModes: z.array(z.enum(jobWorkModes)).default([]),
  frequency: z.enum(['daily', 'weekly', 'instant']).default('weekly'),
  isActive: z.boolean().default(true)
});

export const serviceProviderProfileSchema = z.object({
  slug: z.string().min(3).max(180).regex(/^[a-z0-9-]+$/),
  providerType: z.enum(serviceProviderTypes),
  displayName: z.string().min(2).max(160),
  headline: z.string().max(160).nullable().optional(),
  bio: z.string().max(5000).nullable().optional(),
  yearsInBusiness: z.number().int().min(0).max(100).nullable().optional(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  trustTier: z.enum(['starter', 'registered', 'verified', 'premium']).default('starter'),
  responseTimeScore: z.number().min(0).max(100).nullable().optional(),
  profileStrengthScore: z.number().min(0).max(100).default(0),
  isAcceptingRequests: z.boolean().default(true),
  emergencyService: z.boolean().default(false)
});

export const serviceOfferingSchema = z.object({
  companyId: z.string().uuid(),
  category: z.string().min(2).max(120),
  subcategory: z.string().max(120).nullable().optional(),
  serviceTitle: z.string().min(3).max(180),
  description: z.string().max(4000).nullable().optional(),
  pricingModel: z.enum(servicePricingModels),
  basePrice: z.number().nonnegative().nullable().optional(),
  currency: z.string().length(3).nullable().optional(),
  pricingNotes: z.string().max(500).nullable().optional(),
  durationEstimate: z.string().max(120).nullable().optional(),
  isFeaturedOffering: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const serviceAreaSchema = z.object({
  companyId: z.string().uuid(),
  emirate: z.string().min(2).max(80),
  area: z.string().max(120).nullable().optional(),
  areaSlug: z.string().max(160).nullable().optional(),
  coverageType: z.enum(serviceCoverageTypes),
  radiusKm: z.number().nonnegative().nullable().optional()
});

export const serviceRequestSchema = z.object({
  customerUserId: z.string().uuid().nullable().optional(),
  customerName: z.string().max(120).nullable().optional(),
  customerPhone: z.string().max(40).nullable().optional(),
  customerEmail: z.string().email().nullable().optional(),
  emirate: z.string().min(2).max(80),
  area: z.string().max(120).nullable().optional(),
  category: z.string().min(2).max(120),
  subcategory: z.string().max(120).nullable().optional(),
  requestTitle: z.string().min(3).max(180),
  requestDescription: z.string().min(10).max(5000),
  preferredDate: z.string().date().nullable().optional(),
  preferredTime: z.string().max(60).nullable().optional(),
  budgetMin: z.number().nonnegative().nullable().optional(),
  budgetMax: z.number().nonnegative().nullable().optional(),
  requestStatus: z.enum(serviceRequestStatuses).default('submitted'),
  sourcePage: z.string().max(300).nullable().optional()
});

export const serviceQuoteSchema = z.object({
  requestId: z.string().uuid(),
  companyId: z.string().uuid(),
  quotedByUserId: z.string().uuid().nullable().optional(),
  pricingModel: z.enum(servicePricingModels),
  quoteAmount: z.number().nonnegative().nullable().optional(),
  currency: z.string().length(3).nullable().optional(),
  estimatedDuration: z.string().max(120).nullable().optional(),
  message: z.string().max(4000).nullable().optional(),
  quoteStatus: z.enum(serviceQuoteStatuses).default('sent'),
  validUntil: z.string().datetime().nullable().optional()
});

export const serviceOrderSchema = z.object({
  requestId: z.string().uuid().nullable().optional(),
  quoteId: z.string().uuid().nullable().optional(),
  customerUserId: z.string().uuid().nullable().optional(),
  companyId: z.string().uuid(),
  assignedStaffUserId: z.string().uuid().nullable().optional(),
  orderType: z.enum(['quote_conversion', 'fixed_booking', 'manual']),
  orderStatus: z.enum(serviceOrderStatuses).default('created'),
  subtotalAmount: z.number().nonnegative().nullable().optional(),
  commissionAmount: z.number().nonnegative().nullable().optional(),
  totalAmount: z.number().nonnegative().nullable().optional(),
  currency: z.string().length(3).nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional()
});

export const packageCatalogSchema = z.object({
  code: z.string().min(2).max(120),
  name: z.string().min(2).max(160),
  section: z.enum(sections).nullable().optional(),
  productType: z.enum(packageProductTypes),
  billingModel: z.enum(packageBillingModels),
  priceAmount: z.number().nonnegative(),
  currency: z.string().length(3).default('AED'),
  durationDays: z.number().int().min(1).nullable().optional(),
  entitlementRules: z.record(z.string(), z.unknown()).default({}),
  active: z.boolean().default(true)
});

export const packageOrderSchema = z.object({
  buyerUserId: z.string().uuid().nullable().optional(),
  buyerCompanyId: z.string().uuid().nullable().optional(),
  packageId: z.string().uuid(),
  amountPaid: z.number().nonnegative(),
  currency: z.string().length(3).default('AED'),
  paymentStatus: z.enum(packageOrderPaymentStatuses).default('pending'),
  paymentProvider: z.string().max(120).nullable().optional(),
  orderMetadata: z.record(z.string(), z.unknown()).default({})
});

export const packageEntitlementSchema = z.object({
  orderId: z.string().uuid(),
  companyId: z.string().uuid().nullable().optional(),
  userId: z.string().uuid().nullable().optional(),
  section: z.enum(sections).nullable().optional(),
  entitlementType: z.string().min(2).max(120),
  quantity: z.number().int().min(1).default(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().nullable().optional(),
  status: z.enum(entitlementStatuses).default('active'),
  rules: z.record(z.string(), z.unknown()).default({})
});

export const listingPromotionSchema = z.object({
  listingId: z.string().uuid(),
  entitlementId: z.string().uuid(),
  placementType: z.enum(listingPromotionPlacementTypes),
  priorityBucket: z.string().max(120).nullable().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().nullable().optional(),
  status: z.enum(listingPromotionStatuses).default('scheduled'),
  adminOverride: z.boolean().default(false)
});

export const campaignSchema = z.object({
  ownerCompanyId: z.string().uuid().nullable().optional(),
  ownerUserId: z.string().uuid().nullable().optional(),
  packageOrderId: z.string().uuid().nullable().optional(),
  campaignType: z.enum(campaignTypes),
  targetUrl: z.string().url().nullable().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  status: z.enum(campaignStatuses).default('draft'),
  approvalState: z.enum(campaignApprovalStates).default('pending')
});

export const campaignCreativeSchema = z.object({
  campaignId: z.string().uuid(),
  storagePath: z.string().max(500).nullable().optional(),
  publicUrl: z.string().url().nullable().optional(),
  creativeType: z.enum(campaignCreativeTypes),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  fileSize: z.number().int().nonnegative().nullable().optional(),
  checksum: z.string().max(255).nullable().optional(),
  reviewState: z.enum(campaignCreativeReviewStates).default('pending')
}).refine((value) => Boolean(value.storagePath || value.publicUrl), {
  message: 'Add a public URL or storage path for the creative.',
  path: ['publicUrl']
});

export const campaignSlotAssignmentSchema = z.object({
  campaignId: z.string().uuid(),
  slotId: z.string().uuid(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  status: z.enum(['scheduled', 'active', 'paused', 'expired', 'cancelled']).default('scheduled'),
  rotationWeight: z.number().int().min(1).max(100).default(1)
});

export const leadEventSchema = z.object({
  section: z.enum(sections),
  listingId: z.string().uuid().nullable().optional(),
  companyId: z.string().uuid().nullable().optional(),
  assignedUserId: z.string().uuid().nullable().optional(),
  visitorSessionId: z.string().max(120).nullable().optional(),
  visitorUserId: z.string().uuid().nullable().optional(),
  eventType: z.enum(leadEventTypes),
  sourcePage: z.string().max(300).nullable().optional(),
  sourceContext: z.string().max(120).nullable().optional(),
  campaignId: z.string().uuid().nullable().optional(),
  entitlementId: z.string().uuid().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({})
});
