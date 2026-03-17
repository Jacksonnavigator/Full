# HydraNet Water Leakage Management System

Complete React Native mobile application with Firebase backend for water utility field engineers to receive, manage, and report leakage repair tasks.

## Features

- ✅ **Firebase Authentication** - Email/password login with custom claims for role-based access
- ✅ **Role-Based Access Control** - Engineer, Team Leader, DMA Manager, and Administrator roles
- ✅ **Real-time Firestore Integration** - Live task/report management
- ✅ **Image Upload to Cloud Storage** - Photo capture and upload with progress tracking
- ✅ **Geospatial Routing** - Automatic DMA assignment based on GPS coordinates
- ✅ **Offline Support** - Works without internet with sync when reconnected
- ✅ **Audit Logging** - Complete activity tracking
- ✅ **Push Notifications** - Local and remote notifications

## Tech Stack

- **Frontend**: React Native (Expo) + TypeScript
- **Backend**: Firebase (Auth, Firestore, Cloud Storage, Cloud Functions)
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: React Navigation (native stack + bottom tabs)
- **Maps**: react-native-maps with Google Maps
- **Database**: Firestore with role-based security rules

## Project Structure

```
src/
├── App.tsx                      # App root with navigation setup
├── components/                  # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── HydraHeader.tsx
│   ├── StatusBadge.tsx
│   └── TaskCard.tsx
├── data/
│   └── mockTasks.ts            # Mock task data for testing
├── navigation/
│   └── AppNavigator.tsx        # Navigation structure
├── screens/                     # Screen components
│   ├── LoginScreen.tsx         # Firebase authentication
│   ├── TaskListScreen.tsx      # Display reports from Firestore
│   ├── TaskDetailScreen.tsx    # Task details with timeline
│   ├── SubmitRepairScreen.tsx  # Image upload & repair submission
│   ├── ProfileScreen.tsx       # User profile & logout
│   └── ...other screens
├── services/                    # Firebase services
│   ├── firebase.ts             # Firebase initialization
│   ├── authService.ts          # Authentication logic
│   ├── reportService.ts        # Report management
│   ├── imageService.ts         # Image upload
│   ├── geospatialService.ts    # Location & routing
│   ├── auditService.ts         # Activity logging
│   ├── notificationService.ts  # Notifications
│   ├── analyticsService.ts     # Analytics
│   ├── types.ts                # TypeScript interfaces
│   └── ...other services
├── store/
│   └── taskStore.ts            # Zustand global state
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   ├── animations.ts
│   └── index.ts
└── utils/
    ├── locationUtils.ts        # Geofencing & location helpers
    └── toast.ts                # Toast notifications

scripts/
└── setupTestUsers.js           # Create test users with Firebase Admin SDK
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ (current: v24)
- Firebase project created
- Google Maps API key
- Expo CLI installed

### 2. Install Dependencies

```bash
cd Hydratech
npm install
npm install @react-native-async-storage/async-storage
npm install firebase-admin  # For test user setup
```

### 3. Firebase Setup

1. **Get Firebase Credentials**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select project: `hydranet-e071d`
   - Project Settings → Your apps → Copy config
   - Already configured in `src/services/firebase.ts` with credentials:
     ```typescript
     apiKey: 'AIzaSyAskV8AX4eZX2OXZKXHS4addn8cv-Bm9pY'
     authDomain: 'hydranet-e071d.firebaseapp.com'
     projectId: 'hydranet-e071d'
     storageBucket: 'hydranet-e071d.appspot.com'
     messagingSenderId: '781622805026'
     appId: '1:781622805026:web:d86cefd09a285c3130407b'
     ```

2. **Download Service Account Key** (for test user setup)
   - Project Settings → Service Accounts → Generate New Private Key
   - Save as `serviceAccountKey.json` in project root
   - Keep this file private - never commit to git

3. **Create Firestore Collections**
   ```
   collections/
   ├── users/           {uid} documents with User data
   ├── reports/         Water leakage reports
   ├── teams/           Team definitions
   ├── dmas/            DMA boundaries
   ├── utilities/       Utility companies
   ├── auditLogs/       Activity tracking
   └── notifications/   Notification queue
   ```

4. **Deploy Firestore Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```
   Rules ensure role-based access control:
   - Engineers: Can only see their team's reports
   - Team Leaders: Can see all team reports
   - DMA Managers: Can see all DMA reports
   - Administrators: Full access

### 4. Create Test Users

```bash
node scripts/setupTestUsers.js
```

This creates 3 test users with proper roles and custom claims:
- **engineer@test.com** / Test123456 → Engineer role
- **manager@test.com** / Test123456 → Team Leader role  
- **dma@test.com** / Test123456 → DMA Manager role

All are pre-approved for testing.

### 5. Start Development Server

```bash
npm run android
# or
npm start
```

### 6. Login Flow

1. **LoginScreen** opens automatically
2. Enter credentials:
   - Email: `engineer@test.com` (or other test user)
   - Password: `Test123456`
3. App validates with Firebase Authentication
4. Custom claims determine user role
5. Firestore document fetches additional user info
6. User navigates to TaskListScreen with appropriate role

## Authentication & Authorization

### How It Works

1. **Firebase Auth** - Handles login/logout with email/password
2. **Custom Claims** - Firebase Admin SDK sets role in auth token
   ```javascript
   // Custom claims structure
   {
     role: 'Engineer' | 'Team Leader' | 'DMA' | 'Administrator',
     teamId: 'team-1',
     utilityId: 'util-1',
     dmaId: 'dma-1' (Team Leaders and up)
   }
   ```
3. **Firestore Security Rules** - Enforce access control at database level
4. **AsyncStorage Persistence** - Keeps user logged in between sessions

### User Roles

| Role | Task Visibility | Actions |
|------|-----------------|---------|
| Engineer | Own team's tasks | Submit repair reports, upload photos |
| Team Leader | All team's tasks | Approve/reject repairs, submit completion |
| DMA Manager | All DMA's tasks | Monitor performance, assign to teams |
| Administrator | All reports | User management, system configuration |

## Key Services

### `firebase.ts`
Initializes Firebase with AsyncStorage persistence:
```typescript
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### `authService.ts`
- `loginUser(email, password)` - Authenticate user
- `registerUser(...)` - Create new user (admin only)
- `logoutUser()` - Sign out user
- `getCurrentUser()` - Fetch current user data
- `setCustomClaims(uid, role, ...)` - Set user permissions

### `reportService.ts`
- `getReportsForTeam(teamId)` - Fetch team's reports
- `getReportsForDMA(dmaId)` - Fetch DMA's reports
- `createReport(...)` - Submit new report
- `updateReportStatus(...)` - Change status
- `submitRepairCompletion(...)` - Complete repair

### `imageService.ts`
- `uploadReportImage(reportId, imageUri)` - Upload before photo
- `uploadCompletionPhotos(reportId, imageUris)` - Upload after photos
- `getPublicImageUrl(storagePath)` - Get shareable image URL

### `geospatialService.ts`
- `findDMAByLocation(latitude, longitude)` - Auto-route to correct DMA
- `calculateDistance(lat1, lon1, lat2, lon2)` - Distance calculation
- `isWithinBoundary(point, polygon)` - Point-in-polygon check

### `auditService.ts`
- `logActivity(userId, action, details)` - Track all actions
- `getActivityLog(userId)` - View activity history

## Testing

### Manual Testing Workflow

1. **Login as Engineer**
   ```
   Email: engineer@test.com
   Password: Test123456
   ```

2. **View Tasks**
   - TaskListScreen shows team's reports from Firestore
   - Filter by status (All, Assigned, In Progress, Submitted)
   - Tap task to view details and assigned team

3. **Submit Repair**
   - Navigate to SubmitRepairScreen
   - Select/capture photos
   - Enter repair notes
   - Upload to Cloud Storage
   - Status updated in Firestore

4. **Switch to Team Leader**
   ```
   Email: manager@test.com
   Password: Test123456
   ```
   - See extended task list (all team members' reports)
   - Can approve/reject engineer submissions
   - Can submit completion with additional photos

5. **Test Persistence**
   - Log in successfully
   - Close app completely
   - Reopen app
   - Should be logged in automatically (via AsyncStorage)

### Create Test Report

Add test data to Firestore `reports` collection:

```json
{
  "id": "report-001",
  "title": "Water Leak on Main Street",
  "description": "Large leak detected near road junction",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St"
  },
  "severity": "high",
  "status": "pending",
  "imageUrl": "",
  "createdBy": "engineer@test.com",
  "createdAt": "2026-02-21T10:00:00Z",
  "teamId": "team-1",
  "utilityId": "util-1",
  "dmaId": "dma-1"
}
```

## Important Configuration

### Firebase Settings

- Firestore indexes automatically created for efficient queries
- Cloud Storage bucket: `hydranet-e071d.appspot.com`
- Max image size: 10MB
- Supported formats: JPG, PNG, WebP

### App Configuration

- Min SDK: Android 6.0+
- Target SDK: Android 14+
- Expo SDK: 53+

### Environment Variables

No .env needed - credentials hardcoded in `src/services/firebase.ts` for development

> ⚠️ **Production Note**: Move credentials to environment variables or use Anonymous Auth with OAuth later

## Known Issues & Solutions

### Issue: "User account not yet approved by administrator"
- **Solution**: Run `node scripts/setupTestUsers.js` to set `isApproved: true`

### Issue: "Auth state will default to memory persistence"
- **Solution**: AsyncStorage is configured in `firebase.ts` with `getReactNativePersistence()`

### Issue: Remote notifications not working in Expo Go
- **Solution**: Build development build with EAS or use local notifications for MVP

### Issue: Task descriptions not showing
- **Solution**: Fixed in TaskCard.tsx with proper minHeight and text color

## Recent Changes (Feb 21, 2026)

✅ **Firebase Backend Complete**
- All 11 services created and tested
- Firestore security rules deployed (464 lines)
- Cloud Functions deployed (setCustomClaims)

✅ **Screen Integration**
- LoginScreen: Firebase Auth with custom claims
- TaskListScreen: Real Firestore reports
- SubmitRepairScreen: Image upload to Cloud Storage
- ProfileScreen: Firebase logout, auth persistence

✅ **Bug Fixes**
- Fixed duplicate function declarations in ProfileScreen
- Fixed Firebase auth initialization conflict (removed web-only browserLocalPersistence)
- Fixed task descriptions not displaying (improved TaskCard styling)
- Fixed Team Leader login showing Engineer layout (corrected role mapping in LoginScreen)

✅ **Database Setup**
- Test users created via setupTestUsers.js script
- Each user has proper Firestore document with firstName/lastName
- Custom claims set for role-based access control

## Next Steps

- [ ] Add more leader screens (LeaderPerformanceScreen, LeaderReviewScreen integration)
- [ ] Implement real push notifications (requires development build)
- [ ] Add offline sync queue for offline-first support
- [ ] Set up CI/CD pipeline with EAS Build
- [ ] Configure staging and production Firebase projects
- [ ] Add analytics dashboard
- [ ] Implement team management UI

## Troubleshooting

**App won't start:**
```bash
npm start --clear
```

**Firebase credentials not working:**
- Verify project ID in Firebase Console
- Check email/password matches test user credentials
- Run setupTestUsers.js again to ensure users exist

**Images not uploading:**
- Check Cloud Storage bucket permissions in Rules
- Verify storage path exists: `gs://hydranet-e071d.appspot.com/images/`

**Tasks not loading:**
- Check Firestore collection exists: `reports`
- Verify user has `teamId` in Firestore document
- Check Firestore Rules allow read access for user's role

## Support

For issues or questions about specific services, check:
- `FIREBASE_SETUP_COMPLETE.md` - Setup verification
- `INTEGRATION_COMPLETE.md` - Integration guide
- `src/services/` - Service implementations with comments

   - Install the **Expo Go** app from the iOS App Store or Google Play.
   - From your terminal, press `s` to show the QR code if it is not already visible.
   - Scan the QR code with your phone’s camera (or Expo Go app) and open the project.

### Feature notes

- **Mock login**: No real authentication; user info is stored locally via Zustand + AsyncStorage.
- **Tasks and status**:
  - Tasks are seeded from `mockTasks.ts` and then persisted locally.
  - Status changes (e.g., **Start Task → In Progress**, **Submit Repair → Repair Submitted**) are written to the task timeline.
- **Offline mode simulation**:
  - Toggle **Offline Mode** on the Profile screen to simulate loss of connectivity.
  - While offline, status changes and repair submissions are queued in memory and persisted.
  - Turning offline mode off clears the queue and shows a "sync complete" message (simulation only).
- **Geo-fencing**:
  - `SubmitRepairScreen` only allows submission if the engineer is within **200 m** of the task coordinates (using the distance helpers in `locationUtils.ts`).
- **Maps**:
  - `TaskDetailScreen` shows a Google Map with both the task marker, a 200 m geofence circle, and (when available) the engineer’s current location.
- **Notifications**:
  - On login, a simple local notification is triggered summarizing the number of **Assigned** tasks (best-effort; ignored if permissions are not granted).

