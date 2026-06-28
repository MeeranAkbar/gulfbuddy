create or replace function core.sync_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, core
as $$
declare
  derived_display_name text;
begin
  derived_display_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    split_part(coalesce(new.email, ''), '@', 1),
    'GulfHabibi User'
  );

  insert into core.users (auth_user_id, email, phone, status)
  values (new.id, new.email, new.phone, 'active')
  on conflict (auth_user_id) do update
  set
    email = excluded.email,
    phone = excluded.phone,
    status = 'active',
    updated_at = now();

  insert into core.profiles (user_id, display_name, preferred_language)
  select cu.id, derived_display_name, 'en'
  from core.users cu
  where cu.auth_user_id = new.id
  on conflict (user_id) do update
  set
    display_name = coalesce(nullif(core.profiles.display_name, ''), excluded.display_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update on auth.users
for each row
execute function core.sync_auth_user();

insert into core.users (auth_user_id, email, phone, status)
select au.id, au.email, au.phone, 'active'
from auth.users au
on conflict (auth_user_id) do update
set
  email = excluded.email,
  phone = excluded.phone,
  status = 'active',
  updated_at = now();

insert into core.profiles (user_id, display_name, preferred_language)
select
  cu.id,
  coalesce(
    au.raw_user_meta_data ->> 'full_name',
    split_part(coalesce(au.email, ''), '@', 1),
    'GulfHabibi User'
  ),
  'en'
from auth.users au
join core.users cu on cu.auth_user_id = au.id
on conflict (user_id) do nothing;
