import { PROPERTY_RISK_RULE_DEFAULTS } from '../constants';
import type { PropertyRiskContext, PropertyRiskRuleDefinition, RiskRuleConfig, TriggeredRiskRule } from '../types';

function mergeRuleConfig(ruleCode: keyof typeof PROPERTY_RISK_RULE_DEFAULTS, config: Partial<RiskRuleConfig> | null | undefined): RiskRuleConfig {
  const fallback = PROPERTY_RISK_RULE_DEFAULTS[ruleCode];

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

export async function loadPropertyRiskContext(
  supabase: Awaited<ReturnType<typeof import('../../supabase/server').createSupabaseServerClient>>,
  listingId: string
): Promise<PropertyRiskContext> {
  const [{ data: listing }, { data: property }, { data: compliance }, { data: companyLink }, { data: media }, { data: documents }] =
    await Promise.all([
      supabase
        .schema('listing')
        .from('listing_core')
        .select('id,title,description,emirate,area,price_amount,owner_user_id,owner_company_id,publication_state')
        .eq('id', listingId)
        .eq('section', 'property')
        .maybeSingle(),
      supabase
        .schema('property')
        .from('property_listing_details')
        .select('listing_id,market_mode,purpose,property_type,building_name,community_name,rent_frequency')
        .eq('listing_id', listingId)
        .maybeSingle(),
      supabase
        .schema('property')
        .from('property_compliance')
        .select('listing_id,advertiser_type,permit_system,permit_number,permit_qr_payload,permit_expiry_date')
        .eq('listing_id', listingId)
        .maybeSingle(),
      supabase
        .schema('property')
        .from('property_company_links')
        .select('listing_id,agency_company_id,developer_company_id,broker_user_id')
        .eq('listing_id', listingId)
        .maybeSingle(),
      supabase
        .schema('listing')
        .from('listing_media')
        .select('listing_id,checksum,status')
        .eq('listing_id', listingId)
        .eq('status', 'active'),
      supabase
        .schema('property')
        .from('property_compliance_documents')
        .select('id,review_state')
        .eq('listing_id', listingId)
    ]);

  if (!listing) {
    throw new Error('Property listing not found for risk auto-check.');
  }

  const [{ data: company }, { count: rejectedListingCount }] = await Promise.all([
    listing.owner_company_id
      ? supabase
          .schema('company')
          .from('companies')
          .select('id,verification_status,trust_tier')
          .eq('id', listing.owner_company_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    (() => {
      let query = supabase
        .schema('listing')
        .from('listing_core')
        .select('id', { count: 'exact', head: true })
        .eq('section', 'property')
        .eq('publication_state', 'rejected');

      if (listing.owner_company_id) {
        query = query.eq('owner_company_id', listing.owner_company_id);
      } else {
        query = query.eq('owner_user_id', listing.owner_user_id);
      }

      return query;
    })()
  ]);

  let samePermitCount = 0;
  if (hasValue(compliance?.permit_number)) {
    const { data: permitMatches } = await supabase
      .schema('property')
      .from('property_compliance')
      .select('listing_id')
      .eq('permit_number', compliance?.permit_number || '');

    samePermitCount = (permitMatches || []).filter((item) => item.listing_id !== listingId).length;
  }

  const { data: titlePriceMatches } = await (() => {
    let query = supabase
      .schema('listing')
      .from('listing_core')
      .select('id')
      .eq('section', 'property')
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
      .select('listing_id,checksum')
      .in('checksum', mediaChecksums);

    const listingIds = new Set(
      (imageMatches || []).map((item) => item.listing_id).filter((id) => id && id !== listingId)
    );
    reusedImageListingCount = listingIds.size;
  }

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      emirate: listing.emirate,
      area: listing.area,
      priceAmount: listing.price_amount,
      ownerUserId: listing.owner_user_id,
      ownerCompanyId: listing.owner_company_id,
      publicationState: listing.publication_state
    },
    property: property
      ? {
          marketMode: property.market_mode,
          purpose: property.purpose,
          propertyType: property.property_type,
          buildingName: property.building_name,
          communityName: property.community_name,
          rentFrequency: property.rent_frequency
        }
      : null,
    compliance: compliance
      ? {
          advertiserType: compliance.advertiser_type,
          permitSystem: compliance.permit_system,
          permitNumber: compliance.permit_number,
          permitQrPayload: compliance.permit_qr_payload,
          permitExpiryDate: compliance.permit_expiry_date
        }
      : null,
    company: company
      ? {
          id: company.id,
          verificationStatus: company.verification_status,
          trustTier: company.trust_tier
        }
      : null,
    companyLink: companyLink
      ? {
          agencyCompanyId: companyLink.agency_company_id,
          developerCompanyId: companyLink.developer_company_id,
          brokerUserId: companyLink.broker_user_id
        }
      : null,
    mediaCount: (media || []).length,
    mediaChecksums,
    complianceDocumentCount: (documents || []).length,
    rejectedListingCount: rejectedListingCount || 0,
    duplicateSignals: {
      samePermitCount,
      sameTitlePriceCount: Math.max(((titlePriceMatches || []).length || 0) - 1, 0),
      reusedImageListingCount
    }
  };
}

export function evaluatePropertyRiskRules(
  context: PropertyRiskContext,
  ruleOverrides: Map<string, RiskRuleConfig>
) {
  const catalog: PropertyRiskRuleDefinition[] = [
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_missing_advertiser_identity,
      evaluate(ruleContext, ruleConfig) {
        const advertiserType = ruleContext.compliance?.advertiserType;
        const hasAgencyLink = Boolean(ruleContext.companyLink?.agencyCompanyId);
        const hasDeveloperLink = Boolean(ruleContext.companyLink?.developerCompanyId);
        const hasBrokerLink = Boolean(ruleContext.companyLink?.brokerUserId);

        if (!advertiserType) {
          return createTriggeredRule(ruleConfig, 'Advertiser type is missing for this property listing.');
        }

        if (advertiserType === 'agency' && !hasAgencyLink) {
          return createTriggeredRule(ruleConfig, 'Agency advertiser listings must be linked to an agency company.', {
            advertiserType
          });
        }

        if (advertiserType === 'developer' && !hasDeveloperLink) {
          return createTriggeredRule(ruleConfig, 'Developer listings must be linked to a developer company.', {
            advertiserType
          });
        }

        if (advertiserType === 'agent' && (!hasAgencyLink || !hasBrokerLink)) {
          return createTriggeredRule(ruleConfig, 'Broker listings must be linked to both an agency and a broker user.', {
            advertiserType
          });
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_missing_permit,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.compliance?.permitSystem && ruleContext.compliance.permitSystem !== 'none' && !hasValue(ruleContext.compliance.permitNumber)) {
          return createTriggeredRule(ruleConfig, 'Required permit number is missing for this regulated property lane.', {
            permitSystem: ruleContext.compliance.permitSystem
          });
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_expired_permit,
      evaluate(ruleContext, ruleConfig) {
        if (!hasValue(ruleContext.compliance?.permitExpiryDate)) return null;

        const permitExpiry = new Date(ruleContext.compliance?.permitExpiryDate || '');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!Number.isNaN(permitExpiry.getTime()) && permitExpiry < today) {
          return createTriggeredRule(ruleConfig, 'Property permit has expired and cannot be trusted for automatic publishing.', {
            permitExpiryDate: ruleContext.compliance?.permitExpiryDate
          });
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_missing_permit_qr,
      evaluate(ruleContext, ruleConfig) {
        if (
          ruleContext.compliance?.permitSystem &&
          ruleContext.compliance.permitSystem !== 'none' &&
          !hasValue(ruleContext.compliance.permitQrPayload)
        ) {
          return createTriggeredRule(ruleConfig, 'Permit verification payload is missing for this regulated property listing.', {
            permitSystem: ruleContext.compliance.permitSystem
          });
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_incomplete_listing,
      evaluate(ruleContext, ruleConfig) {
        const minimumImageCount = getNumberConfig(ruleConfig, 'minimumImageCount', 3);
        const missingFields = [
          !hasValue(ruleContext.listing.title) ? 'title' : null,
          !hasValue(ruleContext.listing.description) ? 'description' : null,
          !hasValue(ruleContext.listing.emirate) ? 'emirate' : null,
          !hasValue(ruleContext.listing.area) ? 'area' : null,
          ruleContext.listing.priceAmount == null ? 'price' : null,
          !hasValue(ruleContext.property?.purpose) ? 'purpose' : null,
          !hasValue(ruleContext.property?.propertyType) ? 'property_type' : null,
          ruleContext.mediaCount < minimumImageCount ? 'images' : null
        ].filter(Boolean) as string[];

        if (missingFields.length) {
          return createTriggeredRule(ruleConfig, 'Property listing is incomplete and should stay in review until the missing fields are fixed.', {
            missingFields,
            mediaCount: ruleContext.mediaCount
          });
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_low_image_count,
      evaluate(ruleContext, ruleConfig) {
        const minimumImageCount = getNumberConfig(ruleConfig, 'minimumImageCount', 3);

        if (ruleContext.mediaCount > 0 && ruleContext.mediaCount < minimumImageCount) {
          return createTriggeredRule(ruleConfig, 'Property has fewer images than the preferred minimum for trust and conversion.', {
            mediaCount: ruleContext.mediaCount,
            minimumImageCount
          });
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_suspicious_price,
      evaluate(ruleContext, ruleConfig) {
        const priceAmount = ruleContext.listing.priceAmount;
        if (priceAmount == null) return null;

        const saleFloor = getNumberConfig(ruleConfig, 'saleFloor', 10000);
        const yearlyRentFloor = getNumberConfig(ruleConfig, 'yearlyRentFloor', 5000);
        const monthlyRentFloor = getNumberConfig(ruleConfig, 'monthlyRentFloor', 500);
        const weeklyRentFloor = getNumberConfig(ruleConfig, 'weeklyRentFloor', 100);
        const dailyRentFloor = getNumberConfig(ruleConfig, 'dailyRentFloor', 50);

        if (priceAmount <= 0) {
          return createTriggeredRule(ruleConfig, 'Property pricing cannot be zero or negative in the regulated marketplace flow.', {
            priceAmount
          });
        }

        if (ruleContext.property?.purpose === 'sale' && priceAmount < saleFloor) {
          return createTriggeredRule(ruleConfig, 'Property sale pricing is unusually low for the UAE market and needs review.', {
            priceAmount,
            saleFloor
          });
        }

        if (ruleContext.property?.purpose === 'rent') {
          const floor =
            ruleContext.property.rentFrequency === 'daily'
              ? dailyRentFloor
              : ruleContext.property.rentFrequency === 'weekly'
                ? weeklyRentFloor
                : ruleContext.property.rentFrequency === 'monthly'
                  ? monthlyRentFloor
                  : yearlyRentFloor;

          if (priceAmount < floor) {
            return createTriggeredRule(ruleConfig, 'Property rent pricing looks like teaser pricing and should be reviewed manually.', {
              priceAmount,
              rentFrequency: ruleContext.property.rentFrequency || 'yearly',
              floor
            });
          }
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_duplicate_listing,
      evaluate(ruleContext, ruleConfig) {
        const { samePermitCount, sameTitlePriceCount, reusedImageListingCount } = ruleContext.duplicateSignals;

        if (samePermitCount > 0 || sameTitlePriceCount > 0 || reusedImageListingCount > 1) {
          return createTriggeredRule(ruleConfig, 'Property duplicate pattern detected across permit, title/price, or reused images.', {
            samePermitCount,
            sameTitlePriceCount,
            reusedImageListingCount
          });
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_unverified_company,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.listing.ownerCompanyId && ruleContext.company?.verificationStatus !== 'verified') {
          return createTriggeredRule(ruleConfig, 'Property listing belongs to a company that is not yet verified.', {
            companyId: ruleContext.listing.ownerCompanyId,
            verificationStatus: ruleContext.company?.verificationStatus || 'missing'
          });
        }

        return null;
      }
    },
    {
      ...PROPERTY_RISK_RULE_DEFAULTS.property_repeat_rejections,
      evaluate(ruleContext, ruleConfig) {
        const rejectionThreshold = getNumberConfig(ruleConfig, 'rejectionThreshold', 2);

        if (ruleContext.rejectedListingCount >= rejectionThreshold) {
          return createTriggeredRule(ruleConfig, 'Property poster has multiple rejected listings and should remain in manual review.', {
            rejectedListingCount: ruleContext.rejectedListingCount,
            rejectionThreshold
          });
        }

        return null;
      }
    }
  ];

  return catalog.reduce<TriggeredRiskRule[]>((results, rule) => {
    const mergedConfig = mergeRuleConfig(rule.ruleCode as keyof typeof PROPERTY_RISK_RULE_DEFAULTS, ruleOverrides.get(rule.ruleCode));

    if (!mergedConfig.isActive) {
      return results;
    }

    const outcome = rule.evaluate(context, mergedConfig);
    return outcome ? [...results, outcome] : results;
  }, []);
}
