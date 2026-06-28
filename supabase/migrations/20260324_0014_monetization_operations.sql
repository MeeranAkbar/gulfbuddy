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
