import { SectionPage } from '../../../components/section-page';

const helpTopics = [
  'Getting started with posting across Property, Motors, Jobs, Services, and Classifieds',
  'Verification, compliance evidence, and regulated listing workflows',
  'Managing company seats, branches, roles, and operator profiles',
  'Understanding packages, promotions, and campaign visibility rules',
  'Workspace guidance for leads, approvals, and trust-aware publishing'
];

export default function HelpPage() {
  return (
    <SectionPage
      eyebrow="Help Center"
      title="Support content that reduces friction, support load, and compliance mistakes."
      description="The Help Center should become a practical operating guide for posters, companies, and administrators. It needs to explain trust signals, posting rules, moderation, verification, and packages in a way that keeps the marketplace cleaner."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Support Philosophy</h2>
          <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
            Help content should answer operational questions before they become tickets, while still pointing high-risk issues into governed review lanes.
          </p>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Planned Help Topics</p>
          <div className="mt-6 space-y-4">
            {helpTopics.map((topic, index) => (
              <div key={topic} className="gh-surface-alt flex gap-4 rounded-[1.5rem] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] text-sm font-semibold text-ink">
                  0{index + 1}
                </span>
                <p className="text-sm leading-7 text-[var(--text-secondary)]">{topic}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Best Entry Points</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
            <div className="gh-surface-alt rounded-[1.35rem] p-4">
              <p className="font-semibold text-ink">Posting guidance</p>
              <p className="mt-2">How to structure listings, upload media, and avoid review delays.</p>
            </div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">
              <p className="font-semibold text-ink">Verification guide</p>
              <p className="mt-2">What businesses, brokers, employers, and providers need before stronger visibility.</p>
            </div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">
              <p className="font-semibold text-ink">Packages and campaigns</p>
              <p className="mt-2">How credits, placements, and banner campaigns should behave across the platform.</p>
            </div>
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
