create or replace function public.create_company_with_owner(payload jsonb)
returns table (
  company_id uuid,
  branch_id uuid,
  company_slug text
)
language plpgsql
security definer
set search_path = public, core, company, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_company_id uuid;
  v_branch_id uuid;
  v_company_type company_type_enum;
  v_legal_name text;
  v_display_name text;
  v_slug text;
  v_description text;
  v_website text;
  v_license_number text;
  v_public_profile_enabled boolean := false;
  v_role text;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  v_company_type := (payload -> 'company' ->> 'companyType')::company_type_enum;
  v_legal_name := nullif(trim(payload -> 'company' ->> 'legalName'), '');
  v_display_name := nullif(trim(payload -> 'company' ->> 'displayName'), '');
  v_slug := nullif(trim(payload -> 'company' ->> 'slug'), '');
  v_description := nullif(trim(payload ->> 'publicProfileSummary'), '');
  v_website := nullif(trim(payload -> 'company' ->> 'website'), '');
  v_license_number := nullif(trim(payload -> 'company' ->> 'licenseNumber'), '');
  v_public_profile_enabled := coalesce((payload -> 'company' ->> 'publicProfileEnabled')::boolean, false);
  v_role := nullif(trim(payload ->> 'primaryRole'), '');

  if v_company_type is null or v_legal_name is null or v_display_name is null or v_slug is null or v_role is null then
    raise exception 'Company type, names, slug, and primary role are required';
  end if;

  insert into company.companies (
    company_type,
    legal_name,
    display_name,
    slug,
    description,
    website,
    license_number,
    public_profile_enabled
  )
  values (
    v_company_type,
    v_legal_name,
    v_display_name,
    v_slug,
    v_description,
    v_website,
    v_license_number,
    v_public_profile_enabled
  )
  returning id into v_company_id;

  insert into company.company_members (
    company_id,
    user_id,
    role,
    permissions_json,
    is_primary,
    status,
    joined_at
  )
  values (
    v_company_id,
    v_user_id,
    v_role,
    '[]'::jsonb,
    true,
    'active',
    now()
  );

  if nullif(trim(payload -> 'branch' ->> 'name'), '') is not null then
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
      trim(payload -> 'branch' ->> 'name'),
      nullif(trim(payload -> 'branch' ->> 'emirate'), ''),
      nullif(trim(payload -> 'branch' ->> 'area'), ''),
      nullif(trim(payload -> 'branch' ->> 'address'), ''),
      nullif(trim(payload -> 'branch' ->> 'phone'), ''),
      nullif(trim(payload -> 'branch' ->> 'email'), ''),
      coalesce((payload -> 'branch' ->> 'isActive')::boolean, true)
    )
    returning id into v_branch_id;
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
    'user',
    v_user_id,
    'company',
    v_company_id,
    'company_created',
    jsonb_build_object(
      'company_type',
      v_company_type,
      'company_slug',
      v_slug,
      'branch_created',
      v_branch_id is not null
    )
  );

  return query
  select v_company_id, v_branch_id, v_slug;
end;
$$;

create or replace function public.create_property_draft(payload jsonb)
returns table (
  listing_id uuid,
  listing_slug text
)
language plpgsql
security definer
set search_path = public, core, company, listing, property, ops
as $$
declare
  v_user_id uuid := core.current_user_id();
  v_listing_id uuid;
  v_listing_slug text;
  v_owner_company_id uuid := nullif(payload ->> 'ownerCompanyId', '')::uuid;
  v_branch_id uuid := nullif(payload ->> 'branchId', '')::uuid;
  v_advertiser_type text := nullif(trim(payload -> 'compliance' ->> 'advertiserType'), '');
  v_source_relationship_type text := nullif(trim(payload ->> 'sourceRelationshipType'), '');
  v_agency_company_id uuid;
  v_developer_company_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if v_owner_company_id is null then
    raise exception 'A company is required before creating regulated property drafts';
  end if;

  if not ops.is_admin(v_user_id) and not company.has_permission(v_owner_company_id, 'create_listing', v_user_id) then
    raise exception 'You do not have permission to create listings for this company';
  end if;

  if v_branch_id is not null and not exists (
    select 1
    from company.company_branches cb
    where cb.id = v_branch_id
      and cb.company_id = v_owner_company_id
  ) then
    raise exception 'Selected branch does not belong to the chosen company';
  end if;

  if v_advertiser_type in ('agency', 'agent', 'holiday_home_operator') then
    v_agency_company_id := v_owner_company_id;
  elsif v_advertiser_type = 'developer' then
    v_developer_company_id := v_owner_company_id;
  end if;

  v_listing_slug := trim(payload ->> 'slug');

  insert into listing.listing_core (
    section,
    owner_user_id,
    owner_company_id,
    branch_id,
    seller_type,
    slug,
    title,
    description,
    emirate,
    area,
    area_slug,
    location_text,
    lat,
    lng,
    price_amount,
    price_currency,
    visibility_state,
    publication_state,
    risk_state,
    monetization_state
  )
  values (
    'property',
    v_user_id,
    v_owner_company_id,
    v_branch_id,
    (payload ->> 'sellerType')::seller_type_enum,
    v_listing_slug,
    trim(payload ->> 'title'),
    trim(payload ->> 'description'),
    trim(payload ->> 'emirate'),
    nullif(trim(payload ->> 'area'), ''),
    nullif(trim(payload ->> 'areaSlug'), ''),
    nullif(trim(payload ->> 'locationText'), ''),
    nullif(payload ->> 'lat', '')::numeric,
    nullif(payload ->> 'lng', '')::numeric,
    nullif(payload ->> 'priceAmount', '')::numeric,
    coalesce(nullif(trim(payload ->> 'priceCurrency'), ''), 'AED'),
    'public',
    'draft',
    'normal',
    'none'
  )
  returning id into v_listing_id;

  insert into property.property_listing_details (
    listing_id,
    market_mode,
    purpose,
    property_type,
    property_subtype,
    bedrooms,
    bathrooms,
    size_sqft,
    furnishing,
    completion_status,
    building_name,
    community_name,
    project_name,
    tower_name,
    permit_display_text,
    rent_frequency,
    is_short_term,
    is_project_listing
  )
  values (
    v_listing_id,
    trim(payload -> 'property' ->> 'marketMode'),
    trim(payload -> 'property' ->> 'purpose'),
    trim(payload -> 'property' ->> 'propertyType'),
    nullif(trim(payload -> 'property' ->> 'propertySubtype'), ''),
    nullif(payload -> 'property' ->> 'bedrooms', '')::integer,
    nullif(payload -> 'property' ->> 'bathrooms', '')::integer,
    nullif(payload -> 'property' ->> 'sizeSqft', '')::numeric,
    nullif(trim(payload -> 'property' ->> 'furnishing'), ''),
    nullif(trim(payload -> 'property' ->> 'completionStatus'), ''),
    nullif(trim(payload -> 'property' ->> 'buildingName'), ''),
    nullif(trim(payload -> 'property' ->> 'communityName'), ''),
    nullif(trim(payload -> 'property' ->> 'projectName'), ''),
    nullif(trim(payload -> 'property' ->> 'towerName'), ''),
    nullif(trim(payload -> 'property' ->> 'permitDisplayText'), ''),
    nullif(trim(payload -> 'property' ->> 'rentFrequency'), ''),
    coalesce((payload -> 'property' ->> 'isShortTerm')::boolean, false),
    coalesce((payload -> 'property' ->> 'isProjectListing')::boolean, false)
  );

  insert into property.property_compliance (
    listing_id,
    regulator_region,
    advertiser_type,
    permit_system,
    permit_number,
    permit_qr_payload,
    verification_status,
    verification_method,
    manual_review_required
  )
  values (
    v_listing_id,
    trim(payload -> 'compliance' ->> 'regulatorRegion'),
    v_advertiser_type,
    trim(payload -> 'compliance' ->> 'permitSystem'),
    nullif(trim(payload -> 'compliance' ->> 'permitNumber'), ''),
    nullif(trim(payload -> 'compliance' ->> 'permitQrPayload'), ''),
    case
      when coalesce((payload -> 'compliance' ->> 'manualReviewRequired')::boolean, true) then 'required_pending'::compliance_state_type
      else 'not_required'::compliance_state_type
    end,
    'manual',
    coalesce((payload -> 'compliance' ->> 'manualReviewRequired')::boolean, true)
  );

  insert into property.property_company_links (
    listing_id,
    agency_company_id,
    developer_company_id,
    branch_id,
    source_relationship_type
  )
  values (
    v_listing_id,
    v_agency_company_id,
    v_developer_company_id,
    v_branch_id,
    coalesce(v_source_relationship_type, 'owner_listing')
  );

  if nullif(trim(payload ->> 'publicPhone'), '') is not null
    or nullif(trim(payload ->> 'publicWhatsapp'), '') is not null
    or nullif(trim(payload ->> 'publicEmail'), '') is not null then
    insert into listing.listing_contacts (
      listing_id,
      public_phone,
      public_whatsapp,
      public_email,
      hide_number_until_click,
      click_to_reveal_enabled,
      preferred_contact_method
    )
    values (
      v_listing_id,
      nullif(trim(payload ->> 'publicPhone'), ''),
      nullif(trim(payload ->> 'publicWhatsapp'), ''),
      nullif(trim(payload ->> 'publicEmail'), ''),
      coalesce((payload ->> 'hideNumberUntilClick')::boolean, false),
      coalesce((payload ->> 'clickToRevealEnabled')::boolean, true),
      coalesce(nullif(trim(payload ->> 'preferredContactMethod'), ''), 'phone')
    );
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
    'user',
    v_user_id,
    'listing',
    v_listing_id,
    'property_draft_created',
    jsonb_build_object(
      'company_id',
      v_owner_company_id,
      'market_mode',
      payload -> 'property' ->> 'marketMode',
      'advertiser_type',
      v_advertiser_type,
      'emirate',
      payload ->> 'emirate'
    )
  );

  return query
  select v_listing_id, v_listing_slug;
end;
$$;

revoke all on function public.create_company_with_owner(jsonb) from public;
revoke all on function public.create_property_draft(jsonb) from public;

grant execute on function public.create_company_with_owner(jsonb) to authenticated;
grant execute on function public.create_property_draft(jsonb) to authenticated;
