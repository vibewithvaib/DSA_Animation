import React from 'react';

export default function TwoSumViz({ step }) {
  const { nums = [], i = -1, checking = null, mapKeys = [] } = step || {};
  const max = Math.max(...nums, 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-1 h-40 w-full">
        {nums.map((v, idx) => {
          const height = Math.max(8, Math.round((v / max) * 120));
          const color = idx === i ? 'bg-amber-500' : 'bg-brand-500';
          return <div key={idx} className={`flex-1 rounded-t ${color}`} style={{ height }} title={`nums[${idx}]=${v}`} />
        })}
      </div>
      <div className="mt-2 text-xs text-slate-400">checking need={String(checking)}</div>
      <div className="mt-2 text-xs text-slate-300">map keys: {mapKeys.join(', ')}</div>
    </div>
  );
}


