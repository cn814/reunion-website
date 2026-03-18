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
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/jY0EWkCIukk" 
                        title="2006 Graduation Ceremony" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}
