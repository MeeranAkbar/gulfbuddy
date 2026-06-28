export const appConfig = {
  brand: 'GulfHabibi',
  productionDomain: 'gulfhabibi.com',
  stagingDomains: ['natuaralcureguide.com'],
  locales: ['en', 'ar'] as const,
  sections: ['property', 'motors', 'jobs', 'classifieds', 'services', 'directory'] as const
};

export const featureFlags = {
  propertyComplianceStrict: true,
  abudhabiPropertyManualReview: true,
  holidayHomesLaunchReady: false,
  motorsDealerDashboards: false,
  adSelfServeUpload: false,
  crmSyncEnabled: false,
  aiAutoFixSafeMode: true
};
