'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { PropertyDraftActionState } from '../../app/(workspace)/listings/property/new/actions';
import type { WorkspaceBranchSummary, WorkspaceCompanySummary } from '../../lib/company/queries';
import { SubmitButton } from '../forms/submit-button';

const initialPropertyDraftState: PropertyDraftActionState = {
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

export function PropertyDraftForm({
  companies,
  branches,
  action
}: {
  companies: WorkspaceCompanySummary[];
  branches: WorkspaceBranchSummary[];
  action: (state: PropertyDraftActionState, formData: FormData) => Promise<PropertyDraftActionState>;
}) {
  const [state, formAction] = useActionState(action, initialPropertyDraftState);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const availableBranches = branches.filter((branch) => branch.company_id === selectedCompanyId);

  if (!companies.length) {
    return (
      <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">Company required</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Create a company workspace before you start regulated property posting.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
          Property drafts should stay tied to a real business record so compliance, team permissions, branches, campaigns, and reporting all
          remain traceable.
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Draft composer</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Save the first property draft with the company, compliance, and public contact trail attached.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          This saves a controlled draft first. Publication and compliance approval can stay separate in the next workflow stage.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700 xl:col-span-2">
            Company workspace
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
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
            <FieldError fieldErrors={state.fieldErrors} name="ownerCompanyId" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Branch
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="branchId" defaultValue="">
              <option value="">No branch yet</option>
              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                  {branch.emirate ? ` - ${branch.emirate}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Advertiser type
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="advertiserType" defaultValue="agency">
              <option value="agency">Agency</option>
              <option value="agent">Agent</option>
              <option value="developer">Developer</option>
              <option value="owner">Owner</option>
              <option value="holiday_home_operator">Holiday home operator</option>
            </select>
            <FieldError fieldErrors={state.fieldErrors} name="advertiserType" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block text-sm font-medium text-slate-700">
            Market mode
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="marketMode" defaultValue="long_term">
              <option value="long_term">Long term</option>
              <option value="short_term">Short term</option>
              <option value="off_plan">Off-plan</option>
              <option value="new_project">New project</option>
            </select>
            <FieldError fieldErrors={state.fieldErrors} name="marketMode" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Purpose
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="purpose" defaultValue="sale">
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
            <FieldError fieldErrors={state.fieldErrors} name="purpose" />
          </label>
          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Property type
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="propertyType" type="text" placeholder="Apartment" />
            <FieldError fieldErrors={state.fieldErrors} name="propertyType" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Property subtype
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="propertySubtype" type="text" placeholder="Studio" />
            <FieldError fieldErrors={state.fieldErrors} name="propertySubtype" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            Emirate
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="emirate" defaultValue="Dubai">
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
              <option value="Fujairah">Fujairah</option>
            </select>
            <FieldError fieldErrors={state.fieldErrors} name="emirate" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Area
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="area" type="text" placeholder="Dubai Marina" />
            <FieldError fieldErrors={state.fieldErrors} name="area" />
          </label>
          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Location text
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="locationText" type="text" placeholder="Marina Gate 1, Dubai Marina" />
            <FieldError fieldErrors={state.fieldErrors} name="locationText" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Listing title
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="title" type="text" placeholder="2BR apartment for sale in Dubai Marina" />
            <FieldError fieldErrors={state.fieldErrors} name="title" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Price (AED)
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="priceAmount" type="number" min="0" step="0.01" />
            <FieldError fieldErrors={state.fieldErrors} name="priceAmount" />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            className="mt-2 min-h-40 w-full rounded-[1.5rem] border border-slate-200 px-4 py-3"
            name="description"
            placeholder="Write a clean factual description. Mention location, layout, condition, and trust-worthy details."
          />
          <FieldError fieldErrors={state.fieldErrors} name="description" />
        </label>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            Bedrooms
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="bedrooms" type="number" min="0" />
            <FieldError fieldErrors={state.fieldErrors} name="bedrooms" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Bathrooms
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="bathrooms" type="number" min="0" />
            <FieldError fieldErrors={state.fieldErrors} name="bathrooms" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Size (sqft)
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="sizeSqft" type="number" min="0" step="0.01" />
            <FieldError fieldErrors={state.fieldErrors} name="sizeSqft" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Rent frequency
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="rentFrequency" defaultValue="">
              <option value="">Not applicable</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <FieldError fieldErrors={state.fieldErrors} name="rentFrequency" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            Furnishing
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="furnishing" defaultValue="">
              <option value="">Not specified</option>
              <option value="furnished">Furnished</option>
              <option value="semi_furnished">Semi-furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
            <FieldError fieldErrors={state.fieldErrors} name="furnishing" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Completion status
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="completionStatus" defaultValue="">
              <option value="">Not specified</option>
              <option value="ready">Ready</option>
              <option value="off_plan">Off-plan</option>
              <option value="under_construction">Under construction</option>
            </select>
            <FieldError fieldErrors={state.fieldErrors} name="completionStatus" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Building
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="buildingName" type="text" />
            <FieldError fieldErrors={state.fieldErrors} name="buildingName" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Community
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="communityName" type="text" />
            <FieldError fieldErrors={state.fieldErrors} name="communityName" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700">
            Project name
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="projectName" type="text" />
            <FieldError fieldErrors={state.fieldErrors} name="projectName" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Permit number
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="permitNumber" type="text" />
            <FieldError fieldErrors={state.fieldErrors} name="permitNumber" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Permit QR / verification payload
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="permitQrPayload" type="text" />
          </label>
        </div>
        <p className="text-sm leading-7 text-slate-600">
          Permit system is inferred automatically from the selected emirate and market mode. Dubai drafts follow the Trakheesi or holiday-home
          lane, Abu Dhabi follows the Dari lane, and other emirates stay in a softer review lane until tighter local rules are applied.
        </p>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Public contact layer</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">Set the contact methods buyers will see after this draft enters the live workflow.</h3>
            </div>
            <p className="max-w-lg text-sm leading-7 text-slate-600">
              Click-to-reveal stays available later. For now, this draft stores the public contact trail in one controlled place.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block text-sm font-medium text-slate-700">
              Public phone
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="publicPhone" type="tel" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Public WhatsApp
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="publicWhatsapp" type="tel" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Public email
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="publicEmail" type="email" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Preferred method
              <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" name="preferredContactMethod" defaultValue="phone">
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm font-medium text-slate-700">
            <input className="h-4 w-4 rounded border-slate-300" name="hideNumberUntilClick" type="checkbox" value="on" />
            Hide the phone number until the visitor taps reveal or contact.
          </label>
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
            Draft listing slug reserved: <span className="font-semibold text-slate-950">{state.listingSlug}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton label="Save property draft" pendingLabel="Saving property draft..." />
          <Link
            href="/company"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            Back to company hub
          </Link>
        </div>
      </form>
    </section>
  );
}
