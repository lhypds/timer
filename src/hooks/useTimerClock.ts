import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SetStateAction
} from 'react';
import { sampleClock, type ClockAnchor } from '../utils/timerClock';
import { TIMER_INTERVAL_MS, MAX_TIMER_SECONDS } from '../constants/timer';

// Anchor to wall time so a suspended WebView catches up when it resumes.
export function useTimerClock(
  mode: ClockAnchor['mode'],
  initialSeconds: () => number
) {
  const [seconds, updateSeconds] = useState(initialSeconds);
  const [isRunning, updateRunning] = useState(false);
  const anchor = useRef<ClockAnchor>({
    seconds,
    running: false,
    mode,
    sampledAt: Date.now()
  });
  const readTime = useCallback(
    () => sampleClock(anchor.current, Date.now()),
    []
  );

  const setSeconds = useCallback((value: SetStateAction<number>) => {
    const current = sampleClock(anchor.current, Date.now());
    const next = typeof value === 'function' ? value(current.seconds) : value;
    const clamped = Number.isFinite(next)
      ? Math.min(MAX_TIMER_SECONDS, Math.max(0, next))
      : 0;
    anchor.current = { ...current, seconds: clamped };
    updateSeconds(clamped);
  }, []);

  const setIsRunning = useCallback((running: boolean) => {
    const current = sampleClock(anchor.current, Date.now());
    anchor.current = { ...current, running };
    updateSeconds(current.seconds);
    updateRunning(running);
  }, []);

  useLayoutEffect(() => {
    anchor.current = { ...sampleClock(anchor.current, Date.now()), mode };
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      const current = readTime();
      updateSeconds(current.seconds);
      if (current.mode === 'stopwatch' && current.seconds >= MAX_TIMER_SECONDS)
        setIsRunning(false);
    };
    const interval = window.setInterval(tick, TIMER_INTERVAL_MS);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pageshow', tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('pageshow', tick);
    };
  }, [isRunning, readTime, setIsRunning]);

  return { seconds, setSeconds, isRunning, setIsRunning, readTime };
}
