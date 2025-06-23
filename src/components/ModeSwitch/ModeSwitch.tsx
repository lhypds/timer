import React from 'react';

export const Mode = {
  Timer: 'timer',
  Stopwatch: 'stopwatch'
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];

interface ModeSwitchProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  buttonClass?: string;
  activeClass?: string;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({
  mode,
  onModeChange,
  buttonClass = '',
  activeClass = ''
}) => (
  <div>
    <button
      className={`${buttonClass} ${mode === Mode.Timer ? activeClass : ''}`.trim()}
      onClick={() => onModeChange(Mode.Timer)}
    >
      Timer
    </button>
    <button
      className={`${buttonClass} ${mode === Mode.Stopwatch ? activeClass : ''}`.trim()}
      onClick={() => onModeChange(Mode.Stopwatch)}
    >
      Stopwatch
    </button>
  </div>
);

export default ModeSwitch;
