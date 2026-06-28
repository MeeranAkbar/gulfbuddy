import { getAuthenticatedUserContext } from '../../../../../lib/auth/session';
import { getWorkspaceBranches, getWorkspaceCompanies } from '../../../../../lib/company/queries';
import { WorkspacePage } from '../../../../../components/workspace/workspace-page';
import { createJobsDraftAction } from './actions';
import { JobsDraftForm } from './jobs-form';

export default async function NewJobsListingPage() {
  const context = await getAuthenticatedUserContext();
  const companyIds = context?.companyIds || [];
  const [companies, branches] = await Promise.all([
    getWorkspaceCompanies(companyIds),
    getWorkspaceBranches(companyIds)
  ]);

  return (
    <WorkspacePage
      eyebrow="Jobs publishing"
      title="Publish open corporate roles or local employment opportunities."
      description="Post available positions within your company or client roster. Track applicants, filter experience requirements, and ensure salary and transparency compliance."
      actions={[
        { href: '/listings/new', label: 'Choose different category', tone: 'secondary' }
      ]}
      metrics={[
        { label: 'Transparency', value: 'Salary ranges required', hint: 'Ensures higher high-quality applicant flow' },
        { label: 'Moderation', value: 'Anti-scam checks', hint: 'Prevents deceptive or commission-only spam' },
        { label: 'Workspace integration', value: 'Applicant list', hint: 'Assigned to your company admin team' }
      ]}
    >
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Employer Posting Guidelines</p>
          <h2 className="mt-3 text-2xl font-semibold">Post specific roles with transparent expectations.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 max-w-4xl">
            To attract top talent in the UAE, ensure the job title is concise and accurately reflects responsibilities. Clearly specify whether the position is remote, hybrid, or on-site, along with the expected monthly salary and experience levels. Listings without specified salary receive significantly less engagement.
          </p>
        </section>

        <JobsDraftForm companies={companies} branches={branches} action={createJobsDraftAction} />
      </div>
    </WorkspacePage>
  );
}
