import Link from 'next/link';
import type { PropertyMarketMode } from '@gulfbuddy/types';
import { PropertySearchForm } from '../search/property-search-form';
import { buildPropertySearchHref, type PropertySearchParams } from '../../lib/search/property';
import {
  buildEmirateShowcaseItemsClean,
  getPropertyModeConfig,
  propertyEmirateSpotlights,
  propertyModeOrder,
  type PropertyAreaHighlight,
  type PropertyModeConfig,
  type PropertyOperatorHighlight,
  type PropertyShowcaseItem
} from '../../lib/property/public-content';

export function PropertySectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel
}: {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-[2rem]">{title}</h2>
        <p className="text-sm leading-7 text-[var(--text-secondary)] md:text-base">{description}</p>
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="gh-button-secondary self-start">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function PropertySearchConsole({
  activeMode,
  emirateLabel,
  emirateSlug,
  initialFilters,
  routeMode = 'page'
}: {
  activeMode: PropertyModeConfig;
  emirateLabel?: string;
  emirateSlug?: string;
  initialFilters?: Partial<PropertySearchParams>;
  routeMode?: 'page' | 'search';
}) {
  function buildTabHref(marketMode: PropertyMarketMode) {
    if (routeMode === 'search') {
      return buildPropertySearchHref({
        ...initialFilters,
        marketMode,
        emirate: emirateSlug ?? initialFilters?.emirate ?? ''
      });
    }

    if (emirateSlug) {
      return `/property/${marketMode}/${emirateSlug}`;
    }

    return `/property/${marketMode}`;
  }

  return (
    <section className="gh-card p-5 md:p-6">
      <div className="flex flex-wrap gap-2">
        {propertyModeOrder.map((marketMode) => {
          const mode = getPropertyModeConfig(marketMode);

          if (!mode) {
            return null;
          }

          const isActive = mode.marketMode === activeMode.marketMode;

          return (
            <Link
              key={mode.marketMode}
              href={buildTabHref(mode.marketMode)}
              className={
                isActive
                  ? 'rounded-full border border-[var(--primary)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-ink shadow-[var(--shadow-sm)]'
                  : 'rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-default)] hover:text-ink'
              }
            >
              {mode.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-5">
        <PropertySearchForm
          marketMode={activeMode.marketMode}
          submitLabel={activeMode.searchActionLabel}
          initialValues={{
            marketMode: activeMode.marketMode,
            emirate: emirateSlug,
            ...initialFilters
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {activeMode.quickFilters.map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
          >
            {filter}
          </span>
        ))}
      </div>
    </section>
  );
}

export function PropertyModeOverviewGrid({ modes }: { modes: PropertyModeConfig[] }) {
  const modeImages: Record<string, string> = {
    long_term: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    short_stay: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    off_plan: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    new_projects: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {modes.map((mode) => (
        <article key={mode.marketMode} className="group relative flex h-[450px] flex-col justify-between overflow-hidden rounded-[2rem] p-6 shadow-lg transition-transform hover:-translate-y-1">
          <img 
            src={modeImages[mode.marketMode] || modeImages.long_term} 
            alt={mode.title} 
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 mix-blend-multiply opacity-90 transition-opacity group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1624]/90 via-[#0d1624]/30 to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                {mode.label}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{mode.eyebrow}</span>
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <h3 className="text-2xl font-bold tracking-tight text-white">{mode.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/80">{mode.description}</p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {mode.trustSignals.slice(0, 3).map((signal) => (
                <span key={signal} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
                  {signal}
                </span>
              ))}
            </div>
            
            <div className="mt-6">
              <Link href={`/property/${mode.marketMode}`} className="inline-flex rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)]">
                Explore {mode.label} &rarr;
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PropertyTrustPanel({
  title,
  description,
  signals
}: {
  title: string;
  description: string;
  signals: string[];
}) {
  return (
    <aside className="gh-card p-6 md:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Trust layer</p>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
      <div className="mt-6 space-y-3">
        {signals.map((signal) => (
          <div key={signal} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-4 py-4 text-sm font-medium text-ink">
            {signal}
          </div>
        ))}
      </div>
    </aside>
  );
}

export function PropertyEmirateGrid({ marketMode }: { marketMode: PropertyModeConfig['marketMode'] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {propertyEmirateSpotlights.map((emirate) => (
        <Link
          key={emirate.slug}
          href={`/property/${marketMode}/${emirate.slug}`}
          className="gh-card group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{emirate.label}</span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{emirate.headline}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{emirate.summary}</p>
          </div>
          <span className="mt-6 text-sm font-semibold text-ink transition group-hover:text-[var(--primary)]">Open local lane</span>
        </Link>
      ))}
    </div>
  );
}

export function PropertyCommunityGrid({
  communities,
  actionHref,
  actionLabel
}: {
  communities: PropertyAreaHighlight[];
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {communities.map((community) => (
        <article key={community.name} className="gh-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{community.focus}</p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{community.name}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{community.detail}</p>
          {actionHref && actionLabel ? (
            <Link href={actionHref} className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
              {actionLabel}
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function PropertyShowcaseGrid({
  items,
  marketMode,
  emirateLabel
}: {
  items: PropertyShowcaseItem[];
  marketMode: PropertyModeConfig['marketMode'];
  emirateLabel?: string;
}) {
  const showcaseItems = emirateLabel ? buildEmirateShowcaseItemsClean(marketMode, emirateLabel) : items;

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {showcaseItems.map((item) => (
        <article key={`${item.title}-${item.meta}`} className="gh-card overflow-hidden">
          <div className="relative min-h-[15rem] overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.10),rgba(7,12,24,0.55))]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(7,12,24,0.55))]" />
            <div className="relative p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                {item.badge}
              </span>
              <span className="text-xs font-medium text-white/82">{item.meta}</span>
            </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{item.subtitle}</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.highlight}</p>
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">Starting point</p>
                <p className="mt-2 text-xl font-semibold text-ink">{item.price}</p>
              </div>
              <Link
                href={`/property/listing/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                className="gh-button-secondary"
              >
                View listing
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PropertyOperatorGrid({ items }: { items: PropertyOperatorHighlight[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
      {items.map((item) => (
        <article key={item.title} className="gh-card p-5">
          <span className="gh-pill">{item.badge}</span>
          <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function PropertyHeroAside({
  metrics,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  metrics: { label: string; value: string }[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="gh-surface-alt rounded-[1.75rem] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Market confidence</p>
      <div className="mt-5 grid gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{metric.label}</p>
            <p className="mt-2 text-sm font-semibold text-ink">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={primaryHref} className="gh-button-primary">
          {primaryLabel}
        </Link>
        <Link href={secondaryHref} className="gh-button-secondary">
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
