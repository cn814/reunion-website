"use client";

import { useState } from "react";

export default function RSVPForm() {
    const [formData, setFormData] = useState({
        name: "",
        maidenName: "",
        attending: "yes",
        guestName: "",
        dietary: "",
        email: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        alert("Thanks for RSVPing! We'll be in touch.");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Maiden Name (if applicable)</label>
                    <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                        value={formData.maidenName}
                        onChange={(e) => setFormData({ ...formData, maidenName: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Are you attending?</label>
                <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-husky-light-blue"
                    value={formData.attending}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                >
                    <option value="yes" className="bg-zinc-900">Yes, wouldn't miss it!</option>
                    <option value="maybe" className="bg-zinc-900">Maybe, still checking the calendar.</option>
                    <option value="no" className="bg-zinc-900">Sadly, I can't make it.</option>
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

            <button className="w-full py-4 bg-husky-blue hover:bg-husky-light-blue text-white font-black rounded-xl transition-all shadow-lg shadow-husky-blue/20">
                SUBMIT RSVP
            </button>
        </form>
    );
}
