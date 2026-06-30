(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/maps/utility-location-picker-impl.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UtilityLocationPickerImpl",
    ()=>UtilityLocationPickerImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/CircleMarker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Polygon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Polygon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
const DEFAULT_CENTER = [
    -6.7924,
    39.2083
];
function ClickHandler({ onCenterChange }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"])({
        click (event) {
            onCenterChange({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng
            });
        }
    });
    return null;
}
_s(ClickHandler, "Ld/tk8Iz8AdZhC1l7acENaOEoCo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"]
    ];
});
_c = ClickHandler;
function polygonToLatLngs(polygon) {
    return polygon.map((ring)=>ring.filter((point)=>Array.isArray(point) && point.length >= 2).map((point)=>[
                Number(point[1]),
                Number(point[0])
            ]).filter(([latitude, longitude])=>Number.isFinite(latitude) && Number.isFinite(longitude))).filter((ring)=>ring.length >= 3);
}
function boundaryToPolygons(boundaryGeojson) {
    if (!boundaryGeojson) return [];
    if (boundaryGeojson.type === "Polygon") {
        const polygon = polygonToLatLngs(boundaryGeojson.coordinates);
        return polygon.length ? [
            polygon
        ] : [];
    }
    if (boundaryGeojson.type === "MultiPolygon") {
        return boundaryGeojson.coordinates.map(polygonToLatLngs).filter((polygon)=>polygon.length > 0);
    }
    return [];
}
function ViewportSync({ center, boundaryPolygons }) {
    _s1();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewportSync.useEffect": ()=>{
            const points = boundaryPolygons.flat(2);
            if (points.length >= 2) {
                map.fitBounds(points, {
                    padding: [
                        28,
                        28
                    ]
                });
                return;
            }
            map.setView(center);
        }
    }["ViewportSync.useEffect"], [
        boundaryPolygons,
        center,
        map
    ]);
    return null;
}
_s1(ViewportSync, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c1 = ViewportSync;
function UtilityLocationPickerImpl({ centerValue, boundaryGeojson, onCenterChange }) {
    _s2();
    const boundaryPolygons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UtilityLocationPickerImpl.useMemo[boundaryPolygons]": ()=>boundaryToPolygons(boundaryGeojson)
    }["UtilityLocationPickerImpl.useMemo[boundaryPolygons]"], [
        boundaryGeojson
    ]);
    const mapCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UtilityLocationPickerImpl.useMemo[mapCenter]": ()=>{
            if (centerValue.latitude !== null && centerValue.longitude !== null) {
                return [
                    centerValue.latitude,
                    centerValue.longitude
                ];
            }
            const firstBoundaryPoint = boundaryPolygons[0]?.[0]?.[0];
            if (firstBoundaryPoint) return firstBoundaryPoint;
            return DEFAULT_CENTER;
        }
    }["UtilityLocationPickerImpl.useMemo[mapCenter]"], [
        boundaryPolygons,
        centerValue.latitude,
        centerValue.longitude
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-2xl border border-slate-200 bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-slate-100 bg-slate-50/80 px-4 py-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-semibold text-slate-800",
                            children: "Utility Spatial Coordinates"
                        }, void 0, false, {
                            fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-xs text-slate-500",
                            children: "Click the map to set the utility center. Uploaded service boundaries are shown for verification only."
                        }, void 0, false, {
                            fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: mapCenter,
                zoom: 12,
                scrollWheelZoom: true,
                className: "h-[300px] w-full md:h-[360px]",
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
                        fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ViewportSync, {
                        center: mapCenter,
                        boundaryPolygons: boundaryPolygons
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ClickHandler, {
                        onCenterChange: onCenterChange
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    boundaryPolygons.map((polygon, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Polygon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Polygon"], {
                            positions: polygon,
                            pathOptions: {
                                color: "#0891b2",
                                fillColor: "#22d3ee",
                                fillOpacity: 0.16,
                                weight: 3
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                direction: "top",
                                offset: [
                                    0,
                                    -8
                                ],
                                children: [
                                    "Uploaded service boundary ",
                                    boundaryPolygons.length > 1 ? index + 1 : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this)
                        }, `utility-boundary-${index}`, false, {
                            fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this)),
                    centerValue.latitude !== null && centerValue.longitude !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                        center: [
                            centerValue.latitude,
                            centerValue.longitude
                        ],
                        radius: 11,
                        pathOptions: {
                            color: "#0f766e",
                            fillColor: "#14b8a6",
                            fillOpacity: 0.9,
                            weight: 2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            direction: "top",
                            offset: [
                                0,
                                -10
                            ],
                            children: "Utility center"
                        }, void 0, false, {
                            fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                            lineNumber: 150,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-slate-100 bg-white px-4 py-3 text-xs text-slate-500",
                children: "The utility center is required and acts as the primary operational city marker on the dashboard map."
            }, void 0, false, {
                fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/maps/utility-location-picker-impl.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s2(UtilityLocationPickerImpl, "r/wuKCSKryKx68Yd8SHMP92UAXA=");
_c2 = UtilityLocationPickerImpl;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ClickHandler");
__turbopack_context__.k.register(_c1, "ViewportSync");
__turbopack_context__.k.register(_c2, "UtilityLocationPickerImpl");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/maps/utility-location-picker-impl.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/maps/utility-location-picker-impl.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_maps_utility-location-picker-impl_tsx_4dbee920._.js.map