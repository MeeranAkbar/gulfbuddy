import Link from 'next/link';

const publishSteps = [
  {
    title: 'Ownership and company lane',
    detail: 'Choose owner, agency, broker, developer, or holiday-home operator correctly so moderation and public trust badges follow the right rules.'
  },
  {
    title: 'Property details',
    detail: 'Capture purpose, property type, building, area, beds, baths, size, furnishing, and market mode without mixing long-term and short-term logic.'
  },
  {
    title: 'Permit and compliance',
    detail: 'Dubai listings should support Trakheesi + Madmoun references. Abu Dhabi should support Dari website permit references.'
  },
  {
    title: 'Media and public trust',
    detail: 'Publish strong imagery, useful floorplans, and visible listing trust signals instead of generic marketing clutter.'
  }
];

const marketModes = [
  {
    name: 'Dubai long-term',
    description: 'Sale and rent inventory for agencies, brokers, and owner-reviewed listings.',
    chips: ['Sale', 'Rent', 'Permit-backed', 'Area SEO']
  },
  {
    name: 'Off-plan and new projects',
    description: 'Developer-first inventory with launch pages, handover data, and premium placement logic.',
    chips: ['Off-plan', 'New projects', 'Developer profile', 'Launch packages']
  },
  {
    name: 'Short-term and holiday homes',
    description: 'Daily and short-term stock kept separate from residential long-term inventory for cleaner search and stricter rules.',
    chips: ['Daily', 'Weekly', 'Holiday home', 'Manual review']
  }
];

const complianceSignals = [
  'Trakheesi permit reference',
  'Madmoun / QR-ready field',
  'Advertiser type and poster traceability',
  'Branch or company ownership link',
  'Manual review flag for regulated lanes'
];

export function PropertyComposeShell() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Property composer</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Build the Dubai-first publishing lane before scaling to other regulated property flows.</h2>
            </div>
            <Link
              href="/admin/compliance"
              className="inline-flex rounded-full border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Review compliance queues
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {publishSteps.map((step, index) => (
              <div key={step.title} className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Step {index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Compliance rails</p>
          <h2 className="mt-3 text-2xl font-semibold">Keep regulated property inventory traceable from day one.</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {complianceSignals.map((signal) => (
              <li key={signal} className="rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3">
                {signal}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Inventory lanes</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Separate the right property modes instead of shoving everything into one generic post form.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            This keeps SEO cleaner, compliance easier, and premium product logic safer for agencies, developers, and future holiday-home operators.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {marketModes.map((mode) => (
            <article key={mode.name} className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-5">
              <h3 className="text-lg font-semibold text-slate-950">{mode.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{mode.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mode.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
