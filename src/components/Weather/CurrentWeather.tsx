import React from 'react';
import { useWeatherStore } from '../../store/weatherStore';
import { useUnitsStore } from '../../store/unitsStore';
import { formatCityTime, getWindDirection } from '../../utils/weather';
import WeatherSkeleton from './WeatherSkeleton';
import ErrorMessage from '../ui/ErrorMessage';
import WeatherInfoCard from './WeatherInfoCard';
import MainWeatherCard from './MainWeatherCard';
import ForecastPanel from './ForecastPanel';

const CurrentWeather: React.FC = () => {
  const { currentWeather, forecast, loading, error, query, refreshCurrentWeather } = useWeatherStore();
  const { unitSymbol, unit } = useUnitsStore();

  if (loading) {
    return <WeatherSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={query ? refreshCurrentWeather : undefined} />;
  }

  if (!currentWeather) {
    return (
      <p className="py-12 text-center font-medium text-text-secondary dark:text-dark-text-secondary">
        Search for a city or use your location to see the weather.
      </p>
    );
  }

  const { main, weather, name, sys, dt, wind, timezone } = currentWeather;
  const windSpeedUnit = unit === 'metric' ? ' m/s' : ' mph';

  return (
    <section className="bg-surface dark:bg-dark-surface border-2 border-text-primary dark:border-dark-text-primary p-6 w-full brutal-shadow">
      <h2 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary mb-2">
        {name}, {sys.country}
      </h2>

      <MainWeatherCard
        temp={main.temp}
        description={weather[0].description}
        iconCode={weather[0].icon}
        unitSymbol={unitSymbol}
        timestamp={dt}
        timezone={timezone}
      />

      <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3">
        <WeatherInfoCard label="Feels like" value={Math.round(main.feels_like)} unit={unitSymbol} />
        <WeatherInfoCard label="Humidity" value={main.humidity} unit="%" />
        <WeatherInfoCard
          label="Wind"
          value={wind.speed}
          unit={windSpeedUnit}
          detail={getWindDirection(wind.deg)}
        />
        <WeatherInfoCard label="Pressure" value={main.pressure} unit=" hPa" />
        <WeatherInfoCard label="Sunrise" value={formatCityTime(sys.sunrise, timezone)} />
        <WeatherInfoCard label="Sunset" value={formatCityTime(sys.sunset, timezone)} />
      </div>

      <ForecastPanel days={forecast} unitSymbol={unitSymbol} />
    </section>
  );
};

export default CurrentWeather;
