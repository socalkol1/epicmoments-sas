'use client';

import { X } from 'lucide-react';

interface TagBadgeProps {
  name: string;
  color?: string;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md';
}

export function TagBadge({
  name,
  color = '#6366f1',
  onRemove,
  onClick,
  selected,
  size = 'sm',
}: TagBadgeProps) {
  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const baseClasses = `inline-flex items-center gap-1 rounded-full font-medium transition-colors ${sizeClasses}`;

  const style = selected
    ? { backgroundColor: color, color: '#fff' }
    : {
        backgroundColor: `${color}18`,
        color: color,
        borderColor: `${color}40`,
      };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} cursor-pointer border hover:opacity-80`}
        style={style}
      >
        {name}
      </button>
    );
  }

  return (
    <span
      className={`${baseClasses} ${onRemove ? '' : 'border'}`}
      style={style}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
