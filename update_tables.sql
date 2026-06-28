-- Add vehicle and property columns to listings table
-- Run this in Supabase SQL Editor

alter table listings add column if not exists vehicle_brand text;
alter table listings add column if not exists vehicle_model text;
alter table listings add column if not exists vehicle_year integer;
alter table listings add column if not exists vehicle_km integer;
alter table listings add column if not exists vehicle_condition text;
alter table listings add column if not exists vehicle_fuel text;
alter table listings add column if not exists vehicle_transmission text;
alter table listings add column if not exists vehicle_body text;
alter table listings add column if not exists vehicle_color text;
alter table listings add column if not exists property_purpose text;
alter table listings add column if not exists property_type text;
alter table listings add column if not exists property_beds text;
alter table listings add column if not exists property_baths text;
alter table listings add column if not exists property_size integer;
alter table listings add column if not exists property_building text;
alter table listings add column if not exists property_furnish text;
alter table listings add column if not exists property_amenities text[];

-- Jobs table (if not already created)
create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  user_name text, user_email text,
  title text not null, company text not null,
  category text not null, description text, requirements text,
  job_type text default 'fulltime', experience text,
  salary_min decimal, salary_max decimal,
  nationality text, gender text default 'any', openings integer default 1,
  area text, emirate text default 'Dubai',
  contact_phone text, contact_email text, contact_whatsapp text,
  is_featured boolean default false, featured_until timestamp,
  status text default 'active', views integer default 0,
  created_at timestamp default now(), updated_at timestamp default now()
);

alter table jobs enable row level security;
create policy if not exists "Public can view jobs" on jobs for select using (status = 'active');
create policy if not exists "Auth users post jobs" on jobs for insert with check (auth.uid() = user_id);
create policy if not exists "Auth users update jobs" on jobs for update using (auth.uid() = user_id);
create policy if not exists "Auth users delete jobs" on jobs for delete using (auth.uid() = user_id);
