'use client';

import { useState, useEffect } from 'react';

interface Photo {
  id: number;
  url: string;
}

// Module-level cache — all PhotoBackground instances share one fetch
let cachedPhotos: Photo[] | null = null;
let fetchPromise: Promise<Photo[]> | null = null;

function getPhotos(): Promise<Photo[]> {
  if (cachedPhotos) return Promise.resolve(cachedPhotos);
  if (!fetchPromise) {
    fetchPromise = fetch('/api/photos')
      .then(r => r.json())
      .then(data => {
        cachedPhotos = Array.isArray(data) ? data : [];
        return cachedPhotos;
      })
      .catch(() => []);
  }
  return fetchPromise;
}

export default function PhotoBackground() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    getPhotos().then(data => {
      if (data.length > 0) setPhotos(data);
    });
  }, []);

  if (photos.length === 0) return null;

  // Show up to 8 photos — fewer simultaneous requests, faster load
  const backgroundPhotos = [...photos, ...photos, ...photos].slice(0, 8);

  return (
    <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none grid grid-cols-2 md:grid-cols-4 gap-4 p-4 grayscale overflow-hidden">
      {backgroundPhotos.map((photo, i) => (
        <div
          key={`${photo.id}-${i}`}
          className={`relative aspect-square overflow-hidden rounded-2xl ${i % 2 === 0 ? 'mt-12' : ''} ${i % 3 === 0 ? '-rotate-3' : 'rotate-3'}`}
        >
          <img
            src={photo.url}
            alt=""
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
}
