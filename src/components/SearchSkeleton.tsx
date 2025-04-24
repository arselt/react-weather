import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SearchSkeleton: React.FC = () => {
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const baseColor = isDarkMode ? 'var(--color-dark-surface)' : 'var(--color-surface)';
  const highlightColor = isDarkMode ? 'var(--color-dark-border)' : 'var(--color-border)';
  const borderColor = isDarkMode ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)';
  const shadowColor = isDarkMode 
    ? '5px 5px 0px 0px rgba(255,255,255,0.5)'
    : '5px 5px 0px 0px rgba(0,0,0,0.8)';

  return (
    <div className="mb-6 flex justify-center w-full">
      <SkeletonTheme 
        baseColor={baseColor} 
        highlightColor={highlightColor}
        borderRadius={0}
      >
        <div 
          className="flex w-full max-w-md"
          style={{ boxShadow: shadowColor }}
        >
          <Skeleton 
            height={48} 
            width="70%" 
            style={{ border: `2px solid ${borderColor}` }}
          />
          <Skeleton 
            height={48} 
            width="30%" 
            style={{ 
              border: `2px solid ${borderColor}`,
              borderLeft: 'none'
            }}
          />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default SearchSkeleton; 