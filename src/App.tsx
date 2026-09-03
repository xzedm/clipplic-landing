import { useState, useEffect, useCallback } from 'react';
import { AppleIcon, GithubIcon } from './components/icons';
import { FloatingHistoryHud } from './components/FloatingHistoryHud';
import { History, Lock, Keyboard, Check } from 'lucide-react';

export function App() {
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pasteSuccess, setPasteSuccess] = useState(false);

  // Global shortcut listener (⌘ + Shift + V / Ctrl + Shift + V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setIsHudOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClipSelected = useCallback((clipContent: string) => {
    setPastedText(clipContent);
    setPasteSuccess(true);
    setTimeout(() => setPasteSuccess(false), 2400);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-500/20 selection:text-blue-900 font-sans flex flex-col justify-between relative overflow-x-hidden">
      {/* Soft, calm radial background glow matching the screenshot */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 15%, rgba(186, 230, 253, 0.45) 0%, rgba(224, 242, 254, 0.25) 40%, rgba(248, 250, 252, 0) 70%)'
        }}
      />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-12 sm:pt-16 pb-16 flex flex-col items-center">
        {/* ============================================================ */}
        {/* TOP BRAND (CENTERED LOGO + CLIPPLIC TEXT)                    */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2.5 mb-10 sm:mb-12 select-none animate-fade-in">
          <img src="/logo.svg" alt="Clipplic logo" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-slate-900 text-sm tracking-tight">Clipplic</span>
        </div>

        {/* ============================================================ */}
        {/* HERO TITLE & SUBTITLE                                        */}
        {/* ============================================================ */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-[68px] font-bold tracking-[-0.035em] text-slate-950 leading-[1.04] mb-5 animate-fade-up animation-delay-100">
            Copy less.
            <br />
            Remember more.
          </h1>

          <p className="text-slate-500 text-base sm:text-[17px] font-normal leading-relaxed max-w-[480px] text-center mb-7 animate-fade-up animation-delay-200">
            A calm, private clipboard history for macOS. Everything you copy is right where you left it — ready when you need it.
          </p>

          {/* CTA Buttons Group */}
          <div className="flex flex-col items-center animate-fade-up animation-delay-300">
            <a
              href="https://github.com/xzedm/clipplic/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#2A85FF] hover:bg-[#2075EB] shadow-[0_4px_14px_rgba(42,133,255,0.3)] active:scale-[0.98] transition-all"
            >
              <AppleIcon className="w-4 h-4" />
              <span>Download for macOS</span>
            </a>

            {/* Subtext under button */}
            <span className="text-xs text-slate-400 font-normal mt-2.5 mb-3.5 select-none">
              Free forever • macOS 13 or later
            </span>

            {/* View on GitHub pill button */}
            <a
              href="https://github.com/xzedm/clipplic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200/90 shadow-sm hover:bg-slate-50 transition-all"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>View on GitHub</span>
            </a>
          </div>

          {/* ============================================================ */}
          {/* INTERACTIVE SHORTCUT TEST FIELD (SUMMONS ON ⌘⇧V)            */}
          {/* ============================================================ */}
          <div className="w-full max-w-[460px] mt-8 animate-fade-up animation-delay-400">
            <div className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
              <input
                type="text"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Press ⌘⇧V to summon history & paste..."
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none font-sans"
              />
              <button
                onClick={() => setIsHudOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition-colors shrink-0 select-none shadow-2xs"
                title="Click or press ⌘ + Shift + V"
              >
                <span>⌘</span>
                <span>⇧</span>
                <span>V</span>
              </button>
            </div>

            {pasteSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium mt-2 animate-in fade-in">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Pasted from Clipplic history!</span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3-COLUMN FEATURES SECTION                                    */}
        {/* ============================================================ */}
        <div className="w-full border-t border-b border-slate-200/70 my-16 sm:my-20 py-10 sm:py-12 animate-fade-up animation-delay-500">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 gap-8 md:gap-0">
            {/* Column 1 */}
            <div className="md:px-8 first:pl-0 flex flex-col items-start text-left">
              <div className="w-5 h-5 text-slate-800 mb-3.5">
                <History className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-1.5">
                A memory for your copies.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Text, links, and snippets stay available without breaking your flow.
              </p>
            </div>

            {/* Column 2 */}
            <div className="pt-8 md:pt-0 md:px-8 flex flex-col items-start text-left">
              <div className="w-5 h-5 text-slate-800 mb-3.5">
                <Lock className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-1.5">
                Private from the start.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your clipboard is yours. No account, no ads, no data collection.
              </p>
            </div>

            {/* Column 3 */}
            <div className="pt-8 md:pt-0 md:px-8 last:pr-0 flex flex-col items-start text-left">
              <div className="w-5 h-5 text-slate-800 mb-3.5">
                <Keyboard className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-1.5">
                There when you need it.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Open your history, find a clip, and paste it — entirely from the keyboard.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM CALLOUT SECTION                                       */}
        {/* ============================================================ */}
        <div className="text-center max-w-xl mx-auto my-10 sm:my-14 flex flex-col items-center animate-fade-up animation-delay-600">
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight text-slate-950 mb-3 leading-tight">
            Useful things should be easy to keep.
          </h2>
          <p className="text-sm text-slate-500 mb-6 font-normal">
            Clipboard is free for everyone, forever.
          </p>

          <a
            href="https://github.com/xzedm/clipplic/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#2A85FF] hover:bg-[#2075EB] shadow-[0_4px_14px_rgba(42,133,255,0.3)] active:scale-[0.98] transition-all"
          >
            <AppleIcon className="w-4 h-4" />
            <span>Download for macOS</span>
          </a>
        </div>
      </main>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="w-full border-t border-slate-200/70 py-8 px-4 text-center">
        <span className="text-xs text-slate-400 font-normal select-none">
          Made by @xzedm
        </span>
      </footer>

      {/* ============================================================ */}
      {/* FLOATING HUD OVERLAY (ONLY SHOWN ON SHORTCUT OR TRIGGER)     */}
      {/* ============================================================ */}
      <FloatingHistoryHud
        isOpen={isHudOpen}
        onClose={() => setIsHudOpen(false)}
        onSelectClip={handleClipSelected}
      />
    </div>
  );
}

export default App;
