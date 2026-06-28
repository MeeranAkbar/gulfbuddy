# Property Publishing Lane

## Why this exists

Property is the first regulated GulfHabibi vertical, so it should be the first place where
the shared backbone feels real:

- company onboarding
- branch ownership
- role-aware publishing
- publication state vs compliance state
- permit-aware moderation
- public-safe read models

## Workspace shape

The first production workspace route is:

- `/listings/property/new`

That route should eventually host a multi-step composer with:

1. seller / advertiser lane
2. listing details
3. location and building
4. pricing and contact
5. media upload
6. compliance references
7. submit for review

## Data model additions

The first property-specific workflow migration adds:

- `property.property_company_links`
- `property.property_projects`
- `public.property_detail_public_v1`
- `public.property_projects_public_v1`

This allows public listing detail pages and future project pages to evolve separately
from the broad search read model.

## Product principle

Do not mix these flows blindly:

- Dubai long-term
- Abu Dhabi property
- off-plan / new projects
- holiday homes / short-term rentals

They can share a composer shell, but should keep separate compliance and moderation rules.
