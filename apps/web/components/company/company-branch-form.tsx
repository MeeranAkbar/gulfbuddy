'use client';

import { useActionState } from 'react';
import type { CompanyBranchActionState } from '../../app/(workspace)/company/branches/actions';
import type { WorkspaceCompanySummary } from '../../lib/company/queries';
import { SubmitButton } from '../forms/submit-button';

const initialCompanyBranchState: CompanyBranchActionState = {
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

export function CompanyBranchForm({
  companies,
  action
}: {
  companies: WorkspaceCompanySummary[];
  action: (state: CompanyBranchActionState, formData: FormData) => Promise<CompanyBranchActionState>;
}) {
  const [state, formAction] = useActionState(action, initialCompanyBranchState);

  if (!companies.length) {
    return null;
  }

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Create branch</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Add a branch so inventory, leads, and staff can stay organized by operating lane.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          Branches matter most for agencies, developers, and dealers, but the same structure also helps employers and service providers scale cleanly.
        </p>
      </div>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Company
          <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="companyId" defaultValue={companies[0]?.id}>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.display_name}
              </option>
            ))}
          </select>
          <FieldError fieldErrors={state.fieldErrors} name="companyId" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Branch name
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="name" type="text" placeholder="Business Bay Branch" />
          <FieldError fieldErrors={state.fieldErrors} name="name" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Emirate
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="emirate" type="text" placeholder="Dubai" />
          <FieldError fieldErrors={state.fieldErrors} name="emirate" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Area
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="area" type="text" placeholder="Business Bay" />
          <FieldError fieldErrors={state.fieldErrors} name="area" />
        </label>

        <label className="block text-sm font-medium text-slate-700 md:col-span-2 xl:col-span-1">
          Address
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="address" type="text" />
          <FieldError fieldErrors={state.fieldErrors} name="address" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="phone" type="tel" />
          <FieldError fieldErrors={state.fieldErrors} name="phone" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="email" type="email" />
          <FieldError fieldErrors={state.fieldErrors} name="email" />
        </label>

        <div className="md:col-span-2 xl:col-span-3">
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
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <SubmitButton label="Create branch" pendingLabel="Creating branch..." />
        </div>
      </form>
    </section>
  );
}
