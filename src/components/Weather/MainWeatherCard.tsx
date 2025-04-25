import React from 'react';

interface MainWeatherCardProps {
  cityName: string;
  country: string;
  temp: number;
  description: string;
  iconCode: string;
  unitSymbol: string;
  timestamp: number;
}

const MainWeatherCard: React.FC<MainWeatherCardProps> = ({
  temp,
  description,
  iconCode,
  unitSymbol,
  timestamp
}) => {
  // Format the time from timestamp
  const formatLocalTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border-t-2 border-b-2 border-text-primary dark:border-dark-text-primary py-4 my-4">
      <div className="flex items-center justify-between">
        <img
          src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
          alt={description}
          className="w-24 h-24 bg-accent dark:bg-dark-accent p-1 border-2 border-text-primary dark:border-dark-text-primary"
        />
        <div className="text-right">
          <div className="text-6xl font-extrabold text-text-primary dark:text-dark-text-primary">
            {Math.round(temp)}{unitSymbol}
          </div>
          <div className="text-text-secondary dark:text-dark-text-secondary text-lg font-medium capitalize">
            {description}
          </div>
          <div className="text-text-secondary dark:text-dark-text-secondary text-lg">
            {formatLocalTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainWeatherCard; 