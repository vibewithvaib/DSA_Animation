import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import categories from '../state/categories';
// removed unused progress import

export default function Home() {
  const visible = useMemo(() => {
    return categories.map(cat => ({ ...cat, locked: false }));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Choose a category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map(cat => (
          <div key={cat.id} className={`rounded-lg border p-4 ${cat.locked? 'border-slate-800 bg-slate-900/60':'border-slate-700 bg-slate-900'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">{cat.name}</h2>
                <p className="text-sm text-slate-400">{cat.description}</p>
              </div>
              {cat.locked && <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">Locked</span>}
            </div>
            <div className="mt-4">
              <Link to={`/category/${cat.id}`} className="text-sm text-brand-300 hover:underline">View problems</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


