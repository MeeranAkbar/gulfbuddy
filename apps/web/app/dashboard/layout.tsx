import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // If no user is logged in, and we aren't mocking it, redirect to home.
  // For prototype purposes, we won't strictly redirect so you can preview the UI.
  // if (!session) {
  //   redirect("/");
  // }

  const plan = session?.user?.plan || "FREE";

  return (
    <div className="min-h-screen bg-[var(--background-elevated)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--surface)] border-r border-[var(--border-subtle)] flex flex-col">
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">My Account</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{session?.user?.email || "Guest User"}</p>
          
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-alt)] px-3 py-1.5">
            <div className={`h-2 w-2 rounded-full ${plan === 'FREE' ? 'bg-gray-400' : 'bg-[var(--accent)]'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">{plan} PLAN</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard/listings" className="block px-4 py-3 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] font-semibold">
            My Listings
          </Link>
          <Link href="#" className="block px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text-primary)] font-medium transition-colors">
            Messages
          </Link>
          <Link href="#" className="block px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text-primary)] font-medium transition-colors">
            Account Settings
          </Link>
        </nav>

        {plan === 'FREE' && (
          <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <h3 className="font-bold">Upgrade to Pro</h3>
            <p className="text-xs text-white/80 mt-1 mb-3">Remove ads and unlock premium features.</p>
            <button className="w-full py-2 bg-white text-purple-600 text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-shadow">
              Upgrade Now
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
