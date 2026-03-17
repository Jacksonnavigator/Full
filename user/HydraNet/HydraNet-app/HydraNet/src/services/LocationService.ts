import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import { Coordinates } from '../types';

export interface LocationDetails {
    street?: string;
    district?: string;
    city?: string;
    region?: string;
    country?: string;
    fullAddress: string;
}

// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
    }
};

// Get current location with enhanced accuracy
export const getLocation = async (): Promise<Coordinates> => {
    try {
        // First check if location services are enabled
        const isEnabled = await checkLocationEnabled();
        if (!isEnabled) {
            showLocationSettingsAlert();
            throw new Error('Location services are disabled. Please enable GPS in settings.');
        }

        const hasPermission = await requestLocationPermission();

        if (!hasPermission) {
            throw new Error('Location permission denied. Please allow location access in app settings.');
        }

        // Get current position with highest accuracy
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest, // Use highest accuracy for best GPS results
            timeInterval: 1000, // Update every second for better accuracy
            mayShowUserSettingsDialog: true, // Show system dialog if needed
            maxAge: 0, // Don't use cached location
            timeout: 10000, // Wait up to 10 seconds for GPS fix
        });

        const coords: Coordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            altitude: location.coords.altitude,
            altitudeAccuracy: location.coords.altitudeAccuracy,
            heading: location.coords.heading,
            speed: location.coords.speed,
        };

        console.log('Location acquired:', {
            latitude: coords.latitude.toFixed(6),
            longitude: coords.longitude.toFixed(6),
            accuracy: coords.accuracy ? coords.accuracy.toFixed(2) + ' meters' : 'N/A',
            timestamp: new Date().toISOString(),
        });

        return coords;
    } catch (error: any) {
        console.error('Location error:', error);

        let errorMessage = 'Unable to get location';
        if (error.message?.includes('permission')) {
            errorMessage = 'Location permission denied. Please enable it in app settings.';
        } else if (error.message?.includes('disabled')) {
            errorMessage = 'GPS is disabled. Please enable location services.';
        } else if (error.message?.includes('timeout')) {
            errorMessage = 'Location request timed out. Make sure you have clear GPS signal.';
        } else if (error.message?.includes('unavailable')) {
            errorMessage = 'Location unavailable. Please check your GPS and try again.';
        }

        throw new Error(errorMessage);
    }
};

// Check if location services are enabled
export const checkLocationEnabled = async (): Promise<boolean> => {
    try {
        const enabled = await Location.hasServicesEnabledAsync();
        return enabled;
    } catch (error) {
        console.error('Error checking location services:', error);
        return false;
    }
};

// Show location settings alert
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
                    } else {
                        Linking.openSettings();
                    }
                }
            }
        ]
    );
};

// Get location name/address from coordinates (Reverse Geocoding)
export const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
    try {
        // Validate coordinates
        if (!isValidCoordinates(latitude, longitude)) {
            console.warn('Invalid coordinates provided:', latitude, longitude);
            return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }

        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (reverseGeocode && reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                
                // Log the full address object for debugging
                console.log('Reverse Geocoded Address:', JSON.stringify(address, null, 2));
                
                // Build a readable location name with prioritization
                const parts: string[] = [];
                
                // Add street-level details if available
                if (address.street) parts.push(address.street);
                if (address.streetNumber) parts.push(address.streetNumber);
                if (address.name) parts.push(address.name);
                
                // Prioritize larger regions over small wards
                // If region exists and is different from city, use region as the main city name
                if (address.region) {
                    parts.push(address.region);
                } else if (address.city) {
                    parts.push(address.city);
                }
                
                // Add subregion if different from region
                if (address.subregion && address.subregion !== address.region) {
                    parts.push(address.subregion);
                }
                
                // Add postal code if available
                if (address.postalCode) parts.push(address.postalCode);
                
                // Add country
                if (address.country) parts.push(address.country);

                // Return the most detailed address available
                if (parts.length > 0) {
                    return parts.join(', ');
                }
                
                // Fallback to formattedAddress if available
                if (address.formattedAddress) {
                    return address.formattedAddress;
                }
            }
        } catch (geocodeError: any) {
            console.warn('Reverse geocoding failed, using coordinates instead:', geocodeError?.message);
        }

        // Return coordinates as fallback
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
        console.error('Error getting location name:', error);
        // Return coordinates as fallback
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
};

// Validate coordinates
const isValidCoordinates = (latitude: number, longitude: number): boolean => {
    return typeof latitude === 'number' && typeof longitude === 'number' && 
           latitude >= -90 && latitude <= 90 && 
           longitude >= -180 && longitude <= 180;
};

// Get detailed location information including district
export const getLocationDetails = async (latitude: number, longitude: number): Promise<LocationDetails> => {
    try {
        // Validate coordinates
        if (!isValidCoordinates(latitude, longitude)) {
            console.warn('Invalid coordinates provided:', latitude, longitude);
            return {
                fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            };
        }

        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (reverseGeocode && reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                
                // Log the full address object for debugging
                console.log('Reverse Geocoded Address:', JSON.stringify(address, null, 2));

                // Try to get district from various field names (different APIs use different names)
                const district = address.district || address.subregion || address.area || address.locality;
                
                // Extract all address components
                const locationDetails: LocationDetails = {
                    street: address.street,
                    district: district,
                    city: address.city || address.name,
                    region: address.region,
                    country: address.country,
                    fullAddress: '',
                };

                // Build full address
                const parts: string[] = [];
                if (address.street) parts.push(address.street);
                if (address.name && address.name !== address.city) parts.push(address.name);
                if (district) parts.push(district);
                if (address.city) parts.push(address.city);
                if (address.region) parts.push(address.region);
                if (address.country) parts.push(address.country);

                locationDetails.fullAddress = parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

                return locationDetails;
            }
        } catch (geocodeError: any) {
            console.warn('Reverse geocoding failed, using coordinates instead:', geocodeError?.message);
        }

        return {
            fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };
    } catch (error) {
        console.error('Error getting location details:', error);
        return {
            fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };
    }
};

// Get formatted location info for display