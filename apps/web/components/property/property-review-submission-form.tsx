'use client';

import { useActionState } from 'react';
import type { PropertyReviewSubmissionActionState } from '../../app/(workspace)/listings/actions';
import { SubmitButton } from '../forms/submit-button';

const initialPropertyReviewSubmissionState: PropertyReviewSubmissionActionState = {
  status: 'idle'
};

export function PropertyReviewSubmissionForm({
  listingId,
  publicationState,
  riskState,
  action
}: {
  listingId: string;
  publicationState: string;
  riskState?: string | null;
  action: (
    state: PropertyReviewSubmissionActionState,
    formData: FormData
  ) => Promise<PropertyReviewSubmissionActionState>;
}) {
  const [state, formAction] = useActionState(action, initialPropertyReviewSubmissionState);

  if (!['draft', 'rejected'].includes(publicationState) || (publicationState === 'rejected' && riskState === 'blocked')) {
    return null;
  }

  const label = publicationState === 'rejected' ? 'Resubmit for review' : 'Submit for review';

  return (
    <form action={formAction} className="space-y-3">
      <input name="listingId" type="hidden" value={listingId} />
      <SubmitButton label={label} pendingLabel="Submitting..." />
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
