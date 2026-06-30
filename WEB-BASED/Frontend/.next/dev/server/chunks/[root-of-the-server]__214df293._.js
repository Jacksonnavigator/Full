module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CONFIG",
    ()=>CONFIG,
    "default",
    ()=>__TURBOPACK__default__export__,
    "resolveApiBaseUrl",
    ()=>resolveApiBaseUrl
]);
/**
 * Majiscope Frontend - Global Configuration
 * Centralized URL management for all API calls
 * 
 * This file is the single source of truth for backend communication
 * All backends calls should flow through this configuration
 */ // ============================================================
// API Base URL Configuration
// ============================================================
// Environment variables loaded from .env.local
const DEFAULT_BACKEND_URL = "http://localhost:8000";
const rawBackendUrl = ("TURBOPACK compile-time value", "https://majiscope.onrender.com") || "";
const usingFallbackBackendUrl = !rawBackendUrl;
const BACKEND_URL = (rawBackendUrl || DEFAULT_BACKEND_URL).replace(/\/+$/, "");
const BACKEND_API_PREFIX = '/api';
const isLoopbackBackendUrl = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/i.test(BACKEND_URL);
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
function normalizeBackendOrigin(candidate) {
    const trimmed = candidate.trim();
    if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
        return null;
    }
    const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
    return withoutTrailingSlash.endsWith(BACKEND_API_PREFIX) ? withoutTrailingSlash.slice(0, -BACKEND_API_PREFIX.length) : withoutTrailingSlash;
}
const CONFIG = {
    // ===== Backend Server Configuration =====
    backend: {
        baseUrl: BACKEND_URL,
        apiPrefix: BACKEND_API_PREFIX,
        fullUrl: `${BACKEND_URL}${BACKEND_API_PREFIX}`,
        usingFallbackBaseUrl: usingFallbackBackendUrl,
        isLoopbackBaseUrl: isLoopbackBackendUrl
    },
    // ===== Authentication Endpoints =====
    auth: {
        loginEndpoint: '/auth/login',
        logoutEndpoint: '/auth/logout',
        refreshEndpoint: '/auth/refresh',
        verifyEndpoint: '/auth/verify',
        requestPasswordResetEndpoint: '/auth/password-reset/request',
        validatePasswordResetEndpoint: '/auth/password-reset/validate',
        completePasswordResetEndpoint: '/auth/password-reset/complete'
    },
    // ===== Local Storage Keys =====
    storage: {
        tokenKey: 'access_token',
        refreshTokenKey: 'refresh_token',
        userKey: 'current_user'
    },
    // ===== Token Configuration =====
    token: {
        expiryBufferMs: 5 * 60 * 1000
    },
    // ===== Request Configuration =====
    request: {
        timeout: 120000,
        retryAttempts: 3,
        retryDelay: 1000
    }
};
function resolveApiBaseUrl(backendOriginOverride) {
    const normalizedOrigin = normalizeBackendOrigin(backendOriginOverride || "");
    return normalizedOrigin ? `${normalizedOrigin}${BACKEND_API_PREFIX}` : CONFIG.backend.fullUrl;
}
const __TURBOPACK__default__export__ = CONFIG;
}),
"[project]/app/api/upload-payload/[imageId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-route] (ecmascript)");
;
;
const BACKEND_URL = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].backend.baseUrl;
async function GET(_request, context) {
    const { imageId } = await context.params;
    try {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].backend.usingFallbackBaseUrl) {
            console.warn(`[UploadPayloadProxy] NEXT_PUBLIC_BACKEND_URL is not set. Proxying upload payloads via fallback backend ${BACKEND_URL}.`);
        }
        const response = await fetch(`${BACKEND_URL}/api/uploads/${imageId}`, {
            cache: "no-store"
        });
        if (!response.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Failed to load upload payload (${response.status})`
            }, {
                status: response.status
            });
        }
        const payload = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(payload, {
            status: 200
        });
    } catch (error) {
        console.error("Upload payload proxy error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unable to reach backend upload service",
            hint: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].backend.usingFallbackBaseUrl ? "Set NEXT_PUBLIC_BACKEND_URL to your backend URL instead of relying on localhost fallback." : undefined
        }, {
            status: 502
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__214df293._.js.map