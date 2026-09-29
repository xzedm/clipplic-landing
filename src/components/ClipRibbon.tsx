import React from 'react';
import { AppIcon, type SourceApp } from './AppIcons';

type Clip =
  | { kind: 'text'; app: SourceApp; time: string; text: string }
  | { kind: 'link'; app: SourceApp; time: string; host: string; path: string }
  | { kind: 'color'; app: SourceApp; time: string; hex: string; label: string }
  | { kind: 'code'; app: SourceApp; time: string; code: string }
  | { kind: 'image'; app: SourceApp; time: string; name: string }
  | { kind: 'file'; app: SourceApp; time: string; name: string; size: string };

const APP_NAMES: Record<SourceApp, string> = {
  safari: 'Safari',
  xcode: 'Xcode',
  figma: 'Figma',
  terminal: 'Terminal',
  finder: 'Finder',
  cleanshot: 'CleanShot X'
};

const TOP_ROW: Clip[] = [
  { kind: 'link', app: 'safari', time: '9:04', host: 'github.com', path: '/xzedm/clipplic' },
  { kind: 'color', app: 'figma', time: '9:17', hex: '#0071E3', label: 'Accent / Primary' },
  { kind: 'code', app: 'xcode', time: '9:42', code: 'NSPasteboard.general.clearContents()' },
  { kind: 'text', app: 'safari', time: '10:08', text: 'Flight QR7 lands 18:25, gate B14' },
  { kind: 'image', app: 'cleanshot', time: '10:41', name: 'Screenshot 10.41.07' },
  { kind: 'file', app: 'finder', time: '11:02', name: 'Invoice-0917.pdf', size: '184 KB' },
  { kind: 'code', app: 'terminal', time: '11:36', code: 'git push origin main' }
];

const BOTTOM_ROW: Clip[] = [
  { kind: 'text', app: 'figma', time: '12:10', text: 'Radius 18 · continuous corners' },
  { kind: 'code', app: 'terminal', time: '12:44', code: 'npm run build && npm run preview' },
  { kind: 'color', app: 'figma', time: '13:05', hex: '#F2C9B3', label: 'Cloud / Warm' },
  { kind: 'link', app: 'safari', time: '13:31', host: 'developer.apple.com', path: '/documentation/appkit' },
  { kind: 'file', app: 'finder', time: '14:12', name: 'meadow-hero.mov', size: '38.2 MB' },
  { kind: 'image', app: 'cleanshot', time: '14:48', name: 'Screenshot 14.48.52' },
  { kind: 'text', app: 'xcode', time: '15:20', text: 'TODO: debounce search by 80 ms' }
];

const ClipBody: React.FC<{ clip: Clip }> = ({ clip }) => {
  switch (clip.kind) {
    case 'text':
      return <p className="text-[13px] leading-snug text-slate-800 line-clamp-2">{clip.text}</p>;
    case 'link':
      return (
        <p className="text-[13px] leading-snug truncate">
          <span className="text-slate-900 font-medium">{clip.host}</span>
          <span className="text-slate-400">{clip.path}</span>
        </p>
      );
    case 'color':
      return (
        <div className="flex items-center gap-2.5">
          <span
            className="w-7 h-7 rounded-lg ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: clip.hex }}
          />
          <div className="leading-tight">
            <p className="text-[13px] font-mono text-slate-900">{clip.hex}</p>
            <p className="text-[11px] text-slate-500">{clip.label}</p>
          </div>
        </div>
      );
    case 'code':
      return (
        <p className="text-[12px] font-mono leading-snug text-slate-800 truncate rounded-md bg-slate-900/[0.04] px-2 py-1.5">
          {clip.code}
        </p>
      );
    case 'image':
      return (
        <div className="flex items-center gap-2.5">
          <span className="w-12 h-8 rounded-md overflow-hidden ring-1 ring-black/10 bg-sky-200">
            <img src="/bg-clipplic-poster.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
          </span>
          <p className="text-[12px] text-slate-700 truncate">{clip.name}</p>
        </div>
      );
    case 'file':
      return (
        <div className="leading-tight">
          <p className="text-[13px] text-slate-900 truncate">{clip.name}</p>
          <p className="text-[11px] font-mono text-slate-500">{clip.size}</p>
        </div>
      );
  }
};

const ClipCard: React.FC<{ clip: Clip }> = ({ clip }) => (
  <li className="clip-card w-[232px] shrink-0 rounded-2xl p-3.5 flex flex-col gap-2.5">
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <AppIcon app={clip.app} size={16} />
        <span>{APP_NAMES[clip.app]}</span>
      </span>
      <span className="text-[10px] font-mono tabular-nums text-slate-400">{clip.time}</span>
    </div>
    <ClipBody clip={clip} />
  </li>
);

const Row: React.FC<{ clips: Clip[]; reverse?: boolean }> = ({ clips, reverse = false }) => (
  <div className="overflow-hidden">
    <ul className={`ribbon-track flex gap-3 w-max ${reverse ? 'ribbon-track--reverse' : ''}`}>
      {/* Doubled so the loop seams invisibly at -50% */}
      {[...clips, ...clips].map((clip, i) => (
        <ClipCard key={i} clip={clip} />
      ))}
    </ul>
  </div>
);

export const ClipRibbon: React.FC = () => (
  <div
    className="ribbon relative py-8"
    role="img"
    aria-label="Examples of things Clipplic keeps: links, colors, code, screenshots, and files"
  >
    <div className="ribbon-tilt flex flex-col gap-3" aria-hidden="true">
      <Row clips={TOP_ROW} />
      <Row clips={BOTTOM_ROW} reverse />
    </div>
  </div>
);
