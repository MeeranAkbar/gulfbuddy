import Link from 'next/link';
import type { OperatorHighlight, OperatorMetric, OperatorProfile } from '../../lib/operators/public-content';

export function OperatorHeroAside({
  metrics,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  metrics: OperatorMetric[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="gh-surface-alt rounded-[1.75rem] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Operator layer</p>
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

export function OperatorSectionHeading({
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

export function OperatorProfileGrid({ items, basePath }: { items: OperatorProfile[]; basePath: string }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <article key={item.slug} className="gh-card flex h-full flex-col p-5">
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.category}</p>
            <h3 className="text-xl font-semibold tracking-tight text-ink">{item.name}</h3>
            <p className="text-sm leading-7 text-[var(--text-secondary)]">{item.summary}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {item.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">{metric.label}</p>
                <p className="mt-2 text-sm font-medium text-ink">{metric.value}</p>
              </div>
            ))}
          </div>
          <Link href={`${basePath}/${item.slug}`} className="mt-6 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
            Open profile
          </Link>
        </article>
      ))}
    </div>
  );
}

export function OperatorTrustPanel({
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

export function OperatorLaneGrid({ items }: { items: OperatorProfile['lanes'] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="gh-card p-5">
          <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.detail}</p>
          <Link href={item.href} className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
            Open lane
          </Link>
        </article>
      ))}
    </div>
  );
}

export function OperatorHighlightGrid({ items }: { items: OperatorHighlight[] }) {
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
