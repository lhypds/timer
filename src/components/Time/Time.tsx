import React, { ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import styles from './time.module.css';
import { Mode } from '../ModeSwitch/ModeSwitch';

interface TimeProps {
  seconds: string;
  milliseconds: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  mode: Mode;
}

const Time: React.FC<TimeProps> = ({
  seconds,
  milliseconds,
  onChange,
  readOnly,
  onKeyDown,
  onFocus,
  onBlur,
  mode
}) => (
  <div className={styles.timeContainer}>
    {mode === Mode.Stopwatch && <div className={styles.placeholder}></div>}
    <input
      className={`${styles.input}`}
      value={seconds}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      readOnly={true}
      onDragStart={e => e.preventDefault()}
      onMouseDown={readOnly ? e => e.preventDefault() : undefined}
    />
    {mode === Mode.Stopwatch && (
      <span className={styles.milliseconds}>.{milliseconds}</span>
    )}
  </div>
);

export default Time;
