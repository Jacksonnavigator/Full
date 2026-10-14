module.exports = [
"[project]/components/maps/operations-map.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OperationsMap",
    ()=>OperationsMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/CircleMarker.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/GeoJSON.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pinned.js [app-ssr] (ecmascript) <export default as MapPinned>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.js [app-ssr] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-ssr] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$infrastructure$2d$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/infrastructure-icon.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$infrastructure$2d$assets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/infrastructure-assets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/palette.ts [app-ssr] (ecmascript)");
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
    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.boundaryLighter.color,
    fillColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.boundaryLighter.fillColor
};
const POPUP_BORDER = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.bg;
const POPUP_MUTED = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.base;
const POPUP_TEXT = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.text;
const POPUP_CARD = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.bg;
const POPUP_SUCCESS_BG = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.success.bg;
const POPUP_SUCCESS_BG_STRONG = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.success.soft;
const POPUP_SUCCESS_TEXT = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.success.base;
const POPUP_ACCENT_BG = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].accent.bg;
const POPUP_ACCENT_BG_STRONG = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].accent.bgStrong;
const POPUP_ACCENT_TEXT = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].accent.base;
const DEFAULT_BOUNDARY_STYLE = {
    utility: {
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.boundary.color,
        fillColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.boundary.fillColor
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
    const loadPromise = fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].backend.baseUrl}${url}`, {
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
            fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.pendingApproval.fill,
            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.pendingApproval.stroke
        };
    }
    if (status === "approved" || status === "closed") {
        return {
            label: status === "closed" ? "Closed" : "Repaired",
            fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.resolved.fill,
            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.resolved.stroke
        };
    }
    return {
        label: "Open",
        fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.open.fill,
        stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.open.stroke
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
        return `<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;border-bottom:1px solid ${POPUP_BORDER};padding:4px 0;">
      <span style="font-size:11px;color:${POPUP_MUTED};">${escapeHtml(formatPropertyLabel(key))}</span>
      <span style="font-size:11px;color:${POPUP_TEXT};font-weight:600;text-align:right;max-width:220px;word-break:break-word;">${escapeHtml(String(value))}</span>
    </div>`;
    });
    const startEndRows = [];
    if (startPoint) {
        startEndRows.push(`<div style="display:flex;justify-content:space-between;gap:10px;"><span style="font-size:11px;color:${POPUP_MUTED};">Start Point</span><span style="font-size:11px;color:${POPUP_TEXT};font-weight:600;">${startPoint[0].toFixed(5)}, ${startPoint[1].toFixed(5)}</span></div>`);
    }
    if (endPoint) {
        startEndRows.push(`<div style="display:flex;justify-content:space-between;gap:10px;"><span style="font-size:11px;color:${POPUP_MUTED};">End Point</span><span style="font-size:11px;color:${POPUP_TEXT};font-weight:600;">${endPoint[0].toFixed(5)}, ${endPoint[1].toFixed(5)}</span></div>`);
    }
    return `<div style="width:300px;max-height:240px;overflow:auto;font-family:Inter,ui-sans-serif,system-ui;">
    <div style="position:sticky;top:0;background:${POPUP_CARD};border-bottom:1px solid ${POPUP_BORDER};padding:8px 10px;margin:-4px -4px 8px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${POPUP_TEXT};">Pipe Segment</div>
      <div style="font-size:11px;color:${POPUP_MUTED};margin-top:2px;">Network attributes from uploaded utility dataset</div>
    </div>
    <div style="display:grid;gap:2px;">${renderedRows.join("")}</div>
    ${startEndRows.length ? `<div style="margin-top:8px;border-top:1px solid ${POPUP_BORDER};padding-top:6px;display:grid;gap:4px;">${startEndRows.join("")}</div>` : ""}
  </div>`;
}
function createInfrastructureDivIcon(assetType, color) {
    const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$infrastructure$2d$assets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getInfrastructureIconDef"])(assetType);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["divIcon"]({
        className: "majiscope-infrastructure-div-icon",
        iconSize: [
            17,
            17
        ],
        iconAnchor: [
            8.5,
            8.5
        ],
        popupAnchor: [
            0,
            -8.5
        ],
        html: `<span style="display:flex;height:17px;width:17px;align-items:center;justify-content:center;border-radius:9999px;background:${color};color:white;border:1.5px solid rgba(255,255,255,.96);box-shadow:0 8px 18px -14px rgba(15,23,42,.85);"><svg viewBox="${def.viewBox}" aria-hidden="true" style="height:11px;width:11px;filter:drop-shadow(0 1px 0 rgba(15,23,42,.18));">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$infrastructure$2d$assets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["infrastructureIconPathsHtml"])(assetType)}</svg></span>`
    });
}
function createInfrastructureLineStyle(color = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.infrastructure.color) {
    return {
        color,
        weight: 2,
        opacity: 0.76,
        fillColor: color,
        fillOpacity: 0.16
    };
}
function buildBoundaryPopupHtml(overlay) {
    const reported = overlay.reported ?? 0;
    const resolved = overlay.resolved ?? 0;
    const efficiency = reported > 0 ? Math.round(resolved / reported * 1000) / 10 : 0;
    const label = overlay.level === "utility" ? "Utility boundary" : "DMA boundary";
    return `<div style="width:220px;font-family:Inter,ui-sans-serif,system-ui;">
    <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${POPUP_MUTED};">${label}</div>
    <div style="margin-top:4px;font-size:14px;font-weight:700;color:${POPUP_TEXT};">${escapeHtml(overlay.label)}</div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px;text-align:center;">
      <div style="border-radius:10px;background:${POPUP_CARD};padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:${POPUP_TEXT};">${reported.toLocaleString()}</div>
        <div style="font-size:10px;color:${POPUP_MUTED};">Reported</div>
      </div>
      <div style="border-radius:10px;background:linear-gradient(135deg,${POPUP_SUCCESS_BG},${POPUP_SUCCESS_BG_STRONG});padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:${POPUP_SUCCESS_TEXT};">${resolved.toLocaleString()}</div>
        <div style="font-size:10px;color:${POPUP_MUTED};">Resolved</div>
      </div>
      <div style="border-radius:10px;background:linear-gradient(135deg,${POPUP_ACCENT_BG},${POPUP_ACCENT_BG_STRONG});padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:${POPUP_ACCENT_TEXT};">${efficiency}%</div>
        <div style="font-size:10px;color:${POPUP_MUTED};">Efficiency</div>
      </div>
    </div>
  </div>`;
}
function FitMapToData({ bounds, fitKey }) {
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMap"])();
    const lastAppliedFitKeyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        bounds,
        fitKey,
        map
    ]);
    return null;
}
function SyncMapSize() {
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const container = map.getContainer();
        const refresh = ()=>{
            window.requestAnimationFrame(()=>{
                map.invalidateSize();
            });
        };
        refresh();
        const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(()=>{
            refresh();
        }) : null;
        observer?.observe(container);
        window.addEventListener("resize", refresh);
        return ()=>{
            observer?.disconnect();
            window.removeEventListener("resize", refresh);
        };
    }, [
        map
    ]);
    return null;
}
function MapViewObserver({ onZoomChange, onViewChange }) {
    const emitViewState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((map)=>{
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
    }, [
        onViewChange,
        onZoomChange
    ]);
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapEvents"])({
        moveend: ()=>emitViewState(map),
        zoomend: ()=>emitViewState(map)
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        emitViewState(map);
    }, [
        emitViewState,
        map
    ]);
    return null;
}
function OperationsMap({ reports, aggregateMarkers = [], boundaryOverlays = [], center, boundaryGeojson, boundaryGeojsons = [], networkPreviewUrl, networkPreviewUrls = [], infrastructureLayers = [], networkFileName, title = "Leak operations map", description = "Monitor leak points, routing status, and pipe coverage from one field view.", basemap: controlledBasemap, onBasemapChange, onZoomChange, onViewChange, onReportSelect, chromeMode = "standard", boundsFitKey = "initial", initialBounds = null, preferInitialBounds = false }) {
    const networkUrls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const urls = new Set();
        if (networkPreviewUrl) urls.add(networkPreviewUrl);
        networkPreviewUrls.forEach((url)=>{
            if (url) urls.add(url);
        });
        return Array.from(urls);
    }, [
        networkPreviewUrl,
        networkPreviewUrls
    ]);
    const [showNetwork, setShowNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBoundaries, setShowBoundaries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localBasemap, setLocalBasemap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("street");
    const [networkLayers, setNetworkLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [assetLayers, setAssetLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [visibleAssetTypes, setVisibleAssetTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [networkLoading, setNetworkLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [assetLoadingTypes, setAssetLoadingTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [networkError, setNetworkError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [assetErrors, setAssetErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [controlsOpen, setControlsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mapZoom, setMapZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(13);
    const basemap = controlledBasemap ?? localBasemap;
    const isCommandCenter = chromeMode === "command-center";
    const isSatellite = basemap === "satellite";
    const isInfrastructureZoomSupported = mapZoom > 10;
    const shouldRenderNetwork = showNetwork && networkUrls.length > 0 && isInfrastructureZoomSupported;
    const isNationalBoundaryView = mapZoom <= NATIONAL_BOUNDARY_ZOOM;
    const fallbackBoundaryLevel = isNationalBoundaryView ? "utility" : "dma";
    const boundaryLayers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (boundaryOverlays.length) return boundaryOverlays;
        const fallbackLayers = boundaryGeojson ? [
            boundaryGeojson
        ] : boundaryGeojsons;
        return fallbackLayers.map((geojson, index)=>({
                id: `boundary-${index}`,
                label: fallbackBoundaryLevel === "utility" ? `Utility boundary ${index + 1}` : `DMA boundary ${index + 1}`,
                level: fallbackBoundaryLevel,
                geojson
            }));
    }, [
        boundaryGeojson,
        boundaryGeojsons,
        boundaryOverlays,
        fallbackBoundaryLevel
    ]);
    const activeBoundaryLevel = boundaryLayers[0]?.level ?? fallbackBoundaryLevel;
    const boundaryLayerLabel = activeBoundaryLevel === "utility" ? "utility boundaries" : "DMA boundaries";
    const hasBoundaryOverlays = boundaryLayers.length > 0;
    const visibleAggregateMarkers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>mapZoom < 5 ? [] : aggregateMarkers, [
        aggregateMarkers,
        mapZoom
    ]);
    const handleZoomChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((zoom)=>{
        setMapZoom(zoom);
        onZoomChange?.(zoom);
    }, [
        onZoomChange
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setVisibleAssetTypes((current)=>{
            const availableTypes = new Set(infrastructureLayers.map((layer)=>layer.assetType));
            const next = {};
            Object.entries(current).forEach(([assetType, visible])=>{
                if (availableTypes.has(assetType)) next[assetType] = visible;
            });
            const currentKeys = Object.keys(current);
            const nextKeys = Object.keys(next);
            if (currentKeys.length === nextKeys.length && nextKeys.every((key)=>current[key] === next[key])) {
                return current;
            }
            return next;
        });
    }, [
        infrastructureLayers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setShowBoundaries(hasBoundaryOverlays);
    }, [
        hasBoundaryOverlays
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadNetworkPreview() {
            if (!shouldRenderNetwork) {
                if (!cancelled) {
                    setNetworkLayers((current)=>current.length ? [] : current);
                    setNetworkError(null);
                    setNetworkLoading(false);
                }
                return;
            }
            const token = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.tokenKey);
            if (!token) {
                setNetworkError("Authentication is required to load the pipe network overlay.");
                return;
            }
            setNetworkLoading(true);
            setNetworkError(null);
            try {
                const results = await Promise.allSettled(networkUrls.map((url)=>loadNetworkLayer(url, token)));
                const loadedLayers = results.filter((result)=>result.status === "fulfilled").map((result)=>result.value);
                const failedLoads = results.filter((result)=>result.status === "rejected").map((result)=>result.reason instanceof Error ? result.reason.message : "A utility pipe network preview could not be loaded.");
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
        return ()=>{
            cancelled = true;
        };
    }, [
        networkUrls,
        shouldRenderNetwork
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadVisibleAssetLayers() {
            const visibleLayers = infrastructureLayers.filter((layer)=>isInfrastructureZoomSupported && visibleAssetTypes[layer.assetType] && layer.previewUrls.length);
            if (!visibleLayers.length) {
                if (!cancelled) {
                    setAssetLayers((current)=>Object.keys(current).length ? {} : current);
                    setAssetErrors((current)=>Object.keys(current).length ? {} : current);
                    setAssetLoadingTypes((current)=>Object.keys(current).length ? {} : current);
                }
                return;
            }
            const token = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.tokenKey);
            if (!token) {
                if (!cancelled) {
                    setAssetErrors(Object.fromEntries(visibleLayers.map((layer)=>[
                            layer.assetType,
                            "Authentication is required to load this infrastructure layer."
                        ])));
                }
                return;
            }
            setAssetLoadingTypes(Object.fromEntries(visibleLayers.map((layer)=>[
                    layer.assetType,
                    true
                ])));
            const nextLayers = {};
            const nextErrors = {};
            await Promise.all(visibleLayers.map(async (layer)=>{
                const results = await Promise.allSettled(layer.previewUrls.map((url)=>loadNetworkLayer(url, token)));
                const loadedLayers = results.filter((result)=>result.status === "fulfilled").map((result)=>result.value);
                const failedLoads = results.filter((result)=>result.status === "rejected");
                nextLayers[layer.assetType] = loadedLayers;
                nextErrors[layer.assetType] = loadedLayers.length && failedLoads.length ? `${failedLoads.length} ${layer.label.toLowerCase()} layer${failedLoads.length === 1 ? "" : "s"} could not be loaded.` : loadedLayers.length ? null : `${layer.label} could not be loaded.`;
            }));
            if (!cancelled) {
                setAssetLayers(nextLayers);
                setAssetErrors(nextErrors);
                setAssetLoadingTypes({});
            }
        }
        void loadVisibleAssetLayers();
        return ()=>{
            cancelled = true;
        };
    }, [
        infrastructureLayers,
        isInfrastructureZoomSupported,
        visibleAssetTypes
    ]);
    const validReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>reports.filter((report)=>Number.isFinite(report.latitude) && Number.isFinite(report.longitude) && !(report.latitude === 0 && report.longitude === 0)), [
        reports
    ]);
    const mapCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
            return center;
        }
        const networkPoints = networkLayers.flatMap((layer)=>collectGeoJsonCoordinates(layer));
        if (!validReports.length && networkPoints.length) {
            const averageLatitude = networkPoints.reduce((sum, point)=>sum + point[0], 0) / networkPoints.length;
            const averageLongitude = networkPoints.reduce((sum, point)=>sum + point[1], 0) / networkPoints.length;
            return [
                averageLatitude,
                averageLongitude
            ];
        }
        if (!validReports.length) {
            const validAggregateMarkers = aggregateMarkers.filter((marker)=>Number.isFinite(marker.latitude) && Number.isFinite(marker.longitude) && !(marker.latitude === 0 && marker.longitude === 0));
            if (validAggregateMarkers.length) {
                const averageLatitude = validAggregateMarkers.reduce((sum, marker)=>sum + marker.latitude, 0) / validAggregateMarkers.length;
                const averageLongitude = validAggregateMarkers.reduce((sum, marker)=>sum + marker.longitude, 0) / validAggregateMarkers.length;
                return [
                    averageLatitude,
                    averageLongitude
                ];
            }
            return DEFAULT_CENTER;
        }
        const averageLatitude = validReports.reduce((sum, report)=>sum + report.latitude, 0) / validReports.length;
        const averageLongitude = validReports.reduce((sum, report)=>sum + report.longitude, 0) / validReports.length;
        return [
            averageLatitude,
            averageLongitude
        ];
    }, [
        aggregateMarkers,
        center,
        networkLayers,
        validReports
    ]);
    const fitBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (preferInitialBounds && initialBounds) return initialBounds;
        const points = [
            ...validReports.map((report)=>[
                    report.latitude,
                    report.longitude
                ]),
            ...aggregateMarkers.filter((marker)=>Number.isFinite(marker.latitude) && Number.isFinite(marker.longitude)).map((marker)=>[
                    marker.latitude,
                    marker.longitude
                ]),
            ...showBoundaries ? boundaryLayers.flatMap((overlay)=>collectGeoJsonCoordinates(overlay.geojson)) : [],
            ...networkLayers.flatMap((layer)=>collectGeoJsonCoordinates(layer)),
            ...Object.values(assetLayers).flatMap((layers)=>layers.flatMap((layer)=>collectGeoJsonCoordinates(layer)))
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
    }, [
        aggregateMarkers,
        assetLayers,
        boundaryLayers,
        initialBounds,
        networkLayers,
        preferInitialBounds,
        showBoundaries,
        validReports
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full overflow-hidden rounded-[30px] border border-slate-300/85 bg-slate-100 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.4)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative h-full",
            children: [
                isCommandCenter ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    id: "5814aea7b9597d1",
                    children: ".majiscope-map--command-center .leaflet-top.leaflet-left{top:5.5rem;left:.5rem}.majiscope-map--command-center .leaflet-control-zoom a{color:#fffffff5;background:#0f172ad1;border-color:#ffffff24;box-shadow:0 14px 34px -22px #0f172ae6}.majiscope-map--command-center .leaflet-control-zoom a:hover{background:#1e293beb}.majiscope-map--command-center .leaflet-bottom.leaflet-right{bottom:.85rem;right:.75rem}.majiscope-map--command-center .leaflet-control-attribution{white-space:nowrap;text-overflow:ellipsis;color:#ffffffc7;opacity:.72;background:#0f172aad;border-radius:9999px;max-width:min(32vw,300px);padding:.12rem .42rem;font-size:9.5px;line-height:1.25;transition:max-width .18s,opacity .18s,background-color .18s;overflow:hidden;box-shadow:0 18px 45px -28px #0f172aeb}.majiscope-map--command-center .leaflet-control-attribution:hover,.majiscope-map--command-center .leaflet-control-attribution:focus-within{opacity:.96;background:#0f172ad1;max-width:min(64vw,720px)}.majiscope-map--command-center .leaflet-control-attribution a{color:#ffffffe6}.majiscope-map--command-center .leaflet-tile-pane{filter:contrast(1.08)saturate(1.04);opacity:1}.majiscope-boundary-tooltip{color:#0f172af5;letter-spacing:0;text-shadow:0 1px 1px #fffc;background:#ffffffe6;border:0;border-radius:9999px;padding:.18rem .55rem;font-size:15px;font-weight:900;line-height:1.1;box-shadow:0 10px 22px -14px #0f172a8c}.majiscope-boundary-tooltip:before{display:none}"
                }, void 0, false, void 0, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MapContainer"], {
                    center: mapCenter,
                    zoom: 13,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full", isCommandCenter && "majiscope-map--command-center"),
                    style: {
                        height: isCommandCenter ? "100%" : "min(72vh, 760px)",
                        minHeight: isCommandCenter ? "0" : "520px",
                        maxHeight: isCommandCenter ? "none" : "760px",
                        width: "100%"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SyncMapSize, {}, void 0, false, {
                            fileName: "[project]/components/maps/operations-map.tsx",
                            lineNumber: 894,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MapViewObserver, {
                            onZoomChange: handleZoomChange,
                            onViewChange: onViewChange
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map.tsx",
                            lineNumber: 895,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FitMapToData, {
                            bounds: fitBounds,
                            fitKey: boundsFitKey
                        }, void 0, false, {
                            fileName: "[project]/components/maps/operations-map.tsx",
                            lineNumber: 896,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TileLayer"], {
                            attribution: BASEMAPS[basemap].attribution,
                            url: BASEMAPS[basemap].url
                        }, basemap, false, {
                            fileName: "[project]/components/maps/operations-map.tsx",
                            lineNumber: 897,
                            columnNumber: 11
                        }, this),
                        showBoundaries ? boundaryLayers.map((overlay, index)=>{
                            const defaultStyle = DEFAULT_BOUNDARY_STYLE[overlay.level];
                            const color = overlay.color ?? defaultStyle.color;
                            const fillColor = overlay.color ?? defaultStyle.fillColor;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSON"], {
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
                                fileName: "[project]/components/maps/operations-map.tsx",
                                lineNumber: 910,
                                columnNumber: 17
                            }, this);
                        }) : null,
                        shouldRenderNetwork ? networkLayers.map((networkLayer, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSON"], {
                                data: networkLayer,
                                style: ()=>({
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.network.color,
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
                                fileName: "[project]/components/maps/operations-map.tsx",
                                lineNumber: 939,
                                columnNumber: 17
                            }, this)) : null,
                        infrastructureLayers.map((asset)=>isInfrastructureZoomSupported && visibleAssetTypes[asset.assetType] ? (assetLayers[asset.assetType] || []).map((assetLayer, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSON"], {
                                    data: assetLayer,
                                    pointToLayer: (_, latlng)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["marker"](latlng, {
                                            icon: createInfrastructureDivIcon(asset.assetType, asset.color)
                                        }),
                                    style: createInfrastructureLineStyle(asset.color),
                                    onEachFeature: (feature, layer)=>{
                                        if (!feature) return;
                                        const popupHtml = buildNetworkPopupHtml(feature);
                                        if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                                            layer.bindPopup(popupHtml.replace("Pipe Segment", escapeHtml(asset.label)));
                                        }
                                    }
                                }, `asset-${asset.assetType}-${index}`, false, {
                                    fileName: "[project]/components/maps/operations-map.tsx",
                                    lineNumber: 961,
                                    columnNumber: 19
                                }, this)) : null),
                        visibleAggregateMarkers.map((marker)=>{
                            const efficiency = marker.reported > 0 ? Math.round(marker.resolved / marker.reported * 1000) / 10 : 0;
                            const radius = marker.level === "utility" ? 5 : 6;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleMarker"], {
                                center: [
                                    marker.latitude,
                                    marker.longitude
                                ],
                                radius: radius,
                                pathOptions: {
                                    fillColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.aggregate.color,
                                    color: "#ffffff",
                                    fillOpacity: 0.82,
                                    weight: 2
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popup"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[230px] space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
                                                        children: marker.level === "utility" ? "Utility summary" : "DMA summary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 999,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "mt-1 text-sm font-semibold text-slate-900",
                                                        children: marker.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1002,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                lineNumber: 998,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-2 text-center text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl bg-slate-100 px-2 py-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-slate-900",
                                                                children: marker.reported.toLocaleString()
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1006,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Reported"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1007,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1005,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl bg-emerald-50 px-2 py-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-emerald-700",
                                                                children: marker.resolved.toLocaleString()
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1010,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Resolved"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1011,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1009,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl bg-sky-50 px-2 py-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-sky-700",
                                                                children: [
                                                                    efficiency,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1014,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-0.5 text-slate-500",
                                                                children: "Efficiency"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1015,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1013,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                lineNumber: 1004,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/operations-map.tsx",
                                        lineNumber: 997,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map.tsx",
                                    lineNumber: 996,
                                    columnNumber: 19
                                }, this)
                            }, `aggregate-${marker.level}-${marker.id}`, false, {
                                fileName: "[project]/components/maps/operations-map.tsx",
                                lineNumber: 985,
                                columnNumber: 17
                            }, this);
                        }),
                        validReports.map((report)=>{
                            const meta = getStatusMeta(report.status);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleMarker"], {
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
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popup"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[250px] space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
                                                        children: meta.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1041,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-sans text-sm font-extrabold tracking-[0.04em] text-slate-900",
                                                        children: report.trackingId
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1044,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "line-clamp-3 text-sm text-slate-600",
                                                        children: report.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1045,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                lineNumber: 1040,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2 text-xs text-slate-600",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__["Route"], {
                                                                className: "mt-0.5 h-3.5 w-3.5 text-slate-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1050,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: getLocationLabel(report)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1051,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1049,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-2",
                                                        children: [
                                                            report.utilityName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700",
                                                                children: report.utilityName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1055,
                                                                columnNumber: 29
                                                            }, this) : null,
                                                            report.dmaName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-cyan-50 px-2.5 py-1 font-medium text-cyan-800",
                                                                children: report.dmaName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1060,
                                                                columnNumber: 29
                                                            }, this) : null,
                                                            report.priority ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "rounded-full bg-amber-50 px-2.5 py-1 font-medium capitalize text-amber-800",
                                                                children: report.priority
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1065,
                                                                columnNumber: 29
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1053,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                lineNumber: 1048,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                className: "w-full",
                                                onClick: ()=>onReportSelect?.(report.trackingId || report.id),
                                                children: "Open report"
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                lineNumber: 1072,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/operations-map.tsx",
                                        lineNumber: 1039,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map.tsx",
                                    lineNumber: 1038,
                                    columnNumber: 19
                                }, this)
                            }, report.id, false, {
                                fileName: "[project]/components/maps/operations-map.tsx",
                                lineNumber: 1027,
                                columnNumber: 17
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/operations-map.tsx",
                    lineNumber: 883,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none absolute top-4 z-[1000] flex items-start gap-3", isCommandCenter ? "right-4 justify-end" : "inset-x-4 justify-between"),
                    children: [
                        !isCommandCenter ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-auto rounded-xl border border-slate-300/80 bg-slate-100/88 px-3 py-2 shadow-lg shadow-slate-900/8 backdrop-blur",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map.tsx",
                                    lineNumber: 1090,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-xs text-slate-500",
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/operations-map.tsx",
                                    lineNumber: 1093,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/operations-map.tsx",
                            lineNumber: 1089,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-auto ml-auto flex flex-col items-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                size: "icon",
                                                variant: "outline",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-10 w-10 rounded-2xl shadow-lg backdrop-blur-xl", isSatellite ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30 hover:bg-slate-900" : "border-slate-300/80 bg-slate-100/90 text-slate-900 shadow-slate-900/8 hover:bg-slate-200 dark:border-slate-500/80 dark:bg-black/90 dark:text-white dark:shadow-black/45 dark:hover:bg-black"),
                                                "aria-label": controlsOpen ? "Collapse map controls" : "Expand map controls",
                                                onClick: ()=>setControlsOpen((current)=>!current),
                                                children: controlsOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                    lineNumber: 1113,
                                                    columnNumber: 35
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                    lineNumber: 1113,
                                                    columnNumber: 73
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                lineNumber: 1100,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map.tsx",
                                            lineNumber: 1099,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                            align: "end",
                                            children: controlsOpen ? "Collapse map controls" : "Expand map controls"
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map.tsx",
                                            lineNumber: 1116,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/operations-map.tsx",
                                    lineNumber: 1098,
                                    columnNumber: 13
                                }, this),
                                controlsOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-xl", isSatellite ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30" : "border-slate-300/80 bg-slate-100/88 text-slate-900 shadow-slate-900/8 dark:border-slate-600/80 dark:bg-slate-900/88 dark:text-white dark:shadow-slate-950/35"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-2",
                                                    children: Object.entries(BASEMAPS).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
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
                                                            fileName: "[project]/components/maps/operations-map.tsx",
                                                            lineNumber: 1133,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                    lineNumber: 1131,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    size: "sm",
                                                    variant: showNetwork ? "default" : "outline",
                                                    className: showNetwork ? "h-8 justify-start rounded-xl border-slate-300 bg-white/70 px-3 text-slate-700 hover:bg-slate-200 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200" : isSatellite ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200",
                                                    onClick: ()=>setShowNetwork((current)=>!current),
                                                    disabled: (!networkUrls.length || !isInfrastructureZoomSupported) && !showNetwork,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mr-2 h-2 w-2 shrink-0 rounded-full",
                                                            style: {
                                                                backgroundColor: showNetwork ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.infrastructure.color : "currentColor",
                                                                opacity: showNetwork ? 1 : 0.35
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/maps/operations-map.tsx",
                                                            lineNumber: 1169,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$infrastructure$2d$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InfrastructureIcon"], {
                                                            assetType: "pipe_network",
                                                            className: "mr-1.5 h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/maps/operations-map.tsx",
                                                            lineNumber: 1176,
                                                            columnNumber: 21
                                                        }, this),
                                                        showNetwork ? "Hide pipe network" : "Show pipe network"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                    lineNumber: 1155,
                                                    columnNumber: 19
                                                }, this),
                                                infrastructureLayers.map((asset)=>{
                                                    const visible = Boolean(visibleAssetTypes[asset.assetType]);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        size: "sm",
                                                        variant: visible ? "default" : "outline",
                                                        className: visible ? "h-8 justify-start rounded-xl border-slate-300 bg-white/70 px-3 text-slate-700 hover:bg-slate-200 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200" : isSatellite ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200",
                                                        onClick: ()=>setVisibleAssetTypes((current)=>({
                                                                    ...current,
                                                                    [asset.assetType]: !current[asset.assetType]
                                                                })),
                                                        disabled: (!asset.previewUrls.length || !isInfrastructureZoomSupported) && !visible,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "mr-2 h-2 w-2 shrink-0 rounded-full",
                                                                style: {
                                                                    backgroundColor: visible ? asset.color : "currentColor",
                                                                    opacity: visible ? 1 : 0.35
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1203,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$infrastructure$2d$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InfrastructureIcon"], {
                                                                assetType: asset.assetType,
                                                                className: "mr-1.5 h-3.5 w-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                                lineNumber: 1210,
                                                                columnNumber: 25
                                                            }, this),
                                                            visible ? `Hide ${asset.label}` : `Show ${asset.label}`
                                                        ]
                                                    }, asset.assetType, true, {
                                                        fileName: "[project]/components/maps/operations-map.tsx",
                                                        lineNumber: 1183,
                                                        columnNumber: 23
                                                    }, this);
                                                }),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    size: "sm",
                                                    variant: showBoundaries ? "default" : "outline",
                                                    className: showBoundaries ? "h-8 justify-start rounded-xl border-slate-300 bg-white/70 px-3 text-slate-700 hover:bg-slate-200 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200" : isSatellite ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12" : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200",
                                                    onClick: ()=>setShowBoundaries((current)=>!current),
                                                    disabled: !hasBoundaryOverlays,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mr-2 h-2 w-2 shrink-0 rounded-full",
                                                            style: {
                                                                backgroundColor: showBoundaries ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.boundary.color : "currentColor",
                                                                opacity: showBoundaries ? 1 : 0.35
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/maps/operations-map.tsx",
                                                            lineNumber: 1229,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__["MapPinned"], {
                                                            className: "mr-1.5 h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/maps/operations-map.tsx",
                                                            lineNumber: 1236,
                                                            columnNumber: 21
                                                        }, this),
                                                        showBoundaries ? `Hide ${boundaryLayerLabel}` : `Show ${boundaryLayerLabel}`
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                    lineNumber: 1215,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/operations-map.tsx",
                                            lineNumber: 1130,
                                            columnNumber: 17
                                        }, this),
                                        showBoundaries && boundaryOverlays.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 max-w-[240px] rounded-xl border px-2 py-2 text-left", isSatellite ? "border-white/12 bg-white/8 text-white/86" : "border-slate-300/70 bg-white/55 text-slate-700 dark:border-slate-700 dark:bg-slate-950/45 dark:text-slate-200"),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75",
                                                    children: "Boundary legend"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                    lineNumber: 1249,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid max-h-32 gap-1 overflow-y-auto pr-1",
                                                    children: boundaryOverlays.map((overlay)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-3 text-[11px]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "flex min-w-0 items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "h-2.5 w-2.5 shrink-0 rounded-full",
                                                                            style: {
                                                                                backgroundColor: overlay.color ?? DEFAULT_BOUNDARY_STYLE[overlay.level].color
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/maps/operations-map.tsx",
                                                                            lineNumber: 1256,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "truncate",
                                                                            children: overlay.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/maps/operations-map.tsx",
                                                                            lineNumber: 1260,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                                    lineNumber: 1255,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "shrink-0 font-semibold",
                                                                    children: (overlay.reported ?? 0).toLocaleString()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                                    lineNumber: 1262,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, `legend-${overlay.level}-${overlay.id}`, true, {
                                                            fileName: "[project]/components/maps/operations-map.tsx",
                                                            lineNumber: 1254,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/operations-map.tsx",
                                                    lineNumber: 1252,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/operations-map.tsx",
                                            lineNumber: 1241,
                                            columnNumber: 19
                                        }, this) : null,
                                        networkLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500"),
                                            children: "Loading network..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map.tsx",
                                            lineNumber: 1269,
                                            columnNumber: 19
                                        }, this) : null,
                                        !networkLoading && shouldRenderNetwork && networkError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 max-w-[240px] text-right text-[11px] text-rose-600",
                                            children: networkError
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map.tsx",
                                            lineNumber: 1274,
                                            columnNumber: 19
                                        }, this) : null,
                                        infrastructureLayers.some((asset)=>assetLoadingTypes[asset.assetType]) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500"),
                                            children: "Loading infrastructure..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/maps/operations-map.tsx",
                                            lineNumber: 1277,
                                            columnNumber: 19
                                        }, this) : null,
                                        infrastructureLayers.map((asset)=>visibleAssetTypes[asset.assetType] && assetErrors[asset.assetType] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 max-w-[240px] text-right text-[11px] text-rose-600",
                                                children: assetErrors[asset.assetType]
                                            }, `asset-error-${asset.assetType}`, false, {
                                                fileName: "[project]/components/maps/operations-map.tsx",
                                                lineNumber: 1283,
                                                columnNumber: 21
                                            }, this) : null)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/operations-map.tsx",
                                    lineNumber: 1122,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/operations-map.tsx",
                            lineNumber: 1097,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/operations-map.tsx",
                    lineNumber: 1082,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/maps/operations-map.tsx",
            lineNumber: 804,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/maps/operations-map.tsx",
        lineNumber: 803,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/select.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-ssr] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1', className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 29,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 28,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex cursor-default items-center justify-center py-1', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 47,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 39,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex cursor-default items-center justify-center py-1', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 56,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
const SelectContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, children, position = 'popper', ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded-md border-0 p-0 bg-popover text-popover-foreground shadow-lg shadow-slate-200/50 backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1', className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 86,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 87,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 96,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 75,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('py-1.5 pl-8 pr-2 text-sm font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 106,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"].displayName;
const SelectItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 127,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 126,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 132,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 118,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Item"].displayName;
const SelectSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('-mx-1 my-1 h-px bg-muted', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 141,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
}),
"[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('fixed inset-0 z-[5000] bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('fixed left-[50%] top-[50%] z-[5001] grid max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto overscroll-contain border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg', className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 48,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 49,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/dialog.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col space-y-1.5 text-center sm:text-left', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
DialogHeader.displayName = 'DialogHeader';
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
DialogFooter.displayName = 'DialogFooter';
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-lg font-semibold leading-none tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-sm text-muted-foreground', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}),
"[project]/lib/report-metrics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeLeakKpis",
    ()=>computeLeakKpis,
    "computeLeakageTypeDistribution",
    ()=>computeLeakageTypeDistribution,
    "computeReportTypeDistribution",
    ()=>computeReportTypeDistribution,
    "getSimpleMapStatusMeta",
    ()=>getSimpleMapStatusMeta,
    "hasUsableCoordinates",
    ()=>hasUsableCoordinates,
    "isResolvedReport",
    ()=>isResolvedReport,
    "isUnattendedReport",
    ()=>isUnattendedReport,
    "isUrgentReport",
    ()=>isUrgentReport,
    "normalizeLeakageType",
    ()=>normalizeLeakageType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/palette.ts [app-ssr] (ecmascript)");
;
;
const LEAKAGE_TYPE_KEYS = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEAKAGE_TYPE_CONFIG"]);
function hasUsableCoordinates(report) {
    return Number.isFinite(report.latitude) && Number.isFinite(report.longitude) && !(report.latitude === 0 && report.longitude === 0);
}
function isResolvedReport(status) {
    return status === "approved" || status === "closed";
}
function isUnattendedReport(status) {
    return status === "new" || status === "assigned" || status === "in_progress";
}
function isUrgentReport(priority) {
    return priority === "critical" || priority === "high";
}
function getSimpleMapStatusMeta(status) {
    if (status === "pending_approval") {
        return {
            label: "Awaiting approval",
            fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.pendingApproval.fill,
            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.pendingApproval.stroke
        };
    }
    if (isResolvedReport(status)) {
        return {
            label: status === "closed" ? "Closed" : "Repaired",
            fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.resolved.fill,
            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.resolved.stroke
        };
    }
    return {
        label: "Open",
        fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.open.fill,
        stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.status.open.stroke
    };
}
function computeLeakKpis(reports) {
    return {
        total: reports.length,
        repaired: reports.filter((report)=>isResolvedReport(report.status)).length,
        urgent: reports.filter((report)=>isUrgentReport(report.priority)).length,
        unattended: reports.filter((report)=>isUnattendedReport(report.status)).length,
        withCoordinates: reports.filter(hasUsableCoordinates).length
    };
}
function normalizeLeakageType(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return LEAKAGE_TYPE_KEYS.includes(normalized) ? normalized : "unknown";
}
function computeLeakageTypeDistribution(reports) {
    const counts = new Map(LEAKAGE_TYPE_KEYS.map((type)=>[
            type,
            0
        ]));
    const leakageReports = reports.filter((report)=>(report.reportType || "leakage") === "leakage");
    leakageReports.forEach((report)=>{
        const type = normalizeLeakageType(report.leakageType);
        counts.set(type, (counts.get(type) || 0) + 1);
    });
    const total = Math.max(leakageReports.length, 1);
    return LEAKAGE_TYPE_KEYS.map((type)=>{
        const count = counts.get(type) || 0;
        const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEAKAGE_TYPE_CONFIG"][type];
        return {
            type,
            name: config.label,
            count,
            percentage: Math.round(count / total * 1000) / 10,
            fill: config.color
        };
    }).filter((row)=>row.count > 0);
}
function computeReportTypeDistribution(reports) {
    const reportTypes = [
        {
            type: "leakage",
            name: "Leakage",
            fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart1
        },
        {
            type: "non_leakage",
            name: "Non-leakage",
            fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.base
        }
    ];
    const counts = new Map(reportTypes.map(({ type })=>[
            type,
            0
        ]));
    reports.forEach((report)=>{
        const type = report.reportType === "non_leakage" ? "non_leakage" : "leakage";
        counts.set(type, (counts.get(type) || 0) + 1);
    });
    const total = Math.max(reports.length, 1);
    return reportTypes.map(({ type, name, fill })=>{
        const count = counts.get(type) || 0;
        return {
            type,
            name,
            count,
            percentage: Math.round(count / total * 1000) / 10,
            fill
        };
    }).filter((row)=>row.count > 0);
}
}),
"[project]/components/dashboard/operations-dashboard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OperationsDashboard",
    ()=>OperationsDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$data$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/data-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$maps$2f$operations$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/maps/operations-map.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$topbar$2d$title$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/topbar-title-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/palette.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$report$2d$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/report-metrics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-ssr] (ecmascript)");
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
;
;
;
;
;
;
;
function KpiCard({ label, value, tone }) {
    const toneClasses = {
        slate: "border-slate-300/80 bg-slate-100/85 text-slate-950",
        green: "border-slate-300/80 bg-slate-100/85 text-emerald-600",
        red: "border-slate-300/80 bg-slate-100/85 text-rose-600",
        amber: "border-slate-300/80 bg-slate-100/85 text-amber-600"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-full min-h-[92px] items-center rounded-[18px] border px-4 py-3 shadow-sm shadow-slate-900/[0.03]", toneClasses[tone]),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "max-w-[9rem] text-[0.72rem] font-bold uppercase leading-snug tracking-[0.14em] text-slate-600",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-3 text-[2.15rem] font-bold leading-none tracking-tight",
                    children: value.toLocaleString()
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
const CHART_AXIS_TICK = {
    fill: "var(--chart-axis-text)",
    fontSize: 10
};
const CHART_GRID = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.bg;
const CHART_AXIS_LINE = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.base;
const CHART_TOOLTIP_BG = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.bg;
const CHART_TOOLTIP_BORDER = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.base;
const CHART_TEXT = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.text;
const CHART_LEGEND_TEXT = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.strong;
const TANZANIA_BOUNDS = [
    [
        -11.9,
        28.8
    ],
    [
        -0.95,
        41.25
    ]
];
const BOUNDARY_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].map.boundary.color;
function isOperationsMapBoundaryOverlay(overlay) {
    return Boolean(overlay);
}
function isOperationsMapAggregateMarker(marker) {
    return Boolean(marker);
}
function isResolvedStatus(status) {
    return status === "approved" || status === "closed";
}
function isPointInRing(point, ring) {
    const [latitude, longitude] = point;
    let inside = false;
    for(let i = 0, j = ring.length - 1; i < ring.length; j = i++){
        const current = ring[i];
        const previous = ring[j];
        if (!current || !previous || current.length < 2 || previous.length < 2) continue;
        const currentLng = Number(current[0]);
        const currentLat = Number(current[1]);
        const previousLng = Number(previous[0]);
        const previousLat = Number(previous[1]);
        const intersects = currentLat > latitude !== previousLat > latitude && longitude < (previousLng - currentLng) * (latitude - currentLat) / (previousLat - currentLat || Number.EPSILON) + currentLng;
        if (intersects) inside = !inside;
    }
    return inside;
}
function isPointInPolygon(point, polygon) {
    if (!polygon.length || !isPointInRing(point, polygon[0])) return false;
    return !polygon.slice(1).some((hole)=>isPointInRing(point, hole));
}
function isPointInBoundary(point, boundary) {
    if (!boundary || typeof boundary !== "object") return false;
    const geometry = boundary;
    if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
        return isPointInPolygon(point, geometry.coordinates);
    }
    if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
        return geometry.coordinates.some((polygon)=>isPointInPolygon(point, polygon));
    }
    return false;
}
function ComparisonBarChartView({ rows, height, leftMargin = -10 }) {
    const maxValue = Math.max(...rows.flatMap((row)=>[
            row.reported,
            row.resolved
        ]), 1);
    const formatAxisLabel = (value)=>value.length > 18 ? `${value.slice(0, 17)}...` : value;
    const chartData = rows.map((row)=>({
            name: row.label,
            reported: row.reported,
            resolved: row.resolved
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-0",
        style: {
            height
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
            width: "100%",
            height: "100%",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BarChart"], {
                data: chartData,
                layout: "vertical",
                margin: {
                    top: 8,
                    right: 8,
                    left: leftMargin,
                    bottom: 8
                },
                barCategoryGap: 12,
                barGap: 2,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                        stroke: CHART_GRID,
                        horizontal: true,
                        vertical: true
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                        type: "number",
                        domain: [
                            0,
                            Math.ceil(maxValue * 1.05)
                        ],
                        tick: CHART_AXIS_TICK,
                        axisLine: {
                            stroke: CHART_AXIS_LINE
                        },
                        tickLine: {
                            stroke: CHART_AXIS_LINE
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                        type: "category",
                        dataKey: "name",
                        width: 108,
                        tick: CHART_AXIS_TICK,
                        tickFormatter: formatAxisLabel,
                        axisLine: {
                            stroke: CHART_AXIS_LINE
                        },
                        tickLine: false
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 197,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                        cursor: {
                            fill: "rgba(148, 163, 184, 0.12)"
                        },
                        contentStyle: {
                            background: CHART_TOOLTIP_BG,
                            border: `1px solid ${CHART_TOOLTIP_BORDER}`,
                            borderRadius: 10,
                            color: CHART_TEXT
                        },
                        formatter: (value, name)=>[
                                value.toLocaleString(),
                                name === "reported" ? "Reported" : "Resolved"
                            ],
                        labelStyle: {
                            color: CHART_TEXT,
                            fontWeight: 600
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 206,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Legend"], {
                        iconType: "circle",
                        wrapperStyle: {
                            fontSize: 11,
                            color: CHART_LEGEND_TEXT,
                            paddingTop: 8
                        },
                        formatter: (value)=>value === "reported" ? "Reported" : "Resolved"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Bar"], {
                        dataKey: "reported",
                        fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart1,
                        radius: 0,
                        barSize: 8
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 225,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Bar"], {
                        dataKey: "resolved",
                        fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart2,
                        radius: 0,
                        barSize: 8
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                lineNumber: 182,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
            lineNumber: 181,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
}
function ComparisonBarChartCard({ title, subtitle, rows }) {
    const [allOpen, setAllOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dashboardRowLimit = 3;
    const visibleRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const limit = dashboardRowLimit;
        if (rows.length <= limit) return rows;
        const primaryRows = rows.slice(0, limit);
        const remainingRows = rows.slice(limit);
        const otherRow = remainingRows.reduce((total, row)=>({
                label: "Other",
                reported: total.reported + row.reported,
                resolved: total.resolved + row.resolved
            }), {
            label: "Other",
            reported: 0,
            resolved: 0
        });
        return otherRow.reported || otherRow.resolved ? [
            ...primaryRows,
            otherRow
        ] : primaryRows;
    }, [
        rows,
        dashboardRowLimit
    ]);
    const hasAggregatedRows = rows.length > dashboardRowLimit;
    const chartHeight = "100%";
    const fullChartHeight = Math.max(360, Math.min(960, rows.length * 42 + 120));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-full min-h-[220px] flex-col overflow-hidden rounded-[18px] border border-slate-300/80 bg-slate-100/85 shadow-sm shadow-slate-900/[0.025]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-3 border-b border-slate-200 px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold text-slate-900",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 truncate text-[11px] text-slate-500",
                                        children: subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                        lineNumber: 271,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            hasAggregatedRows ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "sm",
                                className: "h-7 shrink-0 rounded-lg bg-gradient-to-r from-sky-700 to-cyan-700 px-3 text-xs font-semibold text-white shadow-sm shadow-slate-900/15 hover:from-sky-800 hover:to-cyan-800",
                                onClick: ()=>setAllOpen(true),
                                children: "View all"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-0 flex-1 overflow-hidden px-2 py-2",
                        children: visibleRows.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ComparisonBarChartView, {
                            rows: visibleRows,
                            height: chartHeight
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 287,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-full min-h-[120px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500",
                            children: "No reports available for this scope yet."
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 289,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                open: allOpen,
                onOpenChange: setAllOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-h-[88vh] max-w-5xl overflow-hidden rounded-2xl p-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            className: "border-b border-slate-200 px-5 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                    lineNumber: 299,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: subtitle
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                    lineNumber: 300,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 298,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-h-[calc(88vh-6rem)] overflow-y-auto px-5 py-4",
                            children: rows.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ComparisonBarChartView, {
                                rows: rows,
                                height: fullChartHeight,
                                leftMargin: 16
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                lineNumber: 304,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500",
                                children: "No reports available for this scope yet."
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                lineNumber: 306,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 302,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                    lineNumber: 297,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                lineNumber: 296,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function LeakageTypeDonutCard({ rows }) {
    const total = rows.reduce((sum, row)=>sum + row.count, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-[210px] flex-col overflow-hidden rounded-[18px] border border-slate-300/80 bg-slate-100/85 shadow-sm shadow-slate-900/[0.025]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-slate-200 px-3 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold text-slate-900",
                        children: "Leakage by type"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 323,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[11px] text-slate-500",
                        children: "Reported leakage type"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col justify-between gap-2 px-2 py-2.5",
                children: total ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-[108px] shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: "100%",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PieChart"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pie"], {
                                            data: rows,
                                            dataKey: "count",
                                            nameKey: "name",
                                            innerRadius: 30,
                                            outerRadius: 48,
                                            paddingAngle: 2,
                                            stroke: "transparent",
                                            children: rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cell"], {
                                                    fill: row.fill
                                                }, row.type, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 343,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 333,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            formatter: (value, _name, props)=>[
                                                    `${value.toLocaleString()} (${props.payload.percentage}%)`,
                                                    props.payload.name
                                                ]
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 346,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                    lineNumber: 332,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                lineNumber: 331,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 330,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid shrink-0 gap-1.5 px-1 pb-0.5 text-[11px]",
                            children: rows.slice(0, 3).map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between gap-2 text-slate-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex min-w-0 items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-2.5 w-2.5 rounded-full",
                                                    style: {
                                                        backgroundColor: row.fill
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 359,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate text-slate-700 dark:text-white",
                                                    children: row.name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 358,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-slate-800 dark:text-white",
                                            children: [
                                                row.percentage,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 362,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, row.type, true, {
                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                    lineNumber: 357,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 355,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full min-h-[120px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500",
                    children: "No leakage type data available yet."
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                    lineNumber: 368,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
        lineNumber: 321,
        columnNumber: 5
    }, this);
}
function OperationsDashboard() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { setTitle: setTopbarTitle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$topbar$2d$title$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTopbarTitle"])();
    const { utilities, dmas, reports, reportsListTotal, initialized, fetchUtilities, fetchDMAs, fetchReportsForMap } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$data$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDataStore"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedUtilityId, setSelectedUtilityId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [selectedDMAId, setSelectedDMAId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [basemap, setBasemap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("street");
    const [mapZoom, setMapZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(6);
    const [mapViewCenter, setMapViewCenter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const isAdmin = currentUser?.role === "admin";
    const isUtility = currentUser?.role === "utility_manager";
    const isDMA = currentUser?.role === "dma_manager";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function loadData() {
            if (!currentUser) return;
            setLoading(true);
            try {
                await fetchUtilities();
                await Promise.all([
                    fetchDMAs(isUtility ? currentUser.utilityId ?? undefined : undefined),
                    fetchReportsForMap(isDMA ? {
                        dmaId: currentUser.dmaId ?? ""
                    } : isUtility ? {
                        utilityId: currentUser.utilityId ?? ""
                    } : undefined)
                ]);
            } finally{
                setLoading(false);
            }
        }
        void loadData();
    }, [
        currentUser,
        fetchDMAs,
        fetchReportsForMap,
        fetchUtilities,
        isDMA,
        isUtility
    ]);
    const currentDMA = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>dmas.find((dma)=>dma.id === currentUser?.dmaId) ?? null, [
        currentUser?.dmaId,
        dmas
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isUtility && currentUser?.utilityId) {
            setSelectedUtilityId(currentUser.utilityId);
        }
    }, [
        currentUser?.utilityId,
        isUtility
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isDMA && currentUser?.dmaId) {
            setSelectedDMAId(currentUser.dmaId);
            if (currentDMA?.utilityId) {
                setSelectedUtilityId(currentDMA.utilityId);
            }
        }
    }, [
        currentDMA?.utilityId,
        currentUser?.dmaId,
        isDMA
    ]);
    const visibleUtilities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (isUtility && currentUser?.utilityId) {
            return utilities.filter((utility)=>utility.id === currentUser.utilityId);
        }
        if (isDMA && currentDMA?.utilityId) {
            return utilities.filter((utility)=>utility.id === currentDMA.utilityId);
        }
        return utilities;
    }, [
        currentDMA?.utilityId,
        currentUser?.utilityId,
        isDMA,
        isUtility,
        utilities
    ]);
    const dashboardLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (isDMA) {
            return mapZoom <= 11 ? "dma" : "detail";
        }
        if (selectedDMAId !== "all") {
            return mapZoom <= 11 ? "dma" : "detail";
        }
        if (isUtility || selectedUtilityId !== "all") {
            if (mapZoom <= 9) return "utility";
            if (mapZoom <= 12) return "dma";
            return "detail";
        }
        if (mapZoom <= 7) return "national";
        if (mapZoom <= 10) return "utility";
        if (mapZoom <= 12) return "dma";
        return "detail";
    }, [
        isDMA,
        isUtility,
        mapZoom,
        selectedDMAId,
        selectedUtilityId
    ]);
    const mapFocusedUtilityId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!isAdmin || selectedUtilityId !== "all" || selectedDMAId !== "all") return null;
        if (dashboardLevel !== "utility" && dashboardLevel !== "dma" && dashboardLevel !== "detail") return null;
        if (!mapViewCenter) return null;
        return visibleUtilities.find((utility)=>isPointInBoundary(mapViewCenter, utility.boundaryGeojson))?.id ?? null;
    }, [
        dashboardLevel,
        isAdmin,
        mapViewCenter,
        selectedDMAId,
        selectedUtilityId,
        visibleUtilities
    ]);
    const effectiveUtilityId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (selectedUtilityId !== "all") return selectedUtilityId;
        if (isUtility) return currentUser?.utilityId ?? null;
        if (isDMA) return currentDMA?.utilityId ?? null;
        return mapFocusedUtilityId;
    }, [
        currentDMA?.utilityId,
        currentUser?.utilityId,
        isDMA,
        isUtility,
        mapFocusedUtilityId,
        selectedUtilityId
    ]);
    const visibleDMAs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const base = isDMA && currentUser?.dmaId ? dmas.filter((dma)=>dma.id === currentUser.dmaId) : dmas;
        if (!effectiveUtilityId) return base;
        return base.filter((dma)=>dma.utilityId === effectiveUtilityId);
    }, [
        currentUser?.dmaId,
        dmas,
        effectiveUtilityId,
        isDMA
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedDMAId !== "all" && !visibleDMAs.some((dma)=>dma.id === selectedDMAId)) {
            setSelectedDMAId("all");
        }
    }, [
        selectedDMAId,
        visibleDMAs
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isAdmin && selectedUtilityId === "all" && selectedDMAId !== "all") {
            setSelectedDMAId("all");
        }
    }, [
        isAdmin,
        selectedDMAId,
        selectedUtilityId
    ]);
    const scopedReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!currentUser) return [];
        if (isAdmin) return reports;
        if (isUtility && currentUser.utilityId) {
            return reports.filter((report)=>report.utilityId === currentUser.utilityId);
        }
        if (isDMA && currentUser.dmaId) {
            return reports.filter((report)=>report.dmaId === currentUser.dmaId);
        }
        return [];
    }, [
        currentUser,
        isAdmin,
        isDMA,
        isUtility,
        reports
    ]);
    const filteredReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return scopedReports.filter((report)=>{
            const matchesUtility = effectiveUtilityId ? report.utilityId === effectiveUtilityId : true;
            const matchesDMA = selectedDMAId === "all" ? true : report.dmaId === selectedDMAId;
            return matchesUtility && matchesDMA;
        });
    }, [
        effectiveUtilityId,
        scopedReports,
        selectedDMAId
    ]);
    const mapReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>filteredReports.filter(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$report$2d$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasUsableCoordinates"]), [
        filteredReports
    ]);
    const kpis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$report$2d$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeLeakKpis"])(filteredReports), [
        filteredReports
    ]);
    const leakageTypeRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$report$2d$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeLeakageTypeDistribution"])(filteredReports), [
        filteredReports
    ]);
    const comparisonRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (isAdmin && dashboardLevel !== "dma" && dashboardLevel !== "detail") {
            const rows = new Map();
            visibleUtilities.forEach((utility)=>{
                rows.set(utility.id, {
                    label: utility.name,
                    reported: 0,
                    resolved: 0
                });
            });
            filteredReports.forEach((report)=>{
                const key = report.utilityId || `utility:${report.utilityName || "Unassigned utility"}`;
                const current = rows.get(key) ?? {
                    label: report.utilityName || "Unassigned utility",
                    reported: 0,
                    resolved: 0
                };
                current.reported += 1;
                if (isResolvedStatus(report.status)) current.resolved += 1;
                rows.set(key, current);
            });
            return Array.from(rows.values()).sort((left, right)=>right.reported - left.reported);
        }
        if ((isUtility || isAdmin && selectedUtilityId !== "all") && dashboardLevel === "utility") {
            const utilityLabel = visibleUtilities.find((utility)=>utility.id === selectedUtilityId)?.name || visibleUtilities[0]?.name || "Current utility";
            return [
                {
                    label: utilityLabel,
                    reported: filteredReports.length,
                    resolved: filteredReports.filter((report)=>isResolvedStatus(report.status)).length
                }
            ];
        }
        if (isAdmin || isUtility) {
            const rows = new Map();
            const visibleDMAIds = new Set(visibleDMAs.map((dma)=>dma.id));
            visibleDMAs.forEach((dma)=>{
                rows.set(dma.id, {
                    label: dma.name,
                    reported: 0,
                    resolved: 0
                });
            });
            filteredReports.forEach((report)=>{
                if (!report.dmaId || !visibleDMAIds.has(report.dmaId)) return;
                const key = report.dmaId || `dma:${report.dmaName || "Unassigned DMA"}`;
                const current = rows.get(key) ?? {
                    label: report.dmaName || "Unassigned DMA",
                    reported: 0,
                    resolved: 0
                };
                current.reported += 1;
                if (isResolvedStatus(report.status)) current.resolved += 1;
                rows.set(key, current);
            });
            return Array.from(rows.values()).sort((left, right)=>right.reported - left.reported);
        }
        if (isDMA) {
            return [
                {
                    label: currentDMA?.name || "Current DMA",
                    reported: filteredReports.length,
                    resolved: filteredReports.filter((report)=>isResolvedStatus(report.status)).length
                }
            ];
        }
        return [];
    }, [
        currentDMA?.name,
        dashboardLevel,
        filteredReports,
        isAdmin,
        isDMA,
        isUtility,
        selectedUtilityId,
        visibleDMAs,
        visibleUtilities
    ]);
    const comparisonSubtitle = dashboardLevel === "national" ? "Reported vs resolved per utility" : dashboardLevel === "utility" ? "Reported vs resolved for the active utility scope" : dashboardLevel === "dma" ? "Reported vs resolved per DMA" : "Reported vs resolved in detail scope";
    const activeDMA = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>dmas.find((dma)=>dma.id === selectedDMAId) ?? null, [
        dmas,
        selectedDMAId
    ]);
    const activeUtilityId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (effectiveUtilityId) return effectiveUtilityId;
        if (activeDMA?.utilityId) return activeDMA.utilityId;
        return visibleUtilities.length === 1 ? visibleUtilities[0].id : null;
    }, [
        activeDMA?.utilityId,
        effectiveUtilityId,
        visibleUtilities
    ]);
    const activeUtility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>utilities.find((utility)=>utility.id === activeUtilityId) ?? null, [
        activeUtilityId,
        utilities
    ]);
    const boundaryOverlays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const buildUtilityOverlay = (utility, index)=>{
            if (!utility.boundaryGeojson) return null;
            const utilityReports = filteredReports.filter((report)=>report.utilityId === utility.id);
            return {
                id: utility.id,
                label: utility.name,
                level: "utility",
                geojson: utility.boundaryGeojson,
                reported: utilityReports.length,
                resolved: utilityReports.filter((report)=>isResolvedStatus(report.status)).length,
                color: BOUNDARY_COLOR
            };
        };
        const buildDMAOverlay = (dma, index)=>{
            if (!dma.boundaryGeojson) return null;
            const dmaReports = filteredReports.filter((report)=>report.dmaId === dma.id);
            return {
                id: dma.id,
                label: dma.name,
                level: "dma",
                geojson: dma.boundaryGeojson,
                reported: dmaReports.length,
                resolved: dmaReports.filter((report)=>isResolvedStatus(report.status)).length,
                color: BOUNDARY_COLOR
            };
        };
        if (dashboardLevel === "national") {
            return [];
        }
        if (dashboardLevel === "utility") {
            const utilitiesForBoundary = activeUtility?.boundaryGeojson ? [
                activeUtility
            ] : [];
            return utilitiesForBoundary.map(buildUtilityOverlay).filter(isOperationsMapBoundaryOverlay);
        }
        if (selectedDMAId !== "all") {
            const selectedOverlay = activeDMA ? buildDMAOverlay(activeDMA, 0) : null;
            return selectedOverlay ? [
                selectedOverlay
            ] : [];
        }
        return visibleDMAs.map(buildDMAOverlay).filter(isOperationsMapBoundaryOverlay);
    }, [
        activeDMA,
        activeUtility,
        dashboardLevel,
        filteredReports,
        selectedDMAId,
        visibleDMAs,
        visibleUtilities
    ]);
    const activeNetworkPreviewUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const pipeNetwork = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$data$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUtilityInfrastructureAsset"])(activeUtility, "pipe_network");
        if (!pipeNetwork?.previewUrl) return null;
        if (isDMA || !activeDMA?.id || !activeDMA.boundaryGeojson) return pipeNetwork.previewUrl;
        const separator = pipeNetwork.previewUrl.includes("?") ? "&" : "?";
        return `${pipeNetwork.previewUrl}${separator}dma_id=${encodeURIComponent(activeDMA.id)}`;
    }, [
        activeDMA?.boundaryGeojson,
        activeDMA?.id,
        activeUtility,
        isDMA
    ]);
    const networkPreviewUrls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (activeNetworkPreviewUrl) return [
            activeNetworkPreviewUrl
        ];
        if (!isAdmin || selectedUtilityId !== "all" || selectedDMAId !== "all" || effectiveUtilityId) return [];
        return visibleUtilities.map((utility)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$data$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUtilityInfrastructureAsset"])(utility, "pipe_network")?.previewUrl).filter((url)=>Boolean(url));
    }, [
        activeNetworkPreviewUrl,
        effectiveUtilityId,
        isAdmin,
        selectedDMAId,
        selectedUtilityId,
        visibleUtilities
    ]);
    const infrastructureLayers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const assetDefinitions = [
            {
                assetType: "valves",
                label: "Valves",
                color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].infraDotColors.valves
            },
            {
                assetType: "water_sources",
                label: "Water sources",
                color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].infraDotColors.water_sources
            },
            {
                assetType: "storage_facilities",
                label: "Storage facilities",
                color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].infraDotColors.storage_facilities
            },
            {
                assetType: "bulk_meters",
                label: "Bulk meters",
                color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].infraDotColors.bulk_meters
            }
        ];
        const layersByType = new Map(assetDefinitions.map((asset)=>[
                asset.assetType,
                {
                    ...asset,
                    previewUrls: []
                }
            ]));
        const utilitiesForInfrastructure = activeUtility ? [
            activeUtility
        ] : visibleUtilities;
        utilitiesForInfrastructure.forEach((utility)=>{
            utility.infrastructureLayers?.forEach((layer)=>{
                if (layer.assetType === "pipe_network" || !layer.previewUrl) return;
                const existing = layersByType.get(layer.assetType);
                if (!existing) return;
                existing.previewUrls.push(layer.previewUrl);
            });
        });
        return Array.from(layersByType.values());
    }, [
        activeUtility,
        visibleUtilities
    ]);
    const utilityAggregateMarkers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const utilitiesForMarkers = selectedUtilityId !== "all" || isUtility || isDMA ? visibleUtilities.filter((utility)=>!effectiveUtilityId || utility.id === effectiveUtilityId) : visibleUtilities;
        return utilitiesForMarkers.map((utility)=>{
            const utilityReports = scopedReports.filter((report)=>report.utilityId === utility.id);
            const utilityMapReports = utilityReports.filter(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$report$2d$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasUsableCoordinates"]);
            const latitude = utility.centerLatitude ?? (utilityMapReports.length ? utilityMapReports.reduce((sum, report)=>sum + report.latitude, 0) / utilityMapReports.length : null);
            const longitude = utility.centerLongitude ?? (utilityMapReports.length ? utilityMapReports.reduce((sum, report)=>sum + report.longitude, 0) / utilityMapReports.length : null);
            if (latitude == null || longitude == null) return null;
            return {
                id: utility.id,
                label: utility.name,
                latitude,
                longitude,
                reported: utilityReports.length,
                resolved: utilityReports.filter((report)=>isResolvedStatus(report.status)).length,
                level: "utility"
            };
        }).filter(isOperationsMapAggregateMarker);
    }, [
        effectiveUtilityId,
        isDMA,
        isUtility,
        scopedReports,
        selectedUtilityId,
        visibleUtilities
    ]);
    const dmaAggregateMarkers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return visibleDMAs.map((dma)=>{
            const dmaReports = filteredReports.filter((report)=>report.dmaId === dma.id);
            const dmaMapReports = dmaReports.filter(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$report$2d$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasUsableCoordinates"]);
            const latitude = dma.centerLatitude ?? (dmaMapReports.length ? dmaMapReports.reduce((sum, report)=>sum + report.latitude, 0) / dmaMapReports.length : null);
            const longitude = dma.centerLongitude ?? (dmaMapReports.length ? dmaMapReports.reduce((sum, report)=>sum + report.longitude, 0) / dmaMapReports.length : null);
            if (latitude == null || longitude == null) return null;
            return {
                id: dma.id,
                label: dma.name,
                latitude,
                longitude,
                reported: dmaReports.length,
                resolved: dmaReports.filter((report)=>isResolvedStatus(report.status)).length,
                level: "dma"
            };
        }).filter(isOperationsMapAggregateMarker);
    }, [
        filteredReports,
        visibleDMAs
    ]);
    const aggregateMarkers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (dashboardLevel === "national" || dashboardLevel === "utility") return utilityAggregateMarkers;
        if (dashboardLevel === "dma") return dmaAggregateMarkers;
        return [];
    }, [
        dashboardLevel,
        dmaAggregateMarkers,
        utilityAggregateMarkers
    ]);
    const displayedMapReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>dashboardLevel === "detail" ? mapReports : [], [
        dashboardLevel,
        mapReports
    ]);
    const mapCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (activeDMA?.centerLatitude != null && activeDMA?.centerLongitude != null) {
            return [
                activeDMA.centerLatitude,
                activeDMA.centerLongitude
            ];
        }
        if (activeUtility?.centerLatitude != null && activeUtility?.centerLongitude != null) {
            return [
                activeUtility.centerLatitude,
                activeUtility.centerLongitude
            ];
        }
        if (aggregateMarkers.length) {
            const lat = aggregateMarkers.reduce((sum, marker)=>sum + marker.latitude, 0) / aggregateMarkers.length;
            const lng = aggregateMarkers.reduce((sum, marker)=>sum + marker.longitude, 0) / aggregateMarkers.length;
            return [
                lat,
                lng
            ];
        }
        if (displayedMapReports.length) {
            const lat = displayedMapReports.reduce((sum, report)=>sum + report.latitude, 0) / displayedMapReports.length;
            const lng = displayedMapReports.reduce((sum, report)=>sum + report.longitude, 0) / displayedMapReports.length;
            return [
                lat,
                lng
            ];
        }
        return null;
    }, [
        activeDMA,
        activeUtility,
        aggregateMarkers,
        displayedMapReports
    ]);
    // Refetch reports when admin changes filters. Keep refreshes quiet once data is already on screen.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isAdmin) return;
        const filters = {
            utilityId: selectedUtilityId === "all" ? undefined : selectedUtilityId,
            dmaId: selectedDMAId === "all" ? undefined : selectedDMAId
        };
        void fetchReportsForMap(Object.values(filters).some((v)=>v !== undefined) ? filters : undefined);
    }, [
        fetchReportsForMap,
        initialized,
        isAdmin,
        selectedDMAId,
        selectedUtilityId
    ]);
    const scopeTitle = activeDMA?.name || activeUtility?.name || "Water Leakage Monitoring";
    const orgLabel = activeUtility?.name || (isAdmin ? "All utilities and DMAs" : currentUser?.name || "Operations view");
    const allMapReportsLoaded = reportsListTotal === null || reports.length >= reportsListTotal;
    const mapFitKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            selectedUtilityId,
            selectedDMAId,
            activeDMA?.id ?? "none"
        ].join("|"), [
        activeDMA?.id,
        selectedDMAId,
        selectedUtilityId
    ]);
    const preferTanzaniaMapView = isAdmin && selectedUtilityId === "all" && selectedDMAId === "all" && dashboardLevel === "national";
    const hierarchyLabel = dashboardLevel === "national" ? "National summary" : dashboardLevel === "utility" ? "Utility summary" : dashboardLevel === "dma" ? "DMA summary" : "Report detail";
    const handleMapViewChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((view)=>{
        setMapZoom(view.zoom);
        setMapViewCenter(view.center);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setTopbarTitle({
            title: "Water Leakage Monitoring"
        });
        return ()=>setTopbarTitle(null);
    }, [
        setTopbarTitle
    ]);
    if (loading && !reports.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[70vh] items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 rounded-full border border-slate-200 bg-card px-5 py-3 text-sm font-medium text-slate-600 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-4 w-4 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 934,
                        columnNumber: 11
                    }, this),
                    "Loading operations dashboard..."
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                lineNumber: 933,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
            lineNumber: 932,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-[calc(100dvh-5.5rem)] min-h-[560px] overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid h-full grid-cols-1 gap-3 xl:grid-cols-[168px_minmax(0,1fr)_280px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                    className: "grid h-full min-h-0 gap-3 sm:grid-cols-2 xl:w-[168px] xl:grid-cols-1 xl:grid-rows-[repeat(4,minmax(0,1fr))_auto]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                            label: "Total Reports",
                            value: kpis.total,
                            tone: "slate"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 945,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                            label: "Resolved Reports",
                            value: kpis.repaired,
                            tone: "green"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 946,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                            label: "Urgent Reports",
                            value: kpis.urgent,
                            tone: "amber"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 947,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                            label: "Unattended Reports",
                            value: kpis.unattended,
                            tone: "red"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 948,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-h-0 rounded-[18px] border border-slate-300/80 bg-slate-100/85 px-3 py-2.5 shadow-sm shadow-slate-900/[0.025] sm:col-span-2 xl:col-span-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500",
                                    children: "Map legend"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                    lineNumber: 951,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2.5 max-h-[150px] space-y-1.5 overflow-y-auto pr-1 text-xs text-slate-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-2.5 w-2.5 rounded-full bg-red-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 954,
                                                    columnNumber: 17
                                                }, this),
                                                "Open / rejected"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 953,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-2.5 w-2.5 rounded-full bg-amber-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 958,
                                                    columnNumber: 17
                                                }, this),
                                                "Pending approval"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 957,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-2.5 w-2.5 rounded-full bg-emerald-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 962,
                                                    columnNumber: 17
                                                }, this),
                                                "Resolved (approved / closed)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 961,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-2.5 w-2.5 rounded-full bg-cyan-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 966,
                                                    columnNumber: 17
                                                }, this),
                                                "Pipe network"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 965,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                    lineNumber: 952,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 950,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                    lineNumber: 944,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "min-h-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$maps$2f$operations$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OperationsMap"], {
                        reports: displayedMapReports.map((report)=>({
                                id: report.id,
                                trackingId: report.trackingId,
                                description: report.description,
                                latitude: report.latitude,
                                longitude: report.longitude,
                                status: report.status,
                                priority: report.priority,
                                dmaName: report.dmaName,
                                utilityName: report.utilityName,
                                regionName: report.regionName,
                                districtName: report.districtName,
                                address: report.address,
                                reporterName: report.reporterName
                            })),
                        aggregateMarkers: aggregateMarkers,
                        boundaryOverlays: boundaryOverlays,
                        center: mapCenter,
                        boundaryGeojson: null,
                        boundaryGeojsons: [],
                        networkPreviewUrl: activeNetworkPreviewUrl,
                        networkPreviewUrls: networkPreviewUrls,
                        infrastructureLayers: infrastructureLayers,
                        networkFileName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$data$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUtilityInfrastructureAsset"])(activeUtility, "pipe_network")?.fileName,
                        title: scopeTitle,
                        description: `${dashboardLevel} view · ${kpis.total.toLocaleString()} reports in current scope`,
                        basemap: basemap,
                        onBasemapChange: setBasemap,
                        onZoomChange: setMapZoom,
                        onViewChange: handleMapViewChange,
                        chromeMode: "command-center",
                        boundsFitKey: mapFitKey,
                        initialBounds: TANZANIA_BOUNDS,
                        preferInitialBounds: preferTanzaniaMapView,
                        onReportSelect: (reportId)=>router.push(`/dashboard/reports/${reportId}`)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                        lineNumber: 974,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                    lineNumber: 973,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                    className: "grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_minmax(210px,0.72fr)] gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "rounded-[18px] border border-slate-300/80 bg-slate-100/85 px-3 py-2.5 shadow-sm shadow-slate-900/[0.025] backdrop-blur",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-3 rounded-2xl border border-slate-300/70 bg-white/45 px-3 py-2 text-xs dark:border-slate-600/70 dark:bg-slate-950/45",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-slate-700 dark:text-white",
                                            children: hierarchyLabel
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                            lineNumber: 1017,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                        lineNumber: 1016,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        value: selectedUtilityId,
                                        onValueChange: setSelectedUtilityId,
                                        disabled: !isAdmin || !visibleUtilities.length,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "h-9 rounded-2xl border-slate-300 bg-slate-100 px-3 text-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: "Utility / Region"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 1025,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                lineNumber: 1024,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                className: "z-[5000]",
                                                children: [
                                                    isAdmin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "all",
                                                        children: "All utilities"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                        lineNumber: 1028,
                                                        columnNumber: 30
                                                    }, this) : null,
                                                    visibleUtilities.map((utility)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: utility.id,
                                                            children: utility.name
                                                        }, utility.id, false, {
                                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                            lineNumber: 1030,
                                                            columnNumber: 21
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                lineNumber: 1027,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                        lineNumber: 1019,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        value: selectedDMAId,
                                        onValueChange: setSelectedDMAId,
                                        disabled: isDMA || isAdmin && selectedUtilityId === "all" || !visibleDMAs.length,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "h-9 rounded-2xl border-slate-300 bg-slate-100 px-3 text-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: "DMA / District"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                    lineNumber: 1043,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                lineNumber: 1042,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                className: "z-[5000]",
                                                children: [
                                                    !isDMA ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "all",
                                                        children: "All DMAs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                        lineNumber: 1046,
                                                        columnNumber: 29
                                                    }, this) : null,
                                                    visibleDMAs.map((dma)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: dma.id,
                                                            children: dma.name
                                                        }, dma.id, false, {
                                                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                            lineNumber: 1048,
                                                            columnNumber: 21
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                                lineNumber: 1045,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                        lineNumber: 1037,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                                lineNumber: 1015,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 1014,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ComparisonBarChartCard, {
                            title: "Reported vs resolved",
                            subtitle: comparisonSubtitle,
                            rows: comparisonRows
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 1057,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LeakageTypeDonutCard, {
                            rows: leakageTypeRows
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                            lineNumber: 1062,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/operations-dashboard.tsx",
                    lineNumber: 1013,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/operations-dashboard.tsx",
            lineNumber: 943,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/dashboard/operations-dashboard.tsx",
        lineNumber: 942,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/(dashboard)/_views/dashboard-home-page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$operations$2d$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/operations-dashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function DashboardPage() {
    const { currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    if (!currentUser) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$operations$2d$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OperationsDashboard"], {}, void 0, false, {
        fileName: "[project]/app/(dashboard)/_views/dashboard-home-page.tsx",
        lineNumber: 11,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=_f43ca9b4._.js.map