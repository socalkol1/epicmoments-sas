import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Camera,
  LayoutDashboard,
  Images,
  Users,
  LogOut,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, tenant_id')
    .eq('id', user.id)
    .single();

  let tenantName = 'Studio';
  if (profile?.tenant_id) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('name')
      .eq('id', profile.tenant_id)
      .single();
    if (tenant) tenantName = tenant.name;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/albums', label: 'Albums', icon: Images },
    { href: '/admin/clients', label: 'Clients', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Camera className="h-7 w-7 text-blue-600" />
          <div>
            <p className="text-sm font-bold text-slate-900">EpicMoments</p>
            <p className="text-xs text-slate-500">{tenantName}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="mb-3 text-sm">
            <p className="font-medium text-slate-900">
              {profile?.full_name || user.email}
            </p>
            <p className="text-xs capitalize text-slate-500">
              {profile?.role?.replace('_', ' ')}
            </p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <Camera className="h-7 w-7 text-blue-600" />
            <span className="font-bold">EpicMoments</span>
          </Link>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
