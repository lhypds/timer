export interface ClockAnchor {
  seconds: number;
  running: boolean;
  mode: 'timer' | 'stopwatch';
  sampledAt: number;
}

export function sampleClock(anchor: ClockAnchor, now: number): ClockAnchor {
  const elapsed = anchor.running
    ? Math.max(0, now - anchor.sampledAt) / 1000
    : 0;
  return {
    ...anchor,
    seconds: Math.min(
      359999,
      Math.max(
        0,
        anchor.seconds + (anchor.mode === 'timer' ? -elapsed : elapsed)
      )
    ),
    sampledAt: now
  };
}
