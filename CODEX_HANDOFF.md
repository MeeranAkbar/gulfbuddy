# GulfHabibi Codex Handoff

Last updated: 2026-04-01
Maintained for: cross-session continuation, low-context recovery, and new Codex account handoff

## Mandatory Continuation Protocol

Any future Codex session working in this project must:

1. read this file first
2. read `D:\Project Try\GulfBuddy Platform\CODEX_PRIVATE_ACCESS.md` only if private access or deployment context is needed
3. continue from the latest active block unless the user explicitly changes direction
4. update this file and `D:\Project Try\GulfBuddy Platform\docs\operations\project-status.md` after meaningful progress when the user asks to keep logs current
5. clearly label work as:
   - local only
   - staging Supabase verified
   - legacy site still live

Do not assume the user will restate the project.

## Project Identity

- Product: GulfHabibi
- Type: UAE trust-first multi-vertical marketplace
- Working folder: `D:\Project Try\GulfBuddy Platform`
- Production target domain: `gulfhabibi.com`
- Current legacy staging domain: `natuaralcureguide.com`

## Current Strategic Direction

Current priority is:

- `LOCAL FULL PRODUCT COMPLETION`

Do not center hosting/deployment right now.

The product should feel visually approved and locally believable before launch planning resumes.

## Real System State

There are still two layers:

### 1. Legacy staging layer

- static HTML/CSS/JS
- still serves `https://natuaralcureguide.com`
- useful only as live legacy preview/reference

### 2. New local platform

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase-backed schema
- shared packages for types, validation, SEO, analytics, config, UI

This new platform is now:

- strong locally
- connected to staging Supabase
- visually much more complete
- not deployed because current host has no Node runtime

## Active Execution Model

Work in feature blocks, not random edits.

Current block order:

1. visual approval of key public pages
2. property full local runtime proof
3. ad slot system + mock campaign system
4. search completion across sections
5. company/workspace runtime completion
6. jobs runtime
7. services runtime
8. classifieds/directory completion
9. admin completion/refinement
10. local polish pass

## What Is Built

### Shared platform foundation

- monorepo scaffold
- public/workspace/admin route shells
- shared premium component system
- theme system with light/dark/system
- route map and section architecture

### Shared backend foundation

Migration chain currently includes:

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

### Strongest connected flows already present

- sign up / login shell
- auth/session backbone
- company onboarding
- branch creation
- invite creation and invite acceptance
- company member assignment
- property draft creation
- property compliance evidence attachment
- submit for review
- admin compliance review
- risk foundation and trust profile rollups

### Public/search foundations built

- global search shell
- Property section search route and filters
- premium public modules for:
  - homepage
  - Property
  - Motors
  - Jobs
  - Services
  - Directory
  - Classifieds
  - agencies / dealers / developers / businesses / areas

### Workspace/admin foundations built

- premium workspace shell
- premium admin shell
- command center
- compliance
- risk
- companies
- packages
- campaigns
- jobs ops
- services ops

## What Changed In The Latest Slice

Latest block worked on: `public visual approval`

### Completed now

- homepage redesigned as the visual design anchor for the portal
- homepage hero wording shifted toward broader UAE marketplace positioning
- homepage now uses real photography for the hero and featured content cards
- homepage duplicate header / duplicate search issue fixed
- homepage recent-search blank item bug fixed
- homepage hero search rebuilt as a dedicated component instead of reusing the generic global search shell
- homepage search open state is now one attached panel instead of multiple competing stacked layers
- homepage dev startup now clears stale `.next` output first to reduce missing-chunk refresh issues
- homepage copy and positioning tightened to feel more visitor-first
- Property browse page tightened to feel more search-first and less speculative
- Motors browse page tightened to feel more buyer-first and less internal
- Jobs browse page tightened to feel more candidate/employer-first
- Services browse page tightened to feel more quote/provider-first
- provider profile page tightened to feel like a real public brand object
- shared section hero default aside now reads more like a live portal and less like architecture notes

### New routes added

The visual-approval set was missing direct public detail routes for two major sections.

Added:

- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\property\listing\[listingSlug]\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\motors\[listingSlug]\page.tsx`

### Browse cards now link to detail pages

Updated:

- `D:\Project Try\GulfBuddy Platform\apps\web\components\property\property-discovery.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\components\motors\motors-discovery.tsx`

### Homepage direction changed materially

Homepage is no longer using the generic `SectionPage` composition.

It is now a dedicated marketplace front page in:

- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\page.tsx`

The homepage now acts as the visual reference for the rest of the portal with:

- stronger poster-like hero
- one dominant search surface
- one header only
- less text-heavy explanatory framing
- hero wording closer to `Find anything in the UAE / all in one place`
- real photos instead of placeholder blocks in key visual cards
- stronger marketplace section-entry cards
- a premium banner/ad mock zone
- more visual featured content

### Search cleanup completed

Updated:

- `D:\Project Try\GulfBuddy Platform\apps\web\components\search\global-search.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\components\search\homepage-hero-search.tsx`

What changed:

- empty searches no longer get saved into local recent-search history
- blank `Recent search` ghost entries are filtered out automatically
- the homepage now uses its own dedicated search interaction model
- section tabs, keyword, location, and the search button live inside one controlled shell
- recent/popular suggestions render in one attached dropdown panel under the hero search
- the shared `GlobalSearch` is no longer responsible for homepage hero UX

### Dev stability hardening completed

Updated:

- `D:\Project Try\GulfBuddy Platform\apps\web\package.json`
- `D:\Project Try\GulfBuddy Platform\scripts\clean-web-next.mjs`

What changed:

- `predev` now clears `apps/web/.next` before local web dev starts
- this is intended to reduce stale chunk/missing module refresh failures caused by switching between `next build` and `next dev`

### Public shell cleanup completed

Updated:

- `D:\Project Try\GulfBuddy Platform\apps\web\app\layout.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\layout.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\components\app-shell.tsx`

What changed:

- removed accidental double shell wrapping
- public pages now show one header only
- homepage now keeps only the hero master search instead of a duplicated header search

## Current Verification State

Verified successfully on 2026-04-01:

- `npm.cmd run typecheck` at repo root
- `npm.cmd run verify:staging` already green from prior staging apply
- `npm.cmd run build` in `D:\Project Try\GulfBuddy Platform\apps\web`

Important note:

- the repo-root `turbo` build is currently slower/heavier than needed for quick verification
- the web app production build itself is passing cleanly and is the relevant confirmation for current UI/runtime work

## Staging Supabase State

Staging Supabase is already fixed and verified.

Project:

- `https://chfkssclmdshdcijfzdr.supabase.co`

Status:

- migrations applied
- seed applied
- verification passing

Known verified views/schemas include:

- `core`
- `company`
- `listing`
- `property`
- `jobs`
- `services`
- `monetization`
- `risk`
- `compliance`
- `ops`
- `property_search_public_v1`
- `property_detail_public_v1`
- `motors_search_public_v1`
- `jobs_search_public_v1`
- `jobs_detail_public_v1`
- `services_search_public_v1`
- `service_provider_public_v1`

## Hosting Reality

Important:

- current hosting/cPanel terminal check showed `node -v` -> `command not found`

That means:

- current host is not a valid runtime target for the new Next.js app
- do not try to deploy the new standalone app there yet
- current host still only serves the legacy static layer effectively

This is not the current blocker because deployment is not the active focus, but it remains true.

## Current Main Gaps

### Public visual completion

Still needs refinement on:

- property emirate pages
- property project pages
- jobs local/detail pages with lingering planning-style phrasing
- directory/business/operator pages
- some corporate pages still slightly too wordy

### Property full local runtime proof

Still needs:

- clearer company internal approval step before platform review
- full local proof of publish-approved property state
- stronger founder-operating-model visibility through admin exceptions and review pages

### Ad slots / mock campaigns

Not built to required local-complete standard yet.

Need:

- hero top banner slot
- sidebar banner slot
- inline banner slot
- sponsored strip
- admin slot controls
- mock campaign creation and slot assignment
- natural layout reflow when ads are off

### Search completion

Built:

- global search shell
- Property search route

Still pending:

- Motors search
- Jobs search
- Services search
- Directory search
- Classifieds search
- autocomplete/suggestion system
- saved search structure

### Jobs/services deeper runtime

Still pending:

- candidate CV/profile flow depth
- employer post-job/applicant management depth
- provider onboarding/offerings/areas/request handling depth

## Recommended Next Step

Continue exactly in this order:

1. keep refining homepage until the user explicitly approves it visually
2. then finish the visual approval pass for the remaining high-value public pages
3. complete property full local runtime proof including company flow clarity
4. build ad slot + mock campaign system with layout-safe fallback behavior
5. continue section-specific search completion

## Most Important Files To Open First

### Logs

- `D:\Project Try\GulfBuddy Platform\CODEX_HANDOFF.md`
- `D:\Project Try\GulfBuddy Platform\docs\operations\project-status.md`

### Private continuity

- `D:\Project Try\GulfBuddy Platform\CODEX_PRIVATE_ACCESS.md`

### Current public visual approval set

- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\property\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\property\listing\[listingSlug]\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\motors\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\motors\[listingSlug]\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\jobs\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\services\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\services\provider\[providerSlug]\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\components\section-page.tsx`

### Runtime/search

- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\property\search\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\components\search\global-search.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\components\property\property-discovery.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\components\motors\motors-discovery.tsx`

## Security Reminder

Before final production hardening, rotate:

- Supabase PAT
- Supabase service role key if needed
- hosting credentials if needed
- any later AI/worker secrets
