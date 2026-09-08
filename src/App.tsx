import { useState, useEffect, useRef } from 'react';
import { AppleIcon, GithubIcon } from './components/icons';
import { FloatingHistoryHud } from './components/FloatingHistoryHud';
import { SpecularButton } from './components/SpecularButton';
import { BorderGlow } from './components/BorderGlow';
import {
  ShieldCheck,
  Zap,
  Palette,
  Sparkles
} from 'lucide-react';

export function App() {
  const [isHudOpen, setIsHudOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure video autoplays smoothly across all browsers
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const tryPlay = () => {
            video.play().catch(() => {});
            window.removeEventListener('click', tryPlay);
            window.removeEventListener('keydown', tryPlay);
            window.removeEventListener('touchstart', tryPlay);
          };
          window.addEventListener('click', tryPlay, { once: true });
          window.addEventListener('keydown', tryPlay, { once: true });
          window.addEventListener('touchstart', tryPlay, { once: true });
        });
      }
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 selection:bg-blue-500/20 selection:text-blue-950 font-sans relative overflow-x-hidden antialiased">
      {/* ============================================================ */}
      {/* SECTION 1: HERO VIEWPORT (EXACTLY FULL SCREEN)               */}
      {/* ============================================================ */}
      <section className="relative w-full h-screen h-[100dvh] min-h-[680px] flex flex-col justify-between items-center px-4 pt-6 pb-6 overflow-hidden">
        {/* Ambient Video Background Covering 100% of Screen 1 */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full min-w-full min-h-full object-cover"
          >
            <source src="/bg-clipplic.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Top Floating Navigation Bar */}
        <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between px-2 sm:px-4 py-2 animate-fade-in">
          {/* Logo + Brand Wordmark */}
          <div className="flex items-center gap-2.5 select-none">
            <img
              src="/clipplic-iOS-Default-1024x1024@1x.png"
              alt="Clipplic logo"
              className="w-9 h-9 object-contain drop-shadow-sm"
            />
            <span className="font-display text-xl sm:text-2xl text-slate-950 tracking-wider">
              CLIPPLIC
            </span>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/xzedm/clipplic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-xs hover:bg-white active:scale-[0.98] transition-all"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-800" />
              <span className="font-mono text-[11px]">GitHub</span>
            </a>
          </div>
        </header>

        {/* Hero Main Content */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center my-auto pt-2 pb-4">
          {/* Display Headline in Tanker */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-[88px] tracking-wide text-slate-950 leading-[0.92] uppercase mb-4 animate-fade-up animation-delay-100 text-balance">
            Copy less.
            <br />
            Remember more.
          </h1>

          {/* Subtitle with careful measure and high legibility */}
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed max-w-[500px] text-center mb-6 animate-fade-up animation-delay-200 text-pretty">
            A calm, private clipboard history for macOS. Everything you copy is right where you left it — ready when you need it.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-col items-center animate-fade-up animation-delay-300">
            <SpecularButton
              size="lg"
              radius={18}
              tint="#0071E3"
              tintOpacity={1}
              blur={12}
              textColor="#ffffff"
              lineColor="#ffffff"
              baseColor="#0058b3"
              intensity={1.2}
              shineSize={12}
              shineFade={40}
              thickness={1.2}
              speed={0.35}
              followMouse={true}
              proximity={250}
              autoAnimate={false}
              href="https://github.com/xzedm/clipplic/releases"
              target="_blank"
              className="shadow-[0_8px_24px_rgba(0,113,227,0.38)]"
            >
              <AppleIcon className="w-4 h-4 mr-2" />
              <span>Download for macOS</span>
            </SpecularButton>

            <span className="text-xs text-slate-600 font-medium mt-2.5 select-none">
              Free forever • Open Source • 100% On-Device
            </span>

            {/* Try HUD Live Call To Action with BorderGlow */}
            <BorderGlow
              borderRadius={24}
              edgeSensitivity={25}
              glowRadius={32}
              glowIntensity={1.1}
              glowColor="210 100 65"
              backgroundColor="#ffffff"
              colors={['#0071E3', '#38bdf8', '#60a5fa']}
              animated={false}
              className="mt-5 cursor-pointer active:scale-95 transition-all select-none shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,113,227,0.18)]"
              onClick={() => setIsHudOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-800">
                <span className="font-semibold text-slate-900">Try the Floating HUD live</span>
                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs text-[10px] font-semibold">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs text-[10px] font-semibold">⇧</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs text-[10px] font-semibold">V</kbd>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>

        {/* Sleek frosted scroll cue */}
        <div className="relative z-10 pt-1 select-none animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white/95 border border-white/25 text-[11px] font-mono shadow-xs">
            <span>↓</span>
            <span>Scroll to explore</span>
          </span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: BELOW THE FOLD ARCHITECTURE & FEATURES            */}
      {/* ============================================================ */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-20 pb-20 flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-blue-700 bg-blue-50 border border-blue-200/80 mb-4 uppercase tracking-wider select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure macOS Craft</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide uppercase text-slate-950 leading-[0.95] mb-4 text-balance">
            Built for Speed.
            <br />
            Crafted for Privacy.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto text-pretty">
            No background battery drain. No subscriptions. No cloud relay. Just instant clipboard recall engineered to feel like a native macOS utility.
          </p>
        </div>

        {/* 3 Bespoke Feature Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Feature 1 */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071E3] flex items-center justify-center mb-5 border border-blue-100">
                <Zap className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="font-display text-2xl tracking-wide uppercase text-slate-950 mb-2">
                Instant Recall
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                Summon your history anywhere with <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-mono">⌘⇧V</kbd>. Search fuzzy matches across thousands of clips in under 12ms.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Latency</span>
              <span className="font-semibold text-emerald-600">~12ms</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="font-display text-2xl tracking-wide uppercase text-slate-950 mb-2">
                100% On-Device
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                Your clipboard never leaves your computer. Zero telemetry, zero analytics, and zero network sockets. Stored in encrypted local SQLite.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Network Access</span>
              <span className="font-semibold text-slate-900">0 Requests</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 border border-purple-100">
                <Palette className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="font-display text-2xl tracking-wide uppercase text-slate-950 mb-2">
                Content-Aware
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                Automatically formats hex colors with live visual swatches, syntax-highlights code snippets, and lets you open web links with a single keystroke.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Formats</span>
              <span className="font-semibold text-slate-900">Text • Links • Code • Colors</span>
            </div>
          </div>
        </div>

        {/* Big Bottom Callout Section */}
        <div className="w-full rounded-3xl bg-gradient-to-b from-white to-slate-100/70 border border-slate-200/90 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] p-8 sm:p-14 text-center flex flex-col items-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide uppercase text-slate-950 mb-3 leading-[0.95] text-balance">
            Useful things should be easy to keep.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-md text-pretty">
            Clipplic is completely free and open source. Download the latest binary for macOS Sonoma and Sequoia.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <SpecularButton
              size="lg"
              radius={18}
              tint="#0071E3"
              tintOpacity={1}
              blur={12}
              textColor="#ffffff"
              lineColor="#ffffff"
              baseColor="#0058b3"
              intensity={1.2}
              shineSize={12}
              shineFade={40}
              thickness={1.2}
              speed={0.35}
              followMouse={true}
              proximity={250}
              autoAnimate={false}
              href="https://github.com/xzedm/clipplic/releases"
              target="_blank"
              className="shadow-[0_8px_24px_rgba(0,113,227,0.32)]"
            >
              <AppleIcon className="w-4 h-4 mr-2" />
              <span>Download for macOS</span>
            </SpecularButton>

            <a
              href="https://github.com/xzedm/clipplic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium text-slate-800 bg-white border border-slate-200/90 shadow-xs hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <GithubIcon className="w-4 h-4 text-slate-700" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="relative z-10 w-full border-t border-slate-200/70 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-display text-slate-800 text-lg tracking-wider">
            <img
              src="/clipplic-iOS-Default-1024x1024@1x.png"
              alt="Clipplic logo"
              className="w-5 h-5 object-contain"
            />
            <span>CLIPPLIC</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <a href="https://github.com/xzedm/clipplic" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
              Source Code
            </a>
            <a href="https://github.com/xzedm/clipplic/releases" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
              Release Notes
            </a>
            <a href="https://github.com/xzedm/clipplic/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
              MIT License
            </a>
          </div>

          <span className="font-normal select-none">
            Crafted for macOS by <a href="https://github.com/xzedm" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 hover:underline">@xzedm</a>
          </span>
        </div>
      </footer>

      {/* FLOATING HUD SEARCH PALETTE (SUMMONED ON ⌘⇧V OR CLICK) */}
      <FloatingHistoryHud
        isOpen={isHudOpen}
        onClose={() => setIsHudOpen(false)}
      />
    </div>
  );
}

export default App;
