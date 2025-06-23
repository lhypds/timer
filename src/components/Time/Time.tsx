import React, { ChangeEvent } from 'react';

interface TimeProps {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Time: React.FC<TimeProps> = ({
  value,
  onChange,
  readOnly,
  className,
  style
}) => (
  <input
    className={className}
    style={style}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
  />
);

export default Time;
