import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import ProgressCircle from '../../components/ProgressCircle/ProgressCircle';
import ModeSwitch from '../../components/ModeSwitch/ModeSwitch';
import Time from '../../components/Time/Time';
import TimeAdjust from '../../components/TimeAdjust/TimeAdjust';
import StartPause from '../../components/StartPause/StartPause';
import homeStyles from './home.module.css';

const HomeView = () => {
  const [seconds, setSeconds] = useState(300);
  const [initialSeconds, setInitialSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);

  // track if timer/stopwatch has been started (running or paused)
  const [hasStarted, setHasStarted] = useState(false);

  // mode: 'timer' counts down, 'stopwatch' counts up
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('timer');

  const handleModeChange = (newMode: 'timer' | 'stopwatch') => {
    setIsRunning(false);
    setHasStarted(false);
    setMode(newMode);
    setSeconds(newMode === 'stopwatch' ? 0 : initialSeconds);
  };

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      if (mode === 'timer' && seconds > 0) {
        timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
      } else if (mode === 'stopwatch') {
        timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
      }
    }
    if (mode === 'timer' && seconds === 0) {
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [m, s] = e.target.value.split(':').map(Number);
    if (!isNaN(m) && !isNaN(s)) {
      const total = m * 60 + s;
      setSeconds(total);
    }
  };

  const handleAdjust = (amount: number) =>
    setSeconds(prev => Math.max(prev + amount, 0));

  // start the timer
  const handleStart = useCallback(() => {
    // on first start, initialize timer/stopwatch; on resume skip resets
    if (!hasStarted) {
      if (mode === 'timer') {
        setInitialSeconds(seconds);
      } else if (mode === 'stopwatch') {
        setSeconds(0);
      }
      setHasStarted(true);
    }
    setIsRunning(true);
  }, [mode, seconds, hasStarted]);

  // pause the timer
  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // reset the timer to initial value
  const handleReset = useCallback(() => {
    if (mode === 'timer') {
      setSeconds(initialSeconds);
    } else {
      setSeconds(0);
    }
    setIsRunning(false);
    setHasStarted(false);
  }, [mode, initialSeconds]);

  // keyboard shortcuts: Space to start/pause, Backspace to reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.code === 'Backspace') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, handlePause, handleStart, handleReset]);

  const radius = 180;
  const stroke = 4;

  return (
    <div className={homeStyles.home}>
      <div className={homeStyles.circle}>
        <ProgressCircle
          radius={radius}
          stroke={stroke}
          seconds={seconds}
          initialSeconds={initialSeconds}
          hasStarted={hasStarted}
        />
        <div className={homeStyles.inner}>
          <ModeSwitch
            mode={mode}
            onModeChange={handleModeChange}
            buttonClass={homeStyles.button}
            activeClass={homeStyles.buttonActive}
          />
          <Time
            value={formatTime(seconds)}
            onChange={mode === 'timer' ? handleInputChange : undefined}
            readOnly={mode === 'stopwatch'}
            className={homeStyles.input}
            style={{ textAlign: 'center' }}
          />
          <TimeAdjust onAdjust={handleAdjust} buttonClass={homeStyles.button} />
          <StartPause
            isRunning={isRunning}
            mode={mode}
            seconds={seconds}
            initialSeconds={initialSeconds}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            buttonClass={homeStyles.button}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
