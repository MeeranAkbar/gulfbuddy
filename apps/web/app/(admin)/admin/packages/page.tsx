import { getAdminMonetizationSnapshot } from '../../../../lib/monetization/queries';

function formatSection(value: string | null) {
  return value || 'cross-portal';
}

function formatValue(amount: number, currency: string) {
  return `${currency} ${new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(amount)}`;
}

export default async function AdminPackagesPage() {
  const { packageCatalog } = await getAdminMonetizationSnapshot();

  const activePackages = packageCatalog.filter((pkg) => pkg.active).length;
  const monetizedPackages = packageCatalog.filter((pkg) => pkg.price_amount > 0).length;
  const activeEntitlements = packageCatalog.reduce((total, pkg) => total + pkg.active_entitlement_count, 0);
  const crossPortalPackages = packageCatalog.filter((pkg) => !pkg.section).length;

  return (
    <div className="space-y-6">
      <section className="gh-card overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(198,169,112,0.18),transparent_34%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
          <span className="gh-pill">Monetization Ops</span>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Control the package catalog that powers listings, boosts, seats, and future banner campaigns.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
            Packages should feel like a structured revenue engine, not a pile of manual flags. Pricing, duration, entitlements, and section fit all need one shared control plane.
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Catalog size</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{packageCatalog.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">All shared monetization products currently defined in the new platform.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active packages</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{activePackages}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Products currently usable for workspace purchase and entitlement generation.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Paid offers</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{monetizedPackages}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Commercial products with direct revenue value instead of a free entry lane.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active entitlements</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{activeEntitlements}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Live value currently feeding placement, access, or usage rights across the portal.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Package catalog</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Shared packages should stay readable across every section and revenue lane.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Cross-portal {crossPortalPackages}
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Entitlements {activeEntitlements}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {packageCatalog.map((pkg) => (
              <article key={pkg.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {formatSection(pkg.section)}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {pkg.product_type.replace(/_/g, ' ')}
                    </span>
                    <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                      {pkg.billing_model.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{pkg.name}</h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{pkg.code}</p>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Price</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{formatValue(pkg.price_amount, pkg.currency)}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Orders</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{pkg.order_count}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Entitlements</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{pkg.active_entitlement_count}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <aside className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Catalog posture</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Free-entry products</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{packageCatalog.filter((pkg) => pkg.price_amount === 0).length}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Free tiers should still flow through moderation and entitlement logic, not bypass the system.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Timed packages</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{packageCatalog.filter((pkg) => pkg.duration_days != null).length}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Duration-aware products are the base for fair featured rotation and time-boxed commercial value.</p>
              </div>
            </div>
          </aside>

          <aside className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this screen matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Packages are the shared revenue grammar of GulfHabibi. If this screen stays clean, every section can monetize without inventing its own inconsistent rules.</p>
              <p>This page should later support package editing, feature-flag previews, and entitlement simulation before products go fully live.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
