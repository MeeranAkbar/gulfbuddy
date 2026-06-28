import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { formatLabel } from '../../../lib/workspace/formatters';
import { getWorkspaceSettingsSnapshot } from '../../../lib/workspace/shared-queries';

export default async function SettingsWorkspacePage() {
  const snapshot = await getWorkspaceSettingsSnapshot();

  if (!snapshot) {
    return (
      <WorkspacePage
        eyebrow="Workspace settings"
        title="No authenticated workspace context is available yet."
        description="Settings become meaningful once the app is running with real auth and the shared company backbone is active."
      />
    );
  }

  return (
    <WorkspacePage
      eyebrow="Workspace settings"
      title="Keep account posture, connected companies, and monetization readiness readable from one settings surface."
      description="This page should become the calm system summary for a real operator: account verification, company footprint, public profile posture, and monetization activation all in one place."
      actions={[
        { href: '/company', label: 'Company command center' },
        { href: '/billing', label: 'Billing and packages', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Connected companies',
          value: String(snapshot.companyCount),
          hint: 'How many companies the current workspace identity can operate right now.'
        },
        {
          label: 'Verified companies',
          value: String(snapshot.verifiedCompanyCount),
          hint: 'Verified company posture directly improves trust, moderation confidence, and public conversion.'
        },
        {
          label: 'Active entitlements',
          value: String(snapshot.activeEntitlementCount),
          hint: 'Entitlements should be visible because monetization logic is rules-driven, not hidden booleans.'
        },
        {
          label: 'Live campaigns',
          value: String(snapshot.liveCampaignCount),
          hint: 'Campaigns and slot demand show whether the commercial layer is active or still mostly dormant.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          <article className="gh-card overflow-hidden">
            <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">{snapshot.displayName || 'Workspace account'}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                {snapshot.email || 'No email available'}
                {snapshot.city ? ` / ${snapshot.city}` : ''}
                {' / '}Preferred language {formatLabel(snapshot.preferredLanguage, 'Not set')}
              </p>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Email</p>
                <p className="mt-2 text-sm font-semibold text-ink">{snapshot.emailVerified ? 'Verified' : 'Needs attention'}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Phone</p>
                <p className="mt-2 text-sm font-semibold text-ink">{snapshot.phoneVerified ? 'Verified' : 'Needs attention'}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Identity</p>
                <p className="mt-2 text-sm font-semibold text-ink">{snapshot.identityVerified ? 'Verified' : 'Pending'}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Admin roles</p>
                <p className="mt-2 text-sm font-semibold text-ink">{snapshot.adminRoleCount}</p>
              </div>
            </div>
          </article>

          <article className="gh-card p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Connected companies</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Public trust and profile posture</h2>
              </div>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">{snapshot.publicProfileCount} public profiles enabled</p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {snapshot.companies.length ? (
                snapshot.companies.map((company) => (
                  <div key={company.id} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="gh-pill">{formatLabel(company.company_type)}</span>
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        {formatLabel(company.verification_status)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{company.display_name}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      Trust tier {formatLabel(company.trust_tier)} / {company.public_profile_enabled ? 'Public profile enabled' : 'Public profile private'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                  No connected companies yet.
                </div>
              )}
            </div>
          </article>
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Monetization posture</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Package orders</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{snapshot.orderCount}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Live campaigns</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{snapshot.liveCampaignCount}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Slot demand</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{snapshot.activeSlotDemand}</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
