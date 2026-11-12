import axios from 'axios';
import { useUnitsStore } from '../../store/unitsStore';

// Dev talks to OpenWeather directly with the local key; production goes through the Netlify function
const createApiClient = (unit: string) => {
  const isLocalDev = import.meta.env.DEV;
  const baseURL = isLocalDev
    ? 'https://api.openweathermap.org/data/2.5'
    : '/.netlify/functions';

  const params: Record<string, string> = { units: unit };
  if (isLocalDev) {
    params.appid = import.meta.env.VITE_API_KEY;
  }

  return axios.create({
    baseURL,
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Read the unit at call time so requests always use the current setting
export const getApiClient = () => createApiClient(useUnitsStore.getState().unit);
