'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PropertyMarketMode } from '@gulfbuddy/types';
import {
  buildPropertySearchHref,
  getPropertyAreaOptions,
  parsePropertySearchParams,
  propertyBathroomOptions,
  propertyBedroomOptions,
  propertyCompletionStatusOptions,
  propertyEmirateOptions,
  propertyFurnishingOptions,
  propertySortOptions,
  propertyTypeOptions,
  type PropertySearchParams
} from '../../lib/search/property';

import {
  PROPERTY_AMENITIES,
  RENT_FREQUENCIES,
  LISTED_BY
} from '../../lib/property/constants';

interface PropertySearchFormProps {
  initialValues?: Partial<PropertySearchParams>;
  marketMode: PropertyMarketMode;
  submitLabel?: string;
}

export function PropertySearchForm({
  initialValues,
  marketMode,
  submitLabel = 'Search property'
}: PropertySearchFormProps) {
  const router = useRouter();
  const initial = parsePropertySearchParams({
    marketMode,
    ...initialValues
  });

  const [keyword, setKeyword] = useState(initial.keyword);
  const [emirate, setEmirate] = useState(initial.emirate);
  const [area, setArea] = useState(initial.area);
  const [propertyType, setPropertyType] = useState(initial.propertyType);
  const [bedrooms, setBedrooms] = useState(initial.bedrooms !== null ? String(initial.bedrooms) : '');
  const [bathrooms, setBathrooms] = useState(initial.bathrooms !== null ? String(initial.bathrooms) : '');
  const [minPrice, setMinPrice] = useState(initial.minPrice !== null ? String(initial.minPrice) : '');
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice !== null ? String(initial.maxPrice) : '');
  const [furnishing, setFurnishing] = useState(initial.furnishing);
  const [completionStatus, setCompletionStatus] = useState(initial.completionStatus);
  const [verifiedOnly, setVerifiedOnly] = useState(initial.verifiedOnly);
  const [sort, setSort] = useState(initial.sort);
  const [rentFrequency, setRentFrequency] = useState('');
  const [listedBy, setListedBy] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [hasVideo, setHasVideo] = useState(false);
  const [has360Tour, setHas360Tour] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(initial.bathrooms || initial.furnishing || initial.completionStatus || initial.verifiedOnly || initial.sort !== 'relevance')
  );

  const areaOptions = useMemo(() => getPropertyAreaOptions(emirate), [emirate]);

  function submitForm() {
    router.push(
      buildPropertySearchHref({
        marketMode,
        keyword: keyword.trim(),
        emirate,
        area: area.trim(),
        propertyType,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        furnishing,
        completionStatus,
        verifiedOnly,
        sort
      })
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-lg)] backdrop-blur-xl lg:flex-row lg:items-end">
        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Keyword</span>
          <input
            className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]"
            value={keyword}
            placeholder="Community, tower, project, keyword"
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Emirate</span>
          <select className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]" value={emirate} onChange={(event) => setEmirate(event.target.value)}>
            <option value="">All emirates</option>
            {propertyEmirateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Type</span>
          <select className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
            <option value="">Any type</option>
            {propertyTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
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
          <button type="button" className="gh-button-primary min-h-[50px] w-full lg:w-auto" onClick={submitForm}>
            {submitLabel}
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-4 grid gap-4 rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 lg:grid-cols-4 animate-in slide-in-from-top-2 fade-in duration-200">
          
          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Area</span>
            <input
              className="gh-field !rounded-[1.15rem]"
              list={`property-area-options-${marketMode}`}
              value={area}
              placeholder="Area, district, or building"
              onChange={(event) => setArea(event.target.value)}
            />
            <datalist id={`property-area-options-${marketMode}`}>
              {areaOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Bedrooms</span>
            <select className="gh-field !rounded-[1.15rem]" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
              <option value="">Any</option>
              {propertyBedroomOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Bathrooms</span>
            <select className="gh-field !rounded-[1.15rem]" value={bathrooms} onChange={(event) => setBathrooms(event.target.value)}>
              <option value="">Any</option>
              {propertyBathroomOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Furnishing</span>
            <select className="gh-field !rounded-[1.15rem]" value={furnishing} onChange={(event) => setFurnishing(event.target.value)}>
              <option value="">Any furnishing</option>
              {propertyFurnishingOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Min Price (AED)</span>
            <input
              className="gh-field !rounded-[1.15rem]"
              inputMode="numeric"
              value={minPrice}
              placeholder="No min"
              onChange={(event) => setMinPrice(event.target.value.replace(/[^\d]/g, ''))}
            />
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Max Price (AED)</span>
            <input
              className="gh-field !rounded-[1.15rem]"
              inputMode="numeric"
              value={maxPrice}
              placeholder="No max"
              onChange={(event) => setMaxPrice(event.target.value.replace(/[^\d]/g, ''))}
            />
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Completion</span>
            <select className="gh-field !rounded-[1.15rem]" value={completionStatus} onChange={(event) => setCompletionStatus(event.target.value)}>
              <option value="">Any status</option>
              {propertyCompletionStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          {(marketMode === 'long_term' || marketMode === 'short_term') && (
            <label className="space-y-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Rent Frequency</span>
              <select className="gh-field !rounded-[1.15rem]" value={rentFrequency} onChange={(event) => setRentFrequency(event.target.value)}>
                <option value="">Any</option>
                {RENT_FREQUENCIES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          )}

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Listed By</span>
            <select className="gh-field !rounded-[1.15rem]" value={listedBy} onChange={(event) => setListedBy(event.target.value)}>
              <option value="">Anyone</option>
              {LISTED_BY.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Media</span>
            <div className="flex flex-col gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[var(--primary)]" checked={hasVideo} onChange={e => setHasVideo(e.target.checked)} />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Ads with Video</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[var(--primary)]" checked={has360Tour} onChange={e => setHas360Tour(e.target.checked)} />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Ads with 360 Tour</span>
              </label>
            </div>
          </label>

          <div className="lg:col-span-4 mt-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted mb-4 block">Amenities</span>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {PROPERTY_AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-[var(--primary)]" 
                    checked={amenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) setAmenities([...amenities, amenity]);
                      else setAmenities(amenities.filter(a => a !== amenity));
                    }}
                  />
                  <span className="text-xs font-medium text-[var(--text-secondary)] truncate">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 lg:col-span-4 mt-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[var(--primary)]"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
            />
            <span className="text-sm font-medium text-[var(--text-primary)]">Only show verified listings with permits</span>
          </label>
          
        </div>
      )}
    </div>
  );
}
