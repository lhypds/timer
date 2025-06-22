import React from 'react';
import { Button } from '@linktivity/link-ui';

export type Mode = 'timer' | 'stopwatch';

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
      className={`${buttonClass} ${mode === 'timer' ? activeClass : ''}`.trim()}
      variant="outlined"
      onClick={() => onModeChange('timer')}
    >
      Timer
    </Button>
    <Button
      className={`${buttonClass} ${mode === 'stopwatch' ? activeClass : ''}`.trim()}
      variant="outlined"
      onClick={() => onModeChange('stopwatch')}
    >
      Stopwatch
    </Button>
  </div>
);

export default ModeSwitch;
