import Link from 'next/link';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getEmployerApplicants } from '../../../../lib/workspace/detail-queries';
import { formatDate, formatLabel, formatMoneyRange } from '../../../../lib/workspace/formatters';

function statusTone(status: string) {
  switch (status) {
    case 'shortlisted':
    case 'contacted':
    case 'interviewing':
    case 'offered':
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
    case 'rejected':
    case 'withdrawn':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    default:
      return 'border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]';
  }
}

function formatYears(value: number | string | null) {
  if (value == null || value === '') return 'Experience not stated';
  return `${value} years`;
}

export default async function EmployerApplicantsPage() {
  const applicants = await getEmployerApplicants();
  const shortlistCount = applicants.filter((item) =>
    ['shortlisted', 'contacted', 'interviewing', 'offered'].includes(item.applicationStatus)
  ).length;
  const verifiedIdentity = applicants.filter((item) => item.isIdentityVerified).length;
  const searchableProfiles = applicants.filter((item) => item.searchableByEmployers).length;

  return (
    <WorkspacePage
      eyebrow="Employer applicants"
      title="Review candidate flow with enough profile context to make decisions quickly and responsibly."
      description="Applicant handling should feel like a premium hiring workspace. Employers need to see role context, candidate posture, trust signals, and CV linkage without dropping into a cold ATS-style table too early."
      actions={[
        { href: '/employer/jobs', label: 'Open jobs' },
        { href: '/employer', label: 'Back to employer hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Applicants',
          value: String(applicants.length),
          hint: 'Every application should remain tied to role context and candidate posture.'
        },
        {
          label: 'Shortlist motion',
          value: String(shortlistCount),
          hint: 'Candidates already moving into stronger review or outreach stages.'
        },
        {
          label: 'Verified identity',
          value: String(verifiedIdentity),
          hint: 'Identity-backed applicants increase trust for employer-side review.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {applicants.length ? (
            applicants.map((applicant) => (
              <article key={applicant.applicationId} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${statusTone(applicant.applicationStatus)}`}>
                          {formatLabel(applicant.applicationStatus)}
                        </span>
                        {applicant.isIdentityVerified ? (
                          <span className="rounded-full border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--success)]">
                            Identity verified
                          </span>
                        ) : null}
                        {applicant.searchableByEmployers ? (
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            Searchable profile
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{applicant.candidateName}</h2>
                        <p className="mt-2 text-sm font-semibold text-ink">{applicant.candidateHeadline || 'Candidate headline not set'}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {[applicant.currentLocation, applicant.nationality, applicant.visaStatus && formatLabel(applicant.visaStatus)].filter(Boolean).join(' / ')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Expected compensation</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {formatMoneyRange({
                          min: applicant.expectedSalaryMin,
                          max: applicant.expectedSalaryMax,
                          currency: applicant.salaryCurrency
                        })}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Applied {formatDate(applicant.appliedAt)} • Updated {formatDate(applicant.lastUpdatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Role</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{applicant.jobTitle}</p>
                    <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)]">{applicant.roleTitle}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Experience</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatYears(applicant.totalExperienceYears)}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Profile strength</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{applicant.profileStrengthScore}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">CV asset</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{applicant.cvFileName || 'CV not linked'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-6 py-5">
                  {applicant.jobSlug ? (
                    <Link href={`/jobs/${applicant.jobSlug}`} className="gh-button-primary">
                      Public job page
                    </Link>
                  ) : null}
                  {applicant.coverNote ? (
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Cover note included
                    </span>
                  ) : null}
                  {applicant.isEmailVerified || applicant.isPhoneVerified ? (
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Contact trust {applicant.isEmailVerified ? 'email' : ''}{applicant.isEmailVerified && applicant.isPhoneVerified ? ' + ' : ''}{applicant.isPhoneVerified ? 'phone' : ''}
                    </span>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No applicants yet. This page is ready to become the review lane once employer job posting and candidate apply flows are running against staging data.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Applicant posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Searchable profiles</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{searchableProfiles}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Candidates already open to deeper employer-side discovery.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Shortlist-ready</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{shortlistCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Applicants already moving through stronger hiring intent states.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>The moment an employer receives applicants, the Jobs module stops being a posting tool and starts becoming a true hiring workspace.</p>
              <p>This page should keep candidate review human, trust-aware, and much calmer than a generic applicant table.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
