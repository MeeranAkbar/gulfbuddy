import { JOBS_RISK_RULE_DEFAULTS } from '../constants';
import type { JobsRiskContext, JobsRiskRuleDefinition, RiskRuleConfig, TriggeredRiskRule } from '../types';

function mergeRuleConfig(ruleCode: keyof typeof JOBS_RISK_RULE_DEFAULTS, config: Partial<RiskRuleConfig> | null | undefined): RiskRuleConfig {
  const fallback = JOBS_RISK_RULE_DEFAULTS[ruleCode];

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

export async function loadJobsRiskContext(
  supabase: Awaited<ReturnType<typeof import('../../supabase/server').createSupabaseServerClient>>,
  listingId: string
): Promise<JobsRiskContext> {
  const [{ data: listing }, { data: job }] = await Promise.all([
    supabase
      .schema('listing')
      .from('listing_core')
      .select('id,title,description,emirate,owner_user_id,owner_company_id,publication_state')
      .eq('id', listingId)
      .eq('section', 'jobs')
      .maybeSingle(),
    supabase
      .schema('jobs')
      .from('job_listing_details')
      .select('listing_id,job_title,employment_type,work_mode,salary_min,salary_max,salary_period,application_mode,application_email,application_url,industry')
      .eq('listing_id', listingId)
      .maybeSingle()
  ]);

  if (!listing) {
    throw new Error('Jobs listing not found for risk auto-check.');
  }

  const [{ data: company }, { data: employerProfile }, { count: rejectedListingCount }, { count: activeJobCount }] = await Promise.all([
    listing.owner_company_id
      ? supabase
          .schema('company')
          .from('companies')
          .select('id,verification_status,trust_tier')
          .eq('id', listing.owner_company_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    listing.owner_company_id
      ? supabase
          .schema('jobs')
          .from('employer_profiles')
          .select('company_id,verification_status,hiring_status,profile_strength_score')
          .eq('company_id', listing.owner_company_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    (() => {
      let query = supabase
        .schema('listing')
        .from('listing_core')
        .select('id', { count: 'exact', head: true })
        .eq('section', 'jobs')
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
        .eq('section', 'jobs')
        .in('publication_state', ['submitted', 'pending_review', 'approved', 'published']);

      if (listing.owner_company_id) {
        query = query.eq('owner_company_id', listing.owner_company_id);
      } else {
        query = query.eq('owner_user_id', listing.owner_user_id);
      }

      return query;
    })()
  ]);

  const { data: titleMatches } = await (() => {
    let query = supabase
      .schema('listing')
      .from('listing_core')
      .select('id,description')
      .eq('section', 'jobs')
      .eq('title', listing.title);

    if (listing.owner_company_id) {
      query = query.eq('owner_company_id', listing.owner_company_id);
    } else {
      query = query.eq('owner_user_id', listing.owner_user_id);
    }

    return query;
  })();

  const scamPhraseConfig = getPhraseConfig(
    JOBS_RISK_RULE_DEFAULTS.jobs_scam_phrase_match,
    'phrases',
    ['visa fee', 'processing fee', 'deposit required', 'pay to apply', 'registration fee']
  );
  const searchableText = [listing.title, listing.description, job?.job_title, job?.application_url].filter(Boolean).join(' ').toLowerCase();
  const scamPhraseMatches = scamPhraseConfig.filter((phrase) => searchableText.includes(phrase.toLowerCase()));

  const sameTitleCompanyCount = Math.max((titleMatches || []).length - 1, 0);
  const sameTitleDescriptionCount = Math.max(
    (titleMatches || []).filter((item) => item.description === listing.description).length - 1,
    0
  );

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
    job: job
      ? {
          jobTitle: job.job_title,
          employmentType: job.employment_type,
          workMode: job.work_mode,
          salaryMin: job.salary_min,
          salaryMax: job.salary_max,
          salaryPeriod: job.salary_period,
          applicationMode: job.application_mode,
          applicationEmail: job.application_email,
          applicationUrl: job.application_url,
          industry: job.industry
        }
      : null,
    company: company
      ? {
          id: company.id,
          verificationStatus: company.verification_status,
          trustTier: company.trust_tier
        }
      : null,
    employerProfile: employerProfile
      ? {
          verificationStatus: employerProfile.verification_status,
          hiringStatus: employerProfile.hiring_status,
          profileStrengthScore: employerProfile.profile_strength_score
        }
      : null,
    rejectedListingCount: rejectedListingCount || 0,
    activeJobCount: activeJobCount || 0,
    scamPhraseMatches,
    duplicateSignals: {
      sameTitleCompanyCount,
      sameTitleDescriptionCount
    }
  };
}

export function evaluateJobsRiskRules(context: JobsRiskContext, ruleOverrides: Map<string, RiskRuleConfig>) {
  const catalog: JobsRiskRuleDefinition[] = [
    {
      ...JOBS_RISK_RULE_DEFAULTS.jobs_missing_employer_identity,
      evaluate(ruleContext, ruleConfig) {
        if (!ruleContext.listing.ownerCompanyId || !ruleContext.company || !ruleContext.employerProfile) {
          return createTriggeredRule(ruleConfig, 'Employer identity is incomplete for this job listing.', {
            hasOwnerCompany: Boolean(ruleContext.listing.ownerCompanyId),
            hasCompany: Boolean(ruleContext.company),
            hasEmployerProfile: Boolean(ruleContext.employerProfile)
          });
        }

        return null;
      }
    },
    {
      ...JOBS_RISK_RULE_DEFAULTS.jobs_incomplete_listing,
      evaluate(ruleContext, ruleConfig) {
        const missingFields = [
          !hasValue(ruleContext.listing.title) ? 'title' : null,
          !hasValue(ruleContext.listing.description) ? 'description' : null,
          !hasValue(ruleContext.listing.emirate) ? 'emirate' : null,
          !hasValue(ruleContext.job?.jobTitle) ? 'job_title' : null,
          !hasValue(ruleContext.job?.employmentType) ? 'employment_type' : null,
          !hasValue(ruleContext.job?.workMode) ? 'work_mode' : null
        ].filter(Boolean) as string[];

        if (missingFields.length) {
          return createTriggeredRule(ruleConfig, 'Job listing is missing required fields.', {
            missingFields
          });
        }

        return null;
      }
    },
    {
      ...JOBS_RISK_RULE_DEFAULTS.jobs_suspicious_salary_bait,
      evaluate(ruleContext, ruleConfig) {
        if (!ruleContext.job) return null;

        const monthlySalaryFloor = getNumberConfig(ruleConfig, 'monthlySalaryFloor', 500);
        const salaryMin = ruleContext.job.salaryMin;
        const salaryMax = ruleContext.job.salaryMax;

        if (salaryMin != null && salaryMax != null && salaryMax < salaryMin) {
          return createTriggeredRule(ruleConfig, 'Job salary maximum is lower than the salary minimum.', {
            salaryMin,
            salaryMax
          });
        }

        const visibleSalary = salaryMin ?? salaryMax;
        if (visibleSalary != null && visibleSalary > 0 && visibleSalary < monthlySalaryFloor) {
          return createTriggeredRule(ruleConfig, 'Job salary looks like bait pricing and needs review.', {
            salaryMin,
            salaryMax,
            monthlySalaryFloor
          });
        }

        return null;
      }
    },
    {
      ...JOBS_RISK_RULE_DEFAULTS.jobs_suspicious_external_apply_link,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.job?.applicationMode !== 'external_url') return null;

        const applicationUrl = ruleContext.job.applicationUrl || '';
        if (!applicationUrl.startsWith('https://')) {
          return createTriggeredRule(ruleConfig, 'External apply URL must use a secure https destination.', {
            applicationUrl
          });
        }

        if (/wa\.me|t\.me|bit\.ly|tinyurl/i.test(applicationUrl)) {
          return createTriggeredRule(ruleConfig, 'External apply URL routes through a suspicious or opaque destination.', {
            applicationUrl
          });
        }

        return null;
      }
    },
    {
      ...JOBS_RISK_RULE_DEFAULTS.jobs_scam_phrase_match,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.scamPhraseMatches.length) {
          return createTriggeredRule(ruleConfig, 'Scam-like or payment-demand wording detected in this job listing.', {
            phraseMatches: ruleContext.scamPhraseMatches
          });
        }

        return null;
      }
    },
    {
      ...JOBS_RISK_RULE_DEFAULTS.jobs_duplicate_listing,
      evaluate(ruleContext, ruleConfig) {
        if (ruleContext.duplicateSignals.sameTitleCompanyCount > 0 || ruleContext.duplicateSignals.sameTitleDescriptionCount > 0) {
          return createTriggeredRule(ruleConfig, 'Duplicate job listing pattern detected for this employer.', {
            sameTitleCompanyCount: ruleContext.duplicateSignals.sameTitleCompanyCount,
            sameTitleDescriptionCount: ruleContext.duplicateSignals.sameTitleDescriptionCount
          });
        }

        return null;
      }
    },
    {
      ...JOBS_RISK_RULE_DEFAULTS.jobs_unverified_employer_high_frequency,
      evaluate(ruleContext, ruleConfig) {
        const activeJobThreshold = getNumberConfig(ruleConfig, 'activeJobThreshold', 3);

        if (ruleContext.company?.verificationStatus !== 'verified' && ruleContext.activeJobCount >= activeJobThreshold) {
          return createTriggeredRule(ruleConfig, 'Unverified employer is posting jobs at a higher-than-safe frequency.', {
            verificationStatus: ruleContext.company?.verificationStatus || 'missing',
            activeJobCount: ruleContext.activeJobCount,
            activeJobThreshold
          });
        }

        return null;
      }
    }
  ];

  return catalog.reduce<TriggeredRiskRule[]>((results, rule) => {
    const mergedConfig = mergeRuleConfig(rule.ruleCode as keyof typeof JOBS_RISK_RULE_DEFAULTS, ruleOverrides.get(rule.ruleCode));

    if (!mergedConfig.isActive) {
      return results;
    }

    const outcome = rule.evaluate(context, mergedConfig);
    return outcome ? [...results, outcome] : results;
  }, []);
}
