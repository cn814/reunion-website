'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';



interface Photo {
  id: number;
  url: string;
  caption: string;
  uploaded_by: string;
  status: string;
  created_at: string;
}

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (key === 'HUSKY2006') {
      setAuthorized(true);
      fetchPhotos();
    } else {
      setLoading(false);
    }
  }, [key]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch(`/api/admin/photos?key=${key}`);
      if (res.ok) {
        const data = await res.json() as Photo[];
        setPhotos(data);
      }
    } catch (err) {
      console.error('Failed to fetch admin photos', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, key })
      });
      if (res.ok) {
        setPhotos(photos.map(p => p.id === id ? { ...p, status } : p));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (!isMounted) return null;

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Dashboard...</div>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <span className="text-6xl mb-6">🚫</span>
        <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-zinc-500">You must provide the correct admin key in the URL.</p>
      </div>
    );
  }

  const pending = photos.filter(p => p.status === 'pending');
  const approved = photos.filter(p => p.status === 'approved');

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-12 uppercase tracking-tighter">Photo Approval <span className="text-husky-light-blue">Dashboard</span></h1>
        
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 text-zinc-400 flex items-center gap-2">
            PENDING APPROVAL ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <p className="text-zinc-600 italic">No pending photos to review.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pending.map(photo => (
                <div key={photo.id} className="glass rounded-2xl overflow-hidden border-white/10">
                  <div className="w-full h-64 bg-zinc-900 rounded-t-2xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="Pending" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <p className="font-bold mb-6">{photo.caption || 'No caption'}</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => updateStatus(photo.id, 'approved')}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors uppercase"
                      >
                        ✓ APPROVE
                      </button>
                      <button 
                        onClick={() => updateStatus(photo.id, 'rejected')}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors uppercase"
                      >
                        ✕ REJECT
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-6 text-zinc-400">APPROVED PHOTOS ({approved.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {approved.map(photo => (
              <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="Approved" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                <button 
                  onClick={() => updateStatus(photo.id, 'rejected')}
                  className="absolute top-2 right-2 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminContent />
    </Suspense>
  );
}
