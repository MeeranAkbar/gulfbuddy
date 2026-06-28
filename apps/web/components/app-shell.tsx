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
    <div className="gh-shell">
      <header className="gh-shell-header">
        <div className="gh-container flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between gap-6">
            <Link className="flex items-center gap-3 font-semibold tracking-tight text-ink" href="/">
              <span className="gh-brand-mark inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-white font-bold shadow-md">
                G
              </span>
              <span>
                <span className="block text-[1.2rem] font-bold leading-none">
                  Gulf<span className="text-[var(--accent)]">Habibi</span>
                </span>
                <span className="mt-1 block text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted">UAE Marketplace</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-5 text-sm md:flex">
              {publicNav.map((item) => (
                <Link key={item.href} className="gh-nav-link" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 text-sm">
              <ThemeToggle />
              <Link className="gh-button-ghost hidden sm:inline-flex" href="/login">
                Sign in
              </Link>
              <Link className="gh-button-secondary hidden lg:inline-flex" href="/pricing">
                Pricing
              </Link>
              <Link className="gh-button-primary" href="/listings/new">
                Post listing
              </Link>
            </div>
          </div>
          {showHeaderSearch ? <GlobalSearch compact /> : null}
        </div>
      </header>
      <main className="gh-container gh-main">{children}</main>
    </div>
  );
}
