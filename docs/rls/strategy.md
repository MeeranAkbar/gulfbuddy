# RLS Strategy

## Principles

1. Every browser-exposed table runs with RLS enabled.
2. Public pages read from curated views, not unrestricted base tables.
3. Company data is scoped by membership and explicit permissions.
4. Admin paths use backend-only service credentials or approved server functions.
5. Private compliance documents never sit in public buckets.

## Initial policy groups

- Public approved listings: read-only through public views
- Owners: own records
- Company members: company-scoped access
- Moderators/admins: backend-only

## Avoid

- service-role usage in browser code
- wide-open `public` insert/update/delete policies
- leaking moderation/compliance notes to public views
