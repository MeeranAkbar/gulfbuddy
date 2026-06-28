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
