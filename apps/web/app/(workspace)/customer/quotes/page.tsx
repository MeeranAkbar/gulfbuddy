import Link from 'next/link';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getCustomerQuotes } from '../../../../lib/workspace/detail-queries';
import { formatCurrencyValue, formatDate, formatLabel } from '../../../../lib/workspace/formatters';

function quoteTone(status: string) {
  switch (status) {
    case 'accepted':
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
    case 'declined':
    case 'expired':
    case 'withdrawn':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    default:
      return 'border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]';
  }
}

export default async function CustomerQuotesPage() {
  const quotes = await getCustomerQuotes();
  const liveQuotes = quotes.filter((item) => ['sent', 'viewed'].includes(item.quoteStatus)).length;
  const providers = new Set(quotes.map((item) => item.providerName).filter(Boolean)).size;
  const accepted = quotes.filter((item) => item.quoteStatus === 'accepted').length;

  return (
    <WorkspacePage
      eyebrow="Customer quotes"
      title="Compare provider offers with enough structure to choose confidently."
      description="Quotes should feel comparable and trustworthy. Customers need to understand provider identity, price posture, validity, and request context before they decide who to book."
      actions={[
        { href: '/customer/orders', label: 'Open orders' },
        { href: '/customer', label: 'Back to customer hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Quotes',
          value: String(quotes.length),
          hint: 'Every provider response should remain visible as a real comparison object.'
        },
        {
          label: 'Live quotes',
          value: String(liveQuotes),
          hint: 'Quotes still in active consideration or awaiting customer action.'
        },
        {
          label: 'Providers in play',
          value: String(providers),
          hint: 'The current range of provider options visible across all requests.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {quotes.length ? (
            quotes.map((quote) => (
              <article key={quote.quoteId} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${quoteTone(quote.quoteStatus)}`}>
                          {formatLabel(quote.quoteStatus)}
                        </span>
                        {quote.providerName ? (
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {quote.providerName}
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{quote.requestTitle}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Request {quote.requestPublicRef}</p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Quoted amount</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {formatCurrencyValue(quote.quoteAmount, quote.currency || 'AED')}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Sent {formatDate(quote.createdAt)}{quote.validUntil ? ` • Valid until ${formatDate(quote.validUntil)}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-6 py-5">
                  {quote.providerSlug ? (
                    <Link href={`/services/provider/${quote.providerSlug}`} className="gh-button-primary">
                      Provider page
                    </Link>
                  ) : null}
                  <Link href="/customer/orders" className="gh-button-secondary">
                    Open orders
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No quotes yet. This lane is ready to become the compare-and-decide surface once real provider responses arrive on your requests.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Quote posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Accepted quotes</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{accepted}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Offers already moving closer to confirmed booking.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Provider spread</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{providers}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">The current breadth of provider options in the quote lane.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Quote comparison is where the Services section becomes genuinely useful instead of behaving like a directory with a contact form.</p>
              <p>This page should reduce uncertainty and help customers act without leaving the marketplace too early.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
