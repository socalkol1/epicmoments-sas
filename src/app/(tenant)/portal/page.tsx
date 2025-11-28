import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Camera, LogOut, User } from 'lucide-react';

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: { full_name: string | null; role: string; tenant_id: string | null } | null };

  // Get company/studio name from user metadata or tenant
  const metadata = user.user_metadata;
  let companyName = metadata?.studio_name || metadata?.company_name || null;

  // If user has a tenant, get the tenant name
  if (profile?.tenant_id) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('name')
      .eq('id', profile.tenant_id)
      .single();
    if (tenant) {
      companyName = tenant.name;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">PhotoStudio</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <User className="h-4 w-4" />
                <span className="font-medium">{profile?.full_name || user.email}</span>
              </div>
              {companyName && (
                <span className="text-xs text-slate-500">{companyName}</span>
              )}
            </div>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome to your portal</h1>
          <p className="mt-1 text-slate-600">
            You&apos;re logged in as {user.email}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Your Profile</h2>
          <dl className="space-y-3">
            <div className="flex gap-2">
              <dt className="font-medium text-slate-500">Name:</dt>
              <dd className="text-slate-900">{profile?.full_name || 'Not set'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-slate-500">Email:</dt>
              <dd className="text-slate-900">{user.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-slate-500">Company:</dt>
              <dd className="text-slate-900">{companyName || 'Not set'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-slate-500">Role:</dt>
              <dd className="text-slate-900 capitalize">{profile?.role?.replace('_', ' ') || 'client'}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
