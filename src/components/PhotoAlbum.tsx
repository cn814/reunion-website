'use client';

import { useState, useEffect } from 'react';
import PhotoBackground from './PhotoBackground';



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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

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
    if (files.length === 0) {
      alert('Please select at least one photo.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', ''); 
      formData.append('uploaded_by', 'Anonymous'); 

      try {
        const res = await fetch('/api/photos', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          successCount++;
        } else {
          const errorText = await res.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { error: errorText };
          }
          console.error(`Upload failed for file ${file.name}:`, errorData);
          failCount++;
        }
      } catch (err) {
        console.error(`Error uploading file ${file.name}:`, err);
        failCount++;
      }
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }

    if (successCount > 0) {
      alert(`${successCount} photo${successCount > 1 ? 's' : ''} uploaded successfully! They will appear once approved.`);
      setIsModalOpen(false);
      setFiles([]);
    }

    if (failCount > 0) {
      alert(`${failCount} upload${failCount > 1 ? 's' : ''} failed. Please try again.`);
    }

    setUploading(false);
  };

  return (
    <section id="photos" className="py-24 bg-husky-black relative overflow-hidden">
      <PhotoBackground />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
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
            <span>📸</span>
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
              ✕
            </button>
            <h3 className="text-3xl font-black mb-2 text-white text-center tracking-tighter">UPLOAD PHOTO</h3>
            <p className="text-zinc-400 text-center mb-8 text-sm italic">
              Our organizer manually reviews all photos before they go live.
            </p>
            
            <div className="space-y-4">
              <label className={`block p-8 border-2 border-dashed ${files.length > 0 ? 'border-husky-light-blue bg-husky-blue/10' : 'border-white/20 bg-white/5'} rounded-2xl text-center hover:border-husky-light-blue transition-all cursor-pointer group`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
                <span className="text-4xl block mb-2">📤</span>
                <p className="text-sm font-bold text-zinc-300">
                  {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'Choose photos'}
                </p>
                {files.length === 0 && <p className="text-xs text-zinc-500 mt-1">JPG or PNG (Max 5MB each)</p>}
              </label>

              {uploading && (
                <div className="space-y-2 py-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-husky-blue transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,140,255,0.5)]"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-[10px] text-zinc-500 italic">
                    Processing {Math.ceil((uploadProgress / 100) * files.length)} of {files.length}
                  </p>
                </div>
              )}

              <button 
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
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
          {/* Blurred background fill */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover absolute inset-0 scale-110 blur-xl opacity-40"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photo.caption || 'Class Memory'}
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pt-20">
            <p className="text-white font-bold text-2xl mb-2 drop-shadow-md">{photo.caption}</p>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-husky-blue/80 text-white transition-all opacity-0 group-hover/slide:opacity-100"
      >
        ‹
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-husky-blue/80 text-white transition-all opacity-0 group-hover/slide:opacity-100"
      >
        ›
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
