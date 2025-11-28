import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, LogOut, User, Images, ShoppingBag, Calendar, ChevronRight } from 'lucide-react';
import type { Album, Order, Product } from '@/types/supabase';

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

  // Fetch client's albums (albums assigned to this user)
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(6) as { data: Album[] | null };

  // Fetch client's orders with product info
  const { data: orders } = await supabase
    .from('orders')
    .select('*, products(*)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5) as { data: (Order & { products: Product })[] | null };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
      case 'delivered':
      case 'paid':
      case 'fulfilled':
        return 'bg-green-100 text-green-700';
      case 'processing':
      case 'proofing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/portal" className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">EpicMoments</span>
          </Link>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="mt-1 text-slate-600">
            View your photo albums and manage your orders.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Images className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{albums?.length || 0}</p>
                <p className="text-sm text-slate-500">Photo Albums</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{orders?.length || 0}</p>
                <p className="text-sm text-slate-500">Orders</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {albums?.filter(a => a.status === 'ready' || a.status === 'delivered').length || 0}
                </p>
                <p className="text-sm text-slate-500">Ready to View</p>
              </div>
            </div>
          </div>
        </div>

        {/* Albums Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Your Albums</h2>
            {albums && albums.length > 0 && (
              <Link
                href="/portal/albums"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {albums && albums.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/album/${album.share_token}`}
                  className="group rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-100">
                    {album.cover_image_key ? (
                      <Image
                        src={album.cover_image_key}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Images className="h-12 w-12 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">{album.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {album.image_count} photos
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusColor(album.status)}`}
                      >
                        {album.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-white p-12 text-center">
              <Images className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 font-semibold text-slate-900">No albums yet</h3>
              <p className="mt-1 text-sm text-slate-500">
                Your photo albums will appear here once they&apos;re ready.
              </p>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            {orders && orders.length > 0 && (
              <Link
                href="/portal/orders"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {orders && orders.length > 0 ? (
            <div className="rounded-xl border bg-white shadow-sm">
              <div className="divide-y">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-slate-100 p-2">
                        <ShoppingBag className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {order.products?.name || 'Product'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-900">
                        {formatPrice(order.amount_cents)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-white p-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 font-semibold text-slate-900">No orders yet</h3>
              <p className="mt-1 text-sm text-slate-500">
                Your purchases will appear here.
              </p>
              <Link
                href="/shop"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Browse Packages
              </Link>
            </div>
          )}
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
