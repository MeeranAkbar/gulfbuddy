import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  JobsEmirateGrid,
  JobsFocusAreaGrid,
  JobsHeroAside,
  JobsRoleGrid,
  JobsSectionHeading,
  JobsTrustPanel
} from '../../../../../components/jobs/jobs-discovery';
import { SectionPage } from '../../../../../components/section-page';
import {
  getJobsCategory,
  getJobsEmirateSpotlight,
  getJobsListingsForFilters,
  jobsEmirateSlugs,
  jobsEmirates,
  jobsTrustSignals
} from '../../../../../lib/jobs/public-content';

interface JobsCategoryPageProps {
  params: Promise<{ slug: string; category: string }>;
}

export function generateStaticParams() {
  return jobsEmirates.flatMap((emirate) =>
    ['sales', 'hospitality', 'technology', 'healthcare'].map((category) => ({
      slug: emirate.slug,
      category
    }))
  );
}

export async function generateMetadata({ params }: JobsCategoryPageProps): Promise<Metadata> {
  const { slug, category } = await params;
  const emirate = getJobsEmirateSpotlight(slug);
  const categoryDetails = getJobsCategory(category);

  return {
    title: `${categoryDetails ? categoryDetails.title : category} Jobs in ${emirate.label} | GulfHabibi`,
    description: categoryDetails
      ? `${categoryDetails.title} jobs in ${emirate.label} with stronger employer trust, structured public job pages, and cleaner local hiring discovery.`
      : `Jobs in ${emirate.label}.`
  };
}

export default async function JobsCategoryPage({ params }: JobsCategoryPageProps) {
  const { slug, category } = await params;

  if (!jobsEmirateSlugs.includes(slug as (typeof jobsEmirateSlugs)[number])) {
    notFound();
  }

  const emirate = getJobsEmirateSpotlight(slug);
  const categoryDetails = getJobsCategory(category);

  if (!categoryDetails) {
    notFound();
  }

  const roleCards = getJobsListingsForFilters({ emirateSlug: slug, categorySlug: category });

  return (
    <SectionPage
      eyebrow={`${categoryDetails.title} in ${emirate.label}`}
      title={`${categoryDetails.title} jobs in ${emirate.label} should feel local, premium, and safer than generic job-board search.`}
      description={categoryDetails.detail}
      aside={
        <JobsHeroAside
          metrics={[
            { label: 'Local lane', value: emirate.headline },
            { label: 'Category focus', value: categoryDetails.focus },
            { label: 'Best action', value: 'Compare employers and role detail' }
          ]}
          primaryHref={`/jobs/${slug}`}
          primaryLabel={`Back to ${emirate.label}`}
          secondaryHref="/jobs"
          secondaryLabel="All jobs"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <JobsSectionHeading
            eyebrow="Active openings"
            title={`${categoryDetails.title} in ${emirate.label} should open with believable, trust-rich role cards.`}
            description="The first screen should help candidates compare employer quality, work mode, and seniority without drowning them in noisy filters."
          />
          <JobsRoleGrid items={roleCards.slice(0, 3)} />
        </section>

        <JobsTrustPanel
          title="Local hiring pages still need a visible trust layer."
          description="The best category pages quietly make it obvious which employers feel safer, which roles look structured, and why this hiring lane is worth deeper exploration."
          signals={jobsTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <JobsSectionHeading
          eyebrow="Local focus"
          title={`${emirate.label} should feel like a real hiring market, not a thin search state.`}
          description="Focus areas, nearby business districts, and category-led demand make local pages feel more deliberate and useful."
        />
        <JobsFocusAreaGrid items={emirate.focusAreas} />
      </section>

      <section className="space-y-6">
        <JobsSectionHeading
          eyebrow="Expand by emirate"
          title="Good category pages should help candidates compare nearby hiring markets."
          description="Once the user understands the category, moving across emirates should feel natural and still preserve premium hiring structure."
        />
        <JobsEmirateGrid items={jobsEmirates} categorySlug={categoryDetails.slug} />
      </section>
    </SectionPage>
  );
}
