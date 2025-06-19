import homeStyles from './home.module.css';
import { Input, Button } from '@linktivity/link-ui';
import { useState, useEffect, ChangeEvent } from 'react';

const HomeView = () => {
  const [seconds, setSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);

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
    if (!isNaN(m) && !isNaN(s)) setSeconds(m * 60 + s);
  };

  const handleAdjust = (amount: number) =>
    setSeconds(prev => Math.max(prev + amount, 0));
  const toggleRunning = () => setIsRunning(prev => !prev);

  return (
    <div className={homeStyles.home}>
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
        <Button
          className={homeStyles.button}
          variant="outlined"
          onClick={toggleRunning}
        >
          {isRunning ? '❚❚' : '▶'}
        </Button>
      </div>
    </div>
  );
};

export default HomeView;
