import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Zap,
  ShieldCheck,
  Palette,
  Search,
  ExternalLink,
  Code2,
  Check,
  HardDrive,
  Cpu,
  Lock
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FeaturesBento: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  // Interactive search state for Instant Recall card
  const [searchQuery, setSearchQuery] = useState('restoreAndPaste');
  const [activeFormatTab, setActiveFormatTab] = useState<'colors' | 'code' | 'links' | 'text'>('colors');
  const [copiedColor, setCopiedColor] = useState(false);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Bento cards staggered entrance
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children).slice(0, 3);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 92%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    // Refresh ScrollTrigger after DOM paints
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const handleCopyHex = (hex: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(hex).catch(() => {});
    }
    setCopiedColor(true);
    setTimeout(() => setCopiedColor(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full max-w-6xl mx-auto px-4 py-28 sm:py-36 md:py-44 flex flex-col items-center"
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Section Header: Wide Editorial 2-Line Layout */}
      <div ref={headerRef} className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight uppercase text-slate-950 dark:text-white leading-[0.94] mb-6 text-balance">
          Built for Speed.
          <br />
          Crafted for Privacy.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-pretty font-normal">
          <strong className="font-semibold text-slate-900 dark:text-slate-100">No background battery drain</strong>.
          {' '}No subscriptions. No cloud relay. Just instant clipboard recall engineered to feel like a native macOS utility.
        </p>
      </div>

      {/* Gapless Bento Grid (12 Columns, mathematically dense) */}
      <div
        ref={cardsRef}
        className="w-full grid grid-cols-12 grid-flow-dense gap-6"
      >
        {/* ============================================================ */}
        {/* CARD 1: INSTANT RECALL (7 COLS)                              */}
        {/* ============================================================ */}
        <div className="col-span-12 lg:col-span-7 rounded-3xl bg-white dark:bg-[#16181F] border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 md:p-10 relative overflow-hidden group hover:border-[#0071E3]/40 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between">
          <div>
            {/* Card Header & Metrics */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-[#0071E3] dark:text-blue-400 flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Engine
                  </span>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Direct Memory Bus
                  </div>
                </div>
              </div>

              {/* Latency Live Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Latency ~12ms</span>
              </div>
            </div>

            {/* Typography */}
            <h3 className="font-display text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-wide uppercase mb-3">
              Instant Recall
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed text-pretty max-w-lg mb-8">
              Summon your history anywhere with <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">⌘⇧V</kbd>. Search fuzzy matches across thousands of clips in under 12ms.
            </p>
          </div>

          {/* Interactive Search Visualizer */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#111216] border border-slate-200/80 dark:border-white/10 p-4 shadow-inner">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#1A1C24] border border-slate-200/80 dark:border-white/10 mb-3 shadow-xs">
              <Search className="w-4 h-4 text-[#0071E3]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to test fuzzy search..."
                className="w-full text-xs font-mono bg-transparent text-slate-900 dark:text-white outline-none"
              />
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500">
                12ms
              </span>
            </div>

            {/* Micro Match Results */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2 truncate">
                  <Code2 className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span className="truncate font-medium">func restoreAndPaste(item: ClipboardItem)</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                  99.8% match
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-transparent text-slate-500 dark:text-slate-400 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="truncate">Xcode project build configuration</span>
                </div>
                <span className="text-[10px] font-mono">Today, 3:58 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CARD 2: 100% ON-DEVICE (5 COLS)                              */}
        {/* ============================================================ */}
        <div className="col-span-12 lg:col-span-5 rounded-3xl bg-white dark:bg-[#16181F] border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 md:p-10 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between">
          <div>
            {/* Card Header & Metrics */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Network
                  </span>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Air-Gapped Vault
                  </div>
                </div>
              </div>

              {/* Zero Requests Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold shadow-2xs">
                <span>0 Requests</span>
              </div>
            </div>

            {/* Typography */}
            <h3 className="font-display text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-wide uppercase mb-3">
              100% On-Device
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed text-pretty mb-8">
              Your clipboard never leaves your computer. Zero telemetry, zero analytics, and zero network sockets. Stored in encrypted local SQLite.
            </p>
          </div>

          {/* Secure Enclave / SQLite Architecture Card */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#111216] border border-slate-200/80 dark:border-white/10 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-white/10 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Encrypted Storage</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                SQLite AES-256
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Telemetry Sockets</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">None</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>CPU Footprint</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">&lt; 0.1%</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CARD 3: CONTENT-AWARE INTELLIGENCE (12 COLS PANORAMIC)       */}
        {/* ============================================================ */}
        <div className="col-span-12 rounded-3xl bg-white dark:bg-[#16181F] border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 md:p-12 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Detail Description */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                  <Palette className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Parser
                  </span>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Multi-Format Engine
                  </div>
                </div>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-950 dark:text-white tracking-wide uppercase mb-3">
                Content-Aware
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed text-pretty mb-6">
                Automatically formats hex colors with live visual swatches, syntax-highlights code snippets, and lets you open web links with a single keystroke.
              </p>

              {/* Format selection chips */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {(['colors', 'code', 'links', 'text'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFormatTab(tab)}
                    className={`px-3 py-1.5 rounded-xl border transition-all text-xs font-medium capitalize ${
                      activeFormatTab === tab
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 shadow-2xs'
                        : 'bg-slate-100/80 dark:bg-slate-800/80 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/70'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Interactive Live Stage */}
            <div className="lg:col-span-7">
              {activeFormatTab === 'colors' && (
                <div className="rounded-2xl bg-slate-50 dark:bg-[#111216] border border-slate-200/80 dark:border-white/10 p-6 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl shadow-md border border-white/40 ring-1 ring-black/5"
                        style={{ backgroundColor: '#0071E3' }}
                      />
                      <div>
                        <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                          #0071E3
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          rgb(0, 113, 227) • System Blue
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyHex('#0071E3')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
                    >
                      {copiedColor ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <span>Copy HEX</span>
                      )}
                    </button>
                  </div>

                  {/* Gradient swatch spectrum preview */}
                  <div className="h-4 rounded-lg bg-linear-to-r from-blue-700 via-[#0071E3] to-sky-400 border border-white/20" />
                </div>
              )}

              {activeFormatTab === 'code' && (
                <div className="rounded-2xl bg-slate-950 text-slate-100 p-5 font-mono text-xs border border-white/10 shadow-inner animate-fade-in">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2">ClipboardHelper.swift</span>
                    </div>
                    <span>Swift 6.0</span>
                  </div>
                  <pre className="text-slate-300 leading-relaxed overflow-x-auto">
                    <code>{`func restoreAndPaste(item: ClipboardItem) {
    NSPasteboard.general.clearContents()
    writeItemToPasteboard(item)
    simulateCommandV()
}`}</code>
                  </pre>
                </div>
              )}

              {activeFormatTab === 'links' && (
                <div className="rounded-2xl bg-slate-50 dark:bg-[#111216] border border-slate-200/80 dark:border-white/10 p-6 animate-fade-in space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                        
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          macOS Sonoma &amp; Sequoia
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          apple.com/macos/sonoma
                        </div>
                      </div>
                    </div>
                    <a
                      href="https://www.apple.com/macos/sonoma"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors"
                      aria-label="Open link in browser"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Automatic OpenGraph metadata resolution, title extraction, and 1-click browser navigation.
                  </p>
                </div>
              )}

              {activeFormatTab === 'text' && (
                <div className="rounded-2xl bg-slate-50 dark:bg-[#111216] border border-slate-200/80 dark:border-white/10 p-6 animate-fade-in space-y-3">
                  <div className="text-xs font-mono text-slate-500 flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-2">
                    <span>Plain Text Inspector</span>
                    <span>118 characters • 3 lines</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                    Clipboard recall with clean formatting, whitespace trimming, and instantaneous search indexing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBento;
