import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getEmployerTeamSnapshot } from '../../../../lib/workspace/profile-queries';
import { formatDate, formatLabel } from '../../../../lib/workspace/formatters';

export default async function EmployerTeamPage() {
  const snapshot = await getEmployerTeamSnapshot();
  const activeMembers = snapshot.members.filter((item) => item.status === 'active');

  return (
    <WorkspacePage
      eyebrow="Employer team"
      title="Keep hiring seats, branch context, and pending invites readable before collaboration gets noisy."
      description="Employer team structure should feel human and operational. Recruiters, hiring managers, and admins need clear seat visibility without dropping into a cold permissions matrix."
      actions={[
        { href: '/company/members', label: 'Company seats' },
        { href: '/employer', label: 'Back to employer hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Employer companies',
          value: String(snapshot.companies.length),
          hint: 'The current hiring organizations connected to this workspace seat.'
        },
        {
          label: 'Active members',
          value: String(activeMembers.length),
          hint: 'Team seats already active across recruiter, admin, and hiring workflows.'
        },
        {
          label: 'Pending invites',
          value: String(snapshot.invites.length),
          hint: 'New hiring seats still waiting to join the company workspace.'
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
                      {members.length} active seats / {invites.length} pending invites
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
                                {member.branch_name ? ` / ${member.branch_name}` : ''}
                                {member.is_primary ? ' / Primary seat' : ''}
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
                        No active seats yet for this employer company.
                      </div>
                    )}

                    {invites.length ? (
                      <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Pending invites</p>
                        <div className="mt-3 space-y-3">
                          {invites.map((invite) => (
                            <div key={invite.id} className="text-sm leading-7 text-[var(--text-secondary)]">
                              {invite.email} / {formatLabel(invite.role)} / expires {formatDate(invite.expires_at)}
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
              No employer team structure yet. This lane will become useful once employer companies and seats start running through staging auth.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Hiring collaboration gets messy quickly unless roles, branches, and invites stay visible inside one calmer team lane.</p>
              <p>This page should keep seat ownership understandable without ever feeling like enterprise permission sprawl.</p>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">What healthy team posture looks like</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Recruiters, hiring managers, and admins should all be scoped clearly enough that applicant handling and job ownership stay accountable.</p>
              <p>This lane should become the bridge between company seats, branch structure, and daily hiring execution.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
