import { Mode } from '../components/ModeSwitch/ModeSwitch';

const SECONDS_INIT = 300;
const MODE_INIT = Mode.Timer;

export const getSetting = (key: string) => {
  if (key === 'timer') {
    const time = sessionStorage.getItem('timer');
    return time ? parseInt(time, 10) : SECONDS_INIT;
  }

  if (key === 'stopwatch') {
    const time = sessionStorage.getItem('stopwatch');
    return time ? parseInt(time, 10) : 0;
  }

  if (key === 'mode') {
    const mode = sessionStorage.getItem('mode');
    return mode ? (mode as Mode) : MODE_INIT;
  }
};

export const setSetting = (key: string, value: string | number) => {
  if (key === 'timer' || key === 'stopwatch') {
    sessionStorage.setItem(key, value.toString());
  } else if (key === 'mode') {
    if (Object.values(Mode).includes(value as Mode)) {
      sessionStorage.setItem(key, value as Mode);
    } else {
      console.warn(`Invalid mode: ${value}`);
    }
  } else {
    console.warn(`Unknown setting key: ${key}`);
  }
};
