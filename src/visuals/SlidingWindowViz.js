import React from 'react';

export default function SlidingWindowViz({ step }) {
  const { s = '', l = 0, r = -1, best = 0 } = step || {};
  const chars = s.split('');
  return (
    <div className="w-full">
      <div className="flex gap-1">
        {chars.map((ch, idx) => {
          const inWindow = idx >= l && idx <= r;
          const color = inWindow ? 'bg-emerald-600/30 border-emerald-500' : 'bg-slate-800 border-slate-700';
          return (
            <div key={idx} className={`px-2 py-3 rounded border ${color}`}>
              <span className="text-slate-100">{ch}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-slate-400">l={l}, r={r}, best={best}</div>
    </div>
  );
}


