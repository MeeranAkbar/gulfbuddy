import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionPage } from '../../../../components/section-page';
import { ServicesSearchConsole, ServicesSectionHeading, ServicesTrustPanel } from '../../../../components/services/services-discovery';
import { servicesSearchFields, servicesQuickFilters } from '../../../../lib/services/public-content';
import { parseServicesSearchParams, searchServicesListings } from '../../../../lib/search/services';

interface ServicesSearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: ServicesSearchPageProps): Promise<Metadata> {
  const params = parseServicesSearchParams(await searchParams);
  const title = params.keyword ? `Services matching "${params.keyword}" | GulfBuddy` : 'Service Providers | GulfBuddy';
  return {
    title,
    description: 'Find trusted local service providers across the UAE.'
  };
}

export default async function ServicesSearchPage({ searchParams }: ServicesSearchPageProps) {
  const params = parseServicesSearchParams(await searchParams);
  const results = searchServicesListings(params);

  return (
    <SectionPage
      eyebrow="Services Search"
      title="Local Service Providers"
      description="Connect with trusted local professionals for home and business needs."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Service guide</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Best use</p>
              <p className="mt-2 text-sm font-semibold text-ink">Compare providers by reviews and response time before requesting a quote.</p>
            </div>
          </div>
        </div>
      }
    >
      <ServicesSearchConsole
        fields={servicesSearchFields}
        filters={servicesQuickFilters}
        actionHref="/services/search"
        actionLabel="Update search"
      />

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5">
          <ServicesSectionHeading
            eyebrow="Ranked results"
            title={`${results.length} providers matching your need`}
            description="Premium and highly-rated providers are shown first to ensure quality service."
          />

          {results.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {results.map((result) => (
                <article key={result.id} className="gh-card overflow-hidden">
                  <div className="relative min-h-[14rem] overflow-hidden p-5">
                    {result.imageUrl && (
                      <>
                        <img src={result.imageUrl} alt={result.title} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.2),rgba(7,12,24,0.85))]" />
                      </>
                    )}
                    {!result.imageUrl && (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,88,12,0.18),transparent_42%),linear-gradient(135deg,var(--surface-alt),var(--surface))]" />
                    )}
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        {result.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/90"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="mt-8 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                            {result.location}
                          </p>
                          <p className="mt-2 text-xl font-semibold tracking-tight text-white">{result.priceLabel}</p>
                        </div>
                        <div className="rounded-[1.1rem] border border-white/20 bg-black/40 backdrop-blur-md px-3 py-3 text-right">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">Category</p>
                          <p className="mt-1 text-sm font-semibold text-white">{result.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{result.providerType}</p>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">{result.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{result.summary}</p>

                    <div className="mt-5 grid grid-cols-1 gap-3">
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Provider</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{result.providerName}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Trust Status</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--services-accent)]">{result.providerType}</p>
                      </div>
                      <Link href={result.routeHref} className="gh-button-secondary">
                        View provider
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gh-card p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">No providers found</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">We couldn't find matches for this service.</h2>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <ServicesTrustPanel
            title="Safe local services."
            description="We verify business licenses and customer reviews to keep our marketplace reliable."
            signals={[
              'Verified business licenses',
              'Authentic customer reviews',
              'Secure quote requests'
            ]}
          />
        </aside>
      </div>
    </SectionPage>
  );
}
