import { ReactNode } from 'react';

export function SectionPage({
  eyebrow,
  title,
  description,
  aside,
  imageUrl,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  imageUrl?: string;
  children?: ReactNode;
}) {
  return (
    <section className="space-y-16 md:space-y-24">
      <div className="gh-hero relative overflow-hidden rounded-[2.5rem] p-10 md:p-16 xl:p-20">
        {imageUrl && (
          <>
            <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
          </>
        )}
        <div className="relative z-10">
          <p className="mb-6 inline-flex rounded-full border border-amber-500/30 bg-amber-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-400 backdrop-blur-md">
            {eyebrow}
          </p>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">{title}</h1>
              <p className={`max-w-3xl text-lg leading-8 ${imageUrl ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>{description}</p>
            </div>
          {aside ?? (
            <div className="gh-surface-alt rounded-[1.75rem] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Why GulfHabibi</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
                <li>Search-first public pages that feel calmer than open classifieds.</li>
                <li>Visible company identity, trust badges, and cleaner lead journeys.</li>
                <li>Moderated marketplace rules that keep risky content out of the public flow.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      </div>
      {children}
    </section>
  );
}
