import { MOTORS_RISK_RULE_DEFAULTS } from '../constants';
import type { MotorsRiskContext, MotorsRiskRuleDefinition, RiskRuleConfig, TriggeredRiskRule } from '../types';

function mergeRuleConfig(ruleCode: keyof typeof MOTORS_RISK_RULE_DEFAULTS, config: Partial<RiskRuleConfig> | null | undefined): RiskRuleConfig {
  const fallback = MOTORS_RISK_RULE_DEFAULTS[ruleCode];

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

export async function loadMotorsRiskContext(
  supabase: Awaited<ReturnType<typeof import('../../supabase/server').createSupabaseServerClient>>,
  listingId: string
): Promise<MotorsRiskContext> {
  const [{ data: listing }, { data: motor }] = await Promise.all([
    supabase
      .schema('listing')
      .from('listing_core')
      .select('id,title,description,emirate,owner_user_id,owner_company_id,seller_type,price_amount,publication_state')
      .eq('id', listingId)
      .eq('section', 'motors')
      .maybeSingle(),
    supabase
      .schema('motors')
      .from('motor_listing_details')
      .select('listing_id,listing_type,vehicle_type,make,model,trim,year,mileage,condition,fuel_type,transmission,body_type')
      .eq('listing_id', listingId)
      .maybeSingle()
  ]);

  if (!listing) {
    throw new Error('Motors listing not found for risk auto-check.');
  }

  const [{ data: ownerProfile }, { data: company }, { count: rejectedListingCount }, { count: activeListingCount }, { data: media }] = await Promise.all([
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
          .select('id,verification_status,trust_tier,company_type')
          .eq('id', listing.owner_company_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    (() => {
      let query = supabase
        .schema('listing')
        .from('listing_core')
        .select('id', { count: 'exact', head: true })
        .eq('section', 'motors')
        .eq('publication_state', 'rejected');

      if (listing.owner_company_id) {
        query = query.eq('owner_company_id', listing.owner_company_id);
      } else {
        query = query.eq('owner_user_id', listing.owner_user_id);
      }

      return query;
    })(),
    (() => {
      let query = supabase
        .schema('listing')
        .from('listing_core')
        .select('id', { count: 'exact', head: true })
        .eq('section', 'motors')
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
      .eq('section', 'motors')
      .eq('title', listing.title)
      .eq('price_amount', listing.price_amount ?? 0);

    if (listing.owner_company_id) {
      query = query.eq('owner_company_id', listing.owner_company_id);
    } else {
      query = query.eq('owner_user_id', listing.owner_user_id);
    }

    return query;
  })();

  let sameVehicleSignatureCount = 0;
  if (motor) {
    let query = supabase
      .schema('motors')
      .from('motor_listing_details')
      .select('listing_id')
      .eq('make', motor.make)
      .eq('model', motor.model)
      .eq('year', motor.year)
      .eq('condition', motor.condition);

    if (motor.mileage != null) {
      query = query.eq('mileage', motor.mileage);
    }

    const { data: vehicleMatches } = await query;
    sameVehicleSignatureCount = (vehicleMatches || []).filter((item) => item.listing_id !== listingId).length;
  }

  const mediaChecksums = (media || []).map((item) => item.checksum).filter(Boolean) as string[];
  let reusedImageListingCount = 0;

  if (mediaChecksums.length) {
    const { data: imageMatches } = await supabase
      .schema('listing')
      .from('listing_media')
      .select('listing_id,checksum')
      .in('checksum', mediaChecksums);

    const listingIds = new Set((imageMatches || []).map((item) => item.listing_id).filter((id) => id && id !== listingId));
    reusedImageListingCount = listingIds.size;
  }

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      emirate: listing.emirate,
      ownerUserId: listing.owner_user_id,
      ownerCompanyId: listing.owner_company_id,
      sellerType: listing.seller_type,
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
    company: company
      ? {
          id: company.id,
          verificationStatus: company.verification_status,
          trustTier: company.trust_tier,
          companyType: company.company_type
        }
      : null,
    motor: motor
      ? {
          listingType: motor.listing_type,
          vehicleType: motor.vehicle_type,
          make: motor.make,
          model: motor.model,
          trim: motor.trim,
          year: motor.year,
          mileage: motor.mileage,
          condition: motor.condition,
          fuelType: motor.fuel_type,
          transmission: motor.transmission,
          bodyType: motor.body_type
        }
      : null,
    mediaCount: (media || []).length,
    rejectedListingCount: rejectedListingCount || 0,
    activeListingCount: activeListingCount || 0,
    duplicateSignals: {
      sameTitlePriceCount: Math.max(((titlePriceMatches || []).length || 0) - 1, 0),
      sameVehicleSignatureCount,
      reusedImageListingCount
    }
  };
}

export function evaluateMotorsRiskRules(context: MotorsRiskContext, ruleOverrides: Map<string, RiskRuleConfig>) {
  const catalog: MotorsRiskRuleDefinition[] = [
    {
      ...MOTORS_RISK_RULE_DEFAULTS.motors_missing_seller_identity,
      evaluate(ruleContext, ruleConfig) {
        const sellerType = ruleContext.listing.sellerType;

        if ((sellerType === 'dealer' || sellerType === 'business') && !ruleContext.listing.ownerCompanyId) {
          return createTriggeredRule(ruleConfig, 'Dealer or business vehicle listings must be linked to a company profile.', {
            sellerType
          });
        }

        if (!ruleContext.ownerProfile?.isPhoneVerified && !ruleContext.ownerProfile?.isEmailVerified) {
          return createTriggeredRule(ruleConfig, 'Vehicle poster does not have a verified phone or email contact path.', {
            isPhoneVerified: ruleContext.ownerProfile?.isPhoneVerified || false,
            isEmailVerified: ruleContext.ownerProfile?.isEmailVerified || false
          });
        }

        return null;
      }
    },
    {
      ...MOTORS_RISK_RULE_DEFAULTS.motors_incomplete_vehicle_data,
      evaluate(ruleContext, ruleConfig) {
        const minimumImageCount = getNumberConfig(ruleConfig, 'minimumImageCount', 3);
        const missingFields = [
          !hasValue(ruleContext.listing.title) ? 'title' : null,
          !hasValue(ruleContext.listing.description) ? 'description' : null,
          !ruleContext.listing.priceAmount ? 'price' : null,
          !hasValue(ruleContext.motor?.vehicleType) ? 'vehicle_type' : null,
          !hasValue(ruleContext.motor?.make) ? 'make' : null,
          !hasValue(ruleContext.motor?.model) ? 'model' : null,
          ruleContext.motor?.year == null ? 'year' : null,
          ruleContext.motor?.mileage == null ? 'mileage' : null,
          ruleContext.mediaCount < minimumImageCount ? 'images' : null
        ].filter(Boolean) as string[];

        if (missingFields.length) {
          return createTriggeredRule(ruleConfig, 'Vehicle listing is missing required trust and quality fields.', {
            missingFields,
            mediaCount: ruleContext.mediaCount
          });
        }

        return null;
      }
    },
    {
      ...MOTORS_RISK_RULE_DEFAULTS.motors_fake_teaser_price,
      evaluate(ruleContext, ruleConfig) {
        const minimumPrice = getNumberConfig(ruleConfig, 'minimumPrice', 1000);
        const priceAmount = ruleContext.listing.priceAmount;

        if (priceAmount == null || priceAmount <= 0) {
          return createTriggeredRule(ruleConfig, 'Vehicle pricing cannot be zero or negative.', {
            priceAmount
          });
        }

        if (priceAmount < minimumPrice) {
          return createTriggeredRule(ruleConfig, 'Vehicle pricing looks like teaser pricing and should be reviewed.', {
            priceAmount,
            minimumPrice
          });
        }

        return null;
      }
    },
    {
      ...MOTORS_RISK_RULE_DEFAULTS.motors_duplicate_listing,
      evaluate(ruleContext, ruleConfig) {
        const { sameTitlePriceCount, sameVehicleSignatureCount, reusedImageListingCount } = ruleContext.duplicateSignals;

        if (sameTitlePriceCount > 0 || sameVehicleSignatureCount > 0 || reusedImageListingCount > 1) {
          return createTriggeredRule(ruleConfig, 'Duplicate vehicle listing pattern detected across title/price, vehicle signature, or reused images.', {
            sameTitlePriceCount,
            sameVehicleSignatureCount,
            reusedImageListingCount
          });
        }

        return null;
      }
    },
    {
      ...MOTORS_RISK_RULE_DEFAULTS.motors_suspicious_mileage_year,
      evaluate(ruleContext, ruleConfig) {
        if (!ruleContext.motor) return null;

        const currentYear = new Date().getFullYear();
        const futureYearTolerance = getNumberConfig(ruleConfig, 'futureYearTolerance', 1);
        const highMileageForNewVehicle = getNumberConfig(ruleConfig, 'highMileageForNewVehicle', 1000);

        if (ruleContext.motor.year > currentYear + futureYearTolerance) {
          return createTriggeredRule(ruleConfig, 'Vehicle year is unrealistically far in the future.', {
            year: ruleContext.motor.year,
            currentYear,
            futureYearTolerance
          });
        }

        if (ruleContext.motor.condition === 'new' && ruleContext.motor.mileage != null && ruleContext.motor.mileage > highMileageForNewVehicle) {
          return createTriggeredRule(ruleConfig, 'Vehicle is marked new but mileage is unusually high.', {
            mileage: ruleContext.motor.mileage,
            highMileageForNewVehicle
          });
        }

        return null;
      }
    },
    {
      ...MOTORS_RISK_RULE_DEFAULTS.motors_unverified_seller_high_frequency,
      evaluate(ruleContext, ruleConfig) {
        const activeListingThreshold = getNumberConfig(ruleConfig, 'activeListingThreshold', 3);

        if (ruleContext.company?.verificationStatus !== 'verified' && ruleContext.activeListingCount >= activeListingThreshold) {
          return createTriggeredRule(ruleConfig, 'Unverified motors seller is posting at a higher-than-safe frequency.', {
            verificationStatus: ruleContext.company?.verificationStatus || 'missing',
            activeListingCount: ruleContext.activeListingCount,
            activeListingThreshold
          });
        }

        return null;
      }
    },
    {
      ...MOTORS_RISK_RULE_DEFAULTS.motors_repeat_rejections,
      evaluate(ruleContext, ruleConfig) {
        const rejectionThreshold = getNumberConfig(ruleConfig, 'rejectionThreshold', 2);

        if (ruleContext.rejectedListingCount >= rejectionThreshold) {
          return createTriggeredRule(ruleConfig, 'Motors poster has repeated rejected listings and should remain in review.', {
            rejectedListingCount: ruleContext.rejectedListingCount,
            rejectionThreshold
          });
        }

        return null;
      }
    }
  ];

  return catalog.reduce<TriggeredRiskRule[]>((results, rule) => {
    const mergedConfig = mergeRuleConfig(rule.ruleCode as keyof typeof MOTORS_RISK_RULE_DEFAULTS, ruleOverrides.get(rule.ruleCode));

    if (!mergedConfig.isActive) {
      return results;
    }

    const outcome = rule.evaluate(context, mergedConfig);
    return outcome ? [...results, outcome] : results;
  }, []);
}
