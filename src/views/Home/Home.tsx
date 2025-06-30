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
import Keypad from '../../components/Keypad/Keypad';
import StartPause from '../../components/StartPause/StartPause';
import styles from './home.module.css';
import {
  getSetting,
  initializeSettings,
  setSetting
} from '../../utils/settingsUtils';
import {
  TIMER_INTERVAL_MS,
  MAX_TIMER_SECONDS,
  MAX_CLOCK_MINUTES
} from '../../constants/timer';
import { eventKey } from '@linktivity/link-utils';

const HomeView = () => {
  // Mode can be 'timer' or 'stopwatch'
  const [mode, setMode] = useState<Mode>(() => getSetting('mode') as Mode);
  useEffect(() => {
    setSetting('mode', mode);
  }, [mode]);

  // Time in seconds
  const [seconds, setSeconds] = useState<number>(
    () =>
      (mode === Mode.Timer
        ? getSetting('timer')
        : getSetting('stopwatch')) as number
  );
  useEffect(() => {
    if (mode === Mode.Timer) {
      setSetting('timer', seconds);
    }

    if (mode === Mode.Stopwatch) {
      setSetting('stopwatch', seconds);
    }
  }, [seconds, mode]);

  // Initial time for timer mode
  const [timerInitial, setTimerInitial] = useState<number>(
    () => getSetting('timerInitial') as number
  );
  useEffect(() => {
    setSetting('timerInitial', timerInitial);
  }, [timerInitial]);

  // Is count to timer
  const [isCountToTimer, setIsCountToTimer] = useState<boolean>(
    () => getSetting('isCountToTimer') as boolean
  );
  useEffect(() => {
    setSetting('isCountToTimer', isCountToTimer);

    // Reset input buffer
    if (isCountToTimer) {
      setInputBuffer('0000'); // 4 digits for HH:mm
    } else {
      setInputBuffer('000000'); // 6 digits for HH:mm:ss
    }
  }, [isCountToTimer]);

  // Count to (00:00 - 23:59, max 1439 minutes)
  const [countTo, setCountTo] = useState<number | null>(
    () => (getSetting('countTo') as number) || null
  );
  useEffect(() => {
    if (countTo !== null) {
      setSetting('countTo', countTo);
    }
  }, [countTo]);

  // Progress circle
  const [circleSeconds, setCircleSeconds] = useState<number>(
    mode === Mode.Timer ? timerInitial : 60
  );

  // Buffer for typed digits in timer mode
  const [inputBuffer, setInputBuffer] = useState<string | null>(null);
  useEffect(() => {
    if (inputBuffer !== null) {
      setSetting('inputBuffer', inputBuffer);
    }
  }, [inputBuffer]);

  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleModeChange = (newMode: Mode) => {
    setIsRunning(false);
    setHasStarted(false);
    setMode(newMode);

    if (newMode === Mode.Timer) {
      setSeconds(getSetting('timer') as number);
      setCircleSeconds(timerInitial);
      setInputBuffer(null);
    }

    if (newMode === Mode.Stopwatch) {
      setSeconds(getSetting('stopwatch') as number);
      setCircleSeconds(60);
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
      // Stop the stopwatch if seconds larger than 99:59
      if (seconds >= MAX_TIMER_SECONDS) {
        setIsRunning(false);
      }

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

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [m, s] = e.target.value.split(':').map(Number);
    if (!isNaN(m) && !isNaN(s)) {
      const total = Math.min(m * 60 + s, MAX_TIMER_SECONDS);
      setSeconds(total);
    }
  };

  // Update to enforce max time
  const handleTimeAdjust = useCallback(
    (amount: number) => {
      setSeconds(prev =>
        Math.min(Math.max(prev + amount, 0), MAX_TIMER_SECONDS)
      );

      if (mode === Mode.Timer) {
        setTimerInitial(prev =>
          Math.min(Math.max(prev + amount, 0), MAX_TIMER_SECONDS)
        );

        setCircleSeconds(prev =>
          Math.min(Math.max(prev + amount, 0), MAX_TIMER_SECONDS)
        );
      }
    },
    [mode]
  );

  // On focus, start editing buffer
  const handleTimeFocus = () => {
    if (mode === Mode.Timer) {
      if (isCountToTimer) {
        setInputBuffer('0000'); // 4 digits for HH:mm
      } else {
        setInputBuffer('000000'); // 6 digits for HH:mm:ss
      }
      setIsEditing(true);
    }
  };

  // On blur, clear buffer
  const handleTimeBlur = () => {
    setInputBuffer(null);
    setIsEditing(false);

    // Clear input buffer
    if (isCountToTimer) {
      setInputBuffer('0000'); // 4 digits for HH:mm
    } else {
      setInputBuffer('000000'); // 6 digits for HH:mm:ss
    }
  };

  // Refresh count to timer (with new current time)
  const resetCountToTimer = useCallback(() => {
    if (isCountToTimer) {
      // Current time in minutes
      const now = new Date();
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      const countToInMinutes = Math.min(countTo ?? 0, MAX_CLOCK_MINUTES);
      let totalMinutes = countToInMinutes - currentTimeInMinutes;
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
      }
      const totalSeconds = Math.min(totalMinutes * 60, MAX_TIMER_SECONDS);
      setSeconds(totalSeconds);
      setTimerInitial(totalSeconds);
      setCircleSeconds(totalSeconds);
    }
  }, [isCountToTimer, countTo]);

  // start the timer
  const handleStart = useCallback(() => {
    // on first start, initialize timer/stopwatch; on resume skip resets
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsRunning(true);

    if (isCountToTimer) {
      // Refresh count to timer with new current time
      resetCountToTimer();

      // reset to timer mode
      setIsCountToTimer(false);
    }
  }, [hasStarted, isCountToTimer, resetCountToTimer]);

  // Pause the timer
  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset the timer to initial value
  const handleReset = useCallback(() => {
    if (mode === Mode.Timer) {
      setSeconds(timerInitial);
    }

    if (mode === Mode.Stopwatch) {
      setSeconds(0);
    }

    setIsRunning(false);
    setHasStarted(false);
    document.body.style.backgroundColor = ''; // reset flashed background
  }, [mode, timerInitial]);

  // Handle keydown event
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === eventKey.Enter) {
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

  // From the input buffer value, setup the timer
  const setupTimer = useCallback(
    (newBuf: string) => {
      if (!isCountToTimer) {
        const padded = newBuf.padStart(6, '0');
        const HH = parseInt(padded.slice(0, 2), 10);
        const mm = parseInt(padded.slice(2, 4), 10);
        const ss = parseInt(padded.slice(4), 10);
        const totalSeconds = Math.min(
          HH * 60 * 60 + mm * 60 + ss,
          MAX_TIMER_SECONDS
        );
        setSeconds(totalSeconds);
        setTimerInitial(totalSeconds);
        setCircleSeconds(totalSeconds);
        setInputBuffer(newBuf);
      }

      if (isCountToTimer) {
        const padded = newBuf.padStart(4, '0');
        const HH = parseInt(padded.slice(0, 2), 10);
        const mm = parseInt(padded.slice(2), 10);
        const countToInMinutes = Math.min(HH * 60 + mm, MAX_CLOCK_MINUTES);
        setCountTo(countToInMinutes);
        setInputBuffer(newBuf);
      }
    },
    [isCountToTimer]
  );

  // Handle numeric key input shifting digits into mm:ss format
  const handleTimeKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (mode !== Mode.Timer) return;

    const bufferLength = isCountToTimer ? 4 : 6;
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      const digit = e.key;
      const buf = (inputBuffer ?? '') + digit;
      const newBuf = buf.length > bufferLength ? buf.slice(-bufferLength) : buf;
      setupTimer(newBuf);
    }

    if (e.key === eventKey.Backspace) {
      e.preventDefault();
      const buf = inputBuffer ?? '';
      const newBuf = buf.slice(0, -1);
      setupTimer(newBuf);
    }
  };

  // Handle keypad input
  const handleKeypadPress = useCallback(
    (value: string | number) => {
      if (mode !== Mode.Timer) return;

      const bufferLength = isCountToTimer ? 4 : 6;
      if (typeof value === 'number') {
        const buf = (inputBuffer ?? '') + value.toString();
        const newBuf =
          buf.length > bufferLength ? buf.slice(-1 * bufferLength) : buf;
        setupTimer(newBuf);
      }

      if (value === eventKey.Backspace) {
        const buf = inputBuffer ?? '';
        const newBuf = buf.slice(0, -1);
        setupTimer(newBuf);
      }

      if (value === eventKey.Enter) {
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
    [
      mode,
      isCountToTimer,
      inputBuffer,
      setupTimer,
      isRunning,
      handlePause,
      handleStart
    ]
  );

  // Handle wave dash change
  const handleWaveDashChange = () => {
    setIsCountToTimer(prev => !prev);
  };

  useEffect(() => {
    // Handle keydown event
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.circle}>
          <ProgressCircle seconds={seconds} circleSeconds={circleSeconds} />
          <div className={styles.inner}>
            <ModeSwitch mode={mode} onModeChange={handleModeChange} />
            <Time
              seconds={seconds}
              timerInitial={timerInitial}
              onChange={handleInputChange}
              onKeyDown={handleTimeKeyDown}
              onFocus={handleTimeFocus}
              onBlur={handleTimeBlur}
              onWaveDashClick={handleWaveDashChange}
              mode={mode}
              isCountToTimer={isCountToTimer}
              countTo={countTo}
              isEditable={!isRunning && mode === Mode.Timer}
              isEditing={isEditing}
            />
            {isEditing && <Keypad onKeyPress={handleKeypadPress} />}
            {!isEditing && (
              <>
                <TimeAdjust onAdjust={handleTimeAdjust} />
                <StartPause
                  isRunning={isRunning}
                  mode={mode}
                  seconds={seconds}
                  initialSeconds={timerInitial}
                  onStart={handleStart}
                  onPause={handlePause}
                  onReset={handleReset}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
