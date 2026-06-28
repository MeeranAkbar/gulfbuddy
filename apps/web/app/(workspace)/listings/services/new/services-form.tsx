'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { ServicesDraftActionState } from './actions';
import type { WorkspaceBranchSummary, WorkspaceCompanySummary } from '../../../../../lib/company/queries';
import { SubmitButton } from '../../../../../components/forms/submit-button';

const initialServicesDraftState: ServicesDraftActionState = {
  status: 'idle'
};

const servicePricingModels = [
  { value: 'quote_based', label: 'Quote Based' },
  { value: 'fixed_price', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'package', label: 'Package Deal' },
  { value: 'emergency', label: 'Emergency Fixed' }
];

const serviceCategories = [
  'AC Maintenance & Repair',
  'Home & Commercial Cleaning',
  'Moving & Storage',
  'Renovation & Fit-out',
  'Plumbing & Electrical',
  'Beauty & Wellness',
  'Business Support & Legal',
  'IT Support & Gadget Repair',
  'Academic Tutoring'
];

export function ServicesDraftForm({
  companies,
  branches,
  action
}: {
  companies: WorkspaceCompanySummary[];
  branches: WorkspaceBranchSummary[];
  action: (state: ServicesDraftActionState, formData: FormData) => Promise<ServicesDraftActionState>;
}) {
  const [state, formAction] = useActionState(action, initialServicesDraftState);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const availableBranches = branches.filter((branch) => branch.company_id === selectedCompanyId);

  if (!companies.length) {
    return (
      <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">Workspace Required</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Setup a company workspace before publishing service deals.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
          Linking listings to business workspace ensures verified provider alignment, commission ledgers, and unified branch service zones.
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Services Draft Composer</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Specify service categories and pricing terms.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          This saves a service draft in your workspace. Once saved, you can add past portfolio images, highlight emergency hours, and activate.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700 xl:col-span-2">
            Provider Company Workspace *
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
            Dispatch Branch / Office
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="branchId" defaultValue="">
              <option value="">No branch / Main dispatch hub</option>
              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                  {branch.emirate ? ` - ${branch.emirate}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Service Category *
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="category" defaultValue={serviceCategories[0]}>
              {serviceCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block text-sm font-medium text-slate-700 xl:col-span-2">
            Service Offering Title *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="title" type="text" placeholder="Deep Cleaning Services for Apartments" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Provider Brand Name *
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="providerName" type="text" placeholder="Fast Jaguar Cleaners" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Subcategory
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="subcategory" type="text" placeholder="Post-construction / Move-in" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Duration Estimate
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="durationEstimate" type="text" placeholder="3-5 hours" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            Pricing Model *
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="pricingModel" defaultValue="quote_based">
              {servicePricingModels.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Base / Starting Price (AED)
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="priceAmount" type="number" min="0" placeholder="199" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Emirate Coverage *
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
            Service Area Neighborhood
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="area" type="text" placeholder="Dubai Marina / JVC" />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Service Description & Scope *
          <textarea
            className="mt-2 min-h-40 w-full rounded-[1.5rem] border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]"
            name="description"
            placeholder="Describe what tasks this service covers, what tools/supplies you bring, and any booking options."
            required
          />
        </label>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Service Contact Layer</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">Set where service requests and customer calls route.</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block text-sm font-medium text-slate-700">
              Service Hotline Phone
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicPhone" type="tel" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              WhatsApp Booking
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicWhatsapp" type="tel" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Booking Email
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="publicEmail" type="email" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Preferred Contact
              <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 bg-[var(--background-elevated)]" name="preferredContactMethod" defaultValue="whatsapp">
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
          <SubmitButton label="Save service draft" pendingLabel="Saving service draft..." />
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
