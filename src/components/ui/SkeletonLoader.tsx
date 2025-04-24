import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkeletonLoaderProps {
  count?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string | number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  width,
  height,
  className = '',
  containerClassName = '',
  borderRadius = 0, // Neo-brutalist design - no border radius
}) => {
  return (
    <SkeletonTheme
      baseColor="var(--color-surface)" 
      highlightColor="var(--color-border)"
      borderRadius={0}
      duration={1.5}
    >
      <div 
        className={`relative ${containerClassName}`} 
        style={{ 
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
        }}
      >
        <Skeleton
          count={count}
          width={width}
          height={height}
          borderRadius={borderRadius}
          className={`${className} border-2 border-text-primary dark:border-dark-text-primary`}
        />
      </div>
    </SkeletonTheme>
  );
};

// Dark mode version
export const DarkSkeletonLoader: React.FC<SkeletonLoaderProps> = (props) => {
  return (
    <SkeletonTheme
      baseColor="var(--color-dark-surface)" 
      highlightColor="var(--color-dark-border)"
      borderRadius={0}
      duration={1.5}
    >
      <div 
        className={`relative ${props.containerClassName}`} 
        style={{ 
          boxShadow: '4px 4px 0px 0px rgba(255,255,255,0.5)',
        }}
      >
        <Skeleton
          count={props.count}
          width={props.width}
          height={props.height}
          borderRadius={props.borderRadius || 0}
          className={`${props.className} border-2 border-dark-text-primary`}
        />
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonLoader; 