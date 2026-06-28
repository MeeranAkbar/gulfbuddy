import type { LeadEventType, Section } from '@gulfbuddy/types';

export interface AnalyticsEvent {
  name: string;
  section?: Section;
  listingId?: string;
  companyId?: string;
  eventType?: LeadEventType;
  metadata?: Record<string, unknown>;
}

export function toAnalyticsPayload(event: AnalyticsEvent) {
  return {
    ...event,
    at: new Date().toISOString()
  };
}
