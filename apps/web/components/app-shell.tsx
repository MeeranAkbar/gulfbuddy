import Link from 'next/link';
import { ReactNode } from 'react';
import { ThemeToggle } from './theme-toggle';
import { GlobalSearch } from './search/global-search';

const publicNav = [
  { href: '/', label: 'Home' },
  { href: '/property', label: 'Property' },
  { href: '/motors', label: 'Motors' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/classifieds', label: 'Classifieds' },
  { href: '/services', label: 'Services' },
  { href: '/directory', label: 'Directory' }
];

export function AppShell({
  children,
  showHeaderSearch = true
}: {
  children: ReactNode;
  showHeaderSearch?: boolean;
}) {
  return (
    <div className="gh-shell flex flex-col min-h-screen">
      <header className="gh-shell-header sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--background)]/80 backdrop-blur-lg">
        <div className="gh-container">
          <div className="flex h-16 items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <Link className="flex items-center gap-2 font-bold tracking-tight text-ink hover:opacity-80 transition-opacity" href="/">
                <span className="gh-brand-mark inline-flex h-7 w-7 items-center justify-center rounded bg-[var(--primary)] text-white text-sm shadow-sm">
                  G
                </span>
                <span className="text-[1.1rem] leading-none">
                  Gulf<span className="text-[var(--primary)]">Habibi</span>
                </span>
              </Link>
              <nav className="hidden items-center gap-6 text-[0.85rem] font-semibold text-[var(--text-secondary)] md:flex">
                {publicNav.filter(item => item.label !== 'Home').map((item) => (
                  <Link key={item.href} className="hover:text-ink transition-colors" href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-semibold">
              {showHeaderSearch && (
                <div className="hidden lg:block w-[300px] mr-2">
                  <GlobalSearch compact />
                </div>
              )}
              <Link className="hidden sm:inline-flex text-[var(--text-secondary)] hover:text-ink transition-colors" href="/login">
                Sign in
              </Link>
              <Link className="rounded-lg bg-[var(--primary)] px-4 py-2 text-white hover:opacity-90 transition-opacity shadow-sm" href="/listings/new">
                Post ad
              </Link>
            </div>
          </div>
          {showHeaderSearch && (
            <div className="pb-3 lg:hidden">
              <GlobalSearch compact />
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
