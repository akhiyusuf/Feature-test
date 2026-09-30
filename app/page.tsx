import ReciteAfterMe from '@/components/recite-after-me';
import ErudaLoader from '@/components/ErudaLoader';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <ErudaLoader />

      {/* Hero Header */}
      <header className="pt-10 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <span>AI Quran Recitation & Memorization</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Recite After Me
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Memorize the Holy Quran chunk-by-chunk. Listen to the Shaykh, recite after him, and get instant real-time AI feedback with mistake detection.
        </p>
      </header>

      {/* Main Recite After Me Application */}
      <section className="flex-1 flex flex-col items-center justify-start px-4 pb-12">
        <ReciteAfterMe />
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>Recite After Me • Powered by Whisper Arabic Quran ASR & Real-Time Alignment</p>
      </footer>
    </main>
  );
}
