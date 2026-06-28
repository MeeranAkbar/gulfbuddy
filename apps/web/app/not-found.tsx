import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-6 py-16">
      <section className="gh-card w-full p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Not found</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          This GulfHabibi route is not available.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
          The page may have moved, the route may be incomplete, or the content may not exist yet in the current environment.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="gh-button-primary">
            Go to homepage
          </Link>
          <Link href="/property" className="gh-button-secondary">
            Explore property
          </Link>
          <Link href="/services" className="gh-button-secondary">
            Explore services
          </Link>
        </div>
      </section>
    </main>
  );
}
