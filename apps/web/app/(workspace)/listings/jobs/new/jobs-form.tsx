'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { JobsDraftActionState } from './actions';
import type { WorkspaceBranchSummary, WorkspaceCompanySummary } from '../../../../../lib/company/queries';
import { SubmitButton } from '../../../../../components/forms/submit-button';

const initialJobsDraftState: JobsDraftActionState = {
  status: 'idle'
};

const employmentTypes = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' }
];

const workModes = [
  { value: 'on_site', label: 'On-Site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' }
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'manager', label: 'Manager' },
  { value: 'director', label: 'Director' },
  { value: 'executive', label: 'Executive' }
];

export function JobsDraftForm({
  companies,
  branches,
  action
}: {
  companies: WorkspaceCompanySummary[];
  branches: WorkspaceBranchSummary[];
  action: (state: JobsDraftActionState, formData: FormData) => Promise<JobsDraftActionState>;
}) {
  const [state, formAction] = useActionState(action, initialJobsDraftState);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const availableBranches = branches.filter((branch) => branch.company_id === selectedCompanyId);

  if (!companies.length) {
    return (
      <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">Workspace Required</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Setup a company workspace before publishing job roles.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
          Linking listings to business workspace ensures verified employer brand alignment, applicant tracking, and unified hiring team operations.
        </p>
        <div className="mt-5">
          <Link
            href="/company/onboarding"
            className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Create company workspace
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Jobs Draft Composer</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Specify role details and requirements.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          This saves a job posting draft in your workspace. Once saved, you can add key skill tags, specify applicant questions, and publish.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700 xl:col-span-2">
            Hiring Company Workspace *
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]"
              name="ownerCompanyId"
              value={selectedCompanyId}
              onChange={(event) => setSelectedCompanyId(event.target.value)}
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.display_name} ({company.company_type})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Work Location Branch
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="branchId" defaultValue="">
              <option value="">No branch / Main office</option>
              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                  {branch.emirate ? ` - ${branch.emirate}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Employment Type *
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="employmentType" defaultValue="full_time">
              {employmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block text-sm font-medium text-slate-700 xl:col-span-2">
            Job / Role Title *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="title" type="text" placeholder="Senior Accountant" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Employer Brand Name *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="companyName" type="text" placeholder="Fast Jaguar Renovation" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Work Mode *
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="workMode" defaultValue="on_site">
              {workModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Experience Level *
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="experienceLevel" defaultValue="mid">
              {experienceLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            Industry Category
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="industry" type="text" placeholder="Finance / Renovation" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Department
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="department" type="text" placeholder="Accounts & Auditing" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Emirate *
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="emirate" defaultValue="Dubai">
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
              <option value="Fujairah">Fujairah</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Area / District
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="area" type="text" placeholder="Business Bay / Al Quoz" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700">
            Monthly Base Salary Min (AED) *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="salaryMin" type="number" min="0" placeholder="8000" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Monthly Base Salary Max (AED)
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="salaryMax" type="number" min="0" placeholder="12000" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Number of Openings
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="openingsCount" type="number" min="1" placeholder="1" />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Job Description & Requirements *
          <textarea
            className="mt-2 min-h-40 w-full rounded-[1.5rem] border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]"
            name="description"
            placeholder="Write a clear details of the role. Mention core tasks, software proficiency required, languages, visa details, and work schedule."
            required
          />
        </label>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Recruiter Contact Layer</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">Set where applications will route.</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              Applications Email *
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicEmail" type="email" placeholder="hr@company.com" required />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Contact Phone (Optional)
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicPhone" type="tel" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              WhatsApp Inquiry
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicWhatsapp" type="tel" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input className="h-4 w-4 rounded border-slate-300" name="hideNumberUntilClick" type="checkbox" value="on" />
              Hide phone number until clicked.
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input className="h-4 w-4 rounded border-slate-300" name="urgentHiring" type="checkbox" value="on" />
              Mark as urgent hiring.
            </label>
          </div>
        </div>

        {state.message ? (
          <p
            className={
              state.status === 'success'
                ? 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'
                : 'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'
            }
          >
            {state.message}
          </p>
        ) : null}

        {state.status === 'success' && state.listingSlug ? (
          <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
            Draft reserved slug: <span className="font-semibold text-slate-950">{state.listingSlug}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton label="Save job draft" pendingLabel="Saving job draft..." />
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            Back to listings manager
          </Link>
        </div>
      </form>
    </section>
  );
}
