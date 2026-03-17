# HydraNet Firebase Backend - Quick Reference

## Project Structure

```
src/services/
├── firebase.ts                 # Firebase configuration
├── types.ts                    # All TypeScript interfaces
├── authService.ts             # User authentication
├── reportService.ts           # Report submission & task management
├── geospatialService.ts       # Location-based routing
├── imageUploadService.ts      # Image uploads to Storage
├── auditService.ts            # Audit logging
├── notificationService.ts     # Notifications
├── analyticsService.ts        # Performance metrics
├── index.ts                   # Services export
└── integration-examples.ts    # Usage examples

Root:
├── FIREBASE_SETUP_GUIDE.md    # Complete setup instructions
├── firestore.rules            # Firestore security rules
├── functions-template.js      # Cloud Functions template
└── FIREBASE_BACKEND_QUICK_REFERENCE.md  # This file
```

## Quick Start

### 1. Initialize Firebase in App

```typescript
// App.tsx or index.ts
import { auth, db, storage } from './services/firebase';
import { RootApp } from './App';

export default RootApp;
```

### 2. User Registration (Admin Only)

```typescript
import { registerUser, approveUser } from './services';

// Admin creates user
const userId = await registerUser(
  'engineer@email.com',
  'password123',
  {
    firstName: 'John',
    lastName: 'Engineer',
    role: 'Engineer',
    dmaId: 'dma-001',
    branchId: 'branch-001',
    teamId: 'team-001',
    isApproved: false
  }
);

// Admin approves user
await approveUser(userId);
```

### 3. User Login

```typescript
import { loginUser } from './services';

const user = await loginUser('engineer@email.com', 'password123');
```

### 4. Public Report Submission

```typescript
import { submitLeakageReport, uploadReportImage } from './services';
import * as Location from 'expo-location';

// Get location
const location = await Location.getCurrentPositionAsync({});

// Upload images
const imageUrls = await Promise.all(
  selectedImages.map(img => uploadReportImage('temp', img.uri))
);

// Submit report
const report = await submitLeakageReport(
  'Water leaking at main junction',
  {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  },
  'High',
  'BurstPipeline',
  imageUrls
);

console.log('Tracking ID:', report.trackingId);
```

### 5. Manager Tasks

```typescript
import { 
  getReportsForDMA, 
  assignReportToTeam,
  approveRepairSubmission 
} from './services';

// View reports
const reports = await getReportsForDMA('dma-001');

// Assign report
await assignReportToTeam(
  reportId, 
  'team-001', 
  'team-leader-001',
  userId
);

// Approve repair
await approveRepairSubmission(
  submissionId,
  'Work looks good',
  userId
);
```

### 6. Team Leader Tasks

```typescript
import { 
  updateReportStatus,
  submitRepairCompletion,
  uploadSubmissionImage 
} from './services';

// Update status
await updateReportStatus(reportId, 'InProgress', userId);

// Upload before/after images
const beforeUrls = await Promise.all(
  beforeImages.map(img => uploadSubmissionImage(reportId, img, 'before'))
);
const afterUrls = await Promise.all(
  afterImages.map(img => uploadSubmissionImage(reportId, img, 'after'))
);

// Submit repair
await submitRepairCompletion(
  reportId,
  userId,
  teamId,
  beforeUrls,
  afterUrls,
  'Pipe replaced and tested successfully',
  ['PVC Pipe', 'Coupling', 'Sealant']
);
```

## Common Operations

### Get Current User
```typescript
import { getCurrentUser } from './services';
const user = await getCurrentUser();
```

### Get Assigned Tasks (for Team)
```typescript
import { getReportsForTeam } from './services';
const tasks = await getReportsForTeam(teamId);
```

### Get DMA Reports (for Manager)
```typescript
import { getReportsForDMA } from './services';
const reports = await getReportsForDMA(dmaId);
```

### View Performance Dashboard
```typescript
import { getTeamPerformanceDashboard } from './services';
const dashboard = await getTeamPerformanceDashboard(teamId);
```

### Get Analytics
```typescript
import { getUtilityAnalytics } from './services';
const analytics = await getUtilityAnalytics(utilityId);
```

## Data Models

### User Roles
- `Administrator` - System level oversight
- `UtilityManager` - Utility level management
- `DMAManager` - DMA operational control
- `Engineer` - Field worker
- `TeamLeader` - Engineer leading team

### Report Status Flow
```
New → Assigned → InProgress → RepairSubmitted → Approved → Closed
                                            ↘ Rejected ↗
```

### Report Priority
- `Critical` - Urgent, major water loss
- `High` - Significant impact
- `Medium` - Moderate impact
- `Low` - Minor issue

### Report Type
- `BurstPipeline` - Pipeline burst
- `DistributionFailure` - Network failure
- `SurfaceDamage` - Surface infrastructure damage
- `Other` - Other types

## Error Handling

```typescript
try {
  const report = await submitLeakageReport(...);
} catch (error) {
  if (error.code === 'permission-denied') {
    console.log('No permission for this action');
  } else if (error.code === 'not-found') {
    console.log('Resource not found');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Permissions by Role

| Action | Admin | Util Mgr | DMA Mgr | Engineer | Team Leader |
|--------|-------|----------|---------|----------|-------------|
| Create Report | ✓ | - | - | ✓ | ✓ |
| View Own Reports | ✓ | - | - | ✓ | ✓ |
| Assign Report | ✓ | - | ✓ | - | - |
| Submit Repair | - | - | - | - | ✓ |
| Approve Repair | ✓ | - | ✓ | - | - |
| View Analytics | ✓ | ✓ | ✓ | - | - |
| Manage Users | ✓ | - | ✓ | - | - |

## Image Upload Limits

- Max file size: 10MB
- Max images per report: 4
- Max images per submission: 8 (4 before + 4 after)
- Supported formats: JPG, PNG, WebP
- Recommended size: 1024x1024 or larger

## Real-time Updates

### Subscribe to Notifications
```typescript
import { subscribeToNotifications } from './services';

const unsubscribe = subscribeToNotifications(userId, (notification) => {
  console.log('New notification:', notification.title);
});

// Cleanup
unsubscribe();
```

## Testing the Backend

### Test Public Report
1. No login required
2. Enable location Services
3. Select 1-4 images
4. Submit report
5. Check console for tracking ID

### Test Manager Workflow
1. Login as DMA Manager
2. View unassigned reports
3. Assign to a team
4. Team receives notification

### Test Team Workflow
1. Login as Team Leader
2. View assigned reports
3. Update status to In Progress
4. Upload before/after images
5. Submit repair completion

### Test Approval
1. Login as DMA Manager
2. View submitted repairs
3. Review images and notes
4. Approve or reject

## Common Issues & Solutions

### "Permission denied" Error
- Verify user is approved
- Check security rules are deployed
- Ensure custom claims are set
- Check DMA/Utility ID matches

### Images Not Uploading
- Check file size < 10MB
- Verify CORS is configured
- Check network connectivity
- Verify storage rules allow uploads

### Notifications Not Arriving
- Check notification service is enabled
- Verify user permissions for notifications
- Test with local notifications first
- Check Expo Notifications setup

### Geospatial Routing Issues
- Verify GeoJSON polygons are valid
- Check coordinates are in correct format [lon, lat]
- Ensure DMA boundaries don't overlap
- Verify utilities are active

## Performance Tips

1. **Limit Queries**: Use pagination for large datasets
2. **Cache Data**: Store frequently accessed data locally
3. **Use Indexes**: Firestore will suggest indexes
4. **Batch Operations**: Use batch writes for multiple updates
5. **Optimize Images**: Compress before upload
6. **Lazy Load**: Load report details on demand

## Deployment Checklist

- [ ] Firebase credentials in environment file
- [ ] Security rules tested in staging
- [ ] Cloud Functions deployed
- [ ] Geospatial boundaries loaded
- [ ] Test user accounts created
- [ ] Notifications configured
- [ ] Backups enabled
- [ ] Monitoring alerts set up
- [ ] Error logging configured
- [ ] Rate limiting implemented

## Support Resources

- Service Documentation: [Firebase Documentation](https://firebase.google.com/docs)
- Type Definitions: `src/services/types.ts`
- Integration Examples: `src/services/integration-examples.ts`
- Setup Guide: `FIREBASE_SETUP_GUIDE.md`
- Cloud Functions: `functions-template.js`

## Key Endpoints/Collections

```
/utilities/{utilityId}
/dmas/{dmaId}
/branches/{branchId}
/teams/{teamId}
/users/{userId}
/reports/{reportId}
/reports/{reportId}/activities/{activityId}
/submissions/{submissionId}
/auditLogs/{logId}
/notifications/{notificationId}
/teamMetrics/{teamId-YYYY-MM}
/dmaMetrics/{dmaId-YYYY-MM}
```

## Next Steps

1. Setup Firebase project (see FIREBASE_SETUP_GUIDE.md)
2. Update `src/services/firebase.ts` with your credentials
3. Deploy Cloud Functions (`functions-template.js`)
4. Load geospatial boundaries
5. Create test users
6. Test public report submission
7. Test manager workflow
8. Test team submission workflow
9. Deploy to production
10. Monitor analytics dashboard

---

Last Updated: 2026-02-18
Version: 1.0.0
Status: Production Ready
