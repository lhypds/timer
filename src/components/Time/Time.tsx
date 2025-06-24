import React, { ChangeEvent } from 'react';
import styles from './time.module.css';

interface TimeProps {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
}

const Time: React.FC<TimeProps> = ({ value, onChange, readOnly }) => (
  <input
    className={`${styles.input}`}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
  />
);

export default Time;
