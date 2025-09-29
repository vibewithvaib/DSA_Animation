import React from 'react';

export default function BFSViz({ step }) {
  const { nodes = [], edges = [], active = null, visited = [], queue = [] } = step || {};
  return (
    <svg className="w-full h-64" viewBox="0 0 400 260">
      {edges.map(([u, v], idx) => {
        const a = nodes[u];
        const b = nodes[v];
        return (
          <line key={idx} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#475569" strokeWidth="2" />
        );
      })}
      {nodes.map((n, idx) => {
        const isVisited = visited.includes(idx);
        const isActive = active === idx;
        const inQueue = queue.includes(idx);
        const fill = isActive ? '#f59e0b' : isVisited ? '#22c55e' : inQueue ? '#38bdf8' : '#6366f1';
        return (
          <g key={idx}>
            <circle cx={n.x} cy={n.y} r="16" fill={fill} />
            <text x={n.x} y={n.y+4} fontSize="12" textAnchor="middle" fill="#0f172a">{idx}</text>
          </g>
        );
      })}
    </svg>
  );
}


