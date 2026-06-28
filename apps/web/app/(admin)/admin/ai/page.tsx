import { getAdminAiOpsSnapshot } from '../../../../lib/admin/ai-queries';

function formatEventLabel(value: string) {
  return value.replace(/_/g, ' ');
}

function formatSeverityTone(value: string) {
  if (value === 'critical' || value === 'high') {
    return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
  }

  if (value === 'medium') {
    return 'border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]';
  }

  return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
}

export default async function AdminAiPage() {
  const { activeRuleCount, detectionCount, blockedListingCount, queueOpenCount, recentDetections, sectionMetrics } =
    await getAdminAiOpsSnapshot();

  return (
    <div className="space-y-6">
      <section className="gh-card overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(198,169,112,0.18),transparent_34%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
          <span className="gh-pill">AI Ops</span>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Keep AI assistive, fully logged, and tightly constrained by trust rules across the marketplace.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
            AI Ops should help the team review detection pressure, recommendation quality, and safe automation boundaries without ever becoming the source of truth for compliance, billing, or risky publication decisions.
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active rules</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{activeRuleCount}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Shared detection rules currently active across the risk engine.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Recent detections</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{detectionCount}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Latest recorded rule triggers available for operator review.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Blocked posture</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{blockedListingCount}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Listings currently held in blocked risk state and unable to move forward.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Queue pressure</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{queueOpenCount}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Open moderation items already created from automated risk actions.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Detection stream</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Every automated signal should stay explainable enough for human review.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Recent detections {recentDetections.length}
              </span>
            </div>
          </div>

          {recentDetections.length ? (
            <div className="mt-6 grid gap-4">
              {recentDetections.map((item) => (
                <article key={item.id} className="gh-card overflow-hidden">
                  <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        {item.section}
                      </span>
                      <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${formatSeverityTone(item.severity)}`}>
                        {item.severity}
                      </span>
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        {formatEventLabel(item.action_type)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{item.listing_title || 'Detection not linked to a title yet'}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {item.company_name || 'No company linked'}
                      {item.publication_state ? ` / ${item.publication_state}` : ''}
                    </p>
                  </div>

                  <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Rule</p>
                      <p className="mt-2 break-all text-sm font-semibold text-ink">{item.rule_code}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Message</p>
                      <p className="mt-2 text-sm font-semibold text-ink">{item.message}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Created</p>
                      <p className="mt-2 text-sm font-semibold text-ink">{new Date(item.created_at).toLocaleDateString('en-AE')}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No detection records yet. Once staging traffic and review flows are connected, this becomes the live monitoring surface for AI-assisted trust posture.
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Section posture</p>
            <div className="mt-5 space-y-3">
              {sectionMetrics.map((metric) => (
                <article key={metric.section} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{metric.section}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">Active rules {metric.activeRules}</p>
                    </div>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Queue {metric.queueOpen}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Detections {metric.detections}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Blocked {metric.blockedProfiles}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">AI guardrails</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>AI can assist detection, summarization, and operator triage, but it cannot approve regulated property, billing outcomes, or trust-sensitive publication on its own.</p>
              <p>This screen should later show recommendation confidence, false-positive reviews, and safe auto-fixer history without becoming a black box.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
