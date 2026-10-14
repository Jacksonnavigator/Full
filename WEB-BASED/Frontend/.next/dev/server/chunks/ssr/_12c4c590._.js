module.exports = [
"[project]/lib/access-control.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * MajiScope - Access Control Utilities
 * Defines which roles can access which pages
 */ __turbopack_context__.s([
    "PAGE_ACCESS_MAP",
    ()=>PAGE_ACCESS_MAP,
    "ROLE_PERMISSIONS",
    ()=>ROLE_PERMISSIONS,
    "canAccessPage",
    ()=>canAccessPage,
    "getDefaultDashboardPage",
    ()=>getDefaultDashboardPage,
    "getRolePermissions",
    ()=>getRolePermissions
]);
const PAGE_ACCESS_MAP = {
    // Dashboard - accessible to all authenticated users
    '': [
        'admin',
        'utility_manager',
        'dma_manager',
        'user'
    ],
    '/': [
        'admin',
        'utility_manager',
        'dma_manager',
        'user'
    ],
    // Utilities - admin and utility managers
    '/utilities': [
        'admin',
        'utility_manager',
        'user'
    ],
    '/utility-infrastructure': [
        'admin',
        'utility_manager'
    ],
    '/hydraulic-model': [
        'admin',
        'utility_manager',
        'dma_manager'
    ],
    '/hydraulic-reports': [
        'admin',
        'utility_manager',
        'dma_manager'
    ],
    // Utility Managers - admin only (admin can create/edit)
    '/managers': [
        'admin',
        'user'
    ],
    // DMAs - admin and utility managers (limited to their utility)
    '/dmas': [
        'admin',
        'utility_manager',
        'user'
    ],
    // DMA Managers - admin and utility managers (limited to their utility)
    '/dma-managers': [
        'admin',
        'utility_manager',
        'user'
    ],
    // Engineers - DMA managers only (limited to their DMA)
    '/engineers': [
        'dma_manager'
    ],
    // Teams - DMA managers only (limited to their DMA)
    '/teams': [
        'dma_manager'
    ],
    // Team Leaders - DMA managers only
    '/team-leaders': [
        'dma_manager'
    ],
    // Reports - all can access (filtered by role)
    '/reports': [
        'admin',
        'utility_manager',
        'dma_manager',
        'user'
    ],
    // Analytics - admin and utility managers
    '/analytics': [
        'admin',
        'utility_manager',
        'user'
    ],
    // Activity Logs - admin only
    '/logs': [
        'admin'
    ],
    // Profile - all authenticated users
    '/profile': [
        'admin',
        'utility_manager',
        'dma_manager',
        'user'
    ]
};
function canAccessPage(pagePath, userRole) {
    const matchedPath = Object.keys(PAGE_ACCESS_MAP).filter((path)=>path && path !== '/' && (pagePath === path || pagePath.startsWith(`${path}/`))).sort((a, b)=>b.length - a.length)[0];
    const allowedRoles = PAGE_ACCESS_MAP[pagePath] || (matchedPath ? PAGE_ACCESS_MAP[matchedPath] : PAGE_ACCESS_MAP['']);
    return allowedRoles.includes(userRole);
}
function getDefaultDashboardPage(userRole) {
    switch(userRole){
        case 'admin':
            return '/dashboard';
        case 'utility_manager':
            return '/dashboard';
        case 'dma_manager':
            return '/dashboard';
        default:
            return '/dashboard';
    }
}
const ROLE_PERMISSIONS = {
    admin: {
        canCreateUtility: true,
        canEditUtility: true,
        canDeleteUtility: true,
        canCreateUtilityManager: true,
        canEditUtilityManager: true,
        canDeleteUtilityManager: true,
        canCreateDMA: true,
        canEditDMA: true,
        canDeleteDMA: true,
        canCreateDMAManager: true,
        canEditDMAManager: true,
        canDeleteDMAManager: true,
        canCreateEngineer: true,
        canEditEngineer: true,
        canDeleteEngineer: true,
        canCreateTeam: true,
        canEditTeam: true,
        canDeleteTeam: true,
        canCreateTeamLeader: true,
        canEditTeamLeader: true,
        canDeleteTeamLeader: true,
        canCreateReport: true,
        canEditReport: true,
        canDeleteReport: true,
        canAssignReport: true,
        canApproveReport: true
    },
    utility_manager: {
        canCreateUtility: false,
        canEditUtility: true,
        canDeleteUtility: false,
        canCreateUtilityManager: false,
        canEditUtilityManager: false,
        canDeleteUtilityManager: false,
        canCreateDMA: false,
        canEditDMA: false,
        canDeleteDMA: false,
        canCreateDMAManager: false,
        canEditDMAManager: false,
        canDeleteDMAManager: false,
        canCreateEngineer: false,
        canEditEngineer: false,
        canDeleteEngineer: false,
        canCreateTeam: false,
        canEditTeam: false,
        canDeleteTeam: false,
        canCreateTeamLeader: false,
        canEditTeamLeader: false,
        canDeleteTeamLeader: false,
        canCreateReport: true,
        canEditReport: true,
        canDeleteReport: true,
        canAssignReport: true,
        canApproveReport: true
    },
    dma_manager: {
        canCreateUtility: false,
        canEditUtility: false,
        canDeleteUtility: false,
        canCreateUtilityManager: false,
        canEditUtilityManager: false,
        canDeleteUtilityManager: false,
        canCreateDMA: false,
        canEditDMA: false,
        canDeleteDMA: false,
        canCreateDMAManager: false,
        canEditDMAManager: false,
        canDeleteDMAManager: false,
        canCreateEngineer: false,
        canEditEngineer: false,
        canDeleteEngineer: false,
        canCreateTeam: false,
        canEditTeam: false,
        canDeleteTeam: false,
        canCreateTeamLeader: false,
        canEditTeamLeader: false,
        canDeleteTeamLeader: false,
        canCreateReport: true,
        canEditReport: true,
        canDeleteReport: true,
        canAssignReport: true,
        canApproveReport: false
    },
    user: {
        canCreateUtility: true,
        canEditUtility: true,
        canDeleteUtility: true,
        canCreateUtilityManager: true,
        canEditUtilityManager: true,
        canDeleteUtilityManager: true,
        canCreateDMA: true,
        canEditDMA: true,
        canDeleteDMA: true,
        canCreateDMAManager: true,
        canEditDMAManager: true,
        canDeleteDMAManager: true,
        canCreateEngineer: true,
        canEditEngineer: true,
        canDeleteEngineer: true,
        canCreateTeam: true,
        canEditTeam: true,
        canDeleteTeam: true,
        canCreateTeamLeader: true,
        canEditTeamLeader: true,
        canDeleteTeamLeader: true,
        canCreateReport: true,
        canEditReport: true,
        canDeleteReport: true,
        canAssignReport: true,
        canApproveReport: true
    }
};
function getRolePermissions(role) {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.dma_manager;
}
}),
"[project]/hooks/use-page-access.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePageAccess",
    ()=>usePageAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$access$2d$control$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/access-control.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function usePageAccess() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { currentUser, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isAuthenticated || !currentUser) {
            // Not authenticated - will be handled by layout auth guard
            return;
        }
        // Extract page path relative to /dashboard
        const pagePath = pathname.replace('/dashboard', '') || '/';
        // Check if user has access to this page
        const hasAccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$access$2d$control$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAccessPage"])(pagePath, currentUser.role);
        if (!hasAccess) {
            console.warn(`User ${currentUser.email} attempted to access ${pathname}`);
            // Redirect to dashboard
            router.replace('/dashboard');
        }
    }, [
        pathname,
        currentUser,
        isAuthenticated,
        router
    ]);
}
}),
"[project]/lib/hydraulic-heat.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HYDRAULIC_HEAT_MODE_LABELS",
    ()=>HYDRAULIC_HEAT_MODE_LABELS,
    "getAvailableHydraulicHeatModes",
    ()=>getAvailableHydraulicHeatModes,
    "getGeoJsonFeatures",
    ()=>getGeoJsonFeatures
]);
const HYDRAULIC_HEAT_MODE_LABELS = {
    pressure: "Pressure",
    low_pressure: "Low Pressure",
    pipe_flow: "Mean Flow",
    leakage_risk: "Leakage Risk"
};
function getGeoJsonFeatures(collection) {
    if (!collection || typeof collection !== "object") {
        return [];
    }
    const candidate = collection;
    if (candidate.type !== "FeatureCollection" || !Array.isArray(candidate.features)) {
        return [];
    }
    return candidate.features.filter((feature)=>Boolean(feature) && typeof feature === "object" && feature.type === "Feature");
}
function hasPointCoordinates(feature) {
    const coords = feature.geometry?.coordinates;
    return feature.geometry?.type === "Point" && Array.isArray(coords) && coords.length >= 2;
}
function getAvailableHydraulicHeatModes({ nodesGeojson, pipesGeojson, hotspotsGeojson }) {
    const modes = [];
    const nodeFeatures = getGeoJsonFeatures(nodesGeojson).filter(hasPointCoordinates);
    const pipeFeatures = getGeoJsonFeatures(pipesGeojson);
    const hotspotFeatures = getGeoJsonFeatures(hotspotsGeojson).filter(hasPointCoordinates);
    if (nodeFeatures.some((feature)=>typeof feature.properties?.pressure === "number")) {
        modes.push("pressure");
    }
    if (nodeFeatures.some((feature)=>{
        const lowPressure = feature.properties?.is_low_pressure;
        return lowPressure === true || typeof feature.properties?.low_pressure_hits === "number" && Number(feature.properties.low_pressure_hits) > 0;
    })) {
        modes.push("low_pressure");
    }
    if (pipeFeatures.some((feature)=>{
        const props = feature.properties || {};
        const value = props.flow_rate_max_abs ?? props.flow_rate_avg ?? props.flow_rate;
        return typeof value === "number" && Number.isFinite(value);
    })) {
        modes.push("pipe_flow");
    }
    if (hotspotFeatures.some((feature)=>{
        const score = feature.properties?.risk_score;
        return typeof score === "number" && Number.isFinite(score) && score > 0;
    })) {
        modes.push("leakage_risk");
    }
    return modes;
}
}),
"[project]/components/maps/hydraulic-heat-map.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HydraulicHeatMap",
    ()=>HydraulicHeatMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/CircleMarker.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Pane$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Pane.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Polyline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Polyline.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hydraulic-heat.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/palette.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const HEAT_RED = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart4;
const HEAT_RED_DARK = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].semantic.danger.strong;
const HEAT_AMBER = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart3;
const HEAT_CYAN = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart1;
const HEAT_CYAN_DARK = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].accent.strong;
function isPointFeature(feature) {
    const coords = feature.geometry?.coordinates;
    return feature.geometry?.type === "Point" && Array.isArray(coords) && coords.length >= 2;
}
function isLineFeature(feature) {
    const coords = feature.geometry?.coordinates;
    return feature.geometry?.type === "LineString" && Array.isArray(coords) && coords.length >= 2;
}
function featureLatLng(feature) {
    if (!isPointFeature(feature)) return null;
    const [lng, lat] = feature.geometry.coordinates;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return [
        lat,
        lng
    ];
}
function featureLineLatLngs(feature) {
    if (!isLineFeature(feature)) return [];
    return (feature.geometry.coordinates || []).map((coord)=>{
        const [lng, lat] = coord;
        return Number.isFinite(lat) && Number.isFinite(lng) ? [
            lat,
            lng
        ] : null;
    }).filter(Boolean);
}
function heatColor(mode, feature) {
    const props = feature.properties || {};
    if (mode === "pipe_flow") {
        const flow = Math.abs(Number(props.flow_rate_max_abs ?? props.flow_rate_avg ?? props.flow_rate ?? 0));
        if (flow >= 50) return HEAT_RED_DARK;
        if (flow >= 20) return HEAT_RED;
        if (flow >= 5) return HEAT_AMBER;
        if (flow > 0) return HEAT_CYAN;
        return HEAT_CYAN;
    }
    if (mode === "leakage_risk") {
        const score = typeof props.risk_score === "number" ? props.risk_score : 0;
        if (score >= 0.8) return HEAT_RED;
        if (score >= 0.55) return HEAT_AMBER;
        return HEAT_CYAN;
    }
    if (mode === "low_pressure") {
        const pressure = typeof props.pressure === "number" ? props.pressure : typeof props.pressure_min === "number" ? props.pressure_min : null;
        if (pressure == null) return HEAT_RED;
        if (pressure < 5) return HEAT_RED_DARK;
        if (pressure < 10) return HEAT_RED;
        return HEAT_AMBER;
    }
    const pressure = typeof props.pressure === "number" ? props.pressure : typeof props.pressure_min === "number" ? props.pressure_min : null;
    if (pressure == null) return HEAT_CYAN;
    if (pressure < 10) return HEAT_RED;
    if (pressure < 20) return HEAT_AMBER;
    if (pressure < 30) return HEAT_CYAN;
    if (pressure < 45) return HEAT_CYAN;
    return HEAT_CYAN_DARK;
}
function heatRadius(mode, feature) {
    const props = feature.properties || {};
    if (mode === "leakage_risk") {
        const score = typeof props.risk_score === "number" ? props.risk_score : 0;
        return 18 + Math.max(0, Math.min(20, score * 24));
    }
    if (mode === "low_pressure") {
        const pressure = typeof props.pressure === "number" ? props.pressure : typeof props.pressure_min === "number" ? props.pressure_min : 7;
        const severity = Math.max(0, 15 - Number(pressure));
        return 18 + Math.min(18, severity * 1.3);
    }
    const pressure = typeof props.pressure === "number" ? props.pressure : typeof props.pressure_min === "number" ? props.pressure_min : 20;
    if (pressure < 10) return 30;
    if (pressure < 20) return 26;
    if (pressure < 30) return 22;
    if (pressure < 45) return 18;
    return 15;
}
const HEAT_LEGENDS = {
    pressure: [
        {
            color: HEAT_RED,
            label: "Critically low · below 10 m"
        },
        {
            color: HEAT_AMBER,
            label: "Low · 10-20 m"
        },
        {
            color: HEAT_CYAN,
            label: "Moderate · 20-45 m"
        },
        {
            color: HEAT_CYAN_DARK,
            label: "High · 45 m and above"
        }
    ],
    low_pressure: [
        {
            color: HEAT_RED_DARK,
            label: "Critical · below 5 m"
        },
        {
            color: HEAT_RED,
            label: "Low · 5-10 m"
        },
        {
            color: HEAT_AMBER,
            label: "10 m and above"
        }
    ],
    pipe_flow: [
        {
            color: HEAT_CYAN,
            label: "No or very low flow"
        },
        {
            color: HEAT_AMBER,
            label: "Moderate flow"
        },
        {
            color: HEAT_RED,
            label: "High flow"
        },
        {
            color: HEAT_RED_DARK,
            label: "Very high flow"
        }
    ],
    leakage_risk: [
        {
            color: HEAT_CYAN,
            label: "Elevated · below 55%"
        },
        {
            color: HEAT_AMBER,
            label: "High · 55-79%"
        },
        {
            color: HEAT_RED,
            label: "Critical · 80% and above"
        }
    ]
};
const HEAT_GRADIENTS = {
    pressure: `linear-gradient(90deg, ${HEAT_RED}, ${HEAT_AMBER}, ${HEAT_CYAN}, ${HEAT_CYAN_DARK})`,
    low_pressure: `linear-gradient(90deg, ${HEAT_RED_DARK}, ${HEAT_RED}, ${HEAT_AMBER})`,
    pipe_flow: `linear-gradient(90deg, ${HEAT_CYAN}, ${HEAT_AMBER}, ${HEAT_RED}, ${HEAT_RED_DARK})`,
    leakage_risk: `linear-gradient(90deg, ${HEAT_CYAN}, ${HEAT_AMBER}, ${HEAT_RED})`
};
function tooltipRows(mode, feature) {
    const props = feature.properties || {};
    if (mode === "pipe_flow") {
        return [
            [
                "Pipe",
                String(props.element_id || "Unknown")
            ],
            [
                "Mean flow",
                typeof props.flow_rate_avg === "number" ? `${props.flow_rate_avg.toFixed(3)} m³/h` : "Not available"
            ],
            [
                "Peak flow",
                typeof props.flow_rate_max_abs === "number" ? `${props.flow_rate_max_abs.toFixed(3)} m³/h` : "Not available"
            ]
        ];
    }
    if (mode === "leakage_risk") {
        return [
            [
                "Pipe",
                String(props.pipe_id || props.element_id || "Unknown")
            ],
            [
                "Risk",
                String(props.risk_level || "Not specified").replaceAll("_", " ")
            ],
            [
                "Score",
                typeof props.risk_score === "number" ? `${(props.risk_score * 100).toFixed(0)}%` : "Not available"
            ]
        ];
    }
    if (mode === "low_pressure") {
        return [
            [
                "Node",
                String(props.element_id || "Unknown")
            ],
            [
                "Pressure",
                typeof props.pressure === "number" ? `${props.pressure.toFixed(2)} m` : typeof props.pressure_min === "number" ? `${props.pressure_min.toFixed(2)} m` : "Not available"
            ],
            [
                "Low-pressure hits",
                typeof props.low_pressure_hits === "number" ? String(props.low_pressure_hits) : props.is_low_pressure === true ? "1" : "0"
            ]
        ];
    }
    return [
        [
            "Node",
            String(props.element_id || "Unknown")
        ],
        [
            "Pressure",
            typeof props.pressure === "number" ? `${props.pressure.toFixed(2)} m` : typeof props.pressure_min === "number" ? `${props.pressure_min.toFixed(2)} m` : "Not available"
        ],
        [
            "Average",
            typeof props.pressure_avg === "number" ? `${props.pressure_avg.toFixed(2)} m` : "Not available"
        ]
    ];
}
function MapBounds({ features }) {
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const points = features.flatMap((feature)=>{
            const point = featureLatLng(feature);
            if (point) return [
                point
            ];
            return featureLineLatLngs(feature);
        }).filter(Boolean);
        if (!points.length) return;
        map.fitBounds(points, {
            padding: [
                24,
                24
            ]
        });
    }, [
        features,
        map
    ]);
    return null;
}
function HydraulicHeatMap({ mode, nodesGeojson, pipesGeojson, hotspotsGeojson }) {
    const { resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    const features = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (mode === "leakage_risk") {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeoJsonFeatures"])(hotspotsGeojson).filter(isPointFeature);
        }
        if (mode === "pipe_flow") {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeoJsonFeatures"])(pipesGeojson).filter((feature)=>isPointFeature(feature) || isLineFeature(feature));
        }
        const nodeFeatures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeoJsonFeatures"])(nodesGeojson).filter(isPointFeature);
        if (mode === "low_pressure") {
            return nodeFeatures.filter((feature)=>{
                const props = feature.properties || {};
                return props.is_low_pressure === true || typeof props.low_pressure_hits === "number" && Number(props.low_pressure_hits) > 0;
            });
        }
        return nodeFeatures;
    }, [
        hotspotsGeojson,
        mode,
        nodesGeojson,
        pipesGeojson
    ]);
    const mapCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const firstPoint = features.map(featureLatLng).find(Boolean);
        return firstPoint || [
            -6.8,
            39.28
        ];
    }, [
        features
    ]);
    const tileUrl = theme === "dark" ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: mapCenter,
                zoom: 13,
                scrollWheelZoom: true,
                className: "h-[25rem] w-full bg-slate-100 dark:bg-slate-950",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TileLayer"], {
                        url: tileUrl,
                        attribution: theme === "dark" ? "&copy; OSM &copy; CARTO" : "&copy; OpenStreetMap contributors"
                    }, void 0, false, {
                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Pane$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pane"], {
                        name: "hydraulic-heat-hit",
                        className: "hydraulic-heat-hit-pane"
                    }, void 0, false, {
                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MapBounds, {
                        features: features
                    }, void 0, false, {
                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                        lineNumber: 237,
                        columnNumber: 9
                    }, this),
                    features.map((feature, index)=>{
                        const latLng = featureLatLng(feature);
                        const color = heatColor(mode, feature);
                        const radius = heatRadius(mode, feature);
                        const rows = tooltipRows(mode, feature);
                        if (mode === "pipe_flow" && isLineFeature(feature)) {
                            const line = featureLineLatLngs(feature);
                            if (!line.length) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Polyline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Polyline"], {
                                positions: line,
                                pathOptions: {
                                    color,
                                    weight: 4,
                                    opacity: 0.92
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popup"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-40 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-2 font-semibold",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HYDRAULIC_HEAT_MODE_LABELS"][mode]
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                lineNumber: 256,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: rows.map(([label, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-slate-500",
                                                                children: label
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                                lineNumber: 260,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-slate-900",
                                                                children: value
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                                lineNumber: 261,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, label, true, {
                                                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                        lineNumber: 259,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                lineNumber: 257,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                        lineNumber: 255,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                    lineNumber: 254,
                                    columnNumber: 17
                                }, this)
                            }, `${mode}-${index}`, false, {
                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                lineNumber: 249,
                                columnNumber: 15
                            }, this);
                        }
                        if (!latLng) return null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleMarker"], {
                                center: latLng,
                                pane: "hydraulic-heat-hit",
                                radius: mode === "pipe_flow" ? 6 : Math.max(5, Math.min(8, radius / 3.5)),
                                pathOptions: {
                                    color: HEAT_CYAN_DARK,
                                    weight: 1.2,
                                    fillColor: color,
                                    fillOpacity: 0.92
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popup"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-40 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-2 font-semibold",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HYDRAULIC_HEAT_MODE_LABELS"][mode]
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                lineNumber: 288,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: rows.map(([label, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-slate-500",
                                                                children: label
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                                lineNumber: 292,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-slate-900",
                                                                children: value
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                                lineNumber: 293,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, label, true, {
                                                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                        lineNumber: 291,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                                lineNumber: 289,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                        lineNumber: 287,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                    lineNumber: 286,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                lineNumber: 275,
                                columnNumber: 15
                            }, this)
                        }, `${mode}-${index}`, false, {
                            fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                            lineNumber: 274,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                lineNumber: 231,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute bottom-4 left-4 z-[900] min-w-52 rounded-md border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/95",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 text-xs font-semibold text-slate-950 dark:text-white",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HYDRAULIC_HEAT_MODE_LABELS"][mode]
                    }, void 0, false, {
                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 h-2 w-full rounded-full ring-1 ring-slate-900/10",
                        style: {
                            background: HEAT_GRADIENTS[mode]
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1.5",
                        children: HEAT_LEGENDS[mode].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "h-3 w-3 shrink-0 rounded-full border border-white/70 shadow-sm",
                                        style: {
                                            backgroundColor: item.color
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                        lineNumber: 312,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                        lineNumber: 313,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, item.label, true, {
                                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                                lineNumber: 311,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/maps/hydraulic-heat-map.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HydraulicReportDetailsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-clock.js [app-ssr] (ecmascript) <export default as CalendarClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-ssr] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileChartColumn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-chart-column.js [app-ssr] (ecmascript) <export default as FileChartColumn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-ssr] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.js [app-ssr] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-ssr] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.js [app-ssr] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/palette.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$page$2d$access$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-page-access.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$maps$2f$hydraulic$2d$heat$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/maps/hydraulic-heat-map.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hydraulic-heat.ts [app-ssr] (ecmascript)");
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
const number = (value, unit = "", digits = 2)=>typeof value === "number" ? `${value.toLocaleString(undefined, {
        maximumFractionDigits: digits
    })}${unit}` : "Not available";
const date = (value)=>value ? new Date(value).toLocaleString() : "Not recorded";
const label = (value)=>(value || "Not specified").replaceAll("_", " ");
const snapshotLabel = (value)=>value.replaceAll("_", " ").replace(/epanet/gi, "hydraulic");
const extractIliFromWarnings = (warnings)=>{
    for (const warning of warnings){
        const match = warning.match(/\bILI\s*=\s*([0-9]+(?:\.[0-9]+)?)/i);
        if (!match) continue;
        const parsed = Number(match[1]);
        if (Number.isFinite(parsed)) return parsed;
    }
    return null;
};
function Metric({ title, value, note, icon: Icon }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-l-2 border-sky-500 px-4 py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 40,
                        columnNumber: 147
                    }, this),
                    title
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 40,
                columnNumber: 63
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-2xl font-bold text-slate-950 dark:text-white",
                children: value
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 40,
                columnNumber: 188
            }, this),
            note ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-slate-500",
                children: note
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 40,
                columnNumber: 277
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
        lineNumber: 40,
        columnNumber: 10
    }, this);
}
function Section({ title, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "border-b border-slate-200 px-5 py-3 text-lg font-semibold dark:border-slate-700",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 44,
                columnNumber: 115
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-5",
                children: children
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 44,
                columnNumber: 223
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
        lineNumber: 44,
        columnNumber: 10
    }, this);
}
function SnapshotPrimitive({ value }) {
    if (value === null || value === undefined || value === "") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-slate-400 dark:text-slate-500",
            children: "Not recorded"
        }, void 0, false, {
            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
            lineNumber: 49,
            columnNumber: 12
        }, this);
    }
    if (typeof value === "boolean") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${value ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`,
            children: value ? "true" : "false"
        }, void 0, false, {
            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    const displayedValue = typeof value === "string" ? value.replace(/epanet_rpt/gi, "hydraulic rpt").replace(/epanet/gi, "hydraulic") : String(value);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "break-words font-medium text-slate-900 dark:text-slate-100",
        children: displayedValue
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
        lineNumber: 64,
        columnNumber: 10
    }, this);
}
function SnapshotEntry({ name, value, depth = 0 }) {
    const isArray = Array.isArray(value);
    const isObject = value !== null && typeof value === "object" && !isArray;
    if (!isArray && !isObject) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid gap-1 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-800 sm:grid-cols-[minmax(180px,0.4fr)_minmax(0,1fr)] sm:gap-5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "break-words text-sm text-slate-500 dark:text-slate-400",
                    children: snapshotLabel(name)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SnapshotPrimitive, {
                    value: value
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this);
    }
    const entries = isArray ? value.map((item, index)=>[
            `Item ${index + 1}`,
            item
        ]) : Object.entries(value);
    const countLabel = `${entries.length} ${isArray ? entries.length === 1 ? "item" : "items" : entries.length === 1 ? "attribute" : "attributes"}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        open: depth === 0,
        className: "group/snapshot-entry border-b border-slate-200 last:border-b-0 dark:border-slate-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                className: "flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/50 [&::-webkit-details-marker]:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "break-words",
                        children: snapshotLabel(name)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex shrink-0 items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                                children: countLabel
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "h-5 w-5 text-slate-700 transition-transform duration-200 group-open/snapshot-entry:rotate-180 dark:text-slate-200",
                                strokeWidth: 2.75,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: depth === 0 ? "border-t border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/20" : "ml-4 border-l border-slate-200 dark:border-slate-700",
                children: entries.length ? entries.map(([entryName, entryValue])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SnapshotEntry, {
                        name: entryName,
                        value: entryValue,
                        depth: depth + 1
                    }, `${name}-${entryName}`, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-4 py-3 text-sm text-slate-400",
                    children: "No values recorded"
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                    lineNumber: 97,
                    columnNumber: 14
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
function HydraulicReportDetailsPage({ snapshotId }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$page$2d$access$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageAccess"])();
    const [report, setReport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedHeatMode, setSelectedHeatMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [flowBalanceView, setFlowBalanceView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`/hydraulic-model/snapshots/${encodeURIComponent(snapshotId)}`, {
            timeout: 20_000,
            retries: 0
        }).then((response)=>{
            if (!active) return;
            if (response.success && response.data) setReport(response.data);
            else setError(response.error || "Hydraulic report could not be loaded.");
            setLoading(false);
        });
        return ()=>{
            active = false;
        };
    }, [
        snapshotId
    ]);
    const summary = report?.summary_json || {};
    const leakage = report?.leakage_json || {};
    const nrw = report?.nrw_json || leakage.nrw || {};
    const hydraulicArtifacts = summary.hydraulic_report_artifacts || {};
    const artifactBalance = hydraulicArtifacts.hydraulic_balance || hydraulicArtifacts.flow_balance || {};
    const artifactStatusEvents = hydraulicArtifacts.status_events || [];
    const artifactWarnings = hydraulicArtifacts.warnings || [];
    const warnings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            ...new Set([
                ...report?.alerts_json?.warnings || [],
                ...leakage.warnings || [],
                ...report?.error_message ? [
                    report.error_message
                ] : []
            ])
        ], [
        leakage,
        report
    ]);
    const iliValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (typeof nrw.ili === "number") return nrw.ili;
        return extractIliFromWarnings(warnings);
    }, [
        nrw.ili,
        warnings
    ]);
    const zones = leakage.pressure_zones || [];
    const risks = leakage.pipe_risks_top20 || [];
    const balance = leakage.timestep_balance || [];
    const heatModes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAvailableHydraulicHeatModes"])({
            nodesGeojson: report?.nodes_geojson,
            pipesGeojson: report?.pipes_geojson,
            hotspotsGeojson: report?.hotspots_geojson
        }), [
        report?.hotspots_geojson,
        report?.nodes_geojson,
        report?.pipes_geojson
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!heatModes.length) {
            setSelectedHeatMode(null);
            return;
        }
        setSelectedHeatMode((current)=>current && heatModes.includes(current) ? current : heatModes[0]);
    }, [
        heatModes
    ]);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-[60vh] items-center justify-center text-slate-500",
        children: "Loading hydraulic scenario..."
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
        lineNumber: 150,
        columnNumber: 23
    }, this);
    if (error || !report) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-xl py-20 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                className: "mx-auto h-9 w-9 text-red-500"
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 151,
                columnNumber: 84
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "mt-3 text-xl font-bold",
                children: "Scenario unavailable"
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 151,
                columnNumber: 140
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-slate-500",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 151,
                columnNumber: 204
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                asChild: true,
                className: "mt-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard/hydraulic-reports",
                    children: "Back to scenarios"
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                    lineNumber: 151,
                    columnNumber: 283
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 151,
                columnNumber: 250
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
        lineNumber: 151,
        columnNumber: 32
    }, this);
    const failed = report.scenario_status?.toUpperCase() === "FAILED";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex flex-wrap items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                asChild: true,
                                className: "mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard/hydraulic-reports",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 156,
                                            columnNumber: 174
                                        }, this),
                                        "Back to Hydraulic Scenarios"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 156,
                                    columnNumber: 132
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 156,
                                columnNumber: 81
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileChartColumn$3e$__["FileChartColumn"], {
                                        className: "mt-1 h-7 w-7 text-sky-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 290
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold uppercase text-sky-700 dark:text-sky-300",
                                                children: "Hydraulic model scenario"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 352
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-3xl font-bold text-slate-950 dark:text-white",
                                                children: report.report_reference || report.id
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 458
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-slate-600 dark:text-slate-300",
                                                children: report.scenario_name || "DMA hydraulic scenario"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 567
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 347
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 156,
                                columnNumber: 250
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 156,
                        columnNumber: 76
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `rounded-full border px-3 py-1 text-sm font-semibold ${failed ? "border-red-300 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200" : "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"}`,
                        children: label(report.scenario_status).toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 156,
                        columnNumber: 694
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Run context",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-5 md:grid-cols-2 xl:grid-cols-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-500",
                                    children: "Utility"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 99
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold",
                                    children: report.utility_name || "Historical utility"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 148
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 158,
                            columnNumber: 94
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-500",
                                    children: "DMA"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 237
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold",
                                    children: report.dma_name || "Historical DMA"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 282
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 158,
                            columnNumber: 232
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "flex items-center gap-2 text-sm text-slate-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 158,
                                            columnNumber: 425
                                        }, this),
                                        "Run by"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 363
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold",
                                    children: report.created_by_name || "System"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 468
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-500",
                                    children: report.created_by_email || label(report.created_by_role)
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 537
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 158,
                            columnNumber: 358
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "flex items-center gap-2 text-sm text-slate-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 158,
                                            columnNumber: 710
                                        }, this),
                                        "Completed"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 648
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold",
                                    children: date(report.completed_at || report.created_at)
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 760
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-500",
                                    children: [
                                        "Duration: ",
                                        number(report.execution_duration_seconds, " seconds", 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 841
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 158,
                            columnNumber: 643
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                    lineNumber: 158,
                    columnNumber: 36
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            failed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Simulation failure",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 text-red-800 dark:text-red-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "h-5 w-5 shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 160,
                            columnNumber: 112
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold",
                                    children: "The hydraulic run did not complete successfully."
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 160,
                                    columnNumber: 163
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-sm",
                                    children: report.error_message || "The model did not provide further diagnostic information."
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 160,
                                    columnNumber: 244
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 160,
                            columnNumber: 158
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                    lineNumber: 160,
                    columnNumber: 53
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 160,
                columnNumber: 17
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Hydraulic performance",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
                                title: "Minimum pressure",
                                value: number(summary.pressure_min_m, " m")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 162,
                                columnNumber: 104
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
                                title: "Average pressure",
                                value: number(summary.pressure_avg_m, " m")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 162,
                                columnNumber: 197
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
                                title: "Maximum pressure",
                                value: number(summary.pressure_max_m, " m")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 162,
                                columnNumber: 290
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
                                title: "Maximum flow",
                                value: number(summary.flow_max_m3s, " m³/s", 4)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 162,
                                columnNumber: 383
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 162,
                        columnNumber: 46
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"],
                                title: "Network nodes",
                                value: number(summary.total_nodes, "", 0)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 162,
                                columnNumber: 548
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"],
                                title: "Network pipes",
                                value: number(summary.total_pipes, "", 0)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 162,
                                columnNumber: 638
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
                                title: "Low-pressure nodes",
                                value: number(summary.low_pressure_nodes, "", 0)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 162,
                                columnNumber: 728
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"],
                                title: "Simulation duration",
                                value: number(summary.duration_hrs, " hours", 0)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 162,
                                columnNumber: 836
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 162,
                        columnNumber: 485
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Water balance and non-revenue water",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
                                title: "System inflow",
                                value: number(nrw.total_inflow_m3h ?? nrw.system_input_m3h, " m³/h")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 164,
                                columnNumber: 118
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
                                title: "Consumer demand",
                                value: number(nrw.consumer_demand_m3h ?? nrw.authorised_m3h, " m³/h")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 164,
                                columnNumber: 236
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"],
                                title: "Non-revenue water",
                                value: number(nrw.nrw_pct, "%", 1),
                                note: number(nrw.nrw_m3h, " m³/h")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 164,
                                columnNumber: 357
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
                                title: "Infrastructure leakage index",
                                value: number(iliValue, "", 1)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 164,
                                columnNumber: 484
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 164,
                        columnNumber: 60
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 grid gap-5 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
                                title: "Estimated real losses",
                                value: number(nrw.real_loss_m3h, " m³/h")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 164,
                                columnNumber: 630
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
                                title: "Estimated apparent losses",
                                value: number(nrw.apparent_loss_m3h, " m³/h")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 164,
                                columnNumber: 729
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 164,
                        columnNumber: 582
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            warnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Model warnings",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "space-y-2",
                    children: warnings.map((warning, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "h-4 w-4 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 166,
                                    columnNumber: 310
                                }, this),
                                warning
                            ]
                        }, `${warning}-${index}`, true, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 166,
                            columnNumber: 118
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                    lineNumber: 166,
                    columnNumber: 58
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 166,
                columnNumber: 26
            }, this) : null,
            Object.keys(hydraulicArtifacts).length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Hydraulic run artifacts",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
                                title: "Recorded inflow",
                                value: number(artifactBalance.total_inflow_m3h, " m³/h")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
                                title: "Recorded demand",
                                value: number(artifactBalance.consumer_demand_m3h, " m³/h")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"],
                                title: "Recorded NRW",
                                value: number(artifactBalance.nrw_pct, "%", 1),
                                note: number(artifactBalance.nrw_m3h, " m³/h")
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"],
                                title: "Status events",
                                value: number(hydraulicArtifacts.status_event_count, "", 0)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 grid gap-4 lg:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-slate-200 dark:border-slate-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-b border-slate-200 px-4 py-3 dark:border-slate-700",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-slate-950 dark:text-white",
                                            children: "Balance details"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 179,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-72 overflow-auto",
                                        children: Object.keys(artifactBalance).length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SnapshotEntry, {
                                            name: "hydraulic balance",
                                            value: artifactBalance
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 183,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "px-4 py-3 text-sm text-slate-500",
                                            children: "No balance attributes were recorded."
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 185,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-slate-200 dark:border-slate-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-b border-slate-200 px-4 py-3 dark:border-slate-700",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-slate-950 dark:text-white",
                                            children: "Status and warnings"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 191,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-72 overflow-auto",
                                        children: [
                                            artifactWarnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SnapshotEntry, {
                                                name: "warnings",
                                                value: artifactWarnings
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 194,
                                                columnNumber: 44
                                            }, this) : null,
                                            artifactStatusEvents.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SnapshotEntry, {
                                                name: "status events",
                                                value: artifactStatusEvents
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 48
                                            }, this) : null,
                                            !artifactWarnings.length && !artifactStatusEvents.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "px-4 py-3 text-sm text-slate-500",
                                                children: "No status events or warnings were recorded."
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 197,
                                                columnNumber: 19
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 193,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 189,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 169,
                columnNumber: 9
            }, this) : null,
            balance.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Hourly flow balance",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex flex-wrap justify-end gap-2",
                        children: [
                            [
                                'all',
                                'All'
                            ],
                            [
                                'inflow',
                                'Inflow'
                            ],
                            [
                                'demand',
                                'Demand'
                            ],
                            [
                                'nrw',
                                'NRW'
                            ]
                        ].map(([view, viewLabel])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "sm",
                                variant: flowBalanceView === view ? "default" : "outline",
                                onClick: ()=>setFlowBalanceView(view),
                                "aria-pressed": flowBalanceView === view,
                                children: viewLabel
                            }, view, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 205,
                                columnNumber: 260
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 205,
                        columnNumber: 62
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-80",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                            width: "100%",
                            height: "100%",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LineChart"], {
                                data: balance,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                        strokeDasharray: "3 3"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 567
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                        dataKey: "hour"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 606
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 630
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 639
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 650
                                    }, this),
                                    flowBalanceView === "all" || flowBalanceView === "inflow" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                                        type: "monotone",
                                        dataKey: "inflow_m3h",
                                        name: "Inflow m³/h",
                                        stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart1,
                                        strokeWidth: 2,
                                        dot: false
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 721
                                    }, this) : null,
                                    flowBalanceView === "all" || flowBalanceView === "demand" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                                        type: "monotone",
                                        dataKey: "demand_m3h",
                                        name: "Demand m³/h",
                                        stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart2,
                                        strokeWidth: 2,
                                        dot: false
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 912
                                    }, this) : null,
                                    flowBalanceView === "all" || flowBalanceView === "nrw" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                                        type: "monotone",
                                        dataKey: "nrw_m3h",
                                        name: "NRW m³/h",
                                        stroke: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$palette$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PALETTE"].chart.chart4,
                                        strokeWidth: 2,
                                        dot: false
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 1100
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 205,
                                columnNumber: 541
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 205,
                            columnNumber: 493
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 205,
                        columnNumber: 471
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 205,
                columnNumber: 25
            }, this) : null,
            selectedHeatMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Hydraulic heat map",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: heatModes.map((mode)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "sm",
                                variant: selectedHeatMode === mode ? "default" : "outline",
                                onClick: ()=>setSelectedHeatMode(mode),
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HYDRAULIC_HEAT_MODE_LABELS"][mode]
                            }, mode, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 211,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm text-slate-500 dark:text-slate-400",
                        children: [
                            "Saved scenario intensity view for ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydraulic$2d$heat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HYDRAULIC_HEAT_MODE_LABELS"][selectedHeatMode].toLowerCase(),
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$maps$2f$hydraulic$2d$heat$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HydraulicHeatMap"], {
                            mode: selectedHeatMode,
                            nodesGeojson: report.nodes_geojson,
                            pipesGeojson: report.pipes_geojson,
                            hotspotsGeojson: report.hotspots_geojson
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 226,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 225,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 208,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-5 xl:grid-cols-2",
                children: [
                    zones.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        title: "Pressure zones",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: zones.map((zone)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium capitalize",
                                            children: label(zone.zone)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 236,
                                            columnNumber: 266
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                zone.count,
                                                " nodes · ",
                                                number(zone.pct, "%", 1)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 236,
                                            columnNumber: 332
                                        }, this)
                                    ]
                                }, zone.zone, true, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 236,
                                    columnNumber: 146
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 236,
                            columnNumber: 98
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 236,
                        columnNumber: 66
                    }, this) : null,
                    risks.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        title: "Highest-risk pipes",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-h-80 overflow-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-b text-left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "py-2",
                                                    children: "Pipe"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 592
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Risk"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 622
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Score"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 635
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Pressure"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 649
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                            lineNumber: 236,
                                            columnNumber: 557
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 236,
                                        columnNumber: 550
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: risks.map((risk)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-b border-slate-100 dark:border-slate-800",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 font-medium",
                                                        children: risk.pipe_id
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 790
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "capitalize",
                                                        children: label(risk.risk_level)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 842
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: number(risk.risk_score)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 898
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: number(risk.min_pressure_adjacent, " m")
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 932
                                                    }, this)
                                                ]
                                            }, risk.pipe_id, true, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 236,
                                                columnNumber: 707
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 236,
                                        columnNumber: 679
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 236,
                                columnNumber: 516
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 236,
                            columnNumber: 476
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 236,
                        columnNumber: 440
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 236,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Simulation inputs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                    children: Object.entries(report.input_parameters_json || {}).filter(([key])=>!key.startsWith("_") && key !== "extra_demands" && key !== "gpkg_filename").map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm capitalize text-slate-500",
                                    children: label(key)
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 238,
                                    columnNumber: 283
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "break-words font-medium",
                                    children: typeof value === "object" ? JSON.stringify(value) : String(value ?? "Not set")
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                    lineNumber: 238,
                                    columnNumber: 348
                                }, this)
                            ]
                        }, key, true, {
                            fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                            lineNumber: 238,
                            columnNumber: 268
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                    lineNumber: 238,
                    columnNumber: 42
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "group/snapshot-panel rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        className: "flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 [&::-webkit-details-marker]:hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold text-slate-950 dark:text-white",
                                        children: "Complete snapshot data"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 243,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-slate-500 dark:text-slate-400",
                                        children: "View all recorded simulation attributes and values."
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 244,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "h-6 w-6 shrink-0 text-slate-800 transition-transform duration-200 group-open/snapshot-panel:rotate-180 dark:text-slate-100",
                                strokeWidth: 3,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 246,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-slate-200 p-5 dark:border-slate-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Snapshot schema version ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "text-slate-800 dark:text-slate-200",
                                                children: report.snapshot_version
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 250,
                                                columnNumber: 43
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Result quality ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "text-slate-800 dark:text-slate-200",
                                                children: label(report.result_quality)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                                lineNumber: 251,
                                                columnNumber: 34
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 251,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-h-[36rem] overflow-auto rounded-md border border-slate-200 dark:border-slate-700",
                                children: Object.entries({
                                    summary: report.summary_json,
                                    nrw: report.nrw_json,
                                    leakage: report.leakage_json,
                                    alerts: report.alerts_json
                                }).map(([name, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SnapshotEntry, {
                                        name: name,
                                        value: value
                                    }, name, false, {
                                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/_views/hydraulic-report-details-page.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_12c4c590._.js.map