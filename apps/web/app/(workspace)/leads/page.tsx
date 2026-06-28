import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { formatDate, formatLabel } from '../../../lib/workspace/formatters';
import { getWorkspaceLeadSnapshot } from '../../../lib/workspace/shared-queries';

export default async function LeadsWorkspacePage() {
  const snapshot = await getWorkspaceLeadSnapshot();

  return (
    <WorkspacePage
      eyebrow="Lead center"
      title="Keep lead visibility structured across listings, campaigns, and assigned commercial follow-up."
      description="Leads are one of the core operating signals of GulfHabibi. This page should help a workspace understand where demand is coming from, which sections are active, and which events already have direct ownership."
      actions={[
        { href: '/campaigns', label: 'Open campaigns' },
        { href: '/dashboard', label: 'Back to workspace hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Visible lead events',
          value: String(snapshot.totalEvents),
          hint: 'Events routed through current company and assigned-user visibility.'
        },
        {
          label: 'Company-backed',
          value: String(snapshot.companyBackedEvents),
          hint: 'Events already tied to company-owned listings, campaigns, or service/provider workflows.'
        },
        {
          label: 'Assigned to me',
          value: String(snapshot.assignedEvents),
          hint: 'Lead events that already have direct user ownership inside the current workspace.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5">
          {snapshot.recentEvents.length ? (
            snapshot.recentEvents.map((event) => (
              <article key={event.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.12),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="gh-pill">{formatLabel(event.section)}</span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {formatLabel(event.eventType)}
                        </span>
                        {event.assignedToCurrentUser ? (
                          <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                            Assigned to you
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">
                          {event.listingTitle || event.companyName || 'Lead activity'}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {event.companyName || 'No company linkage'} {event.listingSlug ? `• ${event.listingSlug}` : ''} • {formatDate(event.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[18rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Source posture</p>
                      <p className="mt-3 text-sm font-semibold leading-7 text-ink">{event.sourcePage || 'No source page captured'}</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                        {event.sourceContext || 'No source context captured'}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No lead events are visible yet. This lane becomes useful as soon as listings, campaigns, and provider workflows begin generating real demand.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Section distribution</p>
            <div className="mt-5 space-y-3">
              {snapshot.sectionMetrics.length ? (
                snapshot.sectionMetrics.map((metric) => (
                  <div key={metric.key} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">{formatLabel(metric.key)}</p>
                      <p className="text-sm font-semibold text-ink">{metric.total}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.1rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                  No section metrics yet.
                </div>
              )}
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Event mix</p>
            <div className="mt-5 space-y-3">
              {snapshot.eventTypeMetrics.length ? (
                snapshot.eventTypeMetrics.map((metric) => (
                  <div key={metric.key} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">{formatLabel(metric.key)}</p>
                      <p className="text-sm font-semibold text-ink">{metric.total}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.1rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                  No event-type breakdown yet.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
