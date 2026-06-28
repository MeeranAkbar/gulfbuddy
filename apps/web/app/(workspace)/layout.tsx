import { redirect } from 'next/navigation';
import { getAuthenticatedUserContext } from '../../lib/auth/session';
import { WorkspaceShell } from '../../components/workspace/workspace-shell';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    redirect('/login');
  }

  return (
    <WorkspaceShell
      email={context.email}
      companyCount={context.companyIds.length}
      hasAdminAccess={context.adminRoles.length > 0}
    >
      {children}
    </WorkspaceShell>
  );
}
