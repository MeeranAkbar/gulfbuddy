'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../theme-toggle';

const navGroups = [
  {
    label: 'Command',
    items: [
      { href: '/admin/command-center', label: 'Command Center' },
      { href: '/admin/compliance', label: 'Compliance Ops' },
      { href: '/admin/risk', label: 'Risk Ops' },
      { href: '/admin/listings', label: 'Listings Ops' }
    ]
  },
  {
    label: 'Growth',
    items: [
      { href: '/admin/companies', label: 'Company Ops' },
      { href: '/admin/packages', label: 'Packages' },
      { href: '/admin/campaigns', label: 'Campaigns' },
      { href: '/admin/leads', label: 'Lead Ops' }
    ]
  },
  {
    label: 'Platform',
    items: [
      { href: '/admin/jobs', label: 'Jobs' },
      { href: '/admin/services', label: 'Services' },
      { href: '/admin/ai', label: 'AI Ops' },
      { href: '/admin/settings', label: 'Settings' }
    ]
  }
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function humanizeRole(role: string) {
  return role.replace(/_/g, ' ');
}

export function AdminShell({
  roles,
  children
}: {
  roles: string[];
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
              <span className="gh-pill">Admin Operations</span>
              {roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted"
                >
                  {humanizeRole(role)}
                </span>
              ))}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-[2rem]">{currentItem.label}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Premium operations shell for moderation, compliance, monetization, companies, and system trust across GulfHabibi.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard" className="gh-button-secondary">
              Workspace
            </Link>
            <Link href="/" className="gh-button-primary">
              Public site
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
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
