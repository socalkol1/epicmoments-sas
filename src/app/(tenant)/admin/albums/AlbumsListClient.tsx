'use client';

import { useState, useMemo } from 'react';
import { Search, Images } from 'lucide-react';
import Image from 'next/image';
import { TagFilter } from '@/components/features/TagFilter';
import { TagInput } from '@/components/features/TagInput';
import type { Tag } from '@/types/supabase';
import type { AlbumWithTags } from './page';

interface AlbumsListClientProps {
  initialAlbums: AlbumWithTags[];
  allTags: Tag[];
}

const statusColors: Record<string, string> = {
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  proofing: 'bg-blue-100 text-blue-700',
  draft: 'bg-yellow-100 text-yellow-700',
};

export function AlbumsListClient({
  initialAlbums,
  allTags,
}: AlbumsListClientProps) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          album.title.toLowerCase().includes(q) ||
          album.description?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Tag filter
      if (selectedTagIds.size > 0) {
        const albumTagIds = new Set(album.tags.map((t) => t.id));
        const hasMatchingTag = [...selectedTagIds].some((id) =>
          albumTagIds.has(id)
        );
        if (!hasMatchingTag) return false;
      }

      // Status filter
      if (statusFilter && album.status !== statusFilter) return false;

      return true;
    });
  }, [albums, searchQuery, selectedTagIds, statusFilter]);

  function handleToggleTag(tagId: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  }

  function handleAlbumTagsChange(albumId: string, newTags: Tag[]) {
    setAlbums((prev) =>
      prev.map((a) => (a.id === albumId ? { ...a, tags: newTags } : a))
    );
  }

  const statuses = ['draft', 'processing', 'proofing', 'ready', 'delivered'];

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setStatusFilter(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === null
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                setStatusFilter(statusFilter === s ? null : s)
              }
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <TagFilter
            tags={allTags}
            selectedTagIds={selectedTagIds}
            onToggleTag={handleToggleTag}
            onClear={() => setSelectedTagIds(new Set())}
          />
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-slate-500">
        {filteredAlbums.length} album{filteredAlbums.length !== 1 ? 's' : ''}
        {searchQuery || selectedTagIds.size > 0 || statusFilter
          ? ' found'
          : ''}
      </p>

      {/* Albums list */}
      {filteredAlbums.length > 0 ? (
        <div className="space-y-3">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Cover image */}
              <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {album.cover_image_key ? (
                  <Image
                    src={album.cover_image_key}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Images className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Album info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="mt-0.5 text-sm text-slate-500 line-clamp-1">
                        {album.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                      {album.image_count} photos
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        statusColors[album.status] ?? 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {album.status}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-2">
                  <TagInput
                    entityId={album.id}
                    entityType="album"
                    currentTags={album.tags}
                    onTagsChange={(tags) =>
                      handleAlbumTagsChange(album.id, tags)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-12 text-center">
          <Images className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 font-semibold text-slate-900">No albums found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery || selectedTagIds.size > 0 || statusFilter
              ? 'Try adjusting your filters.'
              : 'Create your first album to get started.'}
          </p>
        </div>
      )}
    </div>
  );
}
