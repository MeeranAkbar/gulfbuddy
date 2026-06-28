import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getCandidateProfileDetail } from '../../../../lib/workspace/profile-queries';
import { formatCurrencyValue, formatLabel, formatListSummary } from '../../../../lib/workspace/formatters';

function formatYears(value: number | string | null) {
  if (value == null || value === '') return 'Not stated';
  return `${value} years`;
}

export default async function CandidateProfilePage() {
  const profile = await getCandidateProfileDetail();

  return (
    <WorkspacePage
      eyebrow="Candidate profile"
      title="Shape a hiring profile that feels credible, complete, and easy for employers to understand."
      description="Candidate identity should be more than a form. This lane should help the user understand trust posture, work preferences, salary intent, and profile strength before they ever apply."
      actions={[
        { href: '/candidate/cv', label: 'Manage CV' },
        { href: '/candidate', label: 'Back to candidate hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Profile strength',
          value: String(profile?.profileStrengthScore || 0),
          hint: 'A stronger profile improves both confidence and future employer-side discovery.'
        },
        {
          label: 'Experience depth',
          value: String(profile?.experienceCount || 0),
          hint: 'Past roles should support the narrative of what this candidate is ready for next.'
        },
        {
          label: 'Skills + languages',
          value: `${profile?.skillCount || 0} / ${profile?.languageCount || 0}`,
          hint: 'Structured role signals should feel visible, not buried in a long text summary.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-6">
          <section className="gh-card p-6 md:p-7">
            <div className="flex flex-wrap gap-2">
              <span className="gh-pill">{profile?.profileVisibility ? formatLabel(profile.profileVisibility) : 'Private'}</span>
              {profile?.searchableByEmployers ? (
                <span className="rounded-full border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--success)]">
                  Searchable by employers
                </span>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Candidate identity</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{profile?.displayName || 'Candidate profile'}</h2>
                <p className="mt-3 text-sm font-semibold text-ink">{profile?.headline || 'Headline not set'}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {[profile?.currentLocation || profile?.city, profile?.nationality, profile?.visaStatus && formatLabel(profile.visaStatus)].filter(Boolean).join(' / ') ||
                    'Location and visa posture not set'}
                </p>
              </div>

              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Compensation intent</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                  {formatCurrencyValue(profile?.expectedSalaryMin, profile?.salaryCurrency || 'AED', 'Not stated')}
                  {profile?.expectedSalaryMax != null ? ` - ${formatCurrencyValue(profile.expectedSalaryMax, profile.salaryCurrency || 'AED', '')}` : ''}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Preferred work modes: {formatListSummary(profile?.preferredWorkModes, 'Any mode')}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Experience</p>
                <p className="mt-2 text-sm font-semibold text-ink">{formatYears(profile?.totalExperienceYears || null)}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Education entries</p>
                <p className="mt-2 text-sm font-semibold text-ink">{profile?.educationCount || 0}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Certifications</p>
                <p className="mt-2 text-sm font-semibold text-ink">{profile?.certificationCount || 0}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Preferred emirates</p>
                <p className="mt-2 text-sm font-semibold text-ink">{formatListSummary(profile?.preferredEmirates, 'All UAE')}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Candidate summary</p>
              <p className="mt-3 text-sm leading-8 text-[var(--text-secondary)]">
                {profile?.summary || profile?.bio || 'No summary added yet. This area should eventually guide the candidate toward a more employer-friendly profile narrative.'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Skills posture</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  {profile?.skillCount
                    ? `${profile.skillCount} structured skills are already attached to the profile.`
                    : 'No structured skills yet. This is where role fit becomes easier for employers to understand.'}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Language posture</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  {profile?.languageCount
                    ? `${profile.languageCount} languages are recorded for employer-facing profile quality.`
                    : 'No language detail yet. This signal helps the profile feel more complete and locally relevant.'}
                </p>
              </div>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Trust posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Email verification</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{profile?.isEmailVerified ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Phone verification</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{profile?.isPhoneVerified ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Identity verification</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{profile?.isIdentityVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>A strong candidate profile makes the entire Jobs product feel more serious because the user understands their own hiring posture clearly.</p>
              <p>This page should keep identity, work preference, and trust signals human and easy to improve over time.</p>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">What strong profiles need</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Candidate trust improves when salary posture, preferred work modes, experience, and verification are all visible in one calm view.</p>
              <p>This lane should become the profile-improvement surface before the user starts applying at scale.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
