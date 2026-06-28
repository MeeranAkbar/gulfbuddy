'use client';

import { useActionState } from 'react';
import type { PropertyComplianceDocumentActionState } from '../../app/(workspace)/listings/actions';
import { SubmitButton } from '../forms/submit-button';

const initialPropertyComplianceDocumentState: PropertyComplianceDocumentActionState = {
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

export function PropertyComplianceDocumentForm({
  listingId,
  action
}: {
  listingId: string;
  action: (
    state: PropertyComplianceDocumentActionState,
    formData: FormData
  ) => Promise<PropertyComplianceDocumentActionState>;
}) {
  const [state, formAction] = useActionState(action, initialPropertyComplianceDocumentState);

  return (
    <form action={formAction} className="space-y-4 rounded-[1.25rem] border border-slate-200 bg-white p-4">
      <input type="hidden" name="listingId" value={listingId} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-medium text-slate-700">
          Document type
          <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="documentType" defaultValue="permit_pdf">
            <option value="permit_pdf">Permit PDF</option>
            <option value="trakheesi_certificate">Trakheesi certificate</option>
            <option value="madmoun_qr_reference">Madmoun QR reference</option>
            <option value="broker_card">Broker card</option>
            <option value="agency_license">Agency license</option>
            <option value="developer_license">Developer license</option>
            <option value="title_deed">Title deed</option>
            <option value="ejari">Ejari</option>
            <option value="holiday_home_permit">Holiday home permit</option>
            <option value="other">Other evidence</option>
          </select>
          <FieldError fieldErrors={state.fieldErrors} name="documentType" />
        </label>

        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Document label
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            name="documentLabel"
            type="text"
            placeholder="Dubai Marina permit PDF"
          />
          <FieldError fieldErrors={state.fieldErrors} name="documentLabel" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          File name
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="fileName" type="text" placeholder="permit.pdf" />
          <FieldError fieldErrors={state.fieldErrors} name="fileName" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Document URL
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            name="accessUrl"
            type="url"
            placeholder="https://..."
          />
          <FieldError fieldErrors={state.fieldErrors} name="accessUrl" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Storage path
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            name="storagePath"
            type="text"
            placeholder="property-compliance/listing-id/permit.pdf"
          />
          <FieldError fieldErrors={state.fieldErrors} name="storagePath" />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Reviewer note
        <textarea
          className="mt-2 min-h-28 w-full rounded-[1.5rem] border border-slate-200 px-4 py-3"
          name="notes"
          placeholder="Explain what this evidence proves, for example permit source, broker linkage, or ownership proof."
        />
        <FieldError fieldErrors={state.fieldErrors} name="notes" />
      </label>

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

      <SubmitButton label="Attach compliance evidence" pendingLabel="Attaching evidence..." />
    </form>
  );
}
