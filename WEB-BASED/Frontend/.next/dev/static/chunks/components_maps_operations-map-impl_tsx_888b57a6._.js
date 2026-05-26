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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-client] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
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
    switch(status){
        case "new":
            return {
                label: "New intake",
                fill: "#ef4444",
                stroke: "#991b1b"
            };
        case "assigned":
            return {
                label: "Assigned",
                fill: "#f59e0b",
                stroke: "#b45309"
            };
        case "in_progress":
            return {
                label: "In progress",
                fill: "#0ea5e9",
                stroke: "#0369a1"
            };
        case "pending_approval":
            return {
                label: "Awaiting DMA approval",
                fill: "#8b5cf6",
                stroke: "#6d28d9"
            };
        case "approved":
            return {
                label: "Approved",
                fill: "#10b981",
                stroke: "#047857"
            };
        case "closed":
            return {
                label: "Closed",
                fill: "#334155",
                stroke: "#0f172a"
            };
        case "rejected":
            return {
                label: "Rework required",
                fill: "#f97316",
                stroke: "#c2410c"
            };
        default:
            return {
                label: "Reported leakage",
                fill: "#64748b",
                stroke: "#334155"
            };
    }
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
function FitMapToData({ bounds }) {
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FitMapToData.useEffect": ()=>{
            if (!bounds) return;
            map.fitBounds(bounds, {
                padding: [
                    28,
                    28
                ]
            });
        }
    }["FitMapToData.useEffect"], [
        bounds,
        map
    ]);
    return null;
}
_s(FitMapToData, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
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
function OperationsMapImpl({ reports, center, boundaryGeojson, networkPreviewUrl, networkFileName, title = "Leak operations map", description = "Monitor leak points, routing status, and pipe coverage from one field view.", basemap: controlledBasemap, onBasemapChange, onReportSelect, chromeMode = "standard" }) {
    _s2();
    const [showNetwork, setShowNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Boolean(networkPreviewUrl));
    const [localBasemap, setLocalBasemap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("satellite");
    const [networkData, setNetworkData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [networkLoading, setNetworkLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [networkError, setNetworkError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const basemap = controlledBasemap ?? localBasemap;
    const isCommandCenter = chromeMode === "command-center";
    const isSatellite = basemap === "satellite";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsMapImpl.useEffect": ()=>{
            setShowNetwork(Boolean(networkPreviewUrl));
        }
    }["OperationsMapImpl.useEffect"], [
        networkPreviewUrl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsMapImpl.useEffect": ()=>{
            let cancelled = false;
            async function loadNetworkPreview() {
                if (!showNetwork || !networkPreviewUrl) {
                    if (!cancelled) {
                        setNetworkData(null);
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
                    const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].backend.baseUrl}${networkPreviewUrl}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const payload = await response.json().catch({
                        "OperationsMapImpl.useEffect.loadNetworkPreview": ()=>({})
                    }["OperationsMapImpl.useEffect.loadNetworkPreview"]);
                    if (!response.ok) {
                        if (!cancelled) {
                            setNetworkData(null);
                            setNetworkError(payload?.detail || "The utility pipe network preview could not be loaded.");
                        }
                        return;
                    }
                    if (!cancelled) {
                        setNetworkData(payload);
                    }
                } catch (error) {
                    if (!cancelled) {
                        setNetworkData(null);
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
        networkPreviewUrl,
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
            const networkPoints = collectGeoJsonCoordinates(networkData);
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
        center,
        networkData,
        validReports
    ]);
    const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsMapImpl.useMemo[bounds]": ()=>{
            const points = [
                ...validReports.map({
                    "OperationsMapImpl.useMemo[bounds]": (report)=>[
                            report.latitude,
                            report.longitude
                        ]
                }["OperationsMapImpl.useMemo[bounds]"]),
                ...collectGeoJsonCoordinates(boundaryGeojson ?? null),
                ...collectGeoJsonCoordinates(networkData)
            ];
            if (!points.length) return null;
            if (points.length === 1) {
                const [lat, lng] = points[0];
                return [
                    [
                        lat - 0.01,
                        lng - 0.01
                    ],
                    [
                        lat + 0.01,
                        lng + 0.01
                    ]
                ];
            }
            return points;
        }
    }["OperationsMapImpl.useMemo[bounds]"], [
        boundaryGeojson,
        networkData,
        validReports
    ]);
    const legend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsMapImpl.useMemo[legend]": ()=>[
                getStatusMeta("new"),
                getStatusMeta("assigned"),
                getStatusMeta("in_progress"),
                getStatusMeta("pending_approval"),
                getStatusMeta("approved")
            ]
    }["OperationsMapImpl.useMemo[legend]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_32px_90px_-48px_rgba(15,23,42,0.45)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                isCommandCenter ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    id: "744284ae7876464",
                    children: ".majiscope-map--command-center .leaflet-top.leaflet-left{top:5.5rem;left:.5rem}.majiscope-map--command-center .leaflet-control-zoom a{color:#fffffff5;background:#0f172ad1;border-color:#ffffff24;box-shadow:0 14px 34px -22px #0f172ae6}.majiscope-map--command-center .leaflet-control-zoom a:hover{background:#1e293beb}.majiscope-map--command-center .leaflet-bottom.leaflet-right{bottom:.85rem;right:.75rem}.majiscope-map--command-center .leaflet-control-attribution{color:#ffffffd6;background:#0f172acc;border-radius:9999px;padding:.2rem .55rem;box-shadow:0 18px 45px -28px #0f172aeb}.majiscope-map--command-center .leaflet-control-attribution a{color:#fffffff5}"
                }, void 0, false, void 0, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                    center: mapCenter,
                    zoom: 13,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full", isCommandCenter && "majiscope-map--command-center"),
                    style: {
                        height: "80vh",
                        minHeight: "760px",
                        maxHeight: "980px",
                        width: "100%"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SyncMapSize, {}, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 512,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FitMapToData, {
                            bounds: bounds
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 513,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                            attribution: BASEMAPS[basemap].attribution,
                            url: BASEMAPS[basemap].url
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 514,
                            columnNumber: 11
                        }, this),
                        boundaryGeojson ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                            data: boundaryGeojson,
                            style: ()=>({
                                    color: "#0f766e",
                                    weight: 3,
                                    opacity: 0.95,
                                    dashArray: "8 6",
                                    fillColor: "#2dd4bf",
                                    fillOpacity: 0.08
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 520,
                            columnNumber: 13
                        }, this) : null,
                        showNetwork && networkData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                            data: networkData,
                            style: ()=>({
                                    color: "#2563eb",
                                    weight: 3,
                                    opacity: 0.8
                                }),
                            onEachFeature: (feature, layer)=>{
                                if (!feature) return;
                                const popupHtml = buildNetworkPopupHtml(feature);
                                if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                                    layer.bindPopup(popupHtml);
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 534,
                            columnNumber: 13
                        }, this) : null,
                        validReports.map((report)=>{
                            const meta = getStatusMeta(report.status);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                                center: [
                                    report.latitude,
                                    report.longitude
                                ],
                                radius: 7,
                                pathOptions: {
                                    fillColor: meta.fill,
                                    color: meta.stroke,
                                    fillOpacity: 0.9,
                                    weight: 2
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
                                                        lineNumber: 568,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-sm font-semibold text-slate-900",
                                                        children: report.trackingId
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 571,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "line-clamp-3 text-sm text-slate-600",
                                                        children: report.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 572,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 567,
                                                columnNumber: 21
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
                                                                lineNumber: 577,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: getLocationLabel(report)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 578,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 576,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-2",
                                                        children: [
                                                            report.utilityName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700",
                                                                children: report.utilityName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 582,
                                                                columnNumber: 27
                                                            }, this) : null,
                                                            report.dmaName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-cyan-50 px-2.5 py-1 font-medium text-cyan-800",
                                                                children: report.dmaName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 587,
                                                                columnNumber: 27
                                                            }, this) : null,
                                                            report.priority ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-amber-50 px-2.5 py-1 font-medium capitalize text-amber-800",
                                                                children: report.priority
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 592,
                                                                columnNumber: 27
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 580,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 575,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                className: "w-full",
                                                onClick: ()=>onReportSelect?.(report.id),
                                                children: "Open report"
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 599,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                        lineNumber: 566,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 565,
                                    columnNumber: 17
                                }, this)
                            }, report.id, false, {
                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                lineNumber: 554,
                                columnNumber: 15
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                    lineNumber: 506,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none absolute top-4 z-[1000] flex items-start gap-3", isCommandCenter ? "right-4 inset-x-auto" : "inset-x-4 justify-between"),
                    children: [
                        !isCommandCenter ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-auto rounded-xl border border-white/80 bg-white/92 px-3 py-2 shadow-lg shadow-slate-900/10 backdrop-blur",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 617,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-xs text-slate-500",
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 620,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 616,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-auto rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-xl", isSatellite ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30" : "border-white/80 bg-white/92 text-slate-900 shadow-slate-900/10"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-nowrap items-center gap-2",
                                    children: [
                                        Object.entries(BASEMAPS).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                size: "sm",
                                                variant: basemap === key ? "default" : "outline",
                                                className: basemap === key ? "h-8 rounded-xl bg-cyan-600 px-3 text-white hover:bg-cyan-500" : isSatellite ? "h-8 rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 rounded-xl border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50",
                                                onClick: ()=>{
                                                    const nextBasemap = key;
                                                    setLocalBasemap(nextBasemap);
                                                    onBasemapChange?.(nextBasemap);
                                                },
                                                children: value.label
                                            }, key, false, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 636,
                                                columnNumber: 17
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            size: "sm",
                                            variant: showNetwork ? "default" : "outline",
                                            className: showNetwork ? "h-8 rounded-xl bg-cyan-600 px-3 text-white hover:bg-cyan-500" : isSatellite ? "h-8 rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 rounded-xl border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50",
                                            onClick: ()=>setShowNetwork((current)=>!current),
                                            disabled: !networkPreviewUrl,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers3$3e$__["Layers3"], {
                                                    className: "mr-2 h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 671,
                                                    columnNumber: 17
                                                }, this),
                                                showNetwork ? "Hide pipe network" : "Show pipe network"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 657,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 634,
                                    columnNumber: 13
                                }, this),
                                networkLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500"),
                                    children: "Loading network..."
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 676,
                                    columnNumber: 15
                                }, this) : null,
                                !networkLoading && showNetwork && networkError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 max-w-[240px] text-right text-[11px] text-rose-600",
                                    children: networkError
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 681,
                                    columnNumber: 15
                                }, this) : null,
                                !networkLoading && !networkError && networkFileName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500"),
                                    children: networkFileName
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 684,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 626,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                    lineNumber: 609,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pointer-events-none absolute inset-x-4 bottom-4 z-[1000] flex flex-wrap justify-center gap-2",
                    children: legend.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-full border px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur-xl", isSatellite ? "border-white/14 bg-slate-950/76 text-white shadow-slate-950/30" : "border-white/80 bg-white/92 text-slate-700 shadow-slate-900/10"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle",
                                    style: {
                                        backgroundColor: item.fill,
                                        boxShadow: `0 0 0 2px ${item.stroke}`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 702,
                                    columnNumber: 15
                                }, this),
                                item.label
                            ]
                        }, item.label, true, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 693,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                    lineNumber: 691,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/maps/operations-map-impl.tsx",
            lineNumber: 468,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/maps/operations-map-impl.tsx",
        lineNumber: 467,
        columnNumber: 5
    }, this);
}
_s2(OperationsMapImpl, "AkLbOFeeW16pSa2v70E3xG8Bs90=");
_c2 = OperationsMapImpl;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "FitMapToData");
__turbopack_context__.k.register(_c1, "SyncMapSize");
__turbopack_context__.k.register(_c2, "OperationsMapImpl");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/maps/operations-map-impl.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/maps/operations-map-impl.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_maps_operations-map-impl_tsx_888b57a6._.js.map