import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getProviderOrders } from '../../../../lib/workspace/detail-queries';
import { formatCurrencyValue, formatDate, formatLabel, formatMoneyRange } from '../../../../lib/workspace/formatters';

function orderTone(status: string) {
  switch (status) {
    case 'completed':
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
    case 'cancelled':
    case 'disputed':
    case 'refunded_later':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    default:
      return 'border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]';
  }
}

export default async function ProviderOrdersPage() {
  const orders = await getProviderOrders();
  const activeCount = orders.filter((item) => ['created', 'confirmed', 'scheduled', 'in_progress'].includes(item.orderStatus)).length;
  const completedCount = orders.filter((item) => item.orderStatus === 'completed').length;
  const bookedValue = orders.reduce((total, item) => total + Number(item.totalAmount || 0), 0);

  return (
    <WorkspacePage
      eyebrow="Provider orders"
      title="Run service delivery from one order lane that stays clear from confirmation through completion."
      description="Providers need a calmer order console that connects request context, customer detail, schedule posture, and commercial value without turning service delivery into a generic spreadsheet."
      actions={[
        { href: '/provider/requests', label: 'Request queue' },
        { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Orders',
          value: String(orders.length),
          hint: 'Every confirmed service job should remain visible as an operational delivery object.'
        },
        {
          label: 'Active orders',
          value: String(activeCount),
          hint: 'Bookings currently moving through confirmation, scheduling, or active work.'
        },
        {
          label: 'Booked value',
          value: formatCurrencyValue(bookedValue),
          hint: 'Commercial volume already flowing through the provider order lane.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {orders.length ? (
            orders.map((order) => (
              <article key={order.orderId} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${orderTone(order.orderStatus)}`}>
                          {formatLabel(order.orderStatus)}
                        </span>
                        {order.category ? (
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {formatLabel(order.category)}
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{order.requestTitle}</h2>
                        <p className="mt-2 text-sm font-semibold text-ink">{order.customerName || 'Customer identity not shared'}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {[order.emirate, order.area, order.requestPublicRef && `Request ${order.requestPublicRef}`].filter(Boolean).join(' / ')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Order value</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {formatMoneyRange({
                          min: order.subtotalAmount,
                          max: order.totalAmount,
                          currency: order.currency,
                          fallback: 'Not priced'
                        })}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Created {formatDate(order.createdAt)}{order.scheduledAt ? ` • Scheduled ${formatDate(order.scheduledAt)}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Order ref</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{order.orderRef}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Completion</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{order.completedAt ? formatDate(order.completedAt) : 'Not completed yet'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Cancellation</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{order.cancelledAt ? formatDate(order.cancelledAt) : 'Not cancelled'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Total value</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatCurrencyValue(order.totalAmount, order.currency || 'AED')}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No provider orders yet. This page is ready to become the delivery console once matched service demand starts converting into real bookings.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Delivery posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Completed jobs</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{completedCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Orders already carried through to finished service delivery.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Active delivery</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{activeCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Jobs currently needing operational attention and customer follow-through.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Order clarity is where the Services section proves it can support real marketplace delivery, not just lead generation.</p>
              <p>This page should help providers manage accountability, schedule posture, and commercial outcomes without operational chaos.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
