const DEFAULT_COORDINATES = {
  latitude: 28.6139,
  longitude: 77.209,
};

const hasValidCoordinates = (coordinates) =>
  Number.isFinite(coordinates?.latitude) &&
  Number.isFinite(coordinates?.longitude);

export const getStoredCoordinates = () => {
  const latitude = Number(sessionStorage.getItem("userLat"));
  const longitude = Number(sessionStorage.getItem("userLng"));

  return hasValidCoordinates({ latitude, longitude })
    ? { latitude, longitude }
    : null;
};

export const saveCoordinates = ({ latitude, longitude }) => {
  if (!hasValidCoordinates({ latitude, longitude })) return null;

  const coordinates = { latitude, longitude };
  sessionStorage.setItem("userLat", String(latitude));
  sessionStorage.setItem("userLng", String(longitude));

  return coordinates;
};

export const getInitialCoordinates = () =>
  getStoredCoordinates() || DEFAULT_COORDINATES;

export const requestCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve(
          saveCoordinates({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        ),
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
