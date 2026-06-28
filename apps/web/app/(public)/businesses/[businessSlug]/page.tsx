import Link from 'next/link';
import type { Metadata } from 'next';
import {
  DirectoryBusinessHighlightGrid,
  DirectoryHeroAside,
  DirectorySectionHeading,
  DirectoryTrustPanel
} from '../../../../components/directory/directory-discovery';
import { SectionPage } from '../../../../components/section-page';
import {
  directoryBusinessHighlights,
  directoryBusinessProfiles,
  getDirectoryBusinessProfile
} from '../../../../lib/directory/public-content';

interface BusinessProfilePageProps {
  params: Promise<{ businessSlug: string }>;
}

export function generateStaticParams() {
  return directoryBusinessProfiles.map((profile) => ({ businessSlug: profile.slug }));
}

export async function generateMetadata({ params }: BusinessProfilePageProps): Promise<Metadata> {
  const { businessSlug } = await params;
  const business = getDirectoryBusinessProfile(businessSlug);

  return {
    title: `${business.name} | Business Profile | GulfHabibi`,
    description: business.summary
  };
}

export default async function BusinessProfilePage({ params }: BusinessProfilePageProps) {
  const { businessSlug } = await params;
  const business = getDirectoryBusinessProfile(businessSlug);

  return (
    <SectionPage
      eyebrow="Business Public Profile"
      title={`${business.name} should feel like a polished public brand page, not a hidden local listing record.`}
      description={business.summary}
      aside={
        <DirectoryHeroAside
          metrics={business.metrics}
          primaryHref="/directory"
          primaryLabel="Explore directory"
          secondaryHref="/businesses"
          secondaryLabel="All business profiles"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="gh-card overflow-hidden">
          <div className="min-h-[18rem] bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.24),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {business.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{business.category}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{business.headline}</h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{business.coverage}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['Coverage', business.coverage],
                ['Profile mode', business.profileMode],
                ['Response posture', business.responseSignal]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 text-base font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DirectoryTrustPanel
          title="Business identity should be visible before the user even thinks about contacting the brand."
          description="A premium public profile helps users understand whether the operator feels credible, relevant, and worth exploring further."
          signals={business.trustSignals}
        />
      </div>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Profile modules"
          title="A real business profile needs stronger modules than a simple contact summary."
          description="The final page should support branch visibility, services or offerings, trust badges, business highlights, local context, and internal links to category and area routes."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {[
            {
              title: 'Brand and trust',
              copy: 'Public identity, verification posture, branch clarity, and stronger confidence cues should all live near the top of the profile.'
            },
            {
              title: 'Category and area relevance',
              copy: 'The page should clearly explain where the business fits locally, which category it belongs to, and why nearby users should care.'
            },
            {
              title: 'Shareable growth surface',
              copy: 'This profile should work as a public landing page for sharing, referral, repeat visits, and local SEO.'
            }
          ].map((item) => (
            <article key={item.title} className="gh-card p-6">
              <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Active lanes"
          title="Profile pages should also route users into the right local business lanes."
          description="This is where a business profile becomes more than a static page and starts acting as a real part of the directory discovery system."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {business.activeLanes.map((lane) => (
            <article key={lane.title} className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{lane.categorySlug}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{lane.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{lane.detail}</p>
              <Link href={`/directory/${lane.emirateSlug}/${lane.categorySlug}`} className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                Open directory lane
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Marketplace fit"
          title="Strong business profiles create cleaner monetization than noisy local ad boards."
          description="Featured profile depth, category visibility, and better discovery all work better when the underlying public brand page already feels premium."
        />
        <DirectoryBusinessHighlightGrid items={directoryBusinessHighlights} />
      </section>
    </SectionPage>
  );
}
