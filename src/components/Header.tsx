import { useThemeStore } from "../store/themeStore";
import { useUnitsStore } from "../store/unitsStore";
import { analyticsService } from "../services/analyticsService";

function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { unit, toggleUnit } = useUnitsStore();

  const handleThemeToggle = () => {
    analyticsService.trackButtonClick('theme-toggle', theme === 'light' ? 'switch-to-dark' : 'switch-to-light');
    toggleTheme();
  };

  const handleUnitToggle = () => {
    analyticsService.trackButtonClick('unit-toggle', unit === 'metric' ? 'switch-to-imperial' : 'switch-to-metric');
    toggleUnit();
  };

  return (
    <header className="w-full bg-surface dark:bg-dark-surface border-b-2 border-text-primary dark:border-dark-text-primary shadow-[0_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0px_0px_rgba(255,255,255,0.1)]">
      <div className="px-4">
        <div className="flex justify-between items-center gap-4 py-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary tracking-tight">
            ClimArselt
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleThemeToggle}
              className="px-4 py-2 bg-accent dark:bg-dark-accent text-white font-bold
                        border-2 border-text-primary dark:border-dark-text-primary
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]
                        hover:translate-y-[-2px] transition-transform"
              data-analytics="theme-toggle"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            <button
              onClick={handleUnitToggle}
              className="px-4 py-2 bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary font-bold
                        border-2 border-text-primary dark:border-dark-text-primary
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]
                        hover:translate-y-[-2px] transition-transform"
              data-analytics="unit-toggle"
            >
              {unit === "metric" ? "Switch to °F" : "Switch to °C"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
