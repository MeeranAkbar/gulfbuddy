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
