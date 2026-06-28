import { createSupabaseServerClient } from '../supabase/server';

export interface AdminSettingItem {
  key: string;
  environment: string;
  updated_at: string;
}

export interface AdminSettingsSectionMetric {
  section: string;
  activePackages: number;
  activeSlots: number;
  liveListings: number;
}

export interface AdminSettingsSnapshot {
  totalSettings: number;
  activePackages: number;
  activeSlots: number;
  publicProfiles: number;
  verifiedCompanies: number;
  recentSettings: AdminSettingItem[];
  sectionMetrics: AdminSettingsSectionMetric[];
}

export async function getAdminSettingsSnapshot(): Promise<AdminSettingsSnapshot> {
  const supabase = await createSupabaseServerClient();

  const [{ data: settings }, { data: packages }, { data: slots }, { data: companies }, { data: listings }] = await Promise.all([
    supabase.schema('ops').from('system_settings').select('key,environment,updated_at').order('updated_at', { ascending: false }).limit(18),
    supabase.schema('monetization').from('package_catalog').select('section,active'),
    supabase.schema('monetization').from('ad_slots').select('section,active'),
    supabase.schema('company').from('companies').select('id,public_profile_enabled,verification_status'),
    supabase.schema('listing').from('listing_core').select('section,publication_state')
  ]);

  const sectionMetricsBySection = new Map<string, AdminSettingsSectionMetric>();

  (packages || []).forEach((item) => {
    const key = item.section || 'platform';
    const current = sectionMetricsBySection.get(key) || { section: key, activePackages: 0, activeSlots: 0, liveListings: 0 };

    if (item.active) {
      current.activePackages += 1;
    }

    sectionMetricsBySection.set(key, current);
  });

  (slots || []).forEach((item) => {
    const key = item.section || 'platform';
    const current = sectionMetricsBySection.get(key) || { section: key, activePackages: 0, activeSlots: 0, liveListings: 0 };

    if (item.active) {
      current.activeSlots += 1;
    }

    sectionMetricsBySection.set(key, current);
  });

  (listings || []).forEach((item) => {
    const current = sectionMetricsBySection.get(item.section) || {
      section: item.section,
      activePackages: 0,
      activeSlots: 0,
      liveListings: 0
    };

    if (item.publication_state === 'published' || item.publication_state === 'approved') {
      current.liveListings += 1;
    }

    sectionMetricsBySection.set(item.section, current);
  });

  return {
    totalSettings: (settings || []).length,
    activePackages: (packages || []).filter((item) => item.active).length,
    activeSlots: (slots || []).filter((item) => item.active).length,
    publicProfiles: (companies || []).filter((company) => company.public_profile_enabled).length,
    verifiedCompanies: (companies || []).filter((company) => company.verification_status === 'verified').length,
    recentSettings: settings || [],
    sectionMetrics: Array.from(sectionMetricsBySection.values())
  };
}
