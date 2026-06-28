import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getProviderReportSummaries } from '../../../../lib/workspace/profile-queries';

function formatRate(numerator: number, denominator: number) {
  if (!denominator) return '0%';
  return `${Math.round((numerator / denominator) * 100)}%`;
}

export default async function ProviderReportsPage() {
  const reports = await getProviderReportSummaries();
  const totalMatches = reports.reduce((total, item) => total + item.requestMatchCount, 0);
  const totalQuotes = reports.reduce((total, item) => total + item.quoteCount, 0);
  const totalOrders = reports.reduce((total, item) => total + item.orderCount, 0);

  return (
    <WorkspacePage
      eyebrow="Provider reports"
      title="See how service demand, quote conversion, and fulfillment posture are trending across the provider workspace."
      description="Providers need reporting that explains marketplace traction, not just raw counts. This lane should make it clear where matching is healthy, where conversion is weak, and where service coverage needs work."
      actions={[
        { href: '/provider/finance', label: 'Finance lane' },
        { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Matched requests',
          value: String(totalMatches),
          hint: 'Requests routed toward provider companies through matching and discovery flows.'
        },
        {
          label: 'Quotes sent',
          value: String(totalQuotes),
          hint: 'Quotes indicate how much provider demand is turning into active commercial conversations.'
        },
        {
          label: 'Orders created',
          value: String(totalOrders),
          hint: 'Orders are the clearest signal that Services is moving beyond a basic directory model.'
        }
      ]}
    >
      <div className="space-y-5">
        {reports.length ? (
          reports.map((report) => (
            <article key={report.companyId} className="gh-card overflow-hidden">
              <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-ink">{report.displayName}</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      Request-to-quote conversion {formatRate(report.quoteCount, report.requestMatchCount)} • Quote acceptance{' '}
                      {formatRate(report.quotedAcceptedCount, report.quoteCount)}
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Response score</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{report.responseTimeScore ?? 'N/A'}</p>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      Active offerings {report.activeOfferingCount} • Active areas {report.activeAreaCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Request matches</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{report.requestMatchCount}</p>
                </div>
                <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Quotes sent</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{report.quoteCount}</p>
                </div>
                <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Accepted quotes</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{report.quotedAcceptedCount}</p>
                </div>
                <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Orders</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{report.orderCount}</p>
                </div>
                <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Completed orders</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{report.completedOrderCount}</p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
            No provider reporting data yet. This lane is ready once matching, quotes, and order activity start flowing through staging.
          </div>
        )}
      </div>
    </WorkspacePage>
  );
}
