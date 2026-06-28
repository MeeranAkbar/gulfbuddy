import { getAuthenticatedUserContext } from '../../../../../lib/auth/session';
import { getWorkspaceBranches, getWorkspaceCompanies } from '../../../../../lib/company/queries';
import { WorkspacePage } from '../../../../../components/workspace/workspace-page';
import { createServicesDraftAction } from './actions';
import { ServicesDraftForm } from './services-form';

export default async function NewServicesListingPage() {
  const context = await getAuthenticatedUserContext();
  const companyIds = context?.companyIds || [];
  const [companies, branches] = await Promise.all([
    getWorkspaceCompanies(companyIds),
    getWorkspaceBranches(companyIds)
  ]);

  return (
    <WorkspacePage
      eyebrow="Services publishing"
      title="Publish local service offerings or emergency provider details."
      description="Post professional offerings like AC maintenance, moving, home renovation, or tutoring. Setup pricing models, target coverage zones, and receive user request quotes."
      actions={[
        { href: '/listings/new', label: 'Choose different category', tone: 'secondary' }
      ]}
      metrics={[
        { label: 'Booking flow', value: 'Interactive quotes', hint: 'Receives request details and maps estimates' },
        { label: 'Revenue model', value: 'Commission led', hint: 'Commission logic applied to completed orders' },
        { label: 'Coverage options', value: 'Emirate wide', hint: 'Filter coverage areas by local neighborhood' }
      ]}
    >
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Provider Posting Guidelines</p>
          <h2 className="mt-3 text-2xl font-semibold">Attract quality leads with detailed service terms.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 max-w-4xl">
            Clearly explain what tasks your service covers and list your starting price. Select your pricing model (e.g., Hourly, Quote-based, Fixed) and estimate the completion duration to help visitors plan and compare options.
          </p>
        </section>

        <ServicesDraftForm companies={companies} branches={branches} action={createServicesDraftAction} />
      </div>
    </WorkspacePage>
  );
}
