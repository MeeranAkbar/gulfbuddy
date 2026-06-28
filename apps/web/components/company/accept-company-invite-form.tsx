'use client';

import { useActionState } from 'react';
import type { AcceptCompanyInviteActionState } from '../../app/(auth)/accept-invite/actions';
import { SubmitButton } from '../forms/submit-button';

const initialAcceptCompanyInviteState: AcceptCompanyInviteActionState = {
  status: 'idle'
};

export function AcceptCompanyInviteForm({
  token,
  action
}: {
  token: string;
  action: (state: AcceptCompanyInviteActionState, formData: FormData) => Promise<AcceptCompanyInviteActionState>;
}) {
  const [state, formAction] = useActionState(action, initialAcceptCompanyInviteState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="token" value={token} />
      {state.message ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.message}</p>
      ) : null}
      <SubmitButton label="Accept company invite" pendingLabel="Joining company..." />
    </form>
  );
}
