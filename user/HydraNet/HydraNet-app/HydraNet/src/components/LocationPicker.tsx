import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getLocation } from '../services/LocationService';
import { Coordinates } from '../types';
import { COLORS } from '../utils/constants';

interface LocationPickerProps {
    location: Coordinates | null;
    onLocationSelected: (location: Coordinates) => void;
}

export default function LocationPicker({ location, onLocationSelected }: LocationPickerProps) {
    const [loading, setLoading] = useState(false);

    const handleGetLocation = async () => {
        setLoading(true);
        try {
            const coords = await getLocation();
            onLocationSelected(coords);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to get location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Location</Text>

            {location ? (
                <View style={styles.locationInfo}>
                    <Text style={styles.coordText}>
                        📍 Lat: {location.latitude.toFixed(6)}
                    </Text>
                    <Text style={styles.coordText}>
                        Lng: {location.longitude.toFixed(6)}
                    </Text>
                    <TouchableOpacity onPress={handleGetLocation} style={styles.updateButton}>
                        <Text style={styles.updateButtonText}>Update Location</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.getLocationButton}
                    onPress={handleGetLocation}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <>
                            <Text style={styles.getLocationText}>📍 Get Current Location</Text>
                        </>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 8,
    },
    locationInfo: {
        backgroundColor: COLORS.light,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.gray + '40',
    },
    coordText: {
        fontSize: 14,
        color: COLORS.dark,
        marginBottom: 4,
    },
    updateButton: {
        marginTop: 12,
        alignSelf: 'flex-start',
    },
    updateButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    getLocationButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    getLocationText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});