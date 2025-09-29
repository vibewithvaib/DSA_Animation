import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import Home from './pages/Home';
import ProblemList from './pages/ProblemList';
import Solve from './pages/Solve';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-full">
      <nav className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="text-lg font-semibold text-brand-300">DSA Sim</NavLink>
          <div className="flex items-center gap-4 text-sm">
            <NavLink to="/" className={({isActive})=>`hover:text-brand-300 ${isActive? 'text-brand-300':'text-slate-300'}`}>Home</NavLink>
            <NavLink to="/dashboard" className={({isActive})=>`hover:text-brand-300 ${isActive? 'text-brand-300':'text-slate-300'}`}>Dashboard</NavLink>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<ProblemList />} />
          <Route path="/solve/:problemId" element={<Solve />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
