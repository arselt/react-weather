import React, { ReactNode } from 'react';

interface WeatherInfoCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
}

const WeatherInfoCard: React.FC<WeatherInfoCardProps> = ({ 
  label, 
  value,
  unit = ''
}) => {
  return (
    <div className="border-2 border-text-primary dark:border-dark-text-primary p-3">
      <span className="block text-text-secondary dark:text-dark-text-secondary font-medium">
        {label}
      </span>
      <span className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
        {value}{unit}
      </span>
    </div>
  );
};

export default WeatherInfoCard; 