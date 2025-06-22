import React from 'react';
import { Button } from '@linktivity/link-ui';

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
        <Button className={buttonClass} variant="outlined" onClick={onPause}>
          {'❚❚'}
        </Button>
      ) : (
        <Button className={buttonClass} variant="outlined" onClick={onStart}>
          {'▶'}
        </Button>
      )}
      {showReset && (
        <Button className={buttonClass} variant="outlined" onClick={onReset}>
          {'↻'}
        </Button>
      )}
    </div>
  );
};

export default StartPause;
