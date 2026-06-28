# GulfHabibi Platform Foundation

This document describes the first implementation layer added to the current static GulfHabibi codebase.

## Why this scaffold exists

The existing root site is a static HTML/CSS/JS build already powering the preview domain. Replacing it in one jump would create unnecessary risk. The new monorepo foundation sits beside that static site so the platform can migrate section by section.

## What is included

- `apps/web`: future production Next.js application
- `apps/worker`: secure worker/proxy skeleton
- `packages/types`: shared domain enums and record types
- `packages/validation`: Zod schemas for backend-safe validation
- `packages/config`: domain and feature flag config
- `packages/seo`: canonical/title/description helpers
- `packages/analytics`: shared event payload helpers
- `packages/ui`: minimal shared UI primitives
- `supabase/migrations`: baseline shared schema and RLS structure
- `docs/*`: architecture, schema, RLS, operations, compliance, and SEO notes

## Immediate migration strategy

1. Stabilize shared data model first.
2. Rebuild Property on the new data model before large-scale UI rewrites.
3. Move Motors onto the same entitlement, lead, and company systems.
4. Reuse the same backbone for Jobs, Services, Directory, and Classifieds.
