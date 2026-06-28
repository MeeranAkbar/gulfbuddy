import Link from 'next/link';
import { JobsSearchForm } from '../search/jobs-search-form';
import type {
  JobsCategory,
  JobsEmirateSpotlight,
  JobsEmployerHighlight,
  JobsMetric,
  JobsRoleListing,
  JobsSearchField,
  JobsShowcaseItem
} from '../../lib/jobs/public-content';

export function JobsHeroAside({
  metrics,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  metrics: JobsMetric[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="gh-surface-alt rounded-[1.75rem] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Hiring confidence</p>
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


export function JobsSearchConsole({
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
      <JobsSearchForm actionHref={actionHref} actionLabel={actionLabel} />
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-2 text-xs font-medium text-white/90"
          >
            {filter}
          </span>
        ))}
      </div>
    </section>
  );
}

export function JobsSectionHeading({
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

export function JobsCategoryGrid({ items, emirateSlug }: { items: JobsCategory[]; emirateSlug?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={emirateSlug ? `/jobs/${emirateSlug}/${item.slug}` : `/jobs/dubai/${item.slug}`}
          className="gh-card group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{item.focus}</p>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/90">{item.detail}</p>
          </div>
          <span className="mt-6 text-sm font-semibold text-ink transition group-hover:text-[var(--primary)]">Open hiring lane</span>
        </Link>
      ))}
    </div>
  );
}

export function JobsShowcaseGrid({ items }: { items: JobsShowcaseItem[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {items.map((item) => (
        <article key={`${item.title}-${item.meta}`} className="gh-card overflow-hidden">
          <div className="relative min-h-[16rem] overflow-hidden p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                {item.badge}
              </span>
              <span className="text-xs font-medium text-white/90">{item.meta}</span>
            </div>
            <div className="mt-10 space-y-3">
              <div className="h-12 rounded-[1rem] border border-white/35 bg-white/50 dark:border-white/10 dark:bg-white/5" />
              <div className="grid grid-cols-[1fr_1fr] gap-3">
                <div className="h-10 rounded-[0.9rem] border border-white/35 bg-white/40 dark:border-white/10 dark:bg-white/5" />
                <div className="h-10 rounded-[0.9rem] border border-white/35 bg-white/35 dark:border-white/10 dark:bg-white/5" />
              </div>
              <div className="h-24 rounded-[1.2rem] border border-white/45 bg-white/55 dark:border-white/10 dark:bg-white/5" />
            </div>
          </div>
          <div className="p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{item.subtitle}</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.highlight}</p>
            <div className="mt-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">Salary signal</p>
              <p className="mt-2 text-xl font-semibold text-ink">{item.salary}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function JobsEmployerGrid({ items }: { items: JobsEmployerHighlight[] }) {
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

export function JobsRoleGrid({ items }: { items: JobsRoleListing[] }) {
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.companyName}</p>
            <h3 className="text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="text-sm leading-7 text-[var(--text-secondary)]">{item.summary}</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Location', item.location],
              ['Salary', item.salary],
              ['Mode', item.workMode],
              ['Level', item.experienceLevel]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                <p className="mt-2 text-sm font-medium text-ink">{value}</p>
              </div>
            ))}
          </div>

          <Link href={`/jobs/${item.slug}`} className="mt-6 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
            Open job page
          </Link>
        </article>
      ))}
    </div>
  );
}

export function JobsTrustPanel({
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

export function JobsEmirateGrid({ items, categorySlug }: { items: JobsEmirateSpotlight[]; categorySlug?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={categorySlug ? `/jobs/${item.slug}/${categorySlug}` : `/jobs/${item.slug}`}
          className="gh-card group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.label}</span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{item.headline}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.summary}</p>
          </div>
          <span className="mt-6 text-sm font-semibold text-ink transition group-hover:text-[var(--primary)]">Open local jobs</span>
        </Link>
      ))}
    </div>
  );
}

export function JobsFocusAreaGrid({ items }: { items: JobsEmirateSpotlight['focusAreas'] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.name} className="gh-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.focus}</p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{item.name}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}
