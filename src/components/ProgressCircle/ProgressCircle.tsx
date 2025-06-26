import React, { useMemo } from 'react';

interface ProgressCircleProps {
  seconds: number;
  circleSeconds: number;
}

const RADIUS = 180;
const STROKE_WIDTH = 4;

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  seconds,
  circleSeconds
}) => {
  const normalizedRadius = RADIUS - STROKE_WIDTH / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const secsForProgress = seconds;

  const strokeDashoffset = useMemo(() => {
    if (circleSeconds === 0) {
      return circumference; // Default to full circumference if initialSeconds is 0
    }
    return circumference - (secsForProgress / circleSeconds) * circumference;
  }, [circumference, secsForProgress, circleSeconds]);

  return (
    <svg height={RADIUS * 2} width={RADIUS * 2}>
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={STROKE_WIDTH}
        r={normalizedRadius}
        cx={RADIUS}
        cy={RADIUS}
      />
      <circle
        stroke="#6b6b6b"
        fill="transparent"
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={RADIUS}
        cy={RADIUS}
      />
    </svg>
  );
};

export default ProgressCircle;
