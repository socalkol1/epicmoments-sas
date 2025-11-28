'use client';

import { useState } from 'react';
import { GalleryImage } from './GalleryImage';
import { Lightbox } from './Lightbox';

export interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  category?: string;
}

interface PortfolioGalleryProps {
  images: PortfolioImage[];
  categories?: string[];
}

export function PortfolioGallery({ images, categories = [] }: PortfolioGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = selectedCategory
    ? images.filter((img) => img.category === selectedCategory)
    : images;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goToPrevious = () =>
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  const goToNext = () =>
    setLightboxIndex((prev) =>
      prev !== null && prev < filteredImages.length - 1 ? prev + 1 : prev
    );

  return (
    <div>
      {/* Category filters */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Grid layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        {filteredImages.map((image, index) => (
          <div key={image.id}>
            <GalleryImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              blurDataURL={image.blurDataURL}
              onClick={() => openLightbox(index)}
              priority={index < 4}
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredImages.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          No images found in this category.
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </div>
  );
}
