import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { formatDate, formatLabel } from '../../../lib/workspace/formatters';
import { getWorkspaceTeamSnapshot } from '../../../lib/workspace/shared-queries';

export default async function TeamWorkspacePage() {
  const snapshot = await getWorkspaceTeamSnapshot();

  return (
    <WorkspacePage
      eyebrow="Team center"
      title="See all company seats, invites, and branch-linked operating structure from one shared people lane."
      description="This page should feel like the cross-platform team center for GulfHabibi, not a generic member list. It needs to keep company structure, branch alignment, and trust posture visible at the same time."
      actions={[
        { href: '/company/members', label: 'Manage seats' },
        { href: '/company/branches', label: 'Branches', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Companies',
          value: String(snapshot.companies.length),
          hint: 'Connected business objects currently operating through this workspace identity.'
        },
        {
          label: 'Branches',
          value: String(snapshot.branchCount),
          hint: 'Active operating lanes that can later support leads, permissions, and reporting.'
        },
        {
          label: 'Active seats',
          value: String(snapshot.activeSeatCount),
          hint: 'Live company seats across agencies, employers, providers, dealers, and other operator roles.'
        },
        {
          label: 'Pending invites',
          value: String(snapshot.pendingInviteCount),
          hint: 'Seats still waiting to join before team structure is fully operational.'
        }
      ]}
    >
      <div className="space-y-5">
        {snapshot.companies.length ? (
          snapshot.companies.map(({ company, branches, members, invites, operationalSummary }) => {
            const activeMembers = members.filter((item) => item.status === 'active');

            return (
              <article key={company.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="gh-pill">{formatLabel(company.company_type)}</span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {formatLabel(company.verification_status)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{company.display_name}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {activeMembers.length} active seats • {branches.length} branches • {invites.length} pending invites
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[18rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Company trust tier</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">{formatLabel(company.trust_tier)}</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                        Property reviews {operationalSummary?.property_in_review_count || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    {activeMembers.length ? (
                      activeMembers.map((member) => (
                        <div key={member.id} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-ink">{member.display_name || member.email || 'Team member'}</p>
                              <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)]">
                                {formatLabel(member.role)}
                                {member.branch_name ? ` • ${member.branch_name}` : ''}
                                {member.is_primary ? ' • Primary seat' : ''}
                              </p>
                            </div>
                            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                              {formatLabel(member.status)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.1rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                        No active seats yet for this company.
                      </div>
                    )}
                  </div>

                  <aside className="space-y-4">
                    <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Branches</p>
                      <div className="mt-3 space-y-2">
                        {branches.length ? (
                          branches.map((branch) => (
                            <div key={branch.id} className="text-sm leading-7 text-[var(--text-secondary)]">
                              {branch.name} • {branch.emirate || 'No emirate'}{branch.area ? ` • ${branch.area}` : ''}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm leading-7 text-[var(--text-secondary)]">No active branches yet.</div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Pending invites</p>
                      <div className="mt-3 space-y-2">
                        {invites.length ? (
                          invites.map((invite) => (
                            <div key={invite.id} className="text-sm leading-7 text-[var(--text-secondary)]">
                              {invite.email} • {formatLabel(invite.role)} • expires {formatDate(invite.expires_at)}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm leading-7 text-[var(--text-secondary)]">No pending invites.</div>
                        )}
                      </div>
                    </div>
                  </aside>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
            No team structure is visible yet. This lane becomes useful once real companies, seats, and branches start operating through staging auth.
          </div>
        )}
      </div>
    </WorkspacePage>
  );
}
