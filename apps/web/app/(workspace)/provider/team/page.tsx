import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getProviderTeamSnapshot } from '../../../../lib/workspace/profile-queries';
import { formatDate, formatLabel } from '../../../../lib/workspace/formatters';

export default async function ProviderTeamPage() {
  const snapshot = await getProviderTeamSnapshot();
  const activeMembers = snapshot.members.filter((item) => item.status === 'active');

  return (
    <WorkspacePage
      eyebrow="Provider team"
      title="Keep provider seats, branch context, and pending invites visible before requests and jobs start scaling."
      description="Service delivery becomes messy fast when branch ownership, field staff, and invite state disappear into admin shadows. This lane keeps the operating team readable from one calmer workspace surface."
      actions={[
        { href: '/company/members', label: 'Company seats' },
        { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Provider companies',
          value: String(snapshot.companies.length),
          hint: 'The service-provider companies currently connected to this workspace identity.'
        },
        {
          label: 'Active members',
          value: String(activeMembers.length),
          hint: 'Live team seats across provider owners, admins, branch managers, and staff roles.'
        },
        {
          label: 'Pending invites',
          value: String(snapshot.invites.length),
          hint: 'Seats that still need to join before the provider team becomes fully operational.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {snapshot.companies.length ? (
            snapshot.companies.map((company) => {
              const members = activeMembers.filter((item) => item.company_id === company.id);
              const invites = snapshot.invites.filter((item) => item.company_id === company.id);

              return (
                <article key={company.id} className="gh-card overflow-hidden">
                  <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-ink">{company.display_name}</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {members.length} active seats • {invites.length} pending invites
                    </p>
                  </div>

                  <div className="space-y-4 p-6">
                    {members.length ? (
                      members.map((member) => (
                        <div key={member.id} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
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
                      <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                        No active provider seats yet for this company.
                      </div>
                    )}

                    {invites.length ? (
                      <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Pending invites</p>
                        <div className="mt-3 space-y-3">
                          {invites.map((invite) => (
                            <div key={invite.id} className="text-sm leading-7 text-[var(--text-secondary)]">
                              {invite.email} • {formatLabel(invite.role)} • expires {formatDate(invite.expires_at)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No provider team structure yet. This lane will matter once service companies and seats begin operating through staging auth.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Provider operations need the same clarity as agency and employer teams once requests, orders, and field work start moving quickly.</p>
              <p>This page should keep seat ownership obvious without making the Services workspace feel like a cold permission grid.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
