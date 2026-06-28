import Link from 'next/link';
import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { getCustomerWorkspaceOverview } from '../../../lib/workspace/overview-queries';

export default async function CustomerWorkspacePage() {
  const overview = await getCustomerWorkspaceOverview();

  return (
    <WorkspacePage
      eyebrow="Customer workspace"
      title="Manage requests, quotes, and service bookings from one calmer customer hub."
      description="The customer side should make service demand feel structured and trustworthy enough for repeat use, not like a one-time quote form that disappears after submission."
      actions={[
        { href: '/customer/requests', label: 'My requests' },
        { href: '/services/request', label: 'New service request', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Requests',
          value: String(overview?.requestCount || 0),
          hint: 'Every service need should remain visible after submission.'
        },
        {
          label: 'Quotes',
          value: String(overview?.quoteCount || 0),
          hint: 'Customers should be able to compare provider responses with confidence.'
        },
        {
          label: 'Active orders',
          value: String(overview?.activeOrderCount || 0),
          hint: 'Service delivery should stay visible enough to reduce uncertainty.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Completed jobs</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.completedOrderCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">A clean order history gives customers a reason to trust the marketplace again.</p>
            </article>
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Open disputes</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.disputeCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Issue handling should remain visible enough that customers do not feel abandoned.</p>
            </article>
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Booking posture</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">
                {(overview?.activeOrderCount || 0) > 0 ? 'Live' : 'Ready'}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Customers should always understand whether they are still comparing, booking, or waiting for service delivery.</p>
            </article>
          </div>

          <section className="gh-card p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Customer operating lanes</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">The service customer journey should remain structured long after the first quote request.</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Requests</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Track what was asked for and where each request currently stands.</p>
                <Link href="/customer/requests" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open requests
                </Link>
              </article>
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Quotes</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Compare provider pricing and response posture without losing confidence.</p>
                <Link href="/customer/quotes" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open quotes
                </Link>
              </article>
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Orders</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Keep booking state, schedule, and completion visible from one calmer lane.</p>
                <Link href="/customer/orders" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open orders
                </Link>
              </article>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Current posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Quote pressure</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{overview?.quoteCount || 0}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Order history</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{overview?.completedOrderCount || 0}</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>A strong customer hub turns Services from a contact form into a relationship product that people can trust for repeat local needs.</p>
              <p>This is the part of the marketplace that should make customers feel more in control than they would on a random service board.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
