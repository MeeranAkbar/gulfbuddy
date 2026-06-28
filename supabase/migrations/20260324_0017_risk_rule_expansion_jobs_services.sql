insert into risk.risk_detection_rules (
  section,
  rule_code,
  rule_name,
  severity,
  score_delta,
  action_type,
  is_active,
  config_json
)
values
  ('jobs', 'jobs_missing_employer_identity', 'Employer identity missing', 'high', 60, 'pending_review', true, '{}'::jsonb),
  ('jobs', 'jobs_incomplete_listing', 'Job listing missing key fields', 'medium', 30, 'pending_review', true, '{}'::jsonb),
  ('jobs', 'jobs_suspicious_salary_bait', 'Job salary looks suspicious', 'medium', 40, 'pending_review', true, '{"monthlySalaryFloor":500}'::jsonb),
  ('jobs', 'jobs_suspicious_external_apply_link', 'External apply link looks suspicious', 'high', 60, 'pending_review', true, '{}'::jsonb),
  ('jobs', 'jobs_scam_phrase_match', 'Scam or payment-demand wording detected', 'critical', 100, 'block', true, '{"phrases":["visa fee","processing fee","deposit required","pay to apply","registration fee"]}'::jsonb),
  ('jobs', 'jobs_duplicate_listing', 'Duplicate job listing suspected', 'high', 80, 'pending_review', true, '{}'::jsonb),
  ('jobs', 'jobs_unverified_employer_high_frequency', 'Unverified employer posting at high frequency', 'medium', 50, 'pending_review', true, '{"activeJobThreshold":3}'::jsonb),
  ('services', 'services_missing_provider_identity', 'Service provider identity missing', 'high', 60, 'pending_review', true, '{}'::jsonb),
  ('services', 'services_missing_service_coverage', 'Provider service area missing', 'medium', 30, 'pending_review', true, '{}'::jsonb),
  ('services', 'services_missing_offering', 'Provider has no active service offering', 'medium', 30, 'pending_review', true, '{}'::jsonb),
  ('services', 'services_unverified_contact_identity', 'Provider contact identity is not verified', 'medium', 40, 'pending_review', true, '{}'::jsonb),
  ('services', 'services_suspicious_pricing_bait', 'Service pricing looks suspicious', 'medium', 40, 'pending_review', true, '{"minimumBasePrice":10}'::jsonb),
  ('services', 'services_copied_profile_text', 'Copied provider profile text suspected', 'high', 60, 'pending_review', true, '{}'::jsonb),
  ('services', 'services_unverified_provider_high_activity', 'Unverified provider has unusually high activity', 'low', 20, 'warning', true, '{"activeOfferingThreshold":4}'::jsonb)
on conflict (section, rule_code) do update
set
  rule_name = excluded.rule_name,
  severity = excluded.severity,
  score_delta = excluded.score_delta,
  action_type = excluded.action_type,
  is_active = excluded.is_active,
  config_json = excluded.config_json,
  updated_at = now();
