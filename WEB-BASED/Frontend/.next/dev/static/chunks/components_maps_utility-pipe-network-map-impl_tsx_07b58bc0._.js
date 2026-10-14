(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/maps/utility-pipe-network-map-impl.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UtilityPipeNetworkMapImpl",
    ()=>UtilityPipeNetworkMapImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/GeoJSON.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$infrastructure$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/infrastructure-icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$infrastructure$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/infrastructure-assets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/palette.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
const INFRA_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PALETTE"].map.infrastructure.color;
const INFRA_BORDER = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.bg;
const INFRA_MUTED = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.base;
const INFRA_TEXT = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PALETTE"].semantic.neutral.text;
const DEFAULT_CENTER = [
    -6.7924,
    39.2083
];
function describePreviewIssue(error, fileName) {
    if (!error) {
        return {
            title: "Pipe network preview ready when uploaded",
            detail: "Upload a supported utility pipe network file to preview it on the map."
        };
    }
    const normalized = error.toLowerCase();
    const fileLabel = fileName ? `Saved file: ${fileName}. ` : "";
    if (normalized.includes("decoded")) {
        return {
            title: "Saved file could not be read",
            detail: `${fileLabel}Re-export it as UTF-8 GeoJSON, KML, CSV, or TXT, then upload it again.`
        };
    }
    if (normalized.includes("parsed")) {
        return {
            title: "Saved file structure is invalid",
            detail: `${fileLabel}The uploaded network file could not be parsed. Re-export the map file from the source GIS tool and replace it here.`
        };
    }
    if (normalized.includes("did not contain previewable geometry")) {
        return {
            title: "No map geometry was found",
            detail: `${fileLabel}The file is saved, but it does not contain previewable pipe lines or points. Confirm the export includes actual network geometry before uploading again.`
        };
    }
    if (normalized.includes("converted into previewable map features")) {
        return {
            title: "Saved file is not map-ready yet",
            detail: `${fileLabel}The file format was accepted for storage, but its contents could not be turned into map features. Download it to inspect the export or replace it with a cleaner GIS file.`
        };
    }
    return {
        title: "Uploaded pipe network could not be previewed",
        detail: `${fileLabel}${error} Download the saved file to inspect it or replace it with a cleaner GIS export.`
    };
}
const ASSET_META = {
    pipe_network: {
        label: "pipe network",
        color: INFRA_COLOR
    },
    valves: {
        label: "valves",
        color: INFRA_COLOR
    },
    water_sources: {
        label: "water sources",
        color: INFRA_COLOR
    },
    storage_facilities: {
        label: "storage facilities",
        color: INFRA_COLOR
    },
    bulk_meters: {
        label: "bulk meters",
        color: INFRA_COLOR
    }
};
function getAssetColor(assetType) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PALETTE"].map.infrastructure.color;
}
function getAssetMeta(assetType) {
    return ASSET_META[assetType || ""] || ASSET_META.pipe_network;
}
function createAssetDivIcon(assetType) {
    const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$infrastructure$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInfrastructureIconDef"])(assetType);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["divIcon"]({
        className: "majiscope-asset-div-icon",
        iconSize: [
            28,
            28
        ],
        iconAnchor: [
            14,
            14
        ],
        popupAnchor: [
            0,
            -14
        ],
        html: `<span style="--asset-color:${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PALETTE"].map.infrastructure.color}" class="majiscope-asset-marker"><svg viewBox="${def.viewBox}" aria-hidden="true">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$infrastructure$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["infrastructureIconPathsHtml"])(assetType)}</svg></span>`
    });
}
function escapeHtml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function formatPropertyLabel(key) {
    const aliases = {
        assetid: "Asset ID",
        asset_id: "Asset ID",
        source_file: "Source file",
        source_table: "Layer",
        asset_type: "Asset type",
        asset_label: "Asset"
    };
    return aliases[key.toLowerCase()] || key.replace(/_/g, " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
}
function buildFeaturePopupHtml(feature, title) {
    const rawProperties = feature.properties;
    const entries = Object.entries(rawProperties && typeof rawProperties === "object" ? rawProperties : {}).filter(([, value])=>value !== null && value !== "");
    const rows = entries.slice(0, 18).map(([key, value])=>`<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;border-bottom:1px solid ${INFRA_BORDER};padding:5px 0;">
      <span style="font-size:11px;color:${INFRA_MUTED};">${escapeHtml(formatPropertyLabel(key))}</span>
      <span style="font-size:11px;color:${INFRA_TEXT};font-weight:700;text-align:right;max-width:220px;word-break:break-word;">${escapeHtml(String(value))}</span>
    </div>`);
    return `<div style="width:300px;max-height:260px;overflow:auto;font-family:Inter,ui-sans-serif,system-ui;">
    <div style="position:sticky;top:0;background:${INFRA_BORDER};border-bottom:1px solid ${INFRA_BORDER};padding:9px 10px;margin:-4px -4px 8px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${INFRA_TEXT};">${escapeHtml(title)}</div>
      <div style="font-size:11px;color:${INFRA_MUTED};margin-top:2px;">Attributes from uploaded GIS file</div>
    </div>
    ${rows.length ? `<div style="display:grid;gap:2px;">${rows.join("")}</div>` : `<div style="font-size:12px;color:${INFRA_MUTED};">No attribute data was included for this feature.</div>`}
  </div>`;
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
function FitPreviewToData({ bounds }) {
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FitPreviewToData.useEffect": ()=>{
            if (!bounds) return;
            map.fitBounds(bounds, {
                padding: [
                    34,
                    34
                ],
                maxZoom: 15,
                animate: false
            });
        }
    }["FitPreviewToData.useEffect"], [
        bounds,
        map
    ]);
    return null;
}
_s(FitPreviewToData, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c = FitPreviewToData;
function UtilityPipeNetworkMapImpl({ utilityId, previewUrl, fallbackCenter, fileName, assetType = "pipe_network", mapHeightClassName = "h-[320px]", title = "Utility Pipe Network", emptyMessage = "Upload a supported utility pipe network file to preview it on the map." }) {
    _s1();
    const [geojson, setGeojson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilityPipeNetworkMapImpl.useEffect": ()=>{
            let cancelled = false;
            async function loadPreview() {
                if (!utilityId || !previewUrl) {
                    setGeojson(null);
                    setError(null);
                    return;
                }
                const token = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].storage.tokenKey);
                if (!token) {
                    setError("Authentication is required to preview the utility pipe network.");
                    return;
                }
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].backend.baseUrl}${previewUrl}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const payload = await response.json().catch({
                        "UtilityPipeNetworkMapImpl.useEffect.loadPreview": ()=>({})
                    }["UtilityPipeNetworkMapImpl.useEffect.loadPreview"]);
                    if (!response.ok) {
                        if (!cancelled) {
                            setGeojson(null);
                            setError(payload.detail || payload.error || "Unable to load the utility pipe network preview.");
                        }
                        return;
                    }
                    if (!cancelled) {
                        setGeojson(payload);
                    }
                } catch (err) {
                    if (!cancelled) {
                        console.error("Error loading utility pipe network preview:", err);
                        setGeojson(null);
                        setError("Unable to load the utility pipe network preview.");
                    }
                } finally{
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            }
            void loadPreview();
            return ({
                "UtilityPipeNetworkMapImpl.useEffect": ()=>{
                    cancelled = true;
                }
            })["UtilityPipeNetworkMapImpl.useEffect"];
        }
    }["UtilityPipeNetworkMapImpl.useEffect"], [
        utilityId,
        previewUrl
    ]);
    const assetMeta = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UtilityPipeNetworkMapImpl.useMemo[assetMeta]": ()=>getAssetMeta(assetType)
    }["UtilityPipeNetworkMapImpl.useMemo[assetMeta]"], [
        assetType
    ]);
    const previewCoordinates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UtilityPipeNetworkMapImpl.useMemo[previewCoordinates]": ()=>collectGeoJsonCoordinates(geojson)
    }["UtilityPipeNetworkMapImpl.useMemo[previewCoordinates]"], [
        geojson
    ]);
    const mapCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UtilityPipeNetworkMapImpl.useMemo[mapCenter]": ()=>{
            if (previewCoordinates.length > 0) {
                const latitudeAverage = previewCoordinates.reduce({
                    "UtilityPipeNetworkMapImpl.useMemo[mapCenter]": (sum, point)=>sum + point[0]
                }["UtilityPipeNetworkMapImpl.useMemo[mapCenter]"], 0) / previewCoordinates.length;
                const longitudeAverage = previewCoordinates.reduce({
                    "UtilityPipeNetworkMapImpl.useMemo[mapCenter]": (sum, point)=>sum + point[1]
                }["UtilityPipeNetworkMapImpl.useMemo[mapCenter]"], 0) / previewCoordinates.length;
                return [
                    latitudeAverage,
                    longitudeAverage
                ];
            }
            if (fallbackCenter && Number.isFinite(fallbackCenter[0]) && Number.isFinite(fallbackCenter[1])) {
                return fallbackCenter;
            }
            return DEFAULT_CENTER;
        }
    }["UtilityPipeNetworkMapImpl.useMemo[mapCenter]"], [
        fallbackCenter,
        previewCoordinates
    ]);
    const previewMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UtilityPipeNetworkMapImpl.useMemo[previewMessage]": ()=>{
            if (error) {
                return describePreviewIssue(error, fileName);
            }
            return {
                title: `${title} ready when uploaded`,
                detail: emptyMessage
            };
        }
    }["UtilityPipeNetworkMapImpl.useMemo[previewMessage]"], [
        emptyMessage,
        error,
        fileName,
        title
    ]);
    const fitBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UtilityPipeNetworkMapImpl.useMemo[fitBounds]": ()=>{
            if (!previewCoordinates.length) return null;
            if (previewCoordinates.length === 1) {
                const [lat, lng] = previewCoordinates[0];
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
            return previewCoordinates;
        }
    }["UtilityPipeNetworkMapImpl.useMemo[fitBounds]"], [
        previewCoordinates
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-slate-100 bg-slate-50/80 px-4 py-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$infrastructure$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfrastructureIcon"], {
                            assetType: assetType,
                            className: "h-5 w-5 shrink-0",
                            style: {
                                color: assetMeta.color
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                            lineNumber: 323,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-slate-800",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 text-xs text-slate-500",
                                    children: [
                                        "Preview uploaded utility ",
                                        assetMeta.label,
                                        " against the live dashboard map."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                    lineNumber: 326,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                            lineNumber: 324,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                    lineNumber: 322,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex ${mapHeightClassName} items-center justify-center bg-slate-50 text-sm text-slate-500`,
                children: [
                    "Loading utility ",
                    assetMeta.label,
                    "..."
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                lineNumber: 334,
                columnNumber: 9
            }, this) : previewUrl && geojson ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: mapCenter,
                zoom: 13,
                scrollWheelZoom: true,
                className: `${mapHeightClassName} w-full`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FitPreviewToData, {
                        bounds: fitBounds
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                        lineNumber: 339,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        id: "72ccde5fee765ab3",
                        children: ".majiscope-asset-div-icon{background:0 0;border:0}.majiscope-asset-marker{background:color-mix(in srgb,var(--asset-color)92%,white);color:#fff;border:2px solid #fffffff5;border-radius:9999px;justify-content:center;align-items:center;width:28px;height:28px;display:flex;box-shadow:0 10px 22px -12px #0f172ad1}.majiscope-asset-marker svg{filter:drop-shadow(0 1px #0f172a2e);width:19px;height:19px}"
                    }, void 0, false, void 0, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        maxNativeZoom: 18,
                        maxZoom: 19,
                        keepBuffer: 6,
                        updateWhenIdle: false,
                        detectRetina: true
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                        lineNumber: 365,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                        data: geojson,
                        pointToLayer: (_, latlng)=>assetType === "pipe_network" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["circleMarker"](latlng, {
                                radius: 3,
                                fillColor: INFRA_COLOR,
                                color: "#ffffff",
                                weight: 1.5,
                                fillOpacity: 0.9
                            }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marker"](latlng, {
                                icon: createAssetDivIcon(assetType)
                            }),
                        style: ()=>({
                                color: getAssetColor(assetType),
                                weight: assetType === "pipe_network" ? 3 : 2,
                                opacity: 0.9,
                                fillColor: getAssetColor(assetType),
                                fillOpacity: assetType === "pipe_network" ? 0.08 : 0.16
                            }),
                        onEachFeature: (feature, layer)=>{
                            if (!feature) return;
                            if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                                layer.bindPopup(buildFeaturePopupHtml(feature, title));
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                        lineNumber: 374,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                lineNumber: 338,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex ${mapHeightClassName} flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                            lineNumber: 405,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                        lineNumber: 404,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-semibold text-slate-700",
                                children: previewMessage.title
                            }, void 0, false, {
                                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: previewMessage.detail
                            }, void 0, false, {
                                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                lineNumber: 411,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                        lineNumber: 407,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                lineNumber: 403,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
        lineNumber: 320,
        columnNumber: 5
    }, this);
}
_s1(UtilityPipeNetworkMapImpl, "7tpGCABng9DDLXq0N46KLy17kd4=");
_c1 = UtilityPipeNetworkMapImpl;
var _c, _c1;
__turbopack_context__.k.register(_c, "FitPreviewToData");
__turbopack_context__.k.register(_c1, "UtilityPipeNetworkMapImpl");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/maps/utility-pipe-network-map-impl.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/maps/utility-pipe-network-map-impl.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_maps_utility-pipe-network-map-impl_tsx_07b58bc0._.js.map