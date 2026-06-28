# Jobs Module Foundation

Jobs is being built as a two-sided hiring product, not a single employer posting form.

## Public side

- `/jobs`
- `/jobs/:slug`
- `/jobs/:slug/:category`
- `/jobs/company/:companySlug`

The `:slug` route can resolve to either an emirate lane or a single job slug depending on known emirate values.

## Candidate side

- profile
- CV
- applied jobs
- saved jobs
- alerts
- visibility and searchability controls

## Employer side

- company profile
- active jobs
- applicants
- recruiter/team seats
- future employer branding

## Moderation

Jobs should run anti-scam checks from day one:

- fake company suspicion
- fake salary bait
- suspicious external URLs
- data-harvest job detection
- duplicate job detection

## SEO

- only single job pages should emit `JobPosting` structured data
- listing/search pages must not use `JobPosting`
- expired job handling must be controlled centrally
