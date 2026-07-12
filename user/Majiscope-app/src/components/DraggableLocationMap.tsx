import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type { Coordinates } from '../types';

type NativeMapModule = typeof import('react-native-maps');
type MapRegion = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

type OSMMessage = {
    latitude: number;
    longitude: number;
};

let MapViewComponent: NativeMapModule['default'] | null = null;
let MarkerComponent: NativeMapModule['Marker'] | null = null;
const hasGoogleMapsApiKey = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);
const canRenderNativeMap = Platform.OS !== 'android' || hasGoogleMapsApiKey;

if (Platform.OS !== 'web' && canRenderNativeMap) {
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

const createOSMHtml = (latitude: number, longitude: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #dbeafe; touch-action: none; font-family: Arial, sans-serif; }
    #tiles { position: absolute; inset: 0; overflow: hidden; }
    .tile { position: absolute; width: 256px; height: 256px; user-select: none; -webkit-user-drag: none; }
    .pin { position: absolute; width: 38px; height: 38px; margin-left: -19px; margin-top: -38px; z-index: 5; touch-action: none; filter: drop-shadow(0 4px 5px rgba(15, 23, 42, 0.35)); }
    .pin:before { content: ''; position: absolute; width: 38px; height: 38px; border-radius: 50% 50% 50% 0; background: #dc2626; transform: rotate(-45deg); border: 3px solid #fff; box-sizing: border-box; }
    .pin:after { content: ''; position: absolute; left: 13px; top: 13px; width: 12px; height: 12px; border-radius: 50%; background: #fff; }
    .hint { position: absolute; left: 10px; top: 10px; right: 10px; padding: 8px 10px; border-radius: 12px; background: rgba(255, 255, 255, 0.92); color: #1e3a8a; font-size: 12px; font-weight: 700; line-height: 16px; z-index: 4; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.14); }
    .coords { position: absolute; left: 10px; bottom: 10px; padding: 6px 8px; border-radius: 10px; background: rgba(255, 255, 255, 0.92); color: #1d4ed8; font-size: 11px; font-weight: 700; z-index: 4; }
    .attribution { position: absolute; right: 8px; bottom: 8px; padding: 4px 6px; border-radius: 8px; background: rgba(255, 255, 255, 0.88); color: #334155; font-size: 10px; z-index: 4; }
    .zoom { position: absolute; right: 10px; top: 66px; display: flex; flex-direction: column; gap: 6px; z-index: 4; }
    .zoom button { width: 36px; height: 36px; border: 0; border-radius: 10px; background: rgba(255, 255, 255, 0.95); color: #1e3a8a; font-size: 22px; font-weight: 900; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15); }
  </style>
</head>
<body>
  <div id="map">
    <div id="tiles"></div>
    <div class="hint">Hold and drag the red pin to the exact leakage spot. Drag empty map space to move around.</div>
    <div class="zoom"><button id="zoomIn">+</button><button id="zoomOut">-</button></div>
    <div id="pin" class="pin"></div>
    <div id="coords" class="coords"></div>
    <div class="attribution">© OpenStreetMap contributors</div>
  </div>
  <script>
    const tileSize = 256;
    const tileLayer = document.getElementById('tiles');
    const map = document.getElementById('map');
    const pin = document.getElementById('pin');
    const coordsLabel = document.getElementById('coords');
    let zoom = 17;
    let center = { lat: ${latitude}, lon: ${longitude} };
    let marker = { lat: ${latitude}, lon: ${longitude} };
    let startPoint = null;
    let startCenterPoint = null;
    let isMapDragging = false;
    let isPinDragging = false;

    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
    function scaleForZoom(z) { return tileSize * Math.pow(2, z); }
    function latLonToPoint(lat, lon, z) {
      const sinLat = Math.sin(lat * Math.PI / 180);
      const scale = scaleForZoom(z);
      return {
        x: (lon + 180) / 360 * scale,
        y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
      };
    }
    function pointToLatLon(x, y, z) {
      const scale = scaleForZoom(z);
      const lon = x / scale * 360 - 180;
      const mercator = Math.PI - 2 * Math.PI * y / scale;
      const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(mercator) - Math.exp(-mercator)));
      return { lat: clamp(lat, -85.05112878, 85.05112878), lon: clamp(lon, -180, 180) };
    }
    function wrappedTileX(x, maxTiles) { return ((x % maxTiles) + maxTiles) % maxTiles; }
    function getViewport() {
      return { width: map.clientWidth || window.innerWidth, height: map.clientHeight || window.innerHeight };
    }
    function getTopLeftPoint() {
      const viewport = getViewport();
      const centerPoint = latLonToPoint(center.lat, center.lon, zoom);
      return { x: centerPoint.x - viewport.width / 2, y: centerPoint.y - viewport.height / 2 };
    }
    function updateLabel() {
      coordsLabel.textContent = marker.lat.toFixed(6) + ', ' + marker.lon.toFixed(6);
    }
    function positionPin() {
      const topLeft = getTopLeftPoint();
      const markerPoint = latLonToPoint(marker.lat, marker.lon, zoom);
      pin.style.left = Math.round(markerPoint.x - topLeft.x) + 'px';
      pin.style.top = Math.round(markerPoint.y - topLeft.y) + 'px';
      updateLabel();
    }
    function render() {
      const viewport = getViewport();
      const topLeft = getTopLeftPoint();
      const minTileX = Math.floor(topLeft.x / tileSize) - 1;
      const maxTileX = Math.floor((topLeft.x + viewport.width) / tileSize) + 1;
      const minTileY = Math.floor(topLeft.y / tileSize) - 1;
      const maxTileY = Math.floor((topLeft.y + viewport.height) / tileSize) + 1;
      const maxTiles = Math.pow(2, zoom);
      tileLayer.innerHTML = '';

      for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
        for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
          if (tileY < 0 || tileY >= maxTiles) continue;
          const img = document.createElement('img');
          img.className = 'tile';
          img.draggable = false;
          img.src = 'https://tile.openstreetmap.org/' + zoom + '/' + wrappedTileX(tileX, maxTiles) + '/' + tileY + '.png';
          img.style.left = Math.round(tileX * tileSize - topLeft.x) + 'px';
          img.style.top = Math.round(tileY * tileSize - topLeft.y) + 'px';
          tileLayer.appendChild(img);
        }
      }
      positionPin();
    }
    function postLocation() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: marker.lat, longitude: marker.lon }));
    }
    function getClientPoint(event) {
      const touch = event.touches && event.touches.length ? event.touches[0] : event.changedTouches && event.changedTouches.length ? event.changedTouches[0] : event;
      return { x: touch.clientX, y: touch.clientY };
    }
    function eventToMapPoint(event) {
      const point = getClientPoint(event);
      const rect = map.getBoundingClientRect();
      const topLeft = getTopLeftPoint();
      return { x: topLeft.x + point.x - rect.left, y: topLeft.y + point.y - rect.top };
    }
    function beginPinDrag(event) {
      event.preventDefault();
      event.stopPropagation();
      isPinDragging = true;
    }
    function movePinDrag(event) {
      if (!isPinDragging) return;
      event.preventDefault();
      event.stopPropagation();
      const point = eventToMapPoint(event);
      marker = pointToLatLon(point.x, point.y, zoom);
      positionPin();
    }
    function endPinDrag(event) {
      if (!isPinDragging) return;
      event.preventDefault();
      event.stopPropagation();
      isPinDragging = false;
      postLocation();
    }
    function beginMapDrag(event) {
      if (event.target === pin) return;
      event.preventDefault();
      isMapDragging = true;
      startPoint = getClientPoint(event);
      startCenterPoint = latLonToPoint(center.lat, center.lon, zoom);
    }
    function moveMapDrag(event) {
      if (!isMapDragging || !startPoint || !startCenterPoint || isPinDragging) return;
      event.preventDefault();
      const point = getClientPoint(event);
      const nextPoint = {
        x: startCenterPoint.x - (point.x - startPoint.x),
        y: startCenterPoint.y - (point.y - startPoint.y),
      };
      center = pointToLatLon(nextPoint.x, nextPoint.y, zoom);
      render();
    }
    function endMapDrag(event) {
      if (!isMapDragging) return;
      event.preventDefault();
      isMapDragging = false;
    }
    document.getElementById('zoomIn').addEventListener('click', function(event) { event.stopPropagation(); zoom = Math.min(19, zoom + 1); render(); });
    document.getElementById('zoomOut').addEventListener('click', function(event) { event.stopPropagation(); zoom = Math.max(12, zoom - 1); render(); });
    pin.addEventListener('mousedown', beginPinDrag);
    pin.addEventListener('touchstart', beginPinDrag, { passive: false });
    map.addEventListener('mousedown', beginMapDrag);
    map.addEventListener('touchstart', beginMapDrag, { passive: false });
    window.addEventListener('mousemove', function(event) { movePinDrag(event); moveMapDrag(event); });
    window.addEventListener('touchmove', function(event) { movePinDrag(event); moveMapDrag(event); }, { passive: false });
    window.addEventListener('mouseup', function(event) { endPinDrag(event); endMapDrag(event); });
    window.addEventListener('touchend', function(event) { endPinDrag(event); endMapDrag(event); }, { passive: false });
    window.addEventListener('resize', render);
    render();
    setTimeout(render, 250);
  </script>
</body>
</html>
`;export default function DraggableLocationMap({
    location,
    onLocationChange,
    addressLabel,
}: DraggableLocationMapProps) {
    const mapRef = useRef<any>(null);
    const [mapReady, setMapReady] = useState(false);
    const osmHtml = useMemo(() => createOSMHtml(location.latitude, location.longitude), [location.latitude, location.longitude]);
    const region = useMemo(() => regionFromCoordinates(location), [location]);

    useEffect(() => {
        if (!mapReady || !mapRef.current || Platform.OS === 'web') {
            return;
        }

        mapRef.current.animateToRegion(region, 250);
    }, [mapReady, region]);

    const handleOSMMessage = (event: WebViewMessageEvent) => {
        try {
            const nextLocation = JSON.parse(event.nativeEvent.data) as OSMMessage;
            if (Number.isFinite(nextLocation.latitude) && Number.isFinite(nextLocation.longitude)) {
                onLocationChange({
                    ...location,
                    latitude: nextLocation.latitude,
                    longitude: nextLocation.longitude,
                    accuracy: location.accuracy ?? 10,
                });
            }
        } catch (error) {
            console.warn('Failed to parse map location update:', error);
        }
    };

    if (!MapViewComponent || !MarkerComponent) {
        return (
            <View style={styles.wrapper}>
                <View style={styles.mapCard}>
                    <WebView
                        key={`${location.latitude.toFixed(6)}-${location.longitude.toFixed(6)}`}
                        originWhitelist={['*']}
                        source={{ html: osmHtml }}
                        style={styles.map}
                        userAgent="Majiscope/1.0 (com.hydratech.majiscopeuser)"
                        javaScriptEnabled
                        domStorageEnabled
                        onMessage={handleOSMMessage}
                        scrollEnabled={false}
                        bounces={false}
                    />
                    <View style={styles.overlayCard}>
                        <Text style={styles.overlayTitle}>Adjust the exact place</Text>
                        <Text style={styles.overlayText}>
                            Hold the red pin area and drag the map until the pin sits on the reported problem.
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
        backgroundColor: '#dbeafe',
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
});