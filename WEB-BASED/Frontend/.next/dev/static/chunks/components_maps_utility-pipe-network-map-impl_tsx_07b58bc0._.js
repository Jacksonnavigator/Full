(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/maps/utility-pipe-network-map-impl.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UtilityPipeNetworkMapImpl",
    ()=>UtilityPipeNetworkMapImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/GeoJSON.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.js [app-client] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
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
function UtilityPipeNetworkMapImpl({ utilityId, previewUrl, fallbackCenter, fileName, title = "Utility Pipe Network", emptyMessage = "Upload a supported utility pipe network file to preview it on the map." }) {
    _s();
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
                title: "Pipe network preview ready when uploaded",
                detail: emptyMessage
            };
        }
    }["UtilityPipeNetworkMapImpl.useMemo[previewMessage]"], [
        emptyMessage,
        error,
        fileName
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-slate-100 bg-slate-50/80 px-4 py-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 shadow-sm shadow-sky-500/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"], {
                                className: "h-4 w-4 text-white"
                            }, void 0, false, {
                                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-slate-800",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 text-xs text-slate-500",
                                    children: "Preview the uploaded utility pipe network against the live dashboard map."
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                    lineNumber: 209,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-[320px] items-center justify-center bg-slate-50 text-sm text-slate-500",
                children: "Loading utility pipe network..."
            }, void 0, false, {
                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                lineNumber: 223,
                columnNumber: 9
            }, this) : previewUrl && geojson ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: mapCenter,
                zoom: 13,
                scrollWheelZoom: true,
                className: "h-[320px] w-full",
                children: [
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
                        lineNumber: 228,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                        data: geojson,
                        style: ()=>({
                                color: "#0f766e",
                                weight: 3,
                                opacity: 0.9
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-[320px] flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                            lineNumber: 249,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                        lineNumber: 248,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-semibold text-slate-700",
                                children: previewMessage.title
                            }, void 0, false, {
                                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                lineNumber: 252,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: previewMessage.detail
                            }, void 0, false, {
                                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                                lineNumber: 255,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
                lineNumber: 247,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/maps/utility-pipe-network-map-impl.tsx",
        lineNumber: 207,
        columnNumber: 5
    }, this);
}
_s(UtilityPipeNetworkMapImpl, "YRLg0uEnDBkhqPMtz/LHaUgzbyo=");
_c = UtilityPipeNetworkMapImpl;
var _c;
__turbopack_context__.k.register(_c, "UtilityPipeNetworkMapImpl");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/maps/utility-pipe-network-map-impl.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/maps/utility-pipe-network-map-impl.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_maps_utility-pipe-network-map-impl_tsx_07b58bc0._.js.map