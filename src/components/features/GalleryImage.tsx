'use client';

import Image from 'next/image';

interface GalleryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  onClick?: () => void;
  priority?: boolean;
}

export function GalleryImage({
  src,
  alt,
  blurDataURL,
  onClick,
  priority = false,
}: GalleryImageProps) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#e2e8f0',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        priority={priority}
        style={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
        }}
        sizes="(max-width: 768px) 50vw, 25vw"
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      />
    </div>
  );
}
