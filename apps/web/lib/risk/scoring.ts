import type { PublicationState, RiskState } from '@gulfbuddy/types';
import { RISK_SCORE_THRESHOLDS } from './constants';
import type { ModerationQueuePriority, TriggeredRiskRule } from './types';

export function deriveRiskState(totalScore: number): RiskState {
  if (totalScore >= 100) return 'blocked';
  if (totalScore >= 80) return 'high';
  if (totalScore >= 50) return 'medium';
  if (totalScore >= 20) return 'low';
  return 'normal';
}

export function derivePublicationState(totalScore: number): PublicationState {
  if (totalScore > RISK_SCORE_THRESHOLDS.highMax) return 'rejected';
  if (totalScore > RISK_SCORE_THRESHOLDS.mediumMax) return 'flagged';
  if (totalScore > RISK_SCORE_THRESHOLDS.lowMax) return 'pending_review';
  if (totalScore > RISK_SCORE_THRESHOLDS.normalMax) return 'flagged';
  return 'auto_checked';
}

export function deriveQueuePriority(totalScore: number): ModerationQueuePriority | null {
  if (totalScore >= 100) return 'urgent';
  if (totalScore >= 80) return 'high';
  if (totalScore >= 50) return 'medium';
  return null;
}

export function collectBlockingReasons(triggeredRules: TriggeredRiskRule[]) {
  return triggeredRules.filter((rule) => rule.actionType === 'block').map((rule) => rule.message);
}

export function collectWarnings(triggeredRules: TriggeredRiskRule[]) {
  return triggeredRules.filter((rule) => rule.actionType === 'warning').map((rule) => rule.message);
}

export function collectReasonCodes(triggeredRules: TriggeredRiskRule[]) {
  return triggeredRules.map((rule) => rule.ruleCode);
}
