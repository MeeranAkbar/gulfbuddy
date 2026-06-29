import { 
  EyeIcon, 
  ChatBubbleLeftIcon, 
  HeartIcon, 
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const stats = [
  { name: 'Total Views', value: '12,405', change: '+12%', changeType: 'positive', icon: EyeIcon },
  { name: 'Active Leads', value: '34', change: '+4.1%', changeType: 'positive', icon: ChatBubbleLeftIcon },
  { name: 'Saves / Favorites', value: '189', change: '+1.2%', changeType: 'positive', icon: HeartIcon },
  { name: 'Conversion Rate', value: '2.4%', change: '-0.4%', changeType: 'negative', icon: ChartBarIcon },
];

const activity = [
  { id: 1, type: 'message', content: 'New message from John about "Mercedes G63"', date: '1 hour ago' },
  { id: 2, type: 'lead', content: 'Ahmed requested a viewing for "Dubai Marina Appt"', date: '3 hours ago' },
  { id: 3, type: 'system', content: 'Your ad "Sony A7IV" is now live!', date: '1 day ago' },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold text-ink">Overview</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Welcome back! Here is what is happening with your inventory today.</p>
      </div>

      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="gh-card p-5"
          >
            <dt>
              <div className="absolute rounded-xl bg-[var(--surface-muted)] p-3">
                <item.icon className="h-6 w-6 text-[var(--primary)]" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-semibold text-[var(--text-secondary)]">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-bold text-ink">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="gh-card p-6">
          <h2 className="text-lg font-bold text-ink mb-6">Recent Activity</h2>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {activity.map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== activity.length - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-[var(--border-subtle)]" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] ring-4 ring-[var(--surface)]">
                          {event.type === 'message' ? <ChatBubbleLeftIcon className="h-4 w-4 text-ink" /> : <EyeIcon className="h-4 w-4 text-ink" />}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm font-medium text-ink">{event.content}</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-xs font-semibold text-[var(--text-secondary)]">
                          <time dateTime={event.date}>{event.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="gh-card p-6">
          <h2 className="text-lg font-bold text-ink mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/listings/new" className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 transition-all hover:border-[var(--primary)] hover:bg-[var(--surface-muted)]">
              <span className="rounded-full bg-white p-3 mb-3 shadow-sm">
                <PlusIcon className="h-6 w-6 text-[var(--primary)]" />
              </span>
              <span className="text-sm font-bold text-ink">Post New Ad</span>
            </Link>
            <Link href="/dashboard/messages" className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 transition-all hover:border-[var(--primary)] hover:bg-[var(--surface-muted)]">
              <span className="rounded-full bg-white p-3 mb-3 shadow-sm">
                <ChatBubbleLeftIcon className="h-6 w-6 text-[var(--primary)]" />
              </span>
              <span className="text-sm font-bold text-ink">View Messages</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
