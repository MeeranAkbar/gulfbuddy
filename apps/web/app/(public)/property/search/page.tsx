import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PropertySearchConsole,
  PropertySectionHeading,
  PropertyTrustPanel
} from '../../../../components/property/property-discovery';
import { AdBanner } from '../../../../components/ui/ad-banner';

import {
  buildPropertySearchChips,
  buildPropertySearchDescription,
  buildPropertySearchTitle,
  parsePropertySearchParams
} from '../../../../lib/search/property';
import { searchPropertyListings } from '../../../../lib/search/property-server';
import { getPropertyModeConfig } from '../../../../lib/property/public-content';

export const dynamic = 'force-dynamic';

interface PropertySearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function buildFactRow(label: string, value: string | null) {
  if (!value) return null;

  return (
    <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function formatBeds(value: number | null) {
  if (value === null) return null;
  if (value === 0) return 'Studio';
  return `${value} bed`;
}

function formatBaths(value: number | null) {
  if (value === null) return null;
  return `${value} bath`;
}

function formatSize(value: number) {
  if (!value) return null;
  return `${value.toLocaleString('en-US')} sqft`;
}

export async function generateMetadata({ searchParams }: PropertySearchPageProps): Promise<Metadata> {
  const params = parsePropertySearchParams(await searchParams);
  const results = await searchPropertyListings(params);

  return {
    title: `${buildPropertySearchTitle(params)} | GulfHabibi`,
    description: buildPropertySearchDescription(params, results.length)
  };
}

export default async function PropertySearchPage({ searchParams }: PropertySearchPageProps) {
  const params = parsePropertySearchParams(await searchParams);
  const results = await searchPropertyListings(params);
  const activeMode = getPropertyModeConfig(params.marketMode);

  if (!activeMode) {
    return null;
  }


  const chips = buildPropertySearchChips(params, results.length);
  const searchTitle = buildPropertySearchTitle(params);
  const description = buildPropertySearchDescription(params, results.length);

  return (
    <div className="space-y-6 pt-6">
      <PropertySearchConsole
        activeMode={activeMode}
        emirateLabel={params.emirate || undefined}
        emirateSlug={params.emirate || undefined}
        initialFilters={params}
        routeMode="search"
      />

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={`${chip.key}-${chip.value}`}
            className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-4 py-2 text-[0.8rem] font-medium text-[var(--text-secondary)]"
          >
            <span className="font-semibold text-ink">{chip.label}:</span> {chip.value}
          </span>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
        <section className="space-y-5">
          <PropertySectionHeading
            eyebrow="Ranked results"
            title={`${results.length} properties found`}
            description="Premium verified inventory."
          />

          {results.length ? (
            <div className="flex flex-col gap-4">
              {results.map((result, index) => (
                <div key={result.id}>
                  {index === 2 && (
                    <div className="mb-4 rounded-[1rem] bg-gradient-to-r from-red-600/10 to-transparent border border-red-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-ink">What's your property worth today?</h3>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Get an instant, data-driven property valuation report with MarketEstimate™.</p>
                      </div>
                      <button className="whitespace-nowrap rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 shadow-md">
                        Get your estimate &rarr;
                      </button>
                    </div>
                  )}
                  <article className="gh-card flex flex-col md:flex-row overflow-hidden hover:border-[var(--primary)] transition-colors bg-[var(--surface)]">
                    <div className="relative h-60 md:h-auto md:w-[320px] shrink-0 overflow-hidden">
                      {result.imageUrl && (
                        <>
                          <img src={result.imageUrl} alt={result.title} className="absolute inset-0 h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </>
                      )}
                      {!result.imageUrl && (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,169,55,0.18),transparent_42%),linear-gradient(135deg,var(--surface-alt),var(--surface))]" />
                      )}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {result.badges.slice(0, 2).map((badge) => (
                          <span
                            key={badge}
                            className="rounded-[0.25rem] bg-white px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.05em] text-black shadow-sm"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-bold text-[var(--primary)]">{result.priceLabel}</p>
                          <p className="mt-1 text-xs font-medium text-[var(--text-secondary)]">{result.propertyType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">Operator</p>
                          <p className="mt-0.5 text-xs font-bold text-ink bg-[var(--surface-alt)] px-1.5 py-0.5 rounded">{result.sellerType}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
                        {formatBeds(result.bedrooms) && <span className="flex items-center gap-1.5">🛏️ {formatBeds(result.bedrooms)}</span>}
                        {formatBaths(result.bathrooms) && <span className="flex items-center gap-1.5">🚿 {formatBaths(result.bathrooms)}</span>}
                        {formatSize(result.sizeSqft) && <span className="flex items-center gap-1.5">📐 {formatSize(result.sizeSqft)}</span>}
                      </div>

                      <h2 className="mt-3 text-base font-semibold tracking-tight text-ink line-clamp-1">{result.title}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] truncate">
                        <span className="text-muted shrink-0">📍</span> {result.emirateLabel} / {result.area}
                      </p>

                      <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[var(--surface-alt)] flex items-center justify-center text-[0.6rem] font-bold">{result.sellerName.charAt(0)}</div>
                          <p className="text-[0.7rem] font-semibold text-[var(--text-secondary)] truncate max-w-[120px]">{result.sellerName}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button className="rounded bg-[var(--surface-alt)] px-3 py-1.5 text-[0.7rem] font-semibold text-ink transition hover:bg-[var(--border-subtle)]">Email</button>
                          <button className="rounded border border-[var(--primary)] bg-transparent px-3 py-1.5 text-[0.7rem] font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white">Call</button>
                          <button className="rounded bg-[#25D366] px-3 py-1.5 text-[0.7rem] font-semibold text-white transition hover:bg-[#1EBE5A]">WhatsApp</button>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>




          ) : (
            <div className="gh-card p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">No results yet</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">This filter mix is too narrow for the current preview inventory.</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                Try widening the area, switching emirate, or removing one filter. The final version of this route will also recommend nearby communities and alert-ready saved searches.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <PropertyTrustPanel
            title="Search with confidence."
            description="Every listing is strictly verified against official DLD records to eliminate fake inventory."
            signals={[
              'Permit-Verified Inventory',
              'Registered Agents Only',
              'Direct Agency Connection'
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
