import React, { useId } from 'react';

export type SourceApp = 'safari' | 'xcode' | 'figma' | 'terminal' | 'finder' | 'cleanshot';

// macOS continuous-corner squircle on a 24×24 grid
const SQUIRCLE =
  'M12 1.2c4.9 0 7.4.2 8.9 1.9 1.7 1.5 1.9 4 1.9 8.9s-.2 7.4-1.9 8.9c-1.5 1.7-4 1.9-8.9 1.9s-7.4-.2-8.9-1.9C1.4 19.4 1.2 16.9 1.2 12s.2-7.4 1.9-8.9C4.6 1.4 7.1 1.2 12 1.2Z';

const Safari: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#E3E7EC" />
      </linearGradient>
      <linearGradient id={`${id}-dial`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1ED0FB" />
        <stop offset="1" stopColor="#1A6FE8" />
      </linearGradient>
    </defs>
    <path d={SQUIRCLE} fill={`url(#${id}-bg)`} />
    <circle cx="12" cy="12" r="8.4" fill={`url(#${id}-dial)`} />
    <g stroke="#fff" strokeOpacity=".75" strokeWidth=".45" strokeLinecap="round">
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1="12" y1="4.3" x2="12" y2={i % 6 === 0 ? '5.9' : '5.1'} transform={`rotate(${i * 15} 12 12)`} />
      ))}
    </g>
    <g transform="rotate(45 12 12)">
      <path d="M12 5.8 13.3 12h-2.6Z" fill="#FF3B30" />
      <path d="M12 18.2 10.7 12h2.6Z" fill="#fff" />
    </g>
  </>
);

const Xcode: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2FA2FF" />
        <stop offset="1" stopColor="#0C5CD6" />
      </linearGradient>
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F4F6F9" />
        <stop offset="1" stopColor="#9AA6B6" />
      </linearGradient>
    </defs>
    <path d={SQUIRCLE} fill={`url(#${id}-bg)`} />
    <g stroke="#fff" strokeOpacity=".16" strokeWidth=".4">
      <path d="M6 1.5v21M12 1.5v21M18 1.5v21M1.5 6h21M1.5 12h21M1.5 18h21" />
    </g>
    <g transform="rotate(-38 12 12)">
      <rect x="11.1" y="8.6" width="1.8" height="11" rx=".9" fill="#E9A85C" />
      <rect x="11.1" y="8.6" width="1.8" height="11" rx=".9" fill="#000" fillOpacity=".12" />
      <path d="M7.2 5.6h8.1c.8 0 1.6.4 2 1.1l.5.8h-2.3l-.3 1.9H8.4L7.8 7.2Z" fill={`url(#${id}-steel)`} />
    </g>
  </>
);

const Figma: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2C2C2C" />
        <stop offset="1" stopColor="#141414" />
      </linearGradient>
    </defs>
    <path d={SQUIRCLE} fill={`url(#${id}-bg)`} />
    <path d="M12 5.6H9.9a2.1 2.1 0 0 0 0 4.2H12Z" fill="#F24E1E" />
    <path d="M12 5.6h2.1a2.1 2.1 0 0 1 0 4.2H12Z" fill="#FF7262" />
    <path d="M12 9.8H9.9a2.1 2.1 0 0 0 0 4.2H12Z" fill="#A259FF" />
    <circle cx="14.1" cy="11.9" r="2.1" fill="#1ABCFE" />
    <path d="M12 14H9.9a2.1 2.1 0 1 0 2.1 2.1Z" fill="#0ACF83" />
  </>
);

const Terminal: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E8EAED" />
        <stop offset="1" stopColor="#B9BEC6" />
      </linearGradient>
    </defs>
    <path d={SQUIRCLE} fill={`url(#${id}-bg)`} />
    <rect x="3.6" y="4.4" width="16.8" height="15.2" rx="2.4" fill="#1C1C1E" />
    <path d="m6.6 9 2.6 2.1-2.6 2.1" fill="none" stroke="#F2F2F7" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6 13.6h3.6" stroke="#F2F2F7" strokeWidth="1.1" strokeLinecap="round" />
  </>
);

const Finder: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <clipPath id={`${id}-clip`}>
        <path d={SQUIRCLE} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id}-clip)`}>
      <rect width="24" height="24" fill="#1E7CF2" />
      {/* Light half, split along the profile line */}
      <path d="M0 0h13.2c-.9 2.4-1.6 5-1.8 7.6h1.3c-.2 2.7-.1 5.4.3 8-1.1.1-2.5.1-3.4-.1l-.2 1.4c1.2.3 2.6.3 3.9.2.3 2.4.8 4.8 1.5 6.9H0Z" fill="#8FD3FF" />
    </g>
    <path d="M7.2 8v2.3M16.3 8v2.3" stroke="#10213F" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M6.3 15.4c3.3 2 8 2 11.4 0" fill="none" stroke="#10213F" strokeWidth=".9" strokeLinecap="round" />
  </>
);

const CleanShot: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3B3F4A" />
        <stop offset="1" stopColor="#15171C" />
      </linearGradient>
    </defs>
    <path d={SQUIRCLE} fill={`url(#${id}-bg)`} />
    <path
      d="M6 9V7a1 1 0 0 1 1-1h2M15 6h2a1 1 0 0 1 1 1v2M18 15v2a1 1 0 0 1-1 1h-2M9 18H7a1 1 0 0 1-1-1v-2"
      fill="none"
      stroke="#fff"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2.2" fill="#5AC8FA" />
  </>
);

const ICONS: Record<SourceApp, React.FC<{ id: string }>> = {
  safari: Safari,
  xcode: Xcode,
  figma: Figma,
  terminal: Terminal,
  finder: Finder,
  cleanshot: CleanShot
};

export const AppIcon: React.FC<{ app: SourceApp; size?: number; className?: string }> = ({
  app,
  size = 16,
  className = ''
}) => {
  const id = useId().replace(/:/g, '');
  const Icon = ICONS[app] ?? CleanShot;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`shrink-0 drop-shadow-[0_0.5px_0.75px_rgba(15,23,42,0.28)] ${className}`}
    >
      <Icon id={id} />
    </svg>
  );
};
