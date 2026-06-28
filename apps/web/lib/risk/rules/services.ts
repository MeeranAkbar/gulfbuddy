import { SERVICES_RISK_RULE_DEFAULTS } from '../constants';
import type { RiskRuleConfig, ServicesRiskContext, ServicesRiskRuleDefinition, TriggeredRiskRule } from '../types';

function mergeRuleConfig(ruleCode: keyof typeof SERVICES_RISK_RULE_DEFAULTS, config: Partial<RiskRuleConfig> | null | undefined): RiskRuleConfig {
  const fallback = SERVICES_RISK_RULE_DEFAULTS[ruleCode];

  return {
    ...fallback,
    ...config,
    config: {
      ...fallback.config,
      ...(config?.config || {})
    }
  };
}

function createTriggeredRule(config: RiskRuleConfig, message: string, metadata: Record<string, unknown> = {}): TriggeredRiskRule {
  return {
    ruleCode: config.ruleCode,
    ruleName: config.ruleName,
    severity: config.severity,
    scoreDelta: config.scoreDelta,
    actionType: config.actionType,
    message,
    metadata
  };
}

function getNumberConfig(config: RiskRuleConfig, key: string, fallback: number) {
  const raw = config.config[key];
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback;
}

function hasValue(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

export async function loadServicesRiskContext(
  supabase: Awaited<ReturnType<typeof import('../../supabase/server').createSupabaseServerClient>>,
  listingId: string
): Promise<ServicesRiskContext> {
  const { data: listing } = await supabase
    .schema('listing')
    .from('listing_core')
    .select('id,title,description,emirate,owner_user_id,owner_company_id,publication_state')
    .eq('id', listingId)
    .eq('section', 'services')
    .maybeSingle();

  if (!listing) {
    throw new Error('Services listing not found for risk auto-check.');
  }

  const [{ data: ownerProfile }, { data: company }, { data: providerProfile }, { data: offerings }, { data: areas }] = await Promise.all([
    supabase
      .schema('core')
      .from('profiles')
      .select('user_id,is_phone_verified,is_email_verified,is_identity_verified')
      .eq('user_id', listing.owner_user_id)
      .maybeSingle(),
    listing.owner_company_id
      ? supabase
          .schema('company')
          .from('companies')
          .select('id,verification_status,trust_tier,website')
          .eq('id', listing.owner_company_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    listing.owner_company_id
      ? supabase
          .schema('services')
          .from('service_provider_profiles')
          .select('company_id,verification_status,trust_tier,display_name,bio')
          .eq('company_id', listing.owner_company_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    listing.owner_company_id
      ? supabase
          .schema('services')
          .from('service_offerings')
          .select('id,base_price,pricing_model,description')
          .eq('company_id', listing.owner_company_id)
          .eq('is_active', true)
      : Promise.resolve({ data: [] as { id: string; base_price: number | null; pricing_model: string; description: string | null }[] }),
    listing.owner_company_id
      ? supabase
          .schema('services')
          .from('service_areas')
          .select('id')
          .eq('company_id', listing.owner_company_id)
      : Promise.resolve({ data: [] as { id: string }[] })
  ]);

  let copiedBioCount = 0;
  if (hasValue(providerProfile?.bio) && listing.owner_company_id) {
    const { data: matchingBios } = await supabase
      .schema('services')
      .from('service_provider_profiles')
      .select('company_id')
      .eq('bio', providerProfile?.bio || '');

    copiedBioCount = (matchingBios || []).filter((item) => item.company_id !== listing.owner_company_id).length;
  }

  let sameWebsiteCount = 0;
  if (hasValue(company?.website) && listing.owner_company_id) {
    const { data: matchingWebsites } = await supabase
      .schema('company')
      .from('companies')
      .select('id')
      .eq('website', company?.website || '');

    sameWebsiteCount = (matchingWebsites || []).filter((item) => item.id !== listing.owner_company_id).length;
  }

  const activeOfferings = offerings || [];
  const basePrices = activeOfferings.map((offering) => offering.base_price).filter((value): value is number => value != null);
  const suspiciousLowOfferingCount = activeOfferings.filter((offering) => offering.base_price != null && offering.base_price <= 0).length;

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      emirate: listing.emirate,
      ownerUserId: listing.owner_user_id,
      ownerCompanyId: listing.owner_company_id,
      publicationState: listing.publication_state
    },
    ownerProfile: ownerProfile
      ? {
          isPhoneVerified: ownerProfile.is_phone_verified,
          isEmailVerified: ownerProfile.is_email_verified,
          isIdentityVerified: ownerProfile.is_identity_verified
        }
      : null,
    company: company
      ? {
          id: company.id,
          verificationStatus: company.verification_status,
          trustTier: company.trust_tier,
          website: company.website
        }
      : null,
    providerProfile: providerProfile
      ? {
          verificationStatus: providerProfile.verification_status,
          trustTier: providerProfile.trust_tier,
          displayName: providerProfile.display_name,
          bio: providerProfile.bio
        }
      : null,
    activeOfferingCount: activeOfferings.length,
    serviceAreaCount: (areas || []).length,
    suspiciousLowOfferingCount,
    minimumBasePrice: basePrices.length ? Math.min(...basePrices) : null,
    duplicateSignals: {
      copiedBioCount,
      sameWebsiteCount
    }
  };
}

export function evaluateServicesRiskRules(context: ServicesRiskContext, ruleOverrides: Map<string, RiskRuleConfig>) {
  const catalog: ServicesRiskRuleDefinition[] = [
    {
      ...SERVICES_RISK_RULE_DEFAULTS.services_missing_provider_identity,
      evaluate(ruleContext, ruleConfig) {
        if (!ruleContext.listing.ownerCompanyId || !ruleContext.providerProfile) {
          return createTriggeredRule(ruleConfig, 'Provider identity is incomplete for this services listing.', {
            hasOwnerCompany: Boolean(ruleContext.listing.ownerCompanyId),
            hasProviderProfile: Boolean(ruleContext.providerProfile)
          });
        }

        return null;
      }
    },
    {
      ...SERVICES_RISK_RULE_DEFAULTS.services_missing_service_coverage,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.serviceAreaCount < 1) {
          return createTriggeredRule(ruleConfig, 'Provider does not have any service area coverage configured.', {
            serviceAreaCount: ruleContext.serviceAreaCount
          });
        }

        return null;
      }
    },
    {
      ...SERVICES_RISK_RULE_DEFAULTS.services_missing_offering,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.activeOfferingCount < 1) {
          return createTriggeredRule(ruleConfig, 'Provider does not have an active service offering.', {
            activeOfferingCount: ruleContext.activeOfferingCount
          });
        }

        return null;
      }
    },
    {
      ...SERVICES_RISK_RULE_DEFAULTS.services_unverified_contact_identity,
      evaluate(ruleContext, ruleConfig) {
        if (!ruleContext.ownerProfile?.isPhoneVerified || !ruleContext.ownerProfile?.isEmailVerified) {
          return createTriggeredRule(ruleConfig, 'Provider contact identity is not fully verified.', {
            isPhoneVerified: ruleContext.ownerProfile?.isPhoneVerified || false,
            isEmailVerified: ruleContext.ownerProfile?.isEmailVerified || false,
            isIdentityVerified: ruleContext.ownerProfile?.isIdentityVerified || false
          });
        }

        return null;
      }
    },
    {
      ...SERVICES_RISK_RULE_DEFAULTS.services_suspicious_pricing_bait,
      evaluate(ruleContext, ruleConfig) {
        const minimumBasePrice = getNumberConfig(ruleConfig, 'minimumBasePrice', 10);

        if (ruleContext.suspiciousLowOfferingCount > 0) {
          return createTriggeredRule(ruleConfig, 'Provider has one or more services priced at zero or negative value.', {
            suspiciousLowOfferingCount: ruleContext.suspiciousLowOfferingCount
          });
        }

        if (ruleContext.minimumBasePrice != null && ruleContext.minimumBasePrice > 0 && ruleContext.minimumBasePrice < minimumBasePrice) {
          return createTriggeredRule(ruleConfig, 'Provider pricing looks like teaser pricing and should be reviewed.', {
            minimumBasePrice: ruleContext.minimumBasePrice,
            configuredFloor: minimumBasePrice
          });
        }

        return null;
      }
    },
    {
      ...SERVICES_RISK_RULE_DEFAULTS.services_copied_profile_text,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.duplicateSignals.copiedBioCount > 0 || ruleContext.duplicateSignals.sameWebsiteCount > 1) {
          return createTriggeredRule(ruleConfig, 'Provider profile text or website appears reused across multiple profiles.', {
            copiedBioCount: ruleContext.duplicateSignals.copiedBioCount,
            sameWebsiteCount: ruleContext.duplicateSignals.sameWebsiteCount
          });
        }

        return null;
      }
    },
    {
      ...SERVICES_RISK_RULE_DEFAULTS.services_unverified_provider_high_activity,
      evaluate(ruleContext, ruleConfig) {
        const activeOfferingThreshold = getNumberConfig(ruleConfig, 'activeOfferingThreshold', 4);

        if (ruleContext.providerProfile?.verificationStatus !== 'verified' && ruleContext.activeOfferingCount >= activeOfferingThreshold) {
          return createTriggeredRule(ruleConfig, 'Unverified provider is publishing a larger-than-safe set of active offerings.', {
            verificationStatus: ruleContext.providerProfile?.verificationStatus || 'missing',
            activeOfferingCount: ruleContext.activeOfferingCount,
            activeOfferingThreshold
          });
        }

        return null;
      }
    }
  ];

  return catalog.reduce<TriggeredRiskRule[]>((results, rule) => {
    const mergedConfig = mergeRuleConfig(rule.ruleCode as keyof typeof SERVICES_RISK_RULE_DEFAULTS, ruleOverrides.get(rule.ruleCode));

    if (!mergedConfig.isActive) {
      return results;
    }

    const outcome = rule.evaluate(context, mergedConfig);
    return outcome ? [...results, outcome] : results;
  }, []);
}
