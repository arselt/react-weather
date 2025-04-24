import { create } from "zustand";

type TemperatureUnit = 'metric' | 'imperial';

interface UnitsState {
  unit: TemperatureUnit;
  unitSymbol: string;
  toggleUnit: () => void;
  setUnit: (unit: TemperatureUnit) => void;
}

export const useUnitsStore = create<UnitsState>((set, get) => ({
  unit: "metric",
  unitSymbol: "°C",

  setUnit: (unit) => {
    const unitSymbol = unit === "metric" ? "°C" : "°F";
    set({ unit, unitSymbol });
  },

  toggleUnit: () => {
    const current = get().unit;
    const newUnit = current === "metric" ? "imperial" : "metric";
    const unitSymbol = newUnit === "metric" ? "°C" : "°F";
    set({ unit: newUnit, unitSymbol });
  }
})); 