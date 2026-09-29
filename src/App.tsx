import { useState, useEffect, useRef } from 'react';
import { AppleIcon, GithubIcon } from './components/icons';
import { FloatingHistoryHud } from './components/FloatingHistoryHud';
import { SpecularButton } from './components/SpecularButton';
import { HudLiveCard } from './components/HudLiveCard';
import { ClipRibbon } from './components/ClipRibbon';
import { KeycapSection } from './components/KeycapSection';
import { Receipt } from './components/ReceiptSection';
import { Reveal } from './components/Reveal';

export function App() {
  const [isHudOpen, setIsHudOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hudTriggerRef = useRef<HTMLButtonElement | null>(null);

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
            video.play().catch(() => { });
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
          {/* Subtle bottom gradient to blend the meadow horizon into #F8F9FB */}
          <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-t from-[#F8F9FB] via-[#F8F9FB]/60 to-transparent pointer-events-none" />
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
              aria-label="Star Clipplic on GitHub, 1,200 stars"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-medium text-slate-800 bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-xs hover:bg-white active:scale-[0.98] transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-800" />
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
            {/* Luminous white lift layer */}
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

            {/* Spotlight HUD Live Trigger */}
            <div className="mt-4 w-full flex justify-center">
              <HudLiveCard
                ref={hudTriggerRef}
                onClick={() => setIsHudOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Hero footline — quiet facts pinned to the horizon */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-2 sm:px-4 flex items-end justify-between gap-4 text-[11px] font-mono text-slate-700 select-none animate-fade-in animation-delay-500">
          <span>For macOS Sonoma &amp; Sequoia</span>
          <span className="hidden sm:inline">Free · MIT · Runs on-device</span>
        </div>
      </section>

      <main id="main" className="relative sky-wash">
        {/* ============================================================ */}
        {/* SECTION 2: CLIP RIBBON                                       */}
        {/* ============================================================ */}
        <section className="relative pt-20 sm:pt-28 pb-10 overflow-hidden" aria-labelledby="ribbon-title">
          <Reveal className="w-full max-w-5xl mx-auto px-4 sm:px-8 grid md:grid-cols-12 gap-6 items-end mb-10 sm:mb-14">
            <h2
              id="ribbon-title"
              className="md:col-span-7 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide leading-[0.92] text-slate-950 text-balance"
            >
              Everything you copied today. Still here.
            </h2>
            <p className="md:col-span-4 md:col-start-9 text-[15px] text-slate-600 leading-relaxed text-pretty">
              Links from Safari, colors from Figma, a command you ran once in Terminal. Clipplic quietly keeps each one, with the app it came from.
            </p>
          </Reveal>
          <ClipRibbon />
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: PRODUCT DEMO                                      */}
        {/* ============================================================ */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 pt-20 sm:pt-28 pb-12" aria-labelledby="demo-title">
          <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-center">
            <Reveal className="md:col-span-4">
              <h2
                id="demo-title"
                className="font-display text-4xl sm:text-5xl uppercase tracking-wide leading-[0.92] text-slate-950 text-balance"
              >
                Watch it work.
              </h2>
              <p className="mt-4 text-[15px] text-slate-600 leading-relaxed max-w-[36ch] text-pretty">
                Text, images, code, files. Open the panel, type a few letters, and the right clip is already selected.
              </p>
            </Reveal>

            <Reveal className="md:col-span-8" delay={120}>
              {/* macOS-style window frame */}
              <figure className="rounded-2xl overflow-hidden bg-white shadow-[0_0_0_1px_rgba(30,58,110,0.08),0_2px_4px_rgba(30,58,110,0.05),0_40px_80px_-30px_rgba(30,58,110,0.4)]">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F1F3F6] border-b border-slate-200/80">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                  <span className="flex-1 text-center text-[11px] text-slate-500 select-none -ml-14">Clipplic</span>
                </div>
                <img
                  src="/clipplic-demo.gif?v=3"
                  alt="Clipplic clipboard manager demo showing copy history, search, and instant paste"
                  className="w-full block bg-white object-cover"
                  width={774}
                  height={448}
                  loading="lazy"
                />
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: THE SHORTCUT                                      */}
        {/* ============================================================ */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 pt-24 sm:pt-32 pb-12" aria-labelledby="keys-title">
          <Reveal>
            <h2
              id="keys-title"
              className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide leading-[0.92] text-slate-950 mb-12 sm:mb-16 max-w-[14ch]"
            >
              Three keys. No hunting.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <KeycapSection onTry={() => setIsHudOpen(true)} />
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: THE BILL + DOWNLOAD                               */}
        {/* ============================================================ */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 pt-24 sm:pt-32 pb-28 sm:pb-36" aria-labelledby="cta-title">
          <div className="grid md:grid-cols-12 gap-14 md:gap-8 items-center">
            <Reveal className="md:col-span-6 lg:col-span-7">
              <h2
                id="cta-title"
                className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide leading-[0.92] text-slate-950 text-balance"
              >
                Useful things should be easy to keep.
              </h2>
              <p className="mt-5 text-[15px] text-slate-600 leading-relaxed max-w-[42ch] text-pretty">
                Clipplic is free and open source, with no subscription to cancel later. Your history lives on your Mac and nowhere else.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <SpecularButton
                  size="lg"
                  radius={16}
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
                  className="shadow-[0_10px_28px_-8px_rgba(0,113,227,0.55)]"
                  aria-label="Download Clipplic for macOS"
                >
                  <AppleIcon className="w-4 h-4 mr-2" />
                  <span>Download for macOS</span>
                </SpecularButton>

                <a
                  href="https://github.com/xzedm/clipplic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span className="underline decoration-slate-300 group-hover:decoration-slate-600 underline-offset-4">Read the source</span>
                </a>
              </div>
            </Reveal>

            <Reveal className="md:col-span-6 lg:col-span-5 flex justify-center md:justify-end" delay={150}>
              <Receipt />
            </Reveal>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="relative z-10 w-full border-t border-slate-200/80 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-display text-slate-800 text-lg tracking-wider">
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
            <a href="https://github.com/xzedm/clipplic" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded px-1">
              Source Code
            </a>
            <a href="https://github.com/xzedm/clipplic/releases" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded px-1">
              Release Notes
            </a>
            <a href="https://github.com/xzedm/clipplic/blob/main/LICENSE.md" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded px-1">
              MIT License
            </a>
          </div>

          <span className="font-normal select-none">
            Crafted for macOS by <a href="https://github.com/xzedm" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 hover:underline">@xzedm</a>
          </span>
        </div>
      </footer>

      <div className="grain" aria-hidden="true" />

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
