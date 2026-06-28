'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  buildSearchHref,
  getSearchSectionConfig,
  getSuggestionsForSection,
  popularSearchesBySection,
  searchSections,
  type SearchSection
} from '../../lib/search/catalog';

const RECENT_SEARCHES_KEY = 'gh_recent_searches_v1';

interface RecentSearchItem {
  keyword: string;
  location: string;
  section: SearchSection;
}

function isMeaningfulRecentSearch(search: RecentSearchItem) {
  return Boolean(search.keyword.trim() || search.location.trim());
}

function readRecentSearches(): RecentSearchItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentSearchItem[];
    return Array.isArray(parsed) ? parsed.filter(isMeaningfulRecentSearch) : [];
  } catch {
    return [];
  }
}

function writeRecentSearch(search: RecentSearchItem) {
  if (typeof window === 'undefined') return;
  if (!isMeaningfulRecentSearch(search)) return;

  const current = readRecentSearches().filter(
    (item) => !(item.keyword === search.keyword && item.location === search.location && item.section === search.section)
  );
  const next = [search, ...current].slice(0, 6);
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

export function GlobalSearch({
  initialSection = 'all',
  compact = false,
  variant = 'default'
}: {
  initialSection?: SearchSection;
  compact?: boolean;
  variant?: 'default' | 'hero';
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [section, setSection] = useState<SearchSection>(initialSection);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const sectionConfig = getSearchSectionConfig(section);
  const suggestions = useMemo(() => getSuggestionsForSection(section, keyword), [section, keyword]);
  const emptySuggestions = popularSearchesBySection[section];
  const isHero = variant === 'hero';

  function submitSearch(nextKeyword = keyword, nextLocation = location, nextSection = section) {
    writeRecentSearch({
      keyword: nextKeyword.trim(),
      location: nextLocation.trim(),
      section: nextSection
    });

    setRecentSearches(readRecentSearches());
    setShowPanel(false);
    router.push(buildSearchHref(nextSection, nextKeyword, nextLocation));
  }

  return (
    <div ref={rootRef} className={`relative ${compact ? '' : 'space-y-4'}`}>
      <div
        className={
          isHero
            ? 'space-y-4'
            : `gh-card ${compact ? 'p-4' : 'p-5 md:p-6'}`
        }
      >
        {isHero ? (
          <>
            <div className="flex flex-wrap justify-center gap-3">
              {searchSections.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setSection(item.key);
                    setShowPanel(false);
                  }}
                  className={`inline-flex min-w-[8rem] items-center justify-center rounded-full border px-4 py-3 text-sm font-semibold transition ${
                    section === item.key
                      ? 'border-[#111827] bg-[#111827] text-white shadow-[var(--shadow-sm)]'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-alt)] text-ink hover:border-[var(--border-default)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div
                className={`rounded-[1.55rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[0_20px_48px_rgba(15,23,42,0.12)] transition md:p-4 ${
                  showPanel ? 'rounded-b-[1rem]' : ''
                }`}
              >
                <div className="grid gap-3 lg:grid-cols-[1.55fr_0.85fr_auto]">
                  <label className="space-y-2">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Keyword</span>
                    <input
                      className="gh-field !rounded-[1.15rem] !border-[rgba(20,32,51,0.08)] !bg-[var(--background-elevated)]"
                      value={keyword}
                      placeholder={sectionConfig.placeholder}
                      onChange={(event) => setKeyword(event.target.value)}
                      onFocus={() => setShowPanel(true)}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Location</span>
                    <input
                      className="gh-field !rounded-[1.15rem] !border-[rgba(20,32,51,0.08)] !bg-[var(--background-elevated)]"
                      value={location}
                      placeholder="All UAE"
                      onChange={(event) => setLocation(event.target.value)}
                      onFocus={() => setShowPanel(true)}
                    />
                  </label>

                  <div className="flex items-end">
                    <button type="button" className="gh-button-primary w-full lg:w-auto" onClick={() => submitSearch()}>
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {showPanel ? (
                <div className="absolute left-0 right-0 top-full z-40 -mt-px rounded-b-[1.35rem] border border-[var(--border-subtle)] border-t-0 bg-[var(--surface)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.16)] md:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                      {keyword.trim() ? sectionConfig.suggestionTitle : 'Recent and popular'}
                    </p>
                    <button
                      type="button"
                      className="text-xs font-semibold uppercase tracking-[0.18em] text-muted"
                      onClick={() => setShowPanel(false)}
                    >
                      Close
                    </button>
                  </div>

                  {!keyword.trim() ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {emptySuggestions.slice(0, 4).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => submitSearch(item, location, section)}
                          className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-default)] hover:bg-[var(--surface-muted)]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 grid gap-3">
                    {keyword.trim()
                      ? suggestions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => submitSearch(item.value, location, section === 'all' ? item.section : section)}
                            className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-4 py-3 text-left transition hover:border-[var(--border-default)] hover:bg-[var(--surface-alt)]"
                          >
                            <p className="text-sm font-semibold text-ink">{item.label}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                              {item.section} / {item.type}
                              {item.meta ? ` / ${item.meta}` : ''}
                            </p>
                          </button>
                        ))
                      : recentSearches.map((item, index) => (
                          <button
                            key={`${item.section}-${item.keyword}-${index}`}
                            type="button"
                            onClick={() => submitSearch(item.keyword, item.location, item.section)}
                            className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-4 py-3 text-left transition hover:border-[var(--border-default)] hover:bg-[var(--surface-alt)]"
                          >
                            <p className="text-sm font-semibold text-ink">{item.keyword || item.location}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                              {item.section}
                              {item.location ? ` / ${item.location}` : ''}
                            </p>
                          </button>
                        ))}

                    {!keyword.trim() && !recentSearches.length
                      ? emptySuggestions.slice(4).map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => submitSearch(item, location, section)}
                            className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-4 py-3 text-left text-sm font-semibold text-ink transition hover:border-[var(--border-default)] hover:bg-[var(--surface-alt)]"
                          >
                            {item}
                          </button>
                        ))
                      : null}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className={`grid gap-3 ${compact ? 'lg:grid-cols-[0.9fr_1.3fr_1fr_auto]' : 'lg:grid-cols-[0.9fr_1.5fr_1fr_auto]'}`}>
            <label className="space-y-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Section</span>
              <select
                className="gh-field"
                value={section}
                onChange={(event) => setSection(event.target.value as SearchSection)}
                onFocus={() => setShowPanel(true)}
              >
                {searchSections.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Keyword</span>
              <input
                className="gh-field"
                value={keyword}
                placeholder={sectionConfig.placeholder}
                onChange={(event) => setKeyword(event.target.value)}
                onFocus={() => setShowPanel(true)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Location</span>
              <input
                className="gh-field"
                value={location}
                placeholder="Emirate, area, or district"
                onChange={(event) => setLocation(event.target.value)}
                onFocus={() => setShowPanel(true)}
              />
            </label>

            <div className="flex items-end">
              <button type="button" className="gh-button-primary w-full lg:w-auto" onClick={() => submitSearch()}>
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {!isHero && showPanel ? (
        <div className={`gh-card absolute left-0 right-0 top-full z-40 mt-3 ${isHero ? 'p-3 md:p-4' : 'p-4 md:p-5'}`}>
          <div className={`grid gap-4 ${isHero ? '' : 'lg:grid-cols-[1.2fr_1fr]'}`}>
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  {keyword.trim() ? sectionConfig.suggestionTitle : 'Recent and popular'}
                </p>
                <button type="button" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted" onClick={() => setShowPanel(false)}>
                  Close
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {(keyword.trim() ? suggestions : []).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => submitSearch(item.value, location, section === 'all' ? item.section : section)}
                    className={`gh-surface-alt flex items-center justify-between gap-3 text-left ${isHero ? 'rounded-[1rem] px-3 py-3' : 'rounded-[1.15rem] px-4 py-4'}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                        {item.section} / {item.type}
                        {item.meta ? ` / ${item.meta}` : ''}
                      </p>
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">Open</span>
                  </button>
                ))}

                {!keyword.trim() && recentSearches.map((item, index) => (
                  <button
                    key={`${item.section}-${item.keyword}-${index}`}
                    type="button"
                    onClick={() => submitSearch(item.keyword, item.location, item.section)}
                    className={`gh-surface-alt flex items-center justify-between gap-3 text-left ${isHero ? 'rounded-[1rem] px-3 py-3' : 'rounded-[1.15rem] px-4 py-4'}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.keyword || item.location}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                        {item.section}
                        {item.location ? ` / ${item.location}` : ''}
                      </p>
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">Recent</span>
                  </button>
                ))}

                {!keyword.trim() && !recentSearches.length && emptySuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => submitSearch(item, location, section)}
                    className={`gh-surface-alt text-left text-sm font-semibold text-ink ${isHero ? 'rounded-[1rem] px-3 py-3' : 'rounded-[1.15rem] px-4 py-4'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {isHero ? null : (
              <div className="gh-surface-alt rounded-[1.35rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Section posture</p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{sectionConfig.label}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{sectionConfig.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {emptySuggestions.slice(0, 4).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => submitSearch(item, location, section)}
                      className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
