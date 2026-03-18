'use client';

import { useState, useEffect } from 'react';

interface Photo {
  id: number;
  url: string;
}

export default function PhotoBackground() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch('/api/photos');
        const data = await res.json() as Photo[];
        if (Array.isArray(data)) {
          setPhotos(data);
        }
      } catch (err) {
        console.error('Failed to fetch background photos', err);
      }
    }
    fetchPhotos();
  }, []);

  if (photos.length === 0) return null;

  // Create a pseudo-random grid of photos
  // We use a fixed layout for stability, but pick from available photos
  const backgroundPhotos = [...photos, ...photos, ...photos].slice(0, 12);

  return (
    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none grid grid-cols-2 md:grid-cols-4 gap-4 p-4 grayscale overflow-hidden">
      {backgroundPhotos.map((photo, i) => (
        <div 
          key={`${photo.id}-${i}`} 
          className={`relative aspect-square overflow-hidden rounded-2xl ${i % 2 === 0 ? 'mt-12' : ''} ${i % 3 === 0 ? '-rotate-3' : 'rotate-3'}`}
        >
          <img 
            src={photo.url} 
            alt="" 
            className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110" 
          />
        </div>
      ))}
    </div>
  );
}
