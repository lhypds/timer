import React, { ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import styles from './time.module.css';

interface TimeProps {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

const Time: React.FC<TimeProps> = ({
  value,
  onChange,
  readOnly,
  onKeyDown,
  onFocus,
  onBlur
}) => (
  <input
    className={`${styles.input}`}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onFocus={onFocus}
    onBlur={onBlur}
    readOnly={readOnly}
  />
);

export default Time;
