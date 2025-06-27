import React from 'react';
import styles from './start.module.css';
import Button from '../ui/Button/Button';
import { Mode } from '../ModeSwitch/ModeSwitch';
import playIcon from '../../assets/play.png';
import pauseIcon from '../../assets/pause.png';
import resetIcon from '../../assets/reset.png';

interface StartPauseProps {
  isRunning: boolean;
  mode: Mode;
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
    <div className={styles.container}>
      {isRunning ? (
        <Button onClick={onPause}>
          <img src={pauseIcon} alt="Pause" className={styles.icon} />
        </Button>
      ) : (
        <Button onClick={onStart}>
          <img src={playIcon} alt="Play" className={styles.icon} />
        </Button>
      )}
      {showReset && (
        <Button onClick={onReset}>
          <img src={resetIcon} alt="Reset" className={styles.icon} />
        </Button>
      )}
    </div>
  );
};

export default StartPause;
