import Link from 'next/link';
import type { Metadata } from 'next';
import {
  JobsEmployerGrid,
  JobsHeroAside,
  JobsRoleGrid,
  JobsSectionHeading,
  JobsTrustPanel
} from '../../../../../components/jobs/jobs-discovery';
import { SectionPage } from '../../../../../components/section-page';
import {
  getJobsEmployerProfile,
  getJobsListingsForFilters,
  jobsEmployerHighlights,
  jobsEmployerProfiles
} from '../../../../../lib/jobs/public-content';

interface JobsCompanyPageProps {
  params: Promise<{ companySlug: string }>;
}

export function generateStaticParams() {
  return jobsEmployerProfiles.map((profile) => ({
    companySlug: profile.slug
  }));
}

export async function generateMetadata({ params }: JobsCompanyPageProps): Promise<Metadata> {
  const { companySlug } = await params;
  const employer = getJobsEmployerProfile(companySlug);

  return {
    title: `${employer.name} | Employer Profile | GulfHabibi Jobs`,
    description: employer.summary
  };
}

export default async function JobsCompanyPage({ params }: JobsCompanyPageProps) {
  const { companySlug } = await params;
  const employer = getJobsEmployerProfile(companySlug);
  const activeRoles = getJobsListingsForFilters({ companySlug }).slice(0, 3);

  return (
    <SectionPage
      eyebrow="Employer Public Profile"
      title={`${employer.name} should feel like a real hiring brand, not a thin company record.`}
      description={employer.summary}
      aside={
        <JobsHeroAside
          metrics={employer.metrics}
          primaryHref="/jobs"
          primaryLabel="Explore jobs"
          secondaryHref="/employer"
          secondaryLabel="Employer workspace"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="gh-card overflow-hidden">
          <div className="min-h-[18rem] bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.24),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {employer.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{employer.industry}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{employer.headline}</h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{employer.hiringStatus}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['Office footprint', employer.officeLabel],
                ['Review rhythm', employer.responseRhythm],
                ['Public role', 'Verified hiring surface']
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 text-base font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <JobsTrustPanel
          title="Employer trust should live on the public profile, not only behind admin tools."
          description="Strong employer pages help candidates understand whether the company is real, what kind of hiring experience to expect, and why the open roles deserve more confidence than anonymous job-board posts."
          signals={employer.trustSignals}
        />
      </div>

      <section className="space-y-6">
        <JobsSectionHeading
          eyebrow="Open roles"
          title="Active jobs should feel connected to a clear employer identity."
          description="Every open role should inherit trust from the employer page, while still presenting salary posture, work mode, and experience level cleanly enough for fast scanning."
        />
        <JobsRoleGrid items={activeRoles} />
      </section>

      <section className="space-y-6">
        <JobsSectionHeading
          eyebrow="Hiring lanes"
          title="Employer profiles should make it easy to understand where the company is actively hiring."
          description="This is where public employer pages can become real conversion surfaces instead of passive company bios."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {employer.activeLanes.map((lane) => (
            <article key={lane.title} className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{lane.categorySlug}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{lane.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{lane.detail}</p>
              <Link href={`/jobs/${lane.emirateSlug}/${lane.categorySlug}`} className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                Open hiring lane
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <JobsSectionHeading
          eyebrow="Marketplace fit"
          title="Employer branding, recruiter seats, and featured roles should fit naturally into the product."
          description="The strongest employer pages support trust and monetization together without feeling noisy or sales-heavy."
        />
        <JobsEmployerGrid items={jobsEmployerHighlights} />
      </section>
    </SectionPage>
  );
}
