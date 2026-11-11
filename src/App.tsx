import { useEffect, useState } from "react";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer";
import CurrentWeather from "./components/Weather/CurrentWeather";
import SearchBar, { SEARCH_INPUT_ID } from "./components/SearchBar";
import CityChips from "./components/CityChips";
import { useCityStore } from "./store/cityStore";
import { useRecentCitiesStore } from "./store/recentCitiesStore";
import { useFavoriteCitiesStore } from "./store/favoriteCitiesStore";
import { useWeatherStore } from "./store/weatherStore";
import { getCurrentPosition } from "./services/geolocation";
import { analyticsService } from "./services/analyticsService";

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

function App() {
  const city = useCityStore((state) => state.city);
  const setCity = useCityStore((state) => state.setCity);
  const recentCities = useRecentCitiesStore((state) => state.cities);
  const favoriteCities = useFavoriteCitiesStore((state) => state.cities);
  const [isLocating, setIsLocating] = useState(false);

  // Load the last searched city on startup, and track the page view
  useEffect(() => {
    analyticsService.pageView('/', 'Weather App Homepage');
    void useWeatherStore.getState().loadWeather({ type: 'city', city: useCityStore.getState().city });
  }, []);

  // "/" jumps to the search box, unless the user is already typing somewhere
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !isTypingTarget(event.target)) {
        event.preventDefault();
        document.getElementById(SEARCH_INPUT_ID)?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (newCity: string) => {
    setCity(newCity);
    void useWeatherStore.getState().loadWeather({ type: 'city', city: newCity });
  };

  const handleLocate = async () => {
    setIsLocating(true);
    try {
      const { lat, lon } = await getCurrentPosition();
      await useWeatherStore.getState().loadWeather({ type: 'coords', lat, lon });
    } catch (error) {
      useWeatherStore.getState().setError(
        error instanceof Error ? error.message : 'Could not determine your location.',
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg dark:bg-dark-bg">
      <Header />
      <main className="flex-grow px-4 py-8 text-text-primary dark:text-dark-text-primary">
        {/* One column on mobile; sidebar + weather side by side from lg up */}
        <div className="mx-auto w-full max-w-6xl grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
            <SearchBar
              initialCity={city}
              onSearch={handleSearch}
              onLocate={handleLocate}
              isLocating={isLocating}
            />
            <CityChips label="Favorites" cities={favoriteCities} onSelect={handleSearch} />
            <CityChips label="Recent" cities={recentCities} onSelect={handleSearch} />
          </aside>

          <div className="min-w-0">
            <CurrentWeather />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
