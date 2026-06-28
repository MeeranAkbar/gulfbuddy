# GulfHabibi Staging Manual Apply

This folder exists because the current machine does not have a usable Supabase migration path yet:

- `supabase` CLI is not installed here
- `psql` is not installed here
- the project currently has the Supabase project URL, anon key, and service-role key
- the direct database password / connection string needed for remote migration apply is not recorded locally

Until that access gap is closed, use the SQL editor in the staging Supabase project.

## Apply Order

1. Open the staging SQL editor for project `chfkssclmdshdcijfzdr`
2. Run:
   - [20260325_staging_platform_bootstrap.sql](/D:/Project%20Try/GulfBuddy%20Platform/supabase/manual-apply/20260325_staging_platform_bootstrap.sql)
3. After that succeeds, run:
   - [20260325_staging_seed.sql](/D:/Project%20Try/GulfBuddy%20Platform/supabase/manual-apply/20260325_staging_seed.sql)

## What The Bootstrap Bundle Includes

The bootstrap bundle includes every new-platform migration in order:

- `20260324_0001_core_foundation.sql`
- `20260324_0002_public_views_and_rls.sql`
- `20260324_0003_jobs_module.sql`
- `20260324_0004_services_module.sql`
- `20260324_0005_auth_company_backbone.sql`
- `20260324_0006_property_workflow_and_public_views.sql`
- `20260324_0007_auth_user_provisioning.sql`
- `20260324_0008_company_onboarding_and_property_composer.sql`
- `20260324_0009_branch_ops_and_admin_compliance_access.sql`
- `20260324_0010_property_review_lane.sql`
- `20260324_0011_company_member_assignment.sql`
- `20260324_0012_company_member_invites.sql`
- `20260324_0013_property_compliance_documents.sql`
- `20260324_0014_monetization_operations.sql`
- `20260324_0015_risk_engine_foundation.sql`
- `20260324_0016_trust_profile_rollups.sql`
- `20260324_0017_risk_rule_expansion_jobs_services.sql`
- `20260324_0018_risk_rule_expansion_motors.sql`
- `20260324_0019_risk_rule_expansion_classifieds_directory.sql`

## What The Seed Bundle Includes

The seed bundle currently applies:

- `0001_seed_catalog.sql`

This seeds:

- package catalog
- ad slots

## After SQL Apply

Once staging has the new schema:

1. Create `.env.local` from `.env.example`
2. Set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run the local app:
   - `npm.cmd run dev`
4. Open:
   - `http://localhost:3000`
5. Verify the staging schema from this machine:
   - `npm.cmd run verify:staging`

## Recommended Runtime Smoke Check

After staging schema is applied, verify these flows in order:

1. `Register / login`
2. `Company onboarding`
3. `Branch creation`
4. `Company member invite`
5. `Property draft creation`
6. `Property compliance evidence attach`
7. `Submit property for review`
8. `Admin compliance queue`
9. `Admin risk queue`
10. `Workspace billing / campaigns pages`

## Verification Script

The repo now includes:

- [verify-staging-supabase.mjs](/D:/Project%20Try/GulfBuddy%20Platform/scripts/verify-staging-supabase.mjs)

It checks the new platform's critical schemas and public views using:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

It will pass only when the staging schema is actually present.

## Current Blocker

The new platform is locally stable and builds successfully, but remote staging apply is still blocked until one of these becomes available:

- direct database password / connection string
- installed `supabase` CLI plus linked DB access
- manual SQL editor execution in Supabase
