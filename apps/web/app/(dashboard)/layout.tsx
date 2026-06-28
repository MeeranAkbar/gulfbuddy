import Link from 'next/link';
import { 
  Squares2X2Icon, 
  RectangleStackIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Squares2X2Icon },
  { name: 'My Ads', href: '/dashboard/listings', icon: RectangleStackIcon },
  { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-[var(--border-subtle)] bg-[var(--surface)] backdrop-blur-xl hidden lg:block">
        <div className="flex h-16 items-center border-b border-[var(--border-subtle)] px-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">GulfBuddy</span>
            <span className="rounded bg-brand-primary/20 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-brand-primary">Pro</span>
          </Link>
        </div>

        <div className="flex h-[calc(100vh-4rem)] flex-col justify-between p-4">
          <nav className="space-y-1">
            <Link 
              href="/post" 
              className="group mb-6 flex w-full items-center justify-center space-x-2 rounded-[1rem] bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:bg-brand-primary/90 hover:scale-[1.02]"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Post New Ad</span>
            </Link>

            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-white/5 hover:text-white"
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-white/50 transition-colors group-hover:text-white" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="space-y-1">
            <Link
              href="/"
              className="group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-white/5 hover:text-white"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0 text-white/50 transition-colors group-hover:text-white" aria-hidden="true" />
              Back to Public
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)]/80 px-4 backdrop-blur-xl lg:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">GulfBuddy</span>
            <span className="rounded bg-brand-primary/20 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-brand-primary">Pro</span>
          </Link>
        </header>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
