import React, { ReactNode } from 'react';

interface WeatherInfoCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  detail?: ReactNode;
  className?: string;
}

const WeatherInfoCard: React.FC<WeatherInfoCardProps> = ({
  label,
  value,
  unit = '',
  detail,
  className = ''
}) => {
  return (
    <div className={`border-2 border-text-primary dark:border-dark-text-primary p-3 ${className}`}>
      <span className="block text-text-secondary dark:text-dark-text-secondary font-medium">
        {label}
      </span>
      <span className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
        {value}{unit}
      </span>
      {detail && (
        <span className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
          {detail}
        </span>
      )}
    </div>
  );
};

export default WeatherInfoCard;
