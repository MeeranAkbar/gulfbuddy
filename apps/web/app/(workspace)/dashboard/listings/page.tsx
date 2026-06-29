import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { PlusIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const prisma = new PrismaClient();

export default async function DashboardListingsPage() {
  const session = await getServerSession();
  const userId = session?.user?.id || 'mock_user_123';

  // Fetch ads from database
  const ads = await prisma.ad.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Listings</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage all your active and expired ads across the platform.</p>
        </div>
        <Link href="/post" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 font-bold text-white shadow-md hover:bg-opacity-90">
          <PlusIcon className="h-5 w-5" />
          Post New Ad
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface-alt)] p-12 text-center">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">No listings yet</h3>
          <p className="text-[var(--text-secondary)] mt-2 mb-6">You haven't posted any ads. Start selling or renting today!</p>
          <Link href="/post" className="inline-block rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white shadow-sm hover:shadow-md">
            Create your first Ad
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-alt)] text-[var(--text-secondary)]">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Ad Details</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Price</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-[var(--surface-alt)] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[var(--text-primary)] line-clamp-1">{ad.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">ID: {ad.id.split('-')[0]}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {ad.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                    AED {ad.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      ad.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors rounded-lg hover:bg-[var(--surface)]">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors rounded-lg hover:bg-[var(--surface)]">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
