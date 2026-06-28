alter type publication_state_type add value if not exists 'auto_checked' after 'submitted';
alter type publication_state_type add value if not exists 'flagged' after 'auto_checked';

alter type risk_state_type add value if not exists 'low' after 'normal';
alter type risk_state_type add value if not exists 'medium' after 'low';
alter type risk_state_type add value if not exists 'high' after 'medium';
alter type risk_state_type add value if not exists 'blocked' after 'high';

create table if not exists risk.risk_detection_rules (
  id uuid primary key default gen_random_uuid(),
  section section_type not null,
  rule_code text not null,
  rule_name text not null,
  severity text not null,
  score_delta integer not null default 0,
  action_type text not null,
  is_active boolean not null default true,
  config_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section, rule_code)
);

create table if not exists risk.risk_detection_results (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  section section_type not null,
  rule_code text not null,
  severity text not null,
  score_delta integer not null default 0,
  action_type text not null,
  message text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists risk.risk_profiles (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,
  subject_id uuid not null,
  section section_type not null,
  total_score integer not null default 0,
  risk_state risk_state_type not null default 'normal',
  last_checked_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_type, subject_id, section)
);

create table if not exists risk.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  section section_type not null,
  queue_type text not null,
  priority text not null default 'medium',
  reason_codes_json jsonb not null default '[]'::jsonb,
  assigned_to uuid references core.users(id),
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists risk_detection_results_listing_created_idx
  on risk.risk_detection_results (listing_id, created_at desc);

create index if not exists risk_profiles_section_state_checked_idx
  on risk.risk_profiles (section, risk_state, last_checked_at desc);

create index if not exists risk_moderation_queue_status_priority_idx
  on risk.moderation_queue (status, priority, updated_at desc);

alter table risk.risk_detection_rules enable row level security;
alter table risk.risk_detection_results enable row level security;
alter table risk.risk_profiles enable row level security;
alter table risk.moderation_queue enable row level security;

drop policy if exists risk_detection_rules_authenticated_select on risk.risk_detection_rules;
drop policy if exists risk_detection_rules_admin_manage on risk.risk_detection_rules;
drop policy if exists risk_detection_results_owner_company_select on risk.risk_detection_results;
drop policy if exists risk_profiles_owner_company_select on risk.risk_profiles;
drop policy if exists risk_moderation_queue_admin_select on risk.moderation_queue;
drop policy if exists risk_moderation_queue_admin_update on risk.moderation_queue;

create policy risk_detection_rules_authenticated_select on risk.risk_detection_rules
for select to authenticated
using (is_active or ops.is_admin());

create policy risk_detection_rules_admin_manage on risk.risk_detection_rules
for all to authenticated
using (ops.is_admin())
with check (ops.is_admin());

create policy risk_detection_results_owner_company_select on risk.risk_detection_results
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
);

create policy risk_moderation_queue_admin_select on risk.moderation_queue
for select to authenticated
using (ops.is_admin());

create policy risk_moderation_queue_admin_update on risk.moderation_queue
for update to authenticated
using (ops.is_admin())
with check (ops.is_admin());

insert into risk.risk_detection_rules (
  section,
  rule_code,
  rule_name,
  severity,
  score_delta,
  action_type,
  is_active,
  config_json
)
values
  ('property', 'property_missing_advertiser_identity', 'Property advertiser identity missing', 'high', 60, 'pending_review', true, '{}'::jsonb),
  ('property', 'property_missing_permit', 'Required property permit missing', 'critical', 100, 'block', true, '{}'::jsonb),
  ('property', 'property_expired_permit', 'Property permit expired', 'critical', 100, 'block', true, '{}'::jsonb),
  ('property', 'property_missing_permit_qr', 'Property permit verification payload missing', 'medium', 40, 'pending_review', true, '{}'::jsonb),
  ('property', 'property_incomplete_listing', 'Property listing missing key quality fields', 'medium', 30, 'pending_review', true, '{"minimumImageCount":3}'::jsonb),
  ('property', 'property_low_image_count', 'Property listing has too few images', 'low', 10, 'warning', true, '{"minimumImageCount":3}'::jsonb),
  ('property', 'property_suspicious_price', 'Property pricing looks suspicious', 'medium', 40, 'pending_review', true, '{"saleFloor":10000,"yearlyRentFloor":5000,"monthlyRentFloor":500,"weeklyRentFloor":100,"dailyRentFloor":50}'::jsonb),
  ('property', 'property_duplicate_listing', 'Property duplicate suspected', 'high', 80, 'block', true, '{}'::jsonb),
  ('property', 'property_unverified_company', 'Property company is not verified', 'low', 20, 'warning', true, '{}'::jsonb),
  ('property', 'property_repeat_rejections', 'Property poster has repeated rejected listings', 'medium', 30, 'pending_review', true, '{"recentWindowDays":30,"rejectionThreshold":2}'::jsonb)
on conflict (section, rule_code) do update
set
  rule_name = excluded.rule_name,
  severity = excluded.severity,
  score_delta = excluded.score_delta,
  action_type = excluded.action_type,
  is_active = excluded.is_active,
  config_json = excluded.config_json,
  updated_at = now();

create or replace function public.record_listing_auto_check(payload jsonb)
returns table (
  listing_id uuid,
  total_score integer,
  risk_state risk_state_type,
  publication_state publication_state_type,
  moderation_queue_id uuid
)
language plpgsql
security definer
set search_path = public, core, company, listing, risk, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_section section_type := nullif(payload ->> 'section', '')::section_type;
  v_total_score integer := coalesce((payload ->> 'totalScore')::integer, 0);
  v_risk_state risk_state_type := coalesce(nullif(payload ->> 'riskState', ''), 'normal')::risk_state_type;
  v_publication_state publication_state_type := coalesce(nullif(payload ->> 'publicationState', ''), 'auto_checked')::publication_state_type;
  v_queue_type text := nullif(trim(payload ->> 'queueType'), '');
  v_queue_priority text := nullif(trim(payload ->> 'queuePriority'), '');
  v_reason_codes jsonb := coalesce(payload -> 'reasonCodes', '[]'::jsonb);
  v_blocking_reasons jsonb := coalesce(payload -> 'blockingReasons', '[]'::jsonb);
  v_warnings jsonb := coalesce(payload -> 'warnings', '[]'::jsonb);
  v_results jsonb := coalesce(payload -> 'results', '[]'::jsonb);
  v_listing_owner_user_id uuid;
  v_listing_owner_company_id uuid;
  v_queue_id uuid;
  v_result jsonb;
  v_triggered_count integer := 0;
  v_requires_queue boolean := false;
begin
  if v_actor_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_listing_id is null or v_section is null then
    raise exception 'Listing and section are required';
  end if;

  select lc.owner_user_id, lc.owner_company_id
  into v_listing_owner_user_id, v_listing_owner_company_id
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = v_section;

  if v_listing_owner_user_id is null then
    raise exception 'Listing not found for auto-check persistence';
  end if;

  if not ops.is_admin(v_actor_user_id)
    and v_listing_owner_user_id <> v_actor_user_id
    and (
      v_listing_owner_company_id is null
      or not (
        company.has_permission(v_listing_owner_company_id, 'submit_for_review', v_actor_user_id)
        or company.has_permission(v_listing_owner_company_id, 'edit_company_listing', v_actor_user_id)
        or company.has_permission(v_listing_owner_company_id, 'manage_company_inventory', v_actor_user_id)
      )
    ) then
    raise exception 'You do not have permission to persist auto-check results for this listing';
  end if;

  delete from risk.risk_detection_results rdr
  where rdr.listing_id = v_listing_id
    and rdr.section = v_section;

  for v_result in
    select value
    from jsonb_array_elements(v_results)
  loop
    insert into risk.risk_detection_results (
      listing_id,
      section,
      rule_code,
      severity,
      score_delta,
      action_type,
      message,
      metadata_json
    )
    values (
      v_listing_id,
      v_section,
      coalesce(nullif(v_result ->> 'ruleCode', ''), 'unknown_rule'),
      coalesce(nullif(v_result ->> 'severity', ''), 'low'),
      coalesce((v_result ->> 'scoreDelta')::integer, 0),
      coalesce(nullif(v_result ->> 'actionType', ''), 'warning'),
      coalesce(nullif(v_result ->> 'message', ''), 'Risk signal recorded.'),
      coalesce(v_result -> 'metadata', '{}'::jsonb)
    );

    v_triggered_count := v_triggered_count + 1;
  end loop;

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
    'listing',
    v_listing_id,
    v_section,
    v_total_score,
    v_risk_state,
    now(),
    now()
  )
  on conflict (subject_type, subject_id, section) do update
  set
    total_score = excluded.total_score,
    risk_state = excluded.risk_state,
    last_checked_at = excluded.last_checked_at,
    updated_at = excluded.updated_at;

  update listing.listing_core
  set risk_state = v_risk_state,
      publication_state = v_publication_state,
      updated_at = now()
  where id = v_listing_id;

  v_requires_queue := v_total_score >= 50
    or jsonb_array_length(v_blocking_reasons) > 0
    or v_publication_state in ('flagged', 'pending_review', 'rejected');

  if v_requires_queue then
    if v_queue_priority is null then
      v_queue_priority := case
        when v_total_score >= 100 then 'urgent'
        when v_total_score >= 80 then 'high'
        when v_total_score >= 50 then 'medium'
        else 'low'
      end;
    end if;

    if v_queue_type is null then
      v_queue_type := case
        when v_section = 'property' and exists (
          select 1 from jsonb_array_elements_text(v_reason_codes) as reason(value)
          where reason.value like '%duplicate%'
        ) then 'property_duplicate'
        when v_section = 'property' then 'property_compliance'
        when v_section = 'jobs' then 'jobs_scam_review'
        when v_section = 'services' then 'services_provider_review'
        when v_section = 'motors' then 'motors_duplicate_review'
        when v_section = 'classifieds' then 'classifieds_spam_review'
        else 'directory_identity_review'
      end;
    end if;

    select mq.id
    into v_queue_id
    from risk.moderation_queue mq
    where mq.listing_id = v_listing_id
      and mq.section = v_section
      and mq.status in ('open', 'in_review')
    order by mq.updated_at desc
    limit 1;

    if v_queue_id is null then
      insert into risk.moderation_queue (
        listing_id,
        section,
        queue_type,
        priority,
        reason_codes_json,
        status
      )
      values (
        v_listing_id,
        v_section,
        v_queue_type,
        v_queue_priority,
        v_reason_codes,
        'open'
      )
      returning id into v_queue_id;
    else
      update risk.moderation_queue
      set
        queue_type = v_queue_type,
        priority = v_queue_priority,
        reason_codes_json = v_reason_codes,
        status = 'open',
        updated_at = now()
      where id = v_queue_id;
    end if;
  else
    update risk.moderation_queue
    set status = 'resolved',
        updated_at = now()
    where listing_id = v_listing_id
      and section = v_section
      and status in ('open', 'in_review');
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
    'listing_auto_check_completed',
    v_total_score,
    v_risk_state::text,
    jsonb_build_object(
      'section',
      v_section,
      'publication_state',
      v_publication_state,
      'triggered_rule_count',
      v_triggered_count,
      'reason_codes',
      v_reason_codes,
      'blocking_reasons',
      v_blocking_reasons,
      'warnings',
      v_warnings
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
    'listing_auto_checked',
    jsonb_build_object(
      'section',
      v_section,
      'total_score',
      v_total_score,
      'risk_state',
      v_risk_state,
      'publication_state',
      v_publication_state,
      'queue_id',
      v_queue_id,
      'triggered_rule_count',
      v_triggered_count
    )
  );

  return query
  select v_listing_id, v_total_score, v_risk_state, v_publication_state, v_queue_id;
end;
$$;

revoke all on function public.record_listing_auto_check(jsonb) from public;
grant execute on function public.record_listing_auto_check(jsonb) to authenticated;
