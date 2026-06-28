import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { getAuthenticatedUserContext } from '../../../lib/auth/session';
import { getWorkspaceMonetizationSnapshot } from '../../../lib/monetization/queries';

export default async function WorkspaceCampaignsPage() {
  const context = await getAuthenticatedUserContext();
  const snapshot = context
    ? await getWorkspaceMonetizationSnapshot({ companyIds: context.companyIds, userId: context.userId })
    : { packageCatalog: [], orders: [], entitlements: [], campaigns: [], adSlots: [] };

  const pendingApproval = snapshot.campaigns.filter((campaign) => campaign.approval_state === 'pending').length;
  const activeAssignments = snapshot.adSlots.reduce((total, slot) => total + slot.active_assignment_count, 0);

  return (
    <WorkspacePage
      eyebrow="Campaign workspace"
      title="Keep sponsor campaigns, creatives, and slot inventory under the same backbone as packages and listing upgrades."
      description="This lane should become the self-serve banner and sponsored placement system for agencies, dealers, developers, service providers, and future branded employers."
      metrics={[
        { label: 'Campaign drafts', value: String(snapshot.campaigns.length), hint: 'Campaign records now sit on the same shared company object as listings and billing.' },
        { label: 'Pending approvals', value: String(pendingApproval), hint: 'Creative and placement approvals should be visible before admin turns them live.' },
        { label: 'Available slots', value: String(snapshot.adSlots.length), hint: 'Hero, sidebar, and inline slot inventory can now be surfaced in one workspace.' },
        { label: 'Reserved placements', value: String(activeAssignments), hint: 'Slot assignment counts make campaign pressure visible before the booking workflow is added.' }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="gh-card p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Campaign records</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Current banner and sponsored placement inventory.</h2>
          {snapshot.campaigns.length ? (
            <div className="mt-5 space-y-4">
              {snapshot.campaigns.map((campaign) => (
                <article key={campaign.id} className="gh-surface-alt rounded-[1.4rem] p-5">
                  <div className="flex flex-wrap gap-2 text-xs font-medium">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">
                      {campaign.campaign_type.replace(/_/g, ' ')}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{campaign.status}</span>
                    <span className="rounded-full border border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 px-3 py-1 text-[color:var(--warning)]">{campaign.approval_state}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{campaign.package_name || 'Standalone campaign draft'}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    Creatives {campaign.creatives_count} / Slot assignments {campaign.slot_assignment_count}
                  </p>
                  {campaign.target_url ? <p className="mt-2 break-all text-sm text-[var(--text-secondary)]">{campaign.target_url}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">No campaign drafts yet. The shared campaign model is now ready for a real self-serve upload flow.</p>
          )}
        </section>

        <section className="gh-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Slot inventory</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Shared ad positions across sections.</h2>
          <div className="mt-5 space-y-3">
            {snapshot.adSlots.map((slot) => (
              <article key={slot.id} className="gh-surface-alt rounded-[1.15rem] p-4">
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{slot.section || 'global'}</span>
                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{slot.page_type}</span>
                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{slot.slot_code}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-ink">{slot.slot_name}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {slot.dimensions || 'Flexible dimensions'} / capacity {slot.max_campaigns} / assigned {slot.active_assignment_count}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </WorkspacePage>
  );
}
