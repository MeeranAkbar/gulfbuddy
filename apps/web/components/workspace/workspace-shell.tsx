'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../theme-toggle';

const navGroups = [
  {
    label: 'Core workspace',
    items: [
      { href: '/dashboard', label: 'Overview', icon: '📊' },
      { href: '/company', label: 'Company', icon: '🏢' },
      { href: '/listings', label: 'Listings', icon: '📝' },
      { href: '/leads', label: 'Leads', icon: '🎯' }
    ]
  },
  {
    label: 'Growth',
    items: [
      { href: '/campaigns', label: 'Campaigns', icon: '🚀' },
      { href: '/billing', label: 'Billing', icon: '💳' },
      { href: '/verification', label: 'Verification', icon: '✅' }
    ]
  },
  {
    label: 'Role lanes',
    items: [
      { href: '/candidate', label: 'Candidate', icon: '👤' },
      { href: '/employer', label: 'Employer', icon: '👔' },
      { href: '/provider', label: 'Provider', icon: '🛠️' },
      { href: '/customer', label: 'Customer', icon: '🛍️' }
    ]
  },
  {
    label: 'Control',
    items: [
      { href: '/team', label: 'Team', icon: '👥' },
      { href: '/settings', label: 'Settings', icon: '⚙️' }
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
    <div className="flex flex-col min-h-screen bg-[var(--background-muted)]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--surface)]/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2 font-bold tracking-tight text-ink hover:opacity-80 transition-opacity" href="/">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[var(--primary)] text-white text-[0.7rem] shadow-sm">
                G
              </span>
              <span className="text-base leading-none">
                Gulf<span className="text-[var(--primary)]">Habibi</span>
              </span>
            </Link>
            <span className="rounded bg-[var(--surface-muted)] px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {hasAdminAccess && (
              <Link href="/admin/command-center" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                Admin Ops
              </Link>
            )}
            <div className="flex items-center gap-2 border-l border-[var(--border-subtle)] pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-bold text-[var(--primary)]">
                {email ? email.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 mx-auto w-full max-w-[1400px]">
        {/* Thin Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)] py-6 lg:flex overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14">
          <div className="px-6 mb-6">
            <h2 className="text-lg font-bold text-ink">{currentItem.label}</h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{companyCount} active companies</p>
          </div>

          <div className="flex flex-col gap-6 px-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {group.label}
                </p>
                <nav className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const active = isActivePath(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-[var(--primary-soft)] text-[var(--primary)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-ink'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-6 md:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
