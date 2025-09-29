import React from 'react';

export default function SelectionSortViz({ step }) {
  const { array = [], i = 0, minIndex = -1, scanning = -1 } = step || {};
  const max = Math.max(...array, 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-1 h-56 w-full">
        {array.map((v, idx) => {
          const height = Math.max(8, Math.round((v / max) * 200));
          const isSorted = idx < i;
          const isMin = idx === minIndex;
          const isScan = idx === scanning;
          const color = isMin ? 'bg-amber-500' : isScan ? 'bg-rose-500' : isSorted ? 'bg-emerald-500' : 'bg-brand-500';
          return <div key={idx} className={`flex-1 rounded-t ${color}`} style={{ height }} title={String(v)} />
        })}
      </div>
      <div className="mt-3 text-xs text-slate-400">i={i}, min={minIndex}, scanning={scanning}</div>
    </div>
  );
}


