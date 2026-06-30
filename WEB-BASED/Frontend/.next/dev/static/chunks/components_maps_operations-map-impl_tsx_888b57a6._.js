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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-dot.js [app-client] (ecmascript) <export default as CircleDot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-client] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pinned.js [app-client] (ecmascript) <export default as MapPinned>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-client] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$warehouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Warehouse$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/warehouse.js [app-client] (ecmascript) <export default as Warehouse>");
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
const INFRASTRUCTURE_SYMBOLS = {
    valves: {
        svg: '<path d="M5 8.5h3.2l2.3 2.1 2.3-2.1H16v7h-3.2l-2.3-2.1-2.3 2.1H5v-7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10.5 6.2v3.6M8.5 6.2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    },
    water_sources: {
        svg: '<path d="M10.5 3.8c2.8 3.1 4.2 5.3 4.2 7.3a4.2 4.2 0 1 1-8.4 0c0-2 1.4-4.2 4.2-7.3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'
    },
    storage_facilities: {
        svg: '<path d="M5.5 7.2c0-1.2 2.2-2.2 5-2.2s5 1 5 2.2v7.6c0 1.2-2.2 2.2-5 2.2s-5-1-5-2.2V7.2Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M15.5 7.2c0 1.2-2.2 2.2-5 2.2s-5-1-5-2.2" fill="none" stroke="currentColor" stroke-width="1.7"/>'
    },
    bulk_meters: {
        svg: '<path d="M5 13a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.5 12.8 13 9.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.2 15.6h6.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    }
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
function getInfrastructureIcon(assetType) {
    if (assetType === "valves") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"];
    if (assetType === "storage_facilities") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$warehouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Warehouse$3e$__["Warehouse"];
    if (assetType === "bulk_meters") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"];
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__["CircleDot"];
}
function createInfrastructureDivIcon(assetType, color) {
    const symbol = INFRASTRUCTURE_SYMBOLS[assetType] || INFRASTRUCTURE_SYMBOLS.valves;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["divIcon"]({
        className: "majiscope-infrastructure-div-icon",
        iconSize: [
            26,
            26
        ],
        iconAnchor: [
            13,
            13
        ],
        popupAnchor: [
            0,
            -13
        ],
        html: `<span style="display:flex;height:26px;width:26px;align-items:center;justify-content:center;border-radius:9999px;background:${color};color:white;border:2px solid rgba(255,255,255,.96);box-shadow:0 10px 22px -13px rgba(15,23,42,.85);"><svg viewBox="0 0 21 21" aria-hidden="true" style="height:18px;width:18px;filter:drop-shadow(0 1px 0 rgba(15,23,42,.18));">${symbol.svg}</svg></span>`
    });
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
function MapViewObserver({ onZoomChange, onViewChange }) {
    _s2();
    const emitViewState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MapViewObserver.useCallback[emitViewState]": (map)=>{
            const center = map.getCenter();
            const zoom = map.getZoom();
            onZoomChange(zoom);
            onViewChange?.({
                zoom,
                center: [
                    center.lat,
                    center.lng
                ]
            });
        }
    }["MapViewObserver.useCallback[emitViewState]"], [
        onViewChange,
        onZoomChange
    ]);
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"])({
        moveend: {
            "MapViewObserver.useMapEvents[map]": ()=>emitViewState(map)
        }["MapViewObserver.useMapEvents[map]"],
        zoomend: {
            "MapViewObserver.useMapEvents[map]": ()=>emitViewState(map)
        }["MapViewObserver.useMapEvents[map]"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapViewObserver.useEffect": ()=>{
            emitViewState(map);
        }
    }["MapViewObserver.useEffect"], [
        emitViewState,
        map
    ]);
    return null;
}
_s2(MapViewObserver, "7qx7WghRVRI5s8vJ3B2NnY6Oh2U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"]
    ];
});
_c2 = MapViewObserver;
function OperationsMapImpl({ reports, aggregateMarkers = [], boundaryOverlays = [], center, boundaryGeojson, boundaryGeojsons = [], networkPreviewUrl, networkPreviewUrls = [], infrastructureLayers = [], networkFileName, title = "Leak operations map", description = "Monitor leak points, routing status, and pipe coverage from one field view.", basemap: controlledBasemap, onBasemapChange, onZoomChange, onViewChange, onReportSelect, chromeMode = "standard", boundsFitKey = "initial", initialBounds = null, preferInitialBounds = false }) {
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
    const [assetLayers, setAssetLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [visibleAssetTypes, setVisibleAssetTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [networkLoading, setNetworkLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [assetLoadingTypes, setAssetLoadingTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [networkError, setNetworkError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [assetErrors, setAssetErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [controlsOpen, setControlsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mapZoom, setMapZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(13);
    const basemap = controlledBasemap ?? localBasemap;
    const isCommandCenter = chromeMode === "command-center";
    const isSatellite = basemap === "satellite";
    const isInfrastructureZoomSupported = mapZoom > 10;
    const shouldRenderNetwork = showNetwork && networkUrls.length > 0 && isInfrastructureZoomSupported;
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
    const visibleAggregateMarkers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsMapImpl.useMemo[visibleAggregateMarkers]": ()=>mapZoom < 5 ? [] : aggregateMarkers
    }["OperationsMapImpl.useMemo[visibleAggregateMarkers]"], [
        aggregateMarkers,
        mapZoom
    ]);
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
            setVisibleAssetTypes({
                "OperationsMapImpl.useEffect": (current)=>{
                    const availableTypes = new Set(infrastructureLayers.map({
                        "OperationsMapImpl.useEffect": (layer)=>layer.assetType
                    }["OperationsMapImpl.useEffect"]));
                    const next = {};
                    Object.entries(current).forEach({
                        "OperationsMapImpl.useEffect": ([assetType, visible])=>{
                            if (availableTypes.has(assetType)) next[assetType] = visible;
                        }
                    }["OperationsMapImpl.useEffect"]);
                    const currentKeys = Object.keys(current);
                    const nextKeys = Object.keys(next);
                    if (currentKeys.length === nextKeys.length && nextKeys.every({
                        "OperationsMapImpl.useEffect": (key)=>current[key] === next[key]
                    }["OperationsMapImpl.useEffect"])) {
                        return current;
                    }
                    return next;
                }
            }["OperationsMapImpl.useEffect"]);
        }
    }["OperationsMapImpl.useEffect"], [
        infrastructureLayers
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
                if (!shouldRenderNetwork) {
                    if (!cancelled) {
                        setNetworkLayers({
                            "OperationsMapImpl.useEffect.loadNetworkPreview": (current)=>current.length ? [] : current
                        }["OperationsMapImpl.useEffect.loadNetworkPreview"]);
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
        shouldRenderNetwork
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsMapImpl.useEffect": ()=>{
            let cancelled = false;
            async function loadVisibleAssetLayers() {
                const visibleLayers = infrastructureLayers.filter({
                    "OperationsMapImpl.useEffect.loadVisibleAssetLayers.visibleLayers": (layer)=>isInfrastructureZoomSupported && visibleAssetTypes[layer.assetType] && layer.previewUrls.length
                }["OperationsMapImpl.useEffect.loadVisibleAssetLayers.visibleLayers"]);
                if (!visibleLayers.length) {
                    if (!cancelled) {
                        setAssetLayers({
                            "OperationsMapImpl.useEffect.loadVisibleAssetLayers": (current)=>Object.keys(current).length ? {} : current
                        }["OperationsMapImpl.useEffect.loadVisibleAssetLayers"]);
                        setAssetErrors({
                            "OperationsMapImpl.useEffect.loadVisibleAssetLayers": (current)=>Object.keys(current).length ? {} : current
                        }["OperationsMapImpl.useEffect.loadVisibleAssetLayers"]);
                        setAssetLoadingTypes({
                            "OperationsMapImpl.useEffect.loadVisibleAssetLayers": (current)=>Object.keys(current).length ? {} : current
                        }["OperationsMapImpl.useEffect.loadVisibleAssetLayers"]);
                    }
                    return;
                }
                const token = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].storage.tokenKey);
                if (!token) {
                    if (!cancelled) {
                        setAssetErrors(Object.fromEntries(visibleLayers.map({
                            "OperationsMapImpl.useEffect.loadVisibleAssetLayers": (layer)=>[
                                    layer.assetType,
                                    "Authentication is required to load this infrastructure layer."
                                ]
                        }["OperationsMapImpl.useEffect.loadVisibleAssetLayers"])));
                    }
                    return;
                }
                setAssetLoadingTypes(Object.fromEntries(visibleLayers.map({
                    "OperationsMapImpl.useEffect.loadVisibleAssetLayers": (layer)=>[
                            layer.assetType,
                            true
                        ]
                }["OperationsMapImpl.useEffect.loadVisibleAssetLayers"])));
                const nextLayers = {};
                const nextErrors = {};
                await Promise.all(visibleLayers.map({
                    "OperationsMapImpl.useEffect.loadVisibleAssetLayers": async (layer)=>{
                        const results = await Promise.allSettled(layer.previewUrls.map({
                            "OperationsMapImpl.useEffect.loadVisibleAssetLayers": (url)=>loadNetworkLayer(url, token)
                        }["OperationsMapImpl.useEffect.loadVisibleAssetLayers"]));
                        const loadedLayers = results.filter({
                            "OperationsMapImpl.useEffect.loadVisibleAssetLayers.loadedLayers": (result)=>result.status === "fulfilled"
                        }["OperationsMapImpl.useEffect.loadVisibleAssetLayers.loadedLayers"]).map({
                            "OperationsMapImpl.useEffect.loadVisibleAssetLayers.loadedLayers": (result)=>result.value
                        }["OperationsMapImpl.useEffect.loadVisibleAssetLayers.loadedLayers"]);
                        const failedLoads = results.filter({
                            "OperationsMapImpl.useEffect.loadVisibleAssetLayers.failedLoads": (result)=>result.status === "rejected"
                        }["OperationsMapImpl.useEffect.loadVisibleAssetLayers.failedLoads"]);
                        nextLayers[layer.assetType] = loadedLayers;
                        nextErrors[layer.assetType] = loadedLayers.length && failedLoads.length ? `${failedLoads.length} ${layer.label.toLowerCase()} layer${failedLoads.length === 1 ? "" : "s"} could not be loaded.` : loadedLayers.length ? null : `${layer.label} could not be loaded.`;
                    }
                }["OperationsMapImpl.useEffect.loadVisibleAssetLayers"]));
                if (!cancelled) {
                    setAssetLayers(nextLayers);
                    setAssetErrors(nextErrors);
                    setAssetLoadingTypes({});
                }
            }
            void loadVisibleAssetLayers();
            return ({
                "OperationsMapImpl.useEffect": ()=>{
                    cancelled = true;
                }
            })["OperationsMapImpl.useEffect"];
        }
    }["OperationsMapImpl.useEffect"], [
        infrastructureLayers,
        isInfrastructureZoomSupported,
        visibleAssetTypes
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
                }["OperationsMapImpl.useMemo[fitBounds]"]),
                ...Object.values(assetLayers).flatMap({
                    "OperationsMapImpl.useMemo[fitBounds]": (layers)=>layers.flatMap({
                            "OperationsMapImpl.useMemo[fitBounds]": (layer)=>collectGeoJsonCoordinates(layer)
                        }["OperationsMapImpl.useMemo[fitBounds]"])
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
        assetLayers,
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
                            lineNumber: 851,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapViewObserver, {
                            onZoomChange: handleZoomChange,
                            onViewChange: onViewChange
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 852,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FitMapToData, {
                            bounds: fitBounds,
                            fitKey: boundsFitKey
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 853,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                            attribution: BASEMAPS[basemap].attribution,
                            url: BASEMAPS[basemap].url
                        }, basemap, false, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 854,
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
                                lineNumber: 867,
                                columnNumber: 17
                            }, this);
                        }) : null,
                        shouldRenderNetwork ? networkLayers.map((networkLayer, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
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
                                lineNumber: 896,
                                columnNumber: 17
                            }, this)) : null,
                        infrastructureLayers.map((asset)=>isInfrastructureZoomSupported && visibleAssetTypes[asset.assetType] ? (assetLayers[asset.assetType] || []).map((assetLayer, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                                    data: assetLayer,
                                    pointToLayer: (_, latlng)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marker"](latlng, {
                                            icon: createInfrastructureDivIcon(asset.assetType, asset.color)
                                        }),
                                    style: ()=>({
                                            color: asset.color,
                                            weight: 2,
                                            opacity: 0.76,
                                            fillColor: asset.color,
                                            fillOpacity: 0.16
                                        }),
                                    onEachFeature: (feature, layer)=>{
                                        if (!feature) return;
                                        const popupHtml = buildNetworkPopupHtml(feature);
                                        if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                                            layer.bindPopup(popupHtml.replace("Pipe Segment", escapeHtml(asset.label)));
                                        }
                                    }
                                }, `asset-${asset.assetType}-${index}`, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 918,
                                    columnNumber: 19
                                }, this)) : null),
                        visibleAggregateMarkers.map((marker)=>{
                            const efficiency = marker.reported > 0 ? Math.round(marker.resolved / marker.reported * 1000) / 10 : 0;
                            const radius = marker.level === "utility" ? 5 : 6;
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
                                                        lineNumber: 962,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "mt-1 text-sm font-semibold text-slate-900",
                                                        children: marker.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 965,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 961,
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
                                                                lineNumber: 969,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Reported"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 970,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 968,
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
                                                                lineNumber: 973,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Resolved"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 974,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 972,
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
                                                                lineNumber: 977,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Efficiency"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 978,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 976,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 967,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                        lineNumber: 960,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 959,
                                    columnNumber: 19
                                }, this)
                            }, `aggregate-${marker.level}-${marker.id}`, false, {
                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                lineNumber: 948,
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
                                                        lineNumber: 1004,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-sans text-sm font-extrabold tracking-[0.04em] text-slate-900",
                                                        children: report.trackingId
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 1007,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "line-clamp-3 text-sm text-slate-600",
                                                        children: report.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 1008,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 1003,
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
                                                                lineNumber: 1013,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: getLocationLabel(report)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 1014,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 1012,
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
                                                                lineNumber: 1018,
                                                                columnNumber: 29
                                                            }, this) : null,
                                                            report.dmaName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-cyan-50 px-2.5 py-1 font-medium text-cyan-800",
                                                                children: report.dmaName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 1023,
                                                                columnNumber: 29
                                                            }, this) : null,
                                                            report.priority ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-amber-50 px-2.5 py-1 font-medium capitalize text-amber-800",
                                                                children: report.priority
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 1028,
                                                                columnNumber: 29
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 1016,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 1011,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                className: "w-full",
                                                onClick: ()=>onReportSelect?.(report.trackingId || report.id),
                                                children: "Open report"
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 1035,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                        lineNumber: 1002,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 1001,
                                    columnNumber: 19
                                }, this)
                            }, report.id, false, {
                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                lineNumber: 990,
                                columnNumber: 17
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                    lineNumber: 840,
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
                                    lineNumber: 1053,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-xs text-slate-500",
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 1056,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 1052,
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
                                                    lineNumber: 1076,
                                                    columnNumber: 35
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 1076,
                                                    columnNumber: 73
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 1063,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1062,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                            align: "end",
                                            children: controlsOpen ? "Collapse map controls" : "Expand map controls"
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1079,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 1061,
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
                                                            lineNumber: 1096,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 1094,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    size: "sm",
                                                    variant: showNetwork ? "default" : "outline",
                                                    className: showNetwork ? "h-8 justify-start rounded-xl bg-slate-800 px-3 text-white hover:bg-slate-900" : isSatellite ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200",
                                                    onClick: ()=>setShowNetwork((current)=>!current),
                                                    disabled: (!networkUrls.length || !isInfrastructureZoomSupported) && !showNetwork,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers3$3e$__["Layers3"], {
                                                            className: "mr-2 h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                            lineNumber: 1132,
                                                            columnNumber: 21
                                                        }, this),
                                                        showNetwork ? "Hide pipe network" : "Show pipe network"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 1118,
                                                    columnNumber: 19
                                                }, this),
                                                infrastructureLayers.map((asset)=>{
                                                    const visible = Boolean(visibleAssetTypes[asset.assetType]);
                                                    const Icon = getInfrastructureIcon(asset.assetType);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        size: "sm",
                                                        variant: visible ? "default" : "outline",
                                                        className: visible ? "h-8 justify-start rounded-xl px-3 text-white hover:brightness-95" : isSatellite ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200",
                                                        style: visible ? {
                                                            backgroundColor: asset.color
                                                        } : undefined,
                                                        onClick: ()=>setVisibleAssetTypes((current)=>({
                                                                    ...current,
                                                                    [asset.assetType]: !current[asset.assetType]
                                                                })),
                                                        disabled: (!asset.previewUrls.length || !isInfrastructureZoomSupported) && !visible,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                className: "mr-2 h-3.5 w-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                lineNumber: 1161,
                                                                columnNumber: 25
                                                            }, this),
                                                            visible ? `Hide ${asset.label}` : `Show ${asset.label}`
                                                        ]
                                                    }, asset.assetType, true, {
                                                        fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                        lineNumber: 1140,
                                                        columnNumber: 23
                                                    }, this);
                                                }),
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
                                                            lineNumber: 1180,
                                                            columnNumber: 21
                                                        }, this),
                                                        showBoundaries ? `Hide ${boundaryLayerLabel}` : `Show ${boundaryLayerLabel}`
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 1166,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1093,
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
                                                    lineNumber: 1193,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid max-h-32 gap-1 overflow-y-auto pr-1",
                                                    children: boundaryOverlays.map((overlay)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                            lineNumber: 1200,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "truncate",
                                                                            children: overlay.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                            lineNumber: 1204,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                    lineNumber: 1199,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "shrink-0 font-semibold",
                                                                    children: (overlay.reported ?? 0).toLocaleString()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                                    lineNumber: 1206,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, `legend-${overlay.level}-${overlay.id}`, true, {
                                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                            lineNumber: 1198,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                    lineNumber: 1196,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1185,
                                            columnNumber: 19
                                        }, this) : null,
                                        networkLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500"),
                                            children: "Loading network..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 19
                                        }, this) : null,
                                        !networkLoading && shouldRenderNetwork && networkError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 max-w-[240px] text-right text-[11px] text-rose-600",
                                            children: networkError
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1218,
                                            columnNumber: 19
                                        }, this) : null,
                                        infrastructureLayers.some((asset)=>assetLoadingTypes[asset.assetType]) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500"),
                                            children: "Loading infrastructure..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                                            lineNumber: 1221,
                                            columnNumber: 19
                                        }, this) : null,
                                        infrastructureLayers.map((asset)=>visibleAssetTypes[asset.assetType] && assetErrors[asset.assetType] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 max-w-[240px] text-right text-[11px] text-rose-600",
                                                children: assetErrors[asset.assetType]
                                            }, `asset-error-${asset.assetType}`, false, {
                                                fileName: "[project]/components/maps/operations-map-impl.tsx",
                                                lineNumber: 1227,
                                                columnNumber: 21
                                            }, this) : null)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                                    lineNumber: 1085,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/operations-map-impl.tsx",
                            lineNumber: 1060,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/operations-map-impl.tsx",
                    lineNumber: 1045,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/maps/operations-map-impl.tsx",
            lineNumber: 761,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/maps/operations-map-impl.tsx",
        lineNumber: 760,
        columnNumber: 5
    }, this);
}
_s3(OperationsMapImpl, "sHXUKHb7mm96HKkd+vZ2ATMjYjU=");
_c3 = OperationsMapImpl;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "FitMapToData");
__turbopack_context__.k.register(_c1, "SyncMapSize");
__turbopack_context__.k.register(_c2, "MapViewObserver");
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