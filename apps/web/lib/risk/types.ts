import type { PublicationState, RiskState, Section } from '@gulfbuddy/types';

export type RiskRuleSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskRuleActionType = 'warning' | 'pending_review' | 'block';
export type ModerationQueuePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface RiskRuleConfig {
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  isActive: boolean;
  config: Record<string, unknown>;
}

export interface TriggeredRiskRule {
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  message: string;
  metadata: Record<string, unknown>;
}

export interface AutoCheckOutcome {
  listingId: string;
  section: Section;
  totalScore: number;
  riskState: RiskState;
  publicationState: PublicationState;
  blockingReasons: string[];
  warnings: string[];
  triggeredRules: TriggeredRiskRule[];
  queueType: string | null;
  queuePriority: ModerationQueuePriority | null;
  reasonCodes: string[];
}

export interface PropertyRiskContext {
  listing: {
    id: string;
    title: string;
    description: string;
    emirate: string;
    area: string | null;
    priceAmount: number | null;
    ownerUserId: string;
    ownerCompanyId: string | null;
    publicationState: string;
  };
  property: {
    marketMode: string;
    purpose: string;
    propertyType: string;
    buildingName: string | null;
    communityName: string | null;
    rentFrequency: string | null;
  } | null;
  compliance: {
    advertiserType: string;
    permitSystem: string;
    permitNumber: string | null;
    permitQrPayload: string | null;
    permitExpiryDate: string | null;
  } | null;
  company: {
    id: string;
    verificationStatus: string;
    trustTier: string;
  } | null;
  companyLink: {
    agencyCompanyId: string | null;
    developerCompanyId: string | null;
    brokerUserId: string | null;
  } | null;
  mediaCount: number;
  mediaChecksums: string[];
  complianceDocumentCount: number;
  rejectedListingCount: number;
  duplicateSignals: {
    samePermitCount: number;
    sameTitlePriceCount: number;
    reusedImageListingCount: number;
  };
}

export interface PropertyRiskRuleDefinition {
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  evaluate: (context: PropertyRiskContext, config: RiskRuleConfig) => TriggeredRiskRule | null;
}

export interface JobsRiskContext {
  listing: {
    id: string;
    title: string;
    description: string;
    emirate: string;
    ownerUserId: string;
    ownerCompanyId: string | null;
    publicationState: string;
  };
  job: {
    jobTitle: string;
    employmentType: string;
    workMode: string;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryPeriod: string | null;
    applicationMode: string;
    applicationEmail: string | null;
    applicationUrl: string | null;
    industry: string | null;
  } | null;
  company: {
    id: string;
    verificationStatus: string;
    trustTier: string;
  } | null;
  employerProfile: {
    verificationStatus: string;
    hiringStatus: string;
    profileStrengthScore: number;
  } | null;
  rejectedListingCount: number;
  activeJobCount: number;
  scamPhraseMatches: string[];
  duplicateSignals: {
    sameTitleCompanyCount: number;
    sameTitleDescriptionCount: number;
  };
}

export interface JobsRiskRuleDefinition {
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  evaluate: (context: JobsRiskContext, config: RiskRuleConfig) => TriggeredRiskRule | null;
}

export interface ServicesRiskContext {
  listing: {
    id: string;
    title: string;
    description: string;
    emirate: string;
    ownerUserId: string;
    ownerCompanyId: string | null;
    publicationState: string;
  };
  ownerProfile: {
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isIdentityVerified: boolean;
  } | null;
  company: {
    id: string;
    verificationStatus: string;
    trustTier: string;
    website: string | null;
  } | null;
  providerProfile: {
    verificationStatus: string;
    trustTier: string;
    displayName: string;
    bio: string | null;
  } | null;
  activeOfferingCount: number;
  serviceAreaCount: number;
  suspiciousLowOfferingCount: number;
  minimumBasePrice: number | null;
  duplicateSignals: {
    copiedBioCount: number;
    sameWebsiteCount: number;
  };
}

export interface ServicesRiskRuleDefinition {
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  evaluate: (context: ServicesRiskContext, config: RiskRuleConfig) => TriggeredRiskRule | null;
}

export interface MotorsRiskContext {
  listing: {
    id: string;
    title: string;
    description: string;
    emirate: string;
    ownerUserId: string;
    ownerCompanyId: string | null;
    sellerType: string;
    priceAmount: number | null;
    publicationState: string;
  };
  ownerProfile: {
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isIdentityVerified: boolean;
  } | null;
  company: {
    id: string;
    verificationStatus: string;
    trustTier: string;
    companyType: string;
  } | null;
  motor: {
    listingType: string;
    vehicleType: string;
    make: string;
    model: string;
    trim: string | null;
    year: number;
    mileage: number | null;
    condition: string;
    fuelType: string | null;
    transmission: string | null;
    bodyType: string | null;
  } | null;
  mediaCount: number;
  rejectedListingCount: number;
  activeListingCount: number;
  duplicateSignals: {
    sameTitlePriceCount: number;
    sameVehicleSignatureCount: number;
    reusedImageListingCount: number;
  };
}

export interface MotorsRiskRuleDefinition {
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  evaluate: (context: MotorsRiskContext, config: RiskRuleConfig) => TriggeredRiskRule | null;
}

export interface ClassifiedsRiskContext {
  listing: {
    id: string;
    title: string;
    description: string;
    emirate: string;
    ownerUserId: string;
    ownerCompanyId: string | null;
    priceAmount: number | null;
    publicationState: string;
  };
  ownerProfile: {
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isIdentityVerified: boolean;
  } | null;
  mediaCount: number;
  activeListingCount: number;
  prohibitedPhraseMatches: string[];
  duplicateSignals: {
    sameTitlePriceCount: number;
    reusedImageListingCount: number;
  };
}

export interface ClassifiedsRiskRuleDefinition {
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  evaluate: (context: ClassifiedsRiskContext, config: RiskRuleConfig) => TriggeredRiskRule | null;
}

export interface DirectoryRiskContext {
  listing: {
    id: string;
    title: string;
    description: string;
    emirate: string;
    area: string | null;
    ownerUserId: string;
    ownerCompanyId: string | null;
    publicationState: string;
  };
  company: {
    id: string;
    displayName: string;
    verificationStatus: string;
    publicProfileEnabled: boolean;
    website: string | null;
  } | null;
  contacts: {
    publicPhone: string | null;
    publicEmail: string | null;
    publicWhatsapp: string | null;
  } | null;
  duplicateSignals: {
    sameCompanyListingCount: number;
    sameTitleCount: number;
  };
}

export interface DirectoryRiskRuleDefinition {
  ruleCode: string;
  ruleName: string;
  severity: RiskRuleSeverity;
  scoreDelta: number;
  actionType: RiskRuleActionType;
  evaluate: (context: DirectoryRiskContext, config: RiskRuleConfig) => TriggeredRiskRule | null;
}
