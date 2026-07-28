import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { Coordinates } from '../types';

type NativeMapModule = typeof import('react-native-maps');
type MapRegion = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

let MapViewComponent: NativeMapModule['default'] | null = null;
let MarkerComponent: NativeMapModule['Marker'] | null = null;

if (Platform.OS !== 'web') {
    const nativeMaps = require('react-native-maps') as NativeMapModule;
    MapViewComponent = nativeMaps.default;
    MarkerComponent = nativeMaps.Marker;
}

interface DraggableLocationMapProps {
    location: Coordinates;
    onLocationChange: (coords: Coordinates) => void;
    addressLabel?: string | null;
}

const regionFromCoordinates = (coords: Coordinates): MapRegion => {
    const baseDelta = coords.accuracy && coords.accuracy > 0
        ? Math.max(0.004, Math.min(0.05, (coords.accuracy / 111_320) * 8))
        : 0.008;

    return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: baseDelta,
        longitudeDelta: baseDelta,
    };
};

export default function DraggableLocationMap({
    location,
    onLocationChange,
    addressLabel,
}: DraggableLocationMapProps) {
    const mapRef = useRef<any>(null);
    const [mapReady, setMapReady] = useState(false);

    const region = useMemo(() => regionFromCoordinates(location), [location]);

    useEffect(() => {
        if (!mapReady || !mapRef.current || Platform.OS === 'web') {
            return;
        }

        mapRef.current.animateToRegion(region, 250);
    }, [mapReady, region]);

    if (!MapViewComponent || !MarkerComponent) {
        return (
            <View style={styles.webFallback}>
                <Text style={styles.webFallbackTitle}>Map preview is available on the phone app.</Text>
                <Text style={styles.webFallbackText}>
                    Capture the location on-device, then drag the pin to the exact spot before submitting.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.mapCard}>
                <MapViewComponent
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={region}
                    onMapReady={() => setMapReady(true)}
                    showsCompass
                    showsMyLocationButton
                    showsUserLocation
                >
                    <MarkerComponent
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        draggable
                        onDragEnd={(event: any) => {
                            const { latitude, longitude } = event.nativeEvent.coordinate;
                            onLocationChange({
                                ...location,
                                latitude,
                                longitude,
                                accuracy: location.accuracy ?? 10,
                            });
                        }}
                    />
                </MapViewComponent>

                <View style={styles.overlayCard}>
                    <Text style={styles.overlayTitle}>Adjust the exact place</Text>
                    <Text style={styles.overlayText}>
                        Drag the pin if the captured GPS point is close but not exactly on the leakage spot.
                    </Text>
                    {addressLabel ? (
                        <Text style={styles.overlayAddress} numberOfLines={2}>
                            {addressLabel}
                        </Text>
                    ) : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 14,
    },
    mapCard: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#dbeafe',
        backgroundColor: '#eff6ff',
    },
    map: {
        width: '100%',
        height: 280,
    },
    overlayCard: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#eff6ff',
        borderTopWidth: 1,
        borderTopColor: '#bfdbfe',
    },
    overlayTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e3a8a',
        marginBottom: 4,
    },
    overlayText: {
        fontSize: 13,
        lineHeight: 18,
        color: '#1d4ed8',
    },
    overlayAddress: {
        marginTop: 8,
        fontSize: 12,
        lineHeight: 17,
        color: '#1e40af',
        fontWeight: '600',
    },
    webFallback: {
        marginTop: 14,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        backgroundColor: '#eff6ff',
    },
    webFallbackTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e3a8a',
    },
    webFallbackText: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 18,
        color: '#1d4ed8',
    },
});
