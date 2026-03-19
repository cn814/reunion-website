"use client";

import { useState, useEffect } from "react";

interface YearbookEntry {
    name: string;
    photo_url: string;
}

export default function RSVPForm() {
    const [yearbook, setYearbook] = useState<YearbookEntry[]>([]);
    const [yearbookLoading, setYearbookLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        maidenName: "",
        attending: "yes",
        guestName: "",
        dietary: "",
        email: "",
        suggestions: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedPhoto, setSubmittedPhoto] = useState("");

    useEffect(() => {
        fetch('/api/yearbook')
            .then(r => r.json())
            .then((data: unknown) => setYearbook(data as YearbookEntry[]))
            .catch(() => {})
            .finally(() => setYearbookLoading(false));
    }, []);

    const selectedEntry = yearbook.find(y => y.name === formData.name);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    maiden_name: formData.maidenName,
                    attending: formData.attending,
                    guest_name: formData.guestName,
                    email: formData.email,
                    dietary: formData.dietary,
                    suggestions: formData.suggestions,
                }),
            });
            if (res.ok) {
                setSubmittedPhoto(selectedEntry?.photo_url || '');
                setSubmitted(true);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch {
            alert('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-12 space-y-6">
                {submittedPhoto && (
                    <div className="flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={submittedPhoto}
                            alt={formData.name}
                            className="w-36 h-44 object-cover rounded-2xl border-2 border-husky-light-blue shadow-lg shadow-husky-blue/30"
                        />
                    </div>
                )}
                <div>
                    <p className="text-4xl mb-3">🎓</p>
                    <h3 className="text-2xl font-black mb-2">You're on the list, {formData.name}!</h3>
                    <p className="text-zinc-400">We can't wait to see you. Check back here for more details.</p>
                    <p className="text-zinc-600 text-sm mt-2">Need to make a change? Just submit the form again.</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Your Name</label>
                    {yearbookLoading ? (
                        <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-500 animate-pulse">Loading class list...</div>
                    ) : yearbook.length === 0 ? (
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    ) : (
                        <select
                            required
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        >
                            <option value="" disabled>Select your name...</option>
                            {yearbook.map(y => (
                                <option key={y.name} value={y.name}>{y.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {selectedEntry && (
                    <div className="flex items-end">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedEntry.photo_url}
                            alt={selectedEntry.name}
                            className="w-16 h-20 object-cover rounded-xl border border-white/20"
                        />
                    </div>
                )}

                {!selectedEntry && (
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Preferred Name Today (if different)</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                            value={formData.maidenName}
                            onChange={(e) => setFormData({ ...formData, maidenName: e.target.value })}
                        />
                    </div>
                )}
            </div>

            {selectedEntry && (
                <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Preferred Name Today (if different)</label>
                    <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                        value={formData.maidenName}
                        onChange={(e) => setFormData({ ...formData, maidenName: e.target.value })}
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Are you attending?</label>
                <select
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                    value={formData.attending}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                >
                    <option value="yes">Yes, wouldn't miss it!</option>
                    <option value="maybe">Maybe, still checking the calendar.</option>
                    <option value="no">Sadly, I can't make it.</option>
                </select>
            </div>

            {formData.attending !== "no" && (
                <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Guest Name (if bringing someone)</label>
                    <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                        value={formData.guestName}
                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Dietary Restrictions</label>
                <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue h-24"
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    placeholder="Gluten-free, vegan, allergies, etc."
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Suggestions & Ideas</label>
                <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue h-28"
                    value={formData.suggestions}
                    onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                    placeholder="Music requests, activities, anything you'd love to see at the reunion..."
                />
            </div>

            <button
                type="submit"
                disabled={submitting || !formData.name}
                className="w-full py-4 bg-husky-blue hover:bg-husky-light-blue disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all shadow-lg shadow-husky-blue/20"
            >
                {submitting ? 'Submitting...' : 'SUBMIT RSVP'}
            </button>
        </form>
    );
}
