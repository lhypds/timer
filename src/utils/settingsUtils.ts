import { Mode } from '../components/ModeSwitch/ModeSwitch';

const DEFAULT_TIMER_SECONDS = 300;
const DEFAULT_MODE = Mode.Timer;
const DEFAULT_IS_COUNT_TO_TIMER = false;

export const getSetting = (key: string) => {
  if (key === 'timer') {
    const time = sessionStorage.getItem('timer');
    return time ? parseFloat(time) : DEFAULT_TIMER_SECONDS;
  }

  if (key === 'timerInitial') {
    const time = sessionStorage.getItem('timerInitial');
    return time ? parseFloat(time) : DEFAULT_TIMER_SECONDS;
  }

  if (key === 'stopwatch') {
    const time = sessionStorage.getItem('stopwatch');
    return time ? parseFloat(time) : 0; // default to 0 seconds
  }

  if (key === 'mode') {
    const mode = sessionStorage.getItem('mode');
    return mode ? (mode as Mode) : DEFAULT_MODE;
  }

  if (key === 'isCountToTimer') {
    const isCountToTimer = sessionStorage.getItem('isCountToTimer');
    return isCountToTimer
      ? isCountToTimer === 'true'
      : DEFAULT_IS_COUNT_TO_TIMER;
  }

  if (key === 'countTo') {
    const countTo = sessionStorage.getItem('countTo');
    return countTo ? parseInt(countTo) : null;
  }
};

export const setSetting = (key: string, value: string | number | boolean) => {
  // String
  if (key === 'inputBuffer') {
    sessionStorage.setItem('inputBuffer', value as string);
    return;
  }

  // Number
  if (
    key === 'timer' ||
    key === 'timerInitial' ||
    key === 'stopwatch' ||
    key === 'countTo'
  ) {
    sessionStorage.setItem(key, value.toString());
    return;
  }

  // Mode
  if (key === 'mode') {
    if (Object.values(Mode).includes(value as Mode)) {
      sessionStorage.setItem(key, value as Mode);
    } else {
      console.warn(`Invalid mode: ${value}`);
    }
    return;
  }

  // Boolean
  if (key === 'isCountToTimer') {
    sessionStorage.setItem('isCountToTimer', value ? 'true' : 'false');
    return;
  }

  console.warn(`Unknown setting key: ${key}`);
};

export const initializeSettings = () => {
  if (sessionStorage.getItem('timer') === null) {
    sessionStorage.setItem('timer', DEFAULT_TIMER_SECONDS.toString());
  }
  if (sessionStorage.getItem('timerInitial') === null) {
    sessionStorage.setItem('timerInitial', DEFAULT_TIMER_SECONDS.toString());
  }
  if (sessionStorage.getItem('stopwatch') === null) {
    sessionStorage.setItem('stopwatch', '0');
  }
  if (sessionStorage.getItem('mode') === null) {
    sessionStorage.setItem('mode', DEFAULT_MODE);
  }
};
