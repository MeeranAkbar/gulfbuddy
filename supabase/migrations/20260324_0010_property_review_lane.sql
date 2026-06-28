create table if not exists listing.listing_status_history (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  previous_state publication_state_type,
  new_state publication_state_type not null,
  actor_type text not null,
  actor_id uuid,
  reason_code text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists listing_status_history_listing_created_idx
  on listing.listing_status_history(listing_id, created_at desc);

alter table listing.listing_status_history enable row level security;

create policy listing_status_history_owner_or_company_select on listing.listing_status_history
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

create or replace function public.submit_property_for_review(payload jsonb)
returns table (
  listing_id uuid,
  publication_state publication_state_type,
  compliance_state compliance_state_type,
  moderation_state text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, compliance, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_previous_state publication_state_type;
  v_new_publication_state publication_state_type := 'submitted';
  v_owner_company_id uuid;
  v_owner_user_id uuid;
  v_manual_review_required boolean := true;
  v_permit_system text;
  v_permit_number text;
  v_next_compliance_state compliance_state_type := 'required_pending';
  v_moderation_state text := 'pending_review';
  v_compliance_case_id uuid;
  v_moderation_case_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_listing_id is null then
    raise exception 'Listing is required';
  end if;

  select lc.publication_state, lc.owner_company_id, lc.owner_user_id
  into v_previous_state, v_owner_company_id, v_owner_user_id
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = 'property';

  if v_previous_state is null then
    raise exception 'Property listing not found';
  end if;

  if not ops.is_admin(v_user_id)
    and v_owner_user_id <> v_user_id
    and (
      v_owner_company_id is null
      or not company.has_permission(v_owner_company_id, 'submit_for_review', v_user_id)
    ) then
    raise exception 'You do not have permission to submit this listing for review';
  end if;

  if v_previous_state not in ('draft', 'rejected') then
    raise exception 'Only draft or rejected property listings can be submitted for review';
  end if;

  select pc.manual_review_required, pc.permit_system, pc.permit_number
  into v_manual_review_required, v_permit_system, v_permit_number
  from property.property_compliance pc
  where pc.listing_id = v_listing_id;

  if v_permit_system is null then
    raise exception 'Property compliance details are missing for this listing';
  end if;

  if v_permit_system in ('trakheesi', 'dari', 'holiday_home')
    and nullif(trim(coalesce(v_permit_number, '')), '') is null then
    raise exception 'Permit number is required before regulated property listings can enter review';
  end if;

  if v_manual_review_required then
    v_next_compliance_state := 'under_review';
  else
    v_next_compliance_state := 'not_required';
  end if;

  update listing.listing_core
  set publication_state = v_new_publication_state,
      updated_at = now()
  where id = v_listing_id;

  update property.property_compliance
  set verification_status = v_next_compliance_state,
      updated_at = now()
  where listing_id = v_listing_id;

  if v_manual_review_required then
    select cc.id
    into v_compliance_case_id
    from compliance.compliance_cases cc
    where cc.listing_id = v_listing_id
    order by cc.created_at desc
    limit 1;

    if v_compliance_case_id is null then
      insert into compliance.compliance_cases (
        section,
        listing_id,
        company_id,
        user_id,
        case_type,
        compliance_state,
        priority,
        notes
      )
      values (
        'property',
        v_listing_id,
        v_owner_company_id,
        v_owner_user_id,
        'property_permit_review',
        v_next_compliance_state,
        1,
        'Property listing submitted for permit-aware compliance review.'
      );
    else
      update compliance.compliance_cases
      set compliance_state = v_next_compliance_state,
          priority = 1,
          notes = 'Property listing resubmitted for permit-aware compliance review.',
          updated_at = now()
      where id = v_compliance_case_id;
    end if;
  end if;

  select mc.id
  into v_moderation_case_id
  from compliance.moderation_cases mc
  where mc.listing_id = v_listing_id
  order by mc.created_at desc
  limit 1;

  if v_moderation_case_id is null then
    insert into compliance.moderation_cases (
      section,
      listing_id,
      company_id,
      user_id,
      moderation_state,
      reason_code,
      queue,
      notes
    )
    values (
      'property',
      v_listing_id,
      v_owner_company_id,
      v_owner_user_id,
      v_moderation_state,
      'property_submission',
      'property_regulated',
      'Property listing submitted into moderated publishing lane.'
    );
  else
    update compliance.moderation_cases
    set moderation_state = v_moderation_state,
        reason_code = 'property_submission',
        queue = 'property_regulated',
        notes = 'Property listing resubmitted into moderated publishing lane.',
        updated_at = now()
    where id = v_moderation_case_id;
  end if;

  insert into listing.listing_status_history (
    listing_id,
    previous_state,
    new_state,
    actor_type,
    actor_id,
    reason_code,
    notes
  )
  values (
    v_listing_id,
    v_previous_state,
    v_new_publication_state,
    'user',
    v_user_id,
    'submit_for_review',
    'Property listing submitted into regulated review workflow.'
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
    'user',
    v_user_id,
    'listing',
    v_listing_id,
    'property_submitted_for_review',
    jsonb_build_object(
      'previous_state',
      v_previous_state,
      'new_state',
      v_new_publication_state,
      'compliance_state',
      v_next_compliance_state,
      'moderation_state',
      v_moderation_state
    )
  );

  return query
  select v_listing_id, v_new_publication_state, v_next_compliance_state, v_moderation_state;
end;
$$;

create or replace function public.review_property_submission(payload jsonb)
returns table (
  listing_id uuid,
  publication_state publication_state_type,
  compliance_state compliance_state_type,
  moderation_state text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, compliance, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_decision text := nullif(trim(payload ->> 'decision'), '');
  v_notes text := nullif(trim(payload ->> 'notes'), '');
  v_previous_state publication_state_type;
  v_new_publication_state publication_state_type;
  v_manual_review_required boolean := true;
  v_next_compliance_state compliance_state_type;
  v_next_moderation_state text;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if not ops.is_admin(v_user_id) then
    raise exception 'Admin access required';
  end if;

  if v_listing_id is null then
    raise exception 'Listing is required';
  end if;

  if v_decision not in ('approve', 'request_changes') then
    raise exception 'Unsupported review decision';
  end if;

  select lc.publication_state
  into v_previous_state
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = 'property';

  if v_previous_state is null then
    raise exception 'Property listing not found';
  end if;

  select coalesce(pc.manual_review_required, true)
  into v_manual_review_required
  from property.property_compliance pc
  where pc.listing_id = v_listing_id;

  if v_decision = 'approve' then
    v_new_publication_state := 'published';
    v_next_compliance_state := case when v_manual_review_required then 'verified' else 'not_required' end;
    v_next_moderation_state := 'approved';
  else
    v_new_publication_state := 'rejected';
    v_next_compliance_state := case when v_manual_review_required then 'required_pending' else 'not_required' end;
    v_next_moderation_state := 'changes_requested';
  end if;

  update listing.listing_core
  set publication_state = v_new_publication_state,
      published_at = case when v_decision = 'approve' then coalesce(published_at, now()) else published_at end,
      updated_at = now()
  where id = v_listing_id;

  update property.property_compliance
  set verification_status = v_next_compliance_state,
      compliance_notes = coalesce(v_notes, compliance_notes),
      updated_at = now()
  where listing_id = v_listing_id;

  update compliance.compliance_cases
  set compliance_state = v_next_compliance_state,
      notes = coalesce(v_notes, notes),
      updated_at = now()
  where listing_id = v_listing_id;

  update compliance.moderation_cases
  set moderation_state = v_next_moderation_state,
      notes = coalesce(v_notes, notes),
      updated_at = now()
  where listing_id = v_listing_id;

  insert into listing.listing_status_history (
    listing_id,
    previous_state,
    new_state,
    actor_type,
    actor_id,
    reason_code,
    notes
  )
  values (
    v_listing_id,
    v_previous_state,
    v_new_publication_state,
    'admin',
    v_user_id,
    v_decision,
    coalesce(v_notes, case when v_decision = 'approve' then 'Property approved and published.' else 'Property sent back for changes.' end)
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
    'admin',
    v_user_id,
    'listing',
    v_listing_id,
    case when v_decision = 'approve' then 'property_review_approved' else 'property_review_changes_requested' end,
    jsonb_build_object(
      'previous_state',
      v_previous_state,
      'new_state',
      v_new_publication_state,
      'compliance_state',
      v_next_compliance_state,
      'moderation_state',
      v_next_moderation_state
    )
  );

  return query
  select v_listing_id, v_new_publication_state, v_next_compliance_state, v_next_moderation_state;
end;
$$;

revoke all on function public.submit_property_for_review(jsonb) from public;
revoke all on function public.review_property_submission(jsonb) from public;

grant execute on function public.submit_property_for_review(jsonb) to authenticated;
grant execute on function public.review_property_submission(jsonb) to authenticated;
