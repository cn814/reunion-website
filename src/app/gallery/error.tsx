'use client';

export default function GalleryError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-2xl font-bold">Something went wrong loading the gallery</h1>
      <pre className="text-red-400 text-sm bg-white/5 p-4 rounded-xl max-w-xl w-full overflow-auto">
        {error.message}
        {'\n'}
        {error.stack}
      </pre>
      <button
        onClick={reset}
        className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-sm font-bold"
      >
        Try again
      </button>
    </div>
  );
}
