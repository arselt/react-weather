import React from 'react';
import { useWeatherStore } from '../../store/weatherStore';
import { useUnitsStore } from '../../store/unitsStore';
import { useFavoriteCitiesStore } from '../../store/favoriteCitiesStore';
import { formatCityTime, formatDaylight, getWindDirection } from '../../utils/weather';
import WeatherSkeleton from './WeatherSkeleton';
import ErrorMessage from '../ui/ErrorMessage';
import WeatherInfoCard from './WeatherInfoCard';
import MainWeatherCard from './MainWeatherCard';
import ForecastPanel from './ForecastPanel';
import HourlyForecast from './HourlyForecast';
import AirQualityCard from './AirQualityCard';

const FavoriteButton: React.FC<{ city: string }> = ({ city }) => {
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
      {isFavorite ? 'Saved' : 'Save city'}
    </button>
  );
};

const CurrentWeather: React.FC = () => {
  const { currentWeather, forecast, hourly, airQuality, loading, error, query, refreshCurrentWeather } = useWeatherStore();
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
    // @container: the children adapt to this panel's width, not the window's
    <section className="@container bg-surface dark:bg-dark-surface border-2 border-text-primary dark:border-dark-text-primary p-6 w-full brutal-shadow">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary mb-2">
          {name}, {sys.country}
        </h2>
        <FavoriteButton city={name} />
      </div>

      <MainWeatherCard
        temp={main.temp}
        description={weather[0].description}
        iconCode={weather[0].icon}
        unitSymbol={unitSymbol}
        timestamp={dt}
        timezone={timezone}
      />

      <div className="grid grid-cols-2 gap-4 mt-4 @md:grid-cols-3">
        <WeatherInfoCard label="Feels like" value={Math.round(main.feels_like)} unit={unitSymbol} />
        <WeatherInfoCard label="Humidity" value={main.humidity} unit="%" />
        <WeatherInfoCard
          label="Wind"
          value={wind.speed}
          unit={windSpeedUnit}
          detail={getWindDirection(wind.deg)}
        />
        <WeatherInfoCard label="Pressure" value={main.pressure} unit=" hPa" />
        <WeatherInfoCard
          label="Sunrise"
          value={formatCityTime(sys.sunrise, timezone)}
          detail={`Daylight ${formatDaylight(sys.sunrise, sys.sunset)}`}
        />
        <WeatherInfoCard label="Sunset" value={formatCityTime(sys.sunset, timezone)} />
      </div>

      <HourlyForecast hours={hourly} timezone={timezone} unitSymbol={unitSymbol} />
      <ForecastPanel days={forecast} unitSymbol={unitSymbol} />
      {airQuality && <AirQualityCard airQuality={airQuality} />}
    </section>
  );
};

export default CurrentWeather;
