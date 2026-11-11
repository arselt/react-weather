import React from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { useUnitsStore } from '../store/unitsStore';
import { useTranslation } from '../i18n/useTranslation';
import { getWeatherIconUrl } from '../utils/weather';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const { unitSymbol } = useUnitsStore();

  return (
    <header className="w-full bg-surface dark:bg-dark-surface border-b-2 border-text-primary dark:border-dark-text-primary shadow-[0_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0px_0px_rgba(255,255,255,0.1)]">
      <div className="px-4">
        <div className="max-w-6xl mx-auto py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary tracking-tight">
              ClimArselt
            </h1>
            <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
              {t('header.tagline')}
            </p>
          </div>

          {currentWeather && (
            <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-bg dark:bg-dark-bg border-2 border-text-primary dark:border-dark-text-primary brutal-shadow">
              <img
                src={getWeatherIconUrl(currentWeather.weather[0].icon)}
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 bg-accent dark:bg-dark-accent border-2 border-text-primary dark:border-dark-text-primary"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary">
                  {t('header.now', { city: currentWeather.name })}
                </p>
                <p className="text-2xl font-extrabold text-text-primary dark:text-dark-text-primary leading-tight">
                  {Math.round(currentWeather.main.temp)}{unitSymbol}
                  <span className="block text-base font-medium capitalize text-text-secondary dark:text-dark-text-secondary">
                    {currentWeather.weather[0].description}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
