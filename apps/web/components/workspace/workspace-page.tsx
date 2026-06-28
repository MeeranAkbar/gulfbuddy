import Link from 'next/link';
import { ReactNode } from 'react';

interface WorkspaceAction {
  href: string;
  label: string;
  tone?: 'primary' | 'secondary';
}

interface WorkspaceMetric {
  label: string;
  value: string;
  hint: string;
}

export function WorkspacePage({
  eyebrow,
  title,
  description,
  actions = [],
  metrics = [],
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: WorkspaceAction[];
  metrics?: WorkspaceMetric[];
  children?: ReactNode;
}) {
  return (
    <section className="space-y-8">
      <div className="gh-hero p-8 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <p className="gh-pill">
              {eyebrow}
            </p>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h1>
              <p className="max-w-3xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">{description}</p>
            </div>
          </div>
          {actions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3 lg:max-w-sm lg:justify-end">
              {actions.map((action) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={
                    action.tone === 'secondary'
                      ? 'gh-button-secondary'
                      : 'gh-button-primary'
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {metrics.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="gh-kpi">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{metric.hint}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
