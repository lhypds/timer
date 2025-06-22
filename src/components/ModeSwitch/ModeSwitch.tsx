import React from 'react';
import { Button } from '@linktivity/link-ui';

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
    <Button
      className={`${buttonClass} ${mode === Mode.Timer ? activeClass : ''}`.trim()}
      variant="outlined"
      onClick={() => onModeChange(Mode.Timer)}
    >
      Timer
    </Button>
    <Button
      className={`${buttonClass} ${mode === Mode.Stopwatch ? activeClass : ''}`.trim()}
      variant="outlined"
      onClick={() => onModeChange(Mode.Stopwatch)}
    >
      Stopwatch
    </Button>
  </div>
);

export default ModeSwitch;
