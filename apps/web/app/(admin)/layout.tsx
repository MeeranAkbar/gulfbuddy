import { redirect } from 'next/navigation';
import { getAuthenticatedUserContext } from '../../lib/auth/session';
import { AdminShell } from '../../components/admin/admin-shell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    redirect('/login');
  }

  if (!context.adminRoles.length) {
    return (
      <div className="gh-card p-8">
        <h1 className="text-2xl font-semibold text-ink">Admin access required</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
          This area is reserved for users with an active admin role in the GulfHabibi operations system.
        </p>
      </div>
    );
  }

  return <AdminShell roles={context.adminRoles}>{children}</AdminShell>;
}
