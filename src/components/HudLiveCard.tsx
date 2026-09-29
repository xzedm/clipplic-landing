import { forwardRef } from 'react';
import { useShortcutKeys } from '../hooks/useShortcutKeys';

export interface HudLiveCardProps {
  onClick: () => void;
  className?: string;
}

// Miniature of the keycaps in the shortcut section, so the hero previews that language
const MiniKey = ({ glyph, pressed }: { glyph: string; pressed: boolean }) => (
  <kbd className={`minikey ${pressed ? 'is-pressed' : ''}`}>{glyph}</kbd>
);

export const HudLiveCard = forwardRef<HTMLButtonElement, HudLiveCardProps>(
  ({ onClick, className = '' }, ref) => {
    const keys = useShortcutKeys();

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label="Try the floating panel on this page, shortcut Command Shift V"
        className={`hud-try group inline-flex items-center gap-3 px-2 py-1.5 rounded-xl cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0071E3] ${className}`}
      >
        <span className="flex items-center gap-1" aria-hidden="true">
          <MiniKey glyph="⌘" pressed={keys.cmd} />
          <MiniKey glyph="⇧" pressed={keys.shift} />
          <MiniKey glyph="V" pressed={keys.v} />
        </span>
        <span className="text-[13px] font-medium text-slate-900 underline decoration-slate-900/25 decoration-1 underline-offset-[5px] group-hover:decoration-slate-900/70 transition-[text-decoration-color] duration-200">
          Try it on this page
        </span>
      </button>
    );
  }
);

HudLiveCard.displayName = 'HudLiveCard';
