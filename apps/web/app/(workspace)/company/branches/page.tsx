import { CompanyBranchForm } from '../../../../components/company/company-branch-form';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getAuthenticatedUserContext } from '../../../../lib/auth/session';
import { getWorkspaceBranches, getWorkspaceCompanies } from '../../../../lib/company/queries';
import { createCompanyBranchAction } from './actions';

export default async function CompanyBranchesPage() {
  const context = await getAuthenticatedUserContext();
  const companyIds = context?.companyIds || [];
  const [companies, branches] = await Promise.all([getWorkspaceCompanies(companyIds), getWorkspaceBranches(companyIds)]);

  return (
    <WorkspacePage
      eyebrow="Branches"
      title="Split company operations by branch before listings and leads become noisy."
      description="Branch-aware structure is especially important for agencies, developers, and dealer groups operating across multiple emirates or business districts."
      actions={[
        { href: '/company/onboarding', label: 'Review onboarding' },
        { href: '/company', label: 'Company hub', tone: 'secondary' }
      ]}
      metrics={[
        { label: 'Coverage', value: 'Emirate + area', hint: 'Each branch can carry its own location, contacts, and manager.' },
        { label: 'Reporting', value: 'Branch level', hint: 'Later dashboards can split leads and listings by branch performance.' }
      ]}
    >
      <div className="space-y-6">
        <CompanyBranchForm companies={companies} action={createCompanyBranchAction} />

        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Current branches</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Real branch records that can later own leads, inventory, and local reporting.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              Keep branches clean and purposeful. They should represent real operating lanes, not decorative office names.
            </p>
          </div>

          {branches.length ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {branches.map((branch) => {
                const company = companies.find((item) => item.id === branch.company_id);

                return (
                  <article key={branch.id} className="gh-surface-alt rounded-[1.35rem] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{company?.display_name || 'Company branch'}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{branch.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      {branch.emirate || 'Emirate not set'}
                      {branch.area ? `, ${branch.area}` : ''}
                    </p>
                    <div className="mt-4">
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                        {branch.is_active ? 'Active branch' : 'Inactive'}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No branches yet. Create the first one above to prepare for branch-level inventory, lead routing, and team structure.
            </div>
          )}
        </section>
      </div>
    </WorkspacePage>
  );
}
