'use client';

import { useState, useEffect } from 'react';

const navItems = [
  { name: 'RSVP', href: '#rsvp' },
  { name: 'Payment', href: '#payments' },
  { name: 'Memorial', href: '#memorial' },
  { name: 'Photos', href: '#album' },
  { name: 'Time Capsule', href: '#nostalgia' },
  { name: 'Details', href: '#details' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-5xl mx-auto px-4">
        <div className={`glass rounded-full px-6 py-3 flex items-center justify-between border-white/10 ${isScrolled ? 'bg-black/80' : 'bg-black/40'}`}>
          <div className="flex items-center gap-2">
            <span className="text-husky-light-blue font-black tracking-tighter text-xl">2006</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.item}
                href={item.href}
                className="text-white/70 hover:text-husky-light-blue text-xs uppercase font-black tracking-widest transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="md:hidden">
            {/* Simple Mobile indicator or Menu could go here, but keeping it minimal for now */}
            <span className="text-husky-light-blue font-black text-[10px] uppercase tracking-widest">Menu</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
