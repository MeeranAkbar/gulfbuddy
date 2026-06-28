-- GulfHabibi staging bootstrap bundle
-- Generated locally on 2026-03-25
-- Apply in Supabase SQL editor in a safe staging project


-- >>> BEGIN 20260324_0001_core_foundation.sql <<<

create extension if not exists pgcrypto;

create schema if not exists core;
create schema if not exists company;
create schema if not exists listing;
create schema if not exists property;
create schema if not exists motors;
create schema if not exists jobs;
create schema if not exists services;
create schema if not exists directory;
create schema if not exists monetization;
create schema if not exists lead;
create schema if not exists risk;
create schema if not exists compliance;
create schema if not exists ops;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'section_type') then
    create type section_type as enum ('property', 'motors', 'jobs', 'classifieds', 'services', 'directory');
  end if;
  if not exists (select 1 from pg_type where typname = 'publication_state_type') then
    create type publication_state_type as enum ('draft', 'submitted', 'pending_review', 'approved', 'published', 'rejected', 'expired', 'suspended');
  end if;
  if not exists (select 1 from pg_type where typname = 'compliance_state_type') then
    create type compliance_state_type as enum ('not_required', 'required_pending', 'under_review', 'verified', 'failed', 'expired');
  end if;
  if not exists (select 1 from pg_type where typname = 'risk_state_type') then
    create type risk_state_type as enum ('normal', 'watch', 'restricted', 'suspended');
  end if;
  if not exists (select 1 from pg_type where typname = 'monetization_state_type') then
    create type monetization_state_type as enum ('none', 'entitled', 'active', 'exhausted', 'expired');
  end if;
  if not exists (select 1 from pg_type where typname = 'company_type_enum') then
    create type company_type_enum as enum ('agency', 'dealer', 'developer', 'employer', 'service_provider', 'directory_business');
  end if;
  if not exists (select 1 from pg_type where typname = 'seller_type_enum') then
    create type seller_type_enum as enum ('individual', 'owner', 'agency', 'broker', 'dealer', 'developer', 'business');
  end if;
  if not exists (select 1 from pg_type where typname = 'lead_event_type_enum') then
    create type lead_event_type_enum as enum ('call_click', 'whatsapp_click', 'number_reveal', 'inquiry_submit', 'email_click', 'company_profile_click', 'premium_listing_click', 'banner_click', 'save_listing', 'share_listing');
  end if;
end $$;

create table if not exists core.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text,
  phone text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists core.profiles (
  user_id uuid primary key references core.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  preferred_language text not null default 'en',
  country_code text,
  city text,
  bio text,
  is_phone_verified boolean not null default false,
  is_email_verified boolean not null default false,
  is_identity_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists company.companies (
  id uuid primary key default gen_random_uuid(),
  company_type company_type_enum not null,
  legal_name text not null,
  display_name text not null,
  slug text not null unique,
  description text,
  website text,
  logo_url text,
  cover_image_url text,
  license_number text,
  license_authority text,
  license_expiry date,
  verification_status text not null default 'pending',
  trust_tier text not null default 'starter',
  billing_status text not null default 'inactive',
  public_profile_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists company.company_branches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references company.companies(id) on delete cascade,
  name text not null,
  emirate text,
  area text,
  address text,
  phone text,
  email text,
  manager_user_id uuid references core.users(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists company.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references company.companies(id) on delete cascade,
  user_id uuid not null references core.users(id) on delete cascade,
  role text not null,
  permissions_json jsonb not null default '[]'::jsonb,
  branch_id uuid references company.company_branches(id),
  is_primary boolean not null default false,
  status text not null default 'invited',
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table if not exists listing.listing_core (
  id uuid primary key default gen_random_uuid(),
  section section_type not null,
  owner_user_id uuid not null references core.users(id),
  owner_company_id uuid references company.companies(id),
  branch_id uuid references company.company_branches(id),
  seller_type seller_type_enum not null,
  slug text not null unique,
  title text not null,
  description text not null,
  emirate text not null,
  area text,
  area_slug text,
  location_text text,
  lat numeric(9,6),
  lng numeric(9,6),
  price_amount numeric(14,2),
  price_currency text not null default 'AED',
  visibility_state text not null default 'public',
  publication_state publication_state_type not null default 'draft',
  risk_state risk_state_type not null default 'normal',
  monetization_state monetization_state_type not null default 'none',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  expires_at timestamptz
);

create index if not exists listing_core_section_state_idx on listing.listing_core(section, publication_state, emirate);

create table if not exists listing.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  media_type text not null,
  storage_path text not null,
  public_url text,
  alt_text text,
  sort_order integer not null default 0,
  width integer,
  height integer,
  checksum text,
  is_primary boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists listing.listing_contacts (
  listing_id uuid primary key references listing.listing_core(id) on delete cascade,
  public_phone text,
  public_whatsapp text,
  public_email text,
  hide_number_until_click boolean not null default false,
  click_to_reveal_enabled boolean not null default true,
  preferred_contact_method text not null default 'phone'
);

create table if not exists property.property_listing_details (
  listing_id uuid primary key references listing.listing_core(id) on delete cascade,
  market_mode text not null,
  purpose text not null,
  property_type text not null,
  property_subtype text,
  bedrooms integer,
  bathrooms integer,
  size_sqft numeric(12,2),
  furnishing text,
  completion_status text,
  building_name text,
  community_name text,
  project_name text,
  tower_name text,
  permit_display_text text,
  rent_frequency text,
  is_short_term boolean not null default false,
  is_project_listing boolean not null default false,
  handover_date date,
  parking_spaces integer,
  service_charges numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists property.property_compliance (
  listing_id uuid primary key references listing.listing_core(id) on delete cascade,
  regulator_region text not null,
  advertiser_type text not null,
  permit_system text not null,
  permit_number text,
  permit_qr_payload text,
  permit_issue_date date,
  permit_expiry_date date,
  broker_card_number text,
  agency_license_ref text,
  developer_license_ref text,
  ownership_proof_ref text,
  holiday_home_operator_ref text,
  holiday_home_unit_ref text,
  verification_status compliance_state_type not null default 'required_pending',
  verification_method text not null default 'manual',
  manual_review_required boolean not null default true,
  compliance_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists motors.motor_listing_details (
  listing_id uuid primary key references listing.listing_core(id) on delete cascade,
  listing_type text not null,
  vehicle_type text not null,
  make text not null,
  model text not null,
  trim text,
  year integer not null,
  mileage integer,
  condition text not null,
  fuel_type text,
  transmission text,
  drivetrain text,
  body_type text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists monetization.package_catalog (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  section section_type,
  product_type text not null,
  billing_model text not null,
  price_amount numeric(12,2) not null,
  currency text not null default 'AED',
  duration_days integer,
  entitlement_rules_json jsonb not null default '{}'::jsonb,
  active boolean not null default true
);

create table if not exists monetization.package_orders (
  id uuid primary key default gen_random_uuid(),
  buyer_user_id uuid references core.users(id),
  buyer_company_id uuid references company.companies(id),
  package_id uuid not null references monetization.package_catalog(id),
  amount_paid numeric(12,2) not null,
  currency text not null default 'AED',
  payment_status text not null default 'pending',
  payment_provider text,
  order_metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists monetization.package_entitlements (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references monetization.package_orders(id) on delete cascade,
  company_id uuid references company.companies(id),
  user_id uuid references core.users(id),
  section section_type,
  entitlement_type text not null,
  quantity integer not null default 1,
  start_at timestamptz not null,
  end_at timestamptz,
  status text not null default 'active',
  rules_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists monetization.ad_slots (
  id uuid primary key default gen_random_uuid(),
  section section_type,
  page_type text not null,
  slot_code text not null unique,
  slot_name text not null,
  dimensions text,
  media_rules_json jsonb not null default '{}'::jsonb,
  max_campaigns integer not null default 1,
  active boolean not null default true
);

create table if not exists monetization.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_company_id uuid references company.companies(id),
  owner_user_id uuid references core.users(id),
  package_order_id uuid references monetization.package_orders(id),
  campaign_type text not null,
  target_url text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'draft',
  approval_state text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lead.lead_events (
  id uuid primary key default gen_random_uuid(),
  section section_type not null,
  listing_id uuid references listing.listing_core(id),
  company_id uuid references company.companies(id),
  assigned_user_id uuid references core.users(id),
  visitor_session_id text,
  visitor_user_id uuid references core.users(id),
  event_type lead_event_type_enum not null,
  source_page text,
  source_context text,
  campaign_id uuid references monetization.campaigns(id),
  entitlement_id uuid references monetization.package_entitlements(id),
  utm_json jsonb not null default '{}'::jsonb,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists risk.risk_events (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null,
  actor_id uuid,
  entity_type text not null,
  entity_id uuid,
  signal_type text not null,
  score_delta integer not null default 0,
  severity text not null default 'low',
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists compliance.compliance_cases (
  id uuid primary key default gen_random_uuid(),
  section section_type not null,
  listing_id uuid references listing.listing_core(id),
  company_id uuid references company.companies(id),
  user_id uuid references core.users(id),
  case_type text not null,
  compliance_state compliance_state_type not null default 'required_pending',
  priority integer not null default 2,
  assigned_to uuid references core.users(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists compliance.moderation_cases (
  id uuid primary key default gen_random_uuid(),
  section section_type not null,
  listing_id uuid references listing.listing_core(id),
  company_id uuid references company.companies(id),
  user_id uuid references core.users(id),
  moderation_state text not null default 'pending_review',
  reason_code text,
  queue text not null default 'default',
  assigned_to uuid references core.users(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null,
  actor_id uuid,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists ops.system_settings (
  key text primary key,
  value_json jsonb not null default '{}'::jsonb,
  environment text not null default 'production',
  updated_by uuid references core.users(id),
  updated_at timestamptz not null default now()
);

-- <<< END 20260324_0001_core_foundation.sql >>>


-- >>> BEGIN 20260324_0002_public_views_and_rls.sql <<<

alter table core.users enable row level security;
alter table core.profiles enable row level security;
alter table company.companies enable row level security;
alter table company.company_branches enable row level security;
alter table company.company_members enable row level security;
alter table listing.listing_core enable row level security;
alter table listing.listing_media enable row level security;
alter table listing.listing_contacts enable row level security;
alter table property.property_listing_details enable row level security;
alter table property.property_compliance enable row level security;
alter table motors.motor_listing_details enable row level security;
alter table monetization.package_catalog enable row level security;
alter table monetization.package_orders enable row level security;
alter table monetization.package_entitlements enable row level security;
alter table monetization.ad_slots enable row level security;
alter table monetization.campaigns enable row level security;
alter table lead.lead_events enable row level security;
alter table risk.risk_events enable row level security;
alter table compliance.compliance_cases enable row level security;
alter table compliance.moderation_cases enable row level security;
alter table ops.audit_logs enable row level security;
alter table ops.system_settings enable row level security;

create or replace function core.current_user_id()
returns uuid
language sql
stable
as $$
  select u.id
  from core.users u
  where u.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function company.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from company.company_members cm
    where cm.company_id = target_company_id
      and cm.user_id = core.current_user_id()
      and cm.status = 'active'
  )
$$;

create policy users_self_select on core.users
for select to authenticated
using (id = core.current_user_id());

create policy profiles_self_all on core.profiles
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy companies_member_select on company.companies
for select to authenticated
using (company.is_company_member(id));

create policy company_branches_member_access on company.company_branches
for all to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create policy company_members_member_select on company.company_members
for select to authenticated
using (company.is_company_member(company_id));

create policy listing_core_owner_or_company_select on listing.listing_core
for select to authenticated
using (
  owner_user_id = core.current_user_id()
  or (owner_company_id is not null and company.is_company_member(owner_company_id))
);

create policy listing_core_owner_or_company_insert on listing.listing_core
for insert to authenticated
with check (
  owner_user_id = core.current_user_id()
  and (owner_company_id is null or company.is_company_member(owner_company_id))
);

create policy listing_core_owner_or_company_update on listing.listing_core
for update to authenticated
using (
  owner_user_id = core.current_user_id()
  or (owner_company_id is not null and company.is_company_member(owner_company_id))
)
with check (
  owner_user_id = core.current_user_id()
  or (owner_company_id is not null and company.is_company_member(owner_company_id))
);

create policy package_catalog_public_read on monetization.package_catalog
for select to authenticated, anon
using (active = true);

create policy ad_slots_public_read on monetization.ad_slots
for select to authenticated, anon
using (active = true);

create or replace view public.property_search_public_v1 as
select
  lc.id,
  lc.slug,
  lc.title,
  lc.emirate,
  lc.area,
  lc.location_text,
  lc.price_amount,
  lc.price_currency,
  lc.published_at,
  p.purpose,
  p.property_type,
  p.property_subtype,
  p.bedrooms,
  p.bathrooms,
  p.size_sqft,
  p.furnishing,
  p.completion_status,
  p.building_name,
  p.community_name,
  p.project_name
from listing.listing_core lc
join property.property_listing_details p on p.listing_id = lc.id
where lc.section = 'property'
  and lc.publication_state = 'published'
  and lc.visibility_state = 'public';

create or replace view public.motors_search_public_v1 as
select
  lc.id,
  lc.slug,
  lc.title,
  lc.emirate,
  lc.area,
  lc.location_text,
  lc.price_amount,
  lc.price_currency,
  lc.published_at,
  m.vehicle_type,
  m.make,
  m.model,
  m.trim,
  m.year,
  m.mileage,
  m.condition
from listing.listing_core lc
join motors.motor_listing_details m on m.listing_id = lc.id
where lc.section = 'motors'
  and lc.publication_state = 'published'
  and lc.visibility_state = 'public';

grant select on public.property_search_public_v1 to anon, authenticated;
grant select on public.motors_search_public_v1 to anon, authenticated;

-- <<< END 20260324_0002_public_views_and_rls.sql >>>


-- >>> BEGIN 20260324_0003_jobs_module.sql <<<

create table if not exists jobs.candidate_profiles (
  user_id uuid primary key references core.users(id) on delete cascade,
  slug text unique,
  headline text,
  current_location text,
  nationality text,
  visa_status text,
  total_experience_years numeric(4,1),
  expected_salary_min numeric(12,2),
  expected_salary_max numeric(12,2),
  salary_currency text,
  preferred_emirates_json jsonb not null default '[]'::jsonb,
  preferred_work_modes_json jsonb not null default '[]'::jsonb,
  summary text,
  searchable_by_employers boolean not null default false,
  profile_visibility text not null default 'private',
  profile_strength_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs.candidate_cv_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  storage_path text not null,
  public_filename text not null,
  file_type text not null,
  file_size bigint not null,
  parsing_status text not null default 'pending',
  parsed_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs.candidate_experience (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  company_name text not null,
  role_title text not null,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  location text,
  description text,
  sort_order integer not null default 0
);

create table if not exists jobs.candidate_education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  institution text not null,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  grade text,
  description text,
  sort_order integer not null default 0
);

create table if not exists jobs.candidate_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  skill_name text not null,
  proficiency_level text,
  years_of_experience numeric(4,1)
);

create table if not exists jobs.candidate_languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  language_name text not null,
  proficiency_level text
);

create table if not exists jobs.candidate_certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  certification_name text not null,
  issuer text,
  issue_date date,
  expiry_date date,
  credential_url text
);

create table if not exists jobs.job_listing_details (
  listing_id uuid primary key references listing.listing_core(id) on delete cascade,
  job_title text not null,
  employment_type text not null,
  work_mode text not null,
  salary_min numeric(12,2),
  salary_max numeric(12,2),
  salary_currency text,
  salary_period text,
  experience_level text,
  industry text,
  department text,
  education_level text,
  visa_support text,
  application_mode text not null default 'internal',
  application_email text,
  application_url text,
  openings_count integer,
  urgent_hiring boolean not null default false,
  valid_through timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs.job_requirements (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  requirement_type text not null,
  value_text text not null,
  sort_order integer not null default 0
);

create table if not exists jobs.job_applications (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  candidate_user_id uuid not null references core.users(id) on delete cascade,
  candidate_cv_file_id uuid references jobs.candidate_cv_files(id),
  application_status text not null default 'submitted',
  source text,
  applied_at timestamptz not null default now(),
  recruiter_notes text,
  cover_note text,
  last_updated_at timestamptz not null default now(),
  unique (listing_id, candidate_user_id)
);

create table if not exists jobs.job_saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create table if not exists jobs.job_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  keywords text,
  emirates_json jsonb not null default '[]'::jsonb,
  categories_json jsonb not null default '[]'::jsonb,
  salary_min numeric(12,2),
  work_modes_json jsonb not null default '[]'::jsonb,
  frequency text not null default 'weekly',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs.employer_profiles (
  company_id uuid primary key references company.companies(id) on delete cascade,
  hiring_email text,
  hiring_phone text,
  public_careers_url text,
  verification_status text not null default 'pending',
  hiring_status text not null default 'open',
  response_time_score integer,
  profile_strength_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table jobs.candidate_profiles enable row level security;
alter table jobs.candidate_cv_files enable row level security;
alter table jobs.candidate_experience enable row level security;
alter table jobs.candidate_education enable row level security;
alter table jobs.candidate_skills enable row level security;
alter table jobs.candidate_languages enable row level security;
alter table jobs.candidate_certifications enable row level security;
alter table jobs.job_listing_details enable row level security;
alter table jobs.job_requirements enable row level security;
alter table jobs.job_applications enable row level security;
alter table jobs.job_saved_items enable row level security;
alter table jobs.job_alerts enable row level security;
alter table jobs.employer_profiles enable row level security;

create policy candidate_profiles_self_all on jobs.candidate_profiles
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_cv_self_all on jobs.candidate_cv_files
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_experience_self_all on jobs.candidate_experience
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_education_self_all on jobs.candidate_education
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_skills_self_all on jobs.candidate_skills
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_languages_self_all on jobs.candidate_languages
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_certifications_self_all on jobs.candidate_certifications
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy job_listing_details_owner_or_company_access on jobs.job_listing_details
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy job_requirements_owner_or_company_access on jobs.job_requirements
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy job_saved_items_self_all on jobs.job_saved_items
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy job_alerts_self_all on jobs.job_alerts
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy job_applications_candidate_select on jobs.job_applications
for select to authenticated
using (
  candidate_user_id = core.current_user_id()
  or exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and lc.owner_company_id is not null
      and company.is_company_member(lc.owner_company_id)
  )
);

create policy job_applications_candidate_insert on jobs.job_applications
for insert to authenticated
with check (candidate_user_id = core.current_user_id());

create policy job_applications_company_update on jobs.job_applications
for update to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and lc.owner_company_id is not null
      and company.is_company_member(lc.owner_company_id)
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and lc.owner_company_id is not null
      and company.is_company_member(lc.owner_company_id)
  )
);

create policy employer_profiles_company_access on jobs.employer_profiles
for all to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create or replace view public.jobs_search_public_v1 as
select
  lc.id,
  lc.slug,
  lc.title,
  lc.emirate,
  lc.area,
  lc.location_text,
  lc.published_at,
  jd.job_title,
  jd.employment_type,
  jd.work_mode,
  jd.salary_min,
  jd.salary_max,
  jd.salary_currency,
  jd.salary_period,
  jd.experience_level,
  jd.industry,
  jd.department,
  jd.urgent_hiring,
  jd.valid_through,
  c.display_name as company_name,
  c.slug as company_slug,
  c.logo_url as company_logo_url,
  ep.verification_status as employer_verification_status
from listing.listing_core lc
join jobs.job_listing_details jd on jd.listing_id = lc.id
left join company.companies c on c.id = lc.owner_company_id and c.public_profile_enabled = true
left join jobs.employer_profiles ep on ep.company_id = c.id
where lc.section = 'jobs'
  and lc.publication_state = 'published'
  and lc.visibility_state = 'public';

create or replace view public.jobs_detail_public_v1 as
select
  lc.id,
  lc.slug,
  lc.title,
  lc.description,
  lc.emirate,
  lc.area,
  lc.location_text,
  lc.published_at,
  lc.expires_at,
  jd.job_title,
  jd.employment_type,
  jd.work_mode,
  jd.salary_min,
  jd.salary_max,
  jd.salary_currency,
  jd.salary_period,
  jd.experience_level,
  jd.industry,
  jd.department,
  jd.education_level,
  jd.visa_support,
  jd.application_mode,
  jd.application_email,
  jd.application_url,
  jd.openings_count,
  jd.urgent_hiring,
  jd.valid_through,
  c.display_name as company_name,
  c.slug as company_slug,
  c.description as company_description,
  c.logo_url as company_logo_url,
  ep.verification_status as employer_verification_status,
  ep.hiring_status,
  (
    select jsonb_agg(
      jsonb_build_object(
        'requirementType', jr.requirement_type,
        'valueText', jr.value_text,
        'sortOrder', jr.sort_order
      )
      order by jr.sort_order asc, jr.id asc
    )
    from jobs.job_requirements jr
    where jr.listing_id = lc.id
  ) as requirements
from listing.listing_core lc
join jobs.job_listing_details jd on jd.listing_id = lc.id
left join company.companies c on c.id = lc.owner_company_id and c.public_profile_enabled = true
left join jobs.employer_profiles ep on ep.company_id = c.id
where lc.section = 'jobs'
  and lc.publication_state = 'published'
  and lc.visibility_state = 'public';

grant select on public.jobs_search_public_v1 to anon, authenticated;
grant select on public.jobs_detail_public_v1 to anon, authenticated;

-- <<< END 20260324_0003_jobs_module.sql >>>


-- >>> BEGIN 20260324_0004_services_module.sql <<<

create table if not exists services.service_provider_profiles (
  company_id uuid primary key references company.companies(id) on delete cascade,
  slug text not null unique,
  provider_type text not null,
  display_name text not null,
  headline text,
  bio text,
  years_in_business integer,
  verification_status text not null default 'pending',
  trust_tier text not null default 'starter',
  response_time_score integer,
  profile_strength_score integer not null default 0,
  is_accepting_requests boolean not null default true,
  emergency_service boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services.service_offerings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references company.companies(id) on delete cascade,
  category text not null,
  subcategory text,
  service_title text not null,
  description text,
  pricing_model text not null,
  base_price numeric(12,2),
  currency text default 'AED',
  pricing_notes text,
  duration_estimate text,
  is_featured_offering boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services.service_areas (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references company.companies(id) on delete cascade,
  emirate text not null,
  area text,
  area_slug text,
  coverage_type text not null,
  radius_km numeric(8,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services.service_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references company.companies(id) on delete cascade,
  title text not null,
  description text,
  media_url text not null,
  media_type text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists services.service_requests (
  id uuid primary key default gen_random_uuid(),
  public_ref text not null unique,
  customer_user_id uuid references core.users(id),
  customer_name text,
  customer_phone text,
  customer_email text,
  emirate text not null,
  area text,
  category text not null,
  subcategory text,
  request_title text not null,
  request_description text not null,
  preferred_date date,
  preferred_time text,
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  request_status text not null default 'submitted',
  source_page text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services.service_request_provider_matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references services.service_requests(id) on delete cascade,
  company_id uuid not null references company.companies(id) on delete cascade,
  match_source text not null default 'manual',
  match_status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (request_id, company_id)
);

create table if not exists services.service_quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references services.service_requests(id) on delete cascade,
  company_id uuid not null references company.companies(id) on delete cascade,
  quoted_by_user_id uuid references core.users(id),
  pricing_model text not null,
  quote_amount numeric(12,2),
  currency text default 'AED',
  estimated_duration text,
  message text,
  quote_status text not null default 'sent',
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services.service_orders (
  id uuid primary key default gen_random_uuid(),
  public_ref text not null unique,
  request_id uuid references services.service_requests(id),
  quote_id uuid references services.service_quotes(id),
  customer_user_id uuid references core.users(id),
  company_id uuid not null references company.companies(id) on delete cascade,
  assigned_staff_user_id uuid references core.users(id),
  order_type text not null,
  order_status text not null default 'created',
  subtotal_amount numeric(12,2),
  commission_amount numeric(12,2),
  total_amount numeric(12,2),
  currency text default 'AED',
  scheduled_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services.service_order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references services.service_orders(id) on delete cascade,
  previous_status text,
  new_status text not null,
  actor_type text not null,
  actor_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists services.service_reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references services.service_orders(id) on delete cascade,
  customer_user_id uuid references core.users(id),
  company_id uuid not null references company.companies(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review_text text,
  review_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists services.service_commission_ledger (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references services.service_orders(id) on delete cascade,
  company_id uuid not null references company.companies(id) on delete cascade,
  commission_type text not null,
  commission_rate numeric(8,4),
  commission_amount numeric(12,2) not null,
  currency text not null default 'AED',
  billing_status text not null default 'pending',
  payout_status text not null default 'not_applicable',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services.service_disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references services.service_orders(id) on delete cascade,
  raised_by_type text not null,
  raised_by_id uuid,
  dispute_reason text not null,
  dispute_status text not null default 'open',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table services.service_provider_profiles enable row level security;
alter table services.service_offerings enable row level security;
alter table services.service_areas enable row level security;
alter table services.service_portfolio_items enable row level security;
alter table services.service_requests enable row level security;
alter table services.service_request_provider_matches enable row level security;
alter table services.service_quotes enable row level security;
alter table services.service_orders enable row level security;
alter table services.service_order_status_history enable row level security;
alter table services.service_reviews enable row level security;
alter table services.service_commission_ledger enable row level security;
alter table services.service_disputes enable row level security;

create policy service_provider_profiles_company_access on services.service_provider_profiles
for all to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create policy service_offerings_company_access on services.service_offerings
for all to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create policy service_areas_company_access on services.service_areas
for all to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create policy service_portfolio_company_access on services.service_portfolio_items
for all to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create policy service_requests_customer_select on services.service_requests
for select to authenticated
using (
  customer_user_id = core.current_user_id()
  or exists (
    select 1
    from services.service_request_provider_matches m
    where m.request_id = id
      and company.is_company_member(m.company_id)
  )
);

create policy service_requests_customer_insert on services.service_requests
for insert to authenticated
with check (customer_user_id = core.current_user_id() or customer_user_id is null);

create policy service_request_matches_company_access on services.service_request_provider_matches
for all to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create policy service_quotes_company_select on services.service_quotes
for select to authenticated
using (
  company.is_company_member(company_id)
  or exists (
    select 1
    from services.service_requests r
    where r.id = request_id
      and r.customer_user_id = core.current_user_id()
  )
);

create policy service_quotes_company_insert on services.service_quotes
for insert to authenticated
with check (company.is_company_member(company_id));

create policy service_quotes_company_update on services.service_quotes
for update to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create policy service_orders_company_select on services.service_orders
for select to authenticated
using (
  company.is_company_member(company_id)
  or customer_user_id = core.current_user_id()
);

create policy service_orders_company_insert on services.service_orders
for insert to authenticated
with check (company.is_company_member(company_id));

create policy service_orders_company_update on services.service_orders
for update to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create policy service_order_history_company_access on services.service_order_status_history
for all to authenticated
using (
  exists (
    select 1
    from services.service_orders o
    where o.id = order_id
      and (company.is_company_member(o.company_id) or o.customer_user_id = core.current_user_id())
  )
)
with check (
  exists (
    select 1
    from services.service_orders o
    where o.id = order_id
      and company.is_company_member(o.company_id)
  )
);

create policy service_reviews_visibility on services.service_reviews
for select to authenticated
using (
  exists (
    select 1
    from services.service_orders o
    where o.id = order_id
      and (company.is_company_member(o.company_id) or o.customer_user_id = core.current_user_id())
  )
);

create policy service_reviews_customer_insert on services.service_reviews
for insert to authenticated
with check (customer_user_id = core.current_user_id());

create policy service_commission_company_select on services.service_commission_ledger
for select to authenticated
using (company.is_company_member(company_id));

create policy service_disputes_order_visibility on services.service_disputes
for select to authenticated
using (
  exists (
    select 1
    from services.service_orders o
    where o.id = order_id
      and (company.is_company_member(o.company_id) or o.customer_user_id = core.current_user_id())
  )
);

create policy service_disputes_customer_insert on services.service_disputes
for insert to authenticated
with check (
  exists (
    select 1
    from services.service_orders o
    where o.id = order_id
      and (o.customer_user_id = core.current_user_id() or company.is_company_member(o.company_id))
  )
);

create or replace view public.services_search_public_v1 as
select
  sp.slug as provider_slug,
  sp.display_name as provider_name,
  sp.provider_type,
  sp.headline,
  sp.verification_status,
  sp.trust_tier,
  sp.response_time_score,
  sp.profile_strength_score,
  sp.is_accepting_requests,
  sp.emergency_service,
  c.logo_url,
  c.cover_image_url,
  c.description as company_description,
  sa.emirate,
  sa.area,
  sa.area_slug,
  so.id as offering_id,
  so.category,
  so.subcategory,
  so.service_title,
  so.description as offering_description,
  so.pricing_model,
  so.base_price,
  so.currency,
  so.duration_estimate
from services.service_provider_profiles sp
join company.companies c on c.id = sp.company_id and c.public_profile_enabled = true
left join lateral (
  select so.*
  from services.service_offerings so
  where so.company_id = sp.company_id
    and so.is_active = true
  order by so.is_featured_offering desc, so.created_at asc
  limit 1
) so on true
left join lateral (
  select sa.*
  from services.service_areas sa
  where sa.company_id = sp.company_id
  order by sa.created_at asc
  limit 1
) sa on true
where sp.verification_status in ('pending', 'verified');

create or replace view public.service_provider_public_v1 as
select
  sp.company_id,
  sp.slug,
  sp.provider_type,
  sp.display_name,
  sp.headline,
  sp.bio,
  sp.years_in_business,
  sp.verification_status,
  sp.trust_tier,
  sp.response_time_score,
  sp.profile_strength_score,
  sp.is_accepting_requests,
  sp.emergency_service,
  c.logo_url,
  c.cover_image_url,
  c.description as company_description,
  c.website,
  (
    select jsonb_agg(
      jsonb_build_object(
        'category', so.category,
        'subcategory', so.subcategory,
        'serviceTitle', so.service_title,
        'pricingModel', so.pricing_model,
        'basePrice', so.base_price,
        'currency', so.currency,
        'durationEstimate', so.duration_estimate
      )
      order by so.is_featured_offering desc, so.created_at asc
    )
    from services.service_offerings so
    where so.company_id = sp.company_id
      and so.is_active = true
  ) as offerings,
  (
    select jsonb_agg(
      jsonb_build_object(
        'emirate', sa.emirate,
        'area', sa.area,
        'areaSlug', sa.area_slug,
        'coverageType', sa.coverage_type,
        'radiusKm', sa.radius_km
      )
      order by sa.created_at asc
    )
    from services.service_areas sa
    where sa.company_id = sp.company_id
  ) as service_areas,
  (
    select jsonb_agg(
      jsonb_build_object(
        'title', pi.title,
        'description', pi.description,
        'mediaUrl', pi.media_url,
        'mediaType', pi.media_type,
        'sortOrder', pi.sort_order
      )
      order by pi.sort_order asc, pi.created_at asc
    )
    from services.service_portfolio_items pi
    where pi.company_id = sp.company_id
  ) as portfolio_items
from services.service_provider_profiles sp
join company.companies c on c.id = sp.company_id and c.public_profile_enabled = true
where sp.verification_status in ('pending', 'verified');

grant select on public.services_search_public_v1 to anon, authenticated;
grant select on public.service_provider_public_v1 to anon, authenticated;

-- <<< END 20260324_0004_services_module.sql >>>


-- >>> BEGIN 20260324_0005_auth_company_backbone.sql <<<

create table if not exists ops.admin_members (
  user_id uuid primary key references core.users(id) on delete cascade,
  role text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ops.admin_members enable row level security;

create or replace function company.default_permissions(role text)
returns text[]
language sql
stable
as $$
  select case role
    when 'company_owner' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_users','manage_company_profile',
      'manage_company_inventory','manage_branch','upload_creatives','buy_package','assign_leads','view_company_reports',
      'export_reports','manage_campaigns','manage_billing','view_compliance_status'
    ]
    when 'company_admin' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_users','manage_company_profile',
      'manage_company_inventory','manage_branch','upload_creatives','buy_package','assign_leads','view_company_reports',
      'export_reports','manage_campaigns','view_compliance_status'
    ]
    when 'manager' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_inventory','assign_leads',
      'view_company_reports','view_compliance_status'
    ]
    when 'publisher' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_inventory','upload_creatives'
    ]
    when 'analyst' then array['view_company_reports','view_compliance_status']
    when 'billing_admin' then array['buy_package','manage_billing','view_company_reports']
    when 'viewer' then array['view_company_reports']
    when 'agency_owner' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_users','manage_company_profile',
      'manage_company_inventory','manage_branch','upload_creatives','buy_package','assign_leads','view_company_reports',
      'export_reports','manage_campaigns','manage_billing','view_compliance_status'
    ]
    when 'agency_admin' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_users','manage_company_profile',
      'manage_company_inventory','manage_branch','upload_creatives','assign_leads','view_company_reports',
      'export_reports','manage_campaigns','view_compliance_status'
    ]
    when 'branch_manager' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_inventory','manage_branch',
      'assign_leads','view_company_reports'
    ]
    when 'broker' then array['create_listing','edit_company_listing','submit_for_review','view_compliance_status']
    when 'listing_coordinator' then array['create_listing','edit_company_listing','submit_for_review','manage_company_inventory','upload_creatives']
    when 'marketing_user' then array['upload_creatives','manage_campaigns','view_company_reports']
    when 'dealer_owner' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_users','manage_company_profile',
      'manage_company_inventory','manage_branch','upload_creatives','buy_package','assign_leads','view_company_reports',
      'export_reports','manage_campaigns','manage_billing','view_compliance_status'
    ]
    when 'dealer_admin' then array[
      'create_listing','edit_company_listing','submit_for_review','manage_company_profile','manage_company_inventory',
      'manage_branch','upload_creatives','assign_leads','view_company_reports','manage_campaigns','view_compliance_status'
    ]
    when 'inventory_manager' then array['create_listing','edit_company_listing','submit_for_review','manage_company_inventory','upload_creatives']
    when 'sales_user' then array['assign_leads','view_company_reports']
    else array[]::text[]
  end
$$;

create or replace function company.member_permissions(target_company_id uuid, target_user_id uuid default core.current_user_id())
returns text[]
language sql
stable
as $$
  select coalesce(
    case
      when cm.permissions_json is not null
        and jsonb_typeof(cm.permissions_json) = 'array'
        and jsonb_array_length(cm.permissions_json) > 0
      then array(select jsonb_array_elements_text(cm.permissions_json))
      else company.default_permissions(cm.role)
    end,
    array[]::text[]
  )
  from company.company_members cm
  where cm.company_id = target_company_id
    and cm.user_id = target_user_id
    and cm.status = 'active'
  limit 1
$$;

create or replace function company.has_permission(target_company_id uuid, permission text, target_user_id uuid default core.current_user_id())
returns boolean
language sql
stable
as $$
  select permission = any(company.member_permissions(target_company_id, target_user_id))
$$;

create or replace function ops.is_admin(target_user_id uuid default core.current_user_id())
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from ops.admin_members am
    where am.user_id = target_user_id
      and am.status = 'active'
  )
$$;

drop policy if exists companies_member_select on company.companies;
drop policy if exists company_branches_member_access on company.company_branches;
drop policy if exists company_members_member_select on company.company_members;
drop policy if exists listing_core_owner_or_company_select on listing.listing_core;
drop policy if exists listing_core_owner_or_company_insert on listing.listing_core;
drop policy if exists listing_core_owner_or_company_update on listing.listing_core;

create policy admin_members_self_select on ops.admin_members
for select to authenticated
using (user_id = core.current_user_id() or ops.is_admin());

create policy companies_member_select on company.companies
for select to authenticated
using (company.is_company_member(id) or ops.is_admin());

create policy companies_manage_update on company.companies
for update to authenticated
using (
  ops.is_admin()
  or company.has_permission(id, 'manage_company_profile')
)
with check (
  ops.is_admin()
  or company.has_permission(id, 'manage_company_profile')
);

create policy company_branches_member_select on company.company_branches
for select to authenticated
using (
  ops.is_admin()
  or company.is_company_member(company_id)
);

create policy company_branches_manage_access on company.company_branches
for all to authenticated
using (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_branch')
  or company.has_permission(company_id, 'manage_company_profile')
)
with check (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_branch')
  or company.has_permission(company_id, 'manage_company_profile')
);

create policy company_members_member_select on company.company_members
for select to authenticated
using (
  ops.is_admin()
  or company.is_company_member(company_id)
);

create policy company_members_manage_insert on company.company_members
for insert to authenticated
with check (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
);

create policy company_members_manage_update on company.company_members
for update to authenticated
using (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
)
with check (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
);

create policy company_members_manage_delete on company.company_members
for delete to authenticated
using (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
);

create policy listing_core_owner_or_company_select on listing.listing_core
for select to authenticated
using (
  owner_user_id = core.current_user_id()
  or ops.is_admin()
  or (owner_company_id is not null and company.is_company_member(owner_company_id))
);

create policy listing_core_owner_or_company_insert on listing.listing_core
for insert to authenticated
with check (
  owner_user_id = core.current_user_id()
  and (
    owner_company_id is null
    or ops.is_admin()
    or company.has_permission(owner_company_id, 'create_listing')
  )
);

create policy listing_core_owner_or_company_update on listing.listing_core
for update to authenticated
using (
  owner_user_id = core.current_user_id()
  or ops.is_admin()
  or (
    owner_company_id is not null
    and (
      company.has_permission(owner_company_id, 'edit_company_listing')
      or company.has_permission(owner_company_id, 'manage_company_inventory')
    )
  )
)
with check (
  owner_user_id = core.current_user_id()
  or ops.is_admin()
  or (
    owner_company_id is not null
    and (
      company.has_permission(owner_company_id, 'edit_company_listing')
      or company.has_permission(owner_company_id, 'manage_company_inventory')
    )
  )
);

create policy listing_media_owner_or_company_access on listing.listing_media
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
          )
        )
      )
  )
);

create policy listing_contacts_owner_or_company_access on listing.listing_contacts
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
          )
        )
      )
  )
);

create policy property_details_owner_or_company_access on property.property_listing_details
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
          )
        )
      )
  )
);

create policy property_compliance_owner_or_company_select on property.property_compliance
for select to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy motors_details_owner_or_company_access on motors.motor_listing_details
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
          )
        )
      )
  )
);

-- <<< END 20260324_0005_auth_company_backbone.sql >>>


-- >>> BEGIN 20260324_0006_property_workflow_and_public_views.sql <<<

create table if not exists property.property_company_links (
  listing_id uuid primary key references listing.listing_core(id) on delete cascade,
  agency_company_id uuid references company.companies(id) on delete set null,
  developer_company_id uuid references company.companies(id) on delete set null,
  broker_user_id uuid references core.users(id) on delete set null,
  branch_id uuid references company.company_branches(id) on delete set null,
  source_relationship_type text not null default 'owner_listing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists property.property_projects (
  id uuid primary key default gen_random_uuid(),
  developer_company_id uuid references company.companies(id) on delete set null,
  name text not null,
  slug text not null unique,
  emirate text not null,
  area text,
  project_status text not null default 'planned',
  handover_year integer,
  description text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_projects_emirate_status_idx on property.property_projects(emirate, project_status);
create index if not exists property_company_links_agency_idx on property.property_company_links(agency_company_id);
create index if not exists property_company_links_developer_idx on property.property_company_links(developer_company_id);

alter table property.property_company_links enable row level security;
alter table property.property_projects enable row level security;

create policy property_company_links_owner_or_company_access on property.property_company_links
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy property_projects_company_or_admin_select on property.property_projects
for select to authenticated
using (
  ops.is_admin()
  or (developer_company_id is not null and company.is_company_member(developer_company_id))
);

create policy property_projects_company_or_admin_manage on property.property_projects
for all to authenticated
using (
  ops.is_admin()
  or (developer_company_id is not null and company.has_permission(developer_company_id, 'manage_company_profile'))
)
with check (
  ops.is_admin()
  or (developer_company_id is not null and company.has_permission(developer_company_id, 'manage_company_profile'))
);

create or replace view public.property_detail_public_v1 as
select
  lc.id,
  lc.slug,
  lc.title,
  lc.description,
  lc.emirate,
  lc.area,
  lc.area_slug,
  lc.location_text,
  lc.lat,
  lc.lng,
  lc.price_amount,
  lc.price_currency,
  lc.published_at,
  p.market_mode,
  p.purpose,
  p.property_type,
  p.property_subtype,
  p.bedrooms,
  p.bathrooms,
  p.size_sqft,
  p.furnishing,
  p.completion_status,
  p.building_name,
  p.community_name,
  p.project_name,
  p.tower_name,
  p.permit_display_text,
  p.rent_frequency,
  p.is_short_term,
  p.is_project_listing,
  p.handover_date,
  p.parking_spaces,
  p.service_charges,
  plc.agency_company_id,
  agency.display_name as agency_name,
  agency.slug as agency_slug,
  agency.logo_url as agency_logo_url,
  plc.developer_company_id,
  developer.display_name as developer_name,
  developer.slug as developer_slug,
  developer.logo_url as developer_logo_url
from listing.listing_core lc
join property.property_listing_details p on p.listing_id = lc.id
left join property.property_company_links plc on plc.listing_id = lc.id
left join company.companies agency on agency.id = plc.agency_company_id
left join company.companies developer on developer.id = plc.developer_company_id
where lc.section = 'property'
  and lc.publication_state = 'published'
  and lc.visibility_state = 'public';

create or replace view public.property_projects_public_v1 as
select
  pp.id,
  pp.slug,
  pp.name,
  pp.emirate,
  pp.area,
  pp.project_status,
  pp.handover_year,
  pp.description,
  pp.cover_image_url,
  developer.display_name as developer_name,
  developer.slug as developer_slug,
  developer.logo_url as developer_logo_url
from property.property_projects pp
left join company.companies developer on developer.id = pp.developer_company_id
where developer.public_profile_enabled is true or developer.id is null;

grant select on public.property_detail_public_v1 to anon, authenticated;
grant select on public.property_projects_public_v1 to anon, authenticated;

-- <<< END 20260324_0006_property_workflow_and_public_views.sql >>>


-- >>> BEGIN 20260324_0007_auth_user_provisioning.sql <<<

create or replace function core.sync_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, core
as $$
declare
  derived_display_name text;
begin
  derived_display_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    split_part(coalesce(new.email, ''), '@', 1),
    'GulfHabibi User'
  );

  insert into core.users (auth_user_id, email, phone, status)
  values (new.id, new.email, new.phone, 'active')
  on conflict (auth_user_id) do update
  set
    email = excluded.email,
    phone = excluded.phone,
    status = 'active',
    updated_at = now();

  insert into core.profiles (user_id, display_name, preferred_language)
  select cu.id, derived_display_name, 'en'
  from core.users cu
  where cu.auth_user_id = new.id
  on conflict (user_id) do update
  set
    display_name = coalesce(nullif(core.profiles.display_name, ''), excluded.display_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update on auth.users
for each row
execute function core.sync_auth_user();

insert into core.users (auth_user_id, email, phone, status)
select au.id, au.email, au.phone, 'active'
from auth.users au
on conflict (auth_user_id) do update
set
  email = excluded.email,
  phone = excluded.phone,
  status = 'active',
  updated_at = now();

insert into core.profiles (user_id, display_name, preferred_language)
select
  cu.id,
  coalesce(
    au.raw_user_meta_data ->> 'full_name',
    split_part(coalesce(au.email, ''), '@', 1),
    'GulfHabibi User'
  ),
  'en'
from auth.users au
join core.users cu on cu.auth_user_id = au.id
on conflict (user_id) do nothing;

-- <<< END 20260324_0007_auth_user_provisioning.sql >>>


-- >>> BEGIN 20260324_0008_company_onboarding_and_property_composer.sql <<<

create or replace function public.create_company_with_owner(payload jsonb)
returns table (
  company_id uuid,
  branch_id uuid,
  company_slug text
)
language plpgsql
security definer
set search_path = public, core, company, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_company_id uuid;
  v_branch_id uuid;
  v_company_type company_type_enum;
  v_legal_name text;
  v_display_name text;
  v_slug text;
  v_description text;
  v_website text;
  v_license_number text;
  v_public_profile_enabled boolean := false;
  v_role text;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  v_company_type := (payload -> 'company' ->> 'companyType')::company_type_enum;
  v_legal_name := nullif(trim(payload -> 'company' ->> 'legalName'), '');
  v_display_name := nullif(trim(payload -> 'company' ->> 'displayName'), '');
  v_slug := nullif(trim(payload -> 'company' ->> 'slug'), '');
  v_description := nullif(trim(payload ->> 'publicProfileSummary'), '');
  v_website := nullif(trim(payload -> 'company' ->> 'website'), '');
  v_license_number := nullif(trim(payload -> 'company' ->> 'licenseNumber'), '');
  v_public_profile_enabled := coalesce((payload -> 'company' ->> 'publicProfileEnabled')::boolean, false);
  v_role := nullif(trim(payload ->> 'primaryRole'), '');

  if v_company_type is null or v_legal_name is null or v_display_name is null or v_slug is null or v_role is null then
    raise exception 'Company type, names, slug, and primary role are required';
  end if;

  insert into company.companies (
    company_type,
    legal_name,
    display_name,
    slug,
    description,
    website,
    license_number,
    public_profile_enabled
  )
  values (
    v_company_type,
    v_legal_name,
    v_display_name,
    v_slug,
    v_description,
    v_website,
    v_license_number,
    v_public_profile_enabled
  )
  returning id into v_company_id;

  insert into company.company_members (
    company_id,
    user_id,
    role,
    permissions_json,
    is_primary,
    status,
    joined_at
  )
  values (
    v_company_id,
    v_user_id,
    v_role,
    '[]'::jsonb,
    true,
    'active',
    now()
  );

  if nullif(trim(payload -> 'branch' ->> 'name'), '') is not null then
    insert into company.company_branches (
      company_id,
      name,
      emirate,
      area,
      address,
      phone,
      email,
      is_active
    )
    values (
      v_company_id,
      trim(payload -> 'branch' ->> 'name'),
      nullif(trim(payload -> 'branch' ->> 'emirate'), ''),
      nullif(trim(payload -> 'branch' ->> 'area'), ''),
      nullif(trim(payload -> 'branch' ->> 'address'), ''),
      nullif(trim(payload -> 'branch' ->> 'phone'), ''),
      nullif(trim(payload -> 'branch' ->> 'email'), ''),
      coalesce((payload -> 'branch' ->> 'isActive')::boolean, true)
    )
    returning id into v_branch_id;
  end if;

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_user_id,
    'company',
    v_company_id,
    'company_created',
    jsonb_build_object(
      'company_type',
      v_company_type,
      'company_slug',
      v_slug,
      'branch_created',
      v_branch_id is not null
    )
  );

  return query
  select v_company_id, v_branch_id, v_slug;
end;
$$;

create or replace function public.create_property_draft(payload jsonb)
returns table (
  listing_id uuid,
  listing_slug text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_listing_id uuid;
  v_listing_slug text;
  v_owner_company_id uuid := nullif(payload ->> 'ownerCompanyId', '')::uuid;
  v_branch_id uuid := nullif(payload ->> 'branchId', '')::uuid;
  v_advertiser_type text := nullif(trim(payload -> 'compliance' ->> 'advertiserType'), '');
  v_source_relationship_type text := nullif(trim(payload ->> 'sourceRelationshipType'), '');
  v_agency_company_id uuid;
  v_developer_company_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_owner_company_id is null then
    raise exception 'A company is required before creating regulated property drafts';
  end if;

  if not ops.is_admin(v_user_id) and not company.has_permission(v_owner_company_id, 'create_listing', v_user_id) then
    raise exception 'You do not have permission to create listings for this company';
  end if;

  if v_branch_id is not null and not exists (
    select 1
    from company.company_branches cb
    where cb.id = v_branch_id
      and cb.company_id = v_owner_company_id
  ) then
    raise exception 'Selected branch does not belong to the chosen company';
  end if;

  if v_advertiser_type in ('agency', 'agent', 'holiday_home_operator') then
    v_agency_company_id := v_owner_company_id;
  elsif v_advertiser_type = 'developer' then
    v_developer_company_id := v_owner_company_id;
  end if;

  v_listing_slug := trim(payload ->> 'slug');

  insert into listing.listing_core (
    section,
    owner_user_id,
    owner_company_id,
    branch_id,
    seller_type,
    slug,
    title,
    description,
    emirate,
    area,
    area_slug,
    location_text,
    lat,
    lng,
    price_amount,
    price_currency,
    visibility_state,
    publication_state,
    risk_state,
    monetization_state
  )
  values (
    'property',
    v_user_id,
    v_owner_company_id,
    v_branch_id,
    (payload ->> 'sellerType')::seller_type_enum,
    v_listing_slug,
    trim(payload ->> 'title'),
    trim(payload ->> 'description'),
    trim(payload ->> 'emirate'),
    nullif(trim(payload ->> 'area'), ''),
    nullif(trim(payload ->> 'areaSlug'), ''),
    nullif(trim(payload ->> 'locationText'), ''),
    nullif(payload ->> 'lat', '')::numeric,
    nullif(payload ->> 'lng', '')::numeric,
    nullif(payload ->> 'priceAmount', '')::numeric,
    coalesce(nullif(trim(payload ->> 'priceCurrency'), ''), 'AED'),
    'public',
    'draft',
    'normal',
    'none'
  )
  returning id into v_listing_id;

  insert into property.property_listing_details (
    listing_id,
    market_mode,
    purpose,
    property_type,
    property_subtype,
    bedrooms,
    bathrooms,
    size_sqft,
    furnishing,
    completion_status,
    building_name,
    community_name,
    project_name,
    tower_name,
    permit_display_text,
    rent_frequency,
    is_short_term,
    is_project_listing
  )
  values (
    v_listing_id,
    trim(payload -> 'property' ->> 'marketMode'),
    trim(payload -> 'property' ->> 'purpose'),
    trim(payload -> 'property' ->> 'propertyType'),
    nullif(trim(payload -> 'property' ->> 'propertySubtype'), ''),
    nullif(payload -> 'property' ->> 'bedrooms', '')::integer,
    nullif(payload -> 'property' ->> 'bathrooms', '')::integer,
    nullif(payload -> 'property' ->> 'sizeSqft', '')::numeric,
    nullif(trim(payload -> 'property' ->> 'furnishing'), ''),
    nullif(trim(payload -> 'property' ->> 'completionStatus'), ''),
    nullif(trim(payload -> 'property' ->> 'buildingName'), ''),
    nullif(trim(payload -> 'property' ->> 'communityName'), ''),
    nullif(trim(payload -> 'property' ->> 'projectName'), ''),
    nullif(trim(payload -> 'property' ->> 'towerName'), ''),
    nullif(trim(payload -> 'property' ->> 'permitDisplayText'), ''),
    nullif(trim(payload -> 'property' ->> 'rentFrequency'), ''),
    coalesce((payload -> 'property' ->> 'isShortTerm')::boolean, false),
    coalesce((payload -> 'property' ->> 'isProjectListing')::boolean, false)
  );

  insert into property.property_compliance (
    listing_id,
    regulator_region,
    advertiser_type,
    permit_system,
    permit_number,
    permit_qr_payload,
    verification_status,
    verification_method,
    manual_review_required
  )
  values (
    v_listing_id,
    trim(payload -> 'compliance' ->> 'regulatorRegion'),
    v_advertiser_type,
    trim(payload -> 'compliance' ->> 'permitSystem'),
    nullif(trim(payload -> 'compliance' ->> 'permitNumber'), ''),
    nullif(trim(payload -> 'compliance' ->> 'permitQrPayload'), ''),
    case
      when coalesce((payload -> 'compliance' ->> 'manualReviewRequired')::boolean, true) then 'required_pending'::compliance_state_type
      else 'not_required'::compliance_state_type
    end,
    'manual',
    coalesce((payload -> 'compliance' ->> 'manualReviewRequired')::boolean, true)
  );

  insert into property.property_company_links (
    listing_id,
    agency_company_id,
    developer_company_id,
    branch_id,
    source_relationship_type
  )
  values (
    v_listing_id,
    v_agency_company_id,
    v_developer_company_id,
    v_branch_id,
    coalesce(v_source_relationship_type, 'owner_listing')
  );

  if nullif(trim(payload ->> 'publicPhone'), '') is not null
    or nullif(trim(payload ->> 'publicWhatsapp'), '') is not null
    or nullif(trim(payload ->> 'publicEmail'), '') is not null then
    insert into listing.listing_contacts (
      listing_id,
      public_phone,
      public_whatsapp,
      public_email,
      hide_number_until_click,
      click_to_reveal_enabled,
      preferred_contact_method
    )
    values (
      v_listing_id,
      nullif(trim(payload ->> 'publicPhone'), ''),
      nullif(trim(payload ->> 'publicWhatsapp'), ''),
      nullif(trim(payload ->> 'publicEmail'), ''),
      coalesce((payload ->> 'hideNumberUntilClick')::boolean, false),
      coalesce((payload ->> 'clickToRevealEnabled')::boolean, true),
      coalesce(nullif(trim(payload ->> 'preferredContactMethod'), ''), 'phone')
    );
  end if;

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_user_id,
    'listing',
    v_listing_id,
    'property_draft_created',
    jsonb_build_object(
      'company_id',
      v_owner_company_id,
      'market_mode',
      payload -> 'property' ->> 'marketMode',
      'advertiser_type',
      v_advertiser_type,
      'emirate',
      payload ->> 'emirate'
    )
  );

  return query
  select v_listing_id, v_listing_slug;
end;
$$;

revoke all on function public.create_company_with_owner(jsonb) from public;
revoke all on function public.create_property_draft(jsonb) from public;

grant execute on function public.create_company_with_owner(jsonb) to authenticated;
grant execute on function public.create_property_draft(jsonb) to authenticated;

-- <<< END 20260324_0008_company_onboarding_and_property_composer.sql >>>


-- >>> BEGIN 20260324_0009_branch_ops_and_admin_compliance_access.sql <<<

create or replace function public.create_company_branch(payload jsonb)
returns table (
  branch_id uuid
)
language plpgsql
security definer
set search_path = public, core, company, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_company_id uuid := nullif(payload ->> 'companyId', '')::uuid;
  v_branch_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_company_id is null then
    raise exception 'Company is required';
  end if;

  if not ops.is_admin(v_user_id)
    and not company.has_permission(v_company_id, 'manage_branch', v_user_id)
    and not company.has_permission(v_company_id, 'manage_company_profile', v_user_id) then
    raise exception 'You do not have permission to create a branch for this company';
  end if;

  insert into company.company_branches (
    company_id,
    name,
    emirate,
    area,
    address,
    phone,
    email,
    is_active
  )
  values (
    v_company_id,
    trim(payload ->> 'name'),
    nullif(trim(payload ->> 'emirate'), ''),
    nullif(trim(payload ->> 'area'), ''),
    nullif(trim(payload ->> 'address'), ''),
    nullif(trim(payload ->> 'phone'), ''),
    nullif(trim(payload ->> 'email'), ''),
    coalesce((payload ->> 'isActive')::boolean, true)
  )
  returning id into v_branch_id;

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_user_id,
    'company_branch',
    v_branch_id,
    'company_branch_created',
    jsonb_build_object(
      'company_id',
      v_company_id,
      'branch_name',
      payload ->> 'name',
      'emirate',
      payload ->> 'emirate'
    )
  );

  return query
  select v_branch_id;
end;
$$;

revoke all on function public.create_company_branch(jsonb) from public;
grant execute on function public.create_company_branch(jsonb) to authenticated;

create policy compliance_cases_admin_select on compliance.compliance_cases
for select to authenticated
using (ops.is_admin());

create policy moderation_cases_admin_select on compliance.moderation_cases
for select to authenticated
using (ops.is_admin());

create policy audit_logs_admin_select on ops.audit_logs
for select to authenticated
using (ops.is_admin());

-- <<< END 20260324_0009_branch_ops_and_admin_compliance_access.sql >>>


-- >>> BEGIN 20260324_0010_property_review_lane.sql <<<

create table if not exists listing.listing_status_history (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  previous_state publication_state_type,
  new_state publication_state_type not null,
  actor_type text not null,
  actor_id uuid,
  reason_code text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists listing_status_history_listing_created_idx
  on listing.listing_status_history(listing_id, created_at desc);

alter table listing.listing_status_history enable row level security;

create policy listing_status_history_owner_or_company_select on listing.listing_status_history
for select to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create or replace function public.submit_property_for_review(payload jsonb)
returns table (
  listing_id uuid,
  publication_state publication_state_type,
  compliance_state compliance_state_type,
  moderation_state text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, compliance, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_previous_state publication_state_type;
  v_new_publication_state publication_state_type := 'submitted';
  v_owner_company_id uuid;
  v_owner_user_id uuid;
  v_manual_review_required boolean := true;
  v_permit_system text;
  v_permit_number text;
  v_next_compliance_state compliance_state_type := 'required_pending';
  v_moderation_state text := 'pending_review';
  v_compliance_case_id uuid;
  v_moderation_case_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_listing_id is null then
    raise exception 'Listing is required';
  end if;

  select lc.publication_state, lc.owner_company_id, lc.owner_user_id
  into v_previous_state, v_owner_company_id, v_owner_user_id
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = 'property';

  if v_previous_state is null then
    raise exception 'Property listing not found';
  end if;

  if not ops.is_admin(v_user_id)
    and v_owner_user_id <> v_user_id
    and (
      v_owner_company_id is null
      or not company.has_permission(v_owner_company_id, 'submit_for_review', v_user_id)
    ) then
    raise exception 'You do not have permission to submit this listing for review';
  end if;

  if v_previous_state not in ('draft', 'rejected') then
    raise exception 'Only draft or rejected property listings can be submitted for review';
  end if;

  select pc.manual_review_required, pc.permit_system, pc.permit_number
  into v_manual_review_required, v_permit_system, v_permit_number
  from property.property_compliance pc
  where pc.listing_id = v_listing_id;

  if v_permit_system is null then
    raise exception 'Property compliance details are missing for this listing';
  end if;

  if v_permit_system in ('trakheesi', 'dari', 'holiday_home')
    and nullif(trim(coalesce(v_permit_number, '')), '') is null then
    raise exception 'Permit number is required before regulated property listings can enter review';
  end if;

  if v_manual_review_required then
    v_next_compliance_state := 'under_review';
  else
    v_next_compliance_state := 'not_required';
  end if;

  update listing.listing_core
  set publication_state = v_new_publication_state,
      updated_at = now()
  where id = v_listing_id;

  update property.property_compliance
  set verification_status = v_next_compliance_state,
      updated_at = now()
  where listing_id = v_listing_id;

  if v_manual_review_required then
    select cc.id
    into v_compliance_case_id
    from compliance.compliance_cases cc
    where cc.listing_id = v_listing_id
    order by cc.created_at desc
    limit 1;

    if v_compliance_case_id is null then
      insert into compliance.compliance_cases (
        section,
        listing_id,
        company_id,
        user_id,
        case_type,
        compliance_state,
        priority,
        notes
      )
      values (
        'property',
        v_listing_id,
        v_owner_company_id,
        v_owner_user_id,
        'property_permit_review',
        v_next_compliance_state,
        1,
        'Property listing submitted for permit-aware compliance review.'
      );
    else
      update compliance.compliance_cases
      set compliance_state = v_next_compliance_state,
          priority = 1,
          notes = 'Property listing resubmitted for permit-aware compliance review.',
          updated_at = now()
      where id = v_compliance_case_id;
    end if;
  end if;

  select mc.id
  into v_moderation_case_id
  from compliance.moderation_cases mc
  where mc.listing_id = v_listing_id
  order by mc.created_at desc
  limit 1;

  if v_moderation_case_id is null then
    insert into compliance.moderation_cases (
      section,
      listing_id,
      company_id,
      user_id,
      moderation_state,
      reason_code,
      queue,
      notes
    )
    values (
      'property',
      v_listing_id,
      v_owner_company_id,
      v_owner_user_id,
      v_moderation_state,
      'property_submission',
      'property_regulated',
      'Property listing submitted into moderated publishing lane.'
    );
  else
    update compliance.moderation_cases
    set moderation_state = v_moderation_state,
        reason_code = 'property_submission',
        queue = 'property_regulated',
        notes = 'Property listing resubmitted into moderated publishing lane.',
        updated_at = now()
    where id = v_moderation_case_id;
  end if;

  insert into listing.listing_status_history (
    listing_id,
    previous_state,
    new_state,
    actor_type,
    actor_id,
    reason_code,
    notes
  )
  values (
    v_listing_id,
    v_previous_state,
    v_new_publication_state,
    'user',
    v_user_id,
    'submit_for_review',
    'Property listing submitted into regulated review workflow.'
  );

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_user_id,
    'listing',
    v_listing_id,
    'property_submitted_for_review',
    jsonb_build_object(
      'previous_state',
      v_previous_state,
      'new_state',
      v_new_publication_state,
      'compliance_state',
      v_next_compliance_state,
      'moderation_state',
      v_moderation_state
    )
  );

  return query
  select v_listing_id, v_new_publication_state, v_next_compliance_state, v_moderation_state;
end;
$$;

create or replace function public.review_property_submission(payload jsonb)
returns table (
  listing_id uuid,
  publication_state publication_state_type,
  compliance_state compliance_state_type,
  moderation_state text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, compliance, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_decision text := nullif(trim(payload ->> 'decision'), '');
  v_notes text := nullif(trim(payload ->> 'notes'), '');
  v_previous_state publication_state_type;
  v_new_publication_state publication_state_type;
  v_manual_review_required boolean := true;
  v_next_compliance_state compliance_state_type;
  v_next_moderation_state text;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if not ops.is_admin(v_user_id) then
    raise exception 'Admin access required';
  end if;

  if v_listing_id is null then
    raise exception 'Listing is required';
  end if;

  if v_decision not in ('approve', 'request_changes') then
    raise exception 'Unsupported review decision';
  end if;

  select lc.publication_state
  into v_previous_state
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = 'property';

  if v_previous_state is null then
    raise exception 'Property listing not found';
  end if;

  select coalesce(pc.manual_review_required, true)
  into v_manual_review_required
  from property.property_compliance pc
  where pc.listing_id = v_listing_id;

  if v_decision = 'approve' then
    v_new_publication_state := 'published';
    v_next_compliance_state := case when v_manual_review_required then 'verified' else 'not_required' end;
    v_next_moderation_state := 'approved';
  else
    v_new_publication_state := 'rejected';
    v_next_compliance_state := case when v_manual_review_required then 'required_pending' else 'not_required' end;
    v_next_moderation_state := 'changes_requested';
  end if;

  update listing.listing_core
  set publication_state = v_new_publication_state,
      published_at = case when v_decision = 'approve' then coalesce(published_at, now()) else published_at end,
      updated_at = now()
  where id = v_listing_id;

  update property.property_compliance
  set verification_status = v_next_compliance_state,
      compliance_notes = coalesce(v_notes, compliance_notes),
      updated_at = now()
  where listing_id = v_listing_id;

  update compliance.compliance_cases
  set compliance_state = v_next_compliance_state,
      notes = coalesce(v_notes, notes),
      updated_at = now()
  where listing_id = v_listing_id;

  update compliance.moderation_cases
  set moderation_state = v_next_moderation_state,
      notes = coalesce(v_notes, notes),
      updated_at = now()
  where listing_id = v_listing_id;

  insert into listing.listing_status_history (
    listing_id,
    previous_state,
    new_state,
    actor_type,
    actor_id,
    reason_code,
    notes
  )
  values (
    v_listing_id,
    v_previous_state,
    v_new_publication_state,
    'admin',
    v_user_id,
    v_decision,
    coalesce(v_notes, case when v_decision = 'approve' then 'Property approved and published.' else 'Property sent back for changes.' end)
  );

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'admin',
    v_user_id,
    'listing',
    v_listing_id,
    case when v_decision = 'approve' then 'property_review_approved' else 'property_review_changes_requested' end,
    jsonb_build_object(
      'previous_state',
      v_previous_state,
      'new_state',
      v_new_publication_state,
      'compliance_state',
      v_next_compliance_state,
      'moderation_state',
      v_next_moderation_state
    )
  );

  return query
  select v_listing_id, v_new_publication_state, v_next_compliance_state, v_next_moderation_state;
end;
$$;

revoke all on function public.submit_property_for_review(jsonb) from public;
revoke all on function public.review_property_submission(jsonb) from public;

grant execute on function public.submit_property_for_review(jsonb) to authenticated;
grant execute on function public.review_property_submission(jsonb) to authenticated;

-- <<< END 20260324_0010_property_review_lane.sql >>>


-- >>> BEGIN 20260324_0011_company_member_assignment.sql <<<

create or replace function public.assign_company_member(payload jsonb)
returns table (
  member_id uuid,
  user_id uuid,
  email text,
  membership_status text
)
language plpgsql
security definer
set search_path = public, core, company, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_company_id uuid := nullif(payload ->> 'companyId', '')::uuid;
  v_email text := lower(nullif(trim(payload ->> 'email'), ''));
  v_role text := nullif(trim(payload ->> 'role'), '');
  v_branch_id uuid := nullif(payload ->> 'branchId', '')::uuid;
  v_target_user_id uuid;
  v_member_id uuid;
  v_status text := 'active';
begin
  if v_actor_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_company_id is null or v_email is null or v_role is null then
    raise exception 'Company, email, and role are required';
  end if;

  if not ops.is_admin(v_actor_user_id)
    and not company.has_permission(v_company_id, 'manage_company_users', v_actor_user_id) then
    raise exception 'You do not have permission to manage company members';
  end if;

  select cu.id
  into v_target_user_id
  from core.users cu
  where lower(coalesce(cu.email, '')) = v_email
  limit 1;

  if v_target_user_id is null then
    raise exception 'No registered platform user was found for that email address';
  end if;

  if v_branch_id is not null and not exists (
    select 1
    from company.company_branches cb
    where cb.id = v_branch_id
      and cb.company_id = v_company_id
  ) then
    raise exception 'Selected branch does not belong to the chosen company';
  end if;

  insert into company.company_members (
    company_id,
    user_id,
    role,
    permissions_json,
    branch_id,
    is_primary,
    status,
    invited_at,
    joined_at
  )
  values (
    v_company_id,
    v_target_user_id,
    v_role,
    '[]'::jsonb,
    v_branch_id,
    false,
    v_status,
    now(),
    now()
  )
  on conflict (company_id, user_id) do update
    set role = excluded.role,
        branch_id = excluded.branch_id,
        status = 'active',
        invited_at = coalesce(company.company_members.invited_at, now()),
        joined_at = coalesce(company.company_members.joined_at, now()),
        updated_at = now()
  returning company.company_members.id, company.company_members.user_id, company.company_members.status
  into v_member_id, v_target_user_id, v_status;

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_actor_user_id,
    'company_member',
    v_member_id,
    'company_member_assigned',
    jsonb_build_object(
      'company_id',
      v_company_id,
      'target_user_id',
      v_target_user_id,
      'email',
      v_email,
      'role',
      v_role,
      'branch_id',
      v_branch_id
    )
  );

  return query
  select v_member_id, v_target_user_id, v_email, v_status;
end;
$$;

revoke all on function public.assign_company_member(jsonb) from public;
grant execute on function public.assign_company_member(jsonb) to authenticated;

-- <<< END 20260324_0011_company_member_assignment.sql >>>


-- >>> BEGIN 20260324_0012_company_member_invites.sql <<<

create table if not exists company.company_member_invites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references company.companies(id) on delete cascade,
  email text not null,
  role text not null,
  permissions_json jsonb not null default '[]'::jsonb,
  branch_id uuid references company.company_branches(id),
  invited_by_user_id uuid not null references core.users(id) on delete cascade,
  invite_token_hash text not null unique,
  status text not null default 'pending',
  expires_at timestamptz not null,
  last_sent_at timestamptz,
  accepted_at timestamptz,
  accepted_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_member_invites_company_status_idx
  on company.company_member_invites (company_id, status, expires_at desc);

create index if not exists company_member_invites_email_idx
  on company.company_member_invites ((lower(email)));

alter table company.company_member_invites enable row level security;

drop policy if exists company_member_invites_manage_select on company.company_member_invites;
drop policy if exists company_member_invites_manage_insert on company.company_member_invites;
drop policy if exists company_member_invites_manage_update on company.company_member_invites;
drop policy if exists company_member_invites_manage_delete on company.company_member_invites;

create policy company_member_invites_manage_select on company.company_member_invites
for select to authenticated
using (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
);

create policy company_member_invites_manage_insert on company.company_member_invites
for insert to authenticated
with check (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
);

create policy company_member_invites_manage_update on company.company_member_invites
for update to authenticated
using (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
)
with check (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
);

create policy company_member_invites_manage_delete on company.company_member_invites
for delete to authenticated
using (
  ops.is_admin()
  or company.has_permission(company_id, 'manage_company_users')
);

create or replace function public.create_company_member_invite(payload jsonb)
returns table (
  invite_id uuid,
  email text,
  invite_status text,
  invite_token text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, core, company, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_company_id uuid := nullif(payload ->> 'companyId', '')::uuid;
  v_email text := lower(nullif(trim(payload ->> 'email'), ''));
  v_role text := nullif(trim(payload ->> 'role'), '');
  v_branch_id uuid := nullif(payload ->> 'branchId', '')::uuid;
  v_invite_id uuid;
  v_invite_token text := encode(gen_random_bytes(24), 'hex');
  v_invite_token_hash text := encode(digest(v_invite_token, 'sha256'), 'hex');
  v_expires_at timestamptz := now() + interval '7 days';
begin
  if v_actor_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_company_id is null or v_email is null or v_role is null then
    raise exception 'Company, email, and role are required';
  end if;

  if not ops.is_admin(v_actor_user_id)
    and not company.has_permission(v_company_id, 'manage_company_users', v_actor_user_id) then
    raise exception 'You do not have permission to invite company members';
  end if;

  if v_branch_id is not null and not exists (
    select 1
    from company.company_branches cb
    where cb.id = v_branch_id
      and cb.company_id = v_company_id
  ) then
    raise exception 'Selected branch does not belong to the chosen company';
  end if;

  if exists (
    select 1
    from company.company_members cm
    join core.users cu on cu.id = cm.user_id
    where cm.company_id = v_company_id
      and cm.status = 'active'
      and lower(coalesce(cu.email, '')) = v_email
  ) then
    raise exception 'That user already has an active company seat';
  end if;

  update company.company_member_invites cmi
  set
    status = 'revoked',
    updated_at = now()
  where cmi.company_id = v_company_id
    and lower(cmi.email) = v_email
    and cmi.status = 'pending';

  insert into company.company_member_invites (
    company_id,
    email,
    role,
    permissions_json,
    branch_id,
    invited_by_user_id,
    invite_token_hash,
    status,
    expires_at,
    last_sent_at
  )
  values (
    v_company_id,
    v_email,
    v_role,
    '[]'::jsonb,
    v_branch_id,
    v_actor_user_id,
    v_invite_token_hash,
    'pending',
    v_expires_at,
    now()
  )
  returning id into v_invite_id;

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_actor_user_id,
    'company_member_invite',
    v_invite_id,
    'company_member_invited',
    jsonb_build_object(
      'company_id',
      v_company_id,
      'email',
      v_email,
      'role',
      v_role,
      'branch_id',
      v_branch_id,
      'expires_at',
      v_expires_at
    )
  );

  return query
  select v_invite_id, v_email, 'pending', v_invite_token, v_expires_at;
end;
$$;

create or replace function public.inspect_company_member_invite(payload jsonb)
returns table (
  invite_id uuid,
  company_id uuid,
  company_display_name text,
  company_type text,
  email text,
  role text,
  branch_name text,
  invite_status text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, core, company, ops
as $$
declare
  v_invite_token text := nullif(trim(payload ->> 'token'), '');
  v_invite_token_hash text;
begin
  if v_invite_token is null then
    return;
  end if;

  v_invite_token_hash := encode(digest(v_invite_token, 'sha256'), 'hex');

  return query
  select
    cmi.id,
    cmi.company_id,
    co.display_name,
    co.company_type::text,
    cmi.email,
    cmi.role,
    cb.name,
    cmi.status,
    cmi.expires_at
  from company.company_member_invites cmi
  join company.companies co on co.id = cmi.company_id
  left join company.company_branches cb on cb.id = cmi.branch_id
  where cmi.invite_token_hash = v_invite_token_hash
    and cmi.status = 'pending'
    and cmi.expires_at > now()
  limit 1;
end;
$$;

create or replace function public.accept_company_member_invite(payload jsonb)
returns table (
  invite_id uuid,
  company_id uuid,
  member_id uuid,
  email text,
  membership_status text
)
language plpgsql
security definer
set search_path = public, core, company, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_invite_token text := nullif(trim(payload ->> 'token'), '');
  v_invite_token_hash text;
  v_invite_id uuid;
  v_company_id uuid;
  v_email text;
  v_role text;
  v_branch_id uuid;
  v_permissions jsonb;
  v_invited_at timestamptz;
  v_actor_email text;
  v_member_id uuid;
  v_status text := 'active';
begin
  if v_actor_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_invite_token is null then
    raise exception 'Invite token is required';
  end if;

  v_invite_token_hash := encode(digest(v_invite_token, 'sha256'), 'hex');

  select
    cmi.id,
    cmi.company_id,
    lower(cmi.email),
    cmi.role,
    cmi.branch_id,
    cmi.permissions_json,
    cmi.created_at
  into
    v_invite_id,
    v_company_id,
    v_email,
    v_role,
    v_branch_id,
    v_permissions,
    v_invited_at
  from company.company_member_invites cmi
  where cmi.invite_token_hash = v_invite_token_hash
    and cmi.status = 'pending'
    and cmi.expires_at > now()
  limit 1;

  if v_invite_id is null then
    raise exception 'Invite is invalid, expired, or already used';
  end if;

  select lower(coalesce(cu.email, ''))
  into v_actor_email
  from core.users cu
  where cu.id = v_actor_user_id
  limit 1;

  if v_actor_email is null or v_actor_email <> v_email then
    raise exception 'Sign in with the invited email address to accept this company invite';
  end if;

  if v_branch_id is not null and not exists (
    select 1
    from company.company_branches cb
    where cb.id = v_branch_id
      and cb.company_id = v_company_id
  ) then
    raise exception 'The invited branch is no longer available for this company';
  end if;

  insert into company.company_members (
    company_id,
    user_id,
    role,
    permissions_json,
    branch_id,
    is_primary,
    status,
    invited_at,
    joined_at
  )
  values (
    v_company_id,
    v_actor_user_id,
    v_role,
    coalesce(v_permissions, '[]'::jsonb),
    v_branch_id,
    false,
    'active',
    v_invited_at,
    now()
  )
  on conflict (company_id, user_id) do update
    set role = excluded.role,
        permissions_json = excluded.permissions_json,
        branch_id = excluded.branch_id,
        status = 'active',
        invited_at = coalesce(company.company_members.invited_at, excluded.invited_at),
        joined_at = coalesce(company.company_members.joined_at, now()),
        updated_at = now()
  returning company.company_members.id, company.company_members.status
  into v_member_id, v_status;

  update company.company_member_invites
  set
    status = 'accepted',
    accepted_at = now(),
    accepted_by_user_id = v_actor_user_id,
    updated_at = now()
  where id = v_invite_id;

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_actor_user_id,
    'company_member_invite',
    v_invite_id,
    'company_member_invite_accepted',
    jsonb_build_object(
      'company_id',
      v_company_id,
      'member_id',
      v_member_id,
      'email',
      v_email,
      'role',
      v_role
    )
  );

  return query
  select v_invite_id, v_company_id, v_member_id, v_email, v_status;
end;
$$;

revoke all on function public.create_company_member_invite(jsonb) from public;
revoke all on function public.accept_company_member_invite(jsonb) from public;
revoke all on function public.inspect_company_member_invite(jsonb) from public;

grant execute on function public.create_company_member_invite(jsonb) to authenticated;
grant execute on function public.accept_company_member_invite(jsonb) to authenticated;
grant execute on function public.inspect_company_member_invite(jsonb) to anon, authenticated;

-- <<< END 20260324_0012_company_member_invites.sql >>>


-- >>> BEGIN 20260324_0013_property_compliance_documents.sql <<<

create table if not exists property.property_compliance_documents (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  document_type text not null,
  document_label text not null,
  storage_path text,
  access_url text,
  file_name text,
  mime_type text,
  uploaded_by_user_id uuid not null references core.users(id) on delete cascade,
  review_state text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_compliance_documents_listing_created_idx
  on property.property_compliance_documents (listing_id, created_at desc);

alter table property.property_compliance_documents enable row level security;

drop policy if exists property_compliance_documents_owner_or_company_select on property.property_compliance_documents;
drop policy if exists property_compliance_documents_owner_or_company_insert on property.property_compliance_documents;
drop policy if exists property_compliance_documents_admin_update on property.property_compliance_documents;

create policy property_compliance_documents_owner_or_company_select on property.property_compliance_documents
for select to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy property_compliance_documents_owner_or_company_insert on property.property_compliance_documents
for insert to authenticated
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          lc.owner_company_id is not null
          and (
            company.has_permission(lc.owner_company_id, 'edit_company_listing')
            or company.has_permission(lc.owner_company_id, 'manage_company_inventory')
            or company.has_permission(lc.owner_company_id, 'view_compliance_status')
          )
        )
      )
  )
);

create policy property_compliance_documents_admin_update on property.property_compliance_documents
for update to authenticated
using (ops.is_admin())
with check (ops.is_admin());

create or replace function public.add_property_compliance_document(payload jsonb)
returns table (
  document_id uuid,
  listing_id uuid,
  review_state text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_document_type text := nullif(trim(payload ->> 'documentType'), '');
  v_document_label text := nullif(trim(payload ->> 'documentLabel'), '');
  v_access_url text := nullif(trim(payload ->> 'accessUrl'), '');
  v_storage_path text := nullif(trim(payload ->> 'storagePath'), '');
  v_file_name text := nullif(trim(payload ->> 'fileName'), '');
  v_mime_type text := nullif(trim(payload ->> 'mimeType'), '');
  v_notes text := nullif(trim(payload ->> 'notes'), '');
  v_owner_company_id uuid;
  v_owner_user_id uuid;
  v_document_id uuid;
begin
  if v_actor_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_listing_id is null or v_document_type is null or v_document_label is null then
    raise exception 'Listing, document type, and document label are required';
  end if;

  if v_access_url is null and v_storage_path is null then
    raise exception 'Document URL or storage path is required';
  end if;

  select lc.owner_company_id, lc.owner_user_id
  into v_owner_company_id, v_owner_user_id
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = 'property';

  if v_owner_user_id is null then
    raise exception 'Property listing not found';
  end if;

  if not ops.is_admin(v_actor_user_id)
    and v_owner_user_id <> v_actor_user_id
    and (
      v_owner_company_id is null
      or not (
        company.has_permission(v_owner_company_id, 'edit_company_listing', v_actor_user_id)
        or company.has_permission(v_owner_company_id, 'manage_company_inventory', v_actor_user_id)
        or company.has_permission(v_owner_company_id, 'view_compliance_status', v_actor_user_id)
      )
    ) then
    raise exception 'You do not have permission to attach compliance documents to this listing';
  end if;

  insert into property.property_compliance_documents (
    listing_id,
    document_type,
    document_label,
    storage_path,
    access_url,
    file_name,
    mime_type,
    uploaded_by_user_id,
    review_state,
    notes
  )
  values (
    v_listing_id,
    v_document_type,
    v_document_label,
    v_storage_path,
    v_access_url,
    v_file_name,
    v_mime_type,
    v_actor_user_id,
    'pending',
    v_notes
  )
  returning id into v_document_id;

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_actor_user_id,
    'property_compliance_document',
    v_document_id,
    'property_compliance_document_added',
    jsonb_build_object(
      'listing_id',
      v_listing_id,
      'document_type',
      v_document_type,
      'document_label',
      v_document_label
    )
  );

  return query
  select v_document_id, v_listing_id, 'pending';
end;
$$;

create or replace function public.set_property_compliance_document_review(payload jsonb)
returns table (
  document_id uuid,
  review_state text
)
language plpgsql
security definer
set search_path = public, core, property, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_document_id uuid := nullif(payload ->> 'documentId', '')::uuid;
  v_review_state text := nullif(trim(payload ->> 'reviewState'), '');
  v_notes text := nullif(trim(payload ->> 'notes'), '');
begin
  if v_actor_user_id is null or not ops.is_admin(v_actor_user_id) then
    raise exception 'Admin access required';
  end if;

  if v_document_id is null or v_review_state is null then
    raise exception 'Document and review state are required';
  end if;

  if v_review_state not in ('pending', 'accepted', 'needs_more_info', 'rejected') then
    raise exception 'Unsupported document review state';
  end if;

  update property.property_compliance_documents
  set
    review_state = v_review_state,
    notes = coalesce(v_notes, notes),
    updated_at = now()
  where id = v_document_id;

  if not found then
    raise exception 'Compliance document not found';
  end if;

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'admin',
    v_actor_user_id,
    'property_compliance_document',
    v_document_id,
    'property_compliance_document_reviewed',
    jsonb_build_object(
      'review_state',
      v_review_state,
      'notes',
      v_notes
    )
  );

  return query
  select v_document_id, v_review_state;
end;
$$;

create or replace function public.submit_property_for_review(payload jsonb)
returns table (
  listing_id uuid,
  publication_state publication_state_type,
  compliance_state compliance_state_type,
  moderation_state text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, compliance, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_previous_state publication_state_type;
  v_new_publication_state publication_state_type := 'submitted';
  v_owner_company_id uuid;
  v_owner_user_id uuid;
  v_manual_review_required boolean := true;
  v_permit_system text;
  v_permit_number text;
  v_next_compliance_state compliance_state_type := 'required_pending';
  v_moderation_state text := 'pending_review';
  v_compliance_case_id uuid;
  v_moderation_case_id uuid;
  v_document_count integer := 0;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_listing_id is null then
    raise exception 'Listing is required';
  end if;

  select lc.publication_state, lc.owner_company_id, lc.owner_user_id
  into v_previous_state, v_owner_company_id, v_owner_user_id
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = 'property';

  if v_previous_state is null then
    raise exception 'Property listing not found';
  end if;

  if not ops.is_admin(v_user_id)
    and v_owner_user_id <> v_user_id
    and (
      v_owner_company_id is null
      or not company.has_permission(v_owner_company_id, 'submit_for_review', v_user_id)
    ) then
    raise exception 'You do not have permission to submit this listing for review';
  end if;

  if v_previous_state not in ('draft', 'rejected') then
    raise exception 'Only draft or rejected property listings can be submitted for review';
  end if;

  select pc.manual_review_required, pc.permit_system, pc.permit_number
  into v_manual_review_required, v_permit_system, v_permit_number
  from property.property_compliance pc
  where pc.listing_id = v_listing_id;

  if v_permit_system is null then
    raise exception 'Property compliance details are missing for this listing';
  end if;

  if v_permit_system in ('trakheesi', 'dari', 'holiday_home')
    and nullif(trim(coalesce(v_permit_number, '')), '') is null then
    raise exception 'Permit number is required before regulated property listings can enter review';
  end if;

  if v_manual_review_required then
    select count(*)
    into v_document_count
    from property.property_compliance_documents pcd
    where pcd.listing_id = v_listing_id;

    if v_document_count = 0 then
      raise exception 'Upload at least one compliance document before submitting this property for review';
    end if;

    v_next_compliance_state := 'under_review';
  else
    v_next_compliance_state := 'not_required';
  end if;

  update listing.listing_core
  set publication_state = v_new_publication_state,
      updated_at = now()
  where id = v_listing_id;

  update property.property_compliance
  set verification_status = v_next_compliance_state,
      updated_at = now()
  where listing_id = v_listing_id;

  if v_manual_review_required then
    select cc.id
    into v_compliance_case_id
    from compliance.compliance_cases cc
    where cc.listing_id = v_listing_id
    order by cc.created_at desc
    limit 1;

    if v_compliance_case_id is null then
      insert into compliance.compliance_cases (
        section,
        listing_id,
        company_id,
        user_id,
        case_type,
        compliance_state,
        priority,
        notes
      )
      values (
        'property',
        v_listing_id,
        v_owner_company_id,
        v_owner_user_id,
        'property_permit_review',
        v_next_compliance_state,
        1,
        'Property listing submitted for permit-aware compliance review.'
      );
    else
      update compliance.compliance_cases
      set compliance_state = v_next_compliance_state,
          priority = 1,
          notes = 'Property listing resubmitted for permit-aware compliance review.',
          updated_at = now()
      where id = v_compliance_case_id;
    end if;
  end if;

  select mc.id
  into v_moderation_case_id
  from compliance.moderation_cases mc
  where mc.listing_id = v_listing_id
  order by mc.created_at desc
  limit 1;

  if v_moderation_case_id is null then
    insert into compliance.moderation_cases (
      section,
      listing_id,
      company_id,
      user_id,
      moderation_state,
      reason_code,
      queue,
      notes
    )
    values (
      'property',
      v_listing_id,
      v_owner_company_id,
      v_owner_user_id,
      v_moderation_state,
      'property_submission',
      'property_regulated',
      'Property listing submitted into moderated publishing lane.'
    );
  else
    update compliance.moderation_cases
    set moderation_state = v_moderation_state,
        reason_code = 'property_submission',
        queue = 'property_regulated',
        notes = 'Property listing resubmitted into moderated publishing lane.',
        updated_at = now()
    where id = v_moderation_case_id;
  end if;

  insert into listing.listing_status_history (
    listing_id,
    previous_state,
    new_state,
    actor_type,
    actor_id,
    reason_code,
    notes
  )
  values (
    v_listing_id,
    v_previous_state,
    v_new_publication_state,
    'user',
    v_user_id,
    'submit_for_review',
    'Property listing submitted into regulated review workflow.'
  );

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    'user',
    v_user_id,
    'listing',
    v_listing_id,
    'property_submitted_for_review',
    jsonb_build_object(
      'previous_state',
      v_previous_state,
      'new_state',
      v_new_publication_state,
      'compliance_state',
      v_next_compliance_state,
      'moderation_state',
      v_moderation_state,
      'document_count',
      v_document_count
    )
  );

  return query
  select v_listing_id, v_new_publication_state, v_next_compliance_state, v_moderation_state;
end;
$$;

revoke all on function public.add_property_compliance_document(jsonb) from public;
revoke all on function public.set_property_compliance_document_review(jsonb) from public;
revoke all on function public.submit_property_for_review(jsonb) from public;

grant execute on function public.add_property_compliance_document(jsonb) to authenticated;
grant execute on function public.set_property_compliance_document_review(jsonb) to authenticated;
grant execute on function public.submit_property_for_review(jsonb) to authenticated;

-- <<< END 20260324_0013_property_compliance_documents.sql >>>


-- >>> BEGIN 20260324_0014_monetization_operations.sql <<<

create table if not exists monetization.listing_promotions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  entitlement_id uuid not null references monetization.package_entitlements(id) on delete cascade,
  placement_type text not null,
  priority_bucket text,
  start_at timestamptz not null,
  end_at timestamptz,
  status text not null default 'scheduled',
  admin_override boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listing_promotions_listing_idx
  on monetization.listing_promotions (listing_id, status, start_at desc);

create table if not exists monetization.campaign_creatives (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references monetization.campaigns(id) on delete cascade,
  storage_path text,
  public_url text,
  creative_type text not null,
  width integer,
  height integer,
  file_size integer,
  checksum text,
  review_state text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaign_creatives_campaign_idx
  on monetization.campaign_creatives (campaign_id, created_at desc);

create table if not exists monetization.campaign_slot_assignments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references monetization.campaigns(id) on delete cascade,
  slot_id uuid not null references monetization.ad_slots(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'scheduled',
  rotation_weight integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaign_slot_assignments_slot_idx
  on monetization.campaign_slot_assignments (slot_id, status, start_at desc);

alter table monetization.package_catalog enable row level security;
alter table monetization.package_orders enable row level security;
alter table monetization.package_entitlements enable row level security;
alter table monetization.ad_slots enable row level security;
alter table monetization.campaigns enable row level security;
alter table monetization.listing_promotions enable row level security;
alter table monetization.campaign_creatives enable row level security;
alter table monetization.campaign_slot_assignments enable row level security;

drop policy if exists package_catalog_public_select on monetization.package_catalog;
drop policy if exists package_orders_owner_or_company_select on monetization.package_orders;
drop policy if exists package_orders_owner_or_company_insert on monetization.package_orders;
drop policy if exists package_entitlements_owner_or_company_select on monetization.package_entitlements;
drop policy if exists package_entitlements_admin_update on monetization.package_entitlements;
drop policy if exists ad_slots_public_select on monetization.ad_slots;
drop policy if exists campaigns_owner_or_company_select on monetization.campaigns;
drop policy if exists campaigns_owner_or_company_insert on monetization.campaigns;
drop policy if exists campaigns_owner_or_company_update on monetization.campaigns;
drop policy if exists listing_promotions_owner_or_company_select on monetization.listing_promotions;
drop policy if exists listing_promotions_admin_write on monetization.listing_promotions;
drop policy if exists campaign_creatives_owner_or_company_select on monetization.campaign_creatives;
drop policy if exists campaign_creatives_owner_or_company_insert on monetization.campaign_creatives;
drop policy if exists campaign_creatives_owner_or_company_update on monetization.campaign_creatives;
drop policy if exists campaign_slot_assignments_owner_or_company_select on monetization.campaign_slot_assignments;
drop policy if exists campaign_slot_assignments_owner_or_company_insert on monetization.campaign_slot_assignments;
drop policy if exists campaign_slot_assignments_owner_or_company_update on monetization.campaign_slot_assignments;

create policy package_catalog_public_select on monetization.package_catalog
for select to authenticated, anon
using (active or ops.is_admin());

create policy package_orders_owner_or_company_select on monetization.package_orders
for select to authenticated
using (
  ops.is_admin()
  or buyer_user_id = core.current_user_id()
  or (buyer_company_id is not null and company.is_company_member(buyer_company_id))
);

create policy package_orders_owner_or_company_insert on monetization.package_orders
for insert to authenticated
with check (
  ops.is_admin()
  or buyer_user_id = core.current_user_id()
  or (
    buyer_company_id is not null
    and (
      company.has_permission(buyer_company_id, 'buy_package')
      or company.has_permission(buyer_company_id, 'manage_billing')
    )
  )
);

create policy package_entitlements_owner_or_company_select on monetization.package_entitlements
for select to authenticated
using (
  ops.is_admin()
  or user_id = core.current_user_id()
  or (company_id is not null and company.is_company_member(company_id))
);

create policy package_entitlements_admin_update on monetization.package_entitlements
for update to authenticated
using (ops.is_admin())
with check (ops.is_admin());

create policy ad_slots_public_select on monetization.ad_slots
for select to authenticated, anon
using (active or ops.is_admin());

create policy campaigns_owner_or_company_select on monetization.campaigns
for select to authenticated
using (
  ops.is_admin()
  or owner_user_id = core.current_user_id()
  or (owner_company_id is not null and company.is_company_member(owner_company_id))
);

create policy campaigns_owner_or_company_insert on monetization.campaigns
for insert to authenticated
with check (
  ops.is_admin()
  or owner_user_id = core.current_user_id()
  or (
    owner_company_id is not null
    and (
      company.has_permission(owner_company_id, 'manage_campaigns')
      or company.has_permission(owner_company_id, 'upload_creatives')
      or company.has_permission(owner_company_id, 'manage_company_profile')
    )
  )
);

create policy campaigns_owner_or_company_update on monetization.campaigns
for update to authenticated
using (
  ops.is_admin()
  or owner_user_id = core.current_user_id()
  or (
    owner_company_id is not null
    and (
      company.has_permission(owner_company_id, 'manage_campaigns')
      or company.has_permission(owner_company_id, 'upload_creatives')
    )
  )
)
with check (
  ops.is_admin()
  or owner_user_id = core.current_user_id()
  or (
    owner_company_id is not null
    and (
      company.has_permission(owner_company_id, 'manage_campaigns')
      or company.has_permission(owner_company_id, 'upload_creatives')
    )
  )
);

create policy listing_promotions_owner_or_company_select on monetization.listing_promotions
for select to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy listing_promotions_admin_write on monetization.listing_promotions
for all to authenticated
using (ops.is_admin())
with check (ops.is_admin());

create policy campaign_creatives_owner_or_company_select on monetization.campaign_creatives
for select to authenticated
using (
  exists (
    select 1
    from monetization.campaigns c
    where c.id = campaign_id
      and (
        c.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (c.owner_company_id is not null and company.is_company_member(c.owner_company_id))
      )
  )
);

create policy campaign_creatives_owner_or_company_insert on monetization.campaign_creatives
for insert to authenticated
with check (
  exists (
    select 1
    from monetization.campaigns c
    where c.id = campaign_id
      and (
        c.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          c.owner_company_id is not null
          and (
            company.has_permission(c.owner_company_id, 'manage_campaigns')
            or company.has_permission(c.owner_company_id, 'upload_creatives')
          )
        )
      )
  )
);

create policy campaign_creatives_owner_or_company_update on monetization.campaign_creatives
for update to authenticated
using (
  exists (
    select 1
    from monetization.campaigns c
    where c.id = campaign_id
      and (
        c.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          c.owner_company_id is not null
          and (
            company.has_permission(c.owner_company_id, 'manage_campaigns')
            or company.has_permission(c.owner_company_id, 'upload_creatives')
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from monetization.campaigns c
    where c.id = campaign_id
      and (
        c.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          c.owner_company_id is not null
          and (
            company.has_permission(c.owner_company_id, 'manage_campaigns')
            or company.has_permission(c.owner_company_id, 'upload_creatives')
          )
        )
      )
  )
);

create policy campaign_slot_assignments_owner_or_company_select on monetization.campaign_slot_assignments
for select to authenticated
using (
  exists (
    select 1
    from monetization.campaigns c
    where c.id = campaign_id
      and (
        c.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (c.owner_company_id is not null and company.is_company_member(c.owner_company_id))
      )
  )
);

create policy campaign_slot_assignments_owner_or_company_insert on monetization.campaign_slot_assignments
for insert to authenticated
with check (
  exists (
    select 1
    from monetization.campaigns c
    where c.id = campaign_id
      and (
        c.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          c.owner_company_id is not null
          and company.has_permission(c.owner_company_id, 'manage_campaigns')
        )
      )
  )
);

create policy campaign_slot_assignments_owner_or_company_update on monetization.campaign_slot_assignments
for update to authenticated
using (
  exists (
    select 1
    from monetization.campaigns c
    where c.id = campaign_id
      and (
        c.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          c.owner_company_id is not null
          and company.has_permission(c.owner_company_id, 'manage_campaigns')
        )
      )
  )
)
with check (
  exists (
    select 1
    from monetization.campaigns c
    where c.id = campaign_id
      and (
        c.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (
          c.owner_company_id is not null
          and company.has_permission(c.owner_company_id, 'manage_campaigns')
        )
      )
  )
);

-- <<< END 20260324_0014_monetization_operations.sql >>>


-- >>> BEGIN 20260324_0015_risk_engine_foundation.sql <<<

alter type publication_state_type add value if not exists 'auto_checked' after 'submitted';
alter type publication_state_type add value if not exists 'flagged' after 'auto_checked';

alter type risk_state_type add value if not exists 'low' after 'normal';
alter type risk_state_type add value if not exists 'medium' after 'low';
alter type risk_state_type add value if not exists 'high' after 'medium';
alter type risk_state_type add value if not exists 'blocked' after 'high';

create table if not exists risk.risk_detection_rules (
  id uuid primary key default gen_random_uuid(),
  section section_type not null,
  rule_code text not null,
  rule_name text not null,
  severity text not null,
  score_delta integer not null default 0,
  action_type text not null,
  is_active boolean not null default true,
  config_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section, rule_code)
);

create table if not exists risk.risk_detection_results (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  section section_type not null,
  rule_code text not null,
  severity text not null,
  score_delta integer not null default 0,
  action_type text not null,
  message text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists risk.risk_profiles (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,
  subject_id uuid not null,
  section section_type not null,
  total_score integer not null default 0,
  risk_state risk_state_type not null default 'normal',
  last_checked_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_type, subject_id, section)
);

create table if not exists risk.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  section section_type not null,
  queue_type text not null,
  priority text not null default 'medium',
  reason_codes_json jsonb not null default '[]'::jsonb,
  assigned_to uuid references core.users(id),
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists risk_detection_results_listing_created_idx
  on risk.risk_detection_results (listing_id, created_at desc);

create index if not exists risk_profiles_section_state_checked_idx
  on risk.risk_profiles (section, risk_state, last_checked_at desc);

create index if not exists risk_moderation_queue_status_priority_idx
  on risk.moderation_queue (status, priority, updated_at desc);

alter table risk.risk_detection_rules enable row level security;
alter table risk.risk_detection_results enable row level security;
alter table risk.risk_profiles enable row level security;
alter table risk.moderation_queue enable row level security;

drop policy if exists risk_detection_rules_authenticated_select on risk.risk_detection_rules;
drop policy if exists risk_detection_rules_admin_manage on risk.risk_detection_rules;
drop policy if exists risk_detection_results_owner_company_select on risk.risk_detection_results;
drop policy if exists risk_profiles_owner_company_select on risk.risk_profiles;
drop policy if exists risk_moderation_queue_admin_select on risk.moderation_queue;
drop policy if exists risk_moderation_queue_admin_update on risk.moderation_queue;

create policy risk_detection_rules_authenticated_select on risk.risk_detection_rules
for select to authenticated
using (is_active or ops.is_admin());

create policy risk_detection_rules_admin_manage on risk.risk_detection_rules
for all to authenticated
using (ops.is_admin())
with check (ops.is_admin());

create policy risk_detection_results_owner_company_select on risk.risk_detection_results
for select to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or ops.is_admin()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy risk_profiles_owner_company_select on risk.risk_profiles
for select to authenticated
using (
  ops.is_admin()
  or (
    subject_type = 'listing'
    and exists (
      select 1
      from listing.listing_core lc
      where lc.id = subject_id
        and (
          lc.owner_user_id = core.current_user_id()
          or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
        )
    )
  )
);

create policy risk_moderation_queue_admin_select on risk.moderation_queue
for select to authenticated
using (ops.is_admin());

create policy risk_moderation_queue_admin_update on risk.moderation_queue
for update to authenticated
using (ops.is_admin())
with check (ops.is_admin());

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
  ('property', 'property_missing_advertiser_identity', 'Property advertiser identity missing', 'high', 60, 'pending_review', true, '{}'::jsonb),
  ('property', 'property_missing_permit', 'Required property permit missing', 'critical', 100, 'block', true, '{}'::jsonb),
  ('property', 'property_expired_permit', 'Property permit expired', 'critical', 100, 'block', true, '{}'::jsonb),
  ('property', 'property_missing_permit_qr', 'Property permit verification payload missing', 'medium', 40, 'pending_review', true, '{}'::jsonb),
  ('property', 'property_incomplete_listing', 'Property listing missing key quality fields', 'medium', 30, 'pending_review', true, '{"minimumImageCount":3}'::jsonb),
  ('property', 'property_low_image_count', 'Property listing has too few images', 'low', 10, 'warning', true, '{"minimumImageCount":3}'::jsonb),
  ('property', 'property_suspicious_price', 'Property pricing looks suspicious', 'medium', 40, 'pending_review', true, '{"saleFloor":10000,"yearlyRentFloor":5000,"monthlyRentFloor":500,"weeklyRentFloor":100,"dailyRentFloor":50}'::jsonb),
  ('property', 'property_duplicate_listing', 'Property duplicate suspected', 'high', 80, 'block', true, '{}'::jsonb),
  ('property', 'property_unverified_company', 'Property company is not verified', 'low', 20, 'warning', true, '{}'::jsonb),
  ('property', 'property_repeat_rejections', 'Property poster has repeated rejected listings', 'medium', 30, 'pending_review', true, '{"recentWindowDays":30,"rejectionThreshold":2}'::jsonb)
on conflict (section, rule_code) do update
set
  rule_name = excluded.rule_name,
  severity = excluded.severity,
  score_delta = excluded.score_delta,
  action_type = excluded.action_type,
  is_active = excluded.is_active,
  config_json = excluded.config_json,
  updated_at = now();

create or replace function public.record_listing_auto_check(payload jsonb)
returns table (
  listing_id uuid,
  total_score integer,
  risk_state risk_state_type,
  publication_state publication_state_type,
  moderation_queue_id uuid
)
language plpgsql
security definer
set search_path = public, core, company, listing, risk, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_section section_type := nullif(payload ->> 'section', '')::section_type;
  v_total_score integer := coalesce((payload ->> 'totalScore')::integer, 0);
  v_risk_state risk_state_type := coalesce(nullif(payload ->> 'riskState', ''), 'normal')::risk_state_type;
  v_publication_state publication_state_type := coalesce(nullif(payload ->> 'publicationState', ''), 'auto_checked')::publication_state_type;
  v_queue_type text := nullif(trim(payload ->> 'queueType'), '');
  v_queue_priority text := nullif(trim(payload ->> 'queuePriority'), '');
  v_reason_codes jsonb := coalesce(payload -> 'reasonCodes', '[]'::jsonb);
  v_blocking_reasons jsonb := coalesce(payload -> 'blockingReasons', '[]'::jsonb);
  v_warnings jsonb := coalesce(payload -> 'warnings', '[]'::jsonb);
  v_results jsonb := coalesce(payload -> 'results', '[]'::jsonb);
  v_listing_owner_user_id uuid;
  v_listing_owner_company_id uuid;
  v_queue_id uuid;
  v_result jsonb;
  v_triggered_count integer := 0;
  v_requires_queue boolean := false;
begin
  if v_actor_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_listing_id is null or v_section is null then
    raise exception 'Listing and section are required';
  end if;

  select lc.owner_user_id, lc.owner_company_id
  into v_listing_owner_user_id, v_listing_owner_company_id
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = v_section;

  if v_listing_owner_user_id is null then
    raise exception 'Listing not found for auto-check persistence';
  end if;

  if not ops.is_admin(v_actor_user_id)
    and v_listing_owner_user_id <> v_actor_user_id
    and (
      v_listing_owner_company_id is null
      or not (
        company.has_permission(v_listing_owner_company_id, 'submit_for_review', v_actor_user_id)
        or company.has_permission(v_listing_owner_company_id, 'edit_company_listing', v_actor_user_id)
        or company.has_permission(v_listing_owner_company_id, 'manage_company_inventory', v_actor_user_id)
      )
    ) then
    raise exception 'You do not have permission to persist auto-check results for this listing';
  end if;

  delete from risk.risk_detection_results rdr
  where rdr.listing_id = v_listing_id
    and rdr.section = v_section;

  for v_result in
    select value
    from jsonb_array_elements(v_results)
  loop
    insert into risk.risk_detection_results (
      listing_id,
      section,
      rule_code,
      severity,
      score_delta,
      action_type,
      message,
      metadata_json
    )
    values (
      v_listing_id,
      v_section,
      coalesce(nullif(v_result ->> 'ruleCode', ''), 'unknown_rule'),
      coalesce(nullif(v_result ->> 'severity', ''), 'low'),
      coalesce((v_result ->> 'scoreDelta')::integer, 0),
      coalesce(nullif(v_result ->> 'actionType', ''), 'warning'),
      coalesce(nullif(v_result ->> 'message', ''), 'Risk signal recorded.'),
      coalesce(v_result -> 'metadata', '{}'::jsonb)
    );

    v_triggered_count := v_triggered_count + 1;
  end loop;

  insert into risk.risk_profiles (
    subject_type,
    subject_id,
    section,
    total_score,
    risk_state,
    last_checked_at,
    updated_at
  )
  values (
    'listing',
    v_listing_id,
    v_section,
    v_total_score,
    v_risk_state,
    now(),
    now()
  )
  on conflict (subject_type, subject_id, section) do update
  set
    total_score = excluded.total_score,
    risk_state = excluded.risk_state,
    last_checked_at = excluded.last_checked_at,
    updated_at = excluded.updated_at;

  update listing.listing_core
  set risk_state = v_risk_state,
      publication_state = v_publication_state,
      updated_at = now()
  where id = v_listing_id;

  v_requires_queue := v_total_score >= 50
    or jsonb_array_length(v_blocking_reasons) > 0
    or v_publication_state in ('flagged', 'pending_review', 'rejected');

  if v_requires_queue then
    if v_queue_priority is null then
      v_queue_priority := case
        when v_total_score >= 100 then 'urgent'
        when v_total_score >= 80 then 'high'
        when v_total_score >= 50 then 'medium'
        else 'low'
      end;
    end if;

    if v_queue_type is null then
      v_queue_type := case
        when v_section = 'property' and exists (
          select 1 from jsonb_array_elements_text(v_reason_codes) as reason(value)
          where reason.value like '%duplicate%'
        ) then 'property_duplicate'
        when v_section = 'property' then 'property_compliance'
        when v_section = 'jobs' then 'jobs_scam_review'
        when v_section = 'services' then 'services_provider_review'
        when v_section = 'motors' then 'motors_duplicate_review'
        when v_section = 'classifieds' then 'classifieds_spam_review'
        else 'directory_identity_review'
      end;
    end if;

    select mq.id
    into v_queue_id
    from risk.moderation_queue mq
    where mq.listing_id = v_listing_id
      and mq.section = v_section
      and mq.status in ('open', 'in_review')
    order by mq.updated_at desc
    limit 1;

    if v_queue_id is null then
      insert into risk.moderation_queue (
        listing_id,
        section,
        queue_type,
        priority,
        reason_codes_json,
        status
      )
      values (
        v_listing_id,
        v_section,
        v_queue_type,
        v_queue_priority,
        v_reason_codes,
        'open'
      )
      returning id into v_queue_id;
    else
      update risk.moderation_queue
      set
        queue_type = v_queue_type,
        priority = v_queue_priority,
        reason_codes_json = v_reason_codes,
        status = 'open',
        updated_at = now()
      where id = v_queue_id;
    end if;
  else
    update risk.moderation_queue
    set status = 'resolved',
        updated_at = now()
    where listing_id = v_listing_id
      and section = v_section
      and status in ('open', 'in_review');
  end if;

  insert into risk.risk_events (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    signal_type,
    score_delta,
    severity,
    metadata_json
  )
  values (
    case when ops.is_admin(v_actor_user_id) then 'admin' else 'user' end,
    v_actor_user_id,
    'listing',
    v_listing_id,
    'listing_auto_check_completed',
    v_total_score,
    v_risk_state::text,
    jsonb_build_object(
      'section',
      v_section,
      'publication_state',
      v_publication_state,
      'triggered_rule_count',
      v_triggered_count,
      'reason_codes',
      v_reason_codes,
      'blocking_reasons',
      v_blocking_reasons,
      'warnings',
      v_warnings
    )
  );

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    case when ops.is_admin(v_actor_user_id) then 'admin' else 'user' end,
    v_actor_user_id,
    'listing',
    v_listing_id,
    'listing_auto_checked',
    jsonb_build_object(
      'section',
      v_section,
      'total_score',
      v_total_score,
      'risk_state',
      v_risk_state,
      'publication_state',
      v_publication_state,
      'queue_id',
      v_queue_id,
      'triggered_rule_count',
      v_triggered_count
    )
  );

  return query
  select v_listing_id, v_total_score, v_risk_state, v_publication_state, v_queue_id;
end;
$$;

revoke all on function public.record_listing_auto_check(jsonb) from public;
grant execute on function public.record_listing_auto_check(jsonb) to authenticated;

-- <<< END 20260324_0015_risk_engine_foundation.sql >>>


-- >>> BEGIN 20260324_0016_trust_profile_rollups.sql <<<

drop policy if exists risk_profiles_owner_company_select on risk.risk_profiles;

create policy risk_profiles_owner_company_select on risk.risk_profiles
for select to authenticated
using (
  ops.is_admin()
  or (
    subject_type = 'listing'
    and exists (
      select 1
      from listing.listing_core lc
      where lc.id = subject_id
        and (
          lc.owner_user_id = core.current_user_id()
          or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
        )
    )
  )
  or (subject_type = 'user' and subject_id = core.current_user_id())
  or (subject_type = 'company' and company.is_company_member(subject_id))
);

create or replace function public.refresh_listing_trust_profiles(payload jsonb)
returns table (
  listing_id uuid,
  user_total_score integer,
  user_risk_state risk_state_type,
  company_total_score integer,
  company_risk_state risk_state_type
)
language plpgsql
security definer
set search_path = public, core, company, listing, risk, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_section section_type := nullif(payload ->> 'section', '')::section_type;
  v_owner_user_id uuid;
  v_owner_company_id uuid;
  v_user_avg_score numeric := 0;
  v_user_rejected_count integer := 0;
  v_user_identity_credit integer := 0;
  v_user_total_score integer := 0;
  v_user_risk_state risk_state_type := 'normal';
  v_company_avg_score numeric := 0;
  v_company_rejected_count integer := 0;
  v_company_verification_credit integer := 0;
  v_company_total_score integer := 0;
  v_company_risk_state risk_state_type := 'normal';
begin
  if v_actor_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_listing_id is null or v_section is null then
    raise exception 'Listing and section are required';
  end if;

  select lc.owner_user_id, lc.owner_company_id
  into v_owner_user_id, v_owner_company_id
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = v_section;

  if v_owner_user_id is null then
    raise exception 'Listing not found for trust rollup';
  end if;

  if not ops.is_admin(v_actor_user_id)
    and v_owner_user_id <> v_actor_user_id
    and (
      v_owner_company_id is null
      or not (
        company.has_permission(v_owner_company_id, 'submit_for_review', v_actor_user_id)
        or company.has_permission(v_owner_company_id, 'edit_company_listing', v_actor_user_id)
        or company.has_permission(v_owner_company_id, 'manage_company_inventory', v_actor_user_id)
      )
    ) then
    raise exception 'You do not have permission to refresh trust profiles for this listing';
  end if;

  select
    coalesce(avg(rp.total_score), 0),
    count(*) filter (where lc.publication_state = 'rejected')
  into v_user_avg_score, v_user_rejected_count
  from listing.listing_core lc
  join risk.risk_profiles rp
    on rp.subject_type = 'listing'
   and rp.subject_id = lc.id
   and rp.section = lc.section
  where lc.section = v_section
    and lc.owner_user_id = v_owner_user_id;

  select case when cp.is_identity_verified then 5 else 0 end
  into v_user_identity_credit
  from core.profiles cp
  where cp.user_id = v_owner_user_id;

  v_user_total_score := greatest(0, round(coalesce(v_user_avg_score, 0))::integer + least(v_user_rejected_count * 10, 40) - v_user_identity_credit);
  v_user_risk_state := case
    when v_user_total_score >= 100 then 'blocked'
    when v_user_total_score >= 80 then 'high'
    when v_user_total_score >= 50 then 'medium'
    when v_user_total_score >= 20 then 'low'
    else 'normal'
  end;

  insert into risk.risk_profiles (
    subject_type,
    subject_id,
    section,
    total_score,
    risk_state,
    last_checked_at,
    updated_at
  )
  values (
    'user',
    v_owner_user_id,
    v_section,
    v_user_total_score,
    v_user_risk_state,
    now(),
    now()
  )
  on conflict (subject_type, subject_id, section) do update
  set
    total_score = excluded.total_score,
    risk_state = excluded.risk_state,
    last_checked_at = excluded.last_checked_at,
    updated_at = excluded.updated_at;

  if v_owner_company_id is not null then
    select
      coalesce(avg(rp.total_score), 0),
      count(*) filter (where lc.publication_state = 'rejected')
    into v_company_avg_score, v_company_rejected_count
    from listing.listing_core lc
    join risk.risk_profiles rp
      on rp.subject_type = 'listing'
     and rp.subject_id = lc.id
     and rp.section = lc.section
    where lc.section = v_section
      and lc.owner_company_id = v_owner_company_id;

    select case when c.verification_status = 'verified' then 10 else 0 end
    into v_company_verification_credit
    from company.companies c
    where c.id = v_owner_company_id;

    v_company_total_score := greatest(0, round(coalesce(v_company_avg_score, 0))::integer + least(v_company_rejected_count * 10, 40) - v_company_verification_credit);
    v_company_risk_state := case
      when v_company_total_score >= 100 then 'blocked'
      when v_company_total_score >= 80 then 'high'
      when v_company_total_score >= 50 then 'medium'
      when v_company_total_score >= 20 then 'low'
      else 'normal'
    end;

    insert into risk.risk_profiles (
      subject_type,
      subject_id,
      section,
      total_score,
      risk_state,
      last_checked_at,
      updated_at
    )
    values (
      'company',
      v_owner_company_id,
      v_section,
      v_company_total_score,
      v_company_risk_state,
      now(),
      now()
    )
    on conflict (subject_type, subject_id, section) do update
    set
      total_score = excluded.total_score,
      risk_state = excluded.risk_state,
      last_checked_at = excluded.last_checked_at,
      updated_at = excluded.updated_at;
  end if;

  insert into risk.risk_events (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    signal_type,
    score_delta,
    severity,
    metadata_json
  )
  values (
    case when ops.is_admin(v_actor_user_id) then 'admin' else 'user' end,
    v_actor_user_id,
    'listing',
    v_listing_id,
    'listing_trust_profiles_refreshed',
    greatest(v_user_total_score, coalesce(v_company_total_score, 0)),
    case
      when greatest(v_user_total_score, coalesce(v_company_total_score, 0)) >= 100 then 'blocked'
      when greatest(v_user_total_score, coalesce(v_company_total_score, 0)) >= 80 then 'high'
      when greatest(v_user_total_score, coalesce(v_company_total_score, 0)) >= 50 then 'medium'
      when greatest(v_user_total_score, coalesce(v_company_total_score, 0)) >= 20 then 'low'
      else 'normal'
    end,
    jsonb_build_object(
      'section', v_section,
      'user_total_score', v_user_total_score,
      'user_risk_state', v_user_risk_state,
      'company_total_score', case when v_owner_company_id is not null then v_company_total_score else null end,
      'company_risk_state', case when v_owner_company_id is not null then v_company_risk_state else null end
    )
  );

  insert into ops.audit_logs (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    case when ops.is_admin(v_actor_user_id) then 'admin' else 'user' end,
    v_actor_user_id,
    'listing',
    v_listing_id,
    'listing_trust_profiles_refreshed',
    jsonb_build_object(
      'section', v_section,
      'user_total_score', v_user_total_score,
      'user_risk_state', v_user_risk_state,
      'company_total_score', case when v_owner_company_id is not null then v_company_total_score else null end,
      'company_risk_state', case when v_owner_company_id is not null then v_company_risk_state else null end
    )
  );

  return query
  select v_listing_id, v_user_total_score, v_user_risk_state, v_company_total_score, v_company_risk_state;
end;
$$;

revoke all on function public.refresh_listing_trust_profiles(jsonb) from public;
grant execute on function public.refresh_listing_trust_profiles(jsonb) to authenticated;

-- <<< END 20260324_0016_trust_profile_rollups.sql >>>


-- >>> BEGIN 20260324_0017_risk_rule_expansion_jobs_services.sql <<<

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

-- <<< END 20260324_0017_risk_rule_expansion_jobs_services.sql >>>


-- >>> BEGIN 20260324_0018_risk_rule_expansion_motors.sql <<<

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

-- <<< END 20260324_0018_risk_rule_expansion_motors.sql >>>


-- >>> BEGIN 20260324_0019_risk_rule_expansion_classifieds_directory.sql <<<

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

-- <<< END 20260324_0019_risk_rule_expansion_classifieds_directory.sql >>>

