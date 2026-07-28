import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import { Coordinates } from '../types';

type ExtendedAddress = Location.LocationGeocodedAddress & Record<string, string | undefined>;

export interface LocationDetails {
    street?: string;
    district?: string;
    city?: string;
    region?: string;
    country?: string;
    fullAddress: string;
}

export const requestLocationPermission = async (): Promise<boolean> => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
    }
};

export const getLocation = async (): Promise<Coordinates> => {
    try {
        const isEnabled = await checkLocationEnabled();
        if (!isEnabled) {
            showLocationSettingsAlert();
            throw new Error('Location services are disabled. Please enable GPS in settings.');
        }

        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            throw new Error('Location permission denied. Please allow location access in app settings.');
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
            mayShowUserSettingsDialog: true,
        });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy ?? null,
            altitude: location.coords.altitude ?? null,
            altitudeAccuracy: location.coords.altitudeAccuracy ?? null,
            heading: location.coords.heading ?? null,
            speed: location.coords.speed ?? null,
        };
    } catch (error: any) {
        console.error('Location error:', error);

        let errorMessage = 'Unable to get location.';
        if (error.message?.includes('permission')) {
            errorMessage = 'Location permission denied. Please enable it in app settings.';
        } else if (error.message?.includes('disabled')) {
            errorMessage = 'GPS is disabled. Please enable location services.';
        } else if (error.message?.includes('timeout')) {
            errorMessage = 'Location request timed out. Make sure you have a clear GPS signal.';
        } else if (error.message?.includes('unavailable')) {
            errorMessage = 'Location is unavailable right now. Please try again.';
        }

        throw new Error(errorMessage);
    }
};

export const checkLocationEnabled = async (): Promise<boolean> => {
    try {
        return await Location.hasServicesEnabledAsync();
    } catch (error) {
        console.error('Error checking location services:', error);
        return false;
    }
};

export const showLocationSettingsAlert = () => {
    Alert.alert(
        'Location Services Disabled',
        'Please enable location services to report water problems.',
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Open Settings',
                onPress: () => {
                    if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                        return;
                    }

                    Linking.openSettings();
                },
            },
        ]
    );
};

export const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
    const details = await getLocationDetails(latitude, longitude);
    return details.fullAddress;
};

export const getLocationDetails = async (latitude: number, longitude: number): Promise<LocationDetails> => {
    if (!isValidCoordinates(latitude, longitude)) {
        return {
            fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };
    }

    try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
        });

        const rawAddress = reverseGeocode[0] as ExtendedAddress | undefined;
        if (!rawAddress) {
            return {
                fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            };
        }

        const district =
            rawAddress.district ||
            rawAddress.subregion ||
            rawAddress.cityDistrict ||
            rawAddress.neighborhood ||
            rawAddress.locality ||
            rawAddress.area ||
            undefined;

        const city = rawAddress.city || rawAddress.name || undefined;
        const parts = [
            rawAddress.street,
            district,
            city,
            rawAddress.region,
            rawAddress.country,
        ].filter(Boolean) as string[];

        return {
            street: rawAddress.street ?? undefined,
            district,
            city,
            region: rawAddress.region ?? undefined,
            country: rawAddress.country ?? undefined,
            fullAddress: parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };
    } catch (error) {
        console.warn('Reverse geocoding failed:', error);
        return {
            fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };
    }
};

const isValidCoordinates = (latitude: number, longitude: number): boolean =>
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;
