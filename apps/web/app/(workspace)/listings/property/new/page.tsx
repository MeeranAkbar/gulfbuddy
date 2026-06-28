import { PropertyDraftForm } from '../../../../../components/property/property-draft-form';
import { PropertyComposeShell } from '../../../../../components/property/property-compose-shell';
import { WorkspacePage } from '../../../../../components/workspace/workspace-page';
import { getAuthenticatedUserContext } from '../../../../../lib/auth/session';
import { getWorkspaceBranches, getWorkspaceCompanies } from '../../../../../lib/company/queries';
import { createPropertyDraftAction } from './actions';

export default async function NewPropertyListingPage() {
  const context = await getAuthenticatedUserContext();
  const companyIds = context?.companyIds || [];
  const [companies, branches] = await Promise.all([getWorkspaceCompanies(companyIds), getWorkspaceBranches(companyIds)]);

  return (
    <WorkspacePage
      eyebrow="Property publishing"
      title="Publish regulated UAE property inventory through one controlled workspace lane."
      description="This is the first real vertical workflow on top of the shared backbone. It should prove company roles, branch ownership, moderation, compliance, and premium inventory rules before other verticals scale."
      actions={[
        { href: '/company/onboarding', label: 'Complete company setup', tone: 'secondary' },
        { href: '/admin/compliance', label: 'Open admin compliance queue' }
      ]}
      metrics={[
        { label: 'Launch order', value: 'Dubai first', hint: 'Long-term sale and rent should be the first clean regulated lane.' },
        { label: 'Workflow', value: 'Draft → review', hint: 'Publication and compliance should stay separate from each other.' },
        { label: 'Future proof', value: 'Off-plan + holiday homes', hint: 'Separate lanes now avoid painful rewrites later.' }
      ]}
    >
      <PropertyComposeShell />
      <PropertyDraftForm companies={companies} branches={branches} action={createPropertyDraftAction} />
    </WorkspacePage>
  );
}
