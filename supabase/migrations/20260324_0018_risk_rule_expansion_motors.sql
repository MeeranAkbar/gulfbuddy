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
  ('motors', 'motors_missing_seller_identity', 'Motors seller identity missing', 'high', 60, 'pending_review', true, '{}'::jsonb),
  ('motors', 'motors_incomplete_vehicle_data', 'Vehicle listing missing key fields', 'medium', 30, 'pending_review', true, '{"minimumImageCount":3}'::jsonb),
  ('motors', 'motors_fake_teaser_price', 'Vehicle pricing looks suspicious', 'medium', 40, 'pending_review', true, '{"minimumPrice":1000}'::jsonb),
  ('motors', 'motors_duplicate_listing', 'Duplicate vehicle listing suspected', 'high', 80, 'block', true, '{}'::jsonb),
  ('motors', 'motors_suspicious_mileage_year', 'Vehicle mileage and year combination looks suspicious', 'medium', 40, 'pending_review', true, '{"futureYearTolerance":1,"highMileageForNewVehicle":1000}'::jsonb),
  ('motors', 'motors_unverified_seller_high_frequency', 'Unverified seller posting at high frequency', 'medium', 50, 'pending_review', true, '{"activeListingThreshold":3}'::jsonb),
  ('motors', 'motors_repeat_rejections', 'Motors poster has repeated rejected listings', 'medium', 30, 'pending_review', true, '{"rejectionThreshold":2}'::jsonb)
on conflict (section, rule_code) do update
set
  rule_name = excluded.rule_name,
  severity = excluded.severity,
  score_delta = excluded.score_delta,
  action_type = excluded.action_type,
  is_active = excluded.is_active,
  config_json = excluded.config_json,
  updated_at = now();
