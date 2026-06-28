-- GulfHabibi Platform Database Setup
-- Run this in Supabase SQL Editor

-- MARKETPLACE LISTINGS TABLE
create table listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  user_name text,
  user_email text,
  title text not null,
  description text,
  price decimal,
  price_type text default 'fixed', -- fixed, negotiable, free
  category text not null,
  subcategory text,
  area text,
  emirate text default 'Dubai',
  images text[], -- array of image URLs
  contact_phone text,
  contact_whatsapp text,
  status text default 'active', -- active, sold, deleted
  is_featured boolean default false,
  featured_until timestamp,
  views integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- DIRECTORY LISTINGS TABLE
create table directory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  business_name text not null,
  category text not null,
  subcategory text,
  description text,
  area text,
  emirate text default 'Dubai',
  phone text,
  whatsapp text,
  email text,
  website text,
  images text[],
  working_hours text,
  tier text default 'free', -- free, featured, premium
  featured_until timestamp,
  rating decimal default 0,
  review_count integer default 0,
  status text default 'active',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- REVIEWS TABLE
create table reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  user_name text,
  listing_id uuid references directory(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table listings enable row level security;
alter table directory enable row level security;
alter table reviews enable row level security;

-- POLICIES FOR LISTINGS
create policy "Anyone can view active listings"
  on listings for select using (status = 'active');

create policy "Users can insert their own listings"
  on listings for insert with check (auth.uid() = user_id);

create policy "Users can update their own listings"
  on listings for update using (auth.uid() = user_id);

create policy "Users can delete their own listings"
  on listings for delete using (auth.uid() = user_id);

-- POLICIES FOR DIRECTORY
create policy "Anyone can view active directory"
  on directory for select using (status = 'active');

create policy "Users can insert their own business"
  on directory for insert with check (auth.uid() = user_id);

create policy "Users can update their own business"
  on directory for update using (auth.uid() = user_id);

-- POLICIES FOR REVIEWS
create policy "Anyone can view reviews"
  on reviews for select using (true);

create policy "Logged in users can add reviews"
  on reviews for insert with check (auth.uid() = user_id);

-- STORAGE BUCKET FOR IMAGES
insert into storage.buckets (id, name, public) values ('listings-images', 'listings-images', true);
insert into storage.buckets (id, name, public) values ('directory-images', 'directory-images', true);

-- STORAGE POLICIES
create policy "Anyone can view images"
  on storage.objects for select using (bucket_id in ('listings-images', 'directory-images'));

create policy "Logged in users can upload images"
  on storage.objects for insert with check (auth.role() = 'authenticated');
