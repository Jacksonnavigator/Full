# Firebase → Backend Migration - Implementation Guide

## ✅ Phase 1: COMPLETED - Core Infrastructure

### New Services Created

#### 1. **apiClient.ts** - HTTP Communication Layer
Main wrapper for all backend API calls. Handles:
- Authorization headers (JWT tokens)
- Token refresh logic
- Error handling
- Request retry

**Location:** `src/services/apiClient.ts`

#### 2. **backendConfig.ts** - Configuration
Centralized backend URL and endpoint configuration. 
- Change backend API URL here: `BACKEND_CONFIG.baseUrl`
- Default: `http://localhost:8000`

**Location:** `src/services/backendConfig.ts`

#### 3. **authService.ts** - Authentication (MIGRATED)
✅ Now uses backend API instead of Firebase
- `loginUser()` → POST `/api/auth/login`
- `registerUser()` → POST `/api/users`
- `getCurrentUser()` → GET `/api/users/me`
- `logoutUser()` → Clears stored tokens

**Location:** `src/services/authService.ts`

---

## 🆕 Phase 2: NEW SERVICES - Ready to Use

### 4. **reportService_v2.ts** - Report Management
Complete replacement for Firebase-based report service.

**Key Functions:**
```typescript
// Submit new report
await submitLeakageReport(
  description: string,
  location: { latitude, longitude },
  priority: string,
  type: string,
  imageUrls: string[]
);

// Get reports with filtering
const reports = await getReports({
  status: 'New',
  priority: 'High',
  utility_id: 'utility-123',
  limit: 20
});

// Get single report
const report = await getReportById(reportId);

// Update report status
await updateReportStatus(reportId, 'InProgress', 'Started work');

// Submit repair work
await submitRepairWork(reportId, {
  engineer_id: 'engineer-123',
  description: 'Fixed the leak',
  materials_used: ['pipe', 'sealant'],
  before_photos: [...],
  after_photos: [...]
});

// Approve/reject submission
await approveSubmission(reportId, submissionId, 'Looks good');
await rejectSubmission(reportId, submissionId, 'Need more photos');

// Close report
await closeReport(reportId, 'Resolved');
```

**Location:** `src/services/reportService_v2.ts`

### 5. **notificationService_v2.ts** - Notifications
Get and manage notifications from backend.

**Key Functions:**
```typescript
// Get notifications
const notifications = await getNotifications({ read: false });

// Get unread count
const count = await getUnreadCount();

// Mark as read
await markAsRead(notificationId);

// Mark all as read
await markAllAsRead();

// Poll for new notifications (use in effect)
const notifications = await pollNotifications(
  (newNots) => console.log('New notifications:', newNots)
);
```

**Location:** `src/services/notificationService_v2.ts`

### 6. **auditService_v2.ts** - Activity Logging
Log user actions and system events.

**Key Functions:**
```typescript
// Create audit log
await createAuditLog({
  action: 'REPORT_CREATED',
  userId: 'user-123',
  resourceType: 'Report',
  resourceId: 'report-456'
});

// Get audit logs with filters
const logs = await getAuditLogs({
  action: 'REPORT_STATUS_CHANGED',
  user_id: 'user-123'
});

// Helper functions
await logReportCreated(reportId, userId);
await logReportStatusChange(reportId, userId, 'New', 'InProgress');
await logSubmissionApproved(submissionId, userId);
await logUserApproved(userId, approverUserId);
```

**Location:** `src/services/auditService_v2.ts`

### 7. **resourceService.ts** - Generic Resource Management
CRUD operations for all system resources.

**Key Functions:**
```typescript
// UTILITIES
const utilities = await getUtilities();
const utility = await getUtility(utilityId);
await createUtility({ name, code, country });
await updateUtility(utilityId, { name, state });
await deleteUtility(utilityId);

// DMAs
const dmas = await getDMAs({ utility_id: utilityId });
const dma = await getDMA(dmaId);
await createDMA({ utility_id, name, code });
await updateDMA(dmaId, { name });

// BRANCHES
const branches = await getBranches({ dma_id: dmaId });
const branch = await getBranch(branchId);
await createBranch({ utility_id, dma_id, name });

// TEAMS
const teams = await getTeams({ dma_id: dmaId });
const team = await getTeam(teamId);
await createTeam({ utility_id, dma_id, branch_id, name });

// ENGINEERS
const engineers = await getEngineers({ team_id: teamId });
const engineer = await getEngineer(engineerId);
await createEngineer({ user_id, name, email, team_id, utility_id });

// USERS
const users = await getUsers({ role: 'Engineer' });
const user = await getUser(userId);
await updateUser(userId, { is_approved: true });
```

**Location:** `src/services/resourceService.ts`

---

## 📱 Phase 3: SCREEN MIGRATION - Example Updates

### How to Update Screens from Firebase to Backend

#### BEFORE (Firebase):
```typescript
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './services/firebase';

export const TaskListScreen = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'reports'), where('status', '==', 'New'));
    getDocs(q).then(snapshot => {
      setReports(snapshot.docs.map(doc => doc.data()));
    });
  }, []);

  return <FlatList data={reports} />;
};
```

#### AFTER (Backend API):
```typescript
import { getReports } from './services/reportService_v2';

export const TaskListScreen = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports({ status: 'New' }).then(setReports);
  }, []);

  return <FlatList data={reports} />;
};
```

---

## 🔄 Migration Checklist

### For Each Screen:

- [ ] Remove Firebase imports (`firebase/firestore`, `firebase/auth`, etc.)
- [ ] Replace with new service imports (`reportService_v2`, `authService`, etc.)
- [ ] Update collection reads to API calls
  - `getDocs(query(...))` → `getReports(filters)`
  - `getDoc(doc(...))` → `getReport(id)`
  - `addDoc(collection(...))` → `submitLeakageReport()`
  - `updateDoc(doc(...))` → `updateReportStatus()`
- [ ] Update listener setup (if needed)
  - Firebase: `onSnapshot()` → Backend: polling with `setInterval()`
  - Or use `pollNotifications()` helper

### Example Screen Updates:

**TaskListScreen.tsx:**
- [x] Remove Firebase imports
- [x] Replace with `reportService_v2`
- [x] Update report fetching
- [ ] Add error handling
- [ ] Add loading state

**NotificationInboxScreen.tsx:**
- [ ] Remove Firebase listeners
- [ ] Replace with `notificationService_v2`
- [ ] Implement polling instead of real-time

**SubmitRepairScreen.tsx:**
- [ ] Replace Firebase report submission with backend API
- [ ] Update image upload (TBD - need file upload endpoint)
- [ ] Add progress tracking

---

## 🔀 Token & Authentication Flow

### Login Flow:
```typescript
import { loginUser } from './services/authService';

const user = await loginUser(email, password);
// Returns: User object
// Side effects: Tokens saved to AsyncStorage, user saved to local storage
```

### Use Tokens in Requests:
All backend API calls automatically include JWT token from AsyncStorage:
```typescript
// This automatically adds: 
// Authorization: Bearer <token_from_AsyncStorage>
const reports = await getReports();
```

### Token Refresh:
Automatically happens when:
- 401 (Unauthorized) response received
- Automatically fetches new access_token using refresh_token
- Retries original request with new token

### Logout:
```typescript
import { logoutUser } from './services/authService';

await logoutUser();
// Side effects: Tokens cleared, user cleared from storage
```

---

## ⚙️ Configuration

### Backend URL - Change This for Different Environments:

**File:** `src/services/backendConfig.ts`

```typescript
export const BACKEND_CONFIG = {
  baseUrl: 'http://localhost:8000', // ← CHANGE THIS
  
  // Development
  // baseUrl: 'http://localhost:8000',
  
  // Staging
  // baseUrl: 'http://staging-api.hydranet.com:8000',
  
  // Production
  // baseUrl: 'http://api.hydranet.com',
};
```

---

## 📊 Data Field Mapping

### Backend Uses Snake_case:
```
frontend/firestore → backend
firstName           → first_name
lastName            → last_name
utilityId           → utility_id
dmaId               → dma_id
teamId              → team_id
isApproved          → is_approved
createdAt           → created_at
```

✅ **Good News:** `authService.ts` automatically converts these mappings for you!

---

## 🧪 Testing the Migration

### Test Authentication:
```bash
# 1. Start backend server
cd WEB-BASED/Backend
python main.py

# 2. Run mobile app
npm start

# 3. Try login with test credentials
Email: admin@hydranet.com
Password: password123 (check backend .env for real password)
```

### Verify Backend Connection:
```typescript
import { apiGet } from './services/apiClient';

// Add this to test any screen
useEffect(() => {
  apiGet('/api/health')
    .then(response => console.log('✅ Backend connected:', response))
    .catch(error => console.error('❌ Connection failed:', error));
}, []);
```

---

## 🚨 Common Issues & Fixes

### Issue: "No authentication token available"
**Cause:** User not logged in or token expired
**Fix:** Make sure `loginUser()` was called and returned successfully

### Issue: "Network error: Connection refused"
**Cause:** Backend server not running or wrong URL
**Fix:** 
1. Check backend running: `http://localhost:8000/docs`
2. Verify URL in `backendConfig.ts`
3. Make sure app and backend on same network (for real devices)

### Issue: CORS errors in browser console (web)
**Cause:** Browser testing with different ports
**Fix:** This only affects web browser, not React Native. For web, use web-based frontend.

### Issue: "User not approved"
**Cause:** Admin hasn't approved user yet
**Fix:** In backend database, set `is_approved = true` for user

---

## 📝 Next Steps

1. ✅ **Done:** Core services created
2. 📱 **In Progress:** Update screens to use new services
3. 🧪 **Todo:** Test complete auth flow
4. 📸 **Todo:** Implement image upload (backend endpoint needed)
5. 📡 **Todo:** Implement real-time updates (WebSocket or polling)
6. 🗑️ **Todo:** Remove Firebase code completely

---

## 📚 Service Import Examples

### Before (Firebase):
```typescript
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './services/firebase';
```

### After (Backend):
```typescript
// Pick what you need:
import { loginUser, getCurrentUser } from './services/authService';
import { getReports, submitLeakageReport } from './services/reportService_v2';
import { getNotifications, markAsRead } from './services/notificationService_v2';
import { createAuditLog } from './services/auditService_v2';
import { 
  getUtilities, getDMAs, getTeams, getEngineers 
} from './services/resourceService';
```

---

## 🎯 Success Criteria

✅ All screens able to login via backend  
✅ Reports can be fetched from backend database  
✅ New reports create entries in backend database  
✅ Status updates sync to backend  
✅ Notifications fetch from backend  
✅ Audit logs record user actions  
✅ No Firebase code remains in app  

**Estimated completion: 1-2 days of development**
