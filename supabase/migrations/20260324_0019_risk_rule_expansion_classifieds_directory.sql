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
  ('classifieds', 'classifieds_incomplete_listing', 'Classified listing missing key fields', 'medium', 30, 'pending_review', true, '{"minimumImageCount":1}'::jsonb),
  ('classifieds', 'classifieds_prohibited_phrase_match', 'Prohibited or spam wording detected', 'critical', 100, 'block', true, '{"phrases":["telegram only","contact off platform","replica","copy brand","crypto only"]}'::jsonb),
  ('classifieds', 'classifieds_suspicious_low_price', 'Suspiciously low classifieds price', 'medium', 40, 'pending_review', true, '{"minimumPrice":5}'::jsonb),
  ('classifieds', 'classifieds_duplicate_listing', 'Duplicate classifieds listing suspected', 'high', 80, 'block', true, '{}'::jsonb),
  ('classifieds', 'classifieds_new_account_high_frequency', 'High-frequency posting from low-trust account', 'medium', 50, 'pending_review', true, '{"activeListingThreshold":5}'::jsonb),
  ('directory', 'directory_missing_business_identity', 'Directory business identity missing', 'high', 60, 'pending_review', true, '{}'::jsonb),
  ('directory', 'directory_incomplete_profile', 'Directory profile missing key fields', 'medium', 30, 'pending_review', true, '{}'::jsonb),
  ('directory', 'directory_missing_public_contact', 'Directory profile missing public contact details', 'medium', 40, 'pending_review', true, '{}'::jsonb),
  ('directory', 'directory_duplicate_business_profile', 'Duplicate business profile suspected', 'high', 80, 'pending_review', true, '{}'::jsonb)
on conflict (section, rule_code) do update
set
  rule_name = excluded.rule_name,
  severity = excluded.severity,
  score_delta = excluded.score_delta,
  action_type = excluded.action_type,
  is_active = excluded.is_active,
  config_json = excluded.config_json,
  updated_at = now();
