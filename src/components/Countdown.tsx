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
        <section className="py-20 bg-husky-black">
            <div className="max-w-4xl mx-auto px-4">
                <h3 className="text-center text-zinc-500 uppercase tracking-widest font-bold mb-10">
                    The Countdown is On
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TimeUnit label="Days" value={timeLeft.days} />
                    <TimeUnit label="Hours" value={timeLeft.hours} />
                    <TimeUnit label="Minutes" value={timeLeft.minutes} />
                    <TimeUnit label="Seconds" value={timeLeft.seconds} />
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
