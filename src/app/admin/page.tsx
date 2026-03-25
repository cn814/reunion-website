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
  suggestions: string;
  created_at: string;
  yearbook_photo: string | null;
}

interface YearbookEntry {
  id: number;
  name: string;
  photo_url: string;
}

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [yearbook, setYearbook] = useState<YearbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [photoLoadIndex, setPhotoLoadIndex] = useState(0);

  // Yearbook upload state
  const [ybName, setYbName] = useState('');
  const [ybFile, setYbFile] = useState<File | null>(null);
  const [ybUploading, setYbUploading] = useState(false);
  const [ybMessage, setYbMessage] = useState('');

  useEffect(() => {
    setIsMounted(true);
    if (key === 'HUSKY2006') {
      setAuthorized(true);
      fetchPhotos();
      fetchRsvps();
      fetchYearbook();
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
        setPhotoLoadIndex(0);
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
      } else {
        const d = await res.json() as any;
        setRsvpError(`API error ${res.status}: ${d?.error ?? res.statusText}`);
      }
    } catch (err) {
      console.error('Failed to fetch RSVPs', err);
      setRsvpError(String(err));
    }
  };

  const fetchYearbook = async () => {
    try {
      const res = await fetch(`/api/admin/yearbook?key=${key}`);
      if (res.ok) {
        const data = await res.json() as YearbookEntry[];
        setYearbook(data);
      }
    } catch (err) {
      console.error('Failed to fetch yearbook', err);
    }
  };

  const uploadYearbookPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ybName || !ybFile) return;
    setYbUploading(true);
    setYbMessage('');
    try {
      const fd = new FormData();
      fd.append('key', key!);
      fd.append('name', ybName);
      fd.append('file', ybFile);
      const res = await fetch('/api/admin/yearbook', { method: 'POST', body: fd });
      if (res.ok) {
        setYbMessage(`Saved photo for ${ybName}`);
        setYbName('');
        setYbFile(null);
        fetchYearbook();
      } else {
        const d = await res.json() as any;
        setYbMessage(`Error: ${d.error}`);
      }
    } catch {
      setYbMessage('Upload failed');
    } finally {
      setYbUploading(false);
    }
  };

  const deleteYearbookPhoto = async (id: number, name: string) => {
    if (!confirm(`Remove yearbook photo for ${name}?`)) return;
    try {
      await fetch(`/api/admin/yearbook?key=${key}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setYearbook(yearbook.filter(y => y.id !== id));
    } catch (err) {
      console.error('Failed to delete yearbook photo', err);
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
        <h1 className="text-4xl font-black mb-12 uppercase tracking-tighter">Admin <span className="text-husky-light-blue">Dashboard</span></h1>

        {/* Yearbook Photos */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 text-zinc-400 uppercase">Yearbook Photos ({yearbook.length})</h2>

          <form onSubmit={uploadYearbookPhoto} className="flex flex-wrap gap-4 items-end mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Name (as it will appear in dropdown)</label>
              <input
                type="text"
                required
                placeholder="Jane Smith"
                value={ybName}
                onChange={e => setYbName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
              />
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Photo File</label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={e => setYbFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-husky-blue file:text-white file:font-bold file:cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={ybUploading}
              className="px-6 py-3 bg-husky-blue hover:bg-husky-light-blue disabled:opacity-50 text-white font-bold rounded-xl transition-colors uppercase"
            >
              {ybUploading ? 'Uploading...' : 'Upload'}
            </button>
            {ybMessage && <p className="w-full text-sm text-zinc-400">{ybMessage}</p>}
          </form>

          {yearbook.length === 0 ? (
            <p className="text-zinc-600 italic">No yearbook photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
              {yearbook.map(y => (
                <div key={y.id} className="group relative text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={y.photo_url} alt={y.name} className="w-full aspect-[3/4] object-cover rounded-xl border border-white/10" />
                  <p className="text-xs text-zinc-400 mt-1 truncate">{y.name}</p>
                  <button
                    onClick={() => deleteYearbookPhoto(y.id, y.name)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Photo Approval */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 text-zinc-400 uppercase">Pending Approval ({pending.length})</h2>
          {pending.length === 0 ? (
            <p className="text-zinc-600 italic">No pending photos to review.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pending.map((photo, index) => {
                const pendingOffset = approved.length;
                const globalIndex = pendingOffset + index;
                return (
                <div key={photo.id} className="glass rounded-2xl overflow-hidden border-white/10">
                  <div className="w-full h-64 bg-zinc-900 rounded-t-2xl overflow-hidden">
                    {globalIndex <= photoLoadIndex && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={photo.url}
                        alt="Pending"
                        className="w-full h-full object-cover"
                        onLoad={() => setPhotoLoadIndex(i => Math.max(i, globalIndex + 1))}
                        onError={() => setPhotoLoadIndex(i => Math.max(i, globalIndex + 1))}
                      />
                    )}
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
              ); })}
            </div>
          )}
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 text-zinc-400 uppercase">Approved Photos ({approved.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {approved.map((photo, index) => (
              <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group bg-zinc-900">
                {index <= photoLoadIndex && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={photo.url}
                    alt="Approved"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    onLoad={() => setPhotoLoadIndex(i => Math.max(i, index + 1))}
                    onError={() => setPhotoLoadIndex(i => Math.max(i, index + 1))}
                  />
                )}
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

        {/* Guest List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-400 uppercase">
              Guest List ({rsvps.length})
              <span className="ml-4 text-sm font-normal normal-case">
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
          {rsvpError && (
            <p className="text-red-400 italic mb-4">Error loading RSVPs: {rsvpError}</p>
          )}
          {!rsvpError && rsvps.length === 0 ? (
            <p className="text-zinc-600 italic">No RSVPs yet.</p>
          ) : !rsvpError && (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-zinc-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Photo</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Preferred Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Attending</th>
                    <th className="text-left px-4 py-3">Guest</th>
                    <th className="text-left px-4 py-3">Dietary</th>
                    <th className="text-left px-4 py-3">Suggestions</th>
                    <th className="text-left px-4 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                      <td className="px-4 py-2">
                        {r.yearbook_photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.yearbook_photo} alt={r.name} className="w-10 h-12 object-cover rounded-lg border border-white/10" />
                        ) : (
                          <div className="w-10 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-zinc-600 text-xs">?</div>
                        )}
                      </td>
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
                      <td className="px-4 py-3 text-zinc-400 max-w-xs truncate" title={r.suggestions || ''}>{r.suggestions || '—'}</td>
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
