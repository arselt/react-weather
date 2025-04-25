# React Weather

React Weather is a web application that fetches weather data from the OpenWeather API. Built with React, TypeScript, and Vite, it provides real-time weather information, allowing users to search for weather by city name or coordinates.

## Features
- Fetches and displays weather data from OpenWeather API
- Support for both metric and imperial units
- Current weather conditions display
- City-based and location-based weather search
- Responsive design for all devices

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/arselt/react-weather.git
   cd react-weather
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Get an API key from [OpenWeather](https://openweathermap.org/api) and create a `.env` file in the project directory:
   ```sh
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
   VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Technologies Used
- React 19
- TypeScript
- Vite
- Axios for API requests
- Zustand for state management
- Tailwind CSS for styling
- React Loading Skeleton for loading states
