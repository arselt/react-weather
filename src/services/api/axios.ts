import axios from 'axios';
import { useUnitsStore } from '../../store/unitsStore';

// Create a base axios instance with common configuration
const createApiClient = (unit: string = 'metric') => {
  return axios.create({
    baseURL: import.meta.env.VITE_OPENWEATHER_BASE_URL,
    params: {
      appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
      units: unit, // Units parameter can be 'metric' or 'imperial'
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Export a function that returns an API client with the current unit setting
export const getApiClient = () => {
  const unit = useUnitsStore.getState().unit;
  return createApiClient(unit);
};

// Export a default client that uses metric as fallback
export default createApiClient(); 