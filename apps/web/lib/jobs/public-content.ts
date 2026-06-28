export interface JobsMetric {
  label: string;
  value: string;
}

export interface JobsSearchField {
  label: string;
  value: string;
}

export interface JobsCategory {
  slug: string;
  title: string;
  focus: string;
  detail: string;
}

export interface JobsShowcaseItem {
  badge: string;
  title: string;
  subtitle: string;
  salary: string;
  meta: string;
  highlight: string;
  imageUrl?: string;
}

export interface JobsEmployerHighlight {
  title: string;
  badge: string;
  detail: string;
  imageUrl?: string;
}

export interface JobsEmirateSpotlight {
  slug: string;
  label: string;
  headline: string;
  summary: string;
  focusAreas: { name: string; focus: string; detail: string; imageUrl?: string; }[];
}

export interface JobsMetricRow {
  label: string;
  value: string;
}

export interface JobsEmployerLane {
  title: string;
  emirateSlug: string;
  categorySlug: string;
  detail: string;
}

export interface JobsEmployerProfile {
  slug: string;
  name: string;
  industry: string;
  headline: string;
  summary: string;
  officeLabel: string;
  responseRhythm: string;
  hiringStatus: string;
  badges: string[];
  metrics: JobsMetricRow[];
  trustSignals: string[];
  activeLanes: JobsEmployerLane[];
}

export interface JobsRoleListing {
  slug: string;
  title: string;
  companySlug: string;
  companyName: string;
  companyIndustry: string;
  emirateSlug: string;
  categorySlug: string;
  location: string;
  salary: string;
  employmentType: string;
  workMode: string;
  experienceLevel: string;
  postedLabel: string;
  validThrough: string;
  summary: string;
  aboutRole: string;
  responsibilities: string[];
  skills: string[];
  qualifications: string[];
  badges: string[];
  insightRows: JobsMetricRow[];
  imageUrl?: string;
}

export const jobsEmirateSlugs = ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'umm-al-quwain', 'ras-al-khaimah', 'fujairah'] as const;

export const jobsMetrics: JobsMetric[] = [
  { label: 'Platform mode', value: 'Candidate + employer' },
  { label: 'Primary trust layer', value: 'Verified employer pages' },
  { label: 'Growth fit', value: 'SEO-ready job detail pages' }
];

export const jobsSearchFields: JobsSearchField[] = [
  { label: 'Role or Keyword', value: 'Sales manager, accountant, developer, nurse' },
  { label: 'Emirate', value: 'Dubai, Abu Dhabi, Sharjah' },
  { label: 'Category', value: 'Sales, Hospitality, Tech, Healthcare' },
  { label: 'Work Mode', value: 'On-site, hybrid, remote' },
  { label: 'Salary / Seniority', value: 'Mid, senior, executive, AED range' }
];

export const jobsQuickFilters = ['Verified employer', 'Urgent hiring', 'Remote-ready', 'Entry level', 'Executive roles', 'Visa support'];

export const jobsTrustSignals = [
  'Employer pages should be visible public objects, not hidden backend entities',
  'Single-job pages need stronger trust, structured facts, and real apply confidence',
  'Anti-scam moderation should quietly shape what gets published and how it is presented',
  'Free-to-start employer access can still feel premium when profile quality and verification stay visible'
];

export const jobsCategories: JobsCategory[] = [
  {
    slug: 'sales',
    title: 'Sales',
    focus: 'High hiring volume',
    detail: 'A core GCC job category that benefits from faster scanning, cleaner employer identity, and strong apply confidence.'
  },
  {
    slug: 'hospitality',
    title: 'Hospitality',
    focus: 'Local market demand',
    detail: 'Great for emirate-level SEO pages and verified employer branding in high-turnover hiring lanes.'
  },
  {
    slug: 'technology',
    title: 'Technology',
    focus: 'Remote and hybrid fit',
    detail: 'Needs cleaner salary, seniority, and work-mode framing than ordinary job boards.'
  },
  {
    slug: 'healthcare',
    title: 'Healthcare',
    focus: 'Trust-sensitive hiring',
    detail: 'Should surface employer credibility, urgency, and qualification signals clearly.'
  }
];

export const jobsShowcaseItems: JobsShowcaseItem[] = [
  {
    badge: 'Verified Employer',
    title: 'Professional roles with sharper employer trust and cleaner apply confidence',
    subtitle: 'Sales, operations, HR, and business support roles',
    salary: 'AED 8K to 22K / month',
    meta: 'Structured detail',
    highlight: 'Job pages should help candidates trust the employer and understand the role before they click apply.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: 'Urgent Hiring',
    title: 'High-intent openings that still feel premium, not spammy',
    subtitle: 'Hospitality, retail, customer support, field operations',
    salary: 'Fast-moving roles',
    meta: 'Volume lane',
    highlight: 'Urgency can be visible without turning the page into a noisy low-trust job board.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: 'Career Growth',
    title: 'Technology and specialist roles with stronger role clarity and employer branding',
    subtitle: 'Engineering, data, product, infrastructure, IT support',
    salary: 'Mid to senior bands',
    meta: 'Candidate quality',
    highlight: 'Good candidates convert better when the job page feels serious, stable, and transparent.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  }
];

export const jobsEmployerHighlights: JobsEmployerHighlight[] = [
  {
    title: 'Verified employer identity',
    badge: 'Employer Trust',
    detail: 'Employer pages should carry company quality, hiring posture, and active openings in one calm public profile.'
  },
  {
    title: 'Candidate confidence on every job page',
    badge: 'Apply UX',
    detail: 'Single-job pages must make people feel safe enough to apply without turning into oversized walls of text.'
  },
  {
    title: 'Growth-ready hiring product',
    badge: 'Marketplace Fit',
    detail: 'Featured jobs, branded employer pages, recruiter seats, and analytics should fit naturally into the Jobs surface.'
  }
];

export const jobsEmirates: JobsEmirateSpotlight[] = [
  {
    slug: 'dubai',
    label: 'Dubai',
    headline: 'The broadest hiring demand, strongest employer branding opportunity, and richest category depth.',
    summary: 'Dubai jobs pages should feel premium, fast to scan, and confident enough for both candidates and serious employers.',
    focusAreas: [
      { name: 'Business Bay', focus: 'Corporate hiring', detail: 'Sales, finance, operations, and support roles with stronger employer credibility needs.' },
      { name: 'Dubai Internet City', focus: 'Technology hiring', detail: 'Tech, product, and digital roles that need cleaner work-mode and salary framing.' },
      { name: 'JLT / Marina', focus: 'Hospitality and services', detail: 'A blend of customer-facing and business roles that benefit from local SEO and verification.' }
    ]
  },
  {
    slug: 'abu-dhabi',
    label: 'Abu Dhabi',
    headline: 'Trust-heavy professional hiring with stronger employer reputation and calmer UX.',
    summary: 'Abu Dhabi should lean into employer credibility, clearer role structure, and more measured public hiring presentation.',
    focusAreas: [
      { name: 'Al Maryah Island', focus: 'Corporate and finance', detail: 'Professional roles where company trust and detail quality matter most.' },
      { name: 'Mussafah', focus: 'Operations and field roles', detail: 'Industrial, transport, and support hiring with stronger employer verification cues.' },
      { name: 'Yas and Saadiyat', focus: 'Hospitality and lifestyle', detail: 'Travel, leisure, and guest-facing roles with volume and urgency.' }
    ]
  },
  {
    slug: 'sharjah',
    label: 'Sharjah',
    headline: 'Practical local hiring with strong value for employer pages and repeat category demand.',
    summary: 'Sharjah should feel simpler and more local, while still keeping employer quality, role clarity, and candidate confidence visible.',
    focusAreas: [
      { name: 'Aljada', focus: 'Growth employers', detail: 'Modern employers and growing business services can anchor this hiring lane.' },
      { name: 'Muwaileh', focus: 'Education and support', detail: 'Education, administration, and operations roles with repeat demand.' },
      { name: 'Industrial areas', focus: 'Workforce hiring', detail: 'Operations, logistics, and field hiring with stronger anti-scam signals.' }
    ]
  }
];

export const jobsEmployerProfiles: JobsEmployerProfile[] = [
  {
    slug: 'aurora-commercial-group',
    name: 'Aurora Commercial Group',
    industry: 'Sales, advisory, and growth operations',
    headline: 'Corporate sales and revenue teams with a stronger employer identity and cleaner apply confidence.',
    summary:
      'Aurora Commercial Group should feel like a polished employer brand with verified hiring posture, visible leadership roles, and public pages strong enough to earn candidate trust before the first application.',
    officeLabel: 'Business Bay and Abu Dhabi Global Market',
    responseRhythm: 'Most applications reviewed in 48 hours',
    hiringStatus: 'Hiring across Dubai and Abu Dhabi',
    badges: ['Employer Verified', 'Fast Responder', 'Structured Hiring'],
    metrics: [
      { label: 'Active openings', value: '12 live roles' },
      { label: 'Primary teams', value: 'Sales, revenue, operations' },
      { label: 'Employer posture', value: 'Direct employer with recruiter seats' }
    ],
    trustSignals: [
      'Verified employer page with visible hiring ownership',
      'Structured role data and moderated public job detail pages',
      'No pay-to-apply workflow and direct application tracking',
      'Employer branding that supports both candidates and recruiter teams'
    ],
    activeLanes: [
      {
        title: 'Dubai sales leadership',
        emirateSlug: 'dubai',
        categorySlug: 'sales',
        detail: 'High-value pipeline, account growth, and team leadership roles.'
      },
      {
        title: 'Abu Dhabi commercial roles',
        emirateSlug: 'abu-dhabi',
        categorySlug: 'sales',
        detail: 'Business development and enterprise account roles with stronger trust cues.'
      },
      {
        title: 'Operations enablement',
        emirateSlug: 'dubai',
        categorySlug: 'sales',
        detail: 'Support, CRM, and revenue operations roles with clearer career paths.'
      }
    ]
  },
  {
    slug: 'harborline-hospitality-group',
    name: 'Harborline Hospitality Group',
    industry: 'Hospitality, guest operations, and lifestyle venues',
    headline: 'A premium hospitality employer with strong public trust, visible openings, and calmer candidate UX.',
    summary:
      'Harborline Hospitality Group should behave like a real hiring brand, not a faceless poster. The public page should support hotel and venue hiring while keeping urgency and quality balanced.',
    officeLabel: 'JBR, Dubai Marina, Yas Island',
    responseRhythm: 'Daily hiring review cycles',
    hiringStatus: 'Active hospitality hiring in Dubai and Abu Dhabi',
    badges: ['Employer Verified', 'Urgent Hiring', 'Top Hiring Employer'],
    metrics: [
      { label: 'Active openings', value: '18 live roles' },
      { label: 'Hiring mix', value: 'Front office, food and beverage, guest services' },
      { label: 'Candidate fit', value: 'High-volume roles with cleaner trust signals' }
    ],
    trustSignals: [
      'Visible employer identity before a candidate clicks apply',
      'Urgent roles framed without turning the page into a noisy job board',
      'Role facts, location, and shifts clarified on public detail pages',
      'Candidate-safe apply flow with anti-scam moderation underneath'
    ],
    activeLanes: [
      {
        title: 'Dubai hospitality hiring',
        emirateSlug: 'dubai',
        categorySlug: 'hospitality',
        detail: 'Guest services, reservations, and venue operations in premium local hubs.'
      },
      {
        title: 'Abu Dhabi lifestyle venues',
        emirateSlug: 'abu-dhabi',
        categorySlug: 'hospitality',
        detail: 'Hotel and leisure roles with stronger employer branding.'
      },
      {
        title: 'Front office leadership',
        emirateSlug: 'dubai',
        categorySlug: 'hospitality',
        detail: 'Supervisor and manager roles with clearer candidate expectations.'
      }
    ]
  },
  {
    slug: 'circuit-bridge-technologies',
    name: 'Circuit Bridge Technologies',
    industry: 'Technology, product delivery, and IT operations',
    headline: 'Modern technology hiring should feel structured, transparent, and serious enough for stronger candidates.',
    summary:
      'Circuit Bridge Technologies should anchor the premium technology lane with sharper role detail, cleaner work-mode communication, and employer pages that feel stable and trustworthy.',
    officeLabel: 'Dubai Internet City and Sharjah',
    responseRhythm: 'Weekly hiring sprints with recruiter ownership',
    hiringStatus: 'Hiring across product, engineering, and IT support',
    badges: ['Employer Verified', 'Hybrid Friendly', 'Growth Team'],
    metrics: [
      { label: 'Active openings', value: '7 live roles' },
      { label: 'Work mode', value: 'On-site, hybrid, and field support' },
      { label: 'Employer style', value: 'Structured hiring with team ownership' }
    ],
    trustSignals: [
      'Role pages highlight work mode, seniority, and stack expectations cleanly',
      'Employer trust matters more in technology than generic job volume',
      'Candidate confidence grows when engineering pages look stable and precise',
      'Public company pages should support both hiring conversion and SEO'
    ],
    activeLanes: [
      {
        title: 'Dubai engineering roles',
        emirateSlug: 'dubai',
        categorySlug: 'technology',
        detail: 'Product engineering and platform roles with clearer stack expectations.'
      },
      {
        title: 'Sharjah IT support',
        emirateSlug: 'sharjah',
        categorySlug: 'technology',
        detail: 'Operational support, field IT, and managed service roles.'
      },
      {
        title: 'Hybrid delivery teams',
        emirateSlug: 'dubai',
        categorySlug: 'technology',
        detail: 'Cross-functional technology roles with hybrid-ready posture.'
      }
    ]
  },
  {
    slug: 'northstar-health-network',
    name: 'Northstar Health Network',
    industry: 'Healthcare, clinics, and patient operations',
    headline: 'Healthcare hiring needs stronger clarity, safer trust signals, and visible employer legitimacy.',
    summary:
      'Northstar Health Network should demonstrate how GulfHabibi Jobs can support trust-sensitive hiring with professional employer identity, clearer qualification cues, and safer public job detail pages.',
    officeLabel: 'Khalifa City, Al Reem Island, Sharjah clinics',
    responseRhythm: 'Priority review for licensed roles',
    hiringStatus: 'Hiring clinicians and operations teams',
    badges: ['Employer Verified', 'Licensed Environment', 'Compliance Aware'],
    metrics: [
      { label: 'Active openings', value: '9 live roles' },
      { label: 'Priority roles', value: 'Nursing, operations, patient support' },
      { label: 'Trust posture', value: 'Verification-led healthcare hiring' }
    ],
    trustSignals: [
      'Qualification and role requirements should be visible before apply',
      'Employer legitimacy is critical in healthcare and support roles',
      'Compliance-aware pages help this category feel safer than open job boards',
      'Public pages should reduce doubt without becoming visually heavy'
    ],
    activeLanes: [
      {
        title: 'Abu Dhabi healthcare roles',
        emirateSlug: 'abu-dhabi',
        categorySlug: 'healthcare',
        detail: 'Licensed care roles and patient support with stronger employer context.'
      },
      {
        title: 'Sharjah clinic operations',
        emirateSlug: 'sharjah',
        categorySlug: 'healthcare',
        detail: 'Support and coordinator roles with clearer qualification expectations.'
      },
      {
        title: 'Patient experience teams',
        emirateSlug: 'abu-dhabi',
        categorySlug: 'healthcare',
        detail: 'Front-desk, service, and care coordination roles with trust-first messaging.'
      }
    ]
  }
];

export const jobsRoleListings: JobsRoleListing[] = [
  {
    slug: 'senior-sales-manager-dubai',
    title: 'Senior Sales Manager',
    companySlug: 'aurora-commercial-group',
    companyName: 'Aurora Commercial Group',
    companyIndustry: 'Sales, advisory, and growth operations',
    emirateSlug: 'dubai',
    categorySlug: 'sales',
    location: 'Dubai / Business Bay',
    salary: 'AED 18K to 25K / month',
    employmentType: 'Full time',
    workMode: 'On site',
    experienceLevel: 'Senior',
    postedLabel: 'Posted 2 days ago',
    validThrough: 'Applications open this week',
    summary: 'Lead a high-value B2B sales desk with enterprise pipeline ownership, team coaching, and close collaboration with revenue operations.',
    aboutRole:
      'This role should demonstrate how premium sales jobs can feel clear, trustworthy, and worth applying to. The page needs stronger employer identity, structured facts, and a clean apply path.',
    responsibilities: [
      'Own monthly and quarterly revenue targets for an enterprise segment',
      'Coach account executives and support cleaner pipeline execution',
      'Partner with operations and marketing on demand conversion'
    ],
    skills: ['Enterprise sales', 'CRM discipline', 'Negotiation', 'Forecasting'],
    qualifications: ['7+ years B2B sales experience', 'Team leadership background', 'UAE market familiarity preferred'],
    badges: ['Employer Verified', 'Premium Role', 'Direct Employer'],
    insightRows: [
      { label: 'Visa support', value: 'Available' },
      { label: 'Team size', value: '45+ commercial staff' },
      { label: 'Apply route', value: 'Direct employer workflow' }
    ]
  },
  {
    slug: 'account-executive-abu-dhabi',
    title: 'Account Executive',
    companySlug: 'aurora-commercial-group',
    companyName: 'Aurora Commercial Group',
    companyIndustry: 'Sales, advisory, and growth operations',
    emirateSlug: 'abu-dhabi',
    categorySlug: 'sales',
    location: 'Abu Dhabi / Al Maryah Island',
    salary: 'AED 10K to 15K / month',
    employmentType: 'Full time',
    workMode: 'Hybrid',
    experienceLevel: 'Mid level',
    postedLabel: 'Posted 3 days ago',
    validThrough: 'Interviewing through this month',
    summary: 'Manage qualified pipelines, close commercial accounts, and work with a structured leadership team in a cleaner employer-led workflow.',
    aboutRole:
      'This role is ideal for showing how mid-market commercial positions can be clearer and safer than generic job-board posts, especially when work mode and employer legitimacy are visible.',
    responsibilities: [
      'Own outbound and inbound commercial conversations',
      'Build proposals and close qualified account opportunities',
      'Keep CRM hygiene and reporting consistent'
    ],
    skills: ['Pipeline management', 'Presentation skills', 'Proposal writing', 'CRM usage'],
    qualifications: ['3+ years account sales experience', 'Strong communication skills', 'English required, Arabic helpful'],
    badges: ['Employer Verified', 'Hybrid Ready'],
    insightRows: [
      { label: 'Commission model', value: 'Base plus structured variable' },
      { label: 'Hiring team', value: 'Commercial leadership' },
      { label: 'Role type', value: 'Client-facing growth role' }
    ]
  },
  {
    slug: 'guest-relations-supervisor-jbr',
    title: 'Guest Relations Supervisor',
    companySlug: 'harborline-hospitality-group',
    companyName: 'Harborline Hospitality Group',
    companyIndustry: 'Hospitality, guest operations, and lifestyle venues',
    emirateSlug: 'dubai',
    categorySlug: 'hospitality',
    location: 'Dubai / JBR',
    salary: 'AED 7K to 10K / month',
    employmentType: 'Full time',
    workMode: 'On site',
    experienceLevel: 'Mid level',
    postedLabel: 'Posted yesterday',
    validThrough: 'Urgent shortlisting this week',
    summary: 'Lead guest-facing service standards, support front-desk coordination, and help maintain premium hospitality delivery in a high-traffic location.',
    aboutRole:
      'Hospitality roles often lose trust because the public page feels vague. This job detail should make the employer, shifts, service expectations, and apply path far more credible.',
    responsibilities: [
      'Supervise guest relations and front-of-house experience',
      'Handle escalations with calm service posture',
      'Coordinate with reservations and operations leaders'
    ],
    skills: ['Guest relations', 'Hospitality operations', 'Conflict handling', 'Team coordination'],
    qualifications: ['Hospitality background required', 'Supervisory experience preferred', 'Strong spoken English'],
    badges: ['Employer Verified', 'Urgent Hiring', 'Shift Based'],
    insightRows: [
      { label: 'Work setting', value: 'Premium hospitality venue' },
      { label: 'Shifts', value: 'Rotational' },
      { label: 'Candidate fit', value: 'Front-of-house leadership' }
    ]
  },
  {
    slug: 'front-office-manager-yas-island',
    title: 'Front Office Manager',
    companySlug: 'harborline-hospitality-group',
    companyName: 'Harborline Hospitality Group',
    companyIndustry: 'Hospitality, guest operations, and lifestyle venues',
    emirateSlug: 'abu-dhabi',
    categorySlug: 'hospitality',
    location: 'Abu Dhabi / Yas Island',
    salary: 'AED 12K to 16K / month',
    employmentType: 'Full time',
    workMode: 'On site',
    experienceLevel: 'Senior',
    postedLabel: 'Posted 4 days ago',
    validThrough: 'Hiring manager reviewing weekly',
    summary: 'Own front-office operations, team standards, and guest service performance for a premium hospitality environment with visible career progression.',
    aboutRole:
      'This page should show how hospitality leadership roles can feel premium and structured, with clearer employer identity and stronger confidence before apply.',
    responsibilities: [
      'Manage front-office team performance and service delivery',
      'Coordinate guest arrivals, escalations, and staffing plans',
      'Report to hotel operations leadership on service quality'
    ],
    skills: ['Front office operations', 'Leadership', 'Scheduling', 'Guest experience'],
    qualifications: ['5+ years hospitality experience', 'Leadership background required', 'Opera or similar system familiarity preferred'],
    badges: ['Employer Verified', 'Leadership Role'],
    insightRows: [
      { label: 'Team ownership', value: 'Front office and guest services' },
      { label: 'Workplace', value: 'On-property leadership role' },
      { label: 'Promotion path', value: 'Regional operations potential' }
    ]
  },
  {
    slug: 'senior-full-stack-engineer-dubai',
    title: 'Senior Full Stack Engineer',
    companySlug: 'circuit-bridge-technologies',
    companyName: 'Circuit Bridge Technologies',
    companyIndustry: 'Technology, product delivery, and IT operations',
    emirateSlug: 'dubai',
    categorySlug: 'technology',
    location: 'Dubai / Internet City',
    salary: 'AED 24K to 34K / month',
    employmentType: 'Full time',
    workMode: 'Hybrid',
    experienceLevel: 'Senior',
    postedLabel: 'Posted 1 day ago',
    validThrough: 'Rolling review with engineering leads',
    summary: 'Build and scale product experiences across React, Node, and platform services in a role that needs strong engineering clarity and employer trust.',
    aboutRole:
      'Technology roles benefit from calm presentation, stack clarity, and visible employer maturity. This page should feel like a serious engineering hiring surface, not a noisy listing board.',
    responsibilities: [
      'Ship product features across web and backend systems',
      'Work with product, design, and platform teams on delivery',
      'Contribute to architecture, code quality, and mentoring'
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'System design'],
    qualifications: ['6+ years product engineering experience', 'Strong TypeScript background', 'Experience with scalable web platforms'],
    badges: ['Employer Verified', 'Hybrid Ready', 'Growth Team'],
    insightRows: [
      { label: 'Engineering model', value: 'Product squad structure' },
      { label: 'Interview path', value: 'Screen, pair, system discussion' },
      { label: 'Work mode', value: 'Hybrid two to three days on site' }
    ]
  },
  {
    slug: 'it-support-specialist-sharjah',
    title: 'IT Support Specialist',
    companySlug: 'circuit-bridge-technologies',
    companyName: 'Circuit Bridge Technologies',
    companyIndustry: 'Technology, product delivery, and IT operations',
    emirateSlug: 'sharjah',
    categorySlug: 'technology',
    location: 'Sharjah / Muwaileh',
    salary: 'AED 6K to 9K / month',
    employmentType: 'Full time',
    workMode: 'On site',
    experienceLevel: 'Mid level',
    postedLabel: 'Posted 5 days ago',
    validThrough: 'Shortlisting this week',
    summary: 'Support business clients with workplace technology, end-user systems, and field issue resolution in a structured team environment.',
    aboutRole:
      'Support roles should not feel like low-trust generic postings. This detail page should keep duties, employer identity, and customer environment clear and practical.',
    responsibilities: [
      'Resolve hardware, software, and user support issues',
      'Handle on-site visits and remote issue follow-up',
      'Coordinate escalations with service delivery teams'
    ],
    skills: ['End-user support', 'Networking basics', 'Troubleshooting', 'Client communication'],
    qualifications: ['3+ years IT support experience', 'Driving licence preferred', 'Windows and endpoint support experience'],
    badges: ['Employer Verified', 'Field Role'],
    insightRows: [
      { label: 'Support model', value: 'On-site and managed support' },
      { label: 'Client mix', value: 'Business accounts' },
      { label: 'Schedule', value: 'Structured weekday coverage' }
    ]
  },
  {
    slug: 'registered-nurse-khalifa-city',
    title: 'Registered Nurse',
    companySlug: 'northstar-health-network',
    companyName: 'Northstar Health Network',
    companyIndustry: 'Healthcare, clinics, and patient operations',
    emirateSlug: 'abu-dhabi',
    categorySlug: 'healthcare',
    location: 'Abu Dhabi / Khalifa City',
    salary: 'AED 9K to 13K / month',
    employmentType: 'Full time',
    workMode: 'On site',
    experienceLevel: 'Mid level',
    postedLabel: 'Posted today',
    validThrough: 'Licensed applicants prioritised',
    summary: 'Deliver patient care in a clinic environment with structured handoff, visible qualification requirements, and stronger employer trust signals.',
    aboutRole:
      'Healthcare pages must remove doubt quickly. This role should highlight employer legitimacy, environment, and qualification expectations without burying the user in clutter.',
    responsibilities: [
      'Support patient care and clinic workflows',
      'Maintain accurate records and safe handoff procedures',
      'Coordinate with clinicians and operations staff'
    ],
    skills: ['Patient care', 'Clinical records', 'Communication', 'Care coordination'],
    qualifications: ['Active nursing eligibility', 'Clinic or hospital experience', 'Professional communication skills'],
    badges: ['Employer Verified', 'Compliance Aware', 'Licensed Environment'],
    insightRows: [
      { label: 'Care environment', value: 'Clinic-based patient support' },
      { label: 'Priority', value: 'Licensed candidates reviewed first' },
      { label: 'Shift style', value: 'Structured rota' }
    ]
  },
  {
    slug: 'clinic-operations-coordinator-sharjah',
    title: 'Clinic Operations Coordinator',
    companySlug: 'northstar-health-network',
    companyName: 'Northstar Health Network',
    companyIndustry: 'Healthcare, clinics, and patient operations',
    emirateSlug: 'sharjah',
    categorySlug: 'healthcare',
    location: 'Sharjah / Aljada',
    salary: 'AED 7K to 10K / month',
    employmentType: 'Full time',
    workMode: 'On site',
    experienceLevel: 'Mid level',
    postedLabel: 'Posted 3 days ago',
    validThrough: 'Manager review ongoing',
    summary: 'Coordinate clinic schedules, front-desk operations, and patient support workflows in a role that combines administration with service quality.',
    aboutRole:
      'Operations roles in healthcare should still look premium and credible. This page should support clearer team context, work environment, and candidate confidence.',
    responsibilities: [
      'Coordinate schedules, records, and front-desk operations',
      'Support patient communication and clinic workflows',
      'Work with care and admin leads on service standards'
    ],
    skills: ['Clinic coordination', 'Operations support', 'Scheduling', 'Patient communication'],
    qualifications: ['Administration or clinic support experience', 'Strong organisational skills', 'Arabic helpful but not required'],
    badges: ['Employer Verified', 'Operations Role'],
    insightRows: [
      { label: 'Function', value: 'Clinic administration and support' },
      { label: 'Team', value: 'Operations and patient services' },
      { label: 'Candidate fit', value: 'Healthcare support operations' }
    ]
  }
];

export function getJobsEmirateSpotlight(slug: string) {
  const found = jobsEmirates.find((item) => item.slug === slug);

  if (found) {
    return found;
  }

  const label = humanizeSlug(slug);

  return {
    slug,
    label,
    headline: `${label} hiring should have a stronger local jobs discovery lane.`,
    summary: 'This emirate route should later connect to real public job pages, verified employer profiles, and stronger category navigation.',
    focusAreas: [
      { name: `${label} Central`, focus: 'Employer demand', detail: 'Strong employer pages and structured job discovery should carry the public hiring experience.' },
      { name: `${label} Business District`, focus: 'Professional roles', detail: 'Corporate and business roles should feel more trustworthy than ordinary job boards.' },
      { name: `${label} Growth Areas`, focus: 'Emerging demand', detail: 'As inventory grows, local role categories and employer pages can become strong SEO assets.' }
    ]
  };
}

export function getJobsCategory(slug: string) {
  return jobsCategories.find((item) => item.slug === slug) || null;
}

export function getJobsEmployerProfile(slug: string) {
  return jobsEmployerProfiles.find((item) => item.slug === slug) || buildFallbackEmployerProfile(slug);
}

export function getJobsListing(slug: string) {
  return jobsRoleListings.find((item) => item.slug === slug) || buildFallbackJobListing(slug);
}

export function getJobsListingsForFilters(filters: {
  emirateSlug?: string;
  categorySlug?: string;
  companySlug?: string;
}) {
  return jobsRoleListings.filter((item) => {
    if (filters.emirateSlug && item.emirateSlug !== filters.emirateSlug) {
      return false;
    }

    if (filters.categorySlug && item.categorySlug !== filters.categorySlug) {
      return false;
    }

    if (filters.companySlug && item.companySlug !== filters.companySlug) {
      return false;
    }

    return true;
  });
}

export function getRelatedJobListings(currentSlug: string, maxItems = 3) {
  const current = jobsRoleListings.find((item) => item.slug === currentSlug);

  if (!current) {
    return jobsRoleListings.slice(0, maxItems);
  }

  const sameCategory = jobsRoleListings.filter((item) => item.slug !== current.slug && item.categorySlug === current.categorySlug);
  const sameEmirate = jobsRoleListings.filter(
    (item) => item.slug !== current.slug && item.categorySlug !== current.categorySlug && item.emirateSlug === current.emirateSlug
  );

  return [...sameCategory, ...sameEmirate].slice(0, maxItems);
}

function buildFallbackEmployerProfile(slug: string): JobsEmployerProfile {
  const label = humanizeSlug(slug);

  return {
    slug,
    name: label,
    industry: 'Employer profile template',
    headline: `${label} should become a premium public employer page with clear identity and hiring trust.`,
    summary:
      'This fallback employer page exists so the Jobs module can keep a premium structure even before live company data is connected to the public layer.',
    officeLabel: 'UAE employer footprint',
    responseRhythm: 'Response rhythm not yet connected',
    hiringStatus: 'Employer profile template',
    badges: ['Employer Profile', 'Trust First'],
    metrics: [
      { label: 'Public role', value: 'Employer identity surface' },
      { label: 'Hiring mode', value: 'Structured openings and public trust' },
      { label: 'Growth fit', value: 'SEO-ready employer page' }
    ],
    trustSignals: [
      'Visible employer identity should reduce candidate uncertainty',
      'Public company pages help the Jobs module feel more premium',
      'Verification and moderation cues belong on the page, not only in admin',
      'Employer branding should support trust before monetization'
    ],
    activeLanes: [
      {
        title: `${label} hiring lane`,
        emirateSlug: 'dubai',
        categorySlug: 'sales',
        detail: 'This placeholder lane will later connect to live employer inventory and recruiter activity.'
      }
    ]
  };
}

function buildFallbackJobListing(slug: string): JobsRoleListing {
  const employer = jobsEmployerProfiles[0];
  const title = humanizeSlug(slug);

  return {
    slug,
    title,
    companySlug: employer.slug,
    companyName: employer.name,
    companyIndustry: employer.industry,
    emirateSlug: 'dubai',
    categorySlug: 'sales',
    location: 'Dubai / UAE',
    salary: 'Compensation shared during screening',
    employmentType: 'Full time',
    workMode: 'On site',
    experienceLevel: 'Mid level',
    postedLabel: 'Template role',
    validThrough: 'Public job template',
    summary: `${title} should resolve into a premium single-job page with stronger employer trust, structured facts, and clean apply UX.`,
    aboutRole:
      'This fallback role keeps the Jobs detail template usable before live listing data is connected to the public read model.',
    responsibilities: [
      'Show how the role detail layout should behave with real employer content',
      'Keep trust, employer identity, and role structure visible above the fold',
      'Support premium apply UX without clutter'
    ],
    skills: ['Structured job detail', 'Employer trust', 'Apply clarity'],
    qualifications: ['Final data will come from public read models', 'Template-safe until runtime data is wired'],
    badges: ['Template Role', 'Employer Verified'],
    insightRows: [
      { label: 'Public state', value: 'Template route' },
      { label: 'Employer profile', value: employer.name },
      { label: 'Purpose', value: 'Premium job detail structure' }
    ]
  };
}

export function humanizeSlug(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
