# GulfHabibi Strict Auto Detection / Flagging System

Last captured: 2026-03-24
Status: accepted product spec, not implemented yet

## Purpose

Build a strict compliance-aware auto-detection system so risky listings do **not** go live automatically.

Core behavior:

1. validate
2. score risk
3. flag issues
4. block or route to manual review
5. log every decision

## Priority Order

1. Property
2. Jobs
3. Services
4. Motors
5. Classifieds / Marketplace
6. Directory

## Shared Workflow States

### publication_state

- draft
- submitted
- auto_checked
- flagged
- pending_review
- approved
- rejected
- published
- suspended
- expired

### risk_state

- normal
- low
- medium
- high
- blocked

### compliance_state

- not_required
- required_pending
- under_review
- verified
- failed
- expired

## Required Shared Tables

Planned tables to add or align:

### risk_detection_rules

- id
- section
- rule_code
- rule_name
- severity
- score_delta
- action_type
- is_active
- config_json
- created_at
- updated_at

### risk_detection_results

- id
- listing_id
- section
- rule_code
- severity
- score_delta
- action_type
- message
- metadata_json
- created_at

### risk_profiles

- id
- subject_type
- subject_id
- section
- total_score
- risk_state
- last_checked_at
- updated_at

### moderation_queue

- id
- listing_id
- section
- queue_type
- priority
- reason_codes_json
- assigned_to
- status
- created_at
- updated_at

### audit_logs

Already exists in `ops.audit_logs` and should remain the canonical trail for risk and moderation actions.

## Shared Auto Check Engine

Planned shared backend entrypoint:

- `runListingAutoChecks(listingId, section)`

Engine responsibilities:

1. load listing data
2. load section-specific rules
3. run all validations
4. write risk detection results
5. compute total score
6. assign risk state
7. set publication state
8. create moderation queue item if needed
9. write audit log
10. return structured result

Expected return shape:

- listing_id
- section
- total_score
- risk_state
- publication_state
- blocking_reasons[]
- warnings[]
- triggered_rules[]

## Property Rules

Property is the strictest lane.

### Identity checks

- advertiser_type exists
- user_id exists
- company / agency / developer linkage exists where applicable
- broker details exist where required

### Permit checks

- permit number present
- permit format valid
- permit expiry not passed
- permit QR / verification payload present where required
- missing permit = high or blocked risk

### Listing quality checks

- title exists
- description exists
- minimum images present
- property_type exists
- purpose exists
- emirate exists
- area exists
- price exists

### Duplicate checks

- same building + same unit-like title + same price
- same images reused
- same phone + very similar text
- repeated posting across accounts
- duplicate cluster score

### Suspicious price checks

- price far below normal band
- zero / near-zero teaser price
- mismatch between purpose and price style

### Poster trust checks

- verified company or not
- verified broker or not
- first-time poster
- too many pending / rejected listings recently

### Required property actions

- missing permit -> blocked
- expired permit -> blocked
- missing advertiser identity -> pending_review or blocked
- duplicate high confidence -> blocked
- suspicious price -> pending_review
- incomplete listing -> flagged

## Jobs Rules

- employer identity present
- company profile exists
- fake salary bait
- suspicious job title
- spammy repeated jobs
- suspicious external apply link
- payment-demand wording
- duplicate posting across companies / accounts
- too many jobs from unverified employer

Action rules:

- suspicious scam wording -> blocked
- unverified employer + high frequency -> pending_review
- duplicate jobs -> flagged / pending_review

## Services Rules

- provider identity present
- phone / email verified
- business info present for business profiles
- service category exists
- service area exists
- suspicious copied profile text
- repeated provider accounts
- fake pricing bait
- suspicious request spam
- suspicious quote spam later

Action rules:

- missing identity -> pending_review
- repeated fake provider pattern -> blocked
- suspicious copied content -> flagged

## Motors Rules

- seller type present
- dealer / company linkage where required
- make / model / year present
- suspicious mileage / value mismatch
- duplicate car listings
- repeated image reuse
- fake teaser pricing
- too many listings from unverified account

Action rules:

- duplicate listing high confidence -> blocked
- fake teaser price -> pending_review
- incomplete vehicle data -> flagged

## Classifieds Rules

- prohibited / spam wording
- duplicate consumer product posts
- suspicious low pricing
- repeated images
- too many posts from new account
- high-risk categories
- fake brand abuse wording

Action rules:

- prohibited category -> blocked
- high spam score -> blocked
- suspicious repetition -> pending_review

## Directory Rules

- business name exists
- category exists
- location exists
- contact exists
- duplicate business profile
- copied profile text
- suspicious fake branch listings

Action rules:

- duplicate business -> flagged
- missing business identity -> pending_review

## Risk Scoring Model

Initial weighting guidance:

- missing critical permit: +100
- expired permit: +100
- missing required identity: +60
- duplicate high confidence: +80
- suspicious price: +40
- low image count: +10
- unverified business: +20
- repeated rejected listings: +30
- scam phrase match: +100

### Risk thresholds

- 0 to 19 = normal
- 20 to 49 = low
- 50 to 79 = medium
- 80 to 99 = high
- 100+ = blocked

## Publication Action Rules

If total_score < 20:

- publication_state = auto_checked
- may continue to normal review flow

If total_score is 20-49:

- publication_state = flagged
- warning recorded
- optional moderation review

If total_score is 50-79:

- publication_state = pending_review
- mandatory manual moderation

If total_score is 80-99:

- publication_state = flagged
- high priority moderation queue
- cannot publish automatically

If total_score >= 100:

- publication_state = rejected or blocked
- do not publish
- create high priority moderation case

## Moderation Queue Behavior

Queue types:

- property_compliance
- property_duplicate
- jobs_scam_review
- services_provider_review
- motors_duplicate_review
- classifieds_spam_review
- directory_identity_review

Priority values:

- low
- medium
- high
- urgent

Auto-create moderation items when:

- medium / high / blocked risk
- critical rule triggered
- complaint received
- repeated suspicious user behavior

## Trust Profile Updates

Maintain trust profiles for:

- user
- company
- broker
- provider
- dealer

### Positive signals

- verified identity
- verified company
- approved listings history
- low complaint rate
- complete profile
- good response rate later

### Negative signals

- repeated rejections
- duplicate attempts
- fake pricing
- scam wording
- spam frequency
- missing compliance info

## Admin Requirements

Admin panels should show:

- triggered rules
- total risk score
- listing snapshot
- reason codes
- duplicate candidates
- advertiser / company details
- permit status for property
- approve / reject / suspend actions
- audit trail

Admin badges:

- Normal
- Low Risk
- Medium Risk
- High Risk
- Blocked
- Duplicate Suspected
- Permit Missing
- Permit Expired
- Scam Suspected

## Implementation Requirements

Build as reusable backend logic, not page-specific frontend checks.

Recommended folder:

- `apps/web/lib/risk/`
  - `engine.ts`
  - `scoring.ts`
  - `rules/`
    - `property.ts`
    - `jobs.ts`
    - `services.ts`
    - `motors.ts`
    - `classifieds.ts`
    - `directory.ts`
  - `types.ts`
  - `constants.ts`

Implementation principles:

- TypeScript
- clear enums
- section-based rule registry
- unit-testable rule functions
- reusable risk calculator
- modular rule engine
- safe database writes
- audit logging on every action

## Must Not Do

- auto-publish risky property listings
- trust missing permit data
- rely only on frontend validation
- hide audit trail
- use one generic warning for everything
- skip duplicate detection
- skip moderation queue creation

## Phased Build Order

1. shared enums and tables
2. shared risk engine
3. property rules
4. admin review UI for property
5. jobs rules
6. services rules
7. motors rules
8. classifieds rules
9. directory rules
10. trust profile updates
11. analytics / reporting for flagged listings

## Final Goal

No risky listing should go live automatically.

GulfHabibi must behave like a trust-first controlled marketplace, with Property as the strictest moderated lane and all decisions recorded in an auditable backend trail.
