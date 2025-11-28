'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';
import type { Image as ImageType } from '@/types/supabase';

interface AlbumGalleryProps {
  images: ImageType[];
  albumTitle: string;
  albumToken: string;
}

export function AlbumGallery({ images, albumTitle, albumToken }: AlbumGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async (imageId: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          albumToken,
          imageId,
          type: 'single',
        }),
      });

      const data = await response.json();

      if (data.success && data.downloadUrl) {
        // Trigger download
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = data.filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Download failed:', data.error);
        alert(data.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  }, [albumToken]);

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  }, [selectedIndex, images.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  }, [selectedIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, goToPrevious, goToNext]);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  // For now, we'll use placeholder URLs since actual images aren't uploaded yet
  // In production, these would be the actual B2 storage URLs
  const getImageUrl = (image: ImageType, size: 'thumbnail' | 'full' = 'full') => {
    // If there's a storage key, construct the URL
    // For demo purposes, we'll use placeholder images
    if (image.storage_key && image.storage_key.startsWith('http')) {
      return image.storage_key;
    }
    if (image.thumbnail_key && size === 'thumbnail' && image.thumbnail_key.startsWith('http')) {
      return image.thumbnail_key;
    }
    // Fallback to placeholder
    const width = size === 'thumbnail' ? 400 : 1200;
    const height = size === 'thumbnail' ? 300 : 900;
    return `https://picsum.photos/seed/${image.id}/${width}/${height}`;
  };

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="mb-4 break-inside-avoid"
          >
            <button
              onClick={() => openLightbox(index)}
              className="group relative block w-full overflow-hidden rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={getImageUrl(image, 'thumbnail')}
                  alt={image.original_filename || `Photo ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image counter */}
          <div className="absolute left-4 top-4 z-10 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
            {selectedIndex !== null ? selectedIndex + 1 : 0} / {images.length}
          </div>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
              </div>
            )}
            <Image
              src={getImageUrl(selectedImage, 'full')}
              alt={selectedImage.original_filename || `Photo ${selectedIndex! + 1}`}
              width={selectedImage.width || 1200}
              height={selectedImage.height || 900}
              className="max-h-[90vh] w-auto object-contain"
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
              priority
            />
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="mx-auto flex max-w-4xl items-center justify-between">
              <div className="text-white">
                <p className="font-medium">{albumTitle}</p>
                <p className="text-sm text-white/70">
                  {selectedImage.original_filename || `Photo ${selectedIndex! + 1}`}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedImage) {
                    handleDownload(selectedImage.id);
                  }
                }}
                disabled={isDownloading}
                className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
