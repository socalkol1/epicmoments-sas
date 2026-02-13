import { createClient } from '@/lib/supabase/server';
import { Images, Users, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single();

  if (!profile?.tenant_id) return null;

  const tenantId = profile.tenant_id;

  const [albumsResult, clientsResult, ordersResult] = await Promise.all([
    supabase
      .from('albums')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('role', 'client'),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
  ]);

  const stats = [
    {
      label: 'Albums',
      value: albumsResult.count ?? 0,
      icon: Images,
      color: 'bg-blue-100 text-blue-600',
      href: '/admin/albums',
    },
    {
      label: 'Clients',
      value: clientsResult.count ?? 0,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      href: '/admin/clients',
    },
    {
      label: 'Orders',
      value: ordersResult.count ?? 0,
      icon: ShoppingBag,
      color: 'bg-purple-100 text-purple-600',
      href: '/admin',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-600">Overview of your studio</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
