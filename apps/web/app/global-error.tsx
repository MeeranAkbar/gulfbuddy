'use client';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
        <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
          <section className="gh-card w-full p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Platform error</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Something unexpected interrupted the GulfHabibi experience.
            </h1>
            <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)] md:text-base">
              The platform hit an unexpected runtime issue. This fallback keeps the app controlled while the underlying problem is reviewed.
            </p>
            {error?.digest ? (
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">Digest {error.digest}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => reset()} className="gh-button-primary">
                Try again
              </button>
              <a href="/" className="gh-button-secondary">
                Return home
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
