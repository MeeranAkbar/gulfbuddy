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
