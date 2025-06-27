import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useRef
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
import {
  getSetting,
  initializeSettings,
  setSetting
} from '../../utils/settingsUtils';

const TIMER_INTERVAL_MS = 1;
const MAX_TIME_SECONDS = 99 * 60 + 59;

const HomeView = () => {
  // Mode can be 'timer' or 'stopwatch'
  const [mode, setMode] = useState<Mode>(getSetting('mode') as Mode);

  // Time in seconds
  const [seconds, setSeconds] = useState<number>(
    (mode === Mode.Timer
      ? getSetting('timer')
      : getSetting('stopwatch')) as number
  );

  // Progress circle
  const [circleSeconds, setCircleSeconds] = useState<number>(0);
  useEffect(() => {
    setCircleSeconds(
      mode === Mode.Timer ? (getSetting('timerInitial') as number) : 60
    );
  }, [mode]);

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
      setInputBuffer(null);
    }

    if (newMode === Mode.Stopwatch) {
      setSeconds(getSetting('stopwatch') as number);
    }
  };

  useEffect(() => {
    // Initialization
    initializeSettings();
  }, []);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Time update
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current =
        performance.now() - (mode === Mode.Stopwatch ? seconds * 1000 : 0);
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsed = (performance.now() - startTimeRef.current) / 1000;
          if (mode === Mode.Timer) {
            const remainingTime = Math.max(seconds - elapsed, 0);
            setSeconds(remainingTime);
          } else if (mode === Mode.Stopwatch) {
            setSeconds(elapsed);
          }
        }
      }, TIMER_INTERVAL_MS); // update every x ms
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds, mode]);

  const formatTime = (secs: number) => {
    const secsInt = Math.max(0, Math.floor(secs));
    const m = Math.floor(secsInt / 60)
      .toString()
      .padStart(2, '0');
    const s = (secsInt % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [m, s] = e.target.value.split(':').map(Number);
    if (!isNaN(m) && !isNaN(s)) {
      const total = Math.min(m * 60 + s, MAX_TIME_SECONDS);
      setSeconds(total);
    }
  };

  // Update to enforce max time
  const handleTimeAdjust = useCallback(
    (amount: number) => {
      if (!hasStarted) {
        setSetting('timerInitial', seconds + amount);
      }
      setSeconds(prev =>
        Math.min(Math.max(prev + amount, 0), MAX_TIME_SECONDS)
      );

      if (mode === Mode.Timer) {
        setCircleSeconds(prev =>
          Math.min(Math.max(prev + amount, 0), MAX_TIME_SECONDS)
        );
      }
    },
    [hasStarted, seconds, mode]
  );

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
      setSetting('timerInitial', totalSeconds);
      setCircleSeconds(totalSeconds);
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
      setSetting('timerInitial', totalSeconds);
      setCircleSeconds(totalSeconds);
      setInputBuffer(newBuf);
    }
  };

  // On focus, start editing buffer
  const handleTimeFocus = () => {
    if (mode === Mode.Timer) {
      setInputBuffer('0000');
    }
  };

  // On blur, clear buffer
  const handleTimeBlur = () => {
    setInputBuffer(null);
  };

  // start the timer
  const handleStart = useCallback(() => {
    // on first start, initialize timer/stopwatch; on resume skip resets
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsRunning(true);
  }, [hasStarted]);

  // Pause the timer
  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset the timer to initial value
  const handleReset = useCallback(() => {
    if (mode === Mode.Timer) {
      setSeconds(getSetting('timerInitial') as number);
    }

    if (mode === Mode.Stopwatch) {
      setSeconds(0);
    }
    setIsRunning(false);
    setHasStarted(false);
    document.body.style.backgroundColor = '';
  }, [mode]);

  // Handle keydown event
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();

        // Blur input
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement.tagName === 'INPUT') {
          activeElement.blur();
        }

        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      }
    },
    [isRunning, handleStart, handlePause]
  );

  useEffect(() => {
    // Handle keydown event
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Save time
  useEffect(() => {
    if (mode === Mode.Timer) {
      setSetting('timer', seconds);
    }

    if (mode === Mode.Stopwatch) {
      setSetting('stopwatch', seconds);

      // Stop the stopwatch if seconds larger than 99:59
      if (seconds >= MAX_TIME_SECONDS) {
        handlePause();
      }
    }
  }, [seconds, mode, handlePause]);

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

    if (mode === Mode.Timer && seconds <= 0.001 && isRunning) {
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
  }, [isRunning, seconds, mode]);

  return (
    <div className={homeStyles.home}>
      <div className={homeStyles.circle}>
        <ProgressCircle seconds={seconds} circleSeconds={circleSeconds} />
        <div className={homeStyles.inner}>
          <ModeSwitch mode={mode} onModeChange={handleModeChange} />
          <Time
            seconds={formatTime(seconds)}
            milliseconds={Math.floor((seconds % 1) * 100)
              .toString()
              .padStart(2, '0')}
            onChange={mode === Mode.Timer ? handleInputChange : undefined}
            readOnly={isRunning || mode === Mode.Stopwatch}
            onKeyDown={handleTimeKeyDown}
            onFocus={handleTimeFocus}
            onBlur={handleTimeBlur}
            mode={mode}
          />
          <TimeAdjust onAdjust={handleTimeAdjust} />
          <StartPause
            isRunning={isRunning}
            mode={mode}
            seconds={seconds}
            initialSeconds={getSetting('timerInitial') as number}
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
