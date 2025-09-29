import React from 'react';

export default function HanoiViz({ step }) {
  const { pegs = [[],[],[]] } = step || {};
  // Draw three pegs and disks as rectangles
  return (
    <svg className="w-full h-64" viewBox="0 0 400 260">
      {[0,1,2].map((p) => (
        <rect key={p} x={60 + p*120} y={40} width="4" height="180" fill="#475569" />
      ))}
      {pegs.map((stack, pegIdx) => {
        return stack.map((disk, idx) => {
          const width = 20 + disk*20;
          const x = 60 + pegIdx*120 - width/2 + 2;
          const y = 210 - idx*18;
          return <rect key={`${pegIdx}-${idx}`} x={x} y={y} width={width} height="14" rx="3" fill="#6366f1" />
        });
      })}
    </svg>
  );
}


