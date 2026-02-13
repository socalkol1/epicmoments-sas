import { createClient } from '@/lib/supabase/server';
import type { Tag, Profile } from '@/types/supabase';
import { ClientsListClient } from './ClientsListClient';

export type ClientWithTags = Profile & { tags: Tag[]; albumCount: number };

export default async function AdminClientsPage() {
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

  // Fetch client profiles
  const { data: clients } = await supabase
    .from('profiles')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  // Fetch all tags for this tenant
  const { data: allTags } = await supabase
    .from('tags')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name');

  // Fetch profile-tag relationships
  const { data: profileTagRelations } = await supabase
    .from('profile_tags')
    .select('profile_id, tag_id')
    .eq('tenant_id', tenantId);

  // Fetch album counts per client
  const { data: albums } = await supabase
    .from('albums')
    .select('client_id')
    .eq('tenant_id', tenantId)
    .not('client_id', 'is', null);

  const albumCountMap = new Map<string, number>();
  if (albums) {
    for (const album of albums) {
      if (album.client_id) {
        albumCountMap.set(
          album.client_id,
          (albumCountMap.get(album.client_id) ?? 0) + 1
        );
      }
    }
  }

  // Build tag map
  const tagMap = new Map<string, Tag[]>();
  if (profileTagRelations && allTags) {
    const tagLookup = new Map(allTags.map((t) => [t.id, t]));
    for (const rel of profileTagRelations) {
      const tag = tagLookup.get(rel.tag_id);
      if (tag) {
        const existing = tagMap.get(rel.profile_id) ?? [];
        existing.push(tag);
        tagMap.set(rel.profile_id, existing);
      }
    }
  }

  const clientsWithTags: ClientWithTags[] = (clients ?? []).map((client) => ({
    ...client,
    tags: tagMap.get(client.id) ?? [],
    albumCount: albumCountMap.get(client.id) ?? 0,
  }));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="mt-1 text-slate-600">
          Manage your clients and their tags
        </p>
      </div>

      <ClientsListClient
        initialClients={clientsWithTags}
        allTags={allTags ?? []}
      />
    </div>
  );
}
