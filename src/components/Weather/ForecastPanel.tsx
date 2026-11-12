import React from 'react';
import type { DailyForecast } from '../../types/weather';
import { formatDayLabel, getWeatherIconUrl } from '../../utils/weather';
import { useTranslation } from '../../i18n/useTranslation';

interface ForecastPanelProps {
  days: DailyForecast[];
  unitSymbol: string;
}

const ForecastPanel: React.FC<ForecastPanelProps> = ({ days, unitSymbol }) => {
  const { t, locale } = useTranslation();

  if (days.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-extrabold text-text-primary dark:text-dark-text-primary mb-3">
        {t('weather.forecast')}
      </h3>
      <ul className="grid grid-cols-5 gap-2">
        {days.map((day, index) => (
          <li
            key={day.dateKey}
            className="flex flex-col items-center gap-1 p-2 bg-bg dark:bg-dark-bg border-2 border-text-primary dark:border-dark-text-primary text-center"
          >
            <span className="text-sm font-bold text-text-primary dark:text-dark-text-primary">
              {index === 0 ? t('day.today') : formatDayLabel(day.dateKey, locale)}
            </span>
            <img
              src={getWeatherIconUrl(day.icon)}
              alt={day.description}
              width={48}
              height={48}
              className="w-12 h-12 bg-accent dark:bg-dark-accent border-2 border-text-primary dark:border-dark-text-primary"
            />
            <span className="font-extrabold text-text-primary dark:text-dark-text-primary">
              {Math.round(day.maxTemp)}{unitSymbol}
            </span>
            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
              {Math.round(day.minTemp)}{unitSymbol}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForecastPanel;
