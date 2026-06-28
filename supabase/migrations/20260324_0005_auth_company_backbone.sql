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
