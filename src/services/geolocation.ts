export interface Coordinates {
  lat: number;
  lon: number;
}

export const getCurrentPosition = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
      (positionError) => reject(new Error(
        positionError.code === positionError.PERMISSION_DENIED
          ? 'Location access was denied. Allow it in your browser settings or search for a city.'
          : 'Could not determine your location. Try searching for a city.',
      )),
      { timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  });
