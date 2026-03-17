module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/WEB-BASED/Frontend/lib/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CONFIG",
    ()=>CONFIG,
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * HydraNet Frontend - Global Configuration
 * Centralized URL management for all API calls
 * 
 * This file is the single source of truth for backend communication
 * All backends calls should flow through this configuration
 */ // ============================================================
// API Base URL Configuration
// ============================================================
// Environment variables loaded from .env.local
const BACKEND_URL = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
const BACKEND_API_PREFIX = '/api';
const CONFIG = {
    // ===== Backend Server Configuration =====
    backend: {
        baseUrl: BACKEND_URL,
        apiPrefix: BACKEND_API_PREFIX,
        fullUrl: `${BACKEND_URL}${BACKEND_API_PREFIX}`
    },
    // ===== Authentication Endpoints =====
    auth: {
        loginEndpoint: '/auth/login',
        logoutEndpoint: '/auth/logout',
        refreshEndpoint: '/auth/refresh',
        verifyEndpoint: '/auth/verify'
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
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000
    }
};
const __TURBOPACK__default__export__ = CONFIG;
}),
"[project]/WEB-BASED/Frontend/lib/transform-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "transformItem",
    ()=>transformItem,
    "transformKeys",
    ()=>transformKeys,
    "transformKeysToSnakeCase",
    ()=>transformKeysToSnakeCase,
    "transformListResponse",
    ()=>transformListResponse
]);
/**
 * Utility functions to transform API response data
 * Converts snake_case from backend to camelCase for frontend
 * and vice versa for request bodies
 */ /**
 * Convert snake_case string to camelCase
 */ function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (g)=>g[1].toUpperCase());
}
/**
 * Convert camelCase string to snake_case
 */ function camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter)=>`_${letter.toLowerCase()}`);
}
function transformKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(transformKeys);
    } else if (obj !== null && typeof obj === 'object') {
        const transformed = {};
        for(const key in obj){
            if (obj.hasOwnProperty(key)) {
                const camelKey = snakeToCamel(key);
                transformed[camelKey] = transformKeys(obj[key]);
            }
        }
        return transformed;
    }
    return obj;
}
function transformKeysToSnakeCase(obj) {
    if (Array.isArray(obj)) {
        return obj.map(transformKeysToSnakeCase);
    } else if (obj !== null && typeof obj === 'object') {
        const transformed = {};
        for(const key in obj){
            if (obj.hasOwnProperty(key)) {
                const snakeKey = camelToSnake(key);
                transformed[snakeKey] = transformKeysToSnakeCase(obj[key]);
            }
        }
        return transformed;
    }
    return obj;
}
function transformListResponse(data) {
    return {
        total: data.total || 0,
        items: (data.items || []).map(transformKeys)
    };
}
function transformItem(data) {
    return transformKeys(data);
}
}),
"[project]/WEB-BASED/Frontend/lib/api-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient,
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * HydraNet Frontend - Global API Client
 * Handles all HTTP requests to the backend
 * 
 * Features:
 * - Automatic JWT authentication
 * - Request retries with exponential backoff
 * - Request timeout handling
 * - Global error handling and 401 redirect
 * - Type-safe responses
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/lib/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$transform$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/lib/transform-data.ts [app-ssr] (ecmascript)");
;
;
/**
 * Global API Client Class
 * Singleton instance handles all API communication
 */ class ApiClient {
    baseUrl;
    timeout = __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].request.timeout;
    constructor(){
        this.baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].backend.fullUrl;
    }
    /**
   * Build full URL for endpoint
   * @param endpoint - API endpoint (e.g., '/auth/login')
   * @returns Full URL for the request
   */ buildUrl(endpoint) {
        if (endpoint.startsWith('http')) return endpoint;
        return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    }
    /**
   * Get authorization header with JWT token
   * @returns Headers object with Authorization bearer token
   */ getAuthHeader() {
        const token = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.tokenKey);
        if (!token) return {};
        return {
            Authorization: `Bearer ${token}`
        };
    }
    /**
   * Fetch with timeout support
   * @param url - Request URL
   * @param options - Request options
   * @param timeout - Timeout in milliseconds
   * @returns Fetch response
   */ async fetchWithTimeout(url, options, timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), timeout);
        try {
            return await fetch(url, {
                ...options,
                signal: controller.signal
            });
        } finally{
            clearTimeout(timeoutId);
        }
    }
    /**
   * Handle 401 Unauthorized errors
   * Clears auth tokens and redirects to login
   */ handle401() {
        // Clear all auth data
        localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.tokenKey);
        localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.refreshTokenKey);
        localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.userKey);
        // Redirect to login page
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    /**
   * Main request method
   * Handles authentication, retries, timeouts, and error handling
   * 
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise<ApiResponse<T>>
   */ async request(endpoint, options = {}) {
        const { method = 'GET', body, disableAuth = false, timeout = this.timeout, retries = __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].request.retryAttempts, ...restOptions } = options;
        const url = this.buildUrl(endpoint);
        const headers = {
            'Content-Type': 'application/json',
            ...restOptions.headers
        };
        // Add auth header if not disabled
        if (!disableAuth) {
            Object.assign(headers, this.getAuthHeader());
        }
        let lastError;
        // Retry logic with exponential backoff
        for(let attempt = 0; attempt <= retries; attempt++){
            try {
                // Transform request body from camelCase to snake_case
                const transformedBody = body ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$transform$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformKeysToSnakeCase"])(body) : undefined;
                const response = await this.fetchWithTimeout(url, {
                    method,
                    headers,
                    body: transformedBody ? JSON.stringify(transformedBody) : undefined,
                    ...restOptions
                }, timeout);
                // Handle 401 - Unauthorized
                if (response.status === 401 && !disableAuth) {
                    this.handle401();
                    throw new Error('Unauthorized - redirecting to login');
                }
                // Parse response
                let data;
                try {
                    data = await response.json();
                } catch  {
                    data = {};
                }
                // Handle non-ok responses
                if (!response.ok) {
                    return {
                        success: false,
                        error: data.error || `HTTP ${response.status}`,
                        code: data.code,
                        details: data.details
                    };
                }
                // Success
                return {
                    success: true,
                    data: data.data || data
                };
            } catch (error) {
                lastError = error;
                // Don't retry on last attempt
                if (attempt === retries) break;
                // Wait before retrying with exponential backoff
                await new Promise((resolve)=>setTimeout(resolve, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].request.retryDelay * Math.pow(2, attempt)));
            }
        }
        // All retries failed
        return {
            success: false,
            error: lastError?.message || 'Network request failed',
            code: 'NETWORK_ERROR'
        };
    }
    /**
   * GET request
   */ get(endpoint, options) {
        return this.request(endpoint, {
            ...options,
            method: 'GET'
        });
    }
    /**
   * POST request
   */ post(endpoint, body, options) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body
        });
    }
    /**
   * PUT request
   */ put(endpoint, body, options) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body
        });
    }
    /**
   * PATCH request
   */ patch(endpoint, body, options) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body
        });
    }
    /**
   * DELETE request
   */ delete(endpoint, options) {
        return this.request(endpoint, {
            ...options,
            method: 'DELETE'
        });
    }
}
const apiClient = new ApiClient();
const __TURBOPACK__default__export__ = apiClient;
}),
"[project]/WEB-BASED/Frontend/store/auth-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
// ============================================================
// HydraNet - Auth Store (Zustand)
// Handles authentication state with API integration
// Uses global API client for all backend communication
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/lib/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/lib/config.ts [app-ssr] (ecmascript)");
;
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: async (email, password)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                // Call backend authentication endpoint
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].auth.loginEndpoint, {
                    email,
                    password
                });
                if (!response.success || !response.data) {
                    set({
                        isLoading: false,
                        error: response.error || "Login failed"
                    });
                    return false;
                }
                // Store JWT token in localStorage
                localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.tokenKey, response.data.access_token);
                // Map backend response to frontend CurrentUser format
                const backendUser = response.data.user;
                const currentUser = {
                    id: backendUser.id,
                    email: backendUser.email,
                    name: backendUser.name,
                    phone: backendUser.phone || null,
                    avatar: backendUser.avatar || null,
                    status: backendUser.status,
                    // Convert snake_case to camelCase for timestamps
                    createdAt: backendUser.created_at || new Date().toISOString(),
                    updatedAt: backendUser.updated_at || new Date().toISOString(),
                    // Map user_type to frontend role
                    role: backendUser.user_type === 'user' ? 'admin' : backendUser.user_type,
                    // Add manager-specific fields if available
                    utilityId: backendUser.utility_id || null,
                    utilityName: backendUser.utility_name || null,
                    dmaId: backendUser.dma_id || null,
                    dmaName: backendUser.dma_name || null
                };
                // Store user information
                set({
                    currentUser,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                return true;
            } catch (error) {
                set({
                    isLoading: false,
                    error: error.message || "An error occurred during login"
                });
                // Clear all auth tokens
                localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.tokenKey);
                localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.refreshTokenKey);
                localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].storage.userKey);
                return false;
            }
        },
        logout: ()=>{
            set({
                currentUser: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        },
        clearError: ()=>{
            set({
                error: null
            });
        }
    }), {
    name: "hydranet-auth",
    partialize: (state)=>({
            currentUser: state.currentUser,
            isAuthenticated: state.isAuthenticated
        })
}));
}),
"[project]/WEB-BASED/Frontend/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/store/auth-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/WEB-BASED/Frontend/node_modules/lucide-react/dist/esm/icons/droplets.js [app-ssr] (ecmascript) <export default as Droplets>");
"use client";
;
;
;
;
;
function RootPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setHydrated(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (hydrated) {
            if (isAuthenticated) {
                router.replace("/dashboard");
            } else {
                router.replace("/login");
            }
        }
    }, [
        hydrated,
        isAuthenticated,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                    className: "h-7 w-7 text-cyan-300"
                }, void 0, false, {
                    fileName: "[project]/WEB-BASED/Frontend/app/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/WEB-BASED/Frontend/app/page.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$WEB$2d$BASED$2f$Frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-sm text-blue-200/60",
                children: "Loading HydraNet..."
            }, void 0, false, {
                fileName: "[project]/WEB-BASED/Frontend/app/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/WEB-BASED/Frontend/app/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3fbd4c86._.js.map