import { createOpenWeatherProxy } from '../lib/openWeatherProxy';

export const handler = createOpenWeatherProxy('forecast');
