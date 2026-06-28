import { 
  UserCircleIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your profile, verification status, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            <a href="#" className="flex items-center rounded-xl bg-white/5 px-3 py-2.5 text-sm font-semibold text-white">
              <UserCircleIcon className="mr-3 h-5 w-5 text-brand-primary" />
              Public Profile
            </a>
            <a href="#" className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-white/5 hover:text-white transition-colors">
              <ShieldCheckIcon className="mr-3 h-5 w-5 text-white/50" />
              Verification <span className="ml-auto rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-500">Verified</span>
            </a>
            <a href="#" className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-white/5 hover:text-white transition-colors">
              <BellIcon className="mr-3 h-5 w-5 text-white/50" />
              Notifications
            </a>
          </nav>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] shadow-[var(--shadow-lg)]">
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Public Profile</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">This information will be displayed publicly so be careful what you share.</p>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 border-b border-[var(--border-subtle)] pb-8">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[var(--border-subtle)]">
                  <Image 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Profile" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <button type="button" className="rounded-lg bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 transition-colors">
                    Change avatar
                  </button>
                  <p className="mt-2 text-xs text-[var(--text-secondary)]">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <form className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">First name</label>
                    <div className="mt-2">
                      <input type="text" name="first-name" id="first-name" defaultValue="John" className="block w-full rounded-xl border-0 bg-[var(--surface)] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/30 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6" />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">Last name</label>
                    <div className="mt-2">
                      <input type="text" name="last-name" id="last-name" defaultValue="Doe" className="block w-full rounded-xl border-0 bg-[var(--surface)] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/30 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6" />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">Username</label>
                    <div className="mt-2">
                      <div className="flex rounded-xl bg-[var(--surface)] ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-primary">
                        <span className="flex select-none items-center pl-4 text-white/30 sm:text-sm">gulfbuddy.com/user/</span>
                        <input type="text" name="username" id="username" defaultValue="johndoe123" className="block flex-1 border-0 bg-transparent py-3 pl-1 text-white placeholder:text-white/30 focus:ring-0 sm:text-sm sm:leading-6" />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">About</label>
                    <div className="mt-2">
                      <textarea id="about" name="about" rows={3} defaultValue="Premium seller on GulfBuddy specializing in electronics and motors." className="block w-full rounded-xl border-0 bg-[var(--surface)] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/30 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6" />
                    </div>
                    <p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">Write a few sentences about yourself.</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-x-6 border-t border-[var(--border-subtle)] pt-6">
                  <button type="button" className="text-sm font-semibold leading-6 text-white hover:text-brand-primary transition-colors">Cancel</button>
                  <button type="submit" className="gh-button-primary">Save Profile</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
