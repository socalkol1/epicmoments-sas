'use client';

import { useState, useMemo } from 'react';
import { Search, Users, Mail, Phone, Images } from 'lucide-react';
import { TagFilter } from '@/components/features/TagFilter';
import { TagInput } from '@/components/features/TagInput';
import type { Tag } from '@/types/supabase';
import type { ClientWithTags } from './page';

interface ClientsListClientProps {
  initialClients: ClientWithTags[];
  allTags: Tag[];
}

export function ClientsListClient({
  initialClients,
  allTags,
}: ClientsListClientProps) {
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          client.full_name?.toLowerCase().includes(q) ||
          client.email.toLowerCase().includes(q) ||
          client.phone?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Tag filter
      if (selectedTagIds.size > 0) {
        const clientTagIds = new Set(client.tags.map((t) => t.id));
        const hasMatchingTag = [...selectedTagIds].some((id) =>
          clientTagIds.has(id)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [clients, searchQuery, selectedTagIds]);

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

  function handleClientTagsChange(clientId: string, newTags: Tag[]) {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, tags: newTags } : c))
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
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
        {filteredClients.length} client
        {filteredClients.length !== 1 ? 's' : ''}
        {searchQuery || selectedTagIds.size > 0 ? ' found' : ''}
      </p>

      {/* Clients list */}
      {filteredClients.length > 0 ? (
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <Users className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        {client.full_name || 'Unnamed Client'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {client.email}
                        </span>
                        {client.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {client.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Images className="h-3.5 w-3.5" />
                          {client.albumCount} album
                          {client.albumCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 ml-13">
                    <TagInput
                      entityId={client.id}
                      entityType="profile"
                      currentTags={client.tags}
                      onTagsChange={(tags) =>
                        handleClientTagsChange(client.id, tags)
                      }
                    />
                  </div>
                </div>

                <span className="flex-shrink-0 text-xs text-slate-400">
                  Joined {formatDate(client.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 font-semibold text-slate-900">
            No clients found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery || selectedTagIds.size > 0
              ? 'Try adjusting your filters.'
              : 'Clients will appear here when they sign up.'}
          </p>
        </div>
      )}
    </div>
  );
}
