import type { Metadata } from 'next';
import {
  OperatorHeroAside,
  OperatorHighlightGrid,
  OperatorLaneGrid,
  OperatorSectionHeading,
  OperatorTrustPanel
} from '../../../../components/operators/operator-discovery';
import { SectionPage } from '../../../../components/section-page';
import { agencyProfiles, getAgencyProfile, operatorHighlights } from '../../../../lib/operators/public-content';

interface AgencyProfilePageProps {
  params: Promise<{ agencySlug: string }>;
}

export function generateStaticParams() {
  return agencyProfiles.map((profile) => ({ agencySlug: profile.slug }));
}

export async function generateMetadata({ params }: AgencyProfilePageProps): Promise<Metadata> {
  const { agencySlug } = await params;
  const profile = getAgencyProfile(agencySlug);

  return {
    title: `${profile.name} | Property Agency | GulfHabibi`,
    description: profile.summary
  };
}

export default async function AgencyProfilePage({ params }: AgencyProfilePageProps) {
  const { agencySlug } = await params;
  const profile = getAgencyProfile(agencySlug);

  return (
    <SectionPage
      eyebrow="Agency Public Profile"
      title={`${profile.name} should feel like a premium property operator, not a thin agency record.`}
      description={profile.summary}
      aside={
        <OperatorHeroAside
          metrics={profile.metrics}
          primaryHref="/agencies"
          primaryLabel="All agencies"
          secondaryHref="/company"
          secondaryLabel="Company workspace"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card overflow-hidden">
          <div className="min-h-[18rem] bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.24),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge) => (
                <span key={badge} className="gh-pill">
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-10 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{profile.category}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{profile.headline}</h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{profile.summary}</p>
            </div>
          </div>
        </section>

        <OperatorTrustPanel
          title="Agency identity should reduce uncertainty before the listing ever opens."
          description="This page should help users understand company posture, inventory quality, and compliance-aware public trust in one scan."
          signals={profile.trustSignals}
        />
      </div>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Operator lanes"
          title="A premium agency page should guide users into the right property contexts."
          description="That means connecting the public brand object to discovery lanes, project routes, and the private company workspace without confusion."
        />
        <OperatorLaneGrid items={profile.lanes} />
      </section>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Why it matters"
          title="Agency pages are one of the strongest trust multipliers in the regulated property flow."
          description="When these pages are strong, listings inherit more confidence and users spend less time guessing who is behind the inventory."
        />
        <OperatorHighlightGrid items={operatorHighlights} />
      </section>
    </SectionPage>
  );
}
