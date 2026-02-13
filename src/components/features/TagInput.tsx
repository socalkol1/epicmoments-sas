'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { TagBadge } from './TagBadge';
import { searchTags, createTag, addTagToAlbum, removeTagFromAlbum, addTagToProfile, removeTagFromProfile } from '@/lib/actions/tags';
import type { Tag } from '@/types/supabase';

interface TagInputProps {
  entityId: string;
  entityType: 'album' | 'profile';
  currentTags: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
}

const TAG_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#64748b',
];

export function TagInput({ entityId, entityType, currentTags, onTagsChange }: TagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTagIds = useMemo(
    () => new Set(currentTags.map((t) => t.id)),
    [currentTags]
  );

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    setLoading(true);
    const result = await searchTags(searchQuery);
    if (result.success) {
      setSuggestions(result.data.filter((t) => !currentTagIds.has(t.id)));
    }
    setLoading(false);
  }, [currentTagIds]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    fetchSuggestions('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [fetchSuggestions]);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      fetchSuggestions(value);
    },
    [fetchSuggestions]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleAddTag(tag: Tag) {
    const addFn = entityType === 'album' ? addTagToAlbum : addTagToProfile;
    const result = await addFn(entityId, tag.id);
    if (result.success) {
      onTagsChange?.([...currentTags, tag]);
    }
    setQuery('');
    setIsOpen(false);
  }

  async function handleRemoveTag(tag: Tag) {
    const removeFn = entityType === 'album' ? removeTagFromAlbum : removeTagFromProfile;
    const result = await removeFn(entityId, tag.id);
    if (result.success) {
      onTagsChange?.(currentTags.filter((t) => t.id !== tag.id));
    }
  }

  async function handleCreateTag() {
    if (!query.trim()) return;
    const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    const result = await createTag({ name: query.trim(), color });
    if (result.success) {
      await handleAddTag(result.data);
    }
  }

  const showCreateOption =
    query.trim() &&
    !suggestions.some(
      (t) => t.name.toLowerCase() === query.trim().toLowerCase()
    ) &&
    !currentTags.some(
      (t) => t.name.toLowerCase() === query.trim().toLowerCase()
    );

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap items-center gap-1">
        {currentTags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            color={tag.color}
            onRemove={() => handleRemoveTag(tag)}
          />
        ))}
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700"
        >
          <Plus className="h-3 w-3" />
          Tag
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border bg-white shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && showCreateOption) {
                  e.preventDefault();
                  handleCreateTag();
                }
                if (e.key === 'Escape') {
                  setIsOpen(false);
                  setQuery('');
                }
              }}
              placeholder="Search or create tag..."
              className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {loading && (
              <div className="px-3 py-2 text-sm text-slate-500">
                Loading...
              </div>
            )}
            {!loading && suggestions.length === 0 && !showCreateOption && (
              <div className="px-3 py-2 text-sm text-slate-500">
                {query ? 'No tags found' : 'No tags available'}
              </div>
            )}
            {suggestions.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="flex-1">{tag.name}</span>
                {tag.description && (
                  <span className="truncate text-xs text-slate-400">
                    {tag.description}
                  </span>
                )}
              </button>
            ))}
            {showCreateOption && (
              <button
                type="button"
                onClick={handleCreateTag}
                className="flex w-full items-center gap-2 border-t px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                Create &ldquo;{query.trim()}&rdquo;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
