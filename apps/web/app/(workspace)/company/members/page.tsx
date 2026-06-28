import { CompanyMemberAssignmentForm } from '../../../../components/company/company-member-assignment-form';
import { CompanyMemberInviteForm } from '../../../../components/company/company-member-invite-form';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getAuthenticatedUserContext } from '../../../../lib/auth/session';
import { getWorkspaceBranches, getWorkspaceCompanies, getWorkspaceCompanyInvites, getWorkspaceCompanyMembersDetailed } from '../../../../lib/company/queries';
import { assignCompanyMemberAction, createCompanyMemberInviteAction } from './actions';

const roleRows = [
  ['agency_owner / company_owner', 'Full profile, branch, billing, and team control.'],
  ['agency_admin / company_admin', 'Daily company ops, listings, and campaigns.'],
  ['branch_manager / manager', 'Local branch inventory, team, and lead operations.'],
  ['broker / publisher', 'Create and manage live listings without owning billing.'],
  ['analyst / viewer', 'Reports and compliance visibility without edit powers.']
];

interface CompanyMembersPageProps {
  searchParams: Promise<{ invite?: string }>;
}

export default async function CompanyMembersPage({ searchParams }: CompanyMembersPageProps) {
  const resolvedSearchParams = await searchParams;
  const context = await getAuthenticatedUserContext();
  const companyIds = context?.companyIds || [];
  const [companies, branches, members, invites] = await Promise.all([
    getWorkspaceCompanies(companyIds),
    getWorkspaceBranches(companyIds),
    getWorkspaceCompanyMembersDetailed(companyIds),
    getWorkspaceCompanyInvites(companyIds)
  ]);

  return (
    <WorkspacePage
      eyebrow="Team permissions"
      title="Seat the right people with the right powers instead of sharing one login."
      description="The permission templates already exist in the platform foundation. This workspace page is the operational face of that role model."
      actions={[
        { href: '/team', label: 'Open shared team lane' },
        { href: '/company', label: 'Company hub', tone: 'secondary' }
      ]}
      metrics={[
        { label: 'Companies', value: String(companies.length), hint: 'Each company should keep its own role and permission boundaries.' },
        { label: 'Branches', value: String(branches.length), hint: 'Branch assignment later helps local accountability and reporting.' },
        { label: 'Visible seats', value: String(members.length), hint: 'The current account can already read company membership from the shared backbone.' },
        { label: 'Pending invites', value: String(invites.length), hint: 'Invites now live in the shared company model instead of ad hoc notes.' }
      ]}
    >
      <div className="space-y-6">
        {resolvedSearchParams.invite === 'accepted' ? (
          <div className="rounded-[1.5rem] border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 px-5 py-4 text-sm leading-7 text-[color:var(--success)]">
            Company invite accepted successfully. The new seat is now part of the shared team model.
          </div>
        ) : null}

        <CompanyMemberInviteForm companies={companies} branches={branches} action={createCompanyMemberInviteAction} />
        <CompanyMemberAssignmentForm companies={companies} branches={branches} action={assignCompanyMemberAction} />

        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Pending invites</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Track every outstanding invite inside the company workspace.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              Invite links are now stored as first-class records. This lets future email sending, expiry handling, and acceptance analytics plug in cleanly.
            </p>
          </div>

          {invites.length ? (
            <div className="mt-5 grid gap-4">
              {invites.map((invite) => {
                const company = companies.find((item) => item.id === invite.company_id);
                const branch = invite.branch_id ? branches.find((item) => item.id === invite.branch_id) : null;

                return (
                  <article key={invite.id} className="gh-surface-alt rounded-[1.35rem] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{company?.display_name || 'Company'}</p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{invite.email}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {invite.role}
                          {branch ? ` / ${branch.name}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-medium">
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{invite.status}</span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">
                          Expires {new Date(invite.expires_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No pending invites are active yet. Once a company invite is created, this list becomes the operational inbox for onboarding teammates.
            </div>
          )}
        </section>

        <section className="gh-card overflow-hidden">
          <div className="grid grid-cols-[1.1fr_1.4fr] border-b border-[var(--border-default)] bg-[var(--surface-alt)] px-6 py-4 text-sm font-semibold text-ink">
            <div>Role lane</div>
            <div>Operational scope</div>
          </div>
          {roleRows.map(([role, scope]) => (
            <div key={role} className="grid grid-cols-[1.1fr_1.4fr] gap-4 border-b border-[var(--border-subtle)] px-6 py-5 text-sm leading-7 text-[var(--text-secondary)] last:border-b-0">
              <div className="font-medium text-ink">{role}</div>
              <div>{scope}</div>
            </div>
          ))}
        </section>

        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Current seats</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">See which users already hold company seats inside the new role system.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              Seats can now be assigned to existing platform users by email. Full invite automation can come as the next layer.
            </p>
          </div>

          {members.length ? (
            <div className="mt-5 grid gap-4">
              {members.map((member) => {
                const company = companies.find((item) => item.id === member.company_id);

                return (
                  <article key={member.id} className="gh-surface-alt rounded-[1.35rem] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{company?.display_name || 'Company'}</p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{member.display_name || member.email || 'Company seat'}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {member.email || 'No email available'}
                          {member.branch_name ? ` / ${member.branch_name}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-medium">
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{member.role}</span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{member.status}</span>
                        {member.is_primary ? (
                          <span className="rounded-full border border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 px-3 py-1 text-[color:var(--warning)]">Primary seat</span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No company seats are visible yet. Once company onboarding is used, this page becomes the shared role and permission overview.
            </div>
          )}
        </section>
      </div>
    </WorkspacePage>
  );
}
