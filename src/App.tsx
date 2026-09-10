import { useState, useEffect, useRef } from 'react';
import { AppleIcon, GithubIcon } from './components/icons';
import { FloatingHistoryHud } from './components/FloatingHistoryHud';
import { SpecularButton } from './components/SpecularButton';
import { BorderGlow } from './components/BorderGlow';
import { FeaturesBento } from './components/FeaturesBento';

export function App() {
  const [isHudOpen, setIsHudOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hudTriggerRef = useRef<HTMLDivElement | null>(null);

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
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0D0E12] text-slate-900 dark:text-slate-100 selection:bg-blue-500/20 selection:text-blue-950 font-sans relative overflow-x-hidden antialiased">
      {/* ============================================================ */}
      {/* SECTION 1: HERO VIEWPORT (EXACTLY FULL SCREEN)               */}
      {/* ============================================================ */}
      <section className="relative w-full h-screen h-[100dvh] min-h-[640px] flex flex-col justify-between items-center px-4 pt-4 sm:pt-6 pb-6 overflow-hidden">
        {/* Ambient Video Background Covering 100% of Screen 1 */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/bg-clipplic-poster.jpg"
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
              src="/app-icon.png"
              alt="Clipplic icon"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm rounded-lg"
              width={36}
              height={36}
            />
            <span className="font-display text-xl sm:text-2xl text-slate-950 dark:text-white tracking-wider">
              CLIPPLIC
            </span>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/xzedm/clipplic"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star Clipplic on GitHub, 1,200 stars"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-xs hover:bg-white dark:hover:bg-slate-900 active:scale-[0.98] transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
              <span className="font-mono text-[11px]">GitHub</span>
              <span className="sr-only">1.2 thousand stars</span>
            </a>
          </div>
        </header>

        {/* Hero Main Content */}
        <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center text-center my-auto pt-2 pb-4">
          {/* Display Headline in Tanker - Dynamic negative blend with luminous white lift */}
          <h1 className="font-display text-5xl sm:text-7xl md:text-[88px] tracking-wide leading-[0.92] uppercase mb-4 animate-fade-up animation-delay-100 text-balance select-none relative">
            {/* Base negative difference blend layer */}
            <span className="block text-white mix-blend-difference">
              Copy less.
              <br />
              Remember more.
            </span>
            {/* Luminous white lift layer: keeps it bright and whitish without being totally flat white */}
            <span
              aria-hidden="true"
              className="block absolute inset-0 text-white/55 pointer-events-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.18)]"
            >
              Copy less.
              <br />
              Remember more.
            </span>
          </h1>

          {/* Subtitle with careful measure and high legibility */}
          <p className="text-slate-950 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-[540px] text-center mb-6 animate-fade-up animation-delay-200 text-pretty">
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
              aria-label="Download Clipplic for macOS"
            >
              <AppleIcon className="w-4 h-4 mr-2" />
              <span>Download for macOS</span>
            </SpecularButton>

            <span className="text-xs text-slate-800 font-medium mt-2.5 select-none">
              Free forever • Open Source • 100% On-Device
            </span>

            {/* Try HUD Live Call To Action with BorderGlow */}
            <div ref={hudTriggerRef} className="mt-5">
              <BorderGlow
                borderRadius={24}
                edgeSensitivity={25}
                glowRadius={32}
                glowIntensity={1.1}
                glowColor="210 100 65"
                backgroundColor="#ffffff"
                colors={['#0071E3', '#38bdf8', '#60a5fa']}
                animated={false}
                className="cursor-pointer active:scale-95 transition-all select-none shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,113,227,0.18)]"
                onClick={() => setIsHudOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Try the Floating HUD live, keyboard shortcut Command Shift V"
              >
                <div className="flex items-center gap-2.5 px-4 py-2.5 sm:py-2 text-xs font-medium text-slate-800">
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
        </div>

        {/* Sleek frosted scroll cue */}
        <div className="relative z-10 pt-1 select-none animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white/95 border border-white/25 text-[11px] font-mono shadow-xs">
            <span>↓</span>
            <span>Scroll to explore</span>
          </span>
        </div>
      </section>

      {/* SECTION 2: GSAP-POWERED GAPLESS BENTO FEATURES */}
      <FeaturesBento />

      {/* SECTION 3: BOTTOM CALLOUT CTA */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-28 flex flex-col items-center">
        {/* Big Bottom Callout Section */}
        <div className="w-full rounded-3xl bg-gradient-to-b from-white to-slate-100/70 dark:from-[#16181F] dark:to-[#111216] border border-slate-200/90 dark:border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] p-8 sm:p-14 text-center flex flex-col items-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide uppercase text-slate-950 dark:text-white mb-3 leading-[0.95] text-balance">
            Useful things should be easy to keep.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8 max-w-md text-pretty">
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
              aria-label="Download Clipplic for macOS"
            >
              <AppleIcon className="w-4 h-4 mr-2" />
              <span>Download for macOS</span>
            </SpecularButton>

            <a
              href="https://github.com/xzedm/clipplic"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star Clipplic on GitHub"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1C1E26] border border-slate-200/90 dark:border-white/10 shadow-xs hover:bg-slate-50 dark:hover:bg-[#232630] active:scale-[0.98] transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            >
              <GithubIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="relative z-10 w-full border-t border-slate-200/70 dark:border-white/10 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-display text-slate-800 dark:text-slate-200 text-lg tracking-wider">
            <img
              src="/app-icon.png"
              alt="Clipplic logo"
              className="w-5 h-5 object-contain rounded"
              width={20}
              height={20}
            />
            <span>CLIPPLIC</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <a href="https://github.com/xzedm/clipplic" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded px-1">
              Source Code
            </a>
            <a href="https://github.com/xzedm/clipplic/releases" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded px-1">
              Release Notes
            </a>
            <a href="https://github.com/xzedm/clipplic/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded px-1">
              MIT License
            </a>
          </div>

          <span className="font-normal select-none">
            Crafted for macOS by <a href="https://github.com/xzedm" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 dark:text-slate-300 hover:underline">@xzedm</a>
          </span>
        </div>
      </footer>

      {/* FLOATING HUD SEARCH PALETTE (SUMMONED ON ⌘⇧V OR CLICK) */}
      <FloatingHistoryHud
        isOpen={isHudOpen}
        onClose={() => setIsHudOpen(false)}
        triggerRef={hudTriggerRef}
      />
    </div>
  );
}

export default App;
