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
