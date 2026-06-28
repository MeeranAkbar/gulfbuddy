import Link from 'next/link';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getCustomerRequests } from '../../../../lib/workspace/detail-queries';
import { formatDate, formatLabel, formatMoneyRange } from '../../../../lib/workspace/formatters';

function requestTone(status: string) {
  switch (status) {
    case 'accepted':
    case 'converted_to_order':
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
    case 'cancelled':
    case 'expired':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    default:
      return 'border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]';
  }
}

export default async function CustomerRequestsPage() {
  const requests = await getCustomerRequests();
  const matchedCount = requests.filter((item) => item.matchCount > 0).length;
  const quotedCount = requests.filter((item) => item.quoteCount > 0).length;
  const convertedCount = requests.filter((item) => item.orderStatus != null).length;

  return (
    <WorkspacePage
      eyebrow="Customer requests"
      title="Keep every service request visible enough to compare providers and move confidently into booking."
      description="Customers should never feel like their request disappeared into a black box. This lane should show request detail, provider response activity, quote posture, and the path into confirmed service delivery."
      actions={[
        { href: '/services/request', label: 'New request' },
        { href: '/customer', label: 'Back to customer hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Requests',
          value: String(requests.length),
          hint: 'Every service need should remain visible as a real object after submission.'
        },
        {
          label: 'Matched requests',
          value: String(matchedCount),
          hint: 'Requests already engaging provider-side discovery or quote behavior.'
        },
        {
          label: 'Converted orders',
          value: String(convertedCount),
          hint: 'Requests that already moved beyond quote comparison into actual service delivery.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {requests.length ? (
            requests.map((request) => (
              <article key={request.requestId} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${requestTone(request.requestStatus)}`}>
                          {formatLabel(request.requestStatus)}
                        </span>
                        {request.latestQuoteStatus ? (
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            Quote {formatLabel(request.latestQuoteStatus)}
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
                        Created {formatDate(request.createdAt)}{request.preferredDate ? ` • Preferred ${formatDate(request.preferredDate)}` : ''}
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
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Provider activity</p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {request.matchCount} matches • {request.quoteCount} quotes
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Latest provider</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{request.latestProviderName || 'Not surfaced yet'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Latest quote</p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {request.latestQuoteAmount != null
                        ? formatMoneyRange({
                            min: request.latestQuoteAmount,
                            max: request.latestQuoteAmount,
                            currency: request.latestQuoteCurrency,
                            fallback: 'No quote yet'
                          })
                        : 'No quote yet'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-6 py-5">
                  <Link href="/services/request" className="gh-button-primary">
                    New service request
                  </Link>
                  {request.latestProviderSlug ? (
                    <Link href={`/services/provider/${request.latestProviderSlug}`} className="gh-button-secondary">
                      Provider page
                    </Link>
                  ) : null}
                  {request.orderRef ? (
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Order ref {request.orderRef}
                    </span>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No service requests yet. This lane is ready to become your calm booking history once real request traffic lands on the new platform.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Request posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Quoted requests</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{quotedCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Requests already giving you real provider comparison material.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Booking conversion</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{convertedCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Requests already converted into service-delivery objects.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>A strong request lane proves the Services section is more than a lead form. It helps customers stay confident from request through booking.</p>
              <p>This page should make comparison and follow-through feel much safer than random provider directories or offline chat threads.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
