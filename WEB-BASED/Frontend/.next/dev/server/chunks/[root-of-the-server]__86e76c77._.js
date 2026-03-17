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
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
// ============================================================
// HydraNet - Prisma Client Singleton
// Prevents multiple PrismaClient instances in development
// ============================================================
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/adapter-pg/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const connectionString = process.env.DATABASE_URL;
const globalForPrisma = globalThis;
function createPrismaClient() {
    const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["Pool"]({
        connectionString
    });
    const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaPg"](pool);
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
        adapter
    });
}
const prisma = globalForPrisma.prisma ?? createPrismaClient();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "checkEmailUniqueness",
    ()=>checkEmailUniqueness,
    "generateRandomPassword",
    ()=>generateRandomPassword,
    "generateTrackingId",
    ()=>generateTrackingId,
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
// ============================================================
// HydraNet - Authentication Utilities
// Password hashing and verification using bcrypt
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const SALT_ROUNDS = 12;
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hashedPassword) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hashedPassword);
}
function generateTrackingId() {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sequence = Date.now().toString().slice(-4);
    return `HN-${year}-${random}${sequence}`;
}
async function checkEmailUniqueness(email, excludeId) {
    try {
        // Check Admin table
        const admin = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.findUnique({
            where: {
                email
            }
        });
        if (admin && admin.id !== excludeId) {
            return {
                isUnique: false,
                foundIn: 'admin'
            };
        }
    } catch (error) {
        console.error('Error checking admin table:', error);
    }
    try {
        // Check UtilityManager table
        const utilityManager = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].utilityManager.findUnique({
            where: {
                email
            }
        });
        if (utilityManager && utilityManager.id !== excludeId) {
            return {
                isUnique: false,
                foundIn: 'utility manager'
            };
        }
    } catch (error) {
        console.error('Error checking utility manager table:', error);
    }
    try {
        // Check DMAManager table
        const dmaManager = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].dMAManager.findUnique({
            where: {
                email
            }
        });
        if (dmaManager && dmaManager.id !== excludeId) {
            return {
                isUnique: false,
                foundIn: 'DMA manager'
            };
        }
    } catch (error) {
        console.error('Error checking DMA manager table:', error);
    }
    try {
        // Check Engineer table
        const engineer = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].engineer.findUnique({
            where: {
                email
            }
        });
        if (engineer && engineer.id !== excludeId) {
            return {
                isUnique: false,
                foundIn: 'engineer'
            };
        }
    } catch (error) {
        console.error('Error checking engineer table:', error);
    }
    return {
        isUnique: true
    };
}
function generateRandomPassword(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for(let i = 0; i < length; i++){
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/users/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
// ============================================================
// HydraNet - Users API Route
// Unified API for all user types: Admin, UtilityManager, DMAManager, Engineer
// Note: Engineers table is used for both 'engineer' and 'team_leader' roles
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const utilityId = searchParams.get('utilityId');
        const dmaId = searchParams.get('dmaId');
        const users = [];
        // Fetch Admins
        if (!role || role === 'admin') {
            const admins = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    status: true,
                    createdAt: true
                },
                orderBy: {
                    name: 'asc'
                }
            });
            users.push(...admins.map((a)=>({
                    id: a.id,
                    email: a.email,
                    name: a.name,
                    role: 'admin',
                    phone: a.phone,
                    status: a.status,
                    utilityId: null,
                    utilityName: null,
                    dmaId: null,
                    dmaName: null,
                    createdAt: a.createdAt.toISOString()
                })));
        }
        // Fetch Utility Managers
        if (!role || role === 'utility_manager') {
            const utilityManagers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].utilityManager.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    status: true,
                    createdAt: true,
                    utility: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });
            users.push(...utilityManagers.map((um)=>({
                    id: um.id,
                    email: um.email,
                    name: um.name,
                    role: 'utility_manager',
                    phone: um.phone,
                    status: um.status,
                    utilityId: um.utility?.id || null,
                    utilityName: um.utility?.name || null,
                    dmaId: null,
                    dmaName: null,
                    createdAt: um.createdAt.toISOString()
                })));
        }
        // Fetch DMA Managers
        if (!role || role === 'dma_manager') {
            const dmaManagers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].dMAManager.findMany({
                where: {
                    ...utilityId ? {
                        utilityId
                    } : {}
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    status: true,
                    createdAt: true,
                    utilityId: true,
                    utility: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    dma: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });
            users.push(...dmaManagers.map((dm)=>({
                    id: dm.id,
                    email: dm.email,
                    name: dm.name,
                    role: 'dma_manager',
                    phone: dm.phone,
                    status: dm.status,
                    utilityId: dm.utilityId,
                    utilityName: dm.utility?.name || null,
                    dmaId: dm.dma?.id || null,
                    dmaName: dm.dma?.name || null,
                    createdAt: dm.createdAt.toISOString()
                })));
        }
        // Fetch Engineers (regular engineers)
        if (!role || role === 'engineer') {
            const engineers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].engineer.findMany({
                where: {
                    role: 'engineer',
                    ...dmaId ? {
                        dmaId
                    } : {}
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    status: true,
                    createdAt: true,
                    dma: {
                        select: {
                            id: true,
                            name: true,
                            utilityId: true,
                            utility: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    branch: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    team: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });
            users.push(...engineers.map((e)=>({
                    id: e.id,
                    email: e.email,
                    name: e.name,
                    role: 'engineer',
                    phone: e.phone,
                    status: e.status,
                    utilityId: e.dma?.utilityId || null,
                    utilityName: e.dma?.utility?.name || null,
                    dmaId: e.dma?.id || null,
                    dmaName: e.dma?.name || null,
                    branchId: e.branch?.id || null,
                    branchName: e.branch?.name || null,
                    teamId: e.team?.id || null,
                    teamName: e.team?.name || null,
                    createdAt: e.createdAt.toISOString()
                })));
        }
        // Fetch Team Leaders (from Engineer table with role='team_leader')
        if (!role || role === 'team_leader') {
            const teamLeaders = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].engineer.findMany({
                where: {
                    role: 'team_leader',
                    ...dmaId ? {
                        dmaId
                    } : {}
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    status: true,
                    createdAt: true,
                    dma: {
                        select: {
                            id: true,
                            name: true,
                            utilityId: true,
                            utility: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    branch: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    teamLeading: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });
            users.push(...teamLeaders.map((tl)=>({
                    id: tl.id,
                    email: tl.email,
                    name: tl.name,
                    role: 'team_leader',
                    phone: tl.phone,
                    status: tl.status,
                    utilityId: tl.dma?.utilityId || null,
                    utilityName: tl.dma?.utility?.name || null,
                    dmaId: tl.dma?.id || null,
                    dmaName: tl.dma?.name || null,
                    branchId: tl.branch?.id || null,
                    branchName: tl.branch?.name || null,
                    teamId: tl.teamLeading?.id || null,
                    teamName: tl.teamLeading?.name || null,
                    createdAt: tl.createdAt.toISOString()
                })));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch users'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const data = await request.json();
        // Validate required fields
        if (!data.name || !data.email || !data.role) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Name, email, and role are required'
            }, {
                status: 400
            });
        }
        // Check for existing email across all user tables
        const existingAdmin = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.findUnique({
            where: {
                email: data.email
            }
        });
        const existingUtilityManager = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].utilityManager.findUnique({
            where: {
                email: data.email
            }
        });
        const existingDmaManager = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].dMAManager.findUnique({
            where: {
                email: data.email
            }
        });
        const existingEngineer = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].engineer.findUnique({
            where: {
                email: data.email
            }
        });
        if (existingAdmin || existingUtilityManager || existingDmaManager || existingEngineer) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User with this email already exists'
            }, {
                status: 400
            });
        }
        // Hash the password
        const hashedPassword = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(data.password || 'password123');
        let user;
        switch(data.role){
            case 'admin':
                {
                    const admin = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.create({
                        data: {
                            name: data.name,
                            email: data.email,
                            password: hashedPassword,
                            phone: data.phone || null,
                            status: data.status || 'active'
                        }
                    });
                    user = {
                        id: admin.id,
                        email: admin.email,
                        name: admin.name,
                        role: 'admin',
                        phone: admin.phone,
                        status: admin.status,
                        utilityId: null,
                        utilityName: null,
                        dmaId: null,
                        dmaName: null,
                        createdAt: admin.createdAt.toISOString()
                    };
                    break;
                }
            case 'utility_manager':
                {
                    const utilityManager = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].utilityManager.create({
                        data: {
                            name: data.name,
                            email: data.email,
                            password: hashedPassword,
                            phone: data.phone || null,
                            status: data.status || 'active',
                            ...data.utilityId && {
                                utilityId: data.utilityId
                            }
                        },
                        include: {
                            utility: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    });
                    user = {
                        id: utilityManager.id,
                        email: utilityManager.email,
                        name: utilityManager.name,
                        role: 'utility_manager',
                        phone: utilityManager.phone,
                        status: utilityManager.status,
                        utilityId: utilityManager.utility?.id || null,
                        utilityName: utilityManager.utility?.name || null,
                        dmaId: null,
                        dmaName: null,
                        createdAt: utilityManager.createdAt.toISOString()
                    };
                    break;
                }
            case 'dma_manager':
                {
                    if (!data.utilityId) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            error: 'utilityId is required for DMA managers'
                        }, {
                            status: 400
                        });
                    }
                    const dmaManager = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].dMAManager.create({
                        data: {
                            name: data.name,
                            email: data.email,
                            password: hashedPassword,
                            phone: data.phone || null,
                            status: data.status || 'active',
                            utilityId: data.utilityId,
                            ...data.dmaId && {
                                dmaId: data.dmaId
                            }
                        },
                        include: {
                            utility: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            dma: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    });
                    user = {
                        id: dmaManager.id,
                        email: dmaManager.email,
                        name: dmaManager.name,
                        role: 'dma_manager',
                        phone: dmaManager.phone,
                        status: dmaManager.status,
                        utilityId: dmaManager.utilityId,
                        utilityName: dmaManager.utility?.name || null,
                        dmaId: dmaManager.dma?.id || null,
                        dmaName: dmaManager.dma?.name || null,
                        createdAt: dmaManager.createdAt.toISOString()
                    };
                    break;
                }
            case 'engineer':
            case 'team_leader':
                {
                    if (!data.dmaId || !data.branchId) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            error: 'dmaId and branchId are required for engineers/team leaders'
                        }, {
                            status: 400
                        });
                    }
                    const engineer = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].engineer.create({
                        data: {
                            name: data.name,
                            email: data.email,
                            password: hashedPassword,
                            phone: data.phone || null,
                            status: data.status || 'active',
                            role: data.role,
                            dmaId: data.dmaId,
                            branchId: data.branchId,
                            ...data.teamId && {
                                teamId: data.teamId
                            }
                        },
                        include: {
                            dma: {
                                select: {
                                    id: true,
                                    name: true,
                                    utilityId: true,
                                    utility: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            },
                            branch: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            team: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    });
                    user = {
                        id: engineer.id,
                        email: engineer.email,
                        name: engineer.name,
                        role: data.role,
                        phone: engineer.phone,
                        status: engineer.status,
                        utilityId: engineer.dma?.utilityId || null,
                        utilityName: engineer.dma?.utility?.name || null,
                        dmaId: engineer.dma?.id || null,
                        dmaName: engineer.dma?.name || null,
                        branchId: engineer.branch?.id || null,
                        branchName: engineer.branch?.name || null,
                        teamId: engineer.team?.id || null,
                        teamName: engineer.team?.name || null,
                        createdAt: engineer.createdAt.toISOString()
                    };
                    break;
                }
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid role'
                }, {
                    status: 400
                });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(user, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create user'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const data = await request.json();
        if (!data.id || !data.role) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User ID and role are required'
            }, {
                status: 400
            });
        }
        const updateData = {
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            status: data.status
        };
        // Only update password if provided
        if (data.password) {
            updateData.password = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(data.password);
        }
        let user;
        switch(data.role){
            case 'admin':
                {
                    const admin = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.update({
                        where: {
                            id: data.id
                        },
                        data: updateData
                    });
                    user = {
                        id: admin.id,
                        email: admin.email,
                        name: admin.name,
                        role: 'admin',
                        phone: admin.phone,
                        status: admin.status,
                        utilityId: null,
                        utilityName: null,
                        dmaId: null,
                        dmaName: null,
                        createdAt: admin.createdAt.toISOString()
                    };
                    break;
                }
            case 'utility_manager':
                {
                    // The utility relation is managed via utilityId on UtilityManager
                    // No need to update Utility table - just update the utilityManager's utilityId
                    const utilityManager = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].utilityManager.update({
                        where: {
                            id: data.id
                        },
                        data: {
                            ...updateData,
                            ...data.utilityId !== undefined && {
                                utilityId: data.utilityId || null
                            }
                        },
                        include: {
                            utility: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    });
                    user = {
                        id: utilityManager.id,
                        email: utilityManager.email,
                        name: utilityManager.name,
                        role: 'utility_manager',
                        phone: utilityManager.phone,
                        status: utilityManager.status,
                        utilityId: utilityManager.utility?.id || null,
                        utilityName: utilityManager.utility?.name || null,
                        dmaId: null,
                        dmaName: null,
                        createdAt: utilityManager.createdAt.toISOString()
                    };
                    break;
                }
            case 'dma_manager':
                {
                    const dmaManager = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].dMAManager.update({
                        where: {
                            id: data.id
                        },
                        data: {
                            ...updateData,
                            ...data.dmaId !== undefined && {
                                dmaId: data.dmaId || null
                            }
                        },
                        include: {
                            utility: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            dma: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    });
                    user = {
                        id: dmaManager.id,
                        email: dmaManager.email,
                        name: dmaManager.name,
                        role: 'dma_manager',
                        phone: dmaManager.phone,
                        status: dmaManager.status,
                        utilityId: dmaManager.utilityId,
                        utilityName: dmaManager.utility?.name || null,
                        dmaId: dmaManager.dma?.id || null,
                        dmaName: dmaManager.dma?.name || null,
                        createdAt: dmaManager.createdAt.toISOString()
                    };
                    break;
                }
            case 'engineer':
            case 'team_leader':
                {
                    const engineer = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].engineer.update({
                        where: {
                            id: data.id
                        },
                        data: {
                            ...updateData,
                            role: data.role,
                            ...data.teamId !== undefined && {
                                teamId: data.teamId || null
                            }
                        },
                        include: {
                            dma: {
                                select: {
                                    id: true,
                                    name: true,
                                    utilityId: true,
                                    utility: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            },
                            branch: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            team: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    });
                    user = {
                        id: engineer.id,
                        email: engineer.email,
                        name: engineer.name,
                        role: engineer.role,
                        phone: engineer.phone,
                        status: engineer.status,
                        utilityId: engineer.dma?.utilityId || null,
                        utilityName: engineer.dma?.utility?.name || null,
                        dmaId: engineer.dma?.id || null,
                        dmaName: engineer.dma?.name || null,
                        branchId: engineer.branch?.id || null,
                        branchName: engineer.branch?.name || null,
                        teamId: engineer.team?.id || null,
                        teamName: engineer.team?.name || null,
                        createdAt: engineer.createdAt.toISOString()
                    };
                    break;
                }
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid role'
                }, {
                    status: 400
                });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update user'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const role = searchParams.get('role');
        if (!id || !role) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User ID and role are required'
            }, {
                status: 400
            });
        }
        switch(role){
            case 'admin':
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.delete({
                    where: {
                        id
                    }
                });
                break;
            case 'utility_manager':
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].utilityManager.delete({
                    where: {
                        id
                    }
                });
                break;
            case 'dma_manager':
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].dMAManager.delete({
                    where: {
                        id
                    }
                });
                break;
            case 'engineer':
            case 'team_leader':
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].engineer.delete({
                    where: {
                        id
                    }
                });
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid role'
                }, {
                    status: 400
                });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete user'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__86e76c77._.js.map