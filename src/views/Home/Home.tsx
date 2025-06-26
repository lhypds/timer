import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent
} from 'react';
import ProgressCircle from '../../components/ProgressCircle/ProgressCircle';
import {
  Mode,
  default as ModeSwitch
} from '../../components/ModeSwitch/ModeSwitch';
import Time from '../../components/Time/Time';
import TimeAdjust from '../../components/TimeAdjust/TimeAdjust';
import StartPause from '../../components/StartPause/StartPause';
import homeStyles from './home.module.css';
import { getSetting, setSetting } from '../../utils/settingsUtils';

const TIMER_INTERVAL_MS = 1000;
const RADIUS = 180;
const STROKE = 4;
const MAX_TIME_SECONDS = 99 * 60 + 59;

const HomeView = () => {
  // Mode can be 'timer' or 'stopwatch'
  const [mode, setMode] = useState<Mode>(getSetting('mode') as Mode);

  const [seconds, setSeconds] = useState<number>(
    (mode === Mode.Timer
      ? getSetting('timer')
      : getSetting('stopwatch')) as number
  );
  const [initialSeconds, setInitialSeconds] = useState<number>(
    (mode === Mode.Timer
      ? getSetting('timer')
      : getSetting('stopwatch')) as number
  );

  // Buffer for typed digits in timer mode
  const [inputBuffer, setInputBuffer] = useState<string | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleModeChange = (newMode: Mode) => {
    setIsRunning(false);
    setHasStarted(false);
    setMode(newMode);

    if (newMode === Mode.Timer) {
      setSeconds(getSetting('timer') as number);
      setInitialSeconds(getSetting('timer') as number);
      setInputBuffer(null);
    }

    if (newMode === Mode.Stopwatch) {
      setSeconds(getSetting('stopwatch') as number);
      setInitialSeconds(0);
    }
  };

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      if (mode === Mode.Timer && seconds > 0) {
        timer = setInterval(
          () => setSeconds(prev => prev - 1),
          TIMER_INTERVAL_MS
        );
      }

      if (mode === Mode.Stopwatch) {
        timer = setInterval(
          () => setSeconds(prev => prev + 1),
          TIMER_INTERVAL_MS
        );
      }
    }
    if (mode === Mode.Timer && seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, seconds, mode]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Update handleInputChange to enforce max time
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [m, s] = e.target.value.split(':').map(Number);
    if (!isNaN(m) && !isNaN(s)) {
      const total = Math.min(m * 60 + s, MAX_TIME_SECONDS);
      setSeconds(total);
    }
  };

  // Update handleAdjust to enforce max time
  const handleAdjust = (amount: number) =>
    setSeconds(prev => Math.min(Math.max(prev + amount, 0), MAX_TIME_SECONDS));

  // Handle numeric key input shifting digits into mm:ss format
  const handleTimeKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (mode !== Mode.Timer) return;
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      const digit = e.key;
      const buf = (inputBuffer ?? '') + digit;
      const newBuf = buf.length > 4 ? buf.slice(-4) : buf;
      const padded = newBuf.padStart(4, '0');
      const mm = parseInt(padded.slice(0, 2), 10);
      const ss = parseInt(padded.slice(2), 10);
      const totalSeconds = Math.min(mm * 60 + ss, MAX_TIME_SECONDS);
      setSeconds(totalSeconds);
      setInputBuffer(newBuf);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      const buf = inputBuffer ?? '';
      const newBuf = buf.slice(0, -1);
      const padded = newBuf.padStart(4, '0');
      const mm = parseInt(padded.slice(0, 2), 10);
      const ss = parseInt(padded.slice(2), 10);
      const totalSeconds = Math.min(mm * 60 + ss, MAX_TIME_SECONDS);
      setSeconds(totalSeconds);
      setInputBuffer(newBuf);
    }
  };

  // On focus, start editing buffer
  const handleTimeFocus = () => {
    if (mode === Mode.Timer) {
      setInputBuffer(formatTime(seconds).replace(':', ''));
    }
  };

  // On blur, clear buffer
  const handleTimeBlur = () => setInputBuffer(null);

  // start the timer
  const handleStart = useCallback(() => {
    // on first start, initialize timer/stopwatch; on resume skip resets
    if (!hasStarted) {
      if (mode === Mode.Timer) {
        setInitialSeconds(seconds);
      }
      setHasStarted(true);
    }
    setIsRunning(true);
  }, [mode, seconds, hasStarted]);

  // Pause the timer
  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset the timer to initial value
  const handleReset = useCallback(() => {
    if (mode === Mode.Timer) {
      setSeconds(initialSeconds);
    } else {
      setSeconds(0);
    }
    setIsRunning(false);
    setHasStarted(false);
    document.body.style.backgroundColor = '';
  }, [mode, initialSeconds]);

  // Keyboard shortcuts: Enter to start/pause
  useEffect(() => {
    function handleKeyDown(this: Window, e: KeyboardEvent) {
      if (e.code === 'Enter') {
        e.preventDefault();
        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, handlePause, handleStart, handleReset]);

  // Save time
  useEffect(() => {
    if (mode === Mode.Timer) {
      setSetting('timer', seconds);
    }
    if (mode === Mode.Stopwatch) {
      setSetting('stopwatch', seconds);
    }
  }, [seconds, mode]);

  // Save mode
  useEffect(() => {
    setSetting('mode', mode);
  }, [mode]);

  // Prevent page unload if timer is running
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning]);

  // Flash background when timer finishes
  useEffect(() => {
    let flashInterval: number | undefined;

    if (mode === Mode.Timer && seconds === 0) {
      const flashBackground = () => {
        document.body.style.backgroundColor =
          document.body.style.backgroundColor === 'lightgray'
            ? ''
            : 'lightgray';
      };
      flashInterval = window.setInterval(flashBackground, 500); // use window.setInterval for clarity
    }

    return () => {
      if (flashInterval !== undefined) {
        clearInterval(flashInterval);
      }
      document.body.style.backgroundColor = '';
    };
  }, [seconds, mode]);

  return (
    <div className={homeStyles.home}>
      <div className={homeStyles.circle}>
        <ProgressCircle
          radius={RADIUS}
          stroke={STROKE}
          seconds={seconds}
          initialSeconds={initialSeconds}
          hasStarted={hasStarted}
        />
        <div className={homeStyles.inner}>
          <ModeSwitch mode={mode} onModeChange={handleModeChange} />
          <Time
            value={formatTime(seconds)}
            onChange={mode === Mode.Timer ? handleInputChange : undefined}
            readOnly={isRunning || mode === Mode.Stopwatch}
            onKeyDown={handleTimeKeyDown}
            onFocus={handleTimeFocus}
            onBlur={handleTimeBlur}
          />
          <TimeAdjust onAdjust={handleAdjust} />
          <StartPause
            isRunning={isRunning}
            mode={mode}
            seconds={seconds}
            initialSeconds={initialSeconds}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
