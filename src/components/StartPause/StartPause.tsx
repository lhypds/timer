import React from 'react';
import styles from './start.module.css';
import Button from '../ui/Button/Button';

interface StartPauseProps {
  isRunning: boolean;
  mode: 'timer' | 'stopwatch';
  seconds: number;
  initialSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
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
        <Button onClick={onPause}>
          <span className={styles.icon}>⏸</span>
        </Button>
      ) : (
        <Button onClick={onStart}>
          <span className={styles.icon}>▶</span>
        </Button>
      )}
      {showReset && (
        <Button onClick={onReset}>
          <span className={styles.icon}>↻</span>
        </Button>
      )}
    </div>
  );
};

export default StartPause;
