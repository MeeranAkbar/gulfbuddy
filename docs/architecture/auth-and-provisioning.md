# Auth and User Provisioning

## Goal

Supabase Auth should not stop at `auth.users`.

Every authenticated GulfHabibi user must be mirrored into:

- `core.users`
- `core.profiles`

This is what allows the rest of the platform to work:

- company membership
- listing ownership
- admin membership
- lead routing
- audit logs

## Current implementation

Migration `20260324_0007_auth_user_provisioning.sql` adds a trigger on `auth.users`
that:

1. creates or updates `core.users`
2. creates a starter `core.profiles` row
3. uses `full_name` from auth metadata when available
4. backfills existing auth users

## Frontend flow

The auth UI now supports:

- email/password sign in
- email/password sign up
- callback exchange for email confirmation / magic-link style redirects

## Important note

The app allows placeholder public Supabase values in non-production builds so the scaffold
can compile safely. Real sign-in and registration should only be expected once the real
public Supabase env values are configured.
