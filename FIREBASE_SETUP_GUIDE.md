# HydraNet Firebase Backend Setup Guide

## Overview

HydraNet is a hierarchical, geo-governed water leakage reporting and management system. This guide walks you through setting up the complete Firebase backend infrastructure.

## System Hierarchy

```
Administrator (System Level)
├── Utility Manager (Utility Level)
│   ├── DMA Manager (Operational Level)
│   │   ├── Branch
│   │   │   ├── Team
│   │   │   │   ├── Team Leader
│   │   │   │   └── Engineers
Public (Anonymous Reporters)
```

## Part 1: Firebase Project Setup

### Step 1.1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: `HydraNet`
4. Accept the terms and create

### Step 1.2: Enable Required Services

**Firestore Database:**
- Go to Firestore Database
- Click "Create database"
- Select "Start in test mode" (switch to production rules later)
- Choose a region close to your users
- Enable

**Authentication:**
- Go to Authentication
- Click "Get started"
- Enable "Email/Password" provider

**Cloud Storage:**
- Go to Storage
- Click "Get started"
- Accept default settings

### Step 1.3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Create web app" (even for mobile app)
4. Copy the config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

5. Replace the placeholder values in `src/services/firebase.ts` with your actual credentials

## Part 2: Firestore Database Setup

### Step 2.1: Create Collections

The system uses the following Firestore collections:

```
utilities/
├── {utilityId}
│   ├── name, code, geoBoundary, etc.

dmas/
├── {dmaId}
│   ├── name, code, utilityId, geoBoundary, etc.

branches/
├── {branchId}
│   ├── name, dmaId, utilityId, etc.

teams/
├── {teamId}
│   ├── name, teamLeaderId, members, dmaId, etc.

users/
├── {userId}
│   ├── email, firstName, role, utilityId, dmaId, etc.

reports/
├── {reportId}
│   ├── description, status, priority, images, location, etc.
│   └── activities/ (subcollection)
│       └── {activityId}

submissions/
├── {submissionId}
│   ├── reportId, beforeImages, afterImages, status, etc.

auditLogs/
├── {logId}
│   ├── action, userId, timestamp, details, etc.

notifications/
├── {notificationId}
│   ├── recipientId, type, message, isRead, etc.

teamMetrics/
├── {teamId-YYYY-MM}
│   ├── performanceScore, tasksCompleted, etc.

dmaMetrics/
├── {dmaId-YYYY-MM}
│   ├── performanceScore, reportsResolved, etc.
```

### Step 2.2: Apply Security Rules

1. Go to Firestore Database > Rules
2. Replace all content with the rules from `firestore.rules`
3. Publish

## Part 3: Firebase Storage Setup

### Step 3.1: Storage Structure

Firebase Storage uses this folder structure:

```
gs://YOUR_PROJECT_ID.appspot.com/
├── reports/
│   └── {reportId}/
│       └── images
├── submissions/
│   └── {submissionId}/
│       ├── before/
│       └── after/
├── profiles/
│   └── {userId}/
│       └── photo.jpg
```

### Step 3.2: Configure Storage Security

1. Go to Storage > Rules
2. Replace with appropriate storage rules from `firestore.rules`
3. Publish

## Part 4: Cloud Functions (Backend Logic)

You'll need to deploy Cloud Functions for:
- Setting custom JWT claims for security rules
- Calculating metrics
- Sending notifications
- Automated report routing

### Step 4.1: Initialize Cloud Functions

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### Step 4.2: Deploy Essential Functions

Create a `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

// Set custom claims for user
exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  try {
    await auth.setCustomUserClaims(data.userId, {
      role: data.role,
      utilityId: data.utilityId,
      dmaId: data.dmaId,
      teamId: data.teamId,
    });
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Approve user (triggers when admin approves)
exports.approveUser = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // If isApproved changed from false to true
    if (!before.isApproved && after.isApproved) {
      try {
        await auth.setCustomUserClaims(context.params.userId, {
          role: after.role,
          utilityId: after.utilityId,
          dmaId: after.dmaId,
          teamId: after.teamId,
          approved: true,
        });
      } catch (error) {
        console.error('Error setting claims:', error);
      }
    }
  });

// Auto-route unassigned reports to administrators
exports.routeUnassignedReports = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap, context) => {
    const report = snap.data();
    
    if (report.dmaId === 'UNASSIGNED') {
      // Get admin users
      const admins = await db.collection('users')
        .where('role', '==', 'Administrator')
        .get();

      // Create notifications for each admin
      const batch = db.batch();
      for (const admin of admins.docs) {
        const notifRef = db.collection('notifications').doc();
        batch.set(notifRef, {
          recipientId: admin.id,
          type: 'ESCALATION',
          reportId: report.id,
          message: `Unassigned report: ${report.description}`,
          isRead: false,
          createdAt: admin.firestore.Timestamp.now(),
        });
      }
      await batch.commit();
    }
  });

// Generate monthly metrics
exports.generateMonthlyMetrics = functions.pubsub
  .schedule('0 0 1 * *') // Run at midnight on first day of month
  .onRun(async (context) => {
    // Get all teams and calculate metrics
    const teams = await db.collection('teams').get();
    
    for (const teamDoc of teams.docs) {
      // Call calculateTeamMetrics from analyticsService
      console.log('Metrics calculated for team:', teamDoc.id);
    }
    
    return null;
  });
```

Deploy with:
```bash
firebase deploy --only functions
```

## Part 5: Integrating Services in Your React Native App

### Step 5.1: Update package.json

```bash
npm install firebase expo-file-system
```

### Step 5.2: Public Report Submission Example

```typescript
import { submitLeakageReport } from './services';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export async function submitReport() {
  try {
    // Get location
    const location = await Location.getCurrentPositionAsync({});
    
    // Pick images
    const images = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultiple: true,
      selectionLimit: 4,
    });

    // Upload images first
    const imageUrls = [];
    for (const image of images.assets) {
      const url = await uploadReportImage('temp', image.uri);
      imageUrls.push(url);
    }

    // Submit report
    const report = await submitLeakageReport(
      'Water leaking at main junction',
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      'High',
      'BurstPipeline',
      imageUrls
    );

    console.log('Report submitted:', report.trackingId);
  } catch (error) {
    console.error('Error submitting report:', error);
  }
}
```

### Step 5.3: Team Leader Submission Example

```typescript
import { submitRepairCompletion } from './services';
import { useTaskStore } from './store/taskStore';

export async function submitTeamRepair(
  reportId: string,
  beforeImageUris: string[],
  afterImageUris: string[],
  notes: string
) {
  try {
    const user = useTaskStore(state => state.currentUser);
    
    // Upload images
    const beforeUrls = await Promise.all(
      beforeImageUris.map(uri => 
        uploadSubmissionImage(reportId, uri, 'before')
      )
    );
    
    const afterUrls = await Promise.all(
      afterImageUris.map(uri => 
        uploadSubmissionImage(reportId, uri, 'after')
      )
    );

    // Submit repair
    await submitRepairCompletion(
      reportId,
      user!.id,
      user!.teamId!,
      beforeUrls,
      afterUrls,
      notes,
      ['part1', 'part2'] // materials used
    );

    console.log('Repair submitted for approval');
  } catch (error) {
    console.error('Error submitting repair:', error);
  }
}
```

### Step 5.4: Manager Approval Example

```typescript
import { approveRepairSubmission } from './services';

export async function approveRepair(submissionId: string, notes: string) {
  try {
    const user = useTaskStore(state => state.currentUser);
    
    await approveRepairSubmission(
      submissionId,
      notes,
      user!.id
    );

    console.log('Repair approved');
  } catch (error) {
    console.error('Error approving repair:', error);
  }
}
```

## Part 6: Geospatial Data Setup

### Step 6.1: Define Utility Boundaries

Add to Firestore `utilities` collection:

```typescript
{
  id: "utility-001",
  name: "City Water Authority",
  code: "CWA",
  country: "Country Name",
  state: "State Name",
  geoBoundary: {
    type: "Polygon",
    coordinates: [[[lon, lat], [lon, lat], ...]] // GeoJSON format
  },
  isActive: true
}
```

### Step 6.2: Define DMA Boundaries

Add to Firestore `dmas` collection:

```typescript
{
  id: "dma-001",
  utilityId: "utility-001",
  name: "Central District",
  code: "DMA-001",
  geoBoundary: {
    type: "Polygon",
    coordinates: [[[lon, lat], [lon, lat], ...]]
  },
  isActive: true
}
```

**Tools to create GeoJSON boundaries:**
- [geojson.io](https://geojson.io)
- [Mapbox Draw](https://labs.mapbox.com/drawing-tool/)
- Google Maps API

## Part 7: User Registration Flow

### Step 7.1: Admin Creates Utility Manager

```typescript
import { registerUser } from './services';

await registerUser(
  'manager@email.com',
  'secure_password',
  {
    firstName: 'John',
    lastName: 'Manager',
    role: 'UtilityManager',
    utilityId: 'utility-001',
    isApproved: false // Admin must approve
  }
);
```

### Step 7.2: Admin Approves User

```typescript
import { approveUser } from './services';

await approveUser(userId);
```

### Step 7.3: User Logs In

```typescript
import { loginUser } from './services';

const user = await loginUser('manager@email.com', 'secure_password');
```

## Part 8: Testing & Deployment

### Step 8.1: Testing

1. **Test public reporting** - No authentication needed
2. **Test authentication** - Manager/Engineer login
3. **Test geospatial routing** - Reports go to correct DMA
4. **Test approval workflow** - Full task lifecycle
5. **Test image uploads** - Large files, multiple formats

### Step 8.2: Deploy to Production

1. **Switch Firebase to Production Rules:**
   - Update firestore.rules with production settings
   - Deploy rules

2. **Enable CORS for Storage:**
   ```bash
   gsutil cors set cors.json gs://YOUR_PROJECT_ID.appspot.com
   ```

3. **Set up backups:**
   - Enable daily backups in Firestore
   - Set up monitoring alerts

4. **Configure App Check** (optional but recommended):
   - Go to App Check in Firebase Console
   - Enable for both mobile and web apps

## Part 9: Monitoring & Maintenance

### Step 9.1: Set Up Monitoring

1. Go to Firebase Console > Analytics
2. Monitor:
   - Active users
   - Report submission rate
   - Average resolution time
   - Error rates

### Step 9.2: Performance Optimization

- Create indexes for common queries
- Use real-time listeners sparingly
- Cache frequently accessed data
- Implement pagination for large result sets

### Step 9.3: Backup Strategy

- Daily Firestore backups
- Storage bucket versioning
- Document version history for audit

## Part 10: Troubleshooting

### Issue: "Permission denied" errors

**Solution:**
- Check security rules are deployed
- Verify custom claims are set on user
- Ensure user role matches access level

### Issue: Images not uploading

**Solution:**
- Check Storage rules allow uploads
- Verify image size < 10MB
- Check network connectivity

### Issue: Slow queries

**Solution:**
- Create composite indexes
- Use pagination
- Limit subcollection queries

### Issue: Notifications not arriving

**Solution:**
- Verify notification service is enabled
- Check user notification permissions
- Test with Expo Notifications API

## Part 11: Security Checklist

- [ ] Firebase credentials not committed to git
- [ ] Security rules tested thoroughly
- [ ] HTTPS enforced for all connections
- [ ] Sensitive data is not logged
- [ ] Rate limiting implemented
- [ ] Input validation on all APIs
- [ ] Regular security audits scheduled
- [ ] Backups tested and verified
- [ ] Admin access properly restricted
- [ ] Audit logs are immutable and comprehensive

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Best Practices](https://firebase.google.com/docs/functions)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [GeoJSON Specification](https://tools.ietf.org/html/rfc7946)

---

**Next Steps:**
1. Set up Firebase project following Part 1
2. Add GeoJSON boundaries from Part 6
3. Deploy Cloud Functions from Part 4
4. Test with public report submission from Part 5
5. Create admin user and test full workflow
