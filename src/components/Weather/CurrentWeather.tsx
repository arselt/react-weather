import React from 'react';
import { useWeatherStore } from '../../store/weatherStore';
import { useUnitsStore } from '../../store/unitsStore';
import { useFavoriteCitiesStore } from '../../store/favoriteCitiesStore';
import { formatCityTime, formatDaylight, getWindDirection } from '../../utils/weather';
import { useTranslation } from '../../i18n/useTranslation';
import WeatherSkeleton from './WeatherSkeleton';
import ErrorMessage from '../ui/ErrorMessage';
import WeatherInfoCard from './WeatherInfoCard';
import MainWeatherCard from './MainWeatherCard';
import ForecastPanel from './ForecastPanel';
import HourlyForecast from './HourlyForecast';
import AirQualityCard from './AirQualityCard';
import SunPath from './SunPath';
import WindArrow from './WindArrow';

const FavoriteButton: React.FC<{ city: string }> = ({ city }) => {
  const { t } = useTranslation();
  const cities = useFavoriteCitiesStore((state) => state.cities);
  const toggleCity = useFavoriteCitiesStore((state) => state.toggleCity);
  const isFavorite = cities.some((item) => item.toLowerCase() === city.toLowerCase());

  return (
    <button
      type="button"
      onClick={() => toggleCity(city)}
      aria-pressed={isFavorite}
      className={`shrink-0 px-3 py-1 font-bold border-2 border-text-primary dark:border-dark-text-primary brutal-shadow
                  hover:translate-y-[-2px] transition-transform
                  ${isFavorite
                    ? 'bg-warning dark:bg-dark-warning text-text-primary dark:text-dark-bg'
                    : 'bg-bg dark:bg-dark-bg text-text-primary dark:text-dark-text-primary'}`}
    >
      {isFavorite ? t('weather.saved') : t('weather.save')}
    </button>
  );
};

const CurrentWeather: React.FC = () => {
  const { currentWeather, forecast, hourly, airQuality, loading, error, query, updatedAt, refreshCurrentWeather } = useWeatherStore();
  const { unitSymbol, unit } = useUnitsStore();
  const { t, locale } = useTranslation();

  if (loading) {
    return <WeatherSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={t(error)} onRetry={query ? refreshCurrentWeather : undefined} />;
  }

  if (!currentWeather) {
    return (
      <p className="py-12 text-center font-medium text-text-secondary dark:text-dark-text-secondary">
        {t('weather.empty')}
      </p>
    );
  }

  const { main, weather, name, sys, dt, wind, timezone } = currentWeather;
  const windSpeedUnit = unit === 'metric' ? ' m/s' : ' mph';

  return (
    // @container: the children adapt to this panel's width, not the window's
    <section className="@container animate-fade-in bg-surface dark:bg-dark-surface border-2 border-text-primary dark:border-dark-text-primary p-6 w-full brutal-shadow">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h2 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary mb-2">
          {name}, {sys.country}
        </h2>
        <FavoriteButton city={name} />
      </div>

      {updatedAt && (
        <div className="mb-2 flex flex-wrap items-center gap-3 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
          <span>{t('weather.updated', { time: new Date(updatedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) })}</span>
          <button
            type="button"
            onClick={() => void refreshCurrentWeather()}
            className="px-2 py-1 font-bold text-text-primary dark:text-dark-text-primary bg-bg dark:bg-dark-bg border-2 border-text-primary dark:border-dark-text-primary hover:translate-y-[-2px] transition-transform"
          >
            {t('weather.refresh')}
          </button>
        </div>
      )}

      <MainWeatherCard
        range={forecast[0] ? { high: forecast[0].maxTemp, low: forecast[0].minTemp } : undefined}
        temp={main.temp}
        description={weather[0].description}
        iconCode={weather[0].icon}
        unitSymbol={unitSymbol}
        timestamp={dt}
        timezone={timezone}
      />

      <div className="grid grid-cols-2 gap-4 mt-4 @md:grid-cols-3">
        <WeatherInfoCard label={t('weather.feelsLike')} value={Math.round(main.feels_like)} unit={unitSymbol} />
        <WeatherInfoCard label={t('weather.humidity')} value={main.humidity} unit="%" />
        <WeatherInfoCard
          label={t('weather.wind')}
          value={wind.speed}
          unit={windSpeedUnit}
          detail={wind.deg !== undefined && (
            <span className="inline-flex items-center gap-2">
              <WindArrow degrees={wind.deg} />
              {getWindDirection(wind.deg)}
            </span>
          )}
        />
        <WeatherInfoCard label={t('weather.pressure')} value={main.pressure} unit=" hPa" />
        <WeatherInfoCard
          label={t('weather.sunrise')}
          value={formatCityTime(sys.sunrise, timezone, locale)}
          detail={t('weather.daylight', { duration: formatDaylight(sys.sunrise, sys.sunset) })}
        />
        <WeatherInfoCard label={t('weather.sunset')} value={formatCityTime(sys.sunset, timezone, locale)} />
      </div>

      <SunPath now={dt} sunrise={sys.sunrise} sunset={sys.sunset} timezone={timezone} />

      <HourlyForecast hours={hourly} timezone={timezone} unitSymbol={unitSymbol} />
      <ForecastPanel days={forecast} unitSymbol={unitSymbol} />
      {airQuality && <AirQualityCard airQuality={airQuality} />}
    </section>
  );
};

export default CurrentWeather;
