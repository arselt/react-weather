import type { ReactElement } from 'react';
import { getWeatherIconUrl } from '../utils/weather';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: string; // OpenWeather icon code, e.g. 01d (sun) or 01n (moon)
}

interface SegmentedControlProps<T extends string> {
  id: string;
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const SegmentedControl = <T extends string>({ id, label, options, value, onChange }: SegmentedControlProps<T>): ReactElement => {
  return (
    <div className="flex flex-col gap-2">
      <span id={id} className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{label}</span>
      <div
        role="group"
        aria-labelledby={id}
        className="grid border-2 border-text-primary dark:border-dark-text-primary"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`flex items-center justify-center gap-2 px-3 py-2 font-bold transition-colors
                ${index > 0 ? 'border-l-2 border-text-primary dark:border-dark-text-primary' : ''}
                ${isSelected
                  ? 'bg-accent dark:bg-dark-accent text-text-primary dark:text-dark-bg'
                  : 'bg-bg dark:bg-dark-bg text-text-primary dark:text-dark-text-primary'}`}
            >
              {option.icon && (
                <img
                  src={getWeatherIconUrl(option.icon)}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 bg-accent dark:bg-dark-accent border border-text-primary dark:border-dark-text-primary"
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedControl;
