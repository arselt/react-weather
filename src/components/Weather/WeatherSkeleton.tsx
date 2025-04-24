import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const WeatherSkeleton: React.FC = () => {
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const baseColor = isDarkMode ? 'var(--color-dark-surface)' : 'var(--color-surface)';
  const highlightColor = isDarkMode ? 'var(--color-dark-border)' : 'var(--color-border)';
  const borderColor = isDarkMode ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)';
  const shadowColor = isDarkMode 
    ? '4px 4px 0px 0px rgba(255,255,255,0.5)'
    : '4px 4px 0px 0px rgba(0,0,0,0.8)';

  return (
    <div className="w-full">
      <SkeletonTheme 
        baseColor={baseColor} 
        highlightColor={highlightColor}
        borderRadius={0}
      >
        <div 
          className="p-6 border-2 border-text-primary dark:border-dark-text-primary bg-surface dark:bg-dark-surface"
          style={{ boxShadow: shadowColor }}
        >
          {/* City name */}
          <Skeleton 
            height={36} 
            width="70%" 
            className="mb-2" 
            style={{ border: `2px solid ${borderColor}` }}
          />
          
          {/* Weather display section */}
          <div className="border-t-2 border-b-2 border-text-primary dark:border-dark-text-primary py-4 my-4">
            <div className="flex items-center justify-between">
              {/* Weather icon */}
              <Skeleton 
                height={96} 
                width={96} 
                style={{ border: `2px solid ${borderColor}` }}
              />
              
              <div className="text-right">
                {/* Temperature */}
                <Skeleton 
                  height={48} 
                  width={120} 
                  style={{ border: `2px solid ${borderColor}` }}
                />
                {/* Weather description */}
                <Skeleton 
                  height={24} 
                  width={100} 
                  style={{ 
                    marginTop: '8px',
                    border: `2px solid ${borderColor}`
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Weather details grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="border-2 border-text-primary dark:border-dark-text-primary p-3">
              <Skeleton 
                height={20} 
                width="80%" 
                style={{ border: `2px solid ${borderColor}` }}
              />
              <Skeleton 
                height={32} 
                width="60%" 
                style={{ 
                  marginTop: '8px',
                  border: `2px solid ${borderColor}`
                }}
              />
            </div>
            <div className="border-2 border-text-primary dark:border-dark-text-primary p-3">
              <Skeleton 
                height={20} 
                width="80%" 
                style={{ border: `2px solid ${borderColor}` }}
              />
              <Skeleton 
                height={32} 
                width="60%" 
                style={{ 
                  marginTop: '8px',
                  border: `2px solid ${borderColor}`
                }}
              />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default WeatherSkeleton; 