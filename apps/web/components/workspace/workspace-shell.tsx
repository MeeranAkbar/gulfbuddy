'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../theme-toggle';

const navGroups = [
  {
    label: 'Core workspace',
    items: [
      { href: '/dashboard', label: 'Overview' },
      { href: '/company', label: 'Company' },
      { href: '/listings', label: 'Listings' },
      { href: '/leads', label: 'Leads' }
    ]
  },
  {
    label: 'Growth',
    items: [
      { href: '/campaigns', label: 'Campaigns' },
      { href: '/billing', label: 'Billing' },
      { href: '/verification', label: 'Verification' }
    ]
  },
  {
    label: 'Role lanes',
    items: [
      { href: '/candidate', label: 'Candidate' },
      { href: '/employer', label: 'Employer' },
      { href: '/provider', label: 'Provider' },
      { href: '/customer', label: 'Customer' }
    ]
  },
  {
    label: 'Control',
    items: [
      { href: '/team', label: 'Team' },
      { href: '/settings', label: 'Settings' }
    ]
  }
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceShell({
  email,
  companyCount,
  hasAdminAccess,
  children
}: {
  email: string | null;
  companyCount: number;
  hasAdminAccess: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentItem =
    navGroups.flatMap((group) => group.items).find((item) => isActivePath(pathname, item.href)) || navGroups[0].items[0];

  return (
    <div className="space-y-6">
      <section className="gh-card p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="gh-pill">Workspace</span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                {companyCount} {companyCount === 1 ? 'company' : 'companies'}
              </span>
              {email ? (
                <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {email}
                </span>
              ) : null}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-[2rem]">{currentItem.label}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Shared operating workspace for companies, listings, leads, verification, monetization, and section-specific execution across GulfHabibi.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            {hasAdminAccess ? (
              <Link href="/admin/command-center" className="gh-button-secondary">
                Admin ops
              </Link>
            ) : null}
            <Link href="/" className="gh-button-primary">
              Public site
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          {navGroups.map((group) => (
            <section key={group.label} className="gh-card p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">{group.label}</p>
              <div className="mt-3 space-y-2">
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        active
                          ? 'flex items-center justify-between rounded-[1rem] border border-[var(--primary)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-ink shadow-[var(--shadow-sm)]'
                          : 'flex items-center justify-between rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-default)] hover:text-ink'
                      }
                    >
                      <span>{item.label}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-muted">Open</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </aside>

        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </div>
  );
}
