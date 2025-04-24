import React, { useState, useEffect } from 'react';
import SearchSkeleton from './SearchSkeleton';
import WeatherSkeleton from './Weather/WeatherSkeleton';

/**
 * This component demonstrates how to use the skeleton loaders
 * in various parts of the application, with a toggle to show
 * loading states.
 */
const LoadingDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Toggle loading state every 3 seconds for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 p-4 border-2 border-text-primary dark:border-dark-text-primary bg-surface dark:bg-dark-surface max-w-md mx-auto">
      <h2 className="text-2xl font-extrabold text-text-primary dark:text-dark-text-primary mb-4">
        Loading States Demo
      </h2>
      
      <div className="mb-4">
        <button 
          onClick={() => setIsLoading(!isLoading)}
          className="px-4 py-2 bg-accent dark:bg-dark-accent text-white font-bold 
                    border-2 border-text-primary dark:border-dark-text-primary 
                    hover:translate-y-[-2px] transition-transform"
        >
          {isLoading ? 'Show Content' : 'Show Skeletons'}
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Search Component
        </h3>
        {isLoading ? <SearchSkeleton /> : (
          <div className="p-2 border-2 border-text-primary dark:border-dark-text-primary">
            Content loaded
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Weather Component
        </h3>
        {isLoading ? <WeatherSkeleton /> : (
          <div className="p-2 border-2 border-text-primary dark:border-dark-text-primary">
            Content loaded
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingDemo; 