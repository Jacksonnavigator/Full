(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/maps/operations-map-impl.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OperationsMapImpl",
    ()=>OperationsMapImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/CircleMarker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/GeoJSON.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pinned.js [app-client] (ecmascript) <export default as MapPinned>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-client] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const DEFAULT_CENTER = [
    -6.369,
    34.8888
];
const NATIONAL_BOUNDARY_ZOOM = 8;
const DMA_BOUNDARY_STYLE = {
    color: "#f04e23",
    fillColor: "#f97316"
};
const DEFAULT_BOUNDARY_STYLE = {
    utility: {
        color: "#0284c7",
        fillColor: "#0ea5e9"
    },
    dma: DMA_BOUNDARY_STYLE
};
const networkLayerCache = new Map();
const pendingNetworkLayerLoads = new Map();
const BASEMAPS = {
    street: {
        label: "Street",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
        label: "Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
    }
};
async function loadNetworkLayer(url, token) {
    const cachedLayer = networkLayerCache.get(url);
    if (cachedLayer) return cachedLayer;
    const pendingLoad = pendingNetworkLayerLoads.get(url);
    if (pendingLoad) return pendingLoad;
    const loadPromise = fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].backend.baseUrl}${url}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(async (response)=>{
        const payload = await response.json().catch(()=>({}));
        if (!response.ok) {
            throw new Error(payload?.detail || payload?.error || "A utility pipe network preview could not be loaded.");
        }
        const layer = payload;
        networkLayerCache.set(url, layer);
        return layer;
    }).finally(()=>{
        pendingNetworkLayerLoads.delete(url);
    });
    pendingNetworkLayerLoads.set(url, loadPromise);
    return loadPromise;
}
function flattenCoordinates(input, target) {
    if (!input) return;
    if (Array.isArray(input) && input.length >= 2 && typeof input[0] === "number" && typeof input[1] === "number") {
        target.push([
            Number(input[1]),
            Number(input[0])
        ]);
        return;
    }
    if (Array.isArray(input)) {
        input.forEach((item)=>flattenCoordinates(item, target));
    }
}
function collectGeoJsonCoordinates(geojson) {
    const points = [];
    if (!geojson) return points;
    const visitGeometry = (geometry)=>{
        if (!geometry) return;
        if (geometry.type === "GeometryCollection" && Array.isArray(geometry.geometries)) {
            geometry.geometries.forEach(visitGeometry);
            return;
        }
        if ("coordinates" in geometry) {
            flattenCoordinates(geometry.coordinates, points);
        }
    };
    if (geojson.type === "FeatureCollection") {
        ;
        geojson.features.forEach((feature)=>visitGeometry(feature?.geometry));
    } else if (geojson.type === "Feature") {
        visitGeometry(geojson.geometry);
    } else {
        visitGeometry(geojson);
    }
    return points;
}
function getStatusMeta(status) {
    if (status === "pending_approval") {
        return {
            label: "Awaiting approval",
            fill: "#7c3aed",
            stroke: "#5b21b6"
        };
    }
    if (status === "approved" || status === "closed") {
        return {
            label: status === "closed" ? "Closed" : "Repaired",
            fill: "#15803d",
            stroke: "#166534"
        };
    }
    return {
        label: "Open",
        fill: "#be123c",
        stroke: "#881337"
    };
}
function getLocationLabel(report) {
    if (report.address?.trim()) return report.address;
    if (report.districtName?.trim() && report.regionName?.trim()) {
        return `${report.districtName}, ${report.regionName}`;
    }
    if (report.districtName?.trim()) return report.districtName;
    if (report.dmaName?.trim()) return report.dmaName;
    return `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`;
}
function escapeHtml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function formatPropertyLabel(key) {
    const normalized = key.replace(/_/g, " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
    const aliases = {
        intdiammm: "Internal Diameter (mm)",
        nomdiaminc: "Nominal Diameter (in)",
        pipepurpos: "Pipe Purpose",
        pipelength: "Pipe Length",
        zonelocati: "Zone",
        source_table: "Layer"
    };
    return aliases[key] || normalized;
}
function collectGeometryCoordinates(geometry) {
    const points = [];
    if (!geometry) return points;
    const visit = (coordinates)=>{
        if (!coordinates) return;
        if (Array.isArray(coordinates) && coordinates.length >= 2 && typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
            points.push([
                Number(coordinates[1]),
                Number(coordinates[0])
            ]);
            return;
        }
        if (Array.isArray(coordinates)) {
            coordinates.forEach((item)=>visit(item));
        }
    };
    if (geometry.type === "GeometryCollection") {
        geometry.geometries?.forEach((item)=>{
            if ("coordinates" in item) visit(item.coordinates);
        });
    } else if ("coordinates" in geometry) {
        visit(geometry.coordinates);
    }
    return points;
}
function buildNetworkPopupHtml(feature) {
    const geometryPoints = collectGeometryCoordinates(feature.geometry);
    const startPoint = geometryPoints[0];
    const endPoint = geometryPoints[geometryPoints.length - 1];
    const rawProperties = feature.properties;
    const entries = Object.entries(rawProperties && typeof rawProperties === "object" ? rawProperties : {}).filter(([key, value])=>value !== null && value !== "" && key !== "style");
    const prioritizedKeys = [
        "assetid",
        "name",
        "material",
        "condition",
        "intdiammm",
        "nomdiaminc",
        "pipepurpos",
        "status",
        "location",
        "zonelocati",
        "source_table"
    ];
    entries.sort((left, right)=>{
        const leftRank = prioritizedKeys.indexOf(left[0].toLowerCase());
        const rightRank = prioritizedKeys.indexOf(right[0].toLowerCase());
        if (leftRank === -1 && rightRank === -1) return left[0].localeCompare(right[0]);
        if (leftRank === -1) return 1;
        if (rightRank === -1) return -1;
        return leftRank - rightRank;
    });
    const renderedRows = entries.slice(0, 14).map(([key, value])=>{
        return `<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;border-bottom:1px solid #e2e8f0;padding:4px 0;">
      <span style="font-size:11px;color:#64748b;">${escapeHtml(formatPropertyLabel(key))}</span>
      <span style="font-size:11px;color:#0f172a;font-weight:600;text-align:right;max-width:220px;word-break:break-word;">${escapeHtml(String(value))}</span>
    </div>`;
    });
    const startEndRows = [];
    if (startPoint) {
        startEndRows.push(`<div style="display:flex;justify-content:space-between;gap:10px;"><span style="font-size:11px;color:#64748b;">Start Point</span><span style="font-size:11px;color:#0f172a;font-weight:600;">${startPoint[0].toFixed(5)}, ${startPoint[1].toFixed(5)}</span></div>`);
    }
    if (endPoint) {
        startEndRows.push(`<div style="display:flex;justify-content:space-between;gap:10px;"><span style="font-size:11px;color:#64748b;">End Point</span><span style="font-size:11px;color:#0f172a;font-weight:600;">${endPoint[0].toFixed(5)}, ${endPoint[1].toFixed(5)}</span></div>`);
    }
    return `<div style="width:300px;max-height:240px;overflow:auto;font-family:Inter,ui-sans-serif,system-ui;">
    <div style="position:sticky;top:0;background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:8px 10px;margin:-4px -4px 8px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0f172a;">Pipe Segment</div>
      <div style="font-size:11px;color:#64748b;margin-top:2px;">Network attributes from uploaded utility dataset</div>
    </div>
    <div style="display:grid;gap:2px;">${renderedRows.join("")}</div>
    ${startEndRows.length ? `<div style="margin-top:8px;border-top:1px solid #e2e8f0;padding-top:6px;display:grid;gap:4px;">${startEndRows.join("")}</div>` : ""}
  </div>`;
}
function buildBoundaryPopupHtml(overlay) {
    const reported = overlay.reported ?? 0;
    const resolved = overlay.resolved ?? 0;
    const efficiency = reported > 0 ? Math.round(resolved / reported * 1000) / 10 : 0;
    const label = overlay.level === "utility" ? "Utility boundary" : "DMA boundary";
    return `<div style="width:220px;font-family:Inter,ui-sans-serif,system-ui;">
    <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#64748b;">${label}</div>
    <div style="margin-top:4px;font-size:14px;font-weight:700;color:#0f172a;">${escapeHtml(overlay.label)}</div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px;text-align:center;">
      <div style="border-radius:10px;background:#f1f5f9;padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:#0f172a;">${reported.toLocaleString()}</div>
        <div style="font-size:10px;color:#64748b;">Reported</div>
      </div>
      <div style="border-radius:10px;background:#ecfdf5;padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:#047857;">${resolved.toLocaleString()}</div>
        <div style="font-size:10px;color:#64748b;">Resolved</div>
      </div>
      <div style="border-radius:10px;background:#eff6ff;padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:#0369a1;">${efficiency}%</div>
        <div style="font-size:10px;color:#64748b;">Efficiency</div>
      </div>
    </div>
  </div>`;
}
function FitMapToData({ bounds, fitKey }) {
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    const lastAppliedFitKeyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FitMapToData.useEffect": ()=>{
            if (!bounds) return;
            if (lastAppliedFitKeyRef.current === fitKey) return;
            lastAppliedFitKeyRef.current = fitKey;
            map.fitBounds(bounds, {
                padding: [
                    36,
                    36
                ],
                maxZoom: 15,
                animate: false
            });
        }
    }["FitMapToData.useEffect"], [
        bounds,
        fitKey,
        map
    ]);
    return null;
}
_s(FitMapToData, "L60MmAzc0xN4rMFkiz08FugOmUc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c = FitMapToData;
function SyncMapSize() {
    _s1();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SyncMapSize.useEffect": ()=>{
            const container = map.getContainer();
            const refresh = {
                "SyncMapSize.useEffect.refresh": ()=>{
                    window.requestAnimationFrame({
                        "SyncMapSize.useEffect.refresh": ()=>{
                            map.invalidateSize();
                        }
                    }["SyncMapSize.useEffect.refresh"]);
                }
            }["SyncMapSize.useEffect.refresh"];
            refresh();
            const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver({
                "SyncMapSize.useEffect": ()=>{
                    refresh();
                }
            }["SyncMapSize.useEffect"]) : null;
            observer?.observe(container);
            window.addEventListener("resize", refresh);
            return ({
                "SyncMapSize.useEffect": ()=>{
                    observer?.disconnect();
                    window.removeEventListener("resize", refresh);
                }
            })["SyncMapSize.useEffect"];
        }
    }["SyncMapSize.useEffect"], [
        map
    ]);
    return null;
}
_s1(SyncMapSize, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c1 = SyncMapSize;
function MapZoomObserver({ onZoomChange }) {
    _s2();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"])({
        zoomend: {
            "MapZoomObserver.useMapEvents[map]": ()=>onZoomChange(map.getZoom())
        }["MapZoomObserver.useMapEvents[map]"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapZoomObserver.useEffect": ()=>{
            onZoomChange(map.getZoom());
        }
    }["MapZoomObserver.useEffect"], [
        map,
        onZoomChange
    ]);
    return null;
}
_s2(MapZoomObserver, "gWh149/DLPuF22WgXAndVVlzhL4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"]
    ];
});
_c2 = MapZoomObserver;
function OperationsMapImpl({ reports, aggregateMarkers = [], boundaryOverlays = [], center, boundaryGeojson, boundaryGeojsons = [], networkPreviewUrl, networkPreviewUrls = [], networkFileName, title = "Leak operations map", description = "Monitor leak points, routing status, and pipe coverage from one field view.", basemap: controlledBasemap, onBasemapChange, onZoomChange, onReportSelect, chromeMode = "standard", boundsFitKey = "initial", initialBounds = null, preferInitialBounds = false }) {
    _s3();
    const networkUrls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsMapImpl.useMemo[networkUrls]": ()=>{
            const urls = new Set();
            if (networkPreviewUrl) urls.add(networkPreviewUrl);
            networkPreviewUrls.forEach({
                "OperationsMapImpl.useMemo[networkUrls]": (url)=>{
                    if (url) urls.add(url);
                }
            }["OperationsMapImpl.useMemo[networkUrls]"]);
            return Array.from(urls);
        }
    }["OperationsMapImpl.useMemo[networkUrls]"], [
        networkPreviewUrl,
        networkPreviewUrls
    ]);
    const [showNetwork, setShowNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBoundaries, setShowBoundaries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localBasemap, setLocalBasemap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("street");
    const [networkLayers, setNetworkLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [networkLoading, setNetworkLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [networkError, setNetworkError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [controlsOpen, setControlsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mapZoom, setMapZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(13);
    const basemap = controlledBasemap ?? localBasemap;
    const isCommandCenter = chromeMode === "command-center";
    const isSatellite = basemap === "satellite";
    const isNationalBoundaryView = mapZoom <= NATIONAL_BOUNDARY_ZOOM;
    const fallbackBoundaryLevel = isNationalBoundaryView ? "utility" : "dma";
    const boundaryLayers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsMapImpl.useMemo[boundaryLayers]": ()=>{
            if (boundaryOverlays.length) return boundaryOverlays;
            const fallbackLayers = boundaryGeojson ? [
                boundaryGeojson
            ] : boundaryGeojsons;
            return fallbackLayers.map({
                "OperationsMapImpl.useMemo[boundaryLayers]": (geojson, index)=>({
                        id: `boundary-${index}`,
                        label: fallbackBoundaryLevel === "utility" ? `Utility boundary ${index + 1}` : `DMA boundary ${index + 1}`,
                        level: fallbackBoundaryLevel,
                        geojson
                    })
            }["OperationsMapImpl.useMemo[boundaryLayers]"]);
        }
    }["OperationsMapImpl.useMemo[boundaryLayers]"], [
        boundaryGeojson,
        boundaryGeojsons,
        boundaryOverlays,
        fallbackBoundaryLevel
    ]);
    const activeBoundaryLevel = boundaryLayers[0]?.level ?? fallbackBoundaryLevel;
    const boundaryLayerLabel = activeBoundaryLevel === "utility" ? "utility boundaries" : "DMA boundaries";
    const hasBoundaryOverlays = boundaryLayers.length > 0;
    const handleZoomChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OperationsMapImpl.useCallback[handleZoomChange]": (zoom)=>{
            setMapZoom(zoom);
            onZoomChange?.(zoom);
        }
    }["OperationsMapImpl.useCallback[handleZoomChange]"], [
        onZoomChange
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsMapImpl.useEffect": ()=>{
            if (!networkUrls.length) {
                setShowNetwork(false);
            }
        }
    }["OperationsMapImpl.useEffect"], [
        networkUrls
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsMapImpl.useEffect": ()=>{
            setShowBoundaries(hasBoundaryOverlays);
        }
    }["OperationsMapImpl.useEffect"], [
        hasBoundaryOverlays
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsMapImpl.useEffect": ()=>{
            let cancelled = false;
            async function loadNetworkPreview() {
                if (!showNetwork || !networkUrls.length) {
                    if (!cancelled) {
                        setNetworkLayers([]);
                        setNetworkError(null);
                        setNetworkLoading(false);
                    }
                    return;
                }
                const token = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].storage.tokenKey);
                if (!token) {
                    setNetworkError("Authentication is required to load the pipe network overlay.");
                    return;
                }
                setNetworkLoading(true);
                setNetworkError(null);
                try {
                    const results = await Promise.allSettled(networkUrls.map({
                        "OperationsMapImpl.useEffect.loadNetworkPreview": (url)=>loadNetworkLayer(url, token)
                    }["OperationsMapImpl.useEffect.loadNetworkPreview"]));
                    const loadedLayers = results.filter({
                        "OperationsMapImpl.useEffect.loadNetworkPreview.loadedLayers": (result)=>result.status === "fulfilled"
                    }["OperationsMapImpl.useEffect.loadNetworkPreview.loadedLayers"]).map({
                        "OperationsMapImpl.useEffect.loadNetworkPreview.loadedLayers": (result)=>result.value
                    }["OperationsMapImpl.useEffect.loadNetworkPreview.loadedLayers"]);
                    const failedLoads = results.filter({
                        "OperationsMapImpl.useEffect.loadNetworkPreview.failedLoads": (result)=>result.status === "rejected"
                    }["OperationsMapImpl.useEffect.loadNetworkPreview.failedLoads"]).map({
                        "OperationsMapImpl.useEffect.loadNetworkPreview.failedLoads": (result)=>result.reason instanceof Error ? result.reason.message : "A utility pipe network preview could not be loaded."
                    }["OperationsMapImpl.useEffect.loadNetworkPreview.failedLoads"]);
                    if (!cancelled) {
                        setNetworkLayers(loadedLayers);
                        setNetworkError(loadedLayers.length ? failedLoads.length ? `${failedLoads.length} pipe network${failedLoads.length === 1 ? "" : "s"} could not be loaded.` : null : failedLoads[0] || "The utility pipe network preview could not be loaded.");
                    }
                } catch (error) {
                    if (!cancelled) {
                        setNetworkLayers([]);
                        setNetworkError(error instanceof Error ? error.message : "The pipe network preview could not be loaded.");
                    }
                } finally{
                    if (!cancelled) {
                        setNetworkLoading(false);
                    }
                }
            }
            void loadNetworkPreview();
            return ({
                "OperationsMapImpl.useEffect": ()=>{
                    cancelled = true;
                }
            })["OperationsMapImpl.useEffect"];
        }
    }["OperationsMapImpl.useEffect"], [
        networkUrls,
        showNetwork
    ]);
    const validReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsMapImpl.useMemo[validReports]": ()=>reports.filter({
                "OperationsMapImpl.useMemo[validReports]": (report)=>Number.isFinite(report.latitude) && Number.isFinite(report.longitude) && !(report.latitude === 0 && report.longitude === 0)
            }["OperationsMapImpl.useMemo[validReports]"])
    }["OperationsMapImpl.useMemo[validReports]"], [
        reports
    ]);
    const mapCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsMapImpl.useMemo[mapCenter]": ()=>{
            if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
                return center;
            }
            const networkPoints = networkLayers.flatMap({
                "OperationsMapImpl.useMemo[mapCenter].networkPoints": (layer)=>collectGeoJsonCoordinates(layer)
            }["OperationsMapImpl.useMemo[mapCenter].networkPoints"]);
            if (!validReports.length && networkPoints.length) {
                const averageLatitude = networkPoints.reduce({
                    "OperationsMapImpl.useMemo[mapCenter]": (sum, point)=>sum + point[0]
                }["OperationsMapImpl.useMemo[mapCenter]"], 0) / networkPoints.length;
                const averageLongitude = networkPoints.reduce({
                    "OperationsMapImpl.useMemo[mapCenter]": (sum, point)=>sum + point[1]
                }["OperationsMapImpl.useMemo[mapCenter]"], 0) / networkPoints.length;
                return [
                    averageLatitude,
                    averageLongitude
                ];
            }
            if (!validReports.length) {
                const validAggregateMarkers = aggregateMarkers.filter({
                    "OperationsMapImpl.useMemo[mapCenter].validAggregateMarkers": (marker)=>Number.isFinite(marker.latitude) && Number.isFinite(marker.longitude) && !(marker.latitude === 0 && marker.longitude === 0)
                }["OperationsMapImpl.useMemo[mapCenter].validAggregateMarkers"]);
                if (validAggregateMarkers.length) {
                    const averageLatitude = validAggregateMarkers.reduce({
                        "OperationsMapImpl.useMemo[mapCenter]": (sum, marker)=>sum + marker.latitude
                    }["OperationsMapImpl.useMemo[mapCenter]"], 0) / validAggregateMarkers.length;
                    const averageLongitude = validAggregateMarkers.reduce({
                        "OperationsMapImpl.useMemo[mapCenter]": (sum, marker)=>sum + marker.longitude
                    }["OperationsMapImpl.useMemo[mapCenter]"], 0) / validAggregateMarkers.length;
                    return [
                        averageLatitude,
                        averageLongitude
                    ];
                }
                return DEFAULT_CENTER;
            }
            const averageLatitude = validReports.reduce({
                "OperationsMapImpl.useMemo[mapCenter]": (sum, report)=>sum + report.latitude
            }["OperationsMapImpl.useMemo[mapCenter]"], 0) / validReports.length;
            const averageLongitude = validReports.reduce({
                "OperationsMapImpl.useMemo[mapCenter]": (sum, report)=>sum + report.longitude
            }["OperationsMapImpl.useMemo[mapCenter]"], 0) / validReports.length;
            return [
                averageLatitude,
                averageLongitude
            ];
        }
    }["OperationsMapImpl.useMemo[mapCenter]"], [
        aggregateMarkers,
        center,
        networkLayers,
        validReports
    ]);
    const fitBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsMapImpl.useMemo[fitBounds]": ()=>{
            if (preferInitialBounds && initialBounds) return initialBounds;
            const points = [
                ...validReports.map({
                    "OperationsMapImpl.useMemo[fitBounds]": (report)=>[
                            report.latitude,
                            report.longitude
                        ]
                }["OperationsMapImpl.useMemo[fitBounds]"]),
                ...aggregateMarkers.filter({
                    "OperationsMapImpl.useMemo[fitBounds]": (marker)=>Number.isFinite(marker.latitude) && Number.isFinite(marker.longitude)
                }["OperationsMapImpl.useMemo[fitBounds]"]).map({
                    "OperationsMapImpl.useMemo[fitBounds]": (marker)=>[
                            marker.latitude,
                            marker.longitude
                        ]
                }["OperationsMapImpl.useMemo[fitBounds]"]),
                ...showBoundaries ? boundaryLayers.flatMap({
                    "OperationsMapImpl.useMemo[fitBounds]": (overlay)=>collectGeoJsonCoordinates(overlay.geojson)
                }["OperationsMapImpl.useMemo[fitBounds]"]) : [],
                ...networkLayers.flatMap({
                    "OperationsMapImpl.useMemo[fitBounds]": (layer)=>collectGeoJsonCoordinates(layer)
                }["OperationsMapImpl.useMemo[fitBounds]"])
            ];
            if (!points.length) return initialBounds;
            if (points.length === 1) {
                const [lat, lng] = points[0];
                return [
                    [
                        lat - 0.008,
                        lng - 0.008
                    ],
                    [
                        lat + 0.008,
                        lng + 0.008
                    ]
                ];
            }
            return points;
        }
    }["OperationsMapImpl.useMemo[fitBounds]"], [
        aggregateMarkers,
        boundaryLayers,
        initialBounds,
        networkLayers,
        preferInitialBounds,
        showBoundaries,
        validReports
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full overflow-hidden rounded-[30px] border border-slate-300/85 bg-slate-100 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.4)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative h-full",
            children: [
                isCommandCenter ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    id: "5814aea7b9597d1",
                    children: ".majiscope-map--command-center .leaflet-top.leaflet-left{top:5.5rem;left:.5rem}.majiscope-map--command-center .leaflet-control-zoom a{color:#fffffff5;background:#0f172ad1;border-color:#ffffff24;box-shadow:0 14px 34px -22px #0f172ae6}.majiscope-map--command-center .leaflet-control-zoom a:hover{background:#1e293beb}.majiscope-map--command-center .leaflet-bottom.leaflet-right{bottom:.85rem;right:.75rem}.majiscope-map--command-center .leaflet-control-attribution{white-space:nowrap;text-overflow:ellipsis;color:#ffffffc7;opacity:.72;background:#0f172aad;border-radius:9999px;max-width:min(32vw,300px);padding:.12rem .42rem;font-size:9.5px;line-height:1.25;transition:max-width .18s,opacity .18s,background-color .18s;overflow:hidden;box-shadow:0 18px 45px -28px #0f172aeb}.majiscope-map--command-center .leaflet-control-attribution:hover,.majiscope-map--command-center .leaflet-control-attribution:focus-within{opacity:.96;background:#0f172ad1;max-width:min(64vw,720px)}.majiscope-map--command-center .leaflet-control-attribution a{color:#ffffffe6}.majiscope-map--command-center .leaflet-tile-pane{filter:contrast(1.08)saturate(1.04);opacity:1}.majiscope-boundary-tooltip{color:#0f172af5;letter-spacing:0;text-shadow:0 1px 1px #fffc;background:#ffffffe6;border:0;border-radius:9999px;padding:.18rem .55rem;font-size:15px;font-weight:900;line-height:1.1;box-shadow:0 10px 22px -14px #0f172a8c}.majiscope-boundary-tooltip:before{display:none}"
                }, void 0, false, void 0, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                    center: mapCenter,
                    zoom: 13,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full", isCommandCenter && "majiscope-map--command-center"),
                    style: {
                        height: isCommandCenter ? "100%" : "min(72vh, 760px)",
                        minHeight: isCommandCenter ? "0" : "520px",
                        maxHeight: isCommandCenter ? "none" : "760px",
                        width: "100%"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SyncMapSize, {}, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 694,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapZoomObserver, {
                            onZoomChange: handleZoomChange
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 695,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FitMapToData, {
                            bounds: fitBounds,
                            fitKey: boundsFitKey
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 696,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                            attribution: BASEMAPS[basemap].attribution,
                            url: BASEMAPS[basemap].url
                        }, basemap, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 697,
                            columnNumber: 11
                        }, this),
                        showBoundaries ? boundaryLayers.map((overlay, index)=>{
                            const defaultStyle = DEFAULT_BOUNDARY_STYLE[overlay.level];
                            const color = overlay.color ?? defaultStyle.color;
                            const fillColor = overlay.color ?? defaultStyle.fillColor;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                                data: overlay.geojson,
                                style: ()=>({
                                        color,
                                        weight: overlay.level === "utility" ? 3.2 : 2.6,
                                        opacity: overlay.level === "utility" ? 0.88 : 0.78,
                                        fillColor,
                                        fillOpacity: overlay.level === "utility" ? 0.055 : 0.025
                                    }),
                                onEachFeature: (_, layer)=>{
                                    if ("bindTooltip" in layer && typeof layer.bindTooltip === "function") {
                                        layer.bindTooltip(overlay.label, {
                                            sticky: true,
                                            direction: "top",
                                            className: "majiscope-boundary-tooltip"
                                        });
                                    }
                                    if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                                        layer.bindPopup(buildBoundaryPopupHtml(overlay));
                                    }
                                }
                            }, `boundary-${overlay.level}-${overlay.id}-${index}`, false, {
                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                lineNumber: 710,
                                columnNumber: 17
                            }, this);
                        }) : null,
                        showNetwork ? networkLayers.map((networkLayer, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                                data: networkLayer,
                                style: ()=>({
                                        color: "#2563eb",
                                        weight: 2.25,
                                        opacity: 0.64
                                    }),
                                onEachFeature: (feature, layer)=>{
                                    if (!feature) return;
                                    const popupHtml = buildNetworkPopupHtml(feature);
                                    if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                                        layer.bindPopup(popupHtml);
                                    }
                                }
                            }, `network-${index}`, false, {
                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                lineNumber: 739,
                                columnNumber: 17
                            }, this)) : null,
                        aggregateMarkers.map((marker)=>{
                            const efficiency = marker.reported > 0 ? Math.round(marker.resolved / marker.reported * 1000) / 10 : 0;
                            const radius = 7;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                                center: [
                                    marker.latitude,
                                    marker.longitude
                                ],
                                radius: radius,
                                pathOptions: {
                                    fillColor: marker.level === "utility" ? "#0284c7" : "#7c3aed",
                                    color: "#ffffff",
                                    fillOpacity: 0.82,
                                    weight: 2
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[230px] space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
                                                        children: marker.level === "utility" ? "Utility summary" : "DMA summary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 777,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "mt-1 text-sm font-semibold text-slate-900",
                                                        children: marker.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 780,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 776,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-2 text-center text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl bg-slate-100 px-2 py-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-slate-900",
                                                                children: marker.reported.toLocaleString()
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 784,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Reported"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 785,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 783,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl bg-emerald-50 px-2 py-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-emerald-700",
                                                                children: marker.resolved.toLocaleString()
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 788,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Resolved"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 789,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 787,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl bg-sky-50 px-2 py-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-sky-700",
                                                                children: [
                                                                    efficiency,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 792,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Efficiency"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 793,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 791,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 782,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                        lineNumber: 775,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 774,
                                    columnNumber: 19
                                }, this)
                            }, `aggregate-${marker.level}-${marker.id}`, false, {
                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                lineNumber: 763,
                                columnNumber: 17
                            }, this);
                        }),
                        validReports.map((report)=>{
                            const meta = getStatusMeta(report.status);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                                center: [
                                    report.latitude,
                                    report.longitude
                                ],
                                radius: 4,
                                pathOptions: {
                                    fillColor: meta.fill,
                                    color: meta.stroke,
                                    fillOpacity: 0.88,
                                    weight: 1.25
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[250px] space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
                                                        children: meta.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 819,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-sm font-semibold text-slate-900",
                                                        children: report.trackingId
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 822,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "line-clamp-3 text-sm text-slate-600",
                                                        children: report.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 823,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 818,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2 text-xs text-slate-600",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__["Route"], {
                                                                className: "mt-0.5 h-3.5 w-3.5 text-slate-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 828,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: getLocationLabel(report)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 829,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 827,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-2",
                                                        children: [
                                                            report.utilityName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700",
                                                                children: report.utilityName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 833,
                                                                columnNumber: 29
                                                            }, this) : null,
                                                            report.dmaName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-cyan-50 px-2.5 py-1 font-medium text-cyan-800",
                                                                children: report.dmaName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 838,
                                                                columnNumber: 29
                                                            }, this) : null,
                                                            report.priority ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-amber-50 px-2.5 py-1 font-medium capitalize text-amber-800",
                                                                children: report.priority
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 843,
                                                                columnNumber: 29
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 831,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 826,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                className: "w-full",
                                                onClick: ()=>onReportSelect?.(report.id),
                                                children: "Open report"
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 850,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                        lineNumber: 817,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 816,
                                    columnNumber: 19
                                }, this)
                            }, report.id, false, {
                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                lineNumber: 805,
                                columnNumber: 17
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                    lineNumber: 683,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none absolute top-4 z-[1000] flex items-start gap-3", isCommandCenter ? "right-4 justify-end" : "inset-x-4 justify-between"),
                    children: [
                        !isCommandCenter ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-auto rounded-xl border border-slate-300/80 bg-slate-100/88 px-3 py-2 shadow-lg shadow-slate-900/8 backdrop-blur",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 868,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-xs text-slate-500",
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 871,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 867,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-auto ml-auto flex flex-col items-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                size: "icon",
                                                variant: "outline",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-10 w-10 rounded-2xl shadow-lg backdrop-blur-xl", isSatellite ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30 hover:bg-slate-900" : "border-slate-300/80 bg-slate-100/90 text-slate-900 shadow-slate-900/8 hover:bg-slate-200 dark:border-slate-500/80 dark:bg-black/90 dark:text-white dark:shadow-black/45 dark:hover:bg-black"),
                                                "aria-label": controlsOpen ? "Collapse map controls" : "Expand map controls",
                                                onClick: ()=>setControlsOpen((current)=>!current),
                                                children: controlsOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 891,
                                                    columnNumber: 35
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 891,
                                                    columnNumber: 73
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 878,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 877,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                            align: "end",
                                            children: controlsOpen ? "Collapse map controls" : "Expand map controls"
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 894,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 876,
                                    columnNumber: 13
                                }, this),
                                controlsOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-xl", isSatellite ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30" : "border-slate-300/80 bg-slate-100/88 text-slate-900 shadow-slate-900/8 dark:border-slate-600/80 dark:bg-slate-900/88 dark:text-white dark:shadow-slate-950/35"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-2",
                                                    children: Object.entries(BASEMAPS).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            type: "button",
                                                            size: "sm",
                                                            variant: basemap === key ? "default" : "outline",
                                                            className: basemap === key ? "h-8 rounded-xl bg-slate-800 px-3 text-white hover:bg-slate-900" : isSatellite ? "h-8 rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200",
                                                            onClick: ()=>{
                                                                const nextBasemap = key;
                                                                setLocalBasemap(nextBasemap);
                                                                onBasemapChange?.(nextBasemap);
                                                            },
                                                            children: value.label
                                                        }, key, false, {
                                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                            lineNumber: 911,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 909,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    size: "sm",
                                                    variant: showNetwork ? "default" : "outline",
                                                    className: showNetwork ? "h-8 justify-start rounded-xl bg-slate-800 px-3 text-white hover:bg-slate-900" : isSatellite ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200",
                                                    onClick: ()=>setShowNetwork((current)=>!current),
                                                    disabled: !networkUrls.length,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers3$3e$__["Layers3"], {
                                                            className: "mr-2 h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                            lineNumber: 947,
                                                            columnNumber: 21
                                                        }, this),
                                                        showNetwork ? "Hide pipe network" : "Show pipe network"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 933,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    size: "sm",
                                                    variant: showBoundaries ? "default" : "outline",
                                                    className: showBoundaries ? "h-8 justify-start rounded-xl bg-orange-600 px-3 text-white hover:bg-orange-700" : isSatellite ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200",
                                                    onClick: ()=>setShowBoundaries((current)=>!current),
                                                    disabled: !hasBoundaryOverlays,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__["MapPinned"], {
                                                            className: "mr-2 h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                            lineNumber: 964,
                                                            columnNumber: 21
                                                        }, this),
                                                        showBoundaries ? `Hide ${boundaryLayerLabel}` : `Show ${boundaryLayerLabel}`
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 950,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 908,
                                            columnNumber: 17
                                        }, this),
                                        showBoundaries && boundaryOverlays.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 max-w-[240px] rounded-xl border px-2 py-2 text-left", isSatellite ? "border-white/12 bg-white/8 text-white/86" : "border-slate-300/70 bg-white/55 text-slate-700 dark:border-slate-700 dark:bg-slate-950/45 dark:text-slate-200"),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75",
                                                    children: "Boundary legend"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 977,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid gap-1",
                                                    children: [
                                                        boundaryOverlays.slice(0, 5).map((overlay)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between gap-3 text-[11px]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex min-w-0 items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "h-2.5 w-2.5 shrink-0 rounded-full",
                                                                                style: {
                                                                                    backgroundColor: overlay.color ?? DEFAULT_BOUNDARY_STYLE[overlay.level].color
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                                lineNumber: 984,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "truncate",
                                                                                children: overlay.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                                lineNumber: 988,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                        lineNumber: 983,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "shrink-0 font-semibold",
                                                                        children: (overlay.reported ?? 0).toLocaleString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                        lineNumber: 990,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, `legend-${overlay.level}-${overlay.id}`, true, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 982,
                                                                columnNumber: 25
                                                            }, this)),
                                                        boundaryOverlays.length > 5 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] opacity-70",
                                                            children: [
                                                                "+",
                                                                boundaryOverlays.length - 5,
                                                                " more boundaries"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                            lineNumber: 994,
                                                            columnNumber: 25
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 980,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 969,
                                            columnNumber: 19
                                        }, this) : null,
                                        networkLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500"),
                                            children: "Loading network..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1002,
                                            columnNumber: 19
                                        }, this) : null,
                                        !networkLoading && showNetwork && networkError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 max-w-[240px] text-right text-[11px] text-rose-600",
                                            children: networkError
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1007,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 900,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 875,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                    lineNumber: 860,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/maps/operations-map-impl.tsx",
            lineNumber: 604,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/maps/operations-map-impl.tsx",
        lineNumber: 603,
        columnNumber: 5
    }, this);
}
_s3(OperationsMapImpl, "P3gkZ7V6uwCr34BBe1FmcQ/NfGk=");
_c3 = OperationsMapImpl;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "FitMapToData");
__turbopack_context__.k.register(_c1, "SyncMapSize");
__turbopack_context__.k.register(_c2, "MapZoomObserver");
__turbopack_context__.k.register(_c3, "OperationsMapImpl");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/maps/operations-map-impl.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/maps/operations-map-impl.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_maps_operations-map-impl_tsx_888b57a6._.js.map