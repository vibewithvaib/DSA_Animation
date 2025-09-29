import React from 'react';

export default function DPFibViz({ step }) {
  const { dp = [], highlight = -1 } = step || {};
  return (
    <div className="w-full">
      <div className="grid grid-cols-8 gap-1">
        {dp.map((v, idx) => (
          <div key={idx} className={`rounded border p-2 text-center ${idx===highlight? 'border-amber-500 bg-amber-500/20':'border-slate-700 bg-slate-800'}`}>
            <div className="text-[10px] text-slate-400">{idx}</div>
            <div className="text-sm">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-400">highlight i={highlight}</div>
    </div>
  );
}


