import axios from 'axios';
import { useUnitsStore } from '../../store/unitsStore';

// Create a base axios instance with common configuration
const createApiClient = (unit: string = 'metric') => {
  // For local development, use a different base URL
  const isLocalDev = import.meta.env.DEV;
  const baseURL = isLocalDev 
    ? 'https://api.openweathermap.org/data/2.5' 
    : '/.netlify/functions';

  // If in development, include the API key in requests
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

// Export a function that returns an API client with the current unit setting
export const getApiClient = () => {
  const unit = useUnitsStore.getState().unit;
  return createApiClient(unit);
};

// Export a default client that uses metric as fallback
export default createApiClient();
