import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Left side: Cinematic Image (hidden on mobile) */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80"
          alt="Dubai Skyline"
          fill
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Brand Text over Image */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">GulfBuddy</span>
          </Link>
          <p className="mt-4 text-xl font-medium leading-8 text-white/90 drop-shadow">
            The premium marketplace for Property, Motors, Jobs, and beyond. Join thousands of verified buyers and sellers today.
          </p>
        </div>
      </div>

      {/* Right side: Auth Pane */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[32rem] xl:w-[40rem] lg:px-20 xl:px-24 bg-[var(--surface-alt)] shadow-2xl z-10">
        {children}
      </div>
    </div>
  );
}
