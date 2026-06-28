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
