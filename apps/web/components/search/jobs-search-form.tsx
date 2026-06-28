'use client';

import { useState } from 'react';
import Link from 'next/link';

interface JobsSearchFormProps {
  actionHref: string;
  actionLabel: string;
}

export function JobsSearchForm({ actionHref, actionLabel }: JobsSearchFormProps) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-lg)] backdrop-blur-xl lg:flex-row lg:items-end">
        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Search</span>
          <input
            className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]"
            value={keyword}
            placeholder="Search jobs..."
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Location</span>
          <select className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]" value={location} onChange={(event) => setLocation(event.target.value)}>
            <option value="">All UAE</option>
            <option value="dubai">Dubai</option>
            <option value="abudhabi">Abu Dhabi</option>
            <option value="sharjah">Sharjah</option>
          </select>
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Category</span>
          <select className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Any category</option>
            <option value="cat1">Category 1</option>
            <option value="cat2">Category 2</option>
          </select>
        </label>

        <div className="flex items-end gap-2 lg:ml-2">
          <button
            type="button"
            className={`gh-button-secondary min-h-[50px] !rounded-[1.15rem] px-4 text-xs font-semibold transition ${showAdvanced ? 'border-[var(--primary)] bg-[var(--accent-soft)]' : ''}`}
            onClick={() => setShowAdvanced((current) => !current)}
          >
            Filters
          </button>
          <Link href={actionHref} className="gh-button-primary min-h-[50px] w-full items-center justify-center lg:w-auto">
            {actionLabel}
          </Link>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid gap-4 rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 lg:grid-cols-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Min Price (AED)</span>
            <input className="gh-field !rounded-[1.15rem]" inputMode="numeric" placeholder="No min" />
          </label>
          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Max Price (AED)</span>
            <input className="gh-field !rounded-[1.15rem]" inputMode="numeric" placeholder="No max" />
          </label>
          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Sort By</span>
            <select className="gh-field !rounded-[1.15rem]">
              <option value="recent">Most Recent</option>
              <option value="price_asc">Lowest Price</option>
              <option value="price_desc">Highest Price</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}