import React from 'react';

export default function BubbleSortViz({ step }) {
  const { array = [], compare = [], swapped = false } = step || {};

  const max = Math.max(...array, 1);

  return (
    <div className="w-full">
      <div className="flex items-end gap-1 h-56 w-full">
        {array.map((v, i) => {
          const isCompare = compare.includes(i);
          const height = Math.max(8, Math.round((v / max) * 200));
          const base = 'flex-1 rounded-t';
          const color = swapped && isCompare ? 'bg-rose-500' : isCompare ? 'bg-amber-500' : 'bg-brand-500';
          return <div key={i} className={`${base} ${color}`} style={{ height }} title={String(v)} />
        })}
      </div>
      <div className="mt-3 text-xs text-slate-400">
        {swapped ? 'Swapped' : 'Comparing'} {compare.join(' & ')}
      </div>
    </div>
  );
}


