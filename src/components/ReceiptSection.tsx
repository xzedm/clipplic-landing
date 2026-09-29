import React from 'react';

const LINES: [string, string][] = [
  ['Clipboard history', '$0.00'],
  ['Search, pins & Quick Look', '$0.00'],
  ['Source code, MIT license', '$0.00'],
  ['Clips sent to a server', '0 B']
];

// Fixed bar pattern so the barcode renders identically every time
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1];

export const Receipt: React.FC = () => (
  <div className="receipt-wrap">
    <div className="receipt font-mono text-[12px] text-slate-800 px-7 pt-9 pb-10">
      <p className="text-center font-display text-2xl tracking-[0.18em] text-slate-950">CLIPPLIC</p>
      <p className="text-center text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em]">for macOS Sonoma &amp; Sequoia</p>

      <div className="receipt-rule my-5" />

      <ul className="space-y-2.5">
        {LINES.map(([item, price]) => (
          <li key={item} className="flex items-baseline gap-2">
            <span className="shrink-0">{item}</span>
            <span className="receipt-leader flex-1" aria-hidden="true" />
            <span className="shrink-0 tabular-nums">{price}</span>
          </li>
        ))}
      </ul>

      <div className="receipt-rule my-5" />

      <div className="flex items-baseline justify-between text-slate-950">
        <span className="uppercase tracking-[0.2em] text-[11px]">Total</span>
        <span className="font-display text-3xl tracking-wide tabular-nums">$0.00</span>
      </div>
      <p className="mt-1 text-[10px] text-slate-500 text-right">Every clip stays on this Mac</p>

      <div className="mt-7 flex items-end justify-center gap-[2px] h-10" aria-hidden="true">
        {BARS.map((w, i) => (
          <span key={i} className="h-full bg-slate-900" style={{ width: w * 1.5 }} />
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-slate-500">Thank you for copying</p>
    </div>
  </div>
);
