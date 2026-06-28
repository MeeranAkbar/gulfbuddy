import Link from 'next/link';
import { WorkspacePage } from './workspace-page';

export interface WorkspaceActionLink {
  href: string;
  label: string;
  tone?: 'primary' | 'secondary';
}

export interface WorkspaceMetricCard {
  label: string;
  value: string;
  hint: string;
}

export interface WorkspaceInfoCard {
  title: string;
  detail: string;
}

export interface WorkspaceLaneCard {
  title: string;
  detail: string;
  href: string;
  hrefLabel: string;
}

export function WorkspaceOverviewSection({
  eyebrow,
  title,
  description,
  actions,
  metrics,
  lanes,
  signals
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions: WorkspaceActionLink[];
  metrics: WorkspaceMetricCard[];
  lanes: WorkspaceLaneCard[];
  signals: string[];
}) {
  return (
    <WorkspacePage eyebrow={eyebrow} title={title} description={description} actions={actions} metrics={metrics}>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Operating lanes</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-[2rem]">The workspace should guide the user into the right next actions.</h2>
            <p className="text-sm leading-7 text-[var(--text-secondary)] md:text-base">
              Every role lane should feel like a real product surface, not a dead-end settings page or empty module shell.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {lanes.map((lane) => (
              <article key={lane.title} className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">{lane.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{lane.detail}</p>
                <Link href={lane.href} className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  {lane.hrefLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <aside className="gh-card p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Role posture</p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">This lane should feel calm, premium, and operationally clear.</h3>
          <div className="mt-6 space-y-3">
            {signals.map((signal) => (
              <div key={signal} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-4 py-4 text-sm font-medium text-ink">
                {signal}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </WorkspacePage>
  );
}

export function WorkspaceSubpageSection({
  eyebrow,
  title,
  description,
  actions,
  metrics,
  focusCards,
  sideTitle,
  sideDescription,
  sideSignals
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions: WorkspaceActionLink[];
  metrics: WorkspaceMetricCard[];
  focusCards: WorkspaceInfoCard[];
  sideTitle: string;
  sideDescription: string;
  sideSignals: string[];
}) {
  return (
    <WorkspacePage eyebrow={eyebrow} title={title} description={description} actions={actions} metrics={metrics}>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          {focusCards.map((card) => (
            <article key={card.title} className="gh-card p-6">
              <h2 className="text-lg font-semibold tracking-tight text-ink">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{card.detail}</p>
            </article>
          ))}
        </section>

        <aside className="gh-card p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Current focus</p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{sideTitle}</h3>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{sideDescription}</p>
          <div className="mt-6 space-y-3">
            {sideSignals.map((signal) => (
              <div key={signal} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-4 py-4 text-sm font-medium text-ink">
                {signal}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </WorkspacePage>
  );
}
