'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { CompanyOnboardingActionState } from '../../app/(workspace)/company/onboarding/actions';
import type { WorkspaceCompanySummary } from '../../lib/company/queries';
import { SubmitButton } from '../forms/submit-button';

const initialCompanyOnboardingState: CompanyOnboardingActionState = {
  status: 'idle'
};

function FieldError({
  fieldErrors,
  name
}: {
  fieldErrors: Record<string, string[]> | undefined;
  name: string;
}) {
  const messages = fieldErrors?.[name];

  if (!messages?.length) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{messages[0]}</p>;
}

export function CompanyOnboardingForm({
  existingCompanies,
  action
}: {
  existingCompanies: WorkspaceCompanySummary[];
  action: (
    state: CompanyOnboardingActionState,
    formData: FormData
  ) => Promise<CompanyOnboardingActionState>;
}) {
  const [state, formAction] = useActionState(action, initialCompanyOnboardingState);

  return (
    <div className="space-y-6">
      {existingCompanies.length ? (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Current companies</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Your account already has live company workspaces.</h2>
            </div>
            <Link
              href="/company"
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Open company hub
            </Link>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {existingCompanies.map((company) => (
              <article key={company.id} className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{company.company_type}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{company.display_name}</h3>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
                    {company.verification_status}
                  </span>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">
                    {company.public_profile_enabled ? 'Public profile on' : 'Profile private'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Launch the backbone</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Create a company record that later powers listings, leads, campaigns, and permissions.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            The first seat is created automatically as the owner lane for the company type you choose. Branch setup is optional but recommended.
          </p>
        </div>

        <form action={formAction} className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block text-sm font-medium text-slate-700">
              Company type
              <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="companyType" defaultValue="agency">
                <option value="agency">Property agency</option>
                <option value="developer">Developer</option>
                <option value="dealer">Dealer</option>
                <option value="employer">Employer</option>
                <option value="service_provider">Service provider</option>
                <option value="directory_business">Directory business</option>
              </select>
              <FieldError fieldErrors={state.fieldErrors} name="companyType" />
            </label>
            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Legal company name
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="legalName" type="text" />
              <FieldError fieldErrors={state.fieldErrors} name="legalName" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Public display name
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="displayName" type="text" />
              <FieldError fieldErrors={state.fieldErrors} name="displayName" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              Website
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="website" type="url" placeholder="https://example.com" />
              <FieldError fieldErrors={state.fieldErrors} name="website" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              License number
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="licenseNumber" type="text" />
              <FieldError fieldErrors={state.fieldErrors} name="licenseNumber" />
            </label>
            <label className="flex items-center gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm font-medium text-slate-700">
              <input className="h-4 w-4 rounded border-slate-300" name="publicProfileEnabled" type="checkbox" value="on" />
              Enable the public company profile once branding is ready
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Public profile summary
            <textarea
              className="mt-2 min-h-32 w-full rounded-[1.5rem] border border-slate-200 px-4 py-3"
              name="publicProfileSummary"
              placeholder="Describe what the company does, which emirates it covers, and why customers should trust it."
            />
            <FieldError fieldErrors={state.fieldErrors} name="publicProfileSummary" />
          </label>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Optional branch</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">Create the first branch if this company works from a real UAE location.</h3>
              </div>
              <p className="max-w-lg text-sm leading-7 text-slate-600">
                Branches help later with agent assignment, dealer inventory, local trust, and area-based reporting.
              </p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="block text-sm font-medium text-slate-700">
                Branch name
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="branchName" type="text" />
                <FieldError fieldErrors={state.fieldErrors} name="branchName" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Emirate
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="branchEmirate" type="text" placeholder="Dubai" />
                <FieldError fieldErrors={state.fieldErrors} name="branchEmirate" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Area
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="branchArea" type="text" placeholder="Business Bay" />
                <FieldError fieldErrors={state.fieldErrors} name="branchArea" />
              </label>
              <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-1">
                Address
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="branchAddress" type="text" />
                <FieldError fieldErrors={state.fieldErrors} name="branchAddress" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Branch phone
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="branchPhone" type="tel" />
                <FieldError fieldErrors={state.fieldErrors} name="branchPhone" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Branch email
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="branchEmail" type="email" />
                <FieldError fieldErrors={state.fieldErrors} name="branchEmail" />
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

          {state.status === 'success' && state.companySlug ? (
            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
              Public profile slug reserved: <span className="font-semibold text-slate-950">{state.companySlug}</span>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <SubmitButton label="Create company workspace" pendingLabel="Creating company workspace..." />
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Back to dashboard
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
