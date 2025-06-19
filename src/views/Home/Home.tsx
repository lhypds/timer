import homeStyles from './home.module.css';
import { Input, Button } from '@linktivity/link-ui';
import { useState, useEffect, ChangeEvent, useMemo } from 'react';

const HomeView = () => {
  const [seconds, setSeconds] = useState(300);
  const [initialSeconds, setInitialSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);

  // calculate circle progress
  const radius = 180;
  const stroke = 4;
  const normalizedRadius = useMemo(() => radius - stroke / 2, []);
  const circumference = useMemo(
    () => normalizedRadius * 2 * Math.PI,
    [normalizedRadius]
  );

  const strokeDashoffset = useMemo(() => {
    return circumference - (seconds / initialSeconds) * circumference;
  }, [seconds, initialSeconds, circumference]);

  useEffect(() => {
    let timer: number;
    if (isRunning && seconds > 0) {
      timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
    }
    if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, seconds]);

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
  const handleStart = () => {
    setInitialSeconds(seconds);
    setIsRunning(true);
  };

  // pause the timer
  const handlePause = () => {
    setIsRunning(false);
  };

  // reset the timer to initial value
  const handleReset = () => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  };

  return (
    <div className={homeStyles.home}>
      <div className={homeStyles.circle}>
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e6e6e6"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#6b6b6b"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className={homeStyles.inner}>
          <div>
            <Button className={homeStyles.button} variant="outlined">
              Timer
            </Button>
            <Button className={homeStyles.button} variant="outlined">
              Stopwatch
            </Button>
          </div>
          <Input
            className={homeStyles.input}
            style={{ textAlign: 'center' }}
            value={formatTime(seconds)}
            onChange={handleInputChange}
          />
          <div>
            <Button
              className={homeStyles.button}
              variant="outlined"
              onClick={() => handleAdjust(30)}
            >
              {'+0:30'}
            </Button>
            <Button
              className={homeStyles.button}
              variant="outlined"
              onClick={() => handleAdjust(60)}
            >
              {'+1:00'}
            </Button>
            <Button
              className={homeStyles.button}
              variant="outlined"
              onClick={() => handleAdjust(300)}
            >
              {'+5:00'}
            </Button>
          </div>
          <div>
            {isRunning ? (
              <Button
                className={homeStyles.button}
                variant="outlined"
                onClick={handlePause}
              >
                {'❚❚'}
              </Button>
            ) : (
              <Button
                className={homeStyles.button}
                variant="outlined"
                onClick={handleStart}
              >
                {'▶'}
              </Button>
            )}
            {(isRunning || seconds !== initialSeconds) && (
              <Button
                className={homeStyles.button}
                variant="outlined"
                onClick={handleReset}
              >
                {'↻'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
