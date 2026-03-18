import Image from "next/image";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background with Grainy Overlay Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('/photos/GkFskcqWs7PkUngjTIHSyf5XzaXKxX9r5MeB8bGis3u9xTia3678345000705911348.jpg')] bg-cover bg-center grayscale opacity-50 contrast-125" />
        <div className="absolute inset-0 noise-overlay opacity-20 z-20" />
      </div>

      <div className="relative z-30 text-center px-4 max-w-5xl mx-auto">
        <h2 className="text-husky-light-blue font-bold tracking-widest uppercase mb-4 animate-fade-in">
          Cheers to 20 Years
        </h2>
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">
          BISHOP CARROLL <br />
          <span className="text-gradient">CLASS OF 2006</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-10 font-light">
          Ebensburg, PA • September 26, 2026 <br />
          Remembering where we started, celebrating where we are.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#rsvp" className="px-8 py-4 bg-husky-blue hover:bg-husky-light-blue text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-husky-blue/20">
            RSVP NOW
          </a>
          <a href="#details" className="px-8 py-4 glass hover:bg-white/20 text-white font-bold rounded-full transition-all">
            EVENT DETAILS
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-white/60 hover:text-white transition-colors">
        <ArrowDown size={32} />
      </div>
    </section>
  );
}
