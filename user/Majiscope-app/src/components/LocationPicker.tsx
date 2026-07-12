import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { getLocation, getLocationDetails } from '../services/LocationService';
import { Coordinates } from '../types';
import { COLORS } from '../utils/constants';
import DraggableLocationMap from './DraggableLocationMap';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface LocationSuggestion {
    name: string;
    lat: number;
    lng: number;
    displayName: string;
}

interface LocationPickerProps {
    location: Coordinates | null;
    onLocationSelected: (location: Coordinates) => void;
    disabled?: boolean;
}

export default function LocationPicker({ location, onLocationSelected, disabled }: LocationPickerProps) {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Search for locations using Nominatim API (OpenStreetMap)
    const searchLocations = useCallback(async (query: string) => {
        if (!query.trim() || query.length < 2) {
            setSuggestions([]);
            return;
        }

        setSearchLoading(true);
        try {
            // Add Tanzania constraint to search
            const searchQuery = query.includes('Tanzania') ? query : `${query}, Tanzania`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=tz&limit=10`,
                {
                    headers: {
                        'User-Agent': 'MajiScope-App/1.0',
                    },
                }
            );

            if (!response.ok) throw new Error('Search failed');
            
            const results = await response.json();
            const mapped = results.map((item: any) => ({
                name: item.name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                displayName: item.display_name,
            }));
            
            setSuggestions(mapped);
        } catch (error) {
            console.warn('Geocoding search error:', error);
            setSuggestions([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const handleGetCurrentLocation = async () => {
        setLoading(true);
        try {
            const coords = await getLocation();
            onLocationSelected(coords);
            setShowMap(true);
            setShowSuggestions(false);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to get location');
            setShowMap(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSuggestionSelected = (suggestion: LocationSuggestion) => {
        const coords: Coordinates = {
            latitude: suggestion.lat,
            longitude: suggestion.lng,
            accuracy: null,
        };
        onLocationSelected(coords);
        setSearchText(suggestion.name);
        setShowSuggestions(false);
        setSuggestions([]);
        setShowMap(true);
    };

    const handleLocationAdjusted = (coords: Coordinates) => {
        onLocationSelected(coords);
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        if (text.length > 1) {
            setShowSuggestions(true);
            searchLocations(text);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Search field */}
            <View style={styles.searchWrapper}>
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search any street or location in Tanzania..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={searchText}
                        onChangeText={handleSearchChange}
                        editable={!disabled}
                    />
                    {searchLoading && <ActivityIndicator size="small" color={COLORS.primary} style={styles.searchActivityIndicator} />}
                </View>
            </View>

            {/* Search suggestions dropdown - rendered inline BEFORE other content */}
            {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsDropdown}>
                    {suggestions.map((item) => (
                        <TouchableOpacity 
                            key={`${item.lat}-${item.lng}`}
                            style={styles.suggestionItem}
                            onPress={() => handleLocationSuggestionSelected(item)}
                        >
                            <MaterialIcons name="location-on" size={16} color={COLORS.primary} />
                            <View style={styles.suggestionTextContainer}>
                                <Text style={styles.suggestionText}>{item.name}</Text>
                                <Text style={styles.suggestionSubText}>{item.displayName.substring(0, 50)}...</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {showSuggestions && searchLoading && suggestions.length === 0 && (
                <View style={styles.suggestionsDropdown}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color={COLORS.primary} />
                        <Text style={styles.loadingText}>Searching locations...</Text>
                    </View>
                </View>
            )}

            {/* Get current location button */}
            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled, location && styles.buttonSecondary]}
                onPress={handleGetCurrentLocation}
                disabled={disabled || loading}
            >
                {loading ? (
                    <ActivityIndicator color={location ? COLORS.primary : COLORS.white} />
                ) : (
                    <>
                        <MaterialIcons 
                            name={location ? "my-location" : "location-on"} 
                            size={18} 
                            color={location ? COLORS.primary : COLORS.white} 
                        />
                        <Text style={[styles.buttonText, location && styles.buttonTextSecondary]}>
                            {location ? 'Update Location' : 'Use Current Location'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Map - shown inline when location is set */}
            {location && showMap && (
                <View style={styles.mapWrapper}>
                    <DraggableLocationMap 
                        location={location}
                        onLocationChange={handleLocationAdjusted}
                        addressLabel={searchText || undefined}
                    />
                </View>
            )}

            {/* Coordinates display */}
            {location && (
                <View style={styles.coordsInfo}>
                    <Text style={styles.coordsLabel}>
                        📍 {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        gap: 10,
    },
    searchWrapper: {
        zIndex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: COLORS.light,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gray + '30',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: COLORS.dark,
    },
    searchActivityIndicator: {
        marginLeft: 8,
    },
    suggestionsDropdown: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray + '20',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        marginTop: 4,
        marginHorizontal: 0,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray + '10',
        gap: 10,
    },
    suggestionTextContainer: {
        flex: 1,
        gap: 2,
    },
    suggestionText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.dark,
    },
    suggestionSubText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 20,
        gap: 8,
    },
    loadingText: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    buttonSecondary: {
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '600',
    },
    buttonTextSecondary: {
        color: COLORS.primary,
    },
    mapWrapper: {
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.gray + '20',
    },
    coordsInfo: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: COLORS.light,
        borderRadius: 8,
    },
    coordsLabel: {
        fontSize: 13,
        color: COLORS.dark,
        fontFamily: 'Courier New',
    },
});
