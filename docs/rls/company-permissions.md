# Company Permission Model

## Decision

Company access should not default to "any active member can edit everything".

## Approach

1. role templates define baseline permissions
2. `permissions_json` can hold explicit overrides or expansions
3. helper functions compute effective permissions
4. RLS checks use those helper functions

## Core SQL helpers

- `company.default_permissions(role)`
- `company.member_permissions(company_id, user_id)`
- `company.has_permission(company_id, permission, user_id)`
- `ops.is_admin(user_id)`

## Policy effect

- company owners/admins can manage profile and users
- publishers can create and edit listings without broad company control
- analysts can view reports without being able to mutate inventory
- admin roles stay separate from normal company roles
