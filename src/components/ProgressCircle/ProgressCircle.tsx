import React, { useMemo } from 'react';

interface ProgressCircleProps {
  radius: number;
  stroke: number;
  seconds: number;
  initialSeconds: number;
  hasStarted: boolean;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  radius,
  stroke,
  seconds,
  initialSeconds,
  hasStarted
}) => {
  const normalizedRadius = useMemo(() => radius - stroke / 2, [radius, stroke]);
  const circumference = useMemo(
    () => normalizedRadius * 2 * Math.PI,
    [normalizedRadius]
  );

  const secsForProgress = hasStarted ? seconds : initialSeconds;
  const strokeDashoffset = useMemo(() => {
    if (initialSeconds === 0) {
      return circumference; // Default to full circumference if initialSeconds is 0
    }
    return circumference - (secsForProgress / initialSeconds) * circumference;
  }, [circumference, secsForProgress, initialSeconds]);

  return (
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
  );
};

export default ProgressCircle;
