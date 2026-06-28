# Company Onboarding And Property Drafts

## What This Slice Adds

The platform now has the first real shared workspace workflows on top of the Next.js foundation:

- company onboarding through a controlled RPC
- property draft creation through a controlled RPC
- workspace forms for both flows
- company and branch lookups for the signed-in user's workspace

This is the first point where the new app stops being route scaffolding and starts behaving like a marketplace operating system.

## Company Onboarding

The onboarding path lives at:

- `/company/onboarding`

It creates one shared company record that later powers:

- listings
- branches
- company roles
- permissions
- campaigns
- package ownership
- lead reporting
- compliance workflows

The backend entry point is:

- `public.create_company_with_owner(payload jsonb)`

The function is `security definer` and handles:

- company row creation
- owner seat creation
- optional first branch creation
- audit log creation

The frontend action validates input with the shared Zod schema before calling the RPC.

## Property Draft Creation

The first Property workspace lane lives at:

- `/listings/property/new`

It creates a regulated property draft tied to:

- owner user
- owner company
- optional branch
- property details
- compliance details
- company relationship link
- public contact layer
- audit log

The backend entry point is:

- `public.create_property_draft(payload jsonb)`

The function creates:

- `listing.listing_core`
- `property.property_listing_details`
- `property.property_compliance`
- `property.property_company_links`
- optional `listing.listing_contacts`
- `ops.audit_logs`

## Why RPCs Were Used

These workflows need transactional creation across multiple schemas and tables.

They also need to stay safe with RLS enabled.

Instead of pushing multi-table logic into the browser, the app now uses backend RPCs with rule checks so the platform can:

- keep secrets out of the client
- keep audit logs complete
- centralize permission enforcement
- create consistent data in one transaction

## Current Guardrails

Company onboarding:

- requires authenticated user
- creates the first owner seat automatically
- keeps company creation traceable through audit logs

Property drafts:

- require authenticated user
- require a company
- require listing creation permission for that company
- infer regulator region from emirate
- infer permit lane from emirate and market mode
- keep publication state as `draft`
- keep compliance state separate from publication state

## What Comes Next

The next layer should be:

1. apply the new migrations to a safe Supabase staging project
2. connect the forms to a real staged database
3. build submit-for-review flow for property drafts
4. build compliance queue and moderation queue handling
5. add document uploads and permit evidence handling
6. extend the same shared patterns to Motors, Jobs, and Services
