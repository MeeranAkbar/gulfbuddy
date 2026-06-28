import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getProviderRequests } from '../../../../lib/workspace/detail-queries';
import { formatDate, formatLabel, formatMoneyRange } from '../../../../lib/workspace/formatters';

function matchTone(status: string) {
  switch (status) {
    case 'accepted':
    case 'engaged':
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
    case 'declined':
    case 'expired':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    default:
      return 'border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]';
  }
}

export default async function ProviderRequestsPage() {
  const requests = await getProviderRequests();
  const quotedCount = requests.filter((item) => item.quoteStatus && item.quoteStatus !== 'declined').length;
  const orderReady = requests.filter((item) => item.orderStatus && item.orderStatus !== 'cancelled').length;
  const pendingMatch = requests.filter((item) => ['pending', 'new'].includes(item.matchStatus)).length;

  return (
    <WorkspacePage
      eyebrow="Provider requests"
      title="Handle incoming demand like a clean request queue, not a messy inbox of leads."
      description="Providers should see request fit, budget posture, quote state, and order conversion from one calm lane. This is where the Services marketplace starts feeling operationally serious."
      actions={[
        { href: '/provider/orders', label: 'Open orders' },
        { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Matched requests',
          value: String(requests.length),
          hint: 'Requests matched into the current provider workspace, ready for triage and response.'
        },
        {
          label: 'Quoted requests',
          value: String(quotedCount),
          hint: 'Demand already converted into active quote motion.'
        },
        {
          label: 'Order-ready',
          value: String(orderReady),
          hint: 'Requests that already converted beyond quote into a service-delivery object.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {requests.length ? (
            requests.map((request) => (
              <article key={request.matchId} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${matchTone(request.matchStatus)}`}>
                          {formatLabel(request.matchStatus)}
                        </span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {formatLabel(request.requestStatus)}
                        </span>
                        {request.quoteStatus ? (
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            Quote {formatLabel(request.quoteStatus)}
                          </span>
                        ) : null}
                        {request.orderStatus ? (
                          <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                            Order {formatLabel(request.orderStatus)}
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{request.requestTitle}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {[formatLabel(request.category), request.subcategory && formatLabel(request.subcategory), request.emirate, request.area].filter(Boolean).join(' / ')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Budget posture</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {formatMoneyRange({ min: request.budgetMin, max: request.budgetMax, fallback: 'Budget not stated' })}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Matched {formatDate(request.createdAt)}{request.preferredDate ? ` • Preferred ${formatDate(request.preferredDate)}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Reference</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{request.publicRef}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Preferred time</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{request.preferredTime || 'Not set'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Quote posture</p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {request.quoteStatus
                        ? `${formatLabel(request.quoteStatus)}${request.quoteAmount != null ? ` • ${formatMoneyRange({ min: request.quoteAmount, max: request.quoteAmount, currency: request.quoteCurrency, fallback: '' })}` : ''}`
                        : 'No quote sent yet'}
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Order reference</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{request.orderRef || 'Not created'}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No matched requests yet. This lane is ready to become the provider demand console once real request and quote traffic lands on staging data.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Queue posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Pending response</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{pendingMatch}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Requests that still need quick triage or a faster quote response.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Converted to orders</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{orderReady}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Matched demand already turning into real service delivery.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Provider response quality is one of the strongest trust signals in the whole Services section.</p>
              <p>This page should help providers act quickly without losing request detail, budget context, or conversion visibility.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
