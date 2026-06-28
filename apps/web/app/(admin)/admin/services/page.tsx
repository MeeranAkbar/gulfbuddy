import Link from 'next/link';
import { getAdminServicesOpsSnapshot } from '../../../../lib/services/admin-queries';

function formatLabel(value: string) {
  return value.replace(/_/g, ' ');
}

export default async function AdminServicesPage() {
  const snapshot = await getAdminServicesOpsSnapshot();

  return (
    <section className="space-y-6">
      <section className="gh-hero p-8 md:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl space-y-4">
            <p className="gh-pill">Services Ops</p>
            <div className="space-y-3">
              <h2 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                Provider trust, request flow, and order health should sit inside one premium operations lane.
              </h2>
              <p className="max-w-3xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">
                Services ops should help the team understand provider quality, request volume, quote movement, and live service delivery without dropping into a noisy admin template.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/leads" className="gh-button-primary">
              Lead ops
            </Link>
            <Link href="/admin/companies" className="gh-button-secondary">
              Company ops
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Providers</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.totalProviders}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{snapshot.verifiedProviders} verified providers in the current services read model.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active requests</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.activeRequests}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Open customer demand still moving through quote or order conversion.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Quotes sent</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.sentQuotes}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Quotes are one of the clearest signals of provider responsiveness in this section.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Live orders</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.liveOrders}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{snapshot.openDisputes} open disputes or unresolved service issues right now.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Provider posture</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Recent service operators</h3>
            </div>
            <Link href="/admin/companies" className="gh-button-secondary">
              Review companies
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {snapshot.recentProviders.length ? (
              snapshot.recentProviders.map((provider) => (
                <article key={provider.company_id} className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="gh-pill">{provider.verification_status}</span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {provider.trust_tier}
                    </span>
                    {provider.emergency_service ? (
                      <span className="rounded-full border border-[var(--warning)]/30 bg-[color:color-mix(in_srgb,var(--warning)_12%,transparent)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                        emergency service
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-ink">{provider.display_name || 'Unnamed provider'}</p>
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      {provider.is_accepting_requests ? 'Accepting new requests' : 'Request intake paused'} · profile strength {provider.profile_strength_score}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      ['Offerings', provider.active_offerings_count.toString()],
                      ['Areas', provider.area_count.toString()],
                      ['Matches', provider.matched_request_count.toString()],
                      ['Live orders', provider.live_order_count.toString()]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                        <p className="mt-2 text-sm font-medium text-ink">{value}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-5 text-sm leading-7 text-[var(--text-secondary)]">
                Services ops will become richer once provider onboarding and request activity are flowing through staging data.
              </div>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Request posture</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">How customer demand is distributed</h3>
            <div className="mt-5 space-y-3">
              {snapshot.requestStatusMetrics.length ? (
                snapshot.requestStatusMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold capitalize text-ink">{formatLabel(metric.label)}</p>
                      <span className="text-sm font-semibold text-ink">{metric.total}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                  No request rows are visible yet.
                </div>
              )}
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Order posture</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">How the service delivery lane is behaving</h3>
            <div className="mt-5 space-y-3">
              {snapshot.orderStatusMetrics.length ? (
                snapshot.orderStatusMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold capitalize text-ink">{formatLabel(metric.label)}</p>
                      <span className="text-sm font-semibold text-ink">{metric.total}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                  No order rows are visible yet in the current snapshot.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
