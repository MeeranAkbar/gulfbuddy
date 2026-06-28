-- Add call_count to listings and jobs tables
alter table listings add column if not exists call_count integer default 0;
alter table jobs add column if not exists call_count integer default 0;
