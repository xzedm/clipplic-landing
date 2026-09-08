import { useState, useEffect, useCallback, useRef } from 'react';
import { AppleIcon, GithubIcon } from './components/icons';
import { FloatingHistoryHud } from './components/FloatingHistoryHud';
import {
  Check,
  Link2,
  FileText,
  ShieldCheck,
  Zap,
  Palette,
  Code2,
  Sparkles
} from 'lucide-react';

interface MockClip {
  id: string;
  type: 'text' | 'link' | 'code' | 'color';
  content: string;
  badge?: string;
  colorHex?: string;
  timeAgo: string;
}

const SAMPLE_CLIPS: MockClip[] = [
  {
    id: '1',
    type: 'text',
    content: 'The fastest way to keep your copied ideas close.',
    timeAgo: 'Now'
  },
  {
    id: '2',
    type: 'link',
    content: 'https://www.apple.com/macos',
    timeAgo: '2 min'
  },
  {
    id: '3',
    type: 'code',
    content: 'git commit -m "feat: native clipboard history"',
    badge: 'bash',
    timeAgo: '14 min'
  },
  {
    id: '4',
    type: 'color',
    content: '#0071E3',
    colorHex: '#0071E3',
    badge: 'Hex Color',
    timeAgo: 'Yesterday'
  }
];

export function App() {
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [activeClipId, setActiveClipId] = useState<string>('1');
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

  const handleCopyCardItem = useCallback((clip: MockClip) => {
    setActiveClipId(clip.id);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(clip.content).catch(() => {});
    }
    setCopiedItem(clip.content);
    setTimeout(() => setCopiedItem(null), 2000);
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

          {/* Right Status Pill */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-slate-700 bg-white/80 backdrop-blur-md border border-white/60 shadow-xs select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              macOS 13+ • Apple Silicon & Intel
            </span>
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
            <a
              href="https://github.com/xzedm/clipplic/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-[0_4px_16px_rgba(0,113,227,0.35)] active:scale-[0.98] transition-all"
            >
              <AppleIcon className="w-4 h-4" />
              <span>Download for macOS</span>
            </a>

            <span className="text-xs text-slate-600 font-medium mt-2.5 select-none">
              Free forever • Open Source • 100% On-Device
            </span>
          </div>

          {/* Central Interactive Clipplic Window Card */}
          <div className="w-full max-w-[560px] mt-7 animate-fade-up animation-delay-400">
            <div className="w-full rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.16),0_2px_4px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04] p-4 text-left transition-all hover:shadow-[0_28px_60px_-12px_rgba(0,0,0,0.20)]">
              {/* Window Chrome Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2.5">
                <div className="flex items-center gap-2">
                  {/* Traffic Light Dots with Realistic Depth */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-2xs inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-2xs inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-2xs inline-block" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 ml-1.5 select-none tracking-tight">
                    Clipplic history
                  </span>
                </div>

                {/* Keyboard Shortcut Keycaps Button */}
                <button
                  onClick={() => setIsHudOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100/80 active:scale-95 transition-all select-none cursor-pointer"
                  title="Click to summon search HUD or press ⌘+Shift+V"
                >
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs text-[10px] font-semibold">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs text-[10px] font-semibold">⇧</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs text-[10px] font-semibold">V</kbd>
                </button>
              </div>

              {/* Interactive Clips List */}
              <div className="space-y-1">
                {SAMPLE_CLIPS.map((clip) => {
                  const isSelected = activeClipId === clip.id;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => handleCopyCardItem(clip)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'bg-[#EBF5FF] text-slate-900 ring-1 ring-blue-500/20 shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-3">
                        {isSelected ? (
                          <span className="w-2 h-2 rounded-full bg-[#007AFF] shrink-0 shadow-xs" />
                        ) : clip.type === 'link' ? (
                          <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-600" />
                        ) : clip.type === 'code' ? (
                          <Code2 className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-600" />
                        ) : clip.type === 'color' ? (
                          <span
                            className="w-3.5 h-3.5 rounded-md border border-black/10 shrink-0 shadow-2xs"
                            style={{ backgroundColor: clip.colorHex }}
                          />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-600" />
                        )}

                        <span
                          className={`text-xs truncate font-mono ${
                            clip.type === 'code' || clip.type === 'color' ? 'font-mono' : 'font-sans'
                          } ${isSelected ? 'font-medium text-slate-950' : 'text-slate-700'}`}
                        >
                          {clip.content}
                        </span>

                        {clip.badge && (
                          <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-mono shrink-0">
                            {clip.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-600">
                          {clip.timeAgo}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Toast if item clicked */}
              {copiedItem && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-xl py-1.5 px-3 mt-2 animate-in fade-in duration-150">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied to clipboard! Press ⌘V to paste.</span>
                </div>
              )}
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
            <a
              href="https://github.com/xzedm/clipplic/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-[0_4px_16px_rgba(0,113,227,0.3)] active:scale-[0.98] transition-all"
            >
              <AppleIcon className="w-4 h-4" />
              <span>Download for macOS</span>
            </a>

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
