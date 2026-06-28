-- GulfHabibi Update Tables - Run in Supabase SQL Editor
-- Step 1: Add vehicle columns
alter table listings add column if not exists vehicle_brand text;
alter table listings add column if not exists vehicle_model text;
alter table listings add column if not exists vehicle_year integer;
alter table listings add column if not exists vehicle_km integer;
alter table listings add column if not exists vehicle_condition text;
alter table listings add column if not exists vehicle_fuel text;
alter table listings add column if not exists vehicle_transmission text;
alter table listings add column if not exists vehicle_body text;
alter table listings add column if not exists vehicle_color text;
