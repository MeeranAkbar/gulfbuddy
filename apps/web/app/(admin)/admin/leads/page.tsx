import { getAdminLeadOpsSnapshot } from '../../../../lib/lead/queries';

function formatEventLabel(value: string) {
  return value.replace(/_/g, ' ');
}

export default async function AdminLeadsPage() {
  const { recentEvents, sectionMetrics, eventTypeMetrics, totalEvents, companyBackedEvents, campaignLinkedEvents, inquiryEvents } =
    await getAdminLeadOpsSnapshot();

  return (
    <div className="space-y-6">
      <section className="gh-card overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(198,169,112,0.18),transparent_34%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
          <span className="gh-pill">Lead Ops</span>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Watch real user-intent signals across calls, WhatsApp, inquiries, saves, and campaign-driven clicks.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
            Lead Ops should turn raw event streams into an operational picture of demand. This is where listing performance, company response posture, and monetization quality all start to become measurable.
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Lead events</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{totalEvents}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">All recorded marketplace lead signals currently captured in the new platform.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Company-backed</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{companyBackedEvents}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Events already tied to a company object for reporting and routing later.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Campaign-linked</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{campaignLinkedEvents}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Lead interactions currently attributable to monetization surfaces.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Inquiry submits</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{inquiryEvents}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">The highest-intent structured lead action currently defined in the event model.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Recent event stream</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Lead events should be readable enough for both operations and future CRM routing.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Recent events {recentEvents.length}
              </span>
            </div>
          </div>

          {recentEvents.length ? (
            <div className="mt-6 grid gap-4">
              {recentEvents.map((event) => (
                <article key={event.id} className="gh-card overflow-hidden">
                  <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        {event.section}
                      </span>
                      <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                        {formatEventLabel(event.event_type)}
                      </span>
                      {event.campaign_type ? (
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {formatEventLabel(event.campaign_type)}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{event.listing_title || 'Event not linked to a listing yet'}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {event.company_name || 'No company linked'}
                      {event.publication_state ? ` / ${event.publication_state}` : ''}
                    </p>
                  </div>

                  <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Source page</p>
                      <p className="mt-2 text-sm font-semibold text-ink break-all">{event.source_page || 'Direct event source'}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Context</p>
                      <p className="mt-2 text-sm font-semibold text-ink">{event.source_context || 'No context captured'}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Created</p>
                      <p className="mt-2 text-sm font-semibold text-ink">{new Date(event.created_at).toLocaleDateString('en-AE')}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No lead events yet. Once staging traffic and test actions hit the new platform, this screen becomes the central lead and CRM monitoring surface.
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Section mix</p>
            <div className="mt-5 space-y-3">
              {sectionMetrics.map((metric) => (
                <article key={metric.section} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">{metric.section}</p>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      {metric.total}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Event mix</p>
            <div className="mt-5 space-y-3">
              {eventTypeMetrics.map((metric) => (
                <article key={metric.event_type} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">{formatEventLabel(metric.event_type)}</p>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      {metric.total}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this screen matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Lead Ops is where raw engagement becomes operational intelligence. If this screen stays clean, future CRM routing and company reporting will be much easier to trust.</p>
              <p>This page should later support assignment health, CRM sync failures, UTM views, and company-specific funnel quality without feeling like a noisy analytics dump.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
