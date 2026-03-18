'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, ShieldCheck, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

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
          <div className="relative max-w-4xl mx-auto h-[500px] md:h-[600px] rounded-3xl overflow-hidden glass border-white/10 shadow-2xl group">
            <Slideshow photos={photos} />
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

function Slideshow({ photos }: { photos: Photo[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photos.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="relative w-full h-full group/slide">
      {photos.map((photo, index) => (
        <div 
          key={photo.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <Image 
            src={photo.url} 
            alt={photo.caption || 'Class Memory'} 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pt-20">
            <p className="text-white font-bold text-2xl mb-2 drop-shadow-md">{photo.caption}</p>
            <p className="text-zinc-300 flex items-center gap-2">
              <Heart size={16} className="text-husky-light-blue" />
              Uploaded by <span className="text-white font-semibold">{photo.uploaded_by}</span>
            </p>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-husky-blue/80 text-white transition-all opacity-0 group-hover/slide:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-husky-blue/80 text-white transition-all opacity-0 group-hover/slide:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {photos.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-husky-light-blue' : 'bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
