'use client';

import { useActionState } from 'react';
import type { PropertyComplianceDocumentReviewActionState } from '../../app/(admin)/admin/compliance/actions';
import { SubmitButton } from '../forms/submit-button';

const initialPropertyComplianceDocumentReviewState: PropertyComplianceDocumentReviewActionState = {
  status: 'idle'
};

export function PropertyComplianceDocumentReviewForm({
  documentId,
  currentReviewState,
  action
}: {
  documentId: string;
  currentReviewState: string;
  action: (
    state: PropertyComplianceDocumentReviewActionState,
    formData: FormData
  ) => Promise<PropertyComplianceDocumentReviewActionState>;
}) {
  const [state, formAction] = useActionState(action, initialPropertyComplianceDocumentReviewState);

  return (
    <form action={formAction} className="space-y-3 rounded-[1rem] border border-slate-200 bg-white p-4">
      <input type="hidden" name="documentId" value={documentId} />

      <div className="grid gap-3 md:grid-cols-[1fr_1.25fr_auto] md:items-end">
        <label className="block text-sm font-medium text-slate-700">
          Review state
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            defaultValue={currentReviewState}
            name="reviewState"
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="needs_more_info">Needs more info</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Review note
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            name="notes"
            placeholder="Optional reviewer note"
            type="text"
          />
        </label>

        <SubmitButton label="Update evidence" pendingLabel="Saving..." tone="secondary" />
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
    </form>
  );
}
