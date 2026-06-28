import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getProviderFinanceSummaries } from '../../../../lib/workspace/profile-queries';
import { formatCurrencyValue, formatDate, formatLabel } from '../../../../lib/workspace/formatters';

export default async function ProviderFinancePage() {
  const financeSummaries = await getProviderFinanceSummaries();
  const totalCommission = financeSummaries.reduce((total, item) => total + item.totalCommissionAmount, 0);
  const paidCommission = financeSummaries.reduce((total, item) => total + item.paidCommissionAmount, 0);
  const totalOrderValue = financeSummaries.reduce((total, item) => total + item.totalOrderValue, 0);

  return (
    <WorkspacePage
      eyebrow="Provider finance"
      title="Track commission posture, completed order value, and commercial readiness from one calmer finance lane."
      description="Services monetization will only feel trustworthy if providers can understand what the platform measured, what has been billed, and what has already cleared without digging through raw ledger rows."
      actions={[
        { href: '/provider/reports', label: 'Performance reports' },
        { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Tracked commission',
          value: formatCurrencyValue(totalCommission, 'AED', 'AED 0'),
          hint: 'The platform-wide commission posture across all connected service-provider companies.'
        },
        {
          label: 'Paid commission',
          value: formatCurrencyValue(paidCommission, 'AED', 'AED 0'),
          hint: 'What has already cleared on paid ledger entries and no longer needs billing follow-up.'
        },
        {
          label: 'Order value',
          value: formatCurrencyValue(totalOrderValue, 'AED', 'AED 0'),
          hint: 'Total service order value helps explain commission weight and commercial traction.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {financeSummaries.length ? (
            financeSummaries.map((summary) => (
              <article key={summary.companyId} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-ink">{summary.displayName}</h2>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                        {summary.ledgerEntries.length} recent ledger entries available for quick review
                      </p>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Completed order value</p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                        {formatCurrencyValue(summary.completedOrderValue, 'AED', 'AED 0')}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Total booked value {formatCurrencyValue(summary.totalOrderValue, 'AED', 'AED 0')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Total commission</p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      {formatCurrencyValue(summary.totalCommissionAmount, 'AED', 'AED 0')}
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Invoiced commission</p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      {formatCurrencyValue(summary.invoicedCommissionAmount, 'AED', 'AED 0')}
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Paid commission</p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      {formatCurrencyValue(summary.paidCommissionAmount, 'AED', 'AED 0')}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[var(--border-subtle)] p-6">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Recent ledger activity</p>
                  <div className="mt-4 space-y-3">
                    {summary.ledgerEntries.length ? (
                      summary.ledgerEntries.map((entry) => (
                        <div key={entry.id} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-ink">
                                {formatCurrencyValue(entry.commission_amount, entry.currency || 'AED', 'AED 0')}
                              </p>
                              <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)]">
                                {formatLabel(entry.commission_type)} • {formatLabel(entry.billing_status)} • {formatLabel(entry.payout_status)}
                              </p>
                            </div>
                            <div className="text-right text-xs leading-6 text-[var(--text-secondary)]">
                              <p>Created {formatDate(entry.created_at)}</p>
                              <p>Rate {entry.commission_rate ?? 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.1rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                        No commission ledger entries yet.
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No provider finance activity yet. This lane is ready once orders and commission records begin moving through staging.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Commission visibility needs to feel controlled before Services can become a serious monetization engine.</p>
              <p>This page should keep providers clear on what was booked, what was billed, and what still needs finance attention.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
