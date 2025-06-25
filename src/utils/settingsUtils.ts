import { Mode } from '../components/ModeSwitch/ModeSwitch';

const SECONDS_INIT = 300;
const MODE_INIT = Mode.Timer;

export const getSetting = (key: string) => {
  if (key === 'timer') {
    const time = localStorage.getItem('timer');
    return time ? parseInt(time, 10) : SECONDS_INIT;
  }

  if (key === 'stopwatch') {
    const time = localStorage.getItem('stopwatch');
    return time ? parseInt(time, 10) : 0;
  }

  if (key === 'mode') {
    const mode = localStorage.getItem('mode');
    return mode ? (mode as Mode) : MODE_INIT;
  }
};
