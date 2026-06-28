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
