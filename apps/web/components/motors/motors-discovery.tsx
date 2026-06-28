import Link from 'next/link';
import type { MotorsCategoryLane, MotorsMetric, MotorsOperatorHighlight, MotorsSearchField, MotorsShowcaseItem } from '../../lib/motors/public-content';

export function MotorsHeroAside({
  metrics,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  metrics: MotorsMetric[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="gh-surface-alt rounded-[1.75rem] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Market confidence</p>
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

import { MotorsSearchForm } from '../search/motors-search-form';

export function MotorsSearchConsole({
  filters,
  actionHref,
  actionLabel
}: {
  fields: MotorsSearchField[]; // kept for backwards compatibility in props
  filters: string[];
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section className="gh-card p-5 md:p-6">
      <MotorsSearchForm actionHref={actionHref} actionLabel={actionLabel} />

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

export function MotorsSectionHeading({
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

export function MotorsCategoryGrid({ items }: { items: MotorsCategoryLane[] }) {
  const modeImages: Record<string, string> = {
    suv: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    sedan: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    electric: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    commercial: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.slug} className="group relative flex h-[350px] flex-col justify-between overflow-hidden rounded-[2rem] p-6 shadow-lg transition-transform hover:-translate-y-1">
          <img 
            src={modeImages[item.slug] || modeImages.suv} 
            alt={item.title} 
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 mix-blend-multiply opacity-90 transition-opacity group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1624]/90 via-[#0d1624]/30 to-transparent" />
          
          <div className="relative z-10">
             <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                {item.focus}
             </span>
          </div>
          
          <div className="relative z-10 mt-auto">
            <h3 className="text-xl font-bold tracking-tight text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/80">{item.detail}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-white/90 group-hover:text-white">
              Explore category &rarr;
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export function MotorsShowcaseGrid({ items }: { items: MotorsShowcaseItem[] }) {
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.2),transparent_45%),linear-gradient(135deg,var(--surface-alt),var(--surface))]" />
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
            <div className="mt-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">Typical range</p>
              <p className="mt-2 text-xl font-semibold text-ink">{item.price}</p>
            </div>
            <div className="mt-5">
              <Link
                href={`/motors/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                className="gh-button-secondary"
              >
                View vehicle
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function MotorsOperatorGrid({ items }: { items: MotorsOperatorHighlight[] }) {
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

export function MotorsTrustPanel({
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
