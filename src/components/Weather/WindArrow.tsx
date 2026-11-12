import React from 'react';

interface WindArrowProps {
  degrees: number; // meteorological direction the wind comes FROM
}

// Compass-style dial: the needle points where the wind blows to, the tick marks north.
// Uses the primary text color (high contrast in both themes) instead of the accent.
const WindArrow: React.FC<WindArrowProps> = ({ degrees }) => (
  <svg
    viewBox="0 0 40 40"
    width={40}
    height={40}
    aria-hidden="true"
    className="inline-block shrink-0 text-text-primary dark:text-dark-text-primary"
  >
    <circle cx={20} cy={20} r={18} className="fill-bg dark:fill-dark-bg stroke-current" strokeWidth={2} />
    <line x1={20} y1={3} x2={20} y2={7} stroke="currentColor" strokeWidth={2} />
    <g style={{ transform: `rotate(${degrees + 180}deg)`, transformOrigin: '20px 20px' }}>
      <path d="M20 8 L26 24 L20 20 L14 24 Z" fill="currentColor" />
    </g>
    <circle cx={20} cy={20} r={2.5} fill="currentColor" />
  </svg>
);

export default WindArrow;
