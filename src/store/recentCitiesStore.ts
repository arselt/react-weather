import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addRecentCity } from "../utils/weather";

export const MAX_RECENT_CITIES = 5;

interface RecentCitiesState {
  cities: string[];
  addCity: (city: string) => void;
}

export const useRecentCitiesStore = create<RecentCitiesState>()(
  persist(
    (set, get) => ({
      cities: [],

      addCity: (city: string) => {
        set({ cities: addRecentCity(get().cities, city, MAX_RECENT_CITIES) });
      },
    }),
    {
      name: "recent-cities",
    }
  )
);
