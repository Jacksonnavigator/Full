# HydraNet User App - Backend Integration Complete ✅

## Overview

The HydraNet user app (lightweight water problem reporting system) has been successfully integrated with the main backend API. Both apps now communicate with the same FastAPI backend at `http://localhost:8000`.

---

## What Was Integrated

### Backend Services Created

| Service | Purpose | Location |
|---------|---------|----------|
| **backendConfig.ts** | Centralized configuration | `HydraNet/src/services/` |
| **apiClient.ts** | HTTP client with JWT auth, token management, auto-refresh | `HydraNet/src/services/` |
| **reportService.ts** | Report submission and retrieval | `HydraNet/src/services/` |
| **authService.ts** | Optional authentication for logged-in users | `HydraNet/src/services/` |

### Updated Services

| Service | Changes |
|---------|---------|
| **ApiService.ts** | Now wraps backend services; backward compatible with existing code |
| **HistoryScreen.tsx** | Already using ApiService (automatically updated) |
| **ReportScreen.tsx** | Already using ApiService (automatically updated) |

---

## Key Features

### ✅ Anonymous Report Submission
- Users can submit reports **without logging in**
- Reports are created via: `POST /api/reports`
- No authentication required (backend accepts unauthenticated requests)
- Data: description, GPS location, priority, media

### ✅ Optional User Authentication
- Users can optionally log in for personalized experience
- `loginUser(email, password)` stores tokens in AsyncStorage
- Tokens auto-refresh on expiry
- User info cached locally for faster access

### ✅ Report History
- Fetch all reports (or filtered by user if logged in)
- Support for refresh/pull-to-refresh
- Real-time status display

### ✅ Token Management
- Access tokens auto-saved to AsyncStorage
- Refresh tokens stored securely
- Auto-refresh on 401 errors
- Clean logout clears tokens

---

## Configuration

### Backend URL

Edit this file if backend is on different host/port:
```typescript
// HydraNet/src/services/backendConfig.ts
export const BACKEND_CONFIG = {
  baseUrl: 'http://localhost:8000',  // ← Change here for different server
  endpoints: {
    // ... endpoints
  }
};
```

### Token Storage Keys
```
hydranet_access_token   - JWT access token
hydranet_refresh_token  - JWT refresh token
hydranet_user          - Cached user info
hydranet_tutorial_seen - Tutorial flag
```

---

## API Endpoints Used

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|----------------|
| `/api/auth/login` | POST | User login | No |
| `/api/auth/register` | POST | User registration | No |
| `/api/auth/refresh` | POST | Token refresh | No |
| `/api/users/me` | GET | Get current user | Yes |
| `/api/reports` | POST | Submit report | No (anonymous supported) |
| `/api/reports` | GET | Get reports | No (with filters) |

---

## Usage Examples

### Submit Anonymous Report
```typescript
import { submitWaterProblem } from './services/ApiService';

const result = await submitWaterProblem({
  description: "Water leak near downtown",
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  image: {
    uri: 'file:///path/to/photo.jpg',
    width: 1200,
    height: 800,
    type: 'image/jpeg',
    fileName: 'photo.jpg',
    mediaType: 'photo',
  },
  priority: 'urgent',
  timestamp: new Date(),
});
```

### Optional: User Login
```typescript
import { loginUser } from './services/authService';

const user = await loginUser('user@example.com', 'password123');
// Now all subsequent requests include Bearer token
```

### Fetch Report History
```typescript
import { getReportHistory } from './services/ApiService';

const reports = await getReportHistory();
// Returns array of submitted reports
```

---

## Two Apps, One Backend

| Aspect | Main App | User App |
|--------|----------|----------|
| **Location** | `c:\Hydratech\src\` | `c:\Hydratech\user\HydraNet\HydraNet-app\HydraNet\` |
| **Backend** | FastAPI @ localhost:8000 | FastAPI @ localhost:8000 |
| **Authentication** | Required (JWT + role-based) | Optional (anonymous OR logged-in) |
| **Key Screens** | 12+ (reports, audit, approvals, etc.) | 7 (simplified report submission) |
| **State Management** | Zustand | React Context |
| **Use Case** | Enterprise water utility (team leaders, managers, engineers) | General public water issue reporting |

---

## Deployment Considerations

### For Mobile/Real Devices
```typescript
// Current config uses localhost - won't work on real devices!
// Before deploying, update:
baseUrl: 'https://your-actual-server.com'  // Use HTTPS in production
```

### Environment Variables Recommended
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

---

## Testing Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Submit anonymous report → check backend database
- [ ] Fetch report history → verify pulling from backend
- [ ] Upload photo with report → verify image handling
- [ ] Optional: Login → verify token storage
- [ ] Optional: Logged-in reports have user_id attached
- [ ] Offline submission → queue locally until connection restored
- [ ] Network error handling → graceful error messages

---

## Next Steps

1. **Test the integration**
   - Start backend server
   - Run user app with `expo start`
   - Submit test report
   - Check backend database for new record

2. **Optional: Add login screen**
   - Create LoginScreen.tsx in user app
   - Call `loginUser(email, password)`
   - Store user context
   - Attach user_id to reports

3. **Optional: Image upload to server**
   - Upload photo to backend `/api/uploads`
   - Get back image URL
   - Store URL in report

4. **Offline queue**
   - Already supported by existing code
   - Reports queue locally when offline
   - Auto-sync when connection restored

---

## Troubleshooting

**Reports not submitting?**
- Check backend is running on port 8000
- Verify `backendConfig.ts` has correct URL
- Check terminal for network errors (CORS, connection refused, etc.)

**Tokens not persisting?**
- Verify AsyncStorage is properly installed
- Check Android/iOS permissions for app storage
- May need to clear app cache and restart

**Getting 401 errors?**
- Token may have expired
- `apiClient.ts` should auto-refresh
- If not, clear AsyncStorage and re-login

---

## File Structure

```
user/
  └── HydraNet/
      └── HydraNet-app/
          └── HydraNet/
              ├── src/
              │   ├── services/
              │   │   ├── backendConfig.ts      ← NEW: Backend config
              │   │   ├── apiClient.ts          ← NEW: HTTP wrapper
              │   │   ├── reportService.ts      ← NEW: Report API
              │   │   ├── authService.ts        ← NEW: Auth API
              │   │   ├── ApiService.ts         ← UPDATED: Wrapper
              │   │   ├── ImageService.ts       ← Photo compression
              │   │   └── LocationService.ts    ← GPS handling
              │   ├── screens/
              │   │   ├── HomeScreen.tsx
              │   │   ├── ReportScreen.tsx
              │   │   ├── HistoryScreen.tsx
              │   │   ├── EmergencyContactScreen.tsx
              │   │   ├── TermsScreen.tsx
              │   │   └── SplashScreen.tsx
              │   ├── components/
              │   ├── context/
              │   ├── types/
              │   └── utils/
              └── package.json
```

---

## Status: ✅ READY FOR TESTING

Both the main HydraNet app and the lightweight user app are now fully integrated with the FastAPI backend. Reports flow into the same backend database, enabling:

- ✅ Engineers submit repairs via main app
- ✅ Public submits reports via user app
- ✅ All data centralized in backend PostgreSQL
- ✅ Single source of truth for reports
- ✅ Unified audit trail and logging

**Next Action**: Start the backend and test!
