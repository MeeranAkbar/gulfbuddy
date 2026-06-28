# Auth and Company Backbone

This layer turns the shared platform from a static scaffold into a permission-aware application backbone.

## Core ideas

- Supabase Auth identifies the browser user.
- `core.users` maps auth identities to internal user records.
- `company.company_members` links users to companies with a role and optional custom permission overrides.
- default permissions come from role templates, but `permissions_json` can extend or override them later.
- admin access is tracked separately in `ops.admin_members`.

## Shared permission language

Examples:

- `create_listing`
- `edit_company_listing`
- `submit_for_review`
- `manage_company_users`
- `manage_company_profile`
- `manage_company_inventory`
- `manage_branch`
- `upload_creatives`
- `buy_package`
- `assign_leads`
- `view_company_reports`
- `manage_campaigns`
- `manage_billing`
- `view_compliance_status`

## Why this matters

Every vertical reuses the same concepts:

- agencies
- dealers
- employers
- service providers
- directory businesses

That keeps dashboards, moderation, monetization, and CRM routing consistent.
