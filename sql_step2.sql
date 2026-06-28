-- Step 2: Add property columns
alter table listings add column if not exists property_purpose text;
alter table listings add column if not exists property_type text;
alter table listings add column if not exists property_beds text;
alter table listings add column if not exists property_baths text;
alter table listings add column if not exists property_size integer;
alter table listings add column if not exists property_building text;
alter table listings add column if not exists property_furnish text;
alter table listings add column if not exists property_amenities text[];
