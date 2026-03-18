import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";
import GraduationVideo from "@/components/GraduationVideo";
import Image from "next/image";
import PhotoAlbum from "@/components/PhotoAlbum";
import NostalgiaSection from "@/components/NostalgiaSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-husky-black">
      <Navbar />
      <Hero />
      <GraduationVideo />
      <Countdown />

      {/* RSVP Section */}
      <section id="rsvp" className="py-24 bg-gradient-to-b from-husky-black to-husky-blue/10 relative overflow-hidden text-white">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
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
      <section id="payments" className="py-24 bg-husky-charcoal relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black mb-6 uppercase tracking-tight text-gradient">Payment Hub</h2>
          <p className="text-xl text-zinc-400 mb-12">
            The reunion cost is <span className="text-white font-bold">$25 per person</span>. <br />
            This covers the buffet, venue, and a small class donation for future events.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a href="#" className="flex items-center justify-center gap-3 py-6 bg-[#008CFF] hover:bg-[#0074D4] text-white font-black rounded-2xl transition-all transform hover:scale-105 uppercase">
              VENMO @BCHSclassof2006
            </a>
            <a href="#" className="flex items-center justify-center gap-3 py-6 bg-[#FFC439] hover:bg-[#F2B932] text-[#003087] font-black rounded-2xl transition-all transform hover:scale-105 uppercase">
              PAYPAL @BCHSclassof2006
            </a>
          </div>
          <p className="mt-8 text-zinc-500 text-sm">
            Paying in cash? No problem. Reach out to the committee and we'll check you off the list manually.
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
          <div className="flex justify-center opacity-80 grayscale hover:grayscale-0 transition-all duration-700">
            <a href="https://askew-houser.com/tribute/details/517" target="_blank" rel="noopener noreferrer" className="text-center group block max-w-sm">
              <div className="aspect-square glass rounded-full mb-6 mx-auto border-white/5 w-48 h-48 overflow-hidden bg-zinc-900 group-hover:bg-zinc-800 transition-colors shadow-xl relative">
                <Image 
                  src="/photos/bryce.jpg" 
                  alt="Bryce J. Kupchella" 
                  fill 
                  className="object-cover"
                />
              </div>
              <p className="text-xl font-bold text-zinc-300 group-hover:text-white transition-colors">Bryce J. Kupchella</p>
              <p className="text-sm text-zinc-500 mt-2 italic px-4">
                "Death is a natural part of life. Rejoice for those around you who transform into the Force. Mourn them do not. Miss them do not." - YODA
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Photo Album Section */}
      <PhotoAlbum />

      {/* Nostalgia Section */}
      <NostalgiaSection />

      {/* Details Section */}
      <section id="details" className="py-24 bg-husky-charcoal relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
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


            </div>

            <div className="h-96 rounded-3xl overflow-hidden glass border-white/10 relative shadow-2xl">
              <div className="absolute inset-0 bg-[url('/photos/bishop-carroll-catholic-high-school-ebensburg-pa-primaryphoto.jpg')] bg-cover bg-center opacity-30 blur-sm" />
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
