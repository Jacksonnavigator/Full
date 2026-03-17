# Cleanup: Unused Files & Code

This document lists files and code that are no longer needed after Firebase integration.

## ✅ Firebase Seeding Complete

Test data is now in Firestore:
- **Collection**: `reports`
- **Documents**: TASK-001, TASK-002, TASK-003
- **Task**: Run `node scripts/seedFirestoreData.js` anytime to reset test data

## Unintegrated Screens (Safe to Delete or Postpone)

These screen files exist but are **NOT connected** to the app's navigation or Firebase:

### 1. `src/screens/LeaderPerformanceScreen.tsx` ⚠️
- **Status**: Unimplemented
- **Purpose**: Analytics dashboard for team leaders
- **Action**: Not in AppNavigator.tsx - DELETE or keep for future implementation
- **Command**: 
  ```bash
  rm src/screens/LeaderPerformanceScreen.tsx
  ```

### 2. `src/screens/LeaderResolveScreen.tsx` ⚠️
- **Status**: Unimplemented
- **Purpose**: Leaders resolving/approving repairs
- **Action**: DELETE - Only TaskDetailScreen is used for this
- **Command**: 
  ```bash
  rm src/screens/LeaderResolveScreen.tsx
  ```

### 3. `src/screens/LeaderReviewScreen.tsx` ⚠️
- **Status**: Unimplemented
- **Purpose**: Review completed repairs
- **Action**: DELETE - Not needed yet
- **Command**: 
  ```bash
  rm src/screens/LeaderReviewScreen.tsx
  ```

### 4. `src/screens/LeaderTeamTasksScreen.tsx` ⚠️
- **Status**: Unimplemented
- **Purpose**: Team tasks/activity view
- **Action**: DELETE - TaskListScreen handles this
- **Command**: 
  ```bash
  rm src/screens/LeaderTeamTasksScreen.tsx
  ```

### 5. `src/screens/EngineerActivityScreen.tsx` ⚠️
- **Status**: Unimplemented
- **Purpose**: Engineer's activity history
- **Action**: DELETE - Not in navigation
- **Command**: 
  ```bash
  rm src/screens/EngineerActivityScreen.tsx
  ```

## Optional: Keep or Remove?

### `src/data/mockTasks.ts` 🤔
- **Current Use**: Local fallback in Zustand store if Firestore is empty
- **Firebase Data**: Now seeded into Firestore (preferred)
- **Recommendation**: 
  - ✅ KEEP for now - Local fallback for offline mode
  - 🔄 LATER: Remove after Firestore sync is fully tested
  - 📌 Alternative: Convert to seed script only (no local usage)

## Cleanup Script

### Delete All Unintegrated Screens (One Command)

```bash
rm src/screens/LeaderPerformanceScreen.tsx \
   src/screens/LeaderResolveScreen.tsx \
   src/screens/LeaderReviewScreen.tsx \
   src/screens/LeaderTeamTasksScreen.tsx \
   src/screens/EngineerActivityScreen.tsx
```

### Or Keep Them Archived

Instead of deleting, move to a separate folder:

```bash
mkdir -p archived_screens
mv src/screens/LeaderPerformanceScreen.tsx archived_screens/
mv src/screens/LeaderResolveScreen.tsx archived_screens/
# ... etc
```

## Files to Keep

✅ **Core Screens** (In Use)
- `src/screens/LoginScreen.tsx` - Authentication
- `src/screens/TaskListScreen.tsx` - Task list with Firestore
- `src/screens/TaskDetailScreen.tsx` - Task details
- `src/screens/SubmitRepairScreen.tsx` - Image upload
- `src/screens/ProfileScreen.tsx` - User profile & logout

✅ **Core Services** (Firebase Integrated)
- `src/services/firebase.ts` - Firebase config
- `src/services/authService.ts` - Login/logout
- `src/services/reportService.ts` - Firestore reports
- `src/services/imageService.ts` - Cloud Storage uploads
- `src/services/geospatialService.ts` - Location & routing
- All other services in `src/services/`

✅ **Setup Scripts** (Production Useful)
- `scripts/setupTestUsers.js` - Create test users
- `scripts/seedFirestoreData.js` - Seed test data

## Updated Navigation

Current `AppNavigator.tsx` includes:
```typescript
- Login (EntryPoint)
- MainTabs
  ├── Tasks (TaskListScreen)
  ├── Activity (empty/dashboard)
  └── Profile (ProfileScreen)
- TaskDetail (TaskDetailScreen)
- SubmitRepair (SubmitRepairScreen)
```

Removed/Unused:
```
- LeaderPerformanceScreen ❌
- LeaderResolveScreen ❌
- LeaderReviewScreen ❌
- LeaderTeamTasksScreen ❌
- EngineerActivityScreen ❌
```

## Next Steps

### Option A: Clean Up Now
1. Delete unintegrated screens
2. Keep `mockTasks.ts` as local fallback
3. Push clean codebase to git

### Option B: Archive for Later
1. Move screens to `archived_screens/` folder
2. Reference them if needed later
3. Cleaner than deletion, reversible

### Option C: Implement Them
1. Connect screens to Firestore
2. Implement role-based views
3. Add to AppNavigator when ready

## Current Status

✅ **Production Ready**
- Firebase authentication
- Firestore reports fetching
- Image uploads to Cloud Storage
- Firestore security rules deployed
- Test data seeded

⏳ **Future Enhancements**
- Team leader analytics/performance screens
- Engineer activity dashboard
- Offline sync queue
- Advanced permissions UI

---

**Last Updated**: Feb 21, 2026
**Action Taken**: Firebase seeding complete, unintegrated screens identified
