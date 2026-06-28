import Link from 'next/link';
import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { getProviderWorkspaceOverview } from '../../../lib/workspace/overview-queries';

function formatCurrency(value: number) {
  return `AED ${new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(value)}`;
}

export default async function ProviderWorkspacePage() {
  const overview = await getProviderWorkspaceOverview();

  return (
    <WorkspacePage
      eyebrow="Provider workspace"
      title="Run local services like a premium provider workspace, not a lead inbox."
      description="The provider side should connect profile trust, offerings, quotes, orders, and commission posture into one operating surface that can scale from solo operators to real service companies."
      actions={[
        { href: '/provider/profile', label: 'Provider profile' },
        { href: '/services', label: 'Public services', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Provider profiles',
          value: String(overview?.providerCount || 0),
          hint: 'Provider identity should anchor services trust, SEO, and request routing.'
        },
        {
          label: 'Requests + quotes',
          value: `${overview?.requestMatchCount || 0} / ${overview?.quoteCount || 0}`,
          hint: 'Watch demand and quoting motion from one shared provider lane.'
        },
        {
          label: 'Active orders',
          value: String(overview?.activeOrderCount || 0),
          hint: 'Service delivery should stay visible enough to support real marketplace behavior later.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Verified providers</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.verifiedProviderCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Provider verification is one of the strongest trust levers in Services.</p>
            </article>
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active offerings</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.activeOfferingCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Service catalog quality should improve both discovery and lead quality.</p>
            </article>
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Completed jobs</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.completedOrderCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Order completion is what makes the services side feel like a real marketplace.</p>
            </article>
          </div>

          <section className="gh-card p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Provider operating lanes</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Strong provider operations should move from public profile into quote and order execution cleanly.</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Profile and coverage</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Keep provider trust, coverage, and public positioning strong.</p>
                <Link href="/provider/profile" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open profile
                </Link>
              </article>
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Requests and quotes</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Treat demand like an operating queue, not a messy inbox.</p>
                <Link href="/provider/requests" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open requests
                </Link>
              </article>
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Orders and finance</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Keep fulfillment and commission posture visible from the same workspace.</p>
                <Link href="/provider/orders" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open orders
                </Link>
              </article>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Commercial posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Commission ledger</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{formatCurrency(overview?.billedCommissionAmount || 0)}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Quote volume</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{overview?.quoteCount || 0}</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>The provider workspace is one of the biggest monetization lanes in the whole platform because it ties trust, demand, delivery, and commercial outcomes together.</p>
              <p>If this stays clean and structured, Services can scale into a real marketplace instead of remaining a directory with forms.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
