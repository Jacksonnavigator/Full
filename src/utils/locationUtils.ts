import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const getCurrentLocation = async (): Promise<Coordinates | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    return null;
  }

  const position = await Location.getCurrentPositionAsync({});
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
};

export const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

export const calculateDistanceInMeters = (
  from: Coordinates,
  to: Coordinates
): number => {
  const earthRadiusMeters = 6371e3; // metres

  const φ1 = toRadians(from.latitude);
  const φ2 = toRadians(to.latitude);
  const Δφ = toRadians(to.latitude - from.latitude);
  const Δλ = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusMeters * c;
  return distance;
};

export const isWithinRadius = (
  from: Coordinates,
  to: Coordinates,
  radiusMeters: number
): boolean => {
  const distance = calculateDistanceInMeters(from, to);
  return distance <= radiusMeters;
};

