import React from 'react';
import { useProgress } from '../state/progress';
import categories from '../state/categories';

export default function Dashboard() {
  const { solvedProblemIds, unlockedCategoryIds, streak, level } = useProgress();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Your Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <div className="text-slate-400 text-sm">Solved Problems</div>
          <div className="text-3xl font-bold">{solvedProblemIds.length}</div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <div className="text-slate-400 text-sm">Unlocked Categories</div>
          <div className="text-3xl font-bold">{unlockedCategoryIds.length}</div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <div className="text-slate-400 text-sm">Streak</div>
          <div className="text-3xl font-bold">{streak} days</div>
        </div>
      </div>

      <div className="rounded border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-lg font-medium mb-2">Badges</h2>
        <div className="flex flex-wrap gap-2">
          {level >= 1 && <span className="text-xs px-2 py-1 rounded bg-amber-600/20 text-amber-300 border border-amber-700">Rookie</span>}
          {level >= 3 && <span className="text-xs px-2 py-1 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-700">Solver</span>}
          {level >= 5 && <span className="text-xs px-2 py-1 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-700">Strategist</span>}
        </div>
      </div>

      <div className="rounded border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-lg font-medium mb-2">Unlocked Categories</h2>
        <div className="flex gap-2 flex-wrap">
          {unlockedCategoryIds.map(id => {
            const c = categories.find(x => x.id === id);
            return <span key={id} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">{c?.name || id}</span>
          })}
        </div>
      </div>
    </div>
  );
}


