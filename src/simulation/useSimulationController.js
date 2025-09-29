import { useCallback, useMemo, useRef, useState } from 'react';

export function useSimulationController(initialSpeedMs = 900) {
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(initialSpeedMs);
  const timer = useRef(null);

  const loadSteps = useCallback((newSteps) => {
    setSteps(Array.isArray(newSteps) ? newSteps : []);
    setIndex(0);
    setPlaying(false);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, Math.max(steps.length - 1, 0)));
  }, [steps.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIndex(0);
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (playing || steps.length === 0) return;
    setPlaying(true);
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          clearInterval(timer.current);
          timer.current = null;
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speedMs);
  }, [playing, steps.length, speedMs]);

  const pause = useCallback(() => {
    setPlaying(false);
    if (timer.current) clearInterval(timer.current);
  }, []);

  const state = useMemo(() => ({ current: steps[index] || null, index, total: steps.length }), [steps, index]);

  return { steps, state, loadSteps, next, prev, reset, play, pause, playing, speedMs, setSpeedMs };
}


