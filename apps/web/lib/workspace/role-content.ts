import type { WorkspaceActionLink, WorkspaceInfoCard, WorkspaceLaneCard, WorkspaceMetricCard } from '../../components/workspace/workspace-role-sections';

export interface WorkspaceOverviewConfig {
  eyebrow: string;
  title: string;
  description: string;
  actions: WorkspaceActionLink[];
  metrics: WorkspaceMetricCard[];
  lanes: WorkspaceLaneCard[];
  signals: string[];
}

export interface WorkspaceSubpageConfig {
  eyebrow: string;
  title: string;
  description: string;
  actions: WorkspaceActionLink[];
  metrics: WorkspaceMetricCard[];
  focusCards: WorkspaceInfoCard[];
  sideTitle: string;
  sideDescription: string;
  sideSignals: string[];
}

export const candidateOverview: WorkspaceOverviewConfig = {
  eyebrow: 'Candidate workspace',
  title: 'Candidate tools should feel like a premium career workspace, not a thin account panel.',
  description:
    'The candidate side should make profile quality, saved roles, applications, and job alerts feel structured enough to support repeat job-search behavior rather than one-off browsing.',
  actions: [
    { href: '/candidate/profile', label: 'Open profile' },
    { href: '/jobs', label: 'Explore jobs', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Profile goal', value: 'High trust candidate identity', hint: 'A strong candidate profile should support both applications and future employer discovery.' },
    { label: 'Apply lane', value: 'Structured and repeatable', hint: 'Applications should feel easy to track and less chaotic than ordinary job-board flows.' },
    { label: 'Growth loop', value: 'Saved roles + alerts', hint: 'The workspace should encourage repeat visits instead of one-session use.' }
  ],
  lanes: [
    { title: 'Profile strength', detail: 'Build the public and employer-facing posture of the candidate profile, including role focus, experience, and visibility settings.', href: '/candidate/profile', hrefLabel: 'Open profile lane' },
    { title: 'CV and applications', detail: 'Track CV assets, applied jobs, and submission history inside one calmer operating lane.', href: '/candidate/cv', hrefLabel: 'Open CV lane' },
    { title: 'Saved jobs and alerts', detail: 'Keep discovery momentum alive through saved jobs and alert subscriptions that feel worth returning to.', href: '/candidate/saved-jobs', hrefLabel: 'Open saved jobs' }
  ],
  signals: [
    'Candidates should understand what strengthens their profile immediately.',
    'Saved jobs and alerts should feel like real product loops, not afterthoughts.',
    'The whole workspace should feel calmer and more premium than a generic job board account.'
  ]
};

export const candidateProfileConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Candidate profile',
  title: 'Profile setup should guide the candidate toward a stronger hiring posture.',
  description: 'This page should eventually manage headline, experience, salary posture, location preference, visibility, and profile completeness in one guided premium flow.',
  actions: [
    { href: '/candidate/cv', label: 'Manage CV' },
    { href: '/candidate', label: 'Back to candidate hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Profile focus', value: 'Hiring readiness', hint: 'The profile should present skills and intent clearly enough for both direct applications and future employer search.' },
    { label: 'Trust goal', value: 'Clear identity', hint: 'Candidates should understand what fields improve trust and completeness.' },
    { label: 'Next action', value: 'Complete core fields', hint: 'The product should lead users into the most meaningful setup tasks first.' }
  ],
  focusCards: [
    { title: 'Core identity and role focus', detail: 'Headline, desired role, location, visa status, and summary should be grouped in a way that feels deliberate and easy to finish.' },
    { title: 'Experience and skills', detail: 'Experience depth, languages, and skills should feel structured and hiring-friendly instead of form-heavy or generic.' },
    { title: 'Visibility and searchability', detail: 'Candidate privacy and employer search settings should be obvious and confidence-building.' }
  ],
  sideTitle: 'The candidate profile is the trust anchor of the whole Jobs journey.',
  sideDescription: 'When this page is strong, the user feels more confident applying and the employer side gets better quality signals too.',
  sideSignals: ['Keep the setup progressive, not overwhelming.', 'Show profile strength clearly.', 'Make visibility choices easy to understand.']
};

export const candidateCvConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Candidate CV',
  title: 'CV management should feel clean, secure, and application-ready.',
  description: 'This lane should eventually handle uploads, parsed CV content, file selection for applications, and future profile autofill logic.',
  actions: [
    { href: '/candidate/applied-jobs', label: 'Applied jobs' },
    { href: '/candidate', label: 'Back to candidate hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Asset role', value: 'Primary application document', hint: 'A candidate should always know which CV is active and what recruiters are likely to see.' },
    { label: 'Parsing lane', value: 'Future autofill support', hint: 'Parsed CV content should later help build profile strength faster.' },
    { label: 'Confidence goal', value: 'Low-friction apply flow', hint: 'The CV step should never become a blocker when a candidate is ready to apply.' }
  ],
  focusCards: [
    { title: 'Upload and manage versions', detail: 'Candidates should be able to keep one primary CV and later maintain role-specific variants without confusion.' },
    { title: 'Use in applications', detail: 'The user should see where the selected CV is being used and switch it with minimal friction.' },
    { title: 'Parsing and profile connection', detail: 'Later, this lane should support CV parsing that helps prefill profile and application data.' }
  ],
  sideTitle: 'CV management is a trust and convenience layer, not just file storage.',
  sideDescription: 'Handled well, this page makes applications feel much smoother and reduces candidate drop-off at the point of intent.',
  sideSignals: ['Keep the upload state obvious.', 'Show primary vs alternate CVs clearly.', 'Never make the user guess what employers will see.']
};

export const candidateAppliedJobsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Applied jobs',
  title: 'Application history should feel like a premium pipeline, not a dead list.',
  description: 'Candidates should eventually be able to track where they applied, what stage each application is in, and which opportunities still need attention.',
  actions: [
    { href: '/candidate/job-alerts', label: 'Job alerts' },
    { href: '/candidate', label: 'Back to candidate hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Pipeline visibility', hint: 'Candidates should know instantly which roles are active, stale, or moving.' },
    { label: 'Status goal', value: 'Clear next step', hint: 'The page should help users decide whether to wait, follow up later, or keep searching.' },
    { label: 'Retention loop', value: 'Return-friendly', hint: 'A good application lane brings candidates back even after they leave the public jobs pages.' }
  ],
  focusCards: [
    { title: 'Status timeline', detail: 'Applications should move through clear human-readable statuses such as submitted, reviewed, shortlisted, or rejected.' },
    { title: 'Role context', detail: 'The candidate should always see the company, role, and apply date without opening multiple pages.' },
    { title: 'Opportunity follow-through', detail: 'This lane can later support reminders, saved notes, and better follow-up logic without becoming cluttered.' }
  ],
  sideTitle: 'Application tracking is one of the strongest repeat-use reasons in Jobs.',
  sideDescription: 'When this page is useful, candidates come back because the product helps them manage uncertainty, not just find openings.',
  sideSignals: ['Keep status language human and calm.', 'Make the employer and role obvious.', 'Support return visits and progress checking.']
};

export const candidateSavedJobsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Saved jobs',
  title: 'Saved roles should feel like a thoughtful shortlist, not a forgotten bookmark dump.',
  description: 'This page should support comparison, revisit behavior, and smart reminders so candidates can move from passive interest to action.',
  actions: [
    { href: '/candidate/job-alerts', label: 'Open alerts' },
    { href: '/jobs', label: 'Explore jobs', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Shortlist memory', hint: 'Candidates should be able to keep track of promising jobs without losing context.' },
    { label: 'Decision support', value: 'Compare and revisit', hint: 'Saved jobs should help users decide what to apply for next, not just store links.' },
    { label: 'Retention loop', value: 'Return path', hint: 'This lane should encourage the user to come back with intent.' }
  ],
  focusCards: [
    { title: 'Shortlist structure', detail: 'Saved jobs should be easy to scan by role, employer, and freshness rather than becoming one long repetitive list.' },
    { title: 'Comparison readiness', detail: 'The product should later help candidates compare work mode, salary posture, and employer trust across saved roles.' },
    { title: 'Action prompts', detail: 'This page can gently encourage apply, archive, or alert actions without feeling pushy.' }
  ],
  sideTitle: 'Saved jobs are one of the lightest but most powerful habit loops in Jobs.',
  sideDescription: 'A premium saved-jobs experience keeps the candidate connected to the platform between public browsing sessions.',
  sideSignals: ['Keep cards scannable.', 'Preserve role and employer context.', 'Support compare-and-decide behavior.']
};

export const candidateAlertsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Job alerts',
  title: 'Alerts should feel curated and useful, not like noisy notification settings.',
  description: 'This page should eventually help candidates subscribe to meaningful job patterns by keyword, category, emirate, and work mode without overwhelming them.',
  actions: [
    { href: '/candidate/saved-jobs', label: 'Saved jobs' },
    { href: '/candidate', label: 'Back to candidate hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Repeat discovery', hint: 'Alerts should bring candidates back when relevant roles appear, not spam them.' },
    { label: 'Control goal', value: 'Fine-tuned intent', hint: 'Candidates should be able to choose frequency and scope without friction.' },
    { label: 'Growth loop', value: 'Search retention', hint: 'A good alert system extends the value of the search experience over time.' }
  ],
  focusCards: [
    { title: 'Keyword and category alerts', detail: 'Users should be able to create clear role-based alert streams with very little setup time.' },
    { title: 'Location and work-mode fit', detail: 'Emirate and work-mode filters should align alerts to real candidate intent rather than broad irrelevant traffic.' },
    { title: 'Frequency and quality', detail: 'The experience should prioritize relevance and cadence control over maximum notification volume.' }
  ],
  sideTitle: 'Alerts are where jobs discovery becomes a long-term product relationship.',
  sideDescription: 'Handled well, this page gives Jobs a durable repeat-use engine without making the product feel noisy or growth-hacky.',
  sideSignals: ['Make scope and frequency obvious.', 'Optimize for relevance over volume.', 'Keep the setup calm and quick.']
};

export const customerOverview: WorkspaceOverviewConfig = {
  eyebrow: 'Customer workspace',
  title: 'The customer side should help users manage service demand, quotes, and bookings with the same premium clarity as the public marketplace.',
  description:
    'This workspace should eventually tie service requests, quotes, and orders into one calm customer-facing operating surface that feels more trustworthy than casual service directories.',
  actions: [
    { href: '/customer/requests', label: 'My requests' },
    { href: '/services', label: 'Explore services', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary goal', value: 'Request to order clarity', hint: 'Customers should understand what stage each service need is in without confusion.' },
    { label: 'Trust value', value: 'Provider comparison', hint: 'The workspace should make it easier to compare quotes and choose providers confidently.' },
    { label: 'Repeat loop', value: 'Rebook and review later', hint: 'This lane can become a repeat-use services relationship rather than a one-time form.' }
  ],
  lanes: [
    { title: 'Service requests', detail: 'Track all open service needs, request scope, and provider matching activity in one place.', href: '/customer/requests', hrefLabel: 'Open requests' },
    { title: 'Quotes', detail: 'Compare provider responses, pricing posture, and response quality without jumping between messages and pages.', href: '/customer/quotes', hrefLabel: 'Open quotes' },
    { title: 'Orders and bookings', detail: 'Keep confirmed jobs, schedules, and completed services visible in a premium booking lane.', href: '/customer/orders', hrefLabel: 'Open orders' }
  ],
  signals: [
    'Customers should always know what stage their request is in.',
    'Quotes should be easy to compare without chaos.',
    'The overall experience should feel safer than random service boards.'
  ]
};

export const customerRequestsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Customer requests',
  title: 'Service requests should feel like structured demand objects, not abandoned form submissions.',
  description: 'This page should eventually help customers understand what they requested, who was matched, and what still needs action.',
  actions: [
    { href: '/services/request', label: 'New request' },
    { href: '/customer', label: 'Back to customer hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Request visibility', hint: 'Each customer request should remain understandable after submission, not disappear into the background.' },
    { label: 'Trust goal', value: 'Provider matching clarity', hint: 'The customer should see whether real providers are engaging the request.' },
    { label: 'Conversion path', value: 'Request to quote', hint: 'This lane is the bridge between service need and concrete provider action.' }
  ],
  focusCards: [
    { title: 'Request status and detail', detail: 'Users should see category, area, timing, and request status clearly enough to understand progress on every service need.' },
    { title: 'Provider match visibility', detail: 'The page should later show whether providers were matched, how quickly they responded, and what came next.' },
    { title: 'Escalation and support', detail: 'This lane can later become the home for issue reporting or request edits if something goes wrong.' }
  ],
  sideTitle: 'A request should remain a useful object after submission, not disappear into a black box.',
  sideDescription: 'That confidence is essential if the Services module is going to feel like a real marketplace instead of a lead-gen form.',
  sideSignals: ['Make progress visible.', 'Preserve original request detail.', 'Keep the next step obvious.']
};

export const customerQuotesConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Customer quotes',
  title: 'Quotes should feel comparable, transparent, and easy to act on.',
  description: 'This page should eventually help customers compare pricing posture, provider quality, scope, and validity without losing confidence.',
  actions: [
    { href: '/customer/orders', label: 'Orders' },
    { href: '/customer', label: 'Back to customer hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Compare providers', hint: 'Quote comparison is where Services can feel far more useful than a simple contact directory.' },
    { label: 'Decision goal', value: 'Accept with confidence', hint: 'Customers should understand what they are accepting before an order is created.' },
    { label: 'Commercial fit', value: 'Commission-ready flow', hint: 'A strong quote lane supports the long-term services marketplace model directly.' }
  ],
  focusCards: [
    { title: 'Quote structure', detail: 'Provider, price, duration, service scope, and validity should be easy to compare at a glance.' },
    { title: 'Trust and response cues', detail: 'The page should later surface provider verification, response speed, and cancellation or review signals.' },
    { title: 'Quote acceptance flow', detail: 'This lane should eventually hand off cleanly into order creation or booking confirmation.' }
  ],
  sideTitle: 'Quote comparison is where the Services product becomes truly useful.',
  sideDescription: 'If this page feels strong, customers have a reason to stay inside the marketplace rather than drifting to offline coordination too early.',
  sideSignals: ['Keep quote details comparable.', 'Make provider trust legible.', 'Make accept vs decline feel simple and safe.']
};

export const customerOrdersConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Customer orders',
  title: 'Orders should feel like a clear booking history, not an afterthought.',
  description: 'This page should eventually track confirmed jobs, scheduling, completion, and issues in one calm premium flow for customers.',
  actions: [
    { href: '/customer/quotes', label: 'Quotes' },
    { href: '/customer', label: 'Back to customer hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Booking clarity', hint: 'A customer should know which jobs are scheduled, active, completed, or disputed.' },
    { label: 'Trust goal', value: 'Service continuity', hint: 'Order detail should reduce the uncertainty around fulfillment and next steps.' },
    { label: 'Future loop', value: 'Repeat service behavior', hint: 'This page can later become a repeat-booking and review hub.' }
  ],
  focusCards: [
    { title: 'Order state and timeline', detail: 'Customers should see booking state, schedule, and completion posture without reading long support-style text.' },
    { title: 'Provider accountability', detail: 'The page should later support clearer assignment, arrival, completion, and issue handling signals.' },
    { title: 'Review and repeat path', detail: 'Completed jobs can later feed into ratings, saved providers, and repeat-booking prompts.' }
  ],
  sideTitle: 'Order clarity is where the Services module proves it is more than lead generation.',
  sideDescription: 'A strong customer order lane creates confidence that the platform can support real service delivery, not just provider contact.',
  sideSignals: ['Keep state transitions visible.', 'Reduce ambiguity around schedules.', 'Support repeat-use behavior later.']
};

export const employerOverview: WorkspaceOverviewConfig = {
  eyebrow: 'Employer workspace',
  title: 'Employer tools should feel like a premium hiring workspace, not a generic company account.',
  description:
    'The employer side should help businesses manage profile credibility, roles, applicants, and team structure in one hiring-focused command surface.',
  actions: [
    { href: '/employer/jobs', label: 'Open jobs' },
    { href: '/jobs', label: 'Public jobs', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary goal', value: 'Trust-first hiring operations', hint: 'Employer identity and job quality should remain visible inside the workspace too.' },
    { label: 'Core objects', value: 'Roles, applicants, team', hint: 'The workspace should connect job posting, candidate flow, and recruiter activity in one product loop.' },
    { label: 'Growth fit', value: 'Branding + recruiter seats', hint: 'This lane should support both free entry and premium hiring upgrades later.' }
  ],
  lanes: [
    { title: 'Jobs and publishing', detail: 'Create, review, and manage role inventory with stronger structure than ordinary job-board posting tools.', href: '/employer/jobs', hrefLabel: 'Open jobs lane' },
    { title: 'Applicants', detail: 'Track candidate flow, shortlist status, and review activity in one calmer hiring surface.', href: '/employer/applicants', hrefLabel: 'Open applicants' },
    { title: 'Employer brand and team', detail: 'Keep the public company page, hiring identity, and recruiter seat model aligned.', href: '/employer/profile', hrefLabel: 'Open employer profile' }
  ],
  signals: [
    'Employer tools should feel operationally serious from the first screen.',
    'The public company page and private hiring tools should feel connected.',
    'Hiring workflows should support team growth without becoming enterprise clutter.'
  ]
};

export const employerJobsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Employer jobs',
  title: 'Job management should feel like a structured publishing lane, not a pile of forms.',
  description: 'This page should eventually show drafts, active jobs, paused roles, and publishing quality in one calm premium workflow.',
  actions: [
    { href: '/admin/jobs', label: 'Jobs ops' },
    { href: '/employer', label: 'Back to employer hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Role inventory control', hint: 'Employers should understand which jobs are live, in review, or expired immediately.' },
    { label: 'Trust goal', value: 'Cleaner employer publishing', hint: 'The product should help employers post roles that feel more credible and better structured.' },
    { label: 'Commercial fit', value: 'Featured role ready', hint: 'This lane should later support boosts and branded employer upgrades naturally.' }
  ],
  focusCards: [
    { title: 'Draft and live role management', detail: 'The employer should be able to understand what is published, what is pending, and what needs revision without digging through tables.' },
    { title: 'Role quality guidance', detail: 'The page can later surface AI cleanup suggestions, missing fields, and policy alignment in a calmer way.' },
    { title: 'Hiring momentum', detail: 'This lane should connect job posture to applicant volume and employer performance without needing a separate analytics tool.' }
  ],
  sideTitle: 'Role publishing is where the employer experience proves its professionalism.',
  sideDescription: 'A premium jobs lane should help employers look credible to candidates and to admin operations at the same time.',
  sideSignals: ['Make live vs draft status obvious.', 'Keep job quality visible.', 'Connect roles to applicant outcomes.']
};

export const employerApplicantsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Employer applicants',
  title: 'Applicant review should feel decisive and clean, not like a spreadsheet dump.',
  description: 'This page should eventually support candidate review, shortlisting, recruiter assignment, and status changes in a premium hiring flow.',
  actions: [
    { href: '/employer/team', label: 'Hiring team' },
    { href: '/employer', label: 'Back to employer hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Candidate flow control', hint: 'Employers should know which applicants need review and which are moving.' },
    { label: 'Team fit', value: 'Recruiter assignment', hint: 'Applicant handling should later connect to role-based employer team seats.' },
    { label: 'Hiring goal', value: 'Confident shortlist', hint: 'The best applicant lane helps employers make decisions faster without chaos.' }
  ],
  focusCards: [
    { title: 'Review and shortlist movement', detail: 'Applicants should move through clear states such as submitted, in review, shortlisted, interviewing, or rejected.' },
    { title: 'Candidate context', detail: 'The employer should be able to see role, CV, and fit signals without jumping through scattered screens.' },
    { title: 'Recruiter collaboration', detail: 'This page should later support notes, ownership, and team collaboration without becoming visually dense.' }
  ],
  sideTitle: 'Applicant handling is the heart of whether the Jobs product feels real or superficial.',
  sideDescription: 'A strong applicant lane helps employers trust the platform with their day-to-day hiring work.',
  sideSignals: ['Keep applicant state visible.', 'Support quick triage.', 'Make team collaboration clean and calm.']
};

export const employerProfileConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Employer profile',
  title: 'The employer profile should align the public brand page with the private hiring workspace.',
  description: 'This page should eventually control company description, office presence, hiring contacts, verification posture, and public employer branding.',
  actions: [
    { href: '/jobs/company/aurora-commercial-group', label: 'View public employer page' },
    { href: '/employer', label: 'Back to employer hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Public trust object', hint: 'Candidates should feel the public company page and private workspace are part of the same product.' },
    { label: 'Brand goal', value: 'Premium hiring identity', hint: 'The page should help employers look serious without becoming marketing-heavy.' },
    { label: 'Verification fit', value: 'Trust-first posting', hint: 'Employer credibility should support cleaner publishing and better candidate confidence.' }
  ],
  focusCards: [
    { title: 'Public company narrative', detail: 'The employer should be able to shape the public profile in a way that supports hiring trust and clearer brand identity.' },
    { title: 'Hiring contact and posture', detail: 'Contact details, response expectations, and verification should feel controlled and easy to understand.' },
    { title: 'Profile quality guidance', detail: 'The page can later help the employer understand what profile improvements unlock stronger visibility or trust.' }
  ],
  sideTitle: 'Employer branding should strengthen trust, not drift into generic marketing UI.',
  sideDescription: 'This lane is where the business identity becomes a real hiring asset inside the product.',
  sideSignals: ['Keep the public/private relationship obvious.', 'Make verification legible.', 'Support stronger candidate confidence.']
};

export const employerTeamConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Employer team',
  title: 'Team management should feel like a real hiring workspace capability, not an account afterthought.',
  description: 'This page should eventually support recruiter seats, hiring-manager roles, invitations, permissions, and ownership of applicant review.',
  actions: [
    { href: '/company/members', label: 'Company seats' },
    { href: '/employer', label: 'Back to employer hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Hiring seat model', hint: 'Employers should be able to see how team access maps to hiring responsibilities.' },
    { label: 'Governance goal', value: 'Clear permissions', hint: 'The workspace should make role boundaries understandable without enterprise complexity.' },
    { label: 'Scale fit', value: 'Recruiter growth ready', hint: 'This lane should support both small employers and larger recruiter teams later.' }
  ],
  focusCards: [
    { title: 'Seat invitations and role design', detail: 'Employers should be able to understand who can post jobs, review applicants, and manage branding or billing.' },
    { title: 'Branch and team context', detail: 'Later, this lane can help map recruiters to specific business units, teams, or office footprints.' },
    { title: 'Ownership and accountability', detail: 'The product should make it obvious which users are responsible for candidate flow and hiring activity.' }
  ],
  sideTitle: 'Team structure is what turns the employer side into a real workspace.',
  sideDescription: 'Handled well, this page supports growth without forcing employers into a cold enterprise admin template.',
  sideSignals: ['Make roles readable.', 'Keep invites simple.', 'Show who owns what.']
};

export const providerOverview: WorkspaceOverviewConfig = {
  eyebrow: 'Provider workspace',
  title: 'Provider tools should feel like a premium local operations desk, not a basic directory account.',
  description:
    'The provider side should help operators manage public profile quality, service requests, quotes, orders, team activity, and future commission flow in one calm workspace.',
  actions: [
    { href: '/provider/requests', label: 'Open requests' },
    { href: '/services', label: 'Public services', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary goal', value: 'Request to order control', hint: 'Providers should understand demand, quotes, and live work without leaving the workspace.' },
    { label: 'Trust value', value: 'Profile quality + response', hint: 'Public provider credibility should connect directly to the private ops side.' },
    { label: 'Commercial fit', value: 'Commission and premium ready', hint: 'This lane should support the future marketplace model without forcing it too early.' }
  ],
  lanes: [
    { title: 'Provider profile and services', detail: 'Manage the public brand object, offerings, service areas, and premium positioning.', href: '/provider/profile', hrefLabel: 'Open provider profile' },
    { title: 'Requests and orders', detail: 'Track demand, quote movement, bookings, and active service delivery from one command surface.', href: '/provider/requests', hrefLabel: 'Open requests lane' },
    { title: 'Reports and finance', detail: 'See conversion posture, live work, commission movement, and later payouts or invoices.', href: '/provider/reports', hrefLabel: 'Open reports' }
  ],
  signals: [
    'Providers should always know where new demand is coming from.',
    'Profile quality and operations should feel connected.',
    'The workspace should support both solo providers and branch-based companies later.'
  ]
};

export const providerProfileConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Provider profile',
  title: 'The provider profile should connect public trust, service setup, and business identity.',
  description: 'This page should eventually manage headline, bio, offerings, coverage, verification posture, and premium profile depth in one cohesive product lane.',
  actions: [
    { href: '/services/provider/elite-home-response', label: 'Public provider page' },
    { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Public trust object', hint: 'The provider profile is one of the main conversion surfaces in Services.' },
    { label: 'Brand goal', value: 'Premium local identity', hint: 'The public page should feel better than a simple directory listing or contact card.' },
    { label: 'Commercial fit', value: 'Featured profile ready', hint: 'This lane should later support premium boosts and verification-led trust upgrades.' }
  ],
  focusCards: [
    { title: 'Profile narrative and trust posture', detail: 'The provider should be able to shape a clean public story with verification, response expectations, and category fit.' },
    { title: 'Coverage and availability', detail: 'Service areas, emergency capability, and intake posture should be easy to update and understand.' },
    { title: 'Profile quality guidance', detail: 'The product can later highlight what profile improvements make the operator more likely to win requests.' }
  ],
  sideTitle: 'The provider profile is the public brand object at the center of Services.',
  sideDescription: 'If this lane feels strong, both SEO and conversion quality get better at the same time.',
  sideSignals: ['Make public trust easy to manage.', 'Keep service scope visible.', 'Guide providers toward stronger profile quality.']
};

export const providerRequestsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Provider requests',
  title: 'Request management should feel like a calm demand queue, not a messy inbox.',
  description: 'This page should eventually help providers triage new requests, understand match quality, and respond with quotes or booking actions quickly.',
  actions: [
    { href: '/provider/orders', label: 'Orders' },
    { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Demand triage', hint: 'Providers should know which requests are new, matched, accepted, or stale.' },
    { label: 'Speed goal', value: 'Fast quote response', hint: 'This lane is where response-time quality will later be earned.' },
    { label: 'Conversion fit', value: 'Request to quote', hint: 'Handled well, this page becomes one of the biggest revenue drivers in Services.' }
  ],
  focusCards: [
    { title: 'Request detail and urgency', detail: 'The provider should be able to see category, area, timing, and budget posture fast enough to decide whether to engage.' },
    { title: 'Match quality', detail: 'This lane can later surface why the provider was matched and how well the request fits its service areas or offerings.' },
    { title: 'Action readiness', detail: 'The transition from request to quote or booking should feel fast and highly intentional.' }
  ],
  sideTitle: 'The request queue is where provider responsiveness becomes a real product feature.',
  sideDescription: 'A strong request lane makes the whole Services module feel more trustworthy and more operationally serious.',
  sideSignals: ['Keep request context visible.', 'Prioritize response speed.', 'Make action steps obvious.']
};

export const providerOrdersConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Provider orders',
  title: 'Orders should feel like a service-delivery console, not a passive history table.',
  description: 'This page should eventually support scheduled work, in-progress service delivery, completion, cancellation, and dispute visibility.',
  actions: [
    { href: '/provider/reports', label: 'Reports' },
    { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Delivery posture', hint: 'Providers should understand which service jobs are active, scheduled, or completed at a glance.' },
    { label: 'Trust goal', value: 'Operational accountability', hint: 'This lane is where the marketplace proves it can support real service delivery.' },
    { label: 'Commercial fit', value: 'Commission-linked fulfillment', hint: 'Later this page can connect directly to commission and payout flows.' }
  ],
  focusCards: [
    { title: 'Schedule and state management', detail: 'Orders should move through visible states such as confirmed, scheduled, in progress, completed, or disputed.' },
    { title: 'Assigned staff and accountability', detail: 'This lane can later connect orders to specific provider users or branch teams.' },
    { title: 'Customer and issue context', detail: 'The provider should be able to understand the customer request and any open issues without switching tools.' }
  ],
  sideTitle: 'Order clarity is what separates a real marketplace from a lead-only service board.',
  sideDescription: 'If providers can operate confidently here, the whole Services section becomes much stronger commercially.',
  sideSignals: ['Keep state transitions obvious.', 'Show assignment clearly.', 'Support issue handling later.']
};

export const providerServicesConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Provider services',
  title: 'Service offering management should feel like a premium catalog lane, not a flat form.',
  description: 'This page should eventually help providers shape offerings, pricing models, package structure, and service scope cleanly.',
  actions: [
    { href: '/provider/profile', label: 'Provider profile' },
    { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Offer catalog quality', hint: 'Offerings should be clear enough for customers and structured enough for request matching.' },
    { label: 'Commercial fit', value: 'Quote and booking ready', hint: 'The service catalog should support both lead-driven and fixed-price models later.' },
    { label: 'SEO value', value: 'Public offering depth', hint: 'Good service setup can later strengthen provider pages and category routes.' }
  ],
  focusCards: [
    { title: 'Offerings and pricing model', detail: 'Providers should be able to explain whether services are quote-based, fixed-price, emergency, or package-led.' },
    { title: 'Duration and scope', detail: 'This lane can later standardize service expectations and reduce bad-fit leads before they arrive.' },
    { title: 'Category and discovery fit', detail: 'Offerings should be structured in a way that supports matching, public discovery, and premium placement later.' }
  ],
  sideTitle: 'The service catalog is one of the most important inputs into both discovery and conversion.',
  sideDescription: 'Handled well, this page improves lead quality and makes public provider profiles much stronger.',
  sideSignals: ['Keep pricing models understandable.', 'Support service clarity.', 'Structure offerings for matching and discovery.']
};

export const providerTeamConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Provider team',
  title: 'Provider team management should scale from solo operator to branch-based company without losing clarity.',
  description: 'This page should eventually support staff roles, assignments, branch coverage, and service-delivery accountability.',
  actions: [
    { href: '/company/members', label: 'Company seats' },
    { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Operational seat model', hint: 'Providers should know who handles requests, quotes, jobs, and profile updates.' },
    { label: 'Scale fit', value: 'Solo to multi-branch', hint: 'The product should support both single providers and growing local service teams.' },
    { label: 'Governance goal', value: 'Clear ownership', hint: 'This lane should later make assignment and accountability easy to understand.' }
  ],
  focusCards: [
    { title: 'Team roles and permissions', detail: 'The provider should later be able to separate owners, admins, staff, and viewers in a way that maps to real operations.' },
    { title: 'Assignment and delivery ownership', detail: 'This page can later connect specific team members to requests, quotes, and service orders.' },
    { title: 'Branch and coverage structure', detail: 'For larger providers, the product should be able to map users to service areas or branch coverage logically.' }
  ],
  sideTitle: 'Team management is what makes the provider lane truly scalable.',
  sideDescription: 'A strong seat and assignment model turns Services from a solo-provider tool into a real business product.',
  sideSignals: ['Make roles readable.', 'Tie people to work clearly.', 'Support branch growth later.']
};

export const providerFinanceConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Provider finance',
  title: 'Finance should feel like a clean commercial lane, not an accounting dump.',
  description: 'This page should eventually surface commission ledger posture, billed orders, payout status, and future invoices or PSP-linked flows.',
  actions: [
    { href: '/provider/reports', label: 'Reports' },
    { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Commission visibility', hint: 'Providers should understand how marketplace fees relate to completed work.' },
    { label: 'Commercial goal', value: 'Trustworthy payout posture', hint: 'A clear finance lane supports long-term marketplace confidence.' },
    { label: 'Future fit', value: 'PSP-ready flow', hint: 'This page can later connect to online payment and payout logic without rethinking the workspace.' }
  ],
  focusCards: [
    { title: 'Commission ledger clarity', detail: 'Providers should later see how charges, percentages, and completed service value connect clearly.' },
    { title: 'Billing and payout posture', detail: 'This lane can later show what is billed, what is pending, and what will be paid out or settled.' },
    { title: 'Commercial transparency', detail: 'A clean finance surface reduces friction when the marketplace evolves beyond lead-only models.' }
  ],
  sideTitle: 'Finance clarity builds long-term provider trust in the Services marketplace.',
  sideDescription: 'Even before full online payments, this page should feel like the future commercial lane of the product.',
  sideSignals: ['Keep fee logic understandable.', 'Show pending vs completed clearly.', 'Design for future PSP integration.']
};

export const providerReportsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Provider reports',
  title: 'Reports should feel like actionable service performance insight, not decorative charts.',
  description: 'This page should eventually show leads, quote conversion, order completion, response speed, area performance, and service demand quality.',
  actions: [
    { href: '/provider/finance', label: 'Finance' },
    { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Lead-to-order insight', hint: 'Providers should understand where demand is coming from and what converts best.' },
    { label: 'Optimization goal', value: 'Area and category quality', hint: 'Reporting should help providers improve profile, quote behavior, and service mix.' },
    { label: 'Commercial fit', value: 'Premium upsell ready', hint: 'This lane later supports premium provider packages and stronger account value.' }
  ],
  focusCards: [
    { title: 'Demand quality and conversion', detail: 'Providers should later see requests, quotes, accepted jobs, and completion trends in one reporting flow.' },
    { title: 'Area and category performance', detail: 'This page can later highlight which areas and categories produce the most useful demand.' },
    { title: 'Response and trust posture', detail: 'Reporting should eventually connect response speed, cancellations, disputes, and ratings into one quality picture.' }
  ],
  sideTitle: 'Reports should help providers improve decisions, not just admire metrics.',
  sideDescription: 'A premium reporting lane creates real business value and strengthens the case for premium plans later.',
  sideSignals: ['Optimize for useful insight.', 'Tie reports to action.', 'Keep the presentation calm and business-grade.']
};

export const leadsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Lead workspace',
  title: 'Leads should become a shared operating lane across monetized sections, not a generic contact list.',
  description: 'This workspace should eventually unify inquiry events, call clicks, WhatsApp actions, assignments, and CRM-ready lead posture across the platform.',
  actions: [
    { href: '/admin/leads', label: 'Admin lead ops' },
    { href: '/dashboard', label: 'Workspace overview', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Shared lead visibility', hint: 'The platform should eventually let each business understand demand across listings, campaigns, and profiles.' },
    { label: 'CRM goal', value: 'Structured event model', hint: 'Lead posture should stay connected to the backend event stream and future sync jobs.' },
    { label: 'Commercial fit', value: 'Monetization linkage', hint: 'Leads should later connect clearly to campaigns, packages, and premium surfaces.' }
  ],
  focusCards: [
    { title: 'Lead feed and assignment', detail: 'This lane should later support a shared event stream with company, user, and source context for operational follow-up.' },
    { title: 'Channel visibility', detail: 'Calls, WhatsApp clicks, inquiry submits, campaign clicks, and company profile actions should all remain understandable here.' },
    { title: 'CRM readiness', detail: 'The design should anticipate syncing to external CRM systems without turning the workspace into an enterprise maze.' }
  ],
  sideTitle: 'Leads are one of the most valuable shared objects in the whole platform.',
  sideDescription: 'Handled well, this lane becomes the bridge between public demand, company operations, and monetization performance.',
  sideSignals: ['Keep source and owner visible.', 'Preserve section context.', 'Design for future CRM sync.']
};

export const settingsConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Workspace settings',
  title: 'Settings should feel intentional and premium, not like a leftover admin page.',
  description: 'This page should eventually manage account, preferences, theme, notification posture, and future language or privacy settings in one calm surface.',
  actions: [
    { href: '/verification', label: 'Verification' },
    { href: '/dashboard', label: 'Workspace overview', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Preference control', hint: 'Users should understand what they can customize without hunting through unrelated sections.' },
    { label: 'Experience goal', value: 'Theme + communication clarity', hint: 'The product should make personal preferences feel polished and reliable.' },
    { label: 'Trust fit', value: 'Privacy and notification posture', hint: 'Settings should later support confidence around account visibility and alerts.' }
  ],
  focusCards: [
    { title: 'Theme and personal preferences', detail: 'Users should later control light, dark, and system mode, along with other experience-level preferences, from one calm screen.' },
    { title: 'Notification posture', detail: 'Alerts and system communication should be manageable without making settings feel bloated or technical.' },
    { title: 'Privacy and account control', detail: 'This lane can later support account security, privacy preferences, and visibility settings across sections.' }
  ],
  sideTitle: 'Settings should support confidence, not friction.',
  sideDescription: 'Even basic settings pages affect whether the product feels premium and carefully designed.',
  sideSignals: ['Keep categories obvious.', 'Make theme and communication settings easy to find.', 'Avoid generic clutter.']
};

export const teamConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Team workspace',
  title: 'Team tools should feel like a shared seat and responsibility layer, not a duplicate of company management.',
  description: 'This page should eventually help users understand the teams they belong to, their role scope, and how company seats connect to workspace access.',
  actions: [
    { href: '/company/members', label: 'Company members' },
    { href: '/dashboard', label: 'Workspace overview', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Seat clarity', hint: 'Users should understand what team or company context they are operating inside.' },
    { label: 'Governance goal', value: 'Role transparency', hint: 'This page should later explain permissions and collaboration posture more clearly.' },
    { label: 'Scale fit', value: 'Cross-section access', hint: 'The product may later support users operating across listings, leads, and campaigns from one seat model.' }
  ],
  focusCards: [
    { title: 'Membership and role context', detail: 'Users should later be able to see which companies, branches, or teams they belong to and what those memberships allow.' },
    { title: 'Ownership and responsibilities', detail: 'This lane can later make it easier to understand which tasks or inventories belong to the current user versus other teammates.' },
    { title: 'Collaboration posture', detail: 'The workspace should support teamwork without requiring users to interpret complex enterprise permission systems.' }
  ],
  sideTitle: 'Team clarity is what makes shared workspaces feel reliable at scale.',
  sideDescription: 'Handled well, this lane reduces confusion around who can do what across the platform.',
  sideSignals: ['Make membership visible.', 'Keep permissions human-readable.', 'Support collaboration without clutter.']
};

export const verificationConfig: WorkspaceSubpageConfig = {
  eyebrow: 'Verification workspace',
  title: 'Verification should feel like a trust-building product lane, not just document upload friction.',
  description: 'This page should eventually help users and companies understand what is verified, what is pending, and what stronger trust unlocks across the platform.',
  actions: [
    { href: '/company/onboarding', label: 'Company onboarding' },
    { href: '/dashboard', label: 'Workspace overview', tone: 'secondary' }
  ],
  metrics: [
    { label: 'Primary value', value: 'Trust visibility', hint: 'Users should understand exactly what is verified and what is still pending.' },
    { label: 'Platform goal', value: 'Safer publishing and posting', hint: 'Verification is one of the core differentiators of a trust-first marketplace.' },
    { label: 'Commercial fit', value: 'Premium trust posture', hint: 'Stronger verification can later connect to better visibility and reputation cues.' }
  ],
  focusCards: [
    { title: 'Identity and company verification', detail: 'The product should later explain user verification, company verification, and section-specific trust requirements clearly.' },
    { title: 'Document posture and status', detail: 'This lane can later show which items are approved, under review, or missing without making users guess.' },
    { title: 'Why verification matters', detail: 'The page should communicate how stronger trust affects posting, public badges, and user confidence across sections.' }
  ],
  sideTitle: 'Verification is not just compliance work. It is part of the product promise.',
  sideDescription: 'If this page feels thoughtful, the whole portal feels more serious and more worth trusting.',
  sideSignals: ['Show status clearly.', 'Explain benefits, not just requirements.', 'Reduce uncertainty in the trust flow.']
};
