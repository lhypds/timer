import React, {
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  useState,
  useEffect
} from 'react';
import styles from './time.module.css';
import { Mode } from '../ModeSwitch/ModeSwitch';
import { MAX_TIMER_SECONDS, MAX_CLOCK_MINUTES } from '../../constants/timer';

interface TimeProps {
  seconds: number;
  timerInitial: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onWaveDashClick: () => void;
  mode: Mode;
  isCountToTimer: boolean;
  countTo: number | null;
  isEditable: boolean;
  isEditing: boolean;
}

export const TimerSubTextMode = {
  TimerInitial: 'timerInitial',
  SecondsTail: 'secondsTail'
} as const;

export type TimerSubTextMode =
  (typeof TimerSubTextMode)[keyof typeof TimerSubTextMode];

const Time: React.FC<TimeProps> = ({
  seconds,
  timerInitial,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  onWaveDashClick,
  mode,
  isCountToTimer,
  countTo,
  isEditable,
  isEditing
}) => {
  const [timerSubTextSwitch, setTimerSubTextSwitch] =
    useState<TimerSubTextMode>(TimerSubTextMode.TimerInitial);

  useEffect(() => {
    if (isEditing) {
      // By default, show timer initial time when editing
      setTimerSubTextSwitch(TimerSubTextMode.TimerInitial);
    } else {
      // After editing, switch to seconds tail
      setTimerSubTextSwitch(TimerSubTextMode.SecondsTail);
    }
  }, [isEditing]);

  // Seconds -> 12:00 (HH:mm or MM:SS)
  const formatTime = (secs: number) => {
    const secsInt = Math.max(0, Math.floor(secs));
    const h = Math.floor(secsInt / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((secsInt % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (secsInt % 60).toString().padStart(2, '0');
    return h !== '00' ? `${h}:${m}` : `${m}:${s}`;
  };

  // Seconds -> 12h00 or 59m00
  const formatTimeS = (secs: number) => {
    const secsInt = Math.max(0, Math.floor(secs));
    const h = Math.floor(secsInt / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((secsInt % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (secsInt % 60).toString().padStart(2, '0');
    return h !== '00' ? `${h}h${m}` : `${m}m${s}`;
  };

  // Minutes -> 12:00 (HH:mm)
  const formatTimeC = (minutes: number | null) => {
    if (minutes === null) {
      return '00:00';
    }
    const totalSeconds = Math.max(0, Math.floor(minutes * 60));
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}`;
  };

  // Get latest count to timer remaining time, calculate from current time
  const getCountToTime = () => {
    // Current time in minutes
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const countToInMinutes = Math.min(countTo ?? 0, MAX_CLOCK_MINUTES);
    let totalMinutes = countToInMinutes - currentTimeInMinutes;
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    return Math.min(totalMinutes * 60, MAX_TIMER_SECONDS);
  };

  return (
    <div className={styles.container}>
      {mode === Mode.Stopwatch && <div className={styles.placeholder}></div>}
      {mode === Mode.Timer && isEditing && (
        <div
          className={
            isCountToTimer ? styles.waveDash : styles.waveDashPlaceholder
          }
          onClick={onWaveDashClick}
          onMouseDown={e => e.preventDefault()}
        >
          {isCountToTimer ? '~' : null}
        </div>
      )}
      {mode === Mode.Timer && !isEditing && (
        <div className={styles.placeholder}></div>
      )}
      <input
        className={`${styles.input}`}
        value={
          isCountToTimer && isEditing
            ? formatTimeC(countTo)
            : formatTime(seconds)
        }
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={true}
        onDragStart={e => e.preventDefault()}
        onMouseDown={e => {
          if (!isEditable) {
            e.preventDefault();
          }
        }}
      />
      {mode === Mode.Stopwatch && (
        <span className={styles.milliseconds}>
          .
          {Math.floor((seconds % 1) * 100)
            .toString()
            .padStart(2, '0')}
        </span>
      )}
      {mode === Mode.Timer &&
        timerSubTextSwitch === TimerSubTextMode.TimerInitial && (
          <span
            className={styles.timerInitial}
            onClick={() => {
              setTimerSubTextSwitch(TimerSubTextMode.SecondsTail);
            }}
          >
            /
            {isCountToTimer
              ? formatTimeS(getCountToTime())
              : formatTimeS(timerInitial)}
          </span>
        )}
      {mode === Mode.Timer &&
        timerSubTextSwitch === TimerSubTextMode.SecondsTail && (
          <span
            className={styles.timerInitial}
            onClick={() => {
              setTimerSubTextSwitch(TimerSubTextMode.TimerInitial);
            }}
          >
            {seconds > 3600
              ? ':' +
                Math.floor(seconds % 60)
                  .toString()
                  .padStart(2, '0')
              : '.' +
                Math.floor((seconds % 1) * 100)
                  .toString()
                  .padStart(2, '0')}
          </span>
        )}
    </div>
  );
};

export default Time;
