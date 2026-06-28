import { getAdminRiskSnapshot } from '../../../../lib/risk/queries';

function getPriorityTone(priority: string) {
  if (priority === 'urgent') {
    return 'rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200';
  }

  if (priority === 'high') {
    return 'rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200';
  }

  return 'rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]';
}

function getRiskTone(riskState: string | null) {
  if (riskState === 'blocked') {
    return 'rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200';
  }

  if (riskState === 'high' || riskState === 'medium') {
    return 'rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200';
  }

  return 'rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200';
}

function getNeutralTone() {
  return 'rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]';
}

export default async function AdminRiskPage() {
  const { queueItems } = await getAdminRiskSnapshot();

  const blockedCount = queueItems.filter((item) => item.risk_profile?.risk_state === 'blocked').length;
  const urgentCount = queueItems.filter((item) => item.priority === 'urgent').length;

  return (
    <div className="space-y-6">
      <section className="gh-hero p-8 md:p-10">
        <p className="gh-pill">Risk Ops</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Hold risky inventory before it gets anywhere near public trust.</h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
          This queue is the shared auto-detection layer for GulfHabibi. Listings are scored, flagged, and routed into human review before any public confidence is assumed.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Open risk cases</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{queueItems.length}</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Blocked items</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{blockedCount}</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Urgent queue</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{urgentCount}</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Current focus</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">Property first</p>
          </div>
        </div>
      </section>

      <section className="gh-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Moderation queue</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Listings auto-flagged by the shared risk engine</h3>
        {queueItems.length ? (
          <div className="mt-5 space-y-4">
            {queueItems.map((item) => (
              <article key={item.id} className="rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className={getNeutralTone()}>{item.section}</span>
                  <span className={getNeutralTone()}>{item.queue_type.replace(/_/g, ' ')}</span>
                  <span className={getPriorityTone(item.priority)}>{item.priority}</span>
                  {item.risk_profile ? <span className={getRiskTone(item.risk_profile.risk_state)}>{item.risk_profile.risk_state} risk</span> : null}
                </div>

                <h4 className="mt-4 text-xl font-semibold text-ink">{item.listing_title || 'Listing reference unavailable'}</h4>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {item.company_name || 'No company linked'}
                  {item.publication_state ? ` | publication ${item.publication_state}` : ''}
                  {item.risk_profile ? ` | score ${item.risk_profile.total_score}` : ''}
                </p>

                {item.reason_codes_json.length ? (
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                    {item.reason_codes_json.map((reason) => (
                      <span key={reason} className={getNeutralTone()}>
                        {reason.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                ) : null}

                {item.triggered_rules.length ? (
                  <div className="mt-4 space-y-3">
                    {item.triggered_rules.map((rule) => (
                      <div key={`${item.id}-${rule.rule_code}`} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                        <div className="flex flex-wrap gap-2 text-xs font-medium">
                          <span className={getNeutralTone()}>{rule.rule_code}</span>
                          <span className={getNeutralTone()}>{rule.severity}</span>
                          <span className={getNeutralTone()}>{rule.action_type.replace(/_/g, ' ')}</span>
                          <span className={getNeutralTone()}>+{rule.score_delta}</span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{rule.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">No individual triggered rules are visible yet for this listing.</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
            No open risk queue items yet. Once submissions start running through the shared auto-check engine, flagged listings will appear here.
          </div>
        )}
      </section>
    </div>
  );
}
