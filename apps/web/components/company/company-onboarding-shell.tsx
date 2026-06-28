import Link from 'next/link';

const companyTypeCards = [
  {
    title: 'Property Agency',
    badge: 'Compliance-first',
    description: 'Built for agency owners, branch managers, listing coordinators, and brokers operating inside Dubai and Abu Dhabi permit workflows.',
    points: ['Multi-user team roles', 'Permit and branch aware', 'Lead routing + broker reporting']
  },
  {
    title: 'Developer or Project Company',
    badge: 'Launch-ready',
    description: 'Use developer-branded inventory, project landing pages, and launch packages without mixing your flow into normal agency operations.',
    points: ['Project profiles', 'Launch placements', 'Developer team access']
  },
  {
    title: 'Dealer / Service / Employer Brand',
    badge: 'Shared backbone',
    description: 'The same company layer later powers Motors dealers, employer teams, and service providers without rebuilding permissions from scratch.',
    points: ['Shared seats and branches', 'Campaign and billing controls', 'Cross-section growth path']
  }
];

const onboardingChecklist = [
  'Set legal company name, public display name, and clean GulfHabibi profile slug.',
  'Attach the correct company type so packages, roles, and compliance rules stay accurate.',
  'Create branch coverage for Dubai, Abu Dhabi, or multi-emirate operations.',
  'Invite team members and assign owner, admin, manager, or role-specific seats.',
  'Switch on the public company profile only when branding and verification are ready.'
];

const verificationTracks = [
  {
    title: 'General company verification',
    detail: 'License number, authority, expiry, primary contact, and company profile review.'
  },
  {
    title: 'Property compliance lane',
    detail: 'Dubai Trakheesi / Madmoun and Abu Dhabi Dari / Madhmoun references feed into listing review.'
  },
  {
    title: 'Monetization readiness',
    detail: 'Packages, campaign slots, and featured entitlements stay tied to one company record.'
  }
];

export function CompanyOnboardingShell() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {companyTypeCards.map((card) => (
            <article key={card.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {card.badge}
              </p>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                {card.points.map((point) => (
                  <li key={point} className="rounded-2xl bg-slate-50 px-4 py-3">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Company launch checklist</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Build one trusted business record before you publish at scale.</h2>
            </div>
            <Link
              href="/verification"
              className="inline-flex rounded-full border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Open verification center
            </Link>
          </div>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {onboardingChecklist.map((step, index) => (
              <li key={step} className="flex gap-4 rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 font-semibold text-slate-950">
                  {index + 1}
                </span>
                <span className="text-sm leading-7 text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <aside className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Why this matters</p>
          <h2 className="mt-3 text-2xl font-semibold">One company record should power listings, ads, leads, and reports.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            GulfHabibi should never manage agencies, developers, dealers, or service brands as disconnected poster accounts. The company
            object is the control center for permissions, campaigns, packages, and trust.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Verification tracks</p>
          <div className="mt-4 space-y-4">
            {verificationTracks.map((track) => (
              <div key={track.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                <h3 className="text-base font-semibold text-slate-950">{track.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{track.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
