"use client";

import { useState } from "react";
import Image from "next/image";

const classmates = [
    { id: 1, name: "Name 1", rsvp: "Yes", thenImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop", nowImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "Name 2", rsvp: "Maybe", thenImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop", nowImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "Name 3", rsvp: "Yes", thenImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop", nowImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop" },
    { id: 4, name: "Name 4", rsvp: "No", thenImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop", nowImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop" },
    // Add more as needed
];

export default function Yearbook() {
    return (
        <section id="yearbook" className="py-24 bg-husky-black">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">Interactive Yearbook</h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto">
                        Hover over a classmate to see their "Now" photo and RSVP status. Who else is coming?
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {classmates.map((person) => (
                        <YearbookCard key={person.id} person={person} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function YearbookCard({ person }: { person: any }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden glass transition-all transform hover:scale-105 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image
                src={isHovered ? person.nowImg : person.thenImg}
                alt={person.name}
                fill
                className={`object-cover transition-opacity duration-500 ${isHovered ? 'blur-[2px] opacity-60' : 'grayscale group-hover:grayscale-0'}`}
            />

            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-bold text-sm truncate">{person.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${person.rsvp === 'Yes' ? 'bg-green-500/80' :
                        person.rsvp === 'Maybe' ? 'bg-yellow-500/80' : 'bg-red-500/80'
                    }`}>
                    {person.rsvp}
                </span>
            </div>

            {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white font-black text-2xl drop-shadow-lg tracking-tighter">NOW</span>
                </div>
            )}
        </div>
    );
}
