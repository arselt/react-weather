import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface dark:bg-dark-surface border-t-2 border-text-primary dark:border-dark-text-primary shadow-[0_-4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[0_-4px_0px_0px_rgba(255,255,255,0.1)] mt-auto">
      <div className="px-4">
        <div className="flex justify-center items-center py-6 max-w-3xl mx-auto">
          <p className="text-center text-text-secondary dark:text-dark-text-secondary text-balance">
            <span className="font-bold text-text-primary dark:text-dark-text-primary">ClimArselt</span> is a Neo-Brutalist, mobile-first weather app built with React and TypeScript using Vite. Data provided by OpenWeatherMap API via axios. State management with Zustand, skeletons with react-loading-skeleton. Developed by <a href="https://arselt.com" className="text-accent dark:text-dark-accent hover:underline" target="_blank" rel="noopener noreferrer">Arselt</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
