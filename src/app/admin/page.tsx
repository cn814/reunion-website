'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Check, X, ShieldAlert } from 'lucide-react';

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

  useEffect(() => {
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
        const data = await res.json();
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

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Dashboard...</div>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
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
                  <div className="relative aspect-video bg-zinc-900">
                    <Image src={photo.url} alt="Pending" fill className="object-contain" />
                  </div>
                  <div className="p-6">
                    <p className="font-bold mb-1">{photo.caption || 'No caption'}</p>
                    <p className="text-sm text-zinc-500 mb-6">By {photo.uploaded_by}</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => updateStatus(photo.id, 'approved')}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check size={18} /> APPROVE
                      </button>
                      <button 
                        onClick={() => updateStatus(photo.id, 'rejected')}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <X size={18} /> REJECT
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
                <Image src={photo.url} alt="Approved" fill className="object-cover grayscale hover:grayscale-0 transition-all" />
                <button 
                  onClick={() => updateStatus(photo.id, 'rejected')}
                  className="absolute top-2 right-2 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
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
