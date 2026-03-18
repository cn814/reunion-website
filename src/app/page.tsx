import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Yearbook from "@/components/Yearbook";
import RSVPForm from "@/components/RSVPForm";
import AudioTeaser from "@/components/AudioTeaser";
import GraduationVideo from "@/components/GraduationVideo";

export default function Home() {
  return (
    <main className="min-h-screen bg-husky-black">
      <Hero />
      <AudioTeaser />
      <GraduationVideo />
      <Countdown />

      <Yearbook />

      {/* RSVP Section */}
      <section id="rsvp" className="py-24 bg-gradient-to-b from-husky-black to-husky-blue/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">Are You Coming?</h2>
          <p className="text-xl text-zinc-400 mb-12">
            We can't wait to see everyone. RSVP by August 1st to help us finalize the headcount.
          </p>
          <div className="glass p-8 md:p-12 rounded-3xl inline-block w-full max-w-2xl text-left border-husky-blue/30 shadow-2xl">
            <RSVPForm />
          </div>
        </div>
      </section>

      {/* Payments Section */}
      <section id="payments" className="py-24 bg-husky-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6 uppercase tracking-tight text-gradient">Payment Hub</h2>
          <p className="text-xl text-zinc-400 mb-12">
            The reunion cost is <span className="text-white font-bold">$25 per person</span>. <br />
            This covers the buffet, venue, and a small class donation for future events.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a href="#" className="flex items-center justify-center gap-3 py-6 bg-[#008CFF] hover:bg-[#0074D4] text-white font-black rounded-2xl transition-all transform hover:scale-105">
              VENMO @DAN-SMITH
            </a>
            <a href="#" className="flex items-center justify-center gap-3 py-6 bg-[#FFC439] hover:bg-[#F2B932] text-[#003087] font-black rounded-2xl transition-all transform hover:scale-105">
              PAYPAL @DAN-SMITH
            </a>
          </div>
          <p className="mt-8 text-zinc-500 text-sm">
            Paying Dan in cash? No problem. He'll check you off the list manually.
          </p>
        </div>
      </section>

      {/* In Memoriam Section */}
      <section id="memorial" className="py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-8 uppercase tracking-wide opacity-80">In Memoriam</h2>
          <p className="text-zinc-500 mb-12 italic">
            Forever in our hearts. Remembering the classmates we've lost since 2006.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="text-center">
              <div className="aspect-square glass rounded-full mb-4 mx-auto border-white/5" />
              <p className="text-sm font-bold text-zinc-400">Classmate Name</p>
            </div>
            <div className="text-center">
              <div className="aspect-square glass rounded-full mb-4 mx-auto border-white/5" />
              <p className="text-sm font-bold text-zinc-400">Classmate Name</p>
            </div>
            <div className="text-center">
              <div className="aspect-square glass rounded-full mb-4 mx-auto border-white/5" />
              <p className="text-sm font-bold text-zinc-400">Classmate Name</p>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section id="details" className="py-24 bg-husky-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8 uppercase tracking-tight">The Deets</h2>
              <ul className="space-y-6 text-lg">
                <li className="flex items-start gap-4">
                  <span className="text-husky-light-blue font-bold min-w-[80px]">WHEN:</span>
                  <span className="text-zinc-300">September 26, 2026 <br /> 6:00 PM - 9:00 PM</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-husky-light-blue font-bold min-w-[80px]">WHERE:</span>
                  <span className="text-zinc-300">Bishop Carroll High School <br /> 728 Ben Franklin Hwy, Ebensburg, PA 15931</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-husky-light-blue font-bold min-w-[80px]">DRESS:</span>
                  <span className="text-zinc-300">Smart Casual (Husky Blue optional, but encouraged!)</span>
                </li>
              </ul>

              <div className="mt-12 p-6 glass rounded-2xl border-husky-blue/20">
                <h4 className="font-black mb-2 uppercase text-husky-light-blue">Photo Dropzone</h4>
                <p className="text-sm text-zinc-400 mb-4">
                  Got high-res photos from 2006 or recent years? Upload them here for the 10-minute fireworks slideshow!
                </p>
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all">
                  UPLOAD PHOTOS
                </button>
              </div>
            </div>

            <div className="h-96 rounded-3xl overflow-hidden glass border-white/10 relative shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-sm" />
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-8">
                <p className="text-white font-black text-2xl mb-2 drop-shadow-md uppercase tracking-tighter">See You in Ebensburg</p>
                <a href="https://maps.google.com" target="_blank" className="text-husky-light-blue underline font-bold">Open in Google Maps</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-zinc-500 text-sm bg-black">
        <p>© 2026 Bishop Carroll Class of 2006. Built with nostalgia and Husky Pride.</p>
      </footer>
    </main>
  );
}
