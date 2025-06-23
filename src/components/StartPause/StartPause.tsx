import React from 'react';

interface StartPauseProps {
  isRunning: boolean;
  mode: 'timer' | 'stopwatch';
  seconds: number;
  initialSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  buttonClass?: string;
}

const StartPause: React.FC<StartPauseProps> = ({
  isRunning,
  mode,
  seconds,
  initialSeconds,
  onStart,
  onPause,
  onReset,
  buttonClass = ''
}) => {
  const showReset =
    mode === 'timer'
      ? isRunning || seconds !== initialSeconds
      : isRunning || seconds > 0;

  return (
    <div>
      {isRunning ? (
        <button className={buttonClass} onClick={onPause}>
          {'❚❚'}
        </button>
      ) : (
        <button className={buttonClass} onClick={onStart}>
          {'▶'}
        </button>
      )}
      {showReset && (
        <button className={buttonClass} onClick={onReset}>
          {'↻'}
        </button>
      )}
    </div>
  );
};

export default StartPause;
