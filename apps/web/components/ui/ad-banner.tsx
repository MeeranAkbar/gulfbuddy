'use client';

import { useAuth } from '../../lib/auth';

interface AdBannerProps {
  className?: string;
  type?: 'leaderboard' | 'rectangle';
}

export function AdBanner({ className = '', type = 'leaderboard' }: AdBannerProps) {
  const { user, isLoading } = useAuth();

  // Hide ads if loading, or if the user is logged in and NOT on the FREE plan
  if (isLoading) return null;
  if (user && user.plan !== 'FREE') return null;

  return (
    <div className={`w-full flex justify-center py-4 ${className}`}>
      <div 
        className={`bg-[var(--surface-alt)] border border-[var(--border-subtle)] flex items-center justify-center rounded-lg overflow-hidden relative shadow-sm ${
          type === 'leaderboard' ? 'w-full max-w-4xl h-24' : 'w-full max-w-sm h-64'
        }`}
      >
        <div className="absolute top-1 right-2 text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wider">
          Advertisement
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--text-secondary)]">Ad Space Available</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Upgrade to Premium to remove ads</p>
        </div>
      </div>
    </div>
  );
}
