import React from 'react';

// Same geometry as public/favicon.svg, colored with theme tokens so it reads in light and dark
const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
    <rect x="7" y="7" width="54" height="54" className="fill-text-primary dark:fill-dark-text-primary" />
    <rect x="2" y="2" width="54" height="54" strokeWidth={4} className="fill-accent dark:fill-dark-accent stroke-text-primary dark:stroke-dark-text-primary" />
    <circle cx="22" cy="22" r="10" strokeWidth={4} className="fill-warning dark:fill-dark-warning stroke-text-primary dark:stroke-dark-text-primary" />
    <path
      d="M16 48 H44 A8 8 0 0 0 44 32 A11 11 0 0 0 23 30 A8 8 0 0 0 16 40 A8 8 0 0 0 16 48 Z"
      strokeWidth={4}
      strokeLinejoin="round"
      className="fill-bg dark:fill-dark-bg stroke-text-primary dark:stroke-dark-text-primary"
    />
  </svg>
);

export default Logo;
