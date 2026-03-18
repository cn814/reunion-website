'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, ShieldCheck, Heart } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  caption: string;
  uploaded_by: string;
  created_at: string;
}

export default function PhotoAlbum() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json() as Photo[];
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch photos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !name) {
      alert('Please select a file and enter your name.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('uploaded_by', name);

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Photo uploaded successfully! It will appear once approved.');
        setIsModalOpen(false);
        setFile(null);
        setCaption('');
        setName('');
      } else {
        const error = await res.json() as any;
        alert(`Upload failed: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Upload failed. Please check your connection.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="photos" className="py-24 bg-husky-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight text-gradient">Class Photo Album</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            A collection of memories from our days at Bishop Carroll. 
            Got some old photos? Upload them below (pending approval)!
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-8 px-8 py-3 bg-husky-blue hover:bg-husky-light-blue text-white font-bold rounded-full transition-all flex items-center gap-2 mx-auto shadow-lg shadow-husky-blue/20"
          >
            <Upload size={20} />
            UPLOAD MEMORIES
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-husky-light-blue"></div>
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative glass rounded-2xl overflow-hidden aspect-square border-white/5 ring-1 ring-white/10 hover:ring-husky-light-blue/50 transition-all">
                <Image 
                  src={photo.url} 
                  alt={photo.caption || 'Class Memory'} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-white font-bold text-lg">{photo.caption}</p>
                  <p className="text-zinc-400 text-sm flex items-center gap-1 mt-1">
                    <Heart size={12} className="text-husky-light-blue" /> {photo.uploaded_by}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-zinc-500 italic">No photos shared yet. Be the first!</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass w-full max-w-md p-8 rounded-3xl relative border-white/20 shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-3xl font-black mb-2 text-white text-center tracking-tighter">UPLOAD PHOTO</h3>
            <p className="text-zinc-400 text-center mb-8 text-sm italic">
              Our organizer manually reviews all photos before they go live.
            </p>
            
            <div className="space-y-4">
              <label className={`block p-8 border-2 border-dashed ${file ? 'border-husky-light-blue bg-husky-blue/10' : 'border-white/20 bg-white/5'} rounded-2xl text-center hover:border-husky-light-blue transition-all cursor-pointer group`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Upload size={32} className={`mx-auto mb-2 ${file ? 'text-husky-light-blue' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <p className="text-sm font-bold text-zinc-300">
                  {file ? file.name : 'Choose a file'}
                </p>
                {!file && <p className="text-xs text-zinc-500 mt-1">JPG or PNG (Max 5MB)</p>}
              </label>

              <input 
                type="text" 
                placeholder="What's happening in this photo?" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-husky-light-blue transition-colors" 
              />
              <input 
                type="text" 
                placeholder="Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-husky-light-blue transition-colors" 
              />
              
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full py-4 ${uploading ? 'bg-zinc-800 cursor-not-allowed' : 'bg-husky-blue hover:bg-husky-light-blue'} text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'SUBMIT FOR REVIEW'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
