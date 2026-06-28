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
