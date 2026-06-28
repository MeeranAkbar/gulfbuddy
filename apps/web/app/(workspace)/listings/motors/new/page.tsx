import { getAuthenticatedUserContext } from '../../../../../lib/auth/session';
import { getWorkspaceBranches, getWorkspaceCompanies } from '../../../../../lib/company/queries';
import { WorkspacePage } from '../../../../../components/workspace/workspace-page';
import { createMotorsDraftAction } from './actions';
import { MotorsDraftForm } from './motors-form';

export default async function NewMotorsListingPage() {
  const context = await getAuthenticatedUserContext();
  const companyIds = context?.companyIds || [];
  const [companies, branches] = await Promise.all([
    getWorkspaceCompanies(companyIds),
    getWorkspaceBranches(companyIds)
  ]);

  return (
    <WorkspacePage
      eyebrow="Motors publishing"
      title="Publish verified vehicle inventory through your dealer workspace."
      description="List cars, SUVs, trucks, or utility fleets. Listings can be categorized by condition, make, and year, with custom details shown to high-intent buyers."
      actions={[
        { href: '/listings/new', label: 'Choose different category', tone: 'secondary' }
      ]}
      metrics={[
        { label: 'Verify rate', value: 'Instant checks', hint: 'Auto mileage-to-year and teaser price audits' },
        { label: 'Branding options', value: 'Showrooms enabled', hint: 'Surfaces dealer profiles and logo badges' },
        { label: 'Analytics', value: 'Call & WhatsApp tracker', hint: 'Tracks lead event click statistics' }
      ]}
    >
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Vehicle Composer Guidance</p>
          <h2 className="mt-3 text-2xl font-semibold">Post premium stock to build dealer reputation.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 max-w-4xl">
            Buyers on GulfHabibi trust verified seller listings. Make sure to specify the accurate make, model, year, and mileage of the vehicle to bypass automated moderation flags. Fake pricing and rolled-back mileage will trigger restrictions.
          </p>
        </section>

        <MotorsDraftForm companies={companies} branches={branches} action={createMotorsDraftAction} />
      </div>
    </WorkspacePage>
  );
}
