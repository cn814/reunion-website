'use client';

import { useState, useEffect } from 'react';
import PhotoBackground from './PhotoBackground';

const yearbookPhotos = [
  'Adam Petak',
  'Allece Koehle',
  'Amanda Seymore',
  'Amie Simanski',
  'Andrew Kordish',
  'Andrew McConnell',
  'Andrew Mullen',
  'Anthony Lassak',
  'Ashley Rake',
  'Ashley Smithson',
  'Brian Yuhas',
  'Brittany Hebenthal',
  'Brittney Bart',
  'Brock Lauer',
  'Bryce Kupchella',
  'Chelsey Sheehan',
  'Christopher James',
  'Christopher Nealen',
  'Cory Eckenrode',
  'Daniel Link',
  'David Bellvia',
  'David Rose',
  'David Tully',
  'Dustin Hollern',
  'Edward Roudybush',
  'Elizabeth Hollen',
  'Elyse Casher',
  'Emily Drahnak',
  'Grace Troxel',
  'Jacqueline Heinlein',
  'James Litzinger',
  'Jarrett Polites',
  'Jeffrey Minemyer',
  'Jeffrey Moschgat',
  'Jeremy Gorsuch',
  'Jessica Byich',
  'Joelle Knopp',
  'John Swinconis',
  'Joseph Klamar',
  'Joseph Sutton',
  'Joshua Beltowski',
  'Julian Chimelewski',
  'Julie Spinner',
  'Kayla Ertter',
  'Kelly Ostinosky',
  'Kristina Repko',
  'Lisa Mayansick',
  'Luke Bender',
  'Luke Jensen',
  'Michael Morris',
  'Mitchell Lemme',
  'Nicholas McMahon',
  'Nicole Panick',
  'Nicole Paronish',
  'Olivia Weinzierl',
  'Patrick Hegemann',
  'Paul Forcellini',
  'Ryan Kline',
  'Seth Nazzarak',
  'Stephanie Bukowski',
  'Stephanie Laino',
  'Timothy Smith',
  'Tyler Mouldry',
  'Whitney Weber',
  'Yolanda Gardner',
];

export default function YearbookSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/attendees')
      .then(r => r.json())
      .then((data: { name: string; attending: string }[]) => {
        const map: Record<string, string> = {};
        for (const entry of data) {
          // Keep the most recent entry per name (API returns DESC order)
          if (!map[entry.name]) map[entry.name] = entry.attending;
        }
        setRsvpStatus(map);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="yearbook" className="py-24 bg-husky-charcoal relative overflow-hidden">
      <PhotoBackground />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-husky-light-blue font-bold tracking-[0.3em] uppercase mb-4">Class of 2006</h2>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
            Yearbook <span className="text-gradient">Photos</span>
          </h3>
          <p className="mt-6 text-zinc-500 max-w-2xl mx-auto text-lg italic">
            All {yearbookPhotos.length} of us, forever immortalized in grainy school-photo glory.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {yearbookPhotos.map((name) => {
            const status = rsvpStatus[name];
            return (
              <button
                key={name}
                onClick={() => setSelected(name)}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-husky-blue/50 transition-all hover:scale-[1.03] shadow-md hover:shadow-husky-blue/20 hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/photos/yearbook-photos/${encodeURIComponent(name)}.jpg`}
                  alt={name}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                {/* RSVP badge */}
                {status && (
                  <div className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg ${status === 'no' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {status === 'no' ? '✕' : '✓'}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-bold leading-tight">{name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white text-2xl font-bold transition-colors"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/photos/yearbook-photos/${encodeURIComponent(selected)}.jpg`}
              alt={selected}
              className="w-full rounded-2xl shadow-2xl"
            />
            <p className="text-center text-white font-bold text-xl mt-4">{selected}</p>
            <p className="text-center text-zinc-500 text-sm mt-1">Bishop Carroll Class of 2006</p>
            {rsvpStatus[selected] && (
              <p className={`text-center text-sm font-bold mt-2 ${rsvpStatus[selected] === 'no' ? 'text-red-400' : 'text-green-400'}`}>
                {rsvpStatus[selected] === 'yes' ? '✓ Attending' : rsvpStatus[selected] === 'maybe' ? '✓ Maybe attending' : '✕ Not attending'}
              </p>
            )}

            {/* Prev / Next */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  const idx = yearbookPhotos.indexOf(selected);
                  setSelected(yearbookPhotos[(idx - 1 + yearbookPhotos.length) % yearbookPhotos.length]);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-husky-blue/60 text-white rounded-xl transition-colors text-sm font-bold"
              >
                ‹ Prev
              </button>
              <button
                onClick={() => {
                  const idx = yearbookPhotos.indexOf(selected);
                  setSelected(yearbookPhotos[(idx + 1) % yearbookPhotos.length]);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-husky-blue/60 text-white rounded-xl transition-colors text-sm font-bold"
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
