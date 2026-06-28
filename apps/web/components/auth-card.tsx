import { ReactNode } from 'react';
import Link from 'next/link';

export function AuthCard({
  eyebrow,
  title,
  copy,
  children
}: {
  eyebrow?: string;
  title: string;
  copy: string;
  highlights?: string[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-sm lg:w-96 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Mobile-only logo */}
      <div className="lg:hidden mb-8">
        <Link href="/" className="inline-block">
          <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">GulfBuddy</span>
        </Link>
      </div>

      <div>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-primary">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-2xl font-bold leading-9 tracking-tight text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          {copy}
        </p>
      </div>

      <div className="mt-10">
        {children}
      </div>
    </div>
  );
}
