import React from 'react';
import { formatCityTime, getWeatherIconUrl } from '../../utils/weather';

interface MainWeatherCardProps {
  temp: number;
  description: string;
  iconCode: string;
  unitSymbol: string;
  timestamp: number;
  timezone: number;
}

const MainWeatherCard: React.FC<MainWeatherCardProps> = ({
  temp,
  description,
  iconCode,
  unitSymbol,
  timestamp,
  timezone,
}) => {
  return (
    <div className="border-t-2 border-b-2 border-text-primary dark:border-dark-text-primary py-4 my-4">
      <div className="flex items-center justify-between">
        <img
          src={getWeatherIconUrl(iconCode)}
          alt={description}
          width={96}
          height={96}
          className="w-24 h-24 bg-accent dark:bg-dark-accent p-1 border-2 border-text-primary dark:border-dark-text-primary"
        />
        <div className="text-right">
          <div className="text-6xl font-extrabold text-text-primary dark:text-dark-text-primary">
            {Math.round(temp)}{unitSymbol}
          </div>
          <div className="text-text-secondary dark:text-dark-text-secondary text-lg font-medium capitalize">
            {description}
          </div>
          <time className="text-text-secondary dark:text-dark-text-secondary text-lg">
            {formatCityTime(timestamp, timezone)}
          </time>
        </div>
      </div>
    </div>
  );
};

export default MainWeatherCard;
