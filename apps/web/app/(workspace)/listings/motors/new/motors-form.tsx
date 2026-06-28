'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { MotorsDraftActionState } from './actions';
import type { WorkspaceBranchSummary, WorkspaceCompanySummary } from '../../../../../lib/company/queries';
import { SubmitButton } from '../../../../../components/forms/submit-button';

const initialMotorsDraftState: MotorsDraftActionState = {
  status: 'idle'
};

const vehicleTypes = ['sedan', 'suv', 'coupe', 'pickup', 'van', 'wagon', 'convertible', 'hatchback', 'commercial'];
const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
const transmissionTypes = ['automatic', 'manual'];
const vehicleConditions = [
  { value: 'excellent', label: 'Excellent (Like New)' },
  { value: 'good', label: 'Good (Minor Wear)' },
  { value: 'fair', label: 'Fair (Normal Wear)' },
  { value: 'need_work', label: 'Needs Repair' }
];

export function MotorsDraftForm({
  companies,
  branches,
  action
}: {
  companies: WorkspaceCompanySummary[];
  branches: WorkspaceBranchSummary[];
  action: (state: MotorsDraftActionState, formData: FormData) => Promise<MotorsDraftActionState>;
}) {
  const [state, formAction] = useActionState(action, initialMotorsDraftState);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const availableBranches = branches.filter((branch) => branch.company_id === selectedCompanyId);

  if (!companies.length) {
    return (
      <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">Workspace Required</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Setup a dealer workspace before posting vehicle listings.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
          Linking listings to business workspace ensures verified dealer profile alignment, lead assignment, and unified branch operations.
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Motors Draft Composer</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Specify listing details and vehicle specifications.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          This saves a vehicle draft in your workspace catalog. Once saved, you can add images, review alerts, and request visibility bumps.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700 xl:col-span-2">
            Company / Dealer Workspace *
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
            Showroom Branch
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="branchId" defaultValue="">
              <option value="">No branch / Main showroom</option>
              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                  {branch.emirate ? ` - ${branch.emirate}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Vehicle Type *
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="vehicleType" defaultValue="sedan">
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block text-sm font-medium text-slate-700">
            Make / Brand *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="make" type="text" placeholder="Toyota" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Model *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="model" type="text" placeholder="Land Cruiser" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Trim / Spec
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="trim" type="text" placeholder="VXR" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Year *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="year" type="number" min="1950" max="2027" placeholder="2025" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Mileage (km)
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="mileage" type="number" min="0" placeholder="45000" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            Condition *
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="condition" defaultValue="good">
              {vehicleConditions.map((cond) => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Fuel Type
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="fuelType" defaultValue="petrol">
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Transmission
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="transmission" defaultValue="automatic">
              {transmissionTypes.map((trans) => (
                <option key={trans} value={trans}>
                  {trans.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Exterior Color
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="color" type="text" placeholder="White Pearl" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            Area / Showroom Location
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="area" type="text" placeholder="Al Quoz / Souq Al Haraj" />
          </label>
          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Listing Title *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="title" type="text" placeholder="Toyota Land Cruiser 3.5L Twin Turbo VXR" required />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Price (AED) *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="priceAmount" type="number" min="0" step="1" required />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Factual Description *
          <textarea
            className="mt-2 min-h-40 w-full rounded-[1.5rem] border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]"
            name="description"
            placeholder="Write a clear factual description. Mention trim level, specs (GCC or import), service history, and condition highlights."
            required
          />
        </label>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Dealer Contact Layer</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">Set phone, WhatsApp, or email contact details.</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block text-sm font-medium text-slate-700">
              Showroom Phone
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicPhone" type="tel" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              WhatsApp
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicWhatsapp" type="tel" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Inquiries Email
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicEmail" type="email" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Preferred Contact
              <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="preferredContactMethod" defaultValue="phone">
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm font-medium text-slate-700">
            <input className="h-4 w-4 rounded border-slate-300" name="hideNumberUntilClick" type="checkbox" value="on" />
            Hide number until clicked.
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
            Draft reserved slug: <span className="font-semibold text-slate-950">{state.listingSlug}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton label="Save vehicle draft" pendingLabel="Saving vehicle draft..." />
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
