import { DIRECTORY_RISK_RULE_DEFAULTS } from '../constants';
import type { DirectoryRiskContext, DirectoryRiskRuleDefinition, RiskRuleConfig, TriggeredRiskRule } from '../types';

function mergeRuleConfig(ruleCode: keyof typeof DIRECTORY_RISK_RULE_DEFAULTS, config: Partial<RiskRuleConfig> | null | undefined): RiskRuleConfig {
  const fallback = DIRECTORY_RISK_RULE_DEFAULTS[ruleCode];

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

function hasValue(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

export async function loadDirectoryRiskContext(
  supabase: Awaited<ReturnType<typeof import('../../supabase/server').createSupabaseServerClient>>,
  listingId: string
): Promise<DirectoryRiskContext> {
  const [{ data: listing }, { data: contacts }] = await Promise.all([
    supabase
      .schema('listing')
      .from('listing_core')
      .select('id,title,description,emirate,area,owner_user_id,owner_company_id,publication_state')
      .eq('id', listingId)
      .eq('section', 'directory')
      .maybeSingle(),
    supabase
      .schema('listing')
      .from('listing_contacts')
      .select('listing_id,public_phone,public_email,public_whatsapp')
      .eq('listing_id', listingId)
      .maybeSingle()
  ]);

  if (!listing) {
    throw new Error('Directory listing not found for risk auto-check.');
  }

  const { data: company } = listing.owner_company_id
    ? await supabase
        .schema('company')
        .from('companies')
        .select('id,display_name,verification_status,public_profile_enabled,website')
        .eq('id', listing.owner_company_id)
        .maybeSingle()
    : { data: null };

  const { data: companyListings } = listing.owner_company_id
    ? await supabase
        .schema('listing')
        .from('listing_core')
        .select('id,title')
        .eq('section', 'directory')
        .eq('owner_company_id', listing.owner_company_id)
    : { data: [] as { id: string; title: string }[] };

  const { data: sameTitleListings } = await supabase
    .schema('listing')
    .from('listing_core')
    .select('id')
    .eq('section', 'directory')
    .eq('title', listing.title);

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      emirate: listing.emirate,
      area: listing.area,
      ownerUserId: listing.owner_user_id,
      ownerCompanyId: listing.owner_company_id,
      publicationState: listing.publication_state
    },
    company: company
      ? {
          id: company.id,
          displayName: company.display_name,
          verificationStatus: company.verification_status,
          publicProfileEnabled: company.public_profile_enabled,
          website: company.website
        }
      : null,
    contacts: contacts
      ? {
          publicPhone: contacts.public_phone,
          publicEmail: contacts.public_email,
          publicWhatsapp: contacts.public_whatsapp
        }
      : null,
    duplicateSignals: {
      sameCompanyListingCount: Math.max((companyListings || []).length - 1, 0),
      sameTitleCount: Math.max((sameTitleListings || []).length - 1, 0)
    }
  };
}

export function evaluateDirectoryRiskRules(context: DirectoryRiskContext, ruleOverrides: Map<string, RiskRuleConfig>) {
  const catalog: DirectoryRiskRuleDefinition[] = [
    {
      ...DIRECTORY_RISK_RULE_DEFAULTS.directory_missing_business_identity,
      evaluate(ruleContext, ruleConfig) {
        if (!ruleContext.listing.ownerCompanyId || !ruleContext.company) {
          return createTriggeredRule(ruleConfig, 'Directory listing must be linked to a business profile.', {
            hasOwnerCompany: Boolean(ruleContext.listing.ownerCompanyId),
            hasCompany: Boolean(ruleContext.company)
          });
        }

        return null;
      }
    },
    {
      ...DIRECTORY_RISK_RULE_DEFAULTS.directory_incomplete_profile,
      evaluate(ruleContext, ruleConfig) {
        const missingFields = [
          !hasValue(ruleContext.listing.title) ? 'title' : null,
          !hasValue(ruleContext.listing.description) ? 'description' : null,
          !hasValue(ruleContext.listing.emirate) ? 'emirate' : null,
          !hasValue(ruleContext.company?.displayName) ? 'business_name' : null
        ].filter(Boolean) as string[];

        if (missingFields.length) {
          return createTriggeredRule(ruleConfig, 'Directory profile is missing core business profile fields.', {
            missingFields
          });
        }

        return null;
      }
    },
    {
      ...DIRECTORY_RISK_RULE_DEFAULTS.directory_missing_public_contact,
      evaluate(ruleContext, ruleConfig) {
        if (!hasValue(ruleContext.contacts?.publicPhone) && !hasValue(ruleContext.contacts?.publicEmail) && !hasValue(ruleContext.contacts?.publicWhatsapp)) {
          return createTriggeredRule(ruleConfig, 'Directory profile needs at least one public contact method.', {
            hasPhone: Boolean(ruleContext.contacts?.publicPhone),
            hasEmail: Boolean(ruleContext.contacts?.publicEmail),
            hasWhatsapp: Boolean(ruleContext.contacts?.publicWhatsapp)
          });
        }

        return null;
      }
    },
    {
      ...DIRECTORY_RISK_RULE_DEFAULTS.directory_duplicate_business_profile,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.duplicateSignals.sameCompanyListingCount > 0 || ruleContext.duplicateSignals.sameTitleCount > 1) {
          return createTriggeredRule(ruleConfig, 'Duplicate or overlapping directory business profiles detected.', {
            sameCompanyListingCount: ruleContext.duplicateSignals.sameCompanyListingCount,
            sameTitleCount: ruleContext.duplicateSignals.sameTitleCount
          });
        }

        return null;
      }
    }
  ];

  return catalog.reduce<TriggeredRiskRule[]>((results, rule) => {
    const mergedConfig = mergeRuleConfig(rule.ruleCode as keyof typeof DIRECTORY_RISK_RULE_DEFAULTS, ruleOverrides.get(rule.ruleCode));

    if (!mergedConfig.isActive) {
      return results;
    }

    const outcome = rule.evaluate(context, mergedConfig);
    return outcome ? [...results, outcome] : results;
  }, []);
}
