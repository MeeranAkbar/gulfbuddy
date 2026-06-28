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
