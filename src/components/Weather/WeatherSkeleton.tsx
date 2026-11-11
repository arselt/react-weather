import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Colors come from the --skeleton-* tokens in index.css, so they follow the app theme
const BLOCK_STYLE = { border: '2px solid var(--skeleton-ink)' };
const STAT_CARD_COUNT = 6;
const FORECAST_DAY_COUNT = 5;

const WeatherSkeleton: React.FC = () => {
  return (
    <div className="w-full" role="status" aria-label="Loading weather">
      <SkeletonTheme
        baseColor="var(--skeleton-base)"
        highlightColor="var(--skeleton-highlight)"
        borderRadius={0}
      >
        <div className="p-6 border-2 border-text-primary dark:border-dark-text-primary bg-surface dark:bg-dark-surface brutal-shadow">
          <Skeleton height={36} width="70%" className="mb-2" style={BLOCK_STYLE} />

          <div className="border-t-2 border-b-2 border-text-primary dark:border-dark-text-primary py-4 my-4">
            <div className="flex items-center justify-between">
              <Skeleton height={96} width={96} style={BLOCK_STYLE} />

              <div className="text-right">
                <Skeleton height={48} width={120} style={BLOCK_STYLE} />
                <Skeleton height={24} width={100} style={{ ...BLOCK_STYLE, marginTop: '8px' }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3">
            {Array.from({ length: STAT_CARD_COUNT }, (_, index) => (
              <div key={index} className="border-2 border-text-primary dark:border-dark-text-primary p-3">
                <Skeleton height={20} width="80%" style={BLOCK_STYLE} />
                <Skeleton height={32} width="60%" style={{ ...BLOCK_STYLE, marginTop: '8px' }} />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Skeleton height={24} width="40%" className="mb-3" style={BLOCK_STYLE} />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: FORECAST_DAY_COUNT }, (_, index) => (
                <Skeleton key={index} height={120} style={BLOCK_STYLE} />
              ))}
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default WeatherSkeleton;
