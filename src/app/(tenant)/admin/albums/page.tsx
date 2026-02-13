import { createClient } from '@/lib/supabase/server';
import type { Tag, Album } from '@/types/supabase';
import { AlbumsListClient } from './AlbumsListClient';

export type AlbumWithTags = Album & { tags: Tag[] };

export default async function AdminAlbumsPage() {
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

  // Fetch albums
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  // Fetch all tags for this tenant
  const { data: allTags } = await supabase
    .from('tags')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name');

  // Fetch album-tag relationships
  const { data: albumTagRelations } = await supabase
    .from('album_tags')
    .select('album_id, tag_id')
    .eq('tenant_id', tenantId);

  // Build a map of album_id -> tags
  const tagMap = new Map<string, Tag[]>();
  if (albumTagRelations && allTags) {
    const tagLookup = new Map(allTags.map((t) => [t.id, t]));
    for (const rel of albumTagRelations) {
      const tag = tagLookup.get(rel.tag_id);
      if (tag) {
        const existing = tagMap.get(rel.album_id) ?? [];
        existing.push(tag);
        tagMap.set(rel.album_id, existing);
      }
    }
  }

  const albumsWithTags: AlbumWithTags[] = (albums ?? []).map((album) => ({
    ...album,
    tags: tagMap.get(album.id) ?? [],
  }));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Albums</h1>
        <p className="mt-1 text-slate-600">
          Manage your photo albums and their tags
        </p>
      </div>

      <AlbumsListClient
        initialAlbums={albumsWithTags}
        allTags={allTags ?? []}
      />
    </div>
  );
}
