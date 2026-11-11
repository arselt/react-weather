import React from 'react';
import type { HourlyForecast as HourlyForecastItem } from '../../types/weather';
import { formatHourLabel, getWeatherIconUrl } from '../../utils/weather';
import { useTranslation } from '../../i18n/useTranslation';

interface HourlyForecastProps {
  hours: HourlyForecastItem[];
  timezone: number;
  unitSymbol: string;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hours, timezone, unitSymbol }) => {
  const { t, locale } = useTranslation();

  if (hours.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-extrabold text-text-primary dark:text-dark-text-primary mb-3">
        {t('weather.hourly')}
      </h3>
      {/* Scrolls sideways on narrow containers, fits in one row on wide ones */}
      <ul className="flex gap-2 overflow-x-auto pb-2 @2xl:grid @2xl:grid-cols-8 @2xl:overflow-visible">
        {hours.map((hour, index) => (
          <li
            key={hour.dt}
            className="flex min-w-[5.5rem] flex-col items-center gap-1 p-2 bg-bg dark:bg-dark-bg border-2 border-text-primary dark:border-dark-text-primary text-center"
          >
            <span className="text-sm font-bold text-text-primary dark:text-dark-text-primary">
              {index === 0 ? t('hour.now') : formatHourLabel(hour.dt, timezone, locale)}
            </span>
            <img
              src={getWeatherIconUrl(hour.icon)}
              alt={hour.description}
              width={48}
              height={48}
              className="w-12 h-12 bg-accent dark:bg-dark-accent border-2 border-text-primary dark:border-dark-text-primary"
            />
            <span className="font-extrabold text-text-primary dark:text-dark-text-primary">
              {Math.round(hour.temp)}{unitSymbol}
            </span>
            <span className="text-xs font-medium text-text-secondary dark:text-dark-text-secondary">
              {t('weather.rain', { chance: hour.precipitationChance })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HourlyForecast;
