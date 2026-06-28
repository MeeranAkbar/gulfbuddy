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

export function HomepageHeroSearch() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [section, setSection] = useState<SearchSection>('all');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'keyword' | 'location' | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced filter states
  const [purpose, setPurpose] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [beds, setBeds] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedInput(null);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const sectionConfig = getSearchSectionConfig(section);
  const suggestions = useMemo(() => getSuggestionsForSection(section, keyword), [section, keyword]);
  const popularSearches = popularSearchesBySection[section];

  function submitSearch(nextKeyword = keyword, nextLocation = location, nextSection = section) {
    writeRecentSearch({
      keyword: nextKeyword.trim(),
      location: nextLocation.trim(),
      section: nextSection
    });

    setRecentSearches(readRecentSearches());
    setIsOpen(false);

    // Dynamic routing path with advanced query parameters
    let targetUrl = '';
    if (nextSection === 'property') {
      const params = new URLSearchParams();
      if (nextKeyword) params.set('keyword', nextKeyword);
      if (nextLocation) params.set('area', nextLocation);
      params.set('marketMode', 'long_term');
      if (purpose) params.set('purpose', purpose);
      if (propertyType) params.set('propertyType', propertyType);
      if (beds) params.set('bedrooms', beds);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      targetUrl = `/property/search?${params.toString()}`;
    } else {
      const params = new URLSearchParams();
      if (nextKeyword) params.set('keyword', nextKeyword);
      if (nextLocation) params.set('location', nextLocation);
      if (nextSection !== 'all') params.set('section', nextSection);

      if (nextSection === 'motors') {
        if (vehicleType) params.set('vehicleType', vehicleType);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (vehicleYear) params.set('year', vehicleYear);
      }

      if (nextSection === 'jobs') {
        if (employmentType) params.set('employmentType', employmentType);
        if (experienceLevel) params.set('experienceLevel', experienceLevel);
      }

      if (nextSection === 'services') {
        if (serviceCategory) params.set('category', serviceCategory);
      }

      targetUrl = `/search?${params.toString()}`;
    }

    router.push(targetUrl);
  }

  return (
    <div ref={rootRef} className="space-y-4">
      <div className="flex flex-wrap justify-center gap-3">
        {searchSections.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setSection(item.key);
              setIsOpen(false);
              setShowAdvanced(false); // Reset toggle on vertical shift
            }}
            className={`inline-flex min-w-[8rem] items-center justify-center rounded-full border px-4 py-3 text-sm font-semibold transition ${
              section === item.key
                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)]'
                : 'border-[var(--border-subtle)] bg-[var(--surface-alt)] text-[var(--text-primary)] hover:border-[var(--border-default)] hover:bg-[var(--surface)]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-lg)] md:p-4 backdrop-blur-xl">
        <div className={`grid gap-3 ${isOpen ? 'pb-3' : ''} lg:grid-cols-[1.55fr_0.85fr_auto]`}>
          <label className="space-y-2 text-left block relative">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Keyword</span>
            <input
              className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]"
              value={keyword}
              placeholder={sectionConfig.placeholder}
              onChange={(event) => setKeyword(event.target.value)}
              onFocus={() => { setIsOpen(true); setFocusedInput('keyword'); }}
            />
            {isOpen && focusedInput === 'keyword' && suggestions.length > 0 && (
              <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-2 shadow-[var(--shadow-lg)] backdrop-blur-md">
                <div className="space-y-1">
                  <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted">{sectionConfig.suggestionTitle}</p>
                  {suggestions.slice(0, 6).map(s => (
                    <button
                      key={s.id}
                      type="button"
                      className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-alt)] transition"
                      onClick={(e) => { e.preventDefault(); setKeyword(s.value); setFocusedInput(null); submitSearch(s.value, location, section); }}
                    >
                      <span className="font-medium text-[var(--text-primary)]">{s.label}</span>
                      {s.meta && <span className="ml-2 text-xs text-muted">· {s.meta}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </label>

          <label className="space-y-2 text-left block relative">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Location</span>
            <input
              className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]"
              value={location}
              placeholder="All UAE"
              onChange={(event) => setLocation(event.target.value)}
              onFocus={() => { setIsOpen(true); setFocusedInput('location'); }}
            />
            {isOpen && focusedInput === 'location' && (
              <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-2 shadow-[var(--shadow-lg)] backdrop-blur-md">
                <div className="space-y-1">
                  <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted">Select Emirate</p>
                  {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'].filter(e => e.toLowerCase().includes(location.toLowerCase())).map(emirate => (
                    <button
                      key={emirate}
                      type="button"
                      className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-alt)] font-medium text-[var(--text-primary)] transition"
                      onClick={(e) => { e.preventDefault(); setLocation(emirate); setFocusedInput(null); }}
                    >
                      {emirate}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </label>

          <div className="flex items-end gap-2">
            {section !== 'all' && (
              <button
                type="button"
                className={`gh-button-secondary !rounded-[1.15rem] min-h-[50px] px-4 font-semibold text-xs transition ${
                  showAdvanced ? 'bg-[var(--accent-soft)] border-[var(--primary)]' : ''
                }`}
                onClick={() => setShowAdvanced((prev) => !prev)}
              >
                {showAdvanced ? 'Filters' : 'Filters'}
              </button>
            )}
            <button type="button" className="gh-button-primary w-full lg:w-auto min-h-[50px]" onClick={() => submitSearch()}>
              Search
            </button>
          </div>
        </div>

        {/* Dynamic section-specific Advanced Filters Row */}
        {showAdvanced && section !== 'all' && (
          <div className="mt-3 border-t border-[var(--border-subtle)] pt-4 text-left grid gap-3 grid-cols-2 md:grid-cols-4 bg-[var(--surface-alt)] p-4 rounded-2xl transition-all duration-300">
            {section === 'property' && (
              <>
                <label className="block text-xs font-semibold text-slate-700">
                  Purpose
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  >
                    <option value="">Rent or Sale</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Property Type
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="">Any Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Bedrooms
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                  >
                    <option value="">Any Beds</option>
                    <option value="0">Studio</option>
                    <option value="1">1+ Beds</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                  </select>
                </label>
                <div className="block text-xs font-semibold text-slate-700">
                  Price Limit (AED)
                  <div className="flex gap-1 mt-1">
                    <input
                      className="w-1/2 rounded-xl border border-slate-200 px-2 py-1.5 text-xs bg-white"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      className="w-1/2 rounded-xl border border-slate-200 px-2 py-1.5 text-xs bg-white"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {section === 'motors' && (
              <>
                <label className="block text-xs font-semibold text-slate-700">
                  Vehicle Category
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="">Any Vehicle</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                    <option value="coupe">Coupe</option>
                    <option value="electric">Electric / Hybrid</option>
                    <option value="pickup">Pickup</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Year From
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                  >
                    <option value="">Any Year</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </label>
                <div className="block text-xs font-semibold text-slate-700 col-span-2">
                  Budget (AED)
                  <div className="flex gap-2 mt-1">
                    <input
                      className="w-1/2 rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                      placeholder="AED Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      className="w-1/2 rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                      placeholder="AED Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {section === 'jobs' && (
              <>
                <label className="block text-xs font-semibold text-slate-700">
                  Employment Style
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    <option value="">Any Style</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Experience Tier
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="">Any Level</option>
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="manager">Manager / Director</option>
                  </select>
                </label>
              </>
            )}

            {section === 'services' && (
              <>
                <label className="block text-xs font-semibold text-slate-700 col-span-2">
                  Service Category
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                  >
                    <option value="">Any Service</option>
                    <option value="AC Maintenance & Repair">AC Maintenance</option>
                    <option value="Home & Commercial Cleaning">Home Cleaning</option>
                    <option value="Moving & Storage">Moving & Storage</option>
                    <option value="Renovation & Fit-out">Fit-out & Renovation</option>
                    <option value="Plumbing & Electrical">Plumbing & Electrical</option>
                  </select>
                </label>
              </>
            )}
          </div>
        )}

        {isOpen ? (
          <div className="mt-3 border-t border-[var(--border-subtle)] pt-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                {keyword.trim() ? sectionConfig.suggestionTitle : 'Recent and popular'}
              </p>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-muted"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            {!keyword.trim() ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {popularSearches.slice(0, 4).map((item) => (
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
                ? suggestions.slice(0, 6).map((item) => (
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
                ? popularSearches.slice(4).map((item) => (
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
    </div>
  );
}
