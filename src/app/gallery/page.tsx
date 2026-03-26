'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Photo {
  id: number;
  url: string;
  caption: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then((data: unknown) => setPhotos(Array.isArray(data) ? data as Photo[] : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() =>
    setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : null),
    [photos.length]);
  const nextPhoto = useCallback(() =>
    setLightboxIndex(i => i !== null ? (i + 1) % photos.length : null),
    [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, nextPhoto, prevPhoto, closeLightbox]);

  return (
    <div className="min-h-screen bg-husky-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-8">
          <Link href="/#photos" className="text-zinc-500 hover:text-white transition-colors text-sm">
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tight text-gradient">
          Photo Gallery
        </h1>
        <p className="text-zinc-400 mb-2">All memories from the Class of 2006</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-husky-light-blue" />
          </div>
        ) : photos.length === 0 ? (
          <p className="text-zinc-500 italic text-center py-20">No photos yet.</p>
        ) : (
          <>
            <p className="text-zinc-500 text-sm mb-8">{photos.length} photos</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setLightboxIndex(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption || ''}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs truncate">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={closeLightbox}
          >
            ✕
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl leading-none p-2"
            onClick={e => { e.stopPropagation(); prevPhoto(); }}
          >
            ‹
          </button>
          <div
            className="flex flex-col items-center max-w-4xl max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].caption || ''}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
            {photos[lightboxIndex].caption && (
              <p className="text-white mt-4 text-center">{photos[lightboxIndex].caption}</p>
            )}
            <p className="text-zinc-500 text-sm mt-2">{lightboxIndex + 1} / {photos.length}</p>
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl leading-none p-2"
            onClick={e => { e.stopPropagation(); nextPhoto(); }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
