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

const SLOTS = 8;
const CYCLE_MS = 3000;

export default function PhotoBackground() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [offset, setOffset] = useState(0);
  const [fadingSlot, setFadingSlot] = useState<number | null>(null);

  useEffect(() => {
    getPhotos().then(data => {
      if (data.length > 0) setPhotos(data);
    });
  }, []);

  useEffect(() => {
    if (photos.length <= SLOTS) return;

    const interval = setInterval(() => {
      const slot = Math.floor(Math.random() * SLOTS);
      setFadingSlot(slot);
      setTimeout(() => {
        setOffset(prev => (prev + 1) % photos.length);
        setFadingSlot(null);
      }, 600);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, [photos]);

  if (photos.length === 0) return null;

  const pool = [...photos, ...photos, ...photos];
  const backgroundPhotos = pool.slice(offset, offset + SLOTS);

  return (
    <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none grid grid-cols-2 md:grid-cols-4 gap-4 p-4 grayscale overflow-hidden">
      {backgroundPhotos.map((photo, i) => (
        <div
          key={`${photo.id}-${i}`}
          style={{ transition: 'opacity 0.6s ease-in-out', opacity: fadingSlot === i ? 0 : 1 }}
          className={`relative aspect-square overflow-hidden rounded-2xl ${i % 2 === 0 ? 'mt-12' : ''} ${i % 3 === 0 ? '-rotate-3' : 'rotate-3'}`}
        >
          <img
            src={photo.url}
            alt=""
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
