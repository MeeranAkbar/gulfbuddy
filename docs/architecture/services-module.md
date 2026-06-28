# Services Module Foundation

Services is being built as a marketplace, not a static directory.

## Core modes

1. Lead / quote marketplace
2. Selective fixed booking marketplace
3. Managed marketplace later

## Public routes

- `/services`
- `/services/:emirate`
- `/services/:emirate/:category`
- `/services/:emirate/:category/:subcategory`
- `/services/provider/:providerSlug`
- `/services/request`
- `/services/order/:publicOrderRef`

## Key data model

- provider profiles
- service offerings
- service areas
- portfolio items
- requests
- provider matches
- quotes
- orders
- order status history
- reviews
- commission ledger
- disputes

## Initial product stance

- free provider onboarding
- request and quote flow first
- no platform escrow in phase 1
- commission tracking ready from the start
- later payment-provider integration can activate in-platform collection

## Trust stance

- provider verification is separate from listing approval
- badges must be rule-backed
- profile quality and response speed should become product signals
