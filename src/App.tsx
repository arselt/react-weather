import { useEffect, useState } from "react";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer";
import CurrentWeather from "./components/Weather/CurrentWeather";
import SearchBar from "./components/SearchBar";
import RecentCities from "./components/RecentCities";
import { useCityStore } from "./store/cityStore";
import { useRecentCitiesStore } from "./store/recentCitiesStore";
import { useWeatherStore } from "./store/weatherStore";
import { getCurrentPosition } from "./services/geolocation";
import { analyticsService } from "./services/analyticsService";

function App() {
  const city = useCityStore((state) => state.city);
  const setCity = useCityStore((state) => state.setCity);
  const recentCities = useRecentCitiesStore((state) => state.cities);
  const [isLocating, setIsLocating] = useState(false);

  // Load the last searched city on startup, and track the page view
  useEffect(() => {
    analyticsService.pageView('/', 'Weather App Homepage');
    void useWeatherStore.getState().loadWeather({ type: 'city', city: useCityStore.getState().city });
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
      <main className="flex-grow flex flex-col px-4 py-8 text-text-primary dark:text-dark-text-primary">
        <div className="max-w-3xl mx-auto w-full">
          <SearchBar
            initialCity={city}
            onSearch={handleSearch}
            onLocate={handleLocate}
            isLocating={isLocating}
          />
          <RecentCities cities={recentCities} onSelect={handleSearch} />
          <CurrentWeather />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
