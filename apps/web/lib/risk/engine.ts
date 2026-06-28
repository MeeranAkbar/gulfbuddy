import type { Section } from '@gulfbuddy/types';
import { RISK_QUEUE_BY_SECTION } from './constants';
import { collectBlockingReasons, collectReasonCodes, collectWarnings, derivePublicationState, deriveQueuePriority, deriveRiskState } from './scoring';
import { evaluatePropertyRiskRules, loadPropertyRiskContext } from './rules/property';
import { evaluateJobsRiskRules, loadJobsRiskContext } from './rules/jobs';
import { evaluateServicesRiskRules, loadServicesRiskContext } from './rules/services';
import { evaluateMotorsRiskRules, loadMotorsRiskContext } from './rules/motors';
import { evaluateClassifiedsRiskRules, loadClassifiedsRiskContext } from './rules/classifieds';
import { evaluateDirectoryRiskRules, loadDirectoryRiskContext } from './rules/directory';
import type { AutoCheckOutcome, RiskRuleConfig } from './types';
import { createSupabaseServerClient } from '../supabase/server';

async function loadRuleOverrides(section: Section) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .schema('risk')
    .from('risk_detection_rules')
    .select('rule_code,rule_name,severity,score_delta,action_type,is_active,config_json')
    .eq('section', section)
    .eq('is_active', true);

  return new Map<string, RiskRuleConfig>(
    (data || []).map((rule) => [
      rule.rule_code,
      {
        ruleCode: rule.rule_code,
        ruleName: rule.rule_name,
        severity: rule.severity,
        scoreDelta: rule.score_delta,
        actionType: rule.action_type,
        isActive: rule.is_active,
        config: (rule.config_json || {}) as Record<string, unknown>
      }
    ])
  );
}

function deriveQueueType(section: Section, reasonCodes: string[]) {
  if (section === 'property' && reasonCodes.some((code) => code.includes('duplicate'))) {
    return 'property_duplicate';
  }

  return RISK_QUEUE_BY_SECTION[section];
}

async function persistAutoCheck(outcome: AutoCheckOutcome) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('record_listing_auto_check', {
    payload: {
      listingId: outcome.listingId,
      section: outcome.section,
      totalScore: outcome.totalScore,
      riskState: outcome.riskState,
      publicationState: outcome.publicationState,
      queueType: outcome.queueType,
      queuePriority: outcome.queuePriority,
      reasonCodes: outcome.reasonCodes,
      blockingReasons: outcome.blockingReasons,
      warnings: outcome.warnings,
      results: outcome.triggeredRules.map((rule) => ({
        ruleCode: rule.ruleCode,
        ruleName: rule.ruleName,
        severity: rule.severity,
        scoreDelta: rule.scoreDelta,
        actionType: rule.actionType,
        message: rule.message,
        metadata: rule.metadata
      }))
    }
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function refreshTrustProfiles(listingId: string, section: Section) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('refresh_listing_trust_profiles', {
    payload: {
      listingId,
      section
    }
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function runListingAutoChecks(listingId: string, section: Section): Promise<AutoCheckOutcome> {
  const ruleOverrides = await loadRuleOverrides(section);

  const supabase = await createSupabaseServerClient();

  let triggeredRules: AutoCheckOutcome['triggeredRules'] = [];

  if (section === 'property') {
    const propertyContext = await loadPropertyRiskContext(supabase, listingId);
    triggeredRules = evaluatePropertyRiskRules(propertyContext, ruleOverrides);
  } else if (section === 'jobs') {
    const jobsContext = await loadJobsRiskContext(supabase, listingId);
    triggeredRules = evaluateJobsRiskRules(jobsContext, ruleOverrides);
  } else if (section === 'services') {
    const servicesContext = await loadServicesRiskContext(supabase, listingId);
    triggeredRules = evaluateServicesRiskRules(servicesContext, ruleOverrides);
  } else if (section === 'motors') {
    const motorsContext = await loadMotorsRiskContext(supabase, listingId);
    triggeredRules = evaluateMotorsRiskRules(motorsContext, ruleOverrides);
  } else if (section === 'classifieds') {
    const classifiedsContext = await loadClassifiedsRiskContext(supabase, listingId);
    triggeredRules = evaluateClassifiedsRiskRules(classifiedsContext, ruleOverrides);
  } else if (section === 'directory') {
    const directoryContext = await loadDirectoryRiskContext(supabase, listingId);
    triggeredRules = evaluateDirectoryRiskRules(directoryContext, ruleOverrides);
  }

  const totalScore = triggeredRules.reduce((sum, rule) => sum + rule.scoreDelta, 0);
  const riskState = deriveRiskState(totalScore);
  const publicationState = derivePublicationState(totalScore);
  const blockingReasons = collectBlockingReasons(triggeredRules);
  const warnings = collectWarnings(triggeredRules);
  const reasonCodes = collectReasonCodes(triggeredRules);
  const queuePriority = deriveQueuePriority(totalScore);

  const outcome: AutoCheckOutcome = {
    listingId,
    section,
    totalScore,
    riskState,
    publicationState,
    blockingReasons,
    warnings,
    triggeredRules,
    queueType: queuePriority ? deriveQueueType(section, reasonCodes) : null,
    queuePriority,
    reasonCodes
  };

  await persistAutoCheck(outcome);
  await refreshTrustProfiles(listingId, section);
  return outcome;
}
