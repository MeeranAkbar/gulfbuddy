interface ServicesOrderPageProps {
  params: Promise<{ publicOrderRef: string }>;
}

export default async function ServicesOrderPage({ params }: ServicesOrderPageProps) {
  const { publicOrderRef } = await params;

  return (
    <div className="rounded-shell border border-white/70 bg-white/85 p-8 shadow-lift">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Order Tracking Route</p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-950">{publicOrderRef}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
        This route is reserved for authenticated customers and providers to view shared order progress with appropriate privacy and role checks.
      </p>
    </div>
  );
}
