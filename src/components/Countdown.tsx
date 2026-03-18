"use client";

import { useState, useEffect } from "react";

export default function Countdown() {
    const targetDate = new Date("2026-09-26T18:00:00").getTime();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <section className="py-16 bg-husky-black relative overflow-hidden">
            <div className="absolute inset-0 bg-husky-pattern opacity-50"></div>
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                    <div className="text-center md:text-left">
                        <h3 className="text-husky-light-blue uppercase tracking-[0.3em] font-black text-sm mb-1">
                            The Reunion is In
                        </h3>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8 font-black text-2xl md:text-5xl tracking-tighter text-white">
                        <div className="flex flex-col items-center">
                            <span>{timeLeft.days}</span>
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Days</span>
                        </div>
                        <span className="text-husky-light-blue/30 mb-4">:</span>
                        <div className="flex flex-col items-center">
                            <span>{timeLeft.hours.toString().padStart(2, "0")}</span>
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Hrs</span>
                        </div>
                        <span className="text-husky-light-blue/30 mb-4">:</span>
                        <div className="flex flex-col items-center">
                            <span>{timeLeft.minutes.toString().padStart(2, "0")}</span>
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Min</span>
                        </div>
                        <span className="text-husky-light-blue/30 mb-4">:</span>
                        <div className="flex flex-col items-center">
                            <span>{timeLeft.seconds.toString().padStart(2, "0")}</span>
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Sec</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimeUnit({ label, value }: { label: string; value: number }) {
    return (
        <div className="glass rounded-2xl p-6 text-center">
            <div className="text-4xl md:text-6xl font-black text-white mb-2">
                {value.toString().padStart(2, "0")}
            </div>
            <div className="text-sm uppercase tracking-wider text-husky-light-blue font-bold">
                {label}
            </div>
        </div>
    );
}
