import { SectionPage } from '../../../components/section-page';

const principles = [
  {
    title: 'Trust-first operations',
    description:
      'Listings, profiles, and campaigns are designed to flow through verification, moderation, and risk-aware controls instead of open spam-heavy posting.'
  },
  {
    title: 'One platform, multiple verticals',
    description:
      'Property, motors, jobs, services, classifieds, and directory all sit on one shared foundation for companies, leads, monetization, and admin control.'
  },
  {
    title: 'Built for real operators',
    description:
      'Agencies, dealers, employers, and providers need better public profiles, stronger dashboards, and cleaner reporting than a generic classifieds site can offer.'
  }
];

const marketplaceLanes = [
  'Property with permit-aware compliance and review workflows',
  'Motors with dealer-ready inventory and premium operator pages',
  'Jobs with employer credibility, candidate profiles, and application tracking',
  'Services with quote-to-order flows and commission-ready operations',
  'Directory and classifieds with cleaner discovery and stronger identity signals'
];

export default function AboutPage() {
  return (
    <SectionPage
      eyebrow="About GulfHabibi"
      title="A premium UAE marketplace being built around trust, structure, and scalable operations."
      description="GulfHabibi is designed to feel more credible than open classifieds and more flexible than a single-purpose portal. The goal is one marketplace operating system that can support consumers, businesses, and regulated inventory with the right level of control."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Platform Position</h2>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-ink">6</p>
              <p className="text-sm text-[var(--text-secondary)]">Core marketplace verticals on one shared system</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-ink">1</p>
              <p className="text-sm text-[var(--text-secondary)]">Admin, workspace, lead, and monetization backbone</p>
            </div>
            <div>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                Built for the UAE market with stronger compliance posture, public operator profiles, and cleaner monetization paths.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">What We Are Building</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">A controlled marketplace, not a loose posting board.</h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
              The product direction favors quality listing supply, better business identity, and auditable operations. That means shared permissions,
              trust signals, risk engines, moderation queues, and premium public surfaces instead of uncontrolled low-trust inventory.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="gh-surface-alt rounded-[1.5rem] p-5">
                <h3 className="text-base font-semibold text-ink">{principle.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Marketplace Lanes</p>
          <ul className="mt-5 space-y-4">
            {marketplaceLanes.map((lane) => (
              <li key={lane} className="gh-surface-alt rounded-[1.35rem] px-4 py-4 text-sm leading-7 text-[var(--text-secondary)]">
                {lane}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionPage>
  );
}
