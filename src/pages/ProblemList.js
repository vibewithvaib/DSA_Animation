import React from 'react';
import { Link, useParams } from 'react-router-dom';
import problems from '../state/problems.json';
import categories from '../state/categories';

export default function ProblemList() {
  const { categoryId } = useParams();
  const list = problems.filter(p => p.categoryId === categoryId);
  const category = categories.find(c => c.id === categoryId);

  return (
    <div>
      <h1 className="text-2xl font-semibold">{category?.name || 'Category'}</h1>
      <p className="text-slate-400 mb-4">{category?.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map(p => (
          <Link key={p.id} to={`/solve/${p.id}`} className="block rounded border border-slate-800 bg-slate-900 p-4 hover:border-brand-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{p.title}</h2>
              <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">{p.difficulty}</span>
            </div>
            <p className="text-sm text-slate-400 mt-2 line-clamp-3">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


