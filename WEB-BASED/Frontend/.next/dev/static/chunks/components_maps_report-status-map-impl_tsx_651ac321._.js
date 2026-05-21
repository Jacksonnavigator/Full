(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/maps/report-status-map-impl.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportStatusMapImpl",
    ()=>ReportStatusMapImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/CircleMarker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const DEFAULT_CENTER = [
    -6.7924,
    39.2083
];
const CLUSTER_CELL_SIZE = 0.0035;
const getReportColor = (status)=>{
    switch(status){
        case "new":
            return {
                fill: "#ef4444",
                stroke: "#b91c1c",
                label: "Unassigned"
            };
        case "assigned":
        case "in_progress":
        case "pending_approval":
            return {
                fill: "#f59e0b",
                stroke: "#b45309",
                label: "Assigned / In Progress"
            };
        case "approved":
        case "closed":
            return {
                fill: "#10b981",
                stroke: "#047857",
                label: "Completed"
            };
        default:
            return {
                fill: "#64748b",
                stroke: "#334155",
                label: "Other"
            };
    }
};
function ReportStatusMapImpl({ title, description, reports, center, onReportSelect, emptyMessage = "No reports with location data are available for this map yet." }) {
    _s();
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const validReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportStatusMapImpl.useMemo[validReports]": ()=>reports.filter({
                "ReportStatusMapImpl.useMemo[validReports]": (report)=>Number.isFinite(report.latitude) && Number.isFinite(report.longitude) && !(report.latitude === 0 && report.longitude === 0)
            }["ReportStatusMapImpl.useMemo[validReports]"])
    }["ReportStatusMapImpl.useMemo[validReports]"], [
        reports
    ]);
    const filteredReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportStatusMapImpl.useMemo[filteredReports]": ()=>{
            switch(statusFilter){
                case "new":
                    return validReports.filter({
                        "ReportStatusMapImpl.useMemo[filteredReports]": (report)=>report.status === "new"
                    }["ReportStatusMapImpl.useMemo[filteredReports]"]);
                case "active":
                    return validReports.filter({
                        "ReportStatusMapImpl.useMemo[filteredReports]": (report)=>[
                                "assigned",
                                "in_progress",
                                "pending_approval"
                            ].includes(report.status)
                    }["ReportStatusMapImpl.useMemo[filteredReports]"]);
                case "completed":
                    return validReports.filter({
                        "ReportStatusMapImpl.useMemo[filteredReports]": (report)=>[
                                "approved",
                                "closed"
                            ].includes(report.status)
                    }["ReportStatusMapImpl.useMemo[filteredReports]"]);
                default:
                    return validReports;
            }
        }
    }["ReportStatusMapImpl.useMemo[filteredReports]"], [
        statusFilter,
        validReports
    ]);
    const clusteredReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportStatusMapImpl.useMemo[clusteredReports]": ()=>{
            const groups = new Map();
            filteredReports.forEach({
                "ReportStatusMapImpl.useMemo[clusteredReports]": (report)=>{
                    const latKey = Math.round(report.latitude / CLUSTER_CELL_SIZE);
                    const lngKey = Math.round(report.longitude / CLUSTER_CELL_SIZE);
                    const key = `${latKey}:${lngKey}`;
                    const existing = groups.get(key);
                    if (existing) {
                        existing.reports.push(report);
                        existing.latitude = existing.reports.reduce({
                            "ReportStatusMapImpl.useMemo[clusteredReports]": (sum, item)=>sum + item.latitude
                        }["ReportStatusMapImpl.useMemo[clusteredReports]"], 0) / existing.reports.length;
                        existing.longitude = existing.reports.reduce({
                            "ReportStatusMapImpl.useMemo[clusteredReports]": (sum, item)=>sum + item.longitude
                        }["ReportStatusMapImpl.useMemo[clusteredReports]"], 0) / existing.reports.length;
                    } else {
                        groups.set(key, {
                            latitude: report.latitude,
                            longitude: report.longitude,
                            reports: [
                                report
                            ]
                        });
                    }
                }
            }["ReportStatusMapImpl.useMemo[clusteredReports]"]);
            return Array.from(groups.values());
        }
    }["ReportStatusMapImpl.useMemo[clusteredReports]"], [
        filteredReports
    ]);
    const mapCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportStatusMapImpl.useMemo[mapCenter]": ()=>{
            if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
                return center;
            }
            if (filteredReports.length === 0) {
                return DEFAULT_CENTER;
            }
            const latitudeAverage = filteredReports.reduce({
                "ReportStatusMapImpl.useMemo[mapCenter]": (sum, report)=>sum + report.latitude
            }["ReportStatusMapImpl.useMemo[mapCenter]"], 0) / filteredReports.length;
            const longitudeAverage = filteredReports.reduce({
                "ReportStatusMapImpl.useMemo[mapCenter]": (sum, report)=>sum + report.longitude
            }["ReportStatusMapImpl.useMemo[mapCenter]"], 0) / filteredReports.length;
            return [
                latitudeAverage,
                longitudeAverage
            ];
        }
    }["ReportStatusMapImpl.useMemo[mapCenter]"], [
        center,
        filteredReports
    ]);
    const redCount = validReports.filter((report)=>report.status === "new").length;
    const yellowCount = validReports.filter((report)=>[
            "assigned",
            "in_progress",
            "pending_approval"
        ].includes(report.status)).length;
    const greenCount = validReports.filter((report)=>[
            "approved",
            "closed"
        ].includes(report.status)).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg shadow-slate-200/25",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-cyan-50/30 px-5 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-slate-800",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-slate-500",
                                        children: description
                                    }, void 0, false, {
                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2 text-xs font-medium",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700",
                                        children: [
                                            "Red: ",
                                            redCount,
                                            " unassigned"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700",
                                        children: [
                                            "Yellow: ",
                                            yellowCount,
                                            " assigned"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700",
                                        children: [
                                            "Green: ",
                                            greenCount,
                                            " completed"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex flex-wrap gap-2",
                        children: [
                            {
                                key: "all",
                                label: "All reports"
                            },
                            {
                                key: "new",
                                label: "New only"
                            },
                            {
                                key: "active",
                                label: "Assigned / Active"
                            },
                            {
                                key: "completed",
                                label: "Completed"
                            }
                        ].map((filterOption)=>{
                            const selected = statusFilter === filterOption.key;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setStatusFilter(filterOption.key),
                                className: `rounded-full border px-3 py-1.5 text-xs font-medium transition ${selected ? "border-cyan-500 bg-cyan-500 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`,
                                children: filterOption.label
                            }, filterOption.key, false, {
                                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                lineNumber: 172,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            filteredReports.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-[360px] items-center justify-center bg-slate-50 px-6 text-center text-sm text-slate-500",
                children: emptyMessage
            }, void 0, false, {
                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: mapCenter,
                zoom: 13,
                scrollWheelZoom: true,
                className: "h-[380px] w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }, void 0, false, {
                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this),
                    clusteredReports.map((cluster, clusterIndex)=>{
                        const primaryStatus = cluster.reports.find((report)=>report.status === "new")?.status || cluster.reports.find((report)=>[
                                "assigned",
                                "in_progress",
                                "pending_approval"
                            ].includes(report.status))?.status || cluster.reports[0]?.status || "new";
                        const color = getReportColor(primaryStatus);
                        const count = cluster.reports.length;
                        const radius = Math.min(10 + count * 2, 22);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                            center: [
                                cluster.latitude,
                                cluster.longitude
                            ],
                            radius: radius,
                            pathOptions: {
                                color: color.stroke,
                                fillColor: color.fill,
                                fillOpacity: 0.92,
                                weight: 2
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-[240px] space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-semibold uppercase tracking-wide text-slate-400",
                                                    children: count > 1 ? `${count} reports nearby` : cluster.reports[0]?.trackingId
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-slate-800",
                                                    children: count > 1 ? "Clustered report hotspot" : cluster.reports[0]?.description
                                                }, void 0, false, {
                                                    fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                            lineNumber: 229,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 text-xs text-slate-600",
                                            children: [
                                                cluster.reports.slice(0, 4).map((report)=>{
                                                    const reportColor = getReportColor(report.status);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-slate-700",
                                                                        children: report.trackingId
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                                        lineNumber: 246,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            color: reportColor.stroke
                                                                        },
                                                                        children: reportColor.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                                        lineNumber: 247,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                                lineNumber: 245,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 line-clamp-2 text-slate-500",
                                                                children: report.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                                lineNumber: 249,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-2 flex items-center justify-between gap-3",
                                                                children: [
                                                                    report.teamName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "Team: ",
                                                                            report.teamName
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                                        lineNumber: 251,
                                                                        columnNumber: 50
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Unassigned"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                                        lineNumber: 251,
                                                                        columnNumber: 89
                                                                    }, this),
                                                                    onReportSelect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        size: "sm",
                                                                        variant: "outline",
                                                                        className: "h-8 rounded-lg px-3",
                                                                        onClick: ()=>onReportSelect(report.id),
                                                                        children: "View"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                                        lineNumber: 253,
                                                                        columnNumber: 33
                                                                    }, this) : null
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                                lineNumber: 250,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, report.id, true, {
                                                        fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 27
                                                    }, this);
                                                }),
                                                count > 4 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] text-slate-400",
                                                    children: [
                                                        "+",
                                                        count - 4,
                                                        " more reports in this area"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                                    lineNumber: 267,
                                                    columnNumber: 25
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                            lineNumber: 237,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                    lineNumber: 228,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                                lineNumber: 227,
                                columnNumber: 17
                            }, this)
                        }, `${cluster.latitude}-${cluster.longitude}-${clusterIndex}`, false, {
                            fileName: "[project]/components/maps/report-status-map-impl.tsx",
                            lineNumber: 216,
                            columnNumber: 15
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/maps/report-status-map-impl.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/maps/report-status-map-impl.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_s(ReportStatusMapImpl, "VmVOLJeANSgUNFfSkvL+s4BeAg8=");
_c = ReportStatusMapImpl;
var _c;
__turbopack_context__.k.register(_c, "ReportStatusMapImpl");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/maps/report-status-map-impl.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/maps/report-status-map-impl.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_maps_report-status-map-impl_tsx_651ac321._.js.map