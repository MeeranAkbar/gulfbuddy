import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getProviderServiceCatalogSummaries } from '../../../../lib/workspace/profile-queries';
import { formatCurrencyValue, formatLabel } from '../../../../lib/workspace/formatters';

export default async function ProviderServicesPage() {
  const catalogs = await getProviderServiceCatalogSummaries();
  const totalOfferings = catalogs.reduce((total, item) => total + item.activeOfferingCount, 0);
  const featuredOfferings = catalogs.reduce((total, item) => total + item.featuredOfferingCount, 0);

  return (
    <WorkspacePage
      eyebrow="Provider services"
      title="Shape the service catalog that drives matching quality, profile strength, and future booking conversion."
      description="Service offerings should feel structured and commercial, not buried in flat forms. Providers need to see category posture, pricing style, and coverage scope in one calmer catalog lane."
      actions={[
        { href: '/provider/profile', label: 'Provider profile' },
        { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Active offerings',
          value: String(totalOfferings),
          hint: 'Offerings are the structured catalog that supports discovery, quote fit, and public page depth.'
        },
        {
          label: 'Featured offerings',
          value: String(featuredOfferings),
          hint: 'Featured service cards later support stronger conversion and premium placement logic.'
        },
        {
          label: 'Coverage lanes',
          value: String(catalogs.reduce((total, item) => total + item.activeAreaCount, 0)),
          hint: 'Area coverage should stay visible because matching quality depends on it.'
        }
      ]}
    >
      <div className="space-y-5">
        {catalogs.length ? (
          catalogs.map((catalog) => (
            <article key={catalog.companyId} className="gh-card overflow-hidden">
              <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                <h2 className="text-2xl font-semibold tracking-tight text-ink">{catalog.displayName}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {catalog.activeOfferingCount} active offerings / {catalog.activeAreaCount} active coverage lanes
                </p>
              </div>

              <div className="grid gap-5 p-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-4">
                  {catalog.offerings.length ? (
                    catalog.offerings.map((offering) => (
                      <div key={offering.id} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {formatLabel(offering.category)}
                          </span>
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {formatLabel(offering.pricing_model)}
                          </span>
                          {offering.is_featured_offering ? (
                            <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                              Featured
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{offering.service_title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {offering.subcategory ? `${formatLabel(offering.subcategory)} / ` : ''}
                          {formatCurrencyValue(offering.base_price, offering.currency || 'AED', 'Price on request')}
                          {offering.duration_estimate ? ` / ${offering.duration_estimate}` : ''}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                      No offerings added yet.
                    </div>
                  )}
                </div>

                <aside className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Coverage map</p>
                  <div className="mt-4 space-y-3">
                    {catalog.areas.length ? (
                      catalog.areas.map((area) => (
                        <div key={area.id} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                          {area.emirate}
                          {area.area ? ` / ${area.area}` : ''}
                          {' / '}
                          {formatLabel(area.coverage_type)}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1rem] border border-dashed border-[var(--border-default)] bg-[var(--surface)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                        No service areas added yet.
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
            No provider catalog yet. This lane is ready to become the service inventory console once provider companies start loading real offerings.
          </div>
        )}

        <aside className="gh-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Catalog direction</p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
            <p>This page should help providers understand whether their pricing posture, offering mix, and area coverage are strong enough for matching and quote conversion.</p>
            <p>As monetization goes live, this lane should also support featured services and premium category positioning without turning into clutter.</p>
          </div>
        </aside>
      </div>
    </WorkspacePage>
  );
}
