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

interface RSVP {
  id: number;
  name: string;
  maiden_name: string;
  attending: string;
  guest_name: string;
  email: string;
  dietary: string;
  created_at: string;
}

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (key === 'HUSKY2006') {
      setAuthorized(true);
      fetchPhotos();
      fetchRsvps();
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

  const fetchRsvps = async () => {
    try {
      const res = await fetch(`/api/rsvp?key=${key}`);
      if (res.ok) {
        const data = await res.json() as RSVP[];
        setRsvps(data);
      }
    } catch (err) {
      console.error('Failed to fetch RSVPs', err);
    }
  };

  const exportCsv = () => {
    const header = ['Name', 'Maiden Name', 'Email', 'Attending', 'Guest Name', 'Dietary', 'Submitted'];
    const rows = rsvps.map(r => [
      r.name,
      r.maiden_name || '',
      r.email,
      r.attending,
      r.guest_name || '',
      r.dietary || '',
      r.created_at,
    ].map(v => `"${String(v).replace(/"/g, '""')}"`));
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps.csv';
    a.click();
    URL.revokeObjectURL(url);
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

        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-400">
              GUEST LIST ({rsvps.length} submitted)
              <span className="ml-4 text-sm font-normal">
                {rsvps.filter(r => r.attending === 'yes').length} attending &middot;&nbsp;
                {rsvps.filter(r => r.attending === 'maybe').length} maybe &middot;&nbsp;
                {rsvps.filter(r => r.attending === 'no').length} not coming
              </span>
            </h2>
            <button
              onClick={exportCsv}
              className="px-4 py-2 bg-husky-blue hover:bg-husky-light-blue text-white text-sm font-bold rounded-xl transition-colors uppercase"
            >
              Export CSV
            </button>
          </div>
          {rsvps.length === 0 ? (
            <p className="text-zinc-600 italic">No RSVPs yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-zinc-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Maiden Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Attending</th>
                    <th className="text-left px-4 py-3">Guest</th>
                    <th className="text-left px-4 py-3">Dietary</th>
                    <th className="text-left px-4 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                      <td className="px-4 py-3 font-medium">{r.name}</td>
                      <td className="px-4 py-3 text-zinc-400">{r.maiden_name || '—'}</td>
                      <td className="px-4 py-3 text-zinc-300">{r.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                          r.attending === 'yes' ? 'bg-emerald-900 text-emerald-300' :
                          r.attending === 'maybe' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {r.attending}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{r.guest_name || '—'}</td>
                      <td className="px-4 py-3 text-zinc-400">{r.dietary || '—'}</td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
