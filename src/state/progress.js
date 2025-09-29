import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import categories from './categories';

const STORAGE_KEY = 'dsa-sim-progress-v1';

const ProgressContext = createContext(null);

function loadDefault() {
  const initialUnlocked = categories.map(c => c.id);
  return {
    solvedProblemIds: [],
    unlockedCategoryIds: initialUnlocked,
    streak: 0,
    lastSolveDate: null,
    level: 1
  };
}

function computeLevel(solvedCount) {
  if (solvedCount >= 20) return 6;
  if (solvedCount >= 12) return 5;
  if (solvedCount >= 8) return 4;
  if (solvedCount >= 5) return 3;
  if (solvedCount >= 2) return 2;
  return 1;
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : loadDefault();
    } catch {
      return loadDefault();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({
    ...state,
    markSolved: (problemId, categoryId) => {
      setState(prev => {
        if (prev.solvedProblemIds.includes(problemId)) return prev;
        const solvedProblemIds = [...prev.solvedProblemIds, problemId];

        let streak = prev.streak;
        const today = new Date().toDateString();
        if (prev.lastSolveDate !== today) streak = prev.streak + 1;

        // All categories unlocked at all times
        const unlockedCategoryIds = categories.map(c => c.id);

        const level = computeLevel(solvedProblemIds.length);

        return { ...prev, solvedProblemIds, streak, lastSolveDate: today, unlockedCategoryIds, level };
      });
    }
  }), [state]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}


