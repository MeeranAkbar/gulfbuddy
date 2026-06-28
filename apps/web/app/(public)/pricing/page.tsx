import { SectionPage } from '../../../components/section-page';

const packages = [
  {
    name: 'Free Basic',
    price: 'AED 0',
    description: 'A controlled entry lane for individuals and new businesses that need visibility without bypassing moderation or trust checks.',
    features: ['Limited active listings', 'Standard discovery', 'Core dashboard access']
  },
  {
    name: 'Starter Business',
    price: 'Growth plan',
    description: 'Designed for agencies, dealers, employers, and providers that need more inventory, stronger branding, and operational visibility.',
    features: ['Expanded posting limits', 'Business profile priority', 'Lead and team visibility']
  },
  {
    name: 'Premium Placement',
    price: 'Campaign based',
    description: 'Promotion products for featured inventory, sponsored visibility, and banner campaigns managed through entitlement-driven logic.',
    features: ['Featured listing logic', 'Campaign slot controls', 'Higher visibility surfaces']
  }
];

export default function PricingPage() {
  return (
    <SectionPage
      eyebrow="Pricing"
      title="Free to start, structured to grow, and built on entitlement-based monetization."
      description="GulfHabibi pricing is being shaped around clean operational rules instead of scattered featured flags. Packages should govern visibility, workspace capacity, branding, campaigns, and reporting in one shared model."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Commercial Principles</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
            <li>Free tier stays available but controlled.</li>
            <li>Paid upgrades unlock structure, not shortcuts around trust.</li>
            <li>Campaign and promotion logic remains auditable.</li>
          </ul>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <article key={pkg.name} className="gh-surface rounded-[1.75rem] p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Package</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{pkg.name}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">{pkg.description}</p>
                </div>
                <div className="rounded-[1.35rem] border border-[var(--border-default)] px-5 py-4 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Pricing posture</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{pkg.price}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {pkg.features.map((feature) => (
                  <div key={feature} className="gh-surface-alt rounded-[1.35rem] px-4 py-4 text-sm leading-7 text-[var(--text-secondary)]">
                    {feature}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Included Across Plans</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
            <div className="gh-surface-alt rounded-[1.35rem] p-4">Structured listing states, moderation routing, and trust-aware publishing controls.</div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">Public business/operator profile surfaces with section-specific discovery lanes.</div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">Workspace and admin reporting hooks for leads, approvals, campaigns, and compliance.</div>
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
