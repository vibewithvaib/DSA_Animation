import React from 'react';
import BubbleSortViz from '../visuals/BubbleSortViz';
import DFSViz from '../visuals/DFSViz';
import InsertionSortViz from '../visuals/InsertionSortViz';
import SelectionSortViz from '../visuals/SelectionSortViz';
import BFSViz from '../visuals/BFSViz';
import TwoSumViz from '../visuals/TwoSumViz';
import SlidingWindowViz from '../visuals/SlidingWindowViz';
import DPFibViz from '../visuals/DPFibViz';
import HanoiViz from '../visuals/HanoiViz';

export default function SimulationPanel({ controller }) {
  const { state, play, pause, next, prev, reset, playing, speedMs, setSpeedMs } = controller;
  const current = state.current || {};

  let content = null;
  if (current?.type === 'bubble') content = <BubbleSortViz step={current} />;
  if (current?.type === 'insertion') content = <InsertionSortViz step={current} />;
  if (current?.type === 'selection') content = <SelectionSortViz step={current} />;
  if (current?.type === 'dfs') content = <DFSViz step={current} />;
  if (current?.type === 'bfs') content = <BFSViz step={current} />;
  if (current?.type === 'two_sum') content = <TwoSumViz step={current} />;
  if (current?.type === 'sliding_window') content = <SlidingWindowViz step={current} />;
  if (current?.type === 'dp_fib') content = <DPFibViz step={current} />;
  if (current?.type === 'hanoi') content = <HanoiViz step={current} />;

  return (
    <div className="rounded border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-400">Step {state.index + 1} / {Math.max(state.total, 1)}</div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="px-2 py-1 text-xs rounded bg-slate-800">Prev</button>
          {playing ? (
            <button onClick={pause} className="px-2 py-1 text-xs rounded bg-slate-800">Pause</button>
          ) : (
            <button onClick={play} className="px-2 py-1 text-xs rounded bg-slate-800">Play</button>
          )}
          <button onClick={next} className="px-2 py-1 text-xs rounded bg-slate-800">Next</button>
          <button onClick={reset} className="px-2 py-1 text-xs rounded bg-slate-800">Reset</button>
          <div className="flex items-center gap-1 ml-2 text-xs text-slate-400">
            <span>Speed</span>
            <select value={speedMs} onChange={e=>setSpeedMs(Number(e.target.value))} className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5">
              <option value={1200}>Slow</option>
              <option value={900}>Default</option>
              <option value={600}>Fast</option>
              <option value={350}>Very Fast</option>
            </select>
          </div>
        </div>
      </div>
      <div className="min-h-[260px] relative flex items-center justify-center">
        {content || <div className="text-slate-500 text-sm">Run your code to see the simulation.</div>}
        {current?.watch && (
          <div className="absolute top-2 right-2 rounded border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-slate-200 max-w-[50%]">
            <div className="font-semibold mb-1">Variables</div>
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(current.watch, null, 2)}</pre>
          </div>
        )}
        {current?.error && (
          <div className="absolute inset-0 bg-rose-900/10 border-2 border-rose-600 rounded flex items-center justify-center">
            <div className="text-rose-300 text-sm">{current.explain || 'Error detected'}</div>
          </div>
        )}
      </div>
      {current?.explain && (
        <div className="mt-3 text-sm text-slate-300 border-t border-slate-800 pt-2">
          {current.explain}
        </div>
      )}
    </div>
  );
}


