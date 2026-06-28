import Link from 'next/link';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getCustomerOrders } from '../../../../lib/workspace/detail-queries';
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

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders();
  const activeCount = orders.filter((item) => ['created', 'confirmed', 'scheduled', 'in_progress'].includes(item.orderStatus)).length;
  const completedCount = orders.filter((item) => item.orderStatus === 'completed').length;
  const totalBooked = orders.reduce((total, item) => total + Number(item.totalAmount || 0), 0);

  return (
    <WorkspacePage
      eyebrow="Customer orders"
      title="Keep bookings, schedules, and finished service history in one calm order lane."
      description="Customers should always understand what was booked, who is delivering the service, what the latest commercial posture looks like, and whether the order is active, completed, or off track."
      actions={[
        { href: '/customer/quotes', label: 'Open quotes' },
        { href: '/customer', label: 'Back to customer hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Orders',
          value: String(orders.length),
          hint: 'Every confirmed or historical booking should remain visible as part of the customer trust loop.'
        },
        {
          label: 'Active orders',
          value: String(activeCount),
          hint: 'Bookings still in live fulfillment or schedule-ready posture.'
        },
        {
          label: 'Booked value',
          value: formatCurrencyValue(totalBooked),
          hint: 'The current commercial weight of the customer booking lane.'
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
                        {order.providerName ? (
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {order.providerName}
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{order.requestTitle}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          Order {order.orderRef}{order.scheduledAt ? ` • Scheduled ${formatDate(order.scheduledAt)}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Commercial posture</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {formatMoneyRange({
                          min: order.subtotalAmount,
                          max: order.totalAmount,
                          currency: order.currency,
                          fallback: 'Commercials not disclosed'
                        })}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Created {formatDate(order.createdAt)}{order.completedAt ? ` • Completed ${formatDate(order.completedAt)}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Request link</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{order.requestId || 'Not linked'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Total</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatCurrencyValue(order.totalAmount, order.currency || 'AED')}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Completion</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{order.completedAt ? formatDate(order.completedAt) : 'Still in progress'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Cancellation</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{order.cancelledAt ? formatDate(order.cancelledAt) : 'Not cancelled'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-6 py-5">
                  {order.providerSlug ? (
                    <Link href={`/services/provider/${order.providerSlug}`} className="gh-button-primary">
                      Provider page
                    </Link>
                  ) : null}
                  <Link href="/customer/quotes" className="gh-button-secondary">
                    Back to quotes
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No orders yet. This lane is ready to become your calm booking history once requests and quotes start converting into live service jobs.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Booking posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Completed orders</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{completedCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Bookings already carried all the way through service delivery.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Live bookings</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{activeCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Orders still needing schedule awareness or fulfillment visibility.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>A clear order history is what makes customers trust the marketplace for repeat local needs, not just one-off provider discovery.</p>
              <p>This page should make delivery posture and next steps feel controlled and premium instead of uncertain.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
