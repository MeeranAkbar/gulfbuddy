# GulfHabibi Project Status

Primary handoff file:

- `D:\Project Try\GulfBuddy Platform\CODEX_HANDOFF.md`

Any future Codex session should read that file first.

Last updated: 2026-04-01

## Current Build Position

The project now has:

- `legacy staging layer`
  - static HTML/CSS/JS
  - still powers `https://natuaralcureguide.com`
- `new local platform`
  - Next.js + TypeScript + Supabase monorepo
  - strong public, workspace, and admin surface
  - staging Supabase schema applied and verified
  - not deployed yet because current host has no Node.js runtime

## Current Priority

Current priority is:

- `LOCAL FULL PRODUCT COMPLETION`

Do not focus on hosting first.

The product should feel visually approved and locally believable before deployment planning resumes.

## Current Execution Model

Work in feature blocks, not random edits:

1. visual approval of key public pages
2. property full local runtime proof
3. ad slot + mock campaign system
4. search completion across sections
5. company/workspace runtime completion
6. jobs runtime
7. services runtime
8. classifieds/directory completion
9. admin completion/refinement
10. local polish pass

## Verified State

Verified successfully:

- `npm.cmd run typecheck`
- `npm.cmd run verify:staging`
- `npm.cmd run smoke:local`
- `npm.cmd run build` in `D:\Project Try\GulfBuddy Platform\apps\web`

Notes:

- root `turbo` build is currently slower/heavier than needed for quick confirmation
- the web app production build itself is passing cleanly

## Staging Supabase

Status:

- applied
- seeded
- verified

Result:

- `21/21` staging checks passing

## Hosting Reality

Current hosting/cPanel terminal check confirmed:

- `node -v` -> `command not found`

Meaning:

- current hosting is not a valid runtime target for the new Next.js app yet
- do not try to deploy the new standalone app there until Node-capable hosting exists

## Visual Approval Block

### Completed

- homepage redesigned as the visual anchor for the rest of the portal
- homepage tightened to feel more visitor-first and less internal
- homepage hero wording moved toward `Find anything in the UAE / all in one place`
- homepage now uses real photography in the hero and featured cards
- duplicate header / duplicate search issue fixed
- blank recent-search item bug fixed in shared search
- homepage hero search rebuilt as its own dedicated component
- homepage search now opens inside one attached controlled dropdown panel
- web dev startup now clears stale `.next` output first to reduce refresh chunk issues
- Property browse page tightened and made more search-led
- Motors browse page tightened and made more buyer-led
- Jobs browse page tightened and made more candidate/employer-led
- Services browse page tightened and made more provider/quote-led
- provider profile page wording and presentation improved
- shared section hero copy improved

### Added

New first-class public detail routes for visual approval:

- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\property\listing\[listingSlug]\page.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\motors\[listingSlug]\page.tsx`

Shared browse cards now link into those detail pages:

- `D:\Project Try\GulfBuddy Platform\apps\web\components\property\property-discovery.tsx`
- `D:\Project Try\GulfBuddy Platform\apps\web\components\motors\motors-discovery.tsx`

### Homepage design anchor

The homepage is now a dedicated composition, not a reused generic section layout.

Updated file:

- `D:\Project Try\GulfBuddy Platform\apps\web\app\(public)\page.tsx`

Homepage now includes:

- stronger hero
- one dominant global search
- one header only
- dedicated homepage search interaction model
- cleaner section-entry composition
- premium banner/ad mock area
- more visual featured content strip
- fewer repetitive explanatory boxes
- less internal platform wording

### Still to tighten

- property emirate/project pages still contain some planning-style copy
- jobs local/emirate/detail routes still contain some `should feel` language
- directory/business/operator pages still need the same live-product copy pass
- some corporate/support pages can still be shortened further

## Runtime Flow Status

### Strongest local flow currently

- auth/session backbone
- company onboarding
- branch creation
- invite flow
- property draft creation
- property evidence attachment
- submit for review
- admin compliance review
- admin risk visibility foundation

### Still pending for full local runtime proof

- clearer internal company approval step before platform review
- final publish-approved property path verification in local runtime
- deeper jobs runtime
- deeper services runtime
- classifieds/directory posting completion
- ad slot and mock campaign runtime
- package/entitlement mock runtime polish

## Search Status

Built:

- global search gateway
- Property search route and filters
- search routing shell

Still pending:

- Motors search model
- Jobs search model
- Services search model
- Directory search model
- Classifieds search model
- autocomplete/suggestions
- saved search structure

## Admin / Workspace Status

Built at believable UI level:

- command center
- compliance
- risk
- companies
- packages
- campaigns
- jobs ops
- services ops
- workspace role dashboards

Still pending:

- ad slot manager runtime
- complaints/exception page
- deeper real-data actions across jobs/services/admin

## Recommended Next Step

Continue the local completion plan in this order:

1. continue homepage refinement until visual approval
2. finish visual approval pass for the remaining key public detail pages
3. complete property full local runtime proof including company flow clarity
4. build ad slot + mock campaign system with layout-safe fallbacks
5. continue section-specific search completion

## Reminder

When continuing in a new Codex session:

1. read `D:\Project Try\GulfBuddy Platform\CODEX_HANDOFF.md`
2. read `D:\Project Try\GulfBuddy Platform\CODEX_PRIVATE_ACCESS.md` only if access details are needed
3. continue from the current local full-product-completion path
