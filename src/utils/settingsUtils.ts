import { Mode } from '../components/ModeSwitch/ModeSwitch';

const SECONDS_INIT = 300;
const MODE_INIT = Mode.Timer;

export const getSetting = (key: string) => {
  if (key === 'timer') {
    const time = sessionStorage.getItem('timer');
    return time ? parseInt(time, 10) : SECONDS_INIT;
  }

  if (key === 'timerInitial') {
    const time = sessionStorage.getItem('timerInitial');
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
  if (key === 'timer' || key === 'timerInitial' || key === 'stopwatch') {
    sessionStorage.setItem(key, value.toString());
    return;
  }

  if (key === 'mode') {
    if (Object.values(Mode).includes(value as Mode)) {
      sessionStorage.setItem(key, value as Mode);
    } else {
      console.warn(`Invalid mode: ${value}`);
    }
    return;
  }

  console.warn(`Unknown setting key: ${key}`);
};

export const initializeSettings = () => {
  if (sessionStorage.getItem('timer') === null) {
    sessionStorage.setItem('timer', SECONDS_INIT.toString());
  }
  if (sessionStorage.getItem('timerInitial') === null) {
    sessionStorage.setItem('timerInitial', SECONDS_INIT.toString());
  }
  if (sessionStorage.getItem('stopwatch') === null) {
    sessionStorage.setItem('stopwatch', '0');
  }
  if (sessionStorage.getItem('mode') === null) {
    sessionStorage.setItem('mode', MODE_INIT);
  }
};
