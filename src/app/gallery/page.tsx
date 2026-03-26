'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface Photo {
  id: number;
  url: string;
  caption: string;
}

const CONCURRENCY = 4;
const STALL_MS = 8000; // retry if no load/error within this window

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Photos that have successfully loaded (drives queue advancement)
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set());
  // Per-photo retry counter — appended to src URL to bust cache and retrigger request
  const [retryMap, setRetryMap] = useState<Map<number, number>>(new Map());

  // revealedUpTo: photos 0..revealedUpTo have their src rendered
  // as each photo loads, loadedSet grows and the window slides forward
  const revealedUpTo = Math.min(loadedSet.size + CONCURRENCY - 1, photos.length - 1);

  // Per-photo stall timers
  const stallTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const scheduleStall = useCallback((index: number) => {
    // Clear any existing timer for this photo then start a fresh window
    const prev = stallTimers.current.get(index);
    if (prev) clearTimeout(prev);
    const timer = setTimeout(() => {
      // Bump retry counter → changes src URL → browser makes a fresh request
      setRetryMap(m => {
        const next = new Map(m);
        next.set(index, (m.get(index) ?? 0) + 1);
        return next;
      });
      scheduleStall(index); // keep watching for the next attempt
    }, STALL_MS);
    stallTimers.current.set(index, timer);
  }, []);

  const cancelStall = useCallback((index: number) => {
    const timer = stallTimers.current.get(index);
    if (timer) clearTimeout(timer);
    stallTimers.current.delete(index);
  }, []);

  // When a photo successfully loads: advance the queue, stop watching it
  const handleLoad = useCallback((index: number) => {
    cancelStall(index);
    setLoadedSet(prev => new Set([...prev, index]));
  }, [cancelStall]);

  // When a photo errors: retry immediately (bump src) and reset the stall window
  const handleError = useCallback((index: number) => {
    setRetryMap(m => {
      const next = new Map(m);
      next.set(index, (m.get(index) ?? 0) + 1);
      return next;
    });
    scheduleStall(index);
  }, [scheduleStall]);

  // Start watching newly revealed photos that aren't loaded yet
  useEffect(() => {
    for (let i = 0; i <= revealedUpTo; i++) {
      if (!loadedSet.has(i) && !stallTimers.current.has(i)) {
        scheduleStall(i);
      }
    }
  }, [loadedSet.size, revealedUpTo, scheduleStall]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => () => { stallTimers.current.forEach(t => clearTimeout(t)); }, []);

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
            <p className="text-zinc-500 text-sm mb-8">
              {photos.length} photos
              {loadedSet.size < photos.length && (
                <span className="ml-2 text-zinc-600">· {loadedSet.size} / {photos.length} loaded</span>
              )}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((photo, index) => {
                const retryCount = retryMap.get(index) ?? 0;
                const src = retryCount > 0 ? `${photo.url}?r=${retryCount}` : photo.url;
                const isRevealed = index <= revealedUpTo;
                const isLoaded = loadedSet.has(index);

                return (
                  <div
                    key={photo.id}
                    className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => isLoaded && setLightboxIndex(index)}
                  >
                    {/* Spinner while in-flight */}
                    {isRevealed && !isLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white/20" />
                      </div>
                    )}

                    {isRevealed && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={retryCount} // key change forces img element to remount on retry
                        src={src}
                        alt={photo.caption || ''}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                          isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleLoad(index)}
                        onError={() => handleError(index)}
                      />
                    )}

                    {photo.caption && isLoaded && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                );
              })}
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
