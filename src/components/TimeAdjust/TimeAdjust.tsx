import React from 'react';
import styles from './time.module.css';

interface TimeAdjustProps {
  onAdjust: (amount: number) => void;
  buttonClass?: string;
}

const TimeAdjust: React.FC<TimeAdjustProps> = ({ onAdjust }) => {
  const adjustments = [
    { amount: 30, label: '+0:30' },
    { amount: 60, label: '+1:00' },
    { amount: 300, label: '+5:00' }
  ];

  return (
    <div>
      {adjustments.map(({ amount, label }) => (
        <button
          key={amount}
          className={`${styles.button}`}
          onClick={() => onAdjust(amount)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TimeAdjust;
