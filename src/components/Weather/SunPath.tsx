import React from 'react';
import { formatCityTime, getDayProgress, getWeatherIconUrl } from '../../utils/weather';
import { useTranslation } from '../../i18n/useTranslation';

interface SunPathProps {
  now: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

const SunPath: React.FC<SunPathProps> = ({ now, sunrise, sunset, timezone }) => {
  const { t, locale } = useTranslation();
  const progress = getDayProgress(now, sunrise, sunset);
  const isDaytime = now >= sunrise && now <= sunset;

  return (
    <section aria-labelledby="sun-path-title" className="mt-6 p-4 border-2 border-text-primary dark:border-dark-text-primary bg-bg dark:bg-dark-bg">
      <h3 id="sun-path-title" className="text-sm font-extrabold uppercase tracking-wide text-text-primary dark:text-dark-text-primary">
        {t('weather.sunPosition')}
      </h3>

      <div className="relative mt-6 h-3 border-2 border-text-primary dark:border-dark-text-primary bg-surface dark:bg-dark-surface">
        <div
          className="absolute inset-y-0 left-0 bg-accent dark:bg-dark-accent"
          style={{ width: `${progress * 100}%` }}
        />
        {isDaytime && (
          <img
            src={getWeatherIconUrl('01d')}
            alt=""
            width={32}
            height={32}
            className="absolute -top-4 w-8 h-8 -translate-x-1/2 bg-warning dark:bg-dark-warning border-2 border-text-primary dark:border-dark-text-primary"
            style={{ left: `${progress * 100}%` }}
          />
        )}
      </div>

      <div className="mt-4 flex justify-between text-sm font-bold text-text-primary dark:text-dark-text-primary">
        <time dateTime={new Date(sunrise * 1000).toISOString()}>{formatCityTime(sunrise, timezone, locale)}</time>
        <time dateTime={new Date(sunset * 1000).toISOString()}>{formatCityTime(sunset, timezone, locale)}</time>
      </div>
    </section>
  );
};

export default SunPath;
