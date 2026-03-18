'use client';

import { Tag, Music, Film, Newspaper, Smartphone, Globe, Tv } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { label: 'A Gallon of Gas', value: '$3.03', icon: Tag },
  { label: 'Movie Ticket', value: '$6.55', icon: Film },
  { label: 'Gallon of Milk', value: '$3.23', icon: Tv },
  { label: 'Avg. Income', value: '$37,900', icon: Tag },
];

const highlights = [
  {
    title: 'THE HEADLINES',
    icon: Newspaper,
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Myspace_2006.png/400px-Myspace_2006.png',
    items: [
      'Pluto is officially demoted to a "Dwarf Planet"',
      'Google acquires YouTube for $1.65 Billion',
      'Twitter launches and Facebook opens to the public',
      'The billionth song is downloaded on iTunes (Coldplay)',
    ],
  },
  {
    title: 'THE SOUNDTRACK',
    icon: Music,
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Justin_Timberlake_-_FutureSex_LoveSounds.png/220px-Justin_Timberlake_-_FutureSex_LoveSounds.png',
    items: [
      '"Bad Day" - Daniel Powter (Year-end #1)',
      '"SexyBack" - Justin Timberlake',
      '"Hips Don\'t Lie" - Shakira ft. Wyclef Jean',
      '"Irreplaceable" - Beyoncé',
    ],
  },
  {
    title: 'THE BIG SCREEN',
    icon: Film,
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Pirates_of_the_Caribbean_-_Dead_Man%27s_Chest.jpg/220px-Pirates_of_the_Caribbean_-_Dead_Man%27s_Chest.jpg',
    items: [
      'Pirates of the Caribbean: Dead Man\'s Chest',
      'Cars (Pixar\'s latest hit)',
      'The Departed (Wins Best Picture)',
      'Casino Royale (Daniel Craig\'s Bond debut)',
    ],
  },
  {
    title: 'THE VIBE',
    icon: Smartphone,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Motorola_RAZR-V3.png/400px-Motorola_RAZR-V3.png',
    items: [
      'The Motorola RAZR is the must-have phone',
      'Myspace is the #1 social network in the US',
      'Wii & PlayStation 3 both launch this holiday',
      'Crocs and Low-Rise Jeans are everywhere',
    ],
  },
];

export default function NostalgiaSection() {
  return (
    <section id="nostalgia" className="py-24 bg-husky-charcoal relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-husky-pattern opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-husky-blue/5 rounded-full blur-3xl -mr-48 -mt-24 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-husky-blue/5 rounded-full blur-3xl -ml-48 -mb-24 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-husky-light-blue font-bold tracking-[0.3em] uppercase mb-4">Time Capsule</h2>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
            The World in <span className="text-gradient">2006</span>
          </h3>
          <p className="mt-6 text-zinc-500 max-w-2xl mx-auto text-lg italic">
            "Remember when the RAZR was elite and Pluto was still a planet?"
          </p>
        </div>

        {/* Prices Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl border-white/5 text-center transition-transform hover:scale-105">
              <stat.icon className="mx-auto mb-4 text-husky-light-blue opacity-50" size={20} />
              <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Detail Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {highlights.map((card, i) => (
            <div key={i} className="glass p-8 rounded-3xl border-white/10 hover:border-husky-blue/30 transition-all group relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-husky-blue/20 rounded-xl text-husky-light-blue group-hover:scale-110 transition-transform">
                    <card.icon size={24} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight text-white">{card.title}</h4>
                </div>
                <ul className="space-y-4">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-husky-light-blue mt-2 shrink-0"></span>
                      <span className="text-sm md:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-[0.25] group-hover:opacity-[0.4] transition-opacity pointer-events-none">
                {(card as any).image && <Image src={(card as any).image} alt={card.title} fill className="object-cover" />}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
            <p className="text-zinc-600 text-sm flex items-center justify-center gap-2">
                <Globe size={14} /> Italy wins the FIFA World Cup (Germany 2006)
            </p>
        </div>
      </div>
    </section>
  );
}
