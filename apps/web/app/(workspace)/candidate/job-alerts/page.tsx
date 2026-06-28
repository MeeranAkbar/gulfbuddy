import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getCandidateJobAlerts } from '../../../../lib/workspace/detail-queries';
import { formatCurrencyValue, formatDate, formatLabel, formatListSummary } from '../../../../lib/workspace/formatters';

export default async function CandidateJobAlertsPage() {
  const alerts = await getCandidateJobAlerts();
  const activeCount = alerts.filter((item) => item.isActive).length;
  const salaryTargeted = alerts.filter((item) => item.salaryMin != null).length;
  const multiRegion = alerts.filter((item) => item.emirates.length > 1).length;

  return (
    <WorkspacePage
      eyebrow="Job alerts"
      title="Turn promising search intent into calm, repeatable discovery instead of noisy notification settings."
      description="Alerts should feel curated and useful. Candidates should be able to see what each alert watches, how often it runs, and whether it is still aligned to real hiring intent."
      actions={[
        { href: '/candidate/saved-jobs', label: 'Saved jobs' },
        { href: '/candidate', label: 'Back to candidate hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Alert streams',
          value: String(alerts.length),
          hint: 'Role alerts should stay readable enough that candidates trust them and keep them active.'
        },
        {
          label: 'Active alerts',
          value: String(activeCount),
          hint: 'Only live alerts should keep driving candidates back into discovery.'
        },
        {
          label: 'Salary-targeted',
          value: String(salaryTargeted),
          hint: 'Well-scoped alerts help reduce irrelevant traffic and improve repeat trust.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {alerts.length ? (
            alerts.map((alert) => (
              <article key={alert.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.12),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                            alert.isActive
                              ? 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]'
                              : 'border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]'
                          }`}
                        >
                          {alert.isActive ? 'Active' : 'Paused'}
                        </span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {formatLabel(alert.frequency)}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{alert.keywords || 'Open discovery alert'}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {formatListSummary(alert.categories, 'All categories')} • {formatListSummary(alert.emirates, 'All emirates')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Minimum salary target</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {alert.salaryMin != null ? formatCurrencyValue(alert.salaryMin) : 'No floor set'}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Updated {formatDate(alert.updatedAt)} • Created {formatDate(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Work modes</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatListSummary(alert.workModes, 'Any work mode')}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Coverage</p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {alert.emirates.length > 1 ? `${alert.emirates.length} emirates tracked` : formatListSummary(alert.emirates, 'All UAE')}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No alerts yet. Once you save a search rhythm, this page is ready to become the repeat-discovery engine for your candidate journey.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Alert posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Multi-emirate alerts</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{multiRegion}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Broader discovery streams that may need tighter relevance over time.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Noise control</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{alerts.length ? 'Configured' : 'Open'}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">A premium alerts lane should optimize for relevance, not volume.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Alert quality is one of the quietest but strongest retention engines in the whole Jobs module.</p>
              <p>This page should keep candidates in control of scope and frequency without ever feeling like a noisy settings dump.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
