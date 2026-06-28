import { CLASSIFIEDS_RISK_RULE_DEFAULTS } from '../constants';
import type { ClassifiedsRiskContext, ClassifiedsRiskRuleDefinition, RiskRuleConfig, TriggeredRiskRule } from '../types';

function mergeRuleConfig(ruleCode: keyof typeof CLASSIFIEDS_RISK_RULE_DEFAULTS, config: Partial<RiskRuleConfig> | null | undefined): RiskRuleConfig {
  const fallback = CLASSIFIEDS_RISK_RULE_DEFAULTS[ruleCode];

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

function getPhraseConfig(config: RiskRuleConfig, key: string, fallback: string[]) {
  const raw = config.config[key];
  return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : fallback;
}

function hasValue(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

export async function loadClassifiedsRiskContext(
  supabase: Awaited<ReturnType<typeof import('../../supabase/server').createSupabaseServerClient>>,
  listingId: string
): Promise<ClassifiedsRiskContext> {
  const { data: listing } = await supabase
    .schema('listing')
    .from('listing_core')
    .select('id,title,description,emirate,owner_user_id,owner_company_id,price_amount,publication_state')
    .eq('id', listingId)
    .eq('section', 'classifieds')
    .maybeSingle();

  if (!listing) {
    throw new Error('Classifieds listing not found for risk auto-check.');
  }

  const [{ data: ownerProfile }, { count: activeListingCount }, { data: media }] = await Promise.all([
    supabase
      .schema('core')
      .from('profiles')
      .select('user_id,is_phone_verified,is_email_verified,is_identity_verified')
      .eq('user_id', listing.owner_user_id)
      .maybeSingle(),
    (() => {
      let query = supabase
        .schema('listing')
        .from('listing_core')
        .select('id', { count: 'exact', head: true })
        .eq('section', 'classifieds')
        .in('publication_state', ['submitted', 'pending_review', 'approved', 'published']);

      if (listing.owner_company_id) {
        query = query.eq('owner_company_id', listing.owner_company_id);
      } else {
        query = query.eq('owner_user_id', listing.owner_user_id);
      }

      return query;
    })(),
    supabase
      .schema('listing')
      .from('listing_media')
      .select('listing_id,checksum')
      .eq('listing_id', listingId)
      .eq('status', 'active')
  ]);

  const { data: titlePriceMatches } = await (() => {
    let query = supabase
      .schema('listing')
      .from('listing_core')
      .select('id')
      .eq('section', 'classifieds')
      .eq('title', listing.title)
      .eq('price_amount', listing.price_amount ?? 0);

    if (listing.owner_company_id) {
      query = query.eq('owner_company_id', listing.owner_company_id);
    } else {
      query = query.eq('owner_user_id', listing.owner_user_id);
    }

    return query;
  })();

  const mediaChecksums = (media || []).map((item) => item.checksum).filter(Boolean) as string[];
  let reusedImageListingCount = 0;

  if (mediaChecksums.length) {
    const { data: imageMatches } = await supabase
      .schema('listing')
      .from('listing_media')
      .select('listing_id')
      .in('checksum', mediaChecksums);

    reusedImageListingCount = new Set((imageMatches || []).map((item) => item.listing_id).filter((id) => id && id !== listingId)).size;
  }

  const phraseConfig = getPhraseConfig(
    CLASSIFIEDS_RISK_RULE_DEFAULTS.classifieds_prohibited_phrase_match,
    'phrases',
    ['telegram only', 'contact off platform', 'replica', 'copy brand', 'crypto only']
  );
  const searchableText = [listing.title, listing.description].filter(Boolean).join(' ').toLowerCase();
  const prohibitedPhraseMatches = phraseConfig.filter((phrase) => searchableText.includes(phrase.toLowerCase()));

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      emirate: listing.emirate,
      ownerUserId: listing.owner_user_id,
      ownerCompanyId: listing.owner_company_id,
      priceAmount: listing.price_amount,
      publicationState: listing.publication_state
    },
    ownerProfile: ownerProfile
      ? {
          isPhoneVerified: ownerProfile.is_phone_verified,
          isEmailVerified: ownerProfile.is_email_verified,
          isIdentityVerified: ownerProfile.is_identity_verified
        }
      : null,
    mediaCount: (media || []).length,
    activeListingCount: activeListingCount || 0,
    prohibitedPhraseMatches,
    duplicateSignals: {
      sameTitlePriceCount: Math.max(((titlePriceMatches || []).length || 0) - 1, 0),
      reusedImageListingCount
    }
  };
}

export function evaluateClassifiedsRiskRules(context: ClassifiedsRiskContext, ruleOverrides: Map<string, RiskRuleConfig>) {
  const catalog: ClassifiedsRiskRuleDefinition[] = [
    {
      ...CLASSIFIEDS_RISK_RULE_DEFAULTS.classifieds_incomplete_listing,
      evaluate(ruleContext, ruleConfig) {
        const minimumImageCount = getNumberConfig(ruleConfig, 'minimumImageCount', 1);
        const missingFields = [
          !hasValue(ruleContext.listing.title) ? 'title' : null,
          !hasValue(ruleContext.listing.description) ? 'description' : null,
          !hasValue(ruleContext.listing.emirate) ? 'emirate' : null,
          ruleContext.listing.priceAmount == null ? 'price' : null,
          ruleContext.mediaCount < minimumImageCount ? 'images' : null
        ].filter(Boolean) as string[];

        if (missingFields.length) {
          return createTriggeredRule(ruleConfig, 'Classified listing is missing required fields.', {
            missingFields,
            mediaCount: ruleContext.mediaCount
          });
        }

        return null;
      }
    },
    {
      ...CLASSIFIEDS_RISK_RULE_DEFAULTS.classifieds_prohibited_phrase_match,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.prohibitedPhraseMatches.length) {
          return createTriggeredRule(ruleConfig, 'Prohibited or spammy wording detected in classifieds listing.', {
            phraseMatches: ruleContext.prohibitedPhraseMatches
          });
        }

        return null;
      }
    },
    {
      ...CLASSIFIEDS_RISK_RULE_DEFAULTS.classifieds_suspicious_low_price,
      evaluate(ruleContext, ruleConfig) {
        const minimumPrice = getNumberConfig(ruleConfig, 'minimumPrice', 5);
        const priceAmount = ruleContext.listing.priceAmount;

        if (priceAmount == null || priceAmount <= 0) {
          return createTriggeredRule(ruleConfig, 'Classified listing price cannot be zero or negative.', {
            priceAmount
          });
        }

        if (priceAmount < minimumPrice) {
          return createTriggeredRule(ruleConfig, 'Classified listing price is suspiciously low and needs review.', {
            priceAmount,
            minimumPrice
          });
        }

        return null;
      }
    },
    {
      ...CLASSIFIEDS_RISK_RULE_DEFAULTS.classifieds_duplicate_listing,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.duplicateSignals.sameTitlePriceCount > 0 || ruleContext.duplicateSignals.reusedImageListingCount > 1) {
          return createTriggeredRule(ruleConfig, 'Duplicate classifieds pattern detected across title/price or reused images.', {
            sameTitlePriceCount: ruleContext.duplicateSignals.sameTitlePriceCount,
            reusedImageListingCount: ruleContext.duplicateSignals.reusedImageListingCount
          });
        }

        return null;
      }
    },
    {
      ...CLASSIFIEDS_RISK_RULE_DEFAULTS.classifieds_new_account_high_frequency,
      evaluate(ruleContext, ruleConfig) {
        const activeListingThreshold = getNumberConfig(ruleConfig, 'activeListingThreshold', 5);

        if ((!ruleContext.ownerProfile?.isPhoneVerified || !ruleContext.ownerProfile?.isEmailVerified) && ruleContext.activeListingCount >= activeListingThreshold) {
          return createTriggeredRule(ruleConfig, 'Low-trust classifieds poster is publishing at a higher-than-safe frequency.', {
            isPhoneVerified: ruleContext.ownerProfile?.isPhoneVerified || false,
            isEmailVerified: ruleContext.ownerProfile?.isEmailVerified || false,
            activeListingCount: ruleContext.activeListingCount,
            activeListingThreshold
          });
        }

        return null;
      }
    }
  ];

  return catalog.reduce<TriggeredRiskRule[]>((results, rule) => {
    const mergedConfig = mergeRuleConfig(rule.ruleCode as keyof typeof CLASSIFIEDS_RISK_RULE_DEFAULTS, ruleOverrides.get(rule.ruleCode));

    if (!mergedConfig.isActive) {
      return results;
    }

    const outcome = rule.evaluate(context, mergedConfig);
    return outcome ? [...results, outcome] : results;
  }, []);
}
