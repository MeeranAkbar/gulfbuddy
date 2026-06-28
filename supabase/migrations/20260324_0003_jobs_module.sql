create table if not exists jobs.candidate_profiles (
  user_id uuid primary key references core.users(id) on delete cascade,
  slug text unique,
  headline text,
  current_location text,
  nationality text,
  visa_status text,
  total_experience_years numeric(4,1),
  expected_salary_min numeric(12,2),
  expected_salary_max numeric(12,2),
  salary_currency text,
  preferred_emirates_json jsonb not null default '[]'::jsonb,
  preferred_work_modes_json jsonb not null default '[]'::jsonb,
  summary text,
  searchable_by_employers boolean not null default false,
  profile_visibility text not null default 'private',
  profile_strength_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs.candidate_cv_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  storage_path text not null,
  public_filename text not null,
  file_type text not null,
  file_size bigint not null,
  parsing_status text not null default 'pending',
  parsed_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs.candidate_experience (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  company_name text not null,
  role_title text not null,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  location text,
  description text,
  sort_order integer not null default 0
);

create table if not exists jobs.candidate_education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  institution text not null,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  grade text,
  description text,
  sort_order integer not null default 0
);

create table if not exists jobs.candidate_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  skill_name text not null,
  proficiency_level text,
  years_of_experience numeric(4,1)
);

create table if not exists jobs.candidate_languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  language_name text not null,
  proficiency_level text
);

create table if not exists jobs.candidate_certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  certification_name text not null,
  issuer text,
  issue_date date,
  expiry_date date,
  credential_url text
);

create table if not exists jobs.job_listing_details (
  listing_id uuid primary key references listing.listing_core(id) on delete cascade,
  job_title text not null,
  employment_type text not null,
  work_mode text not null,
  salary_min numeric(12,2),
  salary_max numeric(12,2),
  salary_currency text,
  salary_period text,
  experience_level text,
  industry text,
  department text,
  education_level text,
  visa_support text,
  application_mode text not null default 'internal',
  application_email text,
  application_url text,
  openings_count integer,
  urgent_hiring boolean not null default false,
  valid_through timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs.job_requirements (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  requirement_type text not null,
  value_text text not null,
  sort_order integer not null default 0
);

create table if not exists jobs.job_applications (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  candidate_user_id uuid not null references core.users(id) on delete cascade,
  candidate_cv_file_id uuid references jobs.candidate_cv_files(id),
  application_status text not null default 'submitted',
  source text,
  applied_at timestamptz not null default now(),
  recruiter_notes text,
  cover_note text,
  last_updated_at timestamptz not null default now(),
  unique (listing_id, candidate_user_id)
);

create table if not exists jobs.job_saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  listing_id uuid not null references listing.listing_core(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create table if not exists jobs.job_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  keywords text,
  emirates_json jsonb not null default '[]'::jsonb,
  categories_json jsonb not null default '[]'::jsonb,
  salary_min numeric(12,2),
  work_modes_json jsonb not null default '[]'::jsonb,
  frequency text not null default 'weekly',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs.employer_profiles (
  company_id uuid primary key references company.companies(id) on delete cascade,
  hiring_email text,
  hiring_phone text,
  public_careers_url text,
  verification_status text not null default 'pending',
  hiring_status text not null default 'open',
  response_time_score integer,
  profile_strength_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table jobs.candidate_profiles enable row level security;
alter table jobs.candidate_cv_files enable row level security;
alter table jobs.candidate_experience enable row level security;
alter table jobs.candidate_education enable row level security;
alter table jobs.candidate_skills enable row level security;
alter table jobs.candidate_languages enable row level security;
alter table jobs.candidate_certifications enable row level security;
alter table jobs.job_listing_details enable row level security;
alter table jobs.job_requirements enable row level security;
alter table jobs.job_applications enable row level security;
alter table jobs.job_saved_items enable row level security;
alter table jobs.job_alerts enable row level security;
alter table jobs.employer_profiles enable row level security;

create policy candidate_profiles_self_all on jobs.candidate_profiles
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_cv_self_all on jobs.candidate_cv_files
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_experience_self_all on jobs.candidate_experience
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_education_self_all on jobs.candidate_education
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_skills_self_all on jobs.candidate_skills
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_languages_self_all on jobs.candidate_languages
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy candidate_certifications_self_all on jobs.candidate_certifications
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy job_listing_details_owner_or_company_access on jobs.job_listing_details
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
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
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy job_requirements_owner_or_company_access on jobs.job_requirements
for all to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and (
        lc.owner_user_id = core.current_user_id()
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
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
        or (lc.owner_company_id is not null and company.is_company_member(lc.owner_company_id))
      )
  )
);

create policy job_saved_items_self_all on jobs.job_saved_items
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy job_alerts_self_all on jobs.job_alerts
for all to authenticated
using (user_id = core.current_user_id())
with check (user_id = core.current_user_id());

create policy job_applications_candidate_select on jobs.job_applications
for select to authenticated
using (
  candidate_user_id = core.current_user_id()
  or exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and lc.owner_company_id is not null
      and company.is_company_member(lc.owner_company_id)
  )
);

create policy job_applications_candidate_insert on jobs.job_applications
for insert to authenticated
with check (candidate_user_id = core.current_user_id());

create policy job_applications_company_update on jobs.job_applications
for update to authenticated
using (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and lc.owner_company_id is not null
      and company.is_company_member(lc.owner_company_id)
  )
)
with check (
  exists (
    select 1
    from listing.listing_core lc
    where lc.id = listing_id
      and lc.owner_company_id is not null
      and company.is_company_member(lc.owner_company_id)
  )
);

create policy employer_profiles_company_access on jobs.employer_profiles
for all to authenticated
using (company.is_company_member(company_id))
with check (company.is_company_member(company_id));

create or replace view public.jobs_search_public_v1 as
select
  lc.id,
  lc.slug,
  lc.title,
  lc.emirate,
  lc.area,
  lc.location_text,
  lc.published_at,
  jd.job_title,
  jd.employment_type,
  jd.work_mode,
  jd.salary_min,
  jd.salary_max,
  jd.salary_currency,
  jd.salary_period,
  jd.experience_level,
  jd.industry,
  jd.department,
  jd.urgent_hiring,
  jd.valid_through,
  c.display_name as company_name,
  c.slug as company_slug,
  c.logo_url as company_logo_url,
  ep.verification_status as employer_verification_status
from listing.listing_core lc
join jobs.job_listing_details jd on jd.listing_id = lc.id
left join company.companies c on c.id = lc.owner_company_id and c.public_profile_enabled = true
left join jobs.employer_profiles ep on ep.company_id = c.id
where lc.section = 'jobs'
  and lc.publication_state = 'published'
  and lc.visibility_state = 'public';

create or replace view public.jobs_detail_public_v1 as
select
  lc.id,
  lc.slug,
  lc.title,
  lc.description,
  lc.emirate,
  lc.area,
  lc.location_text,
  lc.published_at,
  lc.expires_at,
  jd.job_title,
  jd.employment_type,
  jd.work_mode,
  jd.salary_min,
  jd.salary_max,
  jd.salary_currency,
  jd.salary_period,
  jd.experience_level,
  jd.industry,
  jd.department,
  jd.education_level,
  jd.visa_support,
  jd.application_mode,
  jd.application_email,
  jd.application_url,
  jd.openings_count,
  jd.urgent_hiring,
  jd.valid_through,
  c.display_name as company_name,
  c.slug as company_slug,
  c.description as company_description,
  c.logo_url as company_logo_url,
  ep.verification_status as employer_verification_status,
  ep.hiring_status,
  (
    select jsonb_agg(
      jsonb_build_object(
        'requirementType', jr.requirement_type,
        'valueText', jr.value_text,
        'sortOrder', jr.sort_order
      )
      order by jr.sort_order asc, jr.id asc
    )
    from jobs.job_requirements jr
    where jr.listing_id = lc.id
  ) as requirements
from listing.listing_core lc
join jobs.job_listing_details jd on jd.listing_id = lc.id
left join company.companies c on c.id = lc.owner_company_id and c.public_profile_enabled = true
left join jobs.employer_profiles ep on ep.company_id = c.id
where lc.section = 'jobs'
  and lc.publication_state = 'published'
  and lc.visibility_state = 'public';

grant select on public.jobs_search_public_v1 to anon, authenticated;
grant select on public.jobs_detail_public_v1 to anon, authenticated;
