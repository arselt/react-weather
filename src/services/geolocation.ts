export interface Coordinates {
  lat: number;
  lon: number;
}

export type LocationErrorKey = 'error.locationUnsupported' | 'error.locationDenied' | 'error.locationUnavailable';

export class LocationError extends Error {
  constructor(public readonly key: LocationErrorKey) {
    super(key);
  }
}

export const getCurrentPosition = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new LocationError('error.locationUnsupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
      (positionError) => reject(new LocationError(
        positionError.code === positionError.PERMISSION_DENIED ? 'error.locationDenied' : 'error.locationUnavailable',
      )),
      { timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  });
