'use client';

import { TagBadge } from './TagBadge';
import type { Tag } from '@/types/supabase';

interface TagFilterProps {
  tags: Tag[];
  selectedTagIds: Set<string>;
  onToggleTag: (tagId: string) => void;
  onClear: () => void;
}

export function TagFilter({
  tags,
  selectedTagIds,
  onToggleTag,
  onClear,
}: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Tags:
      </span>
      {tags.map((tag) => (
        <TagBadge
          key={tag.id}
          name={tag.name}
          color={tag.color}
          selected={selectedTagIds.has(tag.id)}
          onClick={() => onToggleTag(tag.id)}
        />
      ))}
      {selectedTagIds.size > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          Clear
        </button>
      )}
    </div>
  );
}
