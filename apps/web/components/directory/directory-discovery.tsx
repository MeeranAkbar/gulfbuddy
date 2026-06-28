import Link from 'next/link';
import { DirectorySearchForm } from '../search/directory-search-form';
import type {
  DirectoryAreaSpotlight,
  DirectoryBusinessHighlight,
  DirectoryBusinessProfile,
  DirectoryCategory,
  DirectoryEmirateSpotlight,
  DirectoryMetric,
  DirectorySearchField,
  DirectoryShowcaseItem
} from '../../lib/directory/public-content';

export function DirectoryHeroAside({
  metrics,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  metrics: DirectoryMetric[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="gh-surface-alt rounded-[1.75rem] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Local business confidence</p>
      <div className="mt-5 grid gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[1.15rem] border border-white/20 bg-black/40 backdrop-blur-md p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/80">{metric.label}</p>
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


export function DirectorySearchConsole({
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
      <DirectorySearchForm actionHref={actionHref} actionLabel={actionLabel} />
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

export function DirectorySectionHeading({
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
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-[2rem]">{title}</h2>
      <p className="text-sm leading-7 text-white/90 md:text-base">{description}</p>
    </div>
  );
}

export function DirectoryCategoryGrid({ items, emirateSlug }: { items: DirectoryCategory[]; emirateSlug?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={emirateSlug ? `/directory/${emirateSlug}/${item.slug}` : `/directory/dubai/${item.slug}`}
          className="gh-card group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{item.focus}</p>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/90">{item.detail}</p>
          </div>
          <span className="mt-6 text-sm font-semibold text-ink transition group-hover:text-[var(--primary)]">Open business lane</span>
        </Link>
      ))}
    </div>
  );
}

export function DirectoryShowcaseGrid({ items }: { items: DirectoryShowcaseItem[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {items.map((item) => (
        <article key={`${item.title}-${item.meta}`} className="gh-card overflow-hidden">
          <div className="relative min-h-[16rem] overflow-hidden p-5">
            {item.imageUrl && (
              <>
                <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.15),rgba(7,12,24,0.65))]" />
              </>
            )}
            {!item.imageUrl && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_42%),linear-gradient(135deg,var(--surface-alt),var(--surface))]" />
            )}
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                  {item.badge}
                </span>
                <span className="text-xs font-medium text-white/90">{item.meta}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{item.subtitle}</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.highlight}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function DirectoryBusinessGrid({ items }: { items: DirectoryBusinessProfile[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.slug} className="gh-card flex h-full flex-col p-5">
          <div className="flex flex-wrap gap-2">
            {item.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.category}</p>
            <h3 className="text-xl font-semibold tracking-tight text-ink">{item.name}</h3>
            <p className="text-sm leading-7 text-[var(--text-secondary)]">{item.summary}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Coverage', item.coverage],
              ['Mode', item.profileMode]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                <p className="mt-2 text-sm font-medium text-ink">{value}</p>
              </div>
            ))}
          </div>
          <Link href={`/businesses/${item.slug}`} className="mt-6 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
            Open business profile
          </Link>
        </article>
      ))}
    </div>
  );
}

export function DirectoryBusinessHighlightGrid({ items }: { items: DirectoryBusinessHighlight[] }) {
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

export function DirectoryTrustPanel({
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

export function DirectoryEmirateGrid({ items, categorySlug }: { items: DirectoryEmirateSpotlight[]; categorySlug?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={categorySlug ? `/directory/${item.slug}/${categorySlug}` : `/directory/${item.slug}`}
          className="gh-card group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.label}</span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{item.headline}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.summary}</p>
          </div>
          <span className="mt-6 text-sm font-semibold text-ink transition group-hover:text-[var(--primary)]">Open local directory</span>
        </Link>
      ))}
    </div>
  );
}

export function DirectoryAreaGrid({ items, actionHref, actionLabel }: { items: DirectoryAreaSpotlight[]; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.name} className="gh-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.focus}</p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{item.name}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.detail}</p>
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
