create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  user_name text,
  user_email text,
  title text not null,
  company text not null,
  category text not null,
  description text,
  requirements text,
  job_type text default 'fulltime',
  experience text,
  salary_min decimal,
  salary_max decimal,
  nationality text,
  gender text default 'any',
  openings integer default 1,
  area text,
  emirate text default 'Dubai',
  contact_phone text,
  contact_email text,
  contact_whatsapp text,
  is_featured boolean default false,
  featured_until timestamp,
  status text default 'active',
  views integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table jobs enable row level security;

create policy "Public can view jobs" on jobs for select using (status = 'active');
create policy "Auth users post jobs" on jobs for insert with check (auth.uid() = user_id);
create policy "Auth users update jobs" on jobs for update using (auth.uid() = user_id);
create policy "Auth users delete jobs" on jobs for delete using (auth.uid() = user_id);
