import Link from 'next/link';
import { getAdminCommandCenterSnapshot } from '../../../../lib/admin/queries';

function getPriorityTone(value: number) {
  if (value >= 8) {
    return 'border-[var(--danger)]/30 bg-[color:color-mix(in_srgb,var(--danger)_12%,transparent)]';
  }

  if (value >= 3) {
    return 'border-[var(--warning)]/30 bg-[color:color-mix(in_srgb,var(--warning)_12%,transparent)]';
  }

  return 'border-[var(--border-subtle)] bg-[var(--surface-alt)]';
}

function formatSectionLabel(section: string) {
  return section.replace(/_/g, ' ');
}

function getReadinessTone(status: string) {
  if (status === 'ready') {
    return 'border-[color:var(--success)]/25 bg-[color:color-mix(in_srgb,var(--success)_10%,transparent)]';
  }

  if (status === 'needs_schema_apply') {
    return 'border-[color:var(--warning)]/25 bg-[color:color-mix(in_srgb,var(--warning)_10%,transparent)]';
  }

  return 'border-[color:var(--danger)]/25 bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)]';
}

export default async function AdminCommandCenterPage() {
  const snapshot = await getAdminCommandCenterSnapshot();

  const priorityCards = [
    {
      label: 'Compliance cases',
      value: snapshot.queueMetrics.complianceCases,
      detail: 'Regulated property inventory waiting on compliance review or evidence decisions.',
      href: '/admin/compliance'
    },
    {
      label: 'Risk queue',
      value: snapshot.queueMetrics.riskQueue,
      detail: 'Listings auto-flagged by the shared risk engine before any trust is assumed.',
      href: '/admin/risk'
    },
    {
      label: 'Campaign approvals',
      value: snapshot.queueMetrics.pendingCampaigns,
      detail: 'Banner and monetization campaigns waiting for approval or requested changes.',
      href: '/admin/campaigns'
    },
    {
      label: 'Company follow-up',
      value: snapshot.companyMetrics.pending,
      detail: 'Companies still pending verification or requiring stronger operational review.',
      href: '/admin/companies'
    }
  ];

  return (
    <section className="space-y-6">
      <section className="gh-hero p-8 md:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl space-y-4">
            <p className="gh-pill">Command Center</p>
            <div className="space-y-3">
              <h2 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                Keep trust, publishing, and monetization under one calm operational surface.
              </h2>
              <p className="max-w-3xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">
                The command center should help admin teams understand what needs attention right now across compliance, risk, campaigns, and company trust,
                without forcing them through noisy generic admin pages.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/compliance" className="gh-button-primary">
              Open compliance
            </Link>
            <Link href="/admin/risk" className="gh-button-secondary">
              Open risk queue
            </Link>
            <Link href="/admin/campaigns" className="gh-button-secondary">
              Review campaigns
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Open compliance</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.queueMetrics.complianceCases}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Listings waiting on regulated publishing checks.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Risk queue</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.queueMetrics.riskQueue}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {snapshot.queueMetrics.blockedRiskItems} blocked and {snapshot.queueMetrics.urgentRiskItems} urgent right now.
            </p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Verified companies</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.companyMetrics.verified}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {snapshot.companyMetrics.total} tracked companies in the current admin read model.
            </p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Live campaign slots</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.queueMetrics.liveSlots}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {snapshot.queueMetrics.activeCampaigns} active or scheduled campaigns across monetized surfaces.
            </p>
          </div>
        </div>
      </section>

      <section className={`rounded-[1.5rem] border p-6 md:p-7 ${getReadinessTone(snapshot.platformReadiness.status)}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Platform readiness</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">The move-to-staging path should stay explicit and verifiable.</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">{snapshot.platformReadiness.nextAction}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
              {snapshot.platformReadiness.status.replace(/_/g, ' ')}
            </span>
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
              Public env {snapshot.platformReadiness.publicEnvConfigured ? 'configured' : 'missing'}
            </span>
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
              Service role {snapshot.platformReadiness.serviceRoleConfigured ? 'configured' : 'missing'}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">DB reachable</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.platformReadiness.databaseReachable ? 'Yes' : 'No'}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Confirms whether the app can reach the target Supabase project from this environment.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Schema ready</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.platformReadiness.schemaReady ? 'Ready' : 'Missing'}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Checks whether the new platform schemas and public read models actually exist.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Checks passed</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {snapshot.platformReadiness.checks.filter((check) => check.ok).length}/{snapshot.platformReadiness.checks.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">The command center can now surface readiness instead of relying on guesswork.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Launch posture</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {snapshot.platformReadiness.status === 'ready' ? 'Runtime test' : 'SQL apply'}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">This tells the team whether to test flows now or finish staging setup first.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {snapshot.platformReadiness.checks.map((check) => (
            <article key={check.label} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{check.label}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{check.detail}</p>
                </div>
                <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {check.ok ? 'OK' : 'Missing'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Immediate priorities</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Queues that need action today</h3>
            </div>
            <Link href="/admin/compliance" className="gh-button-secondary">
              Review queues
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {priorityCards.map((card) => (
              <Link key={card.label} href={card.href} className={`rounded-[1.4rem] border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] ${getPriorityTone(card.value)}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{card.label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-ink">{card.value}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{card.detail}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-ink">Open lane</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="gh-card p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">System posture</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">What the platform is carrying right now</h3>
          <div className="mt-6 space-y-4">
            {snapshot.listingMetrics.length ? (
              snapshot.listingMetrics
                .sort((a, b) => b.total - a.total)
                .slice(0, 6)
                .map((metric) => (
                  <div key={metric.section} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold capitalize text-ink">{formatSectionLabel(metric.section)}</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{metric.total} total</span>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Published</p>
                        <p className="mt-2 text-lg font-semibold text-ink">{metric.published}</p>
                      </div>
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">In review</p>
                        <p className="mt-2 text-lg font-semibold text-ink">{metric.review}</p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-5 text-sm leading-7 text-[var(--text-secondary)]">
                Section health will become richer once the staging database is populated with live operational inventory.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="gh-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Compliance queue</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">Latest regulated items</h3>
            </div>
            <Link href="/admin/compliance" className="text-sm font-semibold text-ink">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.complianceSnapshot.complianceCases.length ? (
              snapshot.complianceSnapshot.complianceCases.slice(0, 4).map((item) => (
                <article key={item.id} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {item.section}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      Priority {item.priority}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">{item.listing_title || 'Listing awaiting identity'}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{item.company_name || 'No company linked yet'}</p>
                </article>
              ))
            ) : (
              <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                No compliance cases are visible yet.
              </div>
            )}
          </div>
        </section>

        <section className="gh-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Risk queue</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">Auto-flagged inventory</h3>
            </div>
            <Link href="/admin/risk" className="text-sm font-semibold text-ink">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.riskSnapshot.queueItems.length ? (
              snapshot.riskSnapshot.queueItems.slice(0, 4).map((item) => (
                <article key={item.id} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {item.section}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">{item.listing_title || 'Listing reference unavailable'}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    {item.risk_profile ? `${item.risk_profile.risk_state} risk - score ${item.risk_profile.total_score}` : 'Awaiting profile rollup'}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                No open risk queue items are visible yet.
              </div>
            )}
          </div>
        </section>

        <section className="gh-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Monetization lane</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">Campaign and package movement</h3>
            </div>
            <Link href="/admin/campaigns" className="text-sm font-semibold text-ink">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.monetizationSnapshot.campaigns.length ? (
              snapshot.monetizationSnapshot.campaigns.slice(0, 4).map((campaign) => (
                <article key={campaign.id} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {campaign.campaign_type.replace(/_/g, ' ')}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {campaign.approval_state}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">{campaign.owner_company_name || 'User-owned campaign'}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    {campaign.package_name || 'No package linked'} - {campaign.creatives_count} creatives - {campaign.slot_assignment_count} assignments
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                No campaigns are visible yet in the current admin snapshot.
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
