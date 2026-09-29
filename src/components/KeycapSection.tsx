import React, { useEffect, useRef, useState } from 'react';
import { useShortcutKeys } from '../hooks/useShortcutKeys';

const STEPS = [
  { verb: 'Summon', body: 'Press ⌘⇧V over any app. Your history floats up right where you are working.' },
  { verb: 'Find', body: 'Start typing. Links, screenshots, code and files narrow down with every letter.' },
  { verb: 'Paste', body: 'Hit Enter. The clip lands back under your cursor, and the panel gets out of the way.' }
];

const Keycap: React.FC<{ glyph: string; label: string; pressed: boolean; wide?: boolean }> = ({
  glyph,
  label,
  pressed,
  wide = false
}) => (
  <span
    className={`keycap ${pressed ? 'is-pressed' : ''} ${wide ? 'keycap--wide' : ''}`}
    aria-hidden="true"
  >
    <span className="keycap-glyph">{glyph}</span>
    {label && <span className="keycap-label">{label}</span>}
  </span>
);

export const KeycapSection: React.FC<{ onTry: () => void }> = ({ onTry }) => {
  const held = useShortcutKeys();
  const [demo, setDemo] = useState(0);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const isUserPressing = held.cmd || held.shift || held.v;

  // Idle demo: press ⌘, then ⇧, then V, release — only while the deck is on screen
  useEffect(() => {
    const node = deckRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timers: number[] = [];
    let loop: number | undefined;
    const run = () => {
      timers = [300, 650, 1000, 1700].map((t, i) => window.setTimeout(() => setDemo(i < 3 ? i + 1 : 0), t));
    };
    const stop = () => {
      timers.forEach(clearTimeout);
      window.clearInterval(loop);
      setDemo(0);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        stop();
        if (entry.isIntersecting) {
          run();
          loop = window.setInterval(run, 3600);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  const pressed = isUserPressing ? held : { cmd: demo >= 1, shift: demo >= 2, v: demo >= 3 };

  return (
    <div className="grid md:grid-cols-12 gap-12 md:gap-8 items-center">
      <div className="md:col-span-7 flex flex-col items-center md:items-start">
        <div ref={deckRef} className="key-deck">
          <Keycap glyph="⌘" label="command" pressed={pressed.cmd} wide />
          <Keycap glyph="⇧" label="shift" pressed={pressed.shift} wide />
          <Keycap glyph="V" label="" pressed={pressed.v} />
        </div>
        <button
          type="button"
          onClick={onTry}
          className="mt-8 text-[13px] text-slate-600 hover:text-slate-950 underline decoration-slate-300 hover:decoration-slate-500 underline-offset-4 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded"
        >
          Press them for real, or click to open the panel
        </button>
      </div>

      <ol className="md:col-span-5 flex flex-col">
        {STEPS.map((step, i) => (
          <li key={step.verb} className="grid grid-cols-[3rem_1fr] gap-x-2 py-5 border-t border-slate-900/10 last:border-b">
            <span className="font-mono text-[11px] text-slate-400 pt-2 tabular-nums">0{i + 1}</span>
            <div>
              <h3 className="font-display text-3xl uppercase tracking-wide text-slate-950 leading-none">
                {step.verb}
              </h3>
              <p className="mt-2 text-[15px] text-slate-600 leading-relaxed max-w-[34ch] text-pretty">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
