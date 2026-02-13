import Link from 'next/link';
import { Camera, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface NavigationProps {
  showAuthButtons?: boolean;
}

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/shop', label: 'Shop' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export async function Navigation({ showAuthButtons = true }: NavigationProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's role to determine which dashboard to link to
  let dashboardLink = '/portal';
  let dashboardLabel = 'My Portal';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'tenant_admin' || profile?.role === 'tenant_owner' || profile?.role === 'tenant_staff') {
      dashboardLink = '/admin';
      dashboardLabel = 'Dashboard';
    } else if (profile?.role === 'platform_admin') {
      dashboardLink = '/platform';
      dashboardLabel = 'Platform Admin';
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Camera className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-slate-900">EpicMoments</span>
        </Link>

        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {showAuthButtons && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <User className="h-4 w-4" />
                  {dashboardLabel}
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
