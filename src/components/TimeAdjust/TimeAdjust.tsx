import React from 'react';
import { Button } from '@linktivity/link-ui';

interface TimeAdjustProps {
  onAdjust: (amount: number) => void;
  buttonClass?: string;
}

const TimeAdjust: React.FC<TimeAdjustProps> = ({
  onAdjust,
  buttonClass = ''
}) => (
  <div>
    <Button
      className={buttonClass}
      variant="outlined"
      onClick={() => onAdjust(30)}
    >
      {'+0:30'}
    </Button>
    <Button
      className={buttonClass}
      variant="outlined"
      onClick={() => onAdjust(60)}
    >
      {'+1:00'}
    </Button>
    <Button
      className={buttonClass}
      variant="outlined"
      onClick={() => onAdjust(300)}
    >
      {'+5:00'}
    </Button>
  </div>
);

export default TimeAdjust;
