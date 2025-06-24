import React from 'react';
import styles from './start.module.css';

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
  onReset
}) => {
  const showReset =
    mode === 'timer'
      ? isRunning || seconds !== initialSeconds
      : isRunning || seconds > 0;

  return (
    <div>
      {isRunning ? (
        <button className={styles.button} onClick={onPause}>
          {'❚❚'}
        </button>
      ) : (
        <button className={styles.button} onClick={onStart}>
          {'▶'}
        </button>
      )}
      {showReset && (
        <button className={styles.button} onClick={onReset}>
          {'↻'}
        </button>
      )}
    </div>
  );
};

export default StartPause;
