import type { Metadata } from 'next';
import {
  JobsCategoryGrid,
  JobsEmirateGrid,
  JobsEmployerGrid,
  JobsHeroAside,
  JobsSearchConsole,
  JobsSectionHeading,
  JobsShowcaseGrid,
  JobsTrustPanel
} from '../../../components/jobs/jobs-discovery';
import { SectionPage } from '../../../components/section-page';
import {
  jobsCategories,
  jobsEmirates,
  jobsEmployerHighlights,
  jobsMetrics,
  jobsQuickFilters,
  jobsSearchFields,
  jobsShowcaseItems,
  jobsTrustSignals
} from '../../../lib/jobs/public-content';

export const metadata: Metadata = {
  title: 'UAE Jobs Platform | GulfHabibi',
  description:
    'Explore GulfHabibi Jobs as a premium UAE hiring marketplace with candidate discovery, verified employer pages, clean job detail design, and stronger anti-scam posture.'
};

export default function JobsPage() {
  return (
    <SectionPage
      eyebrow="Jobs Platform"
      title="Explore verified employers, cleaner job pages, and safer hiring journeys."
      description="Search UAE roles through focused category and emirate pages with stronger employer identity, premium job detail pages, and a cleaner apply experience."
      imageUrl="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
      aside={
        <JobsHeroAside
          metrics={jobsMetrics}
          primaryHref="/jobs/dubai"
          primaryLabel="Explore jobs"
          secondaryHref="/pricing"
          secondaryLabel="For employers"
        />
      }
    >
      <JobsSearchConsole fields={jobsSearchFields} filters={jobsQuickFilters} actionHref="/jobs/search" actionLabel="Search roles" />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <JobsSectionHeading
            eyebrow="Hiring lanes"
            title="Job discovery should move through categories, locations, and employer trust."
            description="The best hiring pages help candidates narrow fast without losing sight of employer quality or role clarity."
          />
          <JobsCategoryGrid items={jobsCategories} />
        </section>

        <JobsTrustPanel
          title="Candidates need confidence before they click apply."
          description="Verified employer identity, clearer role structure, and calmer presentation make the jobs section feel safer than a noisy board."
          signals={jobsTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <JobsSectionHeading
          eyebrow="Local hiring"
          title="Emirate pages should act like real local hiring hubs."
          description="The strongest local pages combine employer quality, role relevance, and fast movement into deeper job detail."
        />
        <JobsEmirateGrid items={jobsEmirates} />
      </section>

      <section className="space-y-6">
        <JobsSectionHeading
          eyebrow="Role presentation"
          title="Single-job pages should be fast to scan and easy to trust."
          description="Salary, seniority, employer identity, and the apply action should be clear in the first screen."
        />
        <JobsShowcaseGrid items={jobsShowcaseItems} />
      </section>

      <section className="space-y-6">
        <JobsSectionHeading
          eyebrow="Employer fit"
          title="Employer branding should feel native to the product."
          description="Verified employer pages and job boosts can support monetization without making the public experience feel over-commercial."
        />
        <JobsEmployerGrid items={jobsEmployerHighlights} />
      </section>
    </SectionPage>
  );
}
