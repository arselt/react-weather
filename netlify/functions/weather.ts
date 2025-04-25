import { Handler } from '@netlify/functions';
import axios from 'axios';

const handler: Handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Get query parameters
  const params = event.queryStringParameters || {};
  const { city, lat, lon, units = 'metric' } = params;

  // Check if either city or coordinates are provided
  if (!city && (!lat || !lon)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'City or coordinates required' }),
    };
  }

  try {
    // Create query parameters for OpenWeather API
    const apiParams: Record<string, string> = {
      appid: process.env.OPENWEATHER_API_KEY!, // The API key from environment variables
      units,
    };

    // Add either city or coordinates to the parameters
    if (city) {
      apiParams.q = city;
    } else if (lat && lon) {
      apiParams.lat = lat;
      apiParams.lon = lon;
    }

    // Make the request to OpenWeather API
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: apiParams,
    });

    // Return the weather data
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    // Check if it's an Axios error with a response
    if (axios.isAxiosError(error) && error.response) {
      // If the OpenWeather API returns 404, pass it through
      if (error.response.status === 404) {
        return {
          statusCode: 404,
          body: JSON.stringify({ 
            error: 'Location not found',
            details: error.response.data
          }),
        };
      }
      
      // Handle other API errors with their original status code
      return {
        statusCode: error.response.status,
        body: JSON.stringify({ 
          error: error.response.statusText,
          details: error.response.data
        }),
      };
    }
    
    // Handle other unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler }; 