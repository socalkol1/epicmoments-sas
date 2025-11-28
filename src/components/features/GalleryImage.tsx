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
      className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-slate-200"
    >
      <Image
        src={src}
        alt={alt}
        fill
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        priority={priority}
        className="object-cover transition-transform duration-300 hover:scale-110"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    </div>
  );
}
