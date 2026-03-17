# Mobile Apps Synchronization Guide

## Overview

Both mobile apps (`src/` and `user/HydraNet/HydraNet-app/src/`) have been completely restructured to align with the Next.js frontend architecture. This guide explains the new structure and how to use it.

## New Project Structure

```
src/
├── lib/                          # Frontend-aligned utilities
│   ├── api-client.ts             # Centralized HTTP client
│   ├── config.ts                 # Configuration & endpoints
│   ├── types.ts                  # TypeScript type definitions
│   ├── auth.ts                   # Authentication manager
│   └── utils.ts                  # Helper functions
├── services/
│   └── api/                      # API service classes
│       ├── auth.ts               # AuthService
│       ├── tasks.ts              # TaskService
│       ├── utilities.ts          # UtilityService, DMAService, etc.
│       └── index.ts              # Unified exports
├── hooks/                        # Custom React Native hooks
│   ├── useAuth.ts                # Authentication state
│   ├── useApi.ts                 # Generic API request handler
│   ├── useQuery.ts               # Data fetching with caching
│   └── index.ts                  # Unified exports
├── components/
│   ├── shared/                   # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   ├── layout/                   # Layout components
│   └── dashboard/                # Dashboard-specific
├── screens/                      # Screen components
│   ├── LoginScreenNew.tsx        # Example: Auth flow
│   ├── UtilitiesScreenNew.tsx    # Example: List with useQuery
│   ├── TasksScreenNew.tsx        # Example: API with useApi
│   └── [other screens]
├── store/                        # State management (zustand, redux, etc.)
├── theme/                        # Styling & animations
├── constants/                    # App constants
├── data/                         # Mock data
├── navigation/                   # Navigation config
└── utils/                        # Additional utilities
```

## Key Changes

### 1. Centralized API Client (`lib/api-client.ts`)

**Before**: Multiple scattered service files with inconsistent patterns
**After**: Single `ApiClient` class handling all HTTP requests

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const response = await apiClient.get('/utilities');

// POST request with auth header
const response = await apiClient.post('/tasks', { data });

// Automatic token management & 401 handling
```

### 2. Service Layer (`services/api/`)

Clean, organized API service classes for each resource:

```typescript
// AuthService - Login, logout, profile
await AuthService.login({ email, password });
await AuthService.logout();
await AuthService.getProfile();

// TaskService - CRUD operations
await TaskService.getTasks();
await TaskService.createTask(data);
await TaskService.updateTask(id, data);
await TaskService.assignTask(taskId, engineerId);

// UtilityService, DMAService, etc.
await UtilityService.getUtilities();
await DMAService.getDMAsByUtility(utilityId);
await UtilityManagerService.createManager(data);
```

### 3. Custom Hooks

#### `useAuth` - Authentication State
```typescript
const { currentUser, isAuthenticated, isLoading, error, login, logout } = useAuth();

// Login
const result = await login({ email, password });
if (result.success) {
  // Navigate to dashboard
}
```

#### `useQuery` - Data Fetching with Auto-Refresh
```typescript
const { data, isLoading, error, refetch } = useQuery(
  ['utilities'],
  () => UtilityService.getUtilities(),
  {
    refetchInterval: 30000,  // Auto-refresh every 30s
    enabled: true,
  }
);
```

#### `useApi` - Generic API Request Handler
```typescript
const { data, isLoading, error, execute } = useApi<Report[]>();

// Make request
await execute(() => TaskService.getTasks());

// Manual refetch
await execute(() => TaskService.getTasks());
```

### 4. Shared Components

Reusable UI components with consistent styling:

```typescript
import { Button, Card, Badge } from '@/components/shared';

<Card variant="elevated">
  <Button label="Submit" onPress={handleSubmit} loading={isLoading} />
  <Badge label="Active" variant="success" />
</Card>
```

### 5. Type Definitions (`lib/types.ts`)

All TypeScript interfaces are now centralized and match the backend:

```typescript
import { User, Report, Utility, DMA, UtilityManager, DMAManager } from '@/lib/types';
```

## Migration Guide: Converting Old Screens

### Before (Old Pattern)
```typescript
import { useEffect, useState } from 'react';
import taskStore from '@/store/taskStore';

export function OldTasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskStore.fetchTasks().then(setTasks).finally(() => setLoading(false));
  }, []);

  return <FlatList data={tasks} renderItem={...} />;
}
```

### After (New Pattern)
```typescript
import { useQuery } from '@/hooks';
import { TaskService } from '@/services/api';

export function NewTasksScreen() {
  const { data: tasks, isLoading, refetch } = useQuery(
    ['tasks'],
    () => TaskService.getTasks(),
    { refetchInterval: 30000 }
  );

  return (
    <FlatList
      data={tasks}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      renderItem={...}
    />
  );
}
```

## Configuration

### Environment Variables

Set API URL in `.env.local`:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

### Config File (`lib/config.ts`)

All endpoints and configuration in one place:

```typescript
import CONFIG from '@/lib/config';

CONFIG.API_BASE_URL           // http://localhost:8000/api
CONFIG.ENDPOINTS.AUTH.LOGIN   // /auth/login
CONFIG.ENDPOINTS.TASKS.LIST   // /tasks
CONFIG.FEATURES.OFFLINE_MODE  // true
```

## Authentication Flow

### Step 1: Login Screen
```typescript
const { login, isLoading, error } = useAuth();

const handleLogin = async () => {
  const result = await login({ email, password });
  if (result.success) {
    navigation.navigate('Dashboard');
  }
};
```

### Step 2: Protected Routes
```typescript
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) return <LoadingScreen />;
if (!isAuthenticated) return <LoginScreen />;
return <DashboardScreen />;
```

### Step 3: Auto Token Refresh
```typescript
// authManager handles token refresh automatically
// When token expires, 401 is caught and token is refreshed
// If refresh fails, user is redirected to login
```

## Utility Functions

Common helpers in `lib/utils.ts`:

```typescript
import { 
  formatDate, 
  formatDateTime, 
  getStatusColor, 
  getPriorityColor,
  isValidEmail,
  calculateDistance,
  generateTrackingId
} from '@/lib/utils';

const statusColor = getStatusColor('active');      // #10b981
const date = formatDate('2026-03-13T10:00:00Z');   // Mar 13, 2026
const distance = calculateDistance(lat1, lon1, lat2, lon2); // km
```

## Example Screens

Three example screens show the new patterns:

1. **LoginScreenNew.tsx** - Authentication flow with `useAuth` hook
2. **UtilitiesScreenNew.tsx** - Data fetching with `useQuery` hook
3. **TasksScreenNew.tsx** - API requests with `useApi` hook

Copy these patterns to your existing screens.

## Step-by-Step Integration

### 1. Update Your Existing Screens

For each screen using API calls:

```typescript
// Replace old service imports
- import { oldService } from '@/services/oldService';

// With new API services
+ import { TaskService, UtilityService } from '@/services/api';
+ import { useQuery, useApi } from '@/hooks';
```

### 2. Use the New Hooks

Replace `useState` + `useEffect` with hooks:

```typescript
// Old way
const [data, setData] = useState(null);
useEffect(() => {
  api.fetch().then(setData);
}, []);

// New way
const { data } = useQuery(['key'], () => api.fetch());
```

### 3. Use Shared Components

Replace custom UI components:

```typescript
- import CustomButton from '@/components/CustomButton';
+ import { Button } from '@/components/shared';

- <CustomButton label="Submit" />
+ <Button label="Submit" onPress={handleSubmit} />
```

### 4. Update Navigation

Use authenticated user from `useAuth`:

```typescript
const { isAuthenticated, currentUser } = useAuth();

const navigationRef = React.useRef();

<NavigationContainer ref={navigationRef}>
  {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
</NavigationContainer>
```

## Best Practices

### 1. Use `useQuery` for READ operations
```typescript
const { data: utilities } = useQuery(
  ['utilities'],
  () => UtilityService.getUtilities(),
  { refetchInterval: 60000 }
);
```

### 2. Use `useApi` for WRITE operations
```typescript
const { execute: createTask, isLoading } = useApi();

const handleCreate = async (data) => {
  await execute(() => TaskService.createTask(data));
};
```

### 3. Always handle errors
```typescript
const { data, error, isLoading } = useQuery(['key'], apiCall);

if (error) {
  return <ErrorBoundary error={error} />;
}
```

### 4. Use `refetch` for manual updates
```typescript
const { data, refetch } = useQuery(['tasks'], () => TaskService.getTasks());

const handleCreateTask = async (task) => {
  await TaskService.createTask(task);
  await refetch();  // Refresh list after creating
};
```

### 5. Leverage retry & refetch intervals
```typescript
useQuery(
  ['tasks'],
  () => TaskService.getTasks(),
  {
    refetchInterval: 30000,  // Auto-refresh every 30s
    retryCount: 3,           // Retry failed requests 3 times
    enabled: isVisibleScreen, // Only fetch when screen is visible
  }
);
```

## Troubleshooting

### Token Not Persisting
Check `AsyncStorage` is properly initialized:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### API Calls Not Working
Verify `EXPO_PUBLIC_API_URL` environment variable:
```bash
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

### Type Errors
Import types from `@/lib/types`:
```typescript
import { User, Report, Task } from '@/lib/types';
```

### 401 Errors
Token refresh is automatic. If still failing:
1. Check token expiry in `authManager`
2. Verify refresh token is stored
3. Check backend refresh endpoint

## File Organization Summary

| File | Purpose |
|------|---------|
| `lib/api-client.ts` | HTTP client with auth & error handling |
| `lib/config.ts` | Endpoints & configuration |
| `lib/types.ts` | All TypeScript interfaces |
| `lib/auth.ts` | Token management & auth logic |
| `lib/utils.ts` | Helper functions |
| `services/api/*.ts` | Resource-specific API calls |
| `hooks/*.ts` | Custom React hooks |
| `components/shared/*.ts` | Reusable UI components |

---

Both mobile apps (`src/` and `user/HydraNet/HydraNet-app/src/`) now have **identical structures** and are ready for modern React Native development! 🚀
