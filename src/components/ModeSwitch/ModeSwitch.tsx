import React from 'react';
import styles from './mode.module.css';

export const Mode = {
  Timer: 'timer',
  Stopwatch: 'stopwatch'
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];

interface ModeSwitchProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onModeChange }) => (
  <div>
    <button
      className={`${styles.button} ${mode === Mode.Timer ? styles.active : ''}`.trim()}
      onClick={() => onModeChange(Mode.Timer)}
    >
      Timer
    </button>
    <button
      className={`${styles.button} ${mode === Mode.Stopwatch ? styles.active : ''}`.trim()}
      onClick={() => onModeChange(Mode.Stopwatch)}
    >
      Stopwatch
    </button>
  </div>
);

export default ModeSwitch;
