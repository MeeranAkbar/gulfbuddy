insert into monetization.package_catalog (code, name, section, product_type, billing_model, price_amount, currency, duration_days, entitlement_rules_json, active)
values
  ('free-basic', 'Free Basic', null, 'listing_plan', 'free', 0, 'AED', 30, '{"listing_limit": 3, "featured": false}'::jsonb, true),
  ('property-featured', 'Property Featured', 'property', 'listing_plan', 'one_time', 199, 'AED', 30, '{"priority_bucket": "featured", "listing_limit": 1}'::jsonb, true),
  ('property-developer-launch', 'Developer Launch', 'property', 'listing_plan', 'subscription', 2999, 'AED', 30, '{"priority_bucket": "developer_launch", "project_slots": 5, "hero_campaign": true}'::jsonb, true),
  ('motors-featured', 'Motors Featured', 'motors', 'listing_plan', 'one_time', 149, 'AED', 30, '{"priority_bucket": "featured", "listing_limit": 1}'::jsonb, true),
  ('jobs-free-starter-employer', 'Jobs Free Starter Employer', 'jobs', 'listing_plan', 'free', 0, 'AED', 30, '{"active_job_limit": 2, "featured": false}'::jsonb, true),
  ('jobs-hiring-pro', 'Jobs Hiring Pro', 'jobs', 'listing_plan', 'subscription', 499, 'AED', 30, '{"active_job_limit": 10, "featured_slots": 2, "recruiter_seats": 3}'::jsonb, true),
  ('jobs-featured-boost', 'Jobs Featured Boost', 'jobs', 'listing_promotion', 'one_time', 79, 'AED', 14, '{"priority_bucket": "featured", "highlight_badge": true}'::jsonb, true),
  ('services-free-provider', 'Services Free Provider', 'services', 'listing_plan', 'free', 0, 'AED', 30, '{"request_limit": 25, "featured": false, "commission_mode": "tracked_only"}'::jsonb, true),
  ('services-featured-provider', 'Services Featured Provider', 'services', 'listing_plan', 'subscription', 249, 'AED', 30, '{"featured_slots": 1, "priority_bucket": "featured", "premium_profile": true}'::jsonb, true),
  ('services-urgent-lead-boost', 'Services Urgent Lead Boost', 'services', 'listing_promotion', 'one_time', 59, 'AED', 7, '{"priority_bucket": "urgent", "lead_boost": true}'::jsonb, true),
  ('banner-hero', 'Hero Banner Campaign', null, 'banner_campaign', 'one_time', 999, 'AED', 7, '{"slot_scope": "hero", "creative_types": ["image", "gif", "webp"]}'::jsonb, true)
on conflict (code) do nothing;

insert into monetization.ad_slots (section, page_type, slot_code, slot_name, dimensions, media_rules_json, max_campaigns, active)
values
  (null, 'home', 'home_hero', 'Homepage Hero', '1440x420', '{"types":["image","gif","webp"]}'::jsonb, 1, true),
  ('motors', 'landing', 'motors_hero', 'Motors Hero', '1440x320', '{"types":["image","gif","webp"]}'::jsonb, 1, true),
  ('motors', 'listing_stream', 'motors_inline', 'Motors Inline', '960x320', '{"types":["image","gif","webp"]}'::jsonb, 3, true),
  ('property', 'landing', 'property_hero', 'Property Hero', '1440x360', '{"types":["image","gif","webp"]}'::jsonb, 1, true),
  ('property', 'sidebar', 'property_sidebar', 'Property Sidebar', '336x600', '{"types":["image","gif","webp"]}'::jsonb, 2, true),
  ('services', 'landing', 'services_hero', 'Services Hero', '1440x360', '{"types":["image","gif","webp"]}'::jsonb, 1, true),
  ('services', 'listing_stream', 'services_inline', 'Services Inline', '960x320', '{"types":["image","gif","webp"]}'::jsonb, 3, true),
  ('services', 'sidebar', 'services_sidebar', 'Services Sidebar', '336x600', '{"types":["image","gif","webp"]}'::jsonb, 2, true)
on conflict (slot_code) do nothing;
