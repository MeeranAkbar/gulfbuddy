import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PropertySearchConsole,
  PropertySectionHeading,
  PropertyTrustPanel
} from '../../../../components/property/property-discovery';
import { AdBanner } from '../../../../components/ui/ad-banner';
import { SectionPage } from '../../../../components/section-page';
import {
  buildPropertySearchChips,
  buildPropertySearchDescription,
  buildPropertySearchTitle,
  parsePropertySearchParams
} from '../../../../lib/search/property';
import { searchPropertyListings } from '../../../../lib/search/property-server';
import { getPropertyModeConfig } from '../../../../lib/property/public-content';

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

  const results = searchPropertyListings(params);
  const chips = buildPropertySearchChips(params, results.length);
  const searchTitle = buildPropertySearchTitle(params);
  const description = buildPropertySearchDescription(params, results.length);

  return (
    <SectionPage
      eyebrow="Property Search"
      title={searchTitle}
      description={description}
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Search guide</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Best use</p>
              <p className="mt-2 text-sm font-semibold text-ink">Start broad, then narrow by area, type, and budget</p>
            </div>
            <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Current mode</p>
              <p className="mt-2 text-sm font-semibold text-ink">{activeMode.label}</p>
            </div>
            <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Trust cues</p>
              <p className="mt-2 text-sm font-semibold text-ink">Verified operators and permit-backed context stay visible</p>
            </div>
          </div>
        </div>
      }
    >
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
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
          >
            <span className="font-semibold text-ink">{chip.label}:</span> {chip.value}
          </span>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5">
          <PropertySectionHeading
            eyebrow="Ranked results"
            title={`${results.length} property previews in the current lane`}
            description="This route is built to become the real property search surface: filters are query-driven, ranking is section-aware, and the cards are shaped for trust and local scanning."
          />

          <AdBanner className="mb-4" type="leaderboard" />

          {results.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {results.map((result) => (
                <article key={result.id} className="gh-card overflow-hidden">
                  <div className="relative min-h-[14rem] overflow-hidden p-5">
                    {result.imageUrl && (
                      <>
                        <img src={result.imageUrl} alt={result.title} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.2),rgba(7,12,24,0.85))]" />
                      </>
                    )}
                    {!result.imageUrl && (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,169,55,0.18),transparent_42%),linear-gradient(135deg,var(--surface-alt),var(--surface))]" />
                    )}
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        {result.badges.slice(0, 3).map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/90"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="mt-8 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                            {result.emirateLabel} / {result.area}
                          </p>
                          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{result.priceLabel}</p>
                        </div>
                        <div className="rounded-[1.1rem] border border-white/20 bg-black/40 backdrop-blur-md px-3 py-3 text-right">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">Operator</p>
                          <p className="mt-1 text-sm font-semibold text-white">{result.sellerType}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{result.propertyType}</p>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">{result.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{result.summary}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {buildFactRow('Bedrooms', formatBeds(result.bedrooms))}
                      {buildFactRow('Bathrooms', formatBaths(result.bathrooms))}
                      {buildFactRow('Size', formatSize(result.sizeSqft))}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Seller</p>
                        <p className="mt-2 text-sm font-semibold text-ink">{result.sellerName}</p>
                      </div>
                      <Link href={result.routeHref} className="gh-button-secondary">
                        Open property
                      </Link>
                    </div>
                  </div>
                </article>
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
            title="Property search should never feel like a random filter wall."
            description="The search layer is meant to move users from broad local intent into cleaner, trust-aware result sets without letting promoted placement destroy relevance."
            signals={[
              'Mode-aware search lanes for long-term, short-stay, off-plan, and projects',
              'Verified and permit-backed context held inside the ranking posture',
              'Result cards shaped for local scanning, trust, and quick operator understanding',
              'SEO-safe public route design instead of indexing junk filter combinations'
            ]}
          />

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Search tips</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Use emirate plus area for the cleanest results, especially in markets like Dubai Marina, Business Bay, or Yas Island.</p>
              <p>If nothing matches, widen the budget or remove one filter first before changing the whole search.</p>
            </div>
          </section>
        </aside>
      </div>
    </SectionPage>
  );
}
