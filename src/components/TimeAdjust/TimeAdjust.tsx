import React from 'react';
import { Button } from '@linktivity/link-ui';

interface TimeAdjustProps {
  onAdjust: (amount: number) => void;
  buttonClass?: string;
}

const TimeAdjust: React.FC<TimeAdjustProps> = ({
  onAdjust,
  buttonClass = ''
}) => {
  const adjustments = [
    { amount: 30, label: '+0:30' },
    { amount: 60, label: '+1:00' },
    { amount: 300, label: '+5:00' }
  ];

  return (
    <div>
      {adjustments.map(({ amount, label }) => (
        <Button
          key={amount}
          className={buttonClass}
          variant="outlined"
          onClick={() => onAdjust(amount)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default TimeAdjust;
