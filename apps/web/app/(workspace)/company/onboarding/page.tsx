import { CompanyOnboardingForm } from '../../../../components/company/company-onboarding-form';
import { CompanyOnboardingShell } from '../../../../components/company/company-onboarding-shell';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getAuthenticatedUserContext } from '../../../../lib/auth/session';
import { getWorkspaceCompanies } from '../../../../lib/company/queries';
import { onboardCompanyAction } from './actions';

export default async function CompanyOnboardingPage() {
  const context = await getAuthenticatedUserContext();
  const existingCompanies = await getWorkspaceCompanies(context?.companyIds || []);

  return (
    <WorkspacePage
      eyebrow="Company onboarding"
      title="Create one trusted company record before you scale listings, ads, leads, and reporting."
      description="This is the backbone for agencies, developers, dealers, employers, and service providers. The same company object later powers packages, branches, permissions, campaigns, and compliance."
      actions={[
        { href: '/verification', label: 'Open verification center' },
        { href: '/company', label: 'Back to company hub', tone: 'secondary' }
      ]}
      metrics={[
        { label: 'Core lane', value: '1 shared record', hint: 'No more disconnected poster accounts per section.' },
        { label: 'Seats', value: 'Role-based', hint: 'Owner, admin, broker, manager, publisher, analyst and more.' },
        { label: 'Scaling', value: 'Cross-section', hint: 'Property first, then Motors, Jobs, Services, and Directory.' }
      ]}
    >
      <CompanyOnboardingShell />
      <CompanyOnboardingForm existingCompanies={existingCompanies} action={onboardCompanyAction} />
    </WorkspacePage>
  );
}
