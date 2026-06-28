import { getAdminMonetizationSnapshot } from '../../../../lib/monetization/queries';

function formatStatusTone(value: string) {
  if (value === 'pending' || value === 'changes_requested') {
    return 'border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]';
  }

  if (value === 'active' || value === 'scheduled' || value === 'approved') {
    return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
  }

  return 'border-[var(--border-subtle)] bg-[var(--surface-alt)] text-[var(--text-secondary)]';
}

export default async function AdminCampaignsPage() {
  const { campaigns, adSlots } = await getAdminMonetizationSnapshot();

  const pendingCampaigns = campaigns.filter((campaign) => campaign.approval_state === 'pending').length;
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'active' || campaign.status === 'scheduled').length;
  const activeAssignments = adSlots.reduce((total, slot) => total + slot.active_assignment_count, 0);
  const liveSlots = adSlots.filter((slot) => slot.active_assignment_count > 0).length;

  return (
    <div className="space-y-6">
      <section className="gh-card overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(198,169,112,0.18),transparent_34%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
          <span className="gh-pill">Campaign Ops</span>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Control creative approvals and slot capacity before sponsor inventory goes live.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
            The campaign layer should feel calm, readable, and operationally sharp. Approvals, creatives, slot reservations, and brand ownership all need one shared console.
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Campaigns</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{campaigns.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">All campaign objects currently known to the new monetization engine.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Pending approval</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{pendingCampaigns}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Creative or campaign items still waiting for operations review before activation.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active or scheduled</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{activeCampaigns}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Campaigns already live or reserved for a future date window.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Reserved placements</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{activeAssignments}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Current slot demand across hero, inline, and sidebar inventory.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Campaign queue</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Recent campaign drafts, approval states, and slot demand.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Live slots {liveSlots}
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Active assignments {activeAssignments}
              </span>
            </div>
          </div>

          {campaigns.length ? (
            <div className="mt-6 grid gap-4">
              {campaigns.map((campaign) => (
                <article key={campaign.id} className="gh-card overflow-hidden">
                  <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        {campaign.campaign_type.replace(/_/g, ' ')}
                      </span>
                      <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${formatStatusTone(campaign.status)}`}>
                        {campaign.status}
                      </span>
                      <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${formatStatusTone(campaign.approval_state)}`}>
                        {campaign.approval_state}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{campaign.package_name || 'Standalone campaign draft'}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {campaign.owner_company_name || 'No company linked'} / creatives {campaign.creatives_count} / assignments {campaign.slot_assignment_count}
                    </p>
                    {campaign.target_url ? <p className="mt-3 break-all text-sm leading-7 text-[var(--text-secondary)]">{campaign.target_url}</p> : null}
                  </div>

                  <div className="grid gap-3 p-5 sm:grid-cols-3">
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Window start</p>
                      <p className="mt-2 text-sm font-semibold text-ink">{new Date(campaign.start_at).toLocaleDateString('en-AE')}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Window end</p>
                      <p className="mt-2 text-sm font-semibold text-ink">{new Date(campaign.end_at).toLocaleDateString('en-AE')}</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Created</p>
                      <p className="mt-2 text-sm font-semibold text-ink">{new Date(campaign.created_at).toLocaleDateString('en-AE')}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No campaigns yet. The self-serve upload model and slot engine are ready to be connected once staging data is in place.
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Slot inventory</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Capacity across hero, inline, and sidebar placements.</h2>
            <div className="mt-5 space-y-3">
              {adSlots.map((slot) => (
                <article key={slot.id} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {slot.section || 'global'}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {slot.page_type}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">{slot.slot_name}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    {slot.slot_code} / {slot.dimensions || 'Flexible'} / capacity {slot.max_campaigns} / reserved {slot.active_assignment_count}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this screen matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Campaign Ops is where sponsor inventory stops being manual banner placement and becomes a controlled monetization system with approvals, windows, and slot-aware capacity.</p>
              <p>This page should later support creative review drawers, slot calendars, and approval actions without losing the calm premium operations feel.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
