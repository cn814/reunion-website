"use client";

import { Play, Pause } from "lucide-react";
import { useState } from "react";

export default function AudioTeaser() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="py-12 bg-husky-blue/20 border-y border-husky-blue/30">
            <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Live Medley Preview</h3>
                    <p className="text-zinc-400">
                        Get hyped for the "Reunion Show" featuring <span className="text-white">The Greatest Show</span> and more!
                    </p>
                </div>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-4 px-8 py-4 bg-white text-husky-blue font-black rounded-full hover:bg-zinc-200 transition-all shadow-xl"
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    {isPlaying ? "PAUSE TEASER" : "PLAY TEASER"}
                </button>
            </div>
        </section>
    );
}
