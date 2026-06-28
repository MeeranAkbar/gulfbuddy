import type { Metadata } from 'next';
import {
  OperatorHeroAside,
  OperatorHighlightGrid,
  OperatorLaneGrid,
  OperatorSectionHeading,
  OperatorTrustPanel
} from '../../../../components/operators/operator-discovery';
import { SectionPage } from '../../../../components/section-page';
import { dealerProfiles, getDealerProfile, operatorHighlights } from '../../../../lib/operators/public-content';

interface DealerProfilePageProps {
  params: Promise<{ dealerSlug: string }>;
}

export function generateStaticParams() {
  return dealerProfiles.map((profile) => ({ dealerSlug: profile.slug }));
}

export async function generateMetadata({ params }: DealerProfilePageProps): Promise<Metadata> {
  const { dealerSlug } = await params;
  const profile = getDealerProfile(dealerSlug);

  return {
    title: `${profile.name} | Dealer Profile | GulfHabibi`,
    description: profile.summary
  };
}

export default async function DealerProfilePage({ params }: DealerProfilePageProps) {
  const { dealerSlug } = await params;
  const profile = getDealerProfile(dealerSlug);

  return (
    <SectionPage
      eyebrow="Dealer Public Profile"
      title={`${profile.name} should feel like a premium motors operator, not a generic seller account.`}
      description={profile.summary}
      aside={
        <OperatorHeroAside
          metrics={profile.metrics}
          primaryHref="/dealers"
          primaryLabel="All dealers"
          secondaryHref="/company"
          secondaryLabel="Dealer workspace"
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
          title="Dealer identity should improve trust before the user compares price or specs."
          description="A premium dealer object helps Motors feel more controlled and more business-grade than open resale boards."
          signals={profile.trustSignals}
        />
      </div>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Operator lanes"
          title="Dealer pages should connect naturally to vehicle discovery, campaigns, and private ops."
          description="That makes the dealer layer commercially useful without making it visually noisy."
        />
        <OperatorLaneGrid items={profile.lanes} />
      </section>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Why it matters"
          title="The dealer layer is where public Motors trust and branding really become tangible."
          description="When these pages are strong, both inventory quality and lead quality benefit."
        />
        <OperatorHighlightGrid items={operatorHighlights} />
      </section>
    </SectionPage>
  );
}
