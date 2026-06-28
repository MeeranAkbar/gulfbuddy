'use client';

import { useActionState, useMemo, useState } from 'react';
import { companyRoles } from '@gulfbuddy/types';
import type { CompanyMemberAssignmentActionState } from '../../app/(workspace)/company/members/actions';
import type { WorkspaceBranchSummary, WorkspaceCompanySummary } from '../../lib/company/queries';
import { SubmitButton } from '../forms/submit-button';

const initialCompanyMemberAssignmentState: CompanyMemberAssignmentActionState = {
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

export function CompanyMemberAssignmentForm({
  companies,
  branches,
  action
}: {
  companies: WorkspaceCompanySummary[];
  branches: WorkspaceBranchSummary[];
  action: (
    state: CompanyMemberAssignmentActionState,
    formData: FormData
  ) => Promise<CompanyMemberAssignmentActionState>;
}) {
  const [state, formAction] = useActionState(action, initialCompanyMemberAssignmentState);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');

  const companyBranches = useMemo(
    () => branches.filter((branch) => branch.company_id === selectedCompanyId),
    [branches, selectedCompanyId]
  );

  if (!companies.length) {
    return null;
  }

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Assign seat</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Add an existing platform user into the company workspace with the right role.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          This v1 seat flow uses the user email of an already-registered platform account. Full email invite automation can come next.
        </p>
      </div>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-medium text-slate-700">
          Company
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            name="companyId"
            value={selectedCompanyId}
            onChange={(event) => setSelectedCompanyId(event.target.value)}
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.display_name}
              </option>
            ))}
          </select>
          <FieldError fieldErrors={state.fieldErrors} name="companyId" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          User email
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            name="email"
            type="email"
            placeholder="agent@example.com"
          />
          <FieldError fieldErrors={state.fieldErrors} name="email" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Role
          <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="role" defaultValue="publisher">
            {companyRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <FieldError fieldErrors={state.fieldErrors} name="role" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Branch
          <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="branchId" defaultValue="">
            <option value="">No branch</option>
            {companyBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <FieldError fieldErrors={state.fieldErrors} name="branchId" />
        </label>

        <div className="md:col-span-2 xl:col-span-4">
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

        <div className="md:col-span-2 xl:col-span-4">
          <SubmitButton label="Assign company seat" pendingLabel="Assigning seat..." />
        </div>
      </form>
    </section>
  );
}
