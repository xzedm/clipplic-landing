import { useState, useEffect, forwardRef } from 'react';

export interface HudLiveCardProps {
  onClick: () => void;
  className?: string;
}

export const HudLiveCard = forwardRef<HTMLButtonElement, HudLiveCardProps>(
  ({ onClick, className = '' }, ref) => {
    const [isCmdPressed, setIsCmdPressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [isVPressed, setIsVPressed] = useState(false);

    // Interactive physical keyboard tracking
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey) setIsCmdPressed(true);
        if (e.shiftKey) setIsShiftPressed(true);
        if (e.key.toLowerCase() === 'v') setIsVPressed(true);
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (!e.metaKey && !e.ctrlKey) setIsCmdPressed(false);
        if (!e.shiftKey) setIsShiftPressed(false);
        if (e.key.toLowerCase() === 'v') setIsVPressed(false);
      };

      const handleBlur = () => {
        setIsCmdPressed(false);
        setIsShiftPressed(false);
        setIsVPressed(false);
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('blur', handleBlur);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('blur', handleBlur);
      };
    }, []);

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label="Try the Floating HUD live, keyboard shortcut Command Shift V"
        className={`group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/50 hover:bg-slate-900/75 active:scale-[0.98] backdrop-blur-md border border-white/15 hover:border-white/30 text-slate-200 hover:text-white transition-all duration-150 cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] ${className}`}
      >
        {/* Subtle Spotlight search glyph */}
        <svg
          className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <span className="text-xs font-medium tracking-tight">Try Floating HUD</span>

        <span className="w-px h-3 bg-white/15" aria-hidden="true" />

        {/* Clean native Apple-style keycaps */}
        <div className="flex items-center gap-1 font-mono text-[10px]" aria-hidden="true">
          <kbd
            className={`min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded transition-colors duration-100 ${
              isCmdPressed
                ? 'bg-[#0071E3] text-white'
                : 'bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white'
            }`}
          >
            ⌘
          </kbd>
          <kbd
            className={`min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded transition-colors duration-100 ${
              isShiftPressed
                ? 'bg-[#0071E3] text-white'
                : 'bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white'
            }`}
          >
            ⇧
          </kbd>
          <kbd
            className={`min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded transition-colors duration-100 ${
              isVPressed
                ? 'bg-[#0071E3] text-white'
                : 'bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white'
            }`}
          >
            V
          </kbd>
        </div>
      </button>
    );
  }
);

HudLiveCard.displayName = 'HudLiveCard';
