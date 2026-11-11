import React from 'react';

interface WindArrowProps {
  degrees: number; // meteorological direction the wind comes FROM
}

// Points where the wind is blowing to, so it is rotated 180° from the source direction
const WindArrow: React.FC<WindArrowProps> = ({ degrees }) => (
  <svg
    viewBox="0 0 24 24"
    width={20}
    height={20}
    aria-hidden="true"
    className="inline-block shrink-0 border-2 border-text-primary dark:border-dark-text-primary bg-accent dark:bg-dark-accent"
    style={{ transform: `rotate(${degrees + 180}deg)` }}
  >
    <path d="M12 3 L19 14 L12 11 L5 14 Z" fill="currentColor" className="text-text-primary dark:text-dark-bg" />
  </svg>
);

export default WindArrow;
