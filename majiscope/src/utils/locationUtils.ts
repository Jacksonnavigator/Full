import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp?: number;
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

  if (Platform.OS === 'android') {
    try {
      await Location.enableNetworkProviderAsync();
    } catch (error) {
      console.warn('[Location] Unable to enable Android network provider:', error);
    }
  }

  const lastKnown = await Location.getLastKnownPositionAsync({
    maxAge: 15000,
    requiredAccuracy: 120,
  }).catch(() => null);

  const currentHighest = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
    mayShowUserSettingsDialog: true,
    timeInterval: 1000,
    distanceInterval: 1,
  }).catch(() => null);

  const currentHigh = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
    mayShowUserSettingsDialog: true,
    timeInterval: 1000,
    distanceInterval: 1,
  }).catch(() => null);

  const position = chooseBestLocation(currentHighest, chooseBestLocation(currentHigh, lastKnown));
  if (!position) {
    return null;
  }

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
  };
};

export const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

export const calculateDistanceInMeters = (
  from: Coordinates,
  to: Coordinates
): number => {
  const earthRadiusMeters = 6371e3;

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLng = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
};

export const isWithinRadius = (
  from: Coordinates,
  to: Coordinates,
  radiusMeters: number
): boolean => {
  const distance = calculateDistanceInMeters(from, to);
  return distance <= radiusMeters;
};

const chooseBestLocation = (
  current: Location.LocationObject | null,
  fallback: Location.LocationObject | null
) => {
  if (current && fallback) {
    const currentAccuracy = current.coords.accuracy ?? Number.POSITIVE_INFINITY;
    const fallbackAccuracy = fallback.coords.accuracy ?? Number.POSITIVE_INFINITY;
    if (Math.abs(currentAccuracy - fallbackAccuracy) < 5) {
      return current.timestamp >= fallback.timestamp ? current : fallback;
    }
    return currentAccuracy <= fallbackAccuracy ? current : fallback;
  }

  return current ?? fallback;
};
