import { getAdminListingOpsSnapshot } from '../../../../lib/listing/admin-queries';

function formatStateTone(value: string) {
  if (value === 'flagged' || value === 'pending_review' || value === 'submitted' || value === 'auto_checked') {
    return 'border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]';
  }

  if (value === 'published' || value === 'approved') {
    return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
  }

  if (value === 'rejected' || value === 'suspended' || value === 'expired') {
    return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
  }

  return 'border-[var(--border-subtle)] bg-[var(--surface-alt)] text-[var(--text-secondary)]';
}

function formatRiskTone(value: string) {
  if (value === 'blocked' || value === 'high') {
    return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
  }

  if (value === 'medium' || value === 'low') {
    return 'border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]';
  }

  return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
}

function formatPrice(amount: number | null) {
  if (amount == null) return 'Price pending';
  return `AED ${new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(amount)}`;
}

export default async function AdminListingsPage() {
  const { recentListings, sectionMetrics, totalListings, liveListings, reviewListings, highRiskListings } = await getAdminListingOpsSnapshot();

  return (
    <div className="space-y-6">
      <section className="gh-card overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(198,169,112,0.18),transparent_34%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
          <span className="gh-pill">Listings Ops</span>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Watch section inventory, publication pressure, and listing quality from one controlled operations surface.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
            Listings Ops should help the team understand what is live, what is stuck in review, and where risk, promotions, or missing media are building pressure across the marketplace.
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Total listings</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{totalListings}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">All listing records currently flowing through the shared backbone.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Live inventory</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{liveListings}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Approved or published listings already holding public visibility.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Review pressure</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{reviewListings}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Listings currently inside review-oriented publication states.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">High-risk inventory</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{highRiskListings}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Listings already carrying elevated or blocked trust posture in the system.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Recent listing flow</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">The latest listing records should reveal operational pressure quickly.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Recent items {recentListings.length}
              </span>
            </div>
          </div>

          {recentListings.length ? (
            <div className="mt-6 grid gap-4">
              {recentListings.map((listing) => (
                <article key={listing.id} className="gh-card overflow-hidden">
                  <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        {listing.section}
                      </span>
                      <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${formatStateTone(listing.publication_state)}`}>
                        {listing.publication_state}
                      </span>
                      <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${formatRiskTone(listing.risk_profile?.risk_state || listing.risk_state)}`}>
                        {listing.risk_profile?.risk_state || listing.risk_state}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{listing.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {listing.company_name || 'No company linked'} / {listing.emirate}
                      {listing.area ? `, ${listing.area}` : ''} / {formatPrice(listing.price_amount)}
                    </p>
                  </div>

                  <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Media</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{listing.media_count}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Promotions</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{listing.active_promotion_count}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Moderation queue</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{listing.open_moderation_queue_count}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Compliance queue</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{listing.open_compliance_case_count}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No recent listings yet. Once staging data is connected, this screen becomes the central listing pulse across all sections.
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Section posture</p>
            <div className="mt-5 space-y-3">
              {sectionMetrics.map((metric) => (
                <article key={metric.section} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{metric.section}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">Total {metric.total}</p>
                    </div>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Live {metric.live}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Review {metric.review}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Draft {metric.draft}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Flagged {metric.flagged}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this screen matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Listings Ops is where content, monetization, moderation, and trust intersect. If this page is strong, operators can see pressure before it turns into messy public quality.</p>
              <p>This screen should later support filters, bulk actions, duplicate clusters, and media-quality drawers without losing the calm command-center feel.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
