'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export function LoginForm({ nextPath = '/dashboard' }: { initialError?: string | null; nextPath?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      router.push(nextPath);
    }, 800);
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">
            Email address
          </label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon className="h-5 w-5 text-white/40" aria-hidden="true" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-xl border-0 bg-[var(--surface)] py-3.5 pl-10 pr-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">
            Password
          </label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon className="h-5 w-5 text-white/40" aria-hidden="true" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-xl border-0 bg-[var(--surface)] py-3.5 pl-10 pr-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-white/10 bg-[var(--surface)] text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-[var(--text-secondary)]">
              Remember me
            </label>
          </div>

          <div className="text-sm leading-6">
            <a href="#" className="font-semibold text-brand-primary hover:text-brand-primary/80">
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-xl bg-brand-primary px-3 py-3.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-[var(--text-secondary)]">
        Not a member?{' '}
        <Link href="/register" className="font-semibold leading-6 text-brand-primary hover:text-brand-primary/80">
          Create a free account
        </Link>
      </p>
    </div>
  );
}
