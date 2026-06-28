import { SectionPage } from '../../../components/section-page';

const contactLanes = [
  {
    title: 'Support',
    description: 'Account help, posting guidance, dashboard issues, and user assistance for day-to-day marketplace activity.',
    response: 'Operational support lane'
  },
  {
    title: 'Sales & packages',
    description: 'Business plans, featured placements, banner campaigns, and growth conversations for agencies, dealers, employers, and providers.',
    response: 'Commercial response lane'
  },
  {
    title: 'Compliance & trust',
    description: 'Permit questions, verification issues, moderation appeals, suspicious listings, and regulated inventory concerns.',
    response: 'Controlled review lane'
  },
  {
    title: 'Partnerships',
    description: 'Developer launches, enterprise onboarding, integrations, strategic distribution, and ecosystem partnerships.',
    response: 'Business development lane'
  }
];

export default function ContactPage() {
  return (
    <SectionPage
      eyebrow="Contact"
      title="One contact layer, routed into the right operational queue."
      description="GulfHabibi contact flows are designed to support support, compliance, and commercial conversations without turning the platform into a loose inbox. The public experience should feel clear, premium, and accountable."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Response Model</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
            <p>Public requests should be tagged, auditable, and routed to the correct team queue.</p>
            <p>High-risk reports and compliance issues should bypass generic support and land in governed review workflows.</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Contact Lanes</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {contactLanes.map((lane) => (
              <article key={lane.title} className="gh-surface-alt rounded-[1.5rem] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-ink">{lane.title}</h2>
                  <span className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {lane.response}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{lane.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Preferred Contact Points</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
            <div className="gh-surface-alt rounded-[1.35rem] p-4">
              <p className="font-semibold text-ink">General Support</p>
              <p className="mt-2">support@gulfhabibi.com</p>
            </div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">
              <p className="font-semibold text-ink">Compliance & Reports</p>
              <p className="mt-2">trust@gulfhabibi.com</p>
            </div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">
              <p className="font-semibold text-ink">Sales & Partnerships</p>
              <p className="mt-2">growth@gulfhabibi.com</p>
            </div>
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
