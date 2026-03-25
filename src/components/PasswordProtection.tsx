'use client';

import { useState, useEffect } from 'react';


export default function PasswordProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const unlocked = localStorage.getItem('site_unlocked');
    if (unlocked === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      localStorage.setItem('site_unlocked', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-husky-black p-4">
        <div className="glass w-full max-w-md p-10 rounded-3xl border-white/10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-husky-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Husky Pride Only</h2>
          <p className="text-zinc-400 mb-8 italic">Enter our graduation year to view the reunion site.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Graduation Year"
              className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-center text-white text-2xl font-black placeholder:text-zinc-700 focus:outline-none focus:border-husky-light-blue transition-all`}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm font-bold">Incorrect year. Try again!</p>}
            <button
              type="submit"
              className="w-full bg-husky-blue hover:bg-husky-light-blue text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-husky-blue/20 uppercase tracking-widest"
            >
              Enter Site
            </button>
          </form>
          <p className="mt-8 text-zinc-600 text-xs"> Bishop Carroll Class of 2006 Private Site</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
