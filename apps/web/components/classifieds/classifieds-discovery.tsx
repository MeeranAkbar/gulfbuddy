import Link from 'next/link';
import { ClassifiedsSearchForm } from '../search/classifieds-search-form';
import type {
  ClassifiedsCategory,
  ClassifiedsEmirateSpotlight,
  ClassifiedsHighlight,
  ClassifiedsListingSpotlight,
  ClassifiedsMarketHighlight,
  ClassifiedsMetric,
  ClassifiedsSearchField
} from '../../lib/classifieds/public-content';

export function ClassifiedsHeroAside({
  metrics,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  metrics: ClassifiedsMetric[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="gh-surface-alt rounded-[1.75rem] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Resale posture</p>
      <div className="mt-5 grid gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[1.15rem] border border-white/20 bg-black/40 backdrop-blur-md p-4">
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


export function ClassifiedsSearchConsole({
  filters,
  actionHref,
  actionLabel
}: {
  fields?: any[];
  filters: string[];
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section className="gh-card p-5 md:p-6">
      <ClassifiedsSearchForm actionHref={actionHref} actionLabel={actionLabel} />
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
          >
            {filter}
          </span>
        ))}
      </div>
    </section>
  );
}

export function ClassifiedsSectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-[2rem]">{title}</h2>
      <p className="text-sm leading-7 text-[var(--text-secondary)] md:text-base">{description}</p>
    </div>
  );
}

export function ClassifiedsCategoryGrid({ items, emirateSlug }: { items: ClassifiedsCategory[]; emirateSlug?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={emirateSlug ? `/classifieds/${emirateSlug}/${item.slug}` : `/classifieds/dubai/${item.slug}`}
          className="gh-card group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.focus}</p>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.detail}</p>
          </div>
          <span className="mt-6 text-sm font-semibold text-ink transition group-hover:text-[var(--primary)]">Open category lane</span>
        </Link>
      ))}
    </div>
  );
}

export function ClassifiedsListingGrid({ items }: { items: ClassifiedsListingSpotlight[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.slug} className="gh-card flex h-full flex-col overflow-hidden">
          <div className="relative min-h-[16rem] overflow-hidden p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="gh-pill">{item.categoryLabel}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{item.condition}</span>
            </div>
            <div className="mt-10 grid grid-cols-[1.2fr_0.8fr] gap-3">
              <div className="h-28 rounded-[1.25rem] border border-white/40 bg-white/55 shadow-[var(--shadow-sm)] dark:border-white/10 dark:bg-white/5" />
              <div className="space-y-3">
                <div className="h-12 rounded-[1rem] border border-white/35 bg-white/45 dark:border-white/10 dark:bg-white/5" />
                <div className="h-12 rounded-[1rem] border border-white/35 bg-white/40 dark:border-white/10 dark:bg-white/5" />
                <div className="h-8 rounded-[0.9rem] border border-white/35 bg-white/35 dark:border-white/10 dark:bg-white/5" />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex flex-wrap gap-2">
              {item.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {item.emirateLabel} · {item.area}
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="text-2xl font-semibold tracking-tight text-ink">{item.price}</p>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">{item.summary}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.quickFacts.map((fact) => (
                <span
                  key={fact}
                  className="rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
                >
                  {fact}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Seller', item.sellerType],
                ['Area', item.area]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 text-sm font-medium text-ink">{value}</p>
                </div>
              ))}
            </div>
            <Link
              href={`/classifieds/${item.emirateSlug}/${item.categorySlug}/${item.slug}`}
              className="mt-6 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]"
            >
              Open listing
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ClassifiedsTrustPanel({
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

export function ClassifiedsEmirateGrid({ items, categorySlug }: { items: ClassifiedsEmirateSpotlight[]; categorySlug?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={categorySlug ? `/classifieds/${item.slug}/${categorySlug}` : `/classifieds/${item.slug}`}
          className="gh-card group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.label}</span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{item.headline}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.summary}</p>
          </div>
          <span className="mt-6 text-sm font-semibold text-ink transition group-hover:text-[var(--primary)]">Open local market</span>
        </Link>
      ))}
    </div>
  );
}

export function ClassifiedsMarketGrid({ items }: { items: ClassifiedsMarketHighlight[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="gh-card p-5">
          <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function ClassifiedsHighlightGrid({ items }: { items: ClassifiedsHighlight[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
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
