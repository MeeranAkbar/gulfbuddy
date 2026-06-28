create table if not exists property.property_compliance_documents (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  document_type text not null,
  document_label text not null,
  storage_path text,
  access_url text,
  file_name text,
  mime_type text,
  uploaded_by_user_id uuid not null references core.users(id) on delete cascade,
  review_state text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_compliance_documents_listing_created_idx
  on property.property_compliance_documents (listing_id, created_at desc);

alter table property.property_compliance_documents enable row level security;

drop policy if exists property_compliance_documents_owner_or_company_select on property.property_compliance_documents;
drop policy if exists property_compliance_documents_owner_or_company_insert on property.property_compliance_documents;
drop policy if exists property_compliance_documents_admin_update on property.property_compliance_documents;

create policy property_compliance_documents_owner_or_company_select on property.property_compliance_documents
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

create policy property_compliance_documents_owner_or_company_insert on property.property_compliance_documents
for insert to authenticated
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
            or company.has_permission(lc.owner_company_id, 'view_compliance_status')
          )
        )
      )
  )
);

create policy property_compliance_documents_admin_update on property.property_compliance_documents
for update to authenticated
using (ops.is_admin())
with check (ops.is_admin());

create or replace function public.add_property_compliance_document(payload jsonb)
returns table (
  document_id uuid,
  listing_id uuid,
  review_state text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_listing_id uuid := nullif(payload ->> 'listingId', '')::uuid;
  v_document_type text := nullif(trim(payload ->> 'documentType'), '');
  v_document_label text := nullif(trim(payload ->> 'documentLabel'), '');
  v_access_url text := nullif(trim(payload ->> 'accessUrl'), '');
  v_storage_path text := nullif(trim(payload ->> 'storagePath'), '');
  v_file_name text := nullif(trim(payload ->> 'fileName'), '');
  v_mime_type text := nullif(trim(payload ->> 'mimeType'), '');
  v_notes text := nullif(trim(payload ->> 'notes'), '');
  v_owner_company_id uuid;
  v_owner_user_id uuid;
  v_document_id uuid;
begin
  if v_actor_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_listing_id is null or v_document_type is null or v_document_label is null then
    raise exception 'Listing, document type, and document label are required';
  end if;

  if v_access_url is null and v_storage_path is null then
    raise exception 'Document URL or storage path is required';
  end if;

  select lc.owner_company_id, lc.owner_user_id
  into v_owner_company_id, v_owner_user_id
  from listing.listing_core lc
  where lc.id = v_listing_id
    and lc.section = 'property';

  if v_owner_user_id is null then
    raise exception 'Property listing not found';
  end if;

  if not ops.is_admin(v_actor_user_id)
    and v_owner_user_id <> v_actor_user_id
    and (
      v_owner_company_id is null
      or not (
        company.has_permission(v_owner_company_id, 'edit_company_listing', v_actor_user_id)
        or company.has_permission(v_owner_company_id, 'manage_company_inventory', v_actor_user_id)
        or company.has_permission(v_owner_company_id, 'view_compliance_status', v_actor_user_id)
      )
    ) then
    raise exception 'You do not have permission to attach compliance documents to this listing';
  end if;

  insert into property.property_compliance_documents (
    listing_id,
    document_type,
    document_label,
    storage_path,
    access_url,
    file_name,
    mime_type,
    uploaded_by_user_id,
    review_state,
    notes
  )
  values (
    v_listing_id,
    v_document_type,
    v_document_label,
    v_storage_path,
    v_access_url,
    v_file_name,
    v_mime_type,
    v_actor_user_id,
    'pending',
    v_notes
  )
  returning id into v_document_id;

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
    'property_compliance_document',
    v_document_id,
    'property_compliance_document_added',
    jsonb_build_object(
      'listing_id',
      v_listing_id,
      'document_type',
      v_document_type,
      'document_label',
      v_document_label
    )
  );

  return query
  select v_document_id, v_listing_id, 'pending';
end;
$$;

create or replace function public.set_property_compliance_document_review(payload jsonb)
returns table (
  document_id uuid,
  review_state text
)
language plpgsql
security definer
set search_path = public, core, property, ops
as $$
declare
  v_actor_user_id uuid := core.current_user_id();
  v_document_id uuid := nullif(payload ->> 'documentId', '')::uuid;
  v_review_state text := nullif(trim(payload ->> 'reviewState'), '');
  v_notes text := nullif(trim(payload ->> 'notes'), '');
begin
  if v_actor_user_id is null or not ops.is_admin(v_actor_user_id) then
    raise exception 'Admin access required';
  end if;

  if v_document_id is null or v_review_state is null then
    raise exception 'Document and review state are required';
  end if;

  if v_review_state not in ('pending', 'accepted', 'needs_more_info', 'rejected') then
    raise exception 'Unsupported document review state';
  end if;

  update property.property_compliance_documents
  set
    review_state = v_review_state,
    notes = coalesce(v_notes, notes),
    updated_at = now()
  where id = v_document_id;

  if not found then
    raise exception 'Compliance document not found';
  end if;

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
    v_actor_user_id,
    'property_compliance_document',
    v_document_id,
    'property_compliance_document_reviewed',
    jsonb_build_object(
      'review_state',
      v_review_state,
      'notes',
      v_notes
    )
  );

  return query
  select v_document_id, v_review_state;
end;
$$;

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
  v_document_count integer := 0;
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
    select count(*)
    into v_document_count
    from property.property_compliance_documents pcd
    where pcd.listing_id = v_listing_id;

    if v_document_count = 0 then
      raise exception 'Upload at least one compliance document before submitting this property for review';
    end if;

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
      v_moderation_state,
      'document_count',
      v_document_count
    )
  );

  return query
  select v_listing_id, v_new_publication_state, v_next_compliance_state, v_moderation_state;
end;
$$;

revoke all on function public.add_property_compliance_document(jsonb) from public;
revoke all on function public.set_property_compliance_document_review(jsonb) from public;
revoke all on function public.submit_property_for_review(jsonb) from public;

grant execute on function public.add_property_compliance_document(jsonb) to authenticated;
grant execute on function public.set_property_compliance_document_review(jsonb) to authenticated;
grant execute on function public.submit_property_for_review(jsonb) to authenticated;
