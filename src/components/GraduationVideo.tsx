"use client";

export default function GraduationVideo() {
    return (
        <section id="graduation-video" className="py-24 bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">The Ceremony</h2>
                <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
                    Relive the moment we officially became alumni. Watch the full 2006 Graduation Ceremony, direct from the archives.
                </p>

                <div className="aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass border-white/10 relative shadow-2xl">
                    {/* Placeholder for Video Player */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756eaa539?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 blur-[2px]" />
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
                        <div className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 mb-4">
                            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[18px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                        </div>
                        <p className="text-white font-bold opacity-80 uppercase tracking-widest">Graduation 2006: The Full Video</p>
                        <p className="mt-4 text-sm text-zinc-500 max-w-md">
                            (Plex server linked for high-res playback)
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
