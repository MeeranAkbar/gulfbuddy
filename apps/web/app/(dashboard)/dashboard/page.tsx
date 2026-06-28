import { 
  EyeIcon, 
  ChatBubbleLeftIcon, 
  HeartIcon, 
  ChartBarIcon 
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
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Overview</h1>
        <p className="text-sm text-[var(--text-secondary)]">Welcome back! Here is what is happening with your inventory today.</p>
      </div>

      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5 shadow-[var(--shadow-md)]"
          >
            <dt>
              <div className="absolute rounded-xl bg-brand-primary/10 p-3">
                <item.icon className="h-6 w-6 text-brand-primary" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-[var(--text-secondary)]">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
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
        <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 shadow-[var(--shadow-md)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Recent Activity</h2>
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
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20 ring-4 ring-[var(--surface-alt)]">
                          {event.type === 'message' ? <ChatBubbleLeftIcon className="h-4 w-4 text-brand-primary" /> : <EyeIcon className="h-4 w-4 text-brand-primary" />}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-[var(--text-primary)]">{event.content}</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-[var(--text-secondary)]">
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
        <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 shadow-[var(--shadow-md)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/post" className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 transition-all hover:border-brand-primary/50 hover:bg-white/5">
              <span className="rounded-full bg-brand-primary/20 p-3 mb-3">
                <PlusIcon className="h-6 w-6 text-brand-primary" />
              </span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">Post New Ad</span>
            </Link>
            <Link href="/dashboard/messages" className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 transition-all hover:border-brand-primary/50 hover:bg-white/5">
              <span className="rounded-full bg-blue-500/20 p-3 mb-3">
                <ChatBubbleLeftIcon className="h-6 w-6 text-blue-500" />
              </span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">Check Inbox</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure PlusIcon is imported for the Quick Actions
import { PlusIcon } from '@heroicons/react/24/outline';
