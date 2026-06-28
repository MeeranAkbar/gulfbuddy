import type { RiskRuleConfig } from './types';

export const RISK_SCORE_THRESHOLDS = {
  normalMax: 19,
  lowMax: 49,
  mediumMax: 79,
  highMax: 99
} as const;

export const PROPERTY_RISK_RULE_DEFAULTS: Record<string, RiskRuleConfig> = {
  property_missing_advertiser_identity: {
    ruleCode: 'property_missing_advertiser_identity',
    ruleName: 'Property advertiser identity missing',
    severity: 'high',
    scoreDelta: 60,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  property_missing_permit: {
    ruleCode: 'property_missing_permit',
    ruleName: 'Required property permit missing',
    severity: 'critical',
    scoreDelta: 100,
    actionType: 'block',
    isActive: true,
    config: {}
  },
  property_expired_permit: {
    ruleCode: 'property_expired_permit',
    ruleName: 'Property permit expired',
    severity: 'critical',
    scoreDelta: 100,
    actionType: 'block',
    isActive: true,
    config: {}
  },
  property_missing_permit_qr: {
    ruleCode: 'property_missing_permit_qr',
    ruleName: 'Property permit verification payload missing',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  property_incomplete_listing: {
    ruleCode: 'property_incomplete_listing',
    ruleName: 'Property listing missing key quality fields',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {
      minimumImageCount: 3
    }
  },
  property_low_image_count: {
    ruleCode: 'property_low_image_count',
    ruleName: 'Property listing has too few images',
    severity: 'low',
    scoreDelta: 10,
    actionType: 'warning',
    isActive: true,
    config: {
      minimumImageCount: 3
    }
  },
  property_suspicious_price: {
    ruleCode: 'property_suspicious_price',
    ruleName: 'Property pricing looks suspicious',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {
      saleFloor: 10000,
      yearlyRentFloor: 5000,
      monthlyRentFloor: 500,
      weeklyRentFloor: 100,
      dailyRentFloor: 50
    }
  },
  property_duplicate_listing: {
    ruleCode: 'property_duplicate_listing',
    ruleName: 'Property duplicate suspected',
    severity: 'high',
    scoreDelta: 80,
    actionType: 'block',
    isActive: true,
    config: {}
  },
  property_unverified_company: {
    ruleCode: 'property_unverified_company',
    ruleName: 'Property company is not verified',
    severity: 'low',
    scoreDelta: 20,
    actionType: 'warning',
    isActive: true,
    config: {}
  },
  property_repeat_rejections: {
    ruleCode: 'property_repeat_rejections',
    ruleName: 'Property poster has repeated rejected listings',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {
      recentWindowDays: 30,
      rejectionThreshold: 2
    }
  }
};

export const JOBS_RISK_RULE_DEFAULTS: Record<string, RiskRuleConfig> = {
  jobs_missing_employer_identity: {
    ruleCode: 'jobs_missing_employer_identity',
    ruleName: 'Employer identity missing',
    severity: 'high',
    scoreDelta: 60,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  jobs_incomplete_listing: {
    ruleCode: 'jobs_incomplete_listing',
    ruleName: 'Job listing missing key fields',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  jobs_suspicious_salary_bait: {
    ruleCode: 'jobs_suspicious_salary_bait',
    ruleName: 'Job salary looks suspicious',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {
      monthlySalaryFloor: 500
    }
  },
  jobs_suspicious_external_apply_link: {
    ruleCode: 'jobs_suspicious_external_apply_link',
    ruleName: 'External apply link looks suspicious',
    severity: 'high',
    scoreDelta: 60,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  jobs_scam_phrase_match: {
    ruleCode: 'jobs_scam_phrase_match',
    ruleName: 'Scam or payment-demand wording detected',
    severity: 'critical',
    scoreDelta: 100,
    actionType: 'block',
    isActive: true,
    config: {
      phrases: ['visa fee', 'processing fee', 'deposit required', 'pay to apply', 'registration fee']
    }
  },
  jobs_duplicate_listing: {
    ruleCode: 'jobs_duplicate_listing',
    ruleName: 'Duplicate job listing suspected',
    severity: 'high',
    scoreDelta: 80,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  jobs_unverified_employer_high_frequency: {
    ruleCode: 'jobs_unverified_employer_high_frequency',
    ruleName: 'Unverified employer posting at high frequency',
    severity: 'medium',
    scoreDelta: 50,
    actionType: 'pending_review',
    isActive: true,
    config: {
      activeJobThreshold: 3
    }
  }
};

export const SERVICES_RISK_RULE_DEFAULTS: Record<string, RiskRuleConfig> = {
  services_missing_provider_identity: {
    ruleCode: 'services_missing_provider_identity',
    ruleName: 'Service provider identity missing',
    severity: 'high',
    scoreDelta: 60,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  services_missing_service_coverage: {
    ruleCode: 'services_missing_service_coverage',
    ruleName: 'Provider service area missing',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  services_missing_offering: {
    ruleCode: 'services_missing_offering',
    ruleName: 'Provider has no active service offering',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  services_unverified_contact_identity: {
    ruleCode: 'services_unverified_contact_identity',
    ruleName: 'Provider contact identity is not verified',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  services_suspicious_pricing_bait: {
    ruleCode: 'services_suspicious_pricing_bait',
    ruleName: 'Service pricing looks suspicious',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {
      minimumBasePrice: 10
    }
  },
  services_copied_profile_text: {
    ruleCode: 'services_copied_profile_text',
    ruleName: 'Copied provider profile text suspected',
    severity: 'high',
    scoreDelta: 60,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  services_unverified_provider_high_activity: {
    ruleCode: 'services_unverified_provider_high_activity',
    ruleName: 'Unverified provider has unusually high activity',
    severity: 'low',
    scoreDelta: 20,
    actionType: 'warning',
    isActive: true,
    config: {
      activeOfferingThreshold: 4
    }
  }
};

export const MOTORS_RISK_RULE_DEFAULTS: Record<string, RiskRuleConfig> = {
  motors_missing_seller_identity: {
    ruleCode: 'motors_missing_seller_identity',
    ruleName: 'Motors seller identity missing',
    severity: 'high',
    scoreDelta: 60,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  motors_incomplete_vehicle_data: {
    ruleCode: 'motors_incomplete_vehicle_data',
    ruleName: 'Vehicle listing missing key fields',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {
      minimumImageCount: 3
    }
  },
  motors_fake_teaser_price: {
    ruleCode: 'motors_fake_teaser_price',
    ruleName: 'Vehicle pricing looks suspicious',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {
      minimumPrice: 1000
    }
  },
  motors_duplicate_listing: {
    ruleCode: 'motors_duplicate_listing',
    ruleName: 'Duplicate vehicle listing suspected',
    severity: 'high',
    scoreDelta: 80,
    actionType: 'block',
    isActive: true,
    config: {}
  },
  motors_suspicious_mileage_year: {
    ruleCode: 'motors_suspicious_mileage_year',
    ruleName: 'Vehicle mileage and year combination looks suspicious',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {
      futureYearTolerance: 1,
      highMileageForNewVehicle: 1000
    }
  },
  motors_unverified_seller_high_frequency: {
    ruleCode: 'motors_unverified_seller_high_frequency',
    ruleName: 'Unverified seller posting at high frequency',
    severity: 'medium',
    scoreDelta: 50,
    actionType: 'pending_review',
    isActive: true,
    config: {
      activeListingThreshold: 3
    }
  },
  motors_repeat_rejections: {
    ruleCode: 'motors_repeat_rejections',
    ruleName: 'Motors poster has repeated rejected listings',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {
      rejectionThreshold: 2
    }
  }
};

export const CLASSIFIEDS_RISK_RULE_DEFAULTS: Record<string, RiskRuleConfig> = {
  classifieds_incomplete_listing: {
    ruleCode: 'classifieds_incomplete_listing',
    ruleName: 'Classified listing missing key fields',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {
      minimumImageCount: 1
    }
  },
  classifieds_prohibited_phrase_match: {
    ruleCode: 'classifieds_prohibited_phrase_match',
    ruleName: 'Prohibited or spam wording detected',
    severity: 'critical',
    scoreDelta: 100,
    actionType: 'block',
    isActive: true,
    config: {
      phrases: ['telegram only', 'contact off platform', 'replica', 'copy brand', 'crypto only']
    }
  },
  classifieds_suspicious_low_price: {
    ruleCode: 'classifieds_suspicious_low_price',
    ruleName: 'Suspiciously low classifieds price',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {
      minimumPrice: 5
    }
  },
  classifieds_duplicate_listing: {
    ruleCode: 'classifieds_duplicate_listing',
    ruleName: 'Duplicate classifieds listing suspected',
    severity: 'high',
    scoreDelta: 80,
    actionType: 'block',
    isActive: true,
    config: {}
  },
  classifieds_new_account_high_frequency: {
    ruleCode: 'classifieds_new_account_high_frequency',
    ruleName: 'High-frequency posting from low-trust account',
    severity: 'medium',
    scoreDelta: 50,
    actionType: 'pending_review',
    isActive: true,
    config: {
      activeListingThreshold: 5
    }
  }
};

export const DIRECTORY_RISK_RULE_DEFAULTS: Record<string, RiskRuleConfig> = {
  directory_missing_business_identity: {
    ruleCode: 'directory_missing_business_identity',
    ruleName: 'Directory business identity missing',
    severity: 'high',
    scoreDelta: 60,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  directory_incomplete_profile: {
    ruleCode: 'directory_incomplete_profile',
    ruleName: 'Directory profile missing key fields',
    severity: 'medium',
    scoreDelta: 30,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  directory_missing_public_contact: {
    ruleCode: 'directory_missing_public_contact',
    ruleName: 'Directory profile missing public contact details',
    severity: 'medium',
    scoreDelta: 40,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  },
  directory_duplicate_business_profile: {
    ruleCode: 'directory_duplicate_business_profile',
    ruleName: 'Duplicate business profile suspected',
    severity: 'high',
    scoreDelta: 80,
    actionType: 'pending_review',
    isActive: true,
    config: {}
  }
};

export const RISK_QUEUE_BY_SECTION = {
  property: 'property_compliance',
  jobs: 'jobs_scam_review',
  services: 'services_provider_review',
  motors: 'motors_duplicate_review',
  classifieds: 'classifieds_spam_review',
  directory: 'directory_identity_review'
} as const;
